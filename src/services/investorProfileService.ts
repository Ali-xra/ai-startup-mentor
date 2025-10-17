// ==========================================
// Investor Profile Service
// ==========================================

import { supabase } from './supabaseClient';
import type {
  InvestorProfile,
  UserProfile,
  VerificationRequest,
  InvestorVerificationData,
  InvestorDashboardStats
} from '../types/investor';

export const investorProfileService = {
  // ==========================================
  // Investor Profile Management
  // ==========================================

  /**
   * ایجاد پروفایل سرمایه‌گذار جدید
   */
  async createInvestorProfile(data: Partial<InvestorProfile>): Promise<InvestorProfile> {
    const { data: profile, error } = await supabase
      .from('investor_profiles')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  /**
   * گرفتن پروفایل سرمایه‌گذار بر اساس user_id
   */
  async getInvestorProfile(userId: string): Promise<InvestorProfile | null> {
    const { data, error } = await supabase
      .from('investor_profiles')
      .select('*')
      .eq('id', userId)  // تغییر از user_id به id
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  /**
   * آپدیت پروفایل سرمایه‌گذار
   */
  async updateInvestorProfile(
    userId: string,
    updates: Partial<InvestorProfile>
  ): Promise<InvestorProfile> {
    const { data, error } = await supabase
      .from('investor_profiles')
      .update(updates)
      .eq('id', userId)  // تغییر از user_id به id
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ==========================================
  // User Profile Management
  // ==========================================

  /**
   * ایجاد/آپدیت User Profile (توی جدول profiles)
   */
  async upsertUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert([{ id: userId, ...data }])
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  /**
   * گرفتن User Profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // ==========================================
  // Verification
  // ==========================================

  /**
   * ارسال درخواست Verification
   */
  async requestVerification(
    userId: string,
    verificationData: InvestorVerificationData
  ): Promise<VerificationRequest> {
    const { data, error } = await supabase
      .from('verification_requests')
      .insert([{
        user_id: userId,
        request_type: 'investor_verification',
        submitted_data: verificationData,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * چک کردن وضعیت درخواست Verification
   */
  async getVerificationStatus(userId: string): Promise<VerificationRequest | null> {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('request_type', 'investor_verification')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /**
   * گرفتن تمام درخواست‌های Verification یک کاربر
   */
  async getAllVerificationRequests(userId: string): Promise<VerificationRequest[]> {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ==========================================
  // Limits & Restrictions
  // ==========================================

  /**
   * چک کردن محدودیت بازدید Free tier
   * @returns true اگر کاربر میتونه پروژه رو ببینه، false در غیر اینصورت
   */
  async checkViewLimit(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('check_investor_view_limit', {
        p_investor_id: userId
      });

    if (error) throw error;
    return data;
  },

  /**
   * گرفتن باقیمانده بازدیدهای ماهانه
   */
  async getRemainingViews(userId: string): Promise<number> {
    const profile = await this.getInvestorProfile(userId);
    if (!profile) return 0;

    // اگر Verified یا Premium باشه، محدودیتی نداره
    if (profile.tier === 'verified' || profile.tier === 'premium') {
      return -1; // unlimited
    }

    // ریست کردن در صورت نیاز (اول ماه)
    const lastReset = new Date(profile.last_view_reset);
    const now = new Date();
    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
      await this.updateInvestorProfile(userId, {
        monthly_project_views: 0,
        last_view_reset: now.toISOString()
      });
      return 10; // Free tier limit
    }

    return Math.max(0, 10 - profile.monthly_project_views);
  },

  // ==========================================
  // Dashboard Stats
  // ==========================================

  /**
   * گرفتن آمار Dashboard سرمایه‌گذار
   */
  async getDashboardStats(userId: string): Promise<InvestorDashboardStats> {
    const { data, error } = await supabase
      .rpc('get_investor_dashboard_stats', {
        p_investor_id: userId
      });

    if (error) throw error;
    return data;
  },

  // ==========================================
  // Helper Functions
  // ==========================================

  /**
   * چک کردن اینکه کاربر Investor هست یا نه
   */
  async isInvestor(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')  // تغییر از user_type به role
      .eq('id', userId)
      .single();

    if (error) return false;
    return data?.role === 'investor';  // تغییر از user_type به role
  },

  /**
   * چک کردن اینکه سرمایه‌گذار Verified هست یا نه
   */
  async isVerified(userId: string): Promise<boolean> {
    const profile = await this.getInvestorProfile(userId);
    return profile?.tier === 'verified' || profile?.tier === 'premium';
  },

  /**
   * تبدیل کاربر به Investor
   */
  async convertToInvestor(userId: string): Promise<void> {
    // 1. آپدیت role در profiles
    await supabase
      .from('profiles')
      .update({ role: 'investor' })  // تغییر از user_type به role
      .eq('id', userId);

    // 2. ایجاد investor_profile
    const existingProfile = await this.getInvestorProfile(userId);
    if (!existingProfile) {
      await this.createInvestorProfile({
        id: userId,  // تغییر از user_id به id
        tier: 'free',
        preferred_industries: [],
        preferred_stages: [],
        preferred_locations: [],
        portfolio: [],
        monthly_project_views: 0,
        last_view_reset: new Date().toISOString()
      });
    }
  }
};
