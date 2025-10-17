import { supabase } from './supabaseClient';
import { UpgradeRequest, UpgradeRequestStatus } from '../types';
import { featureFlagsService } from './featureFlagsService';

export const upgradeRequestService = {
    // ==========================================
    // User Functions
    // ==========================================

    /**
     * Create a new upgrade request
     */
    async createUpgradeRequest(userId: string, requestedPlan: 'pro' | 'enterprise' = 'pro'): Promise<UpgradeRequest> {
        // Check if user already has a pending request
        const { data: existingRequest, error: checkError } = await supabase
            .from('upgrade_requests')
            .select('id, status')
            .eq('user_id', userId)
            .eq('status', UpgradeRequestStatus.PENDING)
            .maybeSingle(); // Use maybeSingle instead of single to avoid PGRST116 error

        if (checkError) {
            throw checkError;
        }

        if (existingRequest) {
            throw new Error('You already have a pending upgrade request');
        }

        // Create new request
        const { data, error } = await supabase
            .from('upgrade_requests')
            .insert({
                user_id: userId,
                requested_plan: requestedPlan,
                status: UpgradeRequestStatus.PENDING
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get user's upgrade requests
     */
    async getUserUpgradeRequests(userId: string): Promise<UpgradeRequest[]> {
        const { data, error } = await supabase
            .from('upgrade_requests')
            .select('*')
            .eq('user_id', userId)
            .order('requested_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Check if user has a pending request
     */
    async hasPendingRequest(userId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('upgrade_requests')
            .select('id')
            .eq('user_id', userId)
            .eq('status', UpgradeRequestStatus.PENDING)
            .maybeSingle(); // Use maybeSingle to handle zero or one row

        if (error) {
            console.error('Error checking pending request:', error);
            return false;
        }

        return !!data;
    },

    // ==========================================
    // Admin Functions
    // ==========================================

    /**
     * Get all upgrade requests (admin only)
     */
    async getAllUpgradeRequests(status?: UpgradeRequestStatus): Promise<UpgradeRequest[]> {
        let query = supabase
            .from('upgrade_requests')
            .select('*')
            .order('requested_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Get user emails
        const requests = data || [];
        const userIds = [...new Set(requests.map(r => r.user_id))];

        // Fetch profiles for emails
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, email')
            .in('id', userIds);

        // Map emails to requests
        return requests.map(request => ({
            ...request,
            user_email: profiles?.find(p => p.id === request.user_id)?.email || 'Unknown'
        }));
    },

    /**
     * Get pending upgrade requests count (admin only)
     */
    async getPendingRequestsCount(): Promise<number> {
        const { count, error } = await supabase
            .from('upgrade_requests')
            .select('id', { count: 'exact', head: true })
            .eq('status', UpgradeRequestStatus.PENDING);

        if (error) {
            console.error('Error getting pending requests count:', error);
            return 0;
        }

        return count || 0;
    },

    /**
     * Approve an upgrade request (admin only)
     */
    async approveUpgradeRequest(
        requestId: string,
        adminId: string,
        durationMonths: number = 1,
        adminNotes?: string
    ): Promise<void> {
        // Get the request
        const { data: request, error: fetchError } = await supabase
            .from('upgrade_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (fetchError) throw fetchError;
        if (!request) throw new Error('Request not found');

        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

        // Update request status
        const { error: updateError } = await supabase
            .from('upgrade_requests')
            .update({
                status: UpgradeRequestStatus.APPROVED,
                reviewed_at: new Date().toISOString(),
                reviewed_by: adminId,
                expires_at: expiresAt.toISOString(),
                admin_notes: adminNotes || `Approved for ${durationMonths} month(s)`
            })
            .eq('id', requestId);

        if (updateError) throw updateError;

        // Grant the plan features
        await featureFlagsService.grantPlan(
            request.user_id,
            request.requested_plan,
            adminId,
            expiresAt.toISOString()
        );

        // Log admin action
        await featureFlagsService.logAdminAction(
            adminId,
            'approve_upgrade_request',
            request.user_id,
            { request_id: requestId, plan: request.requested_plan, expires_at: expiresAt.toISOString() }
        );
    },

    /**
     * Reject an upgrade request (admin only)
     */
    async rejectUpgradeRequest(
        requestId: string,
        adminId: string,
        adminNotes?: string
    ): Promise<void> {
        const { data: request, error: fetchError } = await supabase
            .from('upgrade_requests')
            .select('user_id')
            .eq('id', requestId)
            .single();

        if (fetchError) throw fetchError;

        const { error } = await supabase
            .from('upgrade_requests')
            .update({
                status: UpgradeRequestStatus.REJECTED,
                reviewed_at: new Date().toISOString(),
                reviewed_by: adminId,
                admin_notes: adminNotes || 'Request rejected'
            })
            .eq('id', requestId);

        if (error) throw error;

        // Log admin action
        await featureFlagsService.logAdminAction(
            adminId,
            'reject_upgrade_request',
            request?.user_id,
            { request_id: requestId, reason: adminNotes }
        );
    },

    /**
     * Extend an approved request's expiration (admin only)
     */
    async extendUpgradeRequest(
        requestId: string,
        adminId: string,
        additionalMonths: number = 1,
        adminNotes?: string
    ): Promise<void> {
        const { data: request, error: fetchError } = await supabase
            .from('upgrade_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (fetchError) throw fetchError;
        if (!request) throw new Error('Request not found');

        // Calculate new expiration date
        const currentExpiry = request.expires_at ? new Date(request.expires_at) : new Date();
        currentExpiry.setMonth(currentExpiry.getMonth() + additionalMonths);

        const { error } = await supabase
            .from('upgrade_requests')
            .update({
                expires_at: currentExpiry.toISOString(),
                admin_notes: adminNotes || `Extended by ${additionalMonths} month(s)`
            })
            .eq('id', requestId);

        if (error) throw error;

        // Update feature expiration
        await supabase
            .from('user_features')
            .update({ expires_at: currentExpiry.toISOString() })
            .eq('user_id', request.user_id);

        // Log admin action
        await featureFlagsService.logAdminAction(
            adminId,
            'extend_upgrade_request',
            request.user_id,
            { request_id: requestId, new_expiry: currentExpiry.toISOString() }
        );
    },

    /**
     * Check and expire old requests (should be run periodically)
     */
    async checkAndExpireRequests(): Promise<number> {
        const { error } = await supabase.rpc('check_expired_upgrade_requests');

        if (error) {
            console.error('Error checking expired requests:', error);
            return 0;
        }

        // Get count of expired requests
        const { count } = await supabase
            .from('upgrade_requests')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'expired')
            .gte('updated_at', new Date(Date.now() - 60000).toISOString()); // Last minute

        return count || 0;
    }
};
