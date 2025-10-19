// @ts-nocheck - Legacy service file
// ==========================================
// Investor Project Service
// ==========================================

import { supabase } from './supabaseClient';
import type {
  PublicProject,
  ProjectFilters,
  ProjectSearchResult,
  ProjectAnalytics,
} from '../types/project';
import type { SavedProject, SavedProjectWithDetails } from '../types/connection';

export const investorProjectService = {
  // ==========================================
  // Project Discovery
  // ==========================================

  /**
   * گرفتن پروژه‌های عمومی با فیلتر (با pagination result)
   */
  async getPublicProjects(filters: ProjectFilters = {}): Promise<ProjectSearchResult> {
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    // ساخت query با فیلترها
    let query = supabase
      .from('projects')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    // اعمال فیلترها
    if (filters.industries && filters.industries.length > 0) {
      query = query.in('industry', filters.industries);
    }

    if (filters.stages && filters.stages.length > 0) {
      query = query.in('stage', filters.stages);
    }

    if (filters.seekingInvestment) {
      query = query.eq('seeking_investment', true);
    }

    if (filters.investmentMin) {
      query = query.gte('investment_amount', filters.investmentMin);
    }

    if (filters.investmentMax) {
      query = query.lte('investment_amount', filters.investmentMax);
    }

    // جستجو در متن (اگر searchQuery وجود داره)
    if (filters.searchQuery && filters.searchQuery.trim()) {
      query = query.or(
        `project_name.ilike.%${filters.searchQuery}%,initial_idea.ilike.%${filters.searchQuery}%`
      );
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: projects, error } = await query;

    if (error) throw error;
    if (!projects || projects.length === 0) {
      return {
        projects: [],
        total_count: 0,
        page: Math.floor(offset / limit) + 1,
        page_size: limit,
        has_more: false,
      };
    }

    // دریافت اطلاعات صاحبان پروژه
    const userIds = projects.map((p) => p.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url')
      .in('id', userIds);

    // ترکیب پروژه‌ها با اطلاعات صاحبان
    const projectsWithOwners = projects.map((project) => {
      const owner = profiles?.find((p) => p.id === project.user_id);
      return {
        ...project,
        owner_name: owner?.name || owner?.email || 'Unknown',
        owner_email: owner?.email || '',
      };
    });

    return {
      projects: projectsWithOwners,
      total_count: projectsWithOwners.length,
      page: Math.floor(offset / limit) + 1,
      page_size: limit,
      has_more: projects.length === limit,
    };
  },

  /**
   * جستجوی پروژه‌ها با pagination (alias)
   */
  async searchProjects(filters: ProjectFilters = {}): Promise<ProjectSearchResult> {
    return this.getPublicProjects(filters);
  },

  /**
   * گرفتن جزئیات یک پروژه عمومی
   */
  async getProjectById(projectId: string): Promise<PublicProject | null> {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('visibility', 'public')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!project) return null;

    // دریافت اطلاعات صاحب پروژه
    const { data: owner, error: ownerError } = await supabase
      .from('profiles')
      .select('name, email, avatar_url')
      .eq('id', project.user_id)
      .single();

    if (ownerError && ownerError.code !== 'PGRST116') throw ownerError;

    return {
      ...project,
      owner_name: owner?.name || owner?.email || 'Unknown',
      owner_email: owner?.email || '',
    };
  },

  /**
   * گرفتن پروژه‌های Featured
   */
  async getFeaturedProjects(limit: number = 5): Promise<PublicProject[]> {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('visibility', 'public')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    if (!projects || projects.length === 0) return [];

    // دریافت اطلاعات صاحبان پروژه
    const userIds = projects.map((p) => p.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // ترکیب پروژه‌ها با اطلاعات صاحبان
    return projects.map((project) => {
      const owner = profiles?.find((p) => p.id === project.user_id);
      return {
        ...project,
        owner_name: owner?.name || owner?.email || 'Unknown',
        owner_email: owner?.email || '',
      };
    });
  },

  // ==========================================
  // Project Views
  // ==========================================

  /**
   * ثبت بازدید پروژه
   */
  async incrementView(
    projectId: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const { error } = await supabase.rpc('increment_project_view', {
      p_project_id: projectId,
      p_viewer_id: userId || null,
      p_ip_address: ipAddress || null,
      p_user_agent: userAgent || null,
    });

    if (error) throw error;
  },

  // ==========================================
  // Saved Projects
  // ==========================================

  /**
   * Save کردن پروژه
   */
  async saveProject(projectId: string, userId: string, notes?: string): Promise<SavedProject> {
    const { data, error } = await supabase
      .from('saved_projects')
      .insert([
        {
          user_id: userId,
          project_id: projectId,
          notes: notes || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Unsave کردن پروژه
   */
  async unsaveProject(projectId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_projects')
      .delete()
      .eq('user_id', userId)
      .eq('project_id', projectId);

    if (error) throw error;
  },

  /**
   * آپدیت یادداشت‌های پروژه ذخیره شده
   */
  async updateSavedProjectNotes(projectId: string, userId: string, notes: string): Promise<void> {
    const { error } = await supabase
      .from('saved_projects')
      .update({ notes })
      .eq('user_id', userId)
      .eq('project_id', projectId);

    if (error) throw error;
  },

  /**
   * گرفتن پروژه‌های Save شده
   */
  async getSavedProjects(userId: string): Promise<PublicProject[]> {
    const { data: savedProjects, error } = await supabase
      .from('saved_projects')
      .select('project_id')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });

    if (error) throw error;
    if (!savedProjects || savedProjects.length === 0) return [];

    // دریافت اطلاعات پروژه‌ها
    const projectIds = savedProjects.map((sp) => sp.project_id);
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .in('id', projectIds);

    if (projectsError) throw projectsError;
    if (!projects || projects.length === 0) return [];

    // دریافت اطلاعات صاحبان پروژه
    const userIds = projects.map((p) => p.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // ترکیب داده‌ها
    return projects.map((project) => {
      const owner = profiles?.find((p) => p.id === project.user_id);
      return {
        ...project,
        owner_name: owner?.name || owner?.email || 'Unknown',
        owner_email: owner?.email || '',
      };
    });
  },

  /**
   * چک کردن اینکه پروژه save شده یا نه
   */
  async isProjectSaved(projectId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('saved_projects')
      .select('id')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  /**
   * گرفتن تعداد پروژه‌های Save شده
   */
  async getSavedProjectsCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('saved_projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  },

  // ==========================================
  // Project Analytics (For Project Owners)
  // ==========================================

  /**
   * گرفتن Analytics یک پروژه (برای صاحب پروژه)
   */
  async getProjectAnalytics(projectId: string): Promise<ProjectAnalytics> {
    // Get basic stats
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('view_count, interest_count')
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;

    // Get unique viewers count
    const { count: uniqueViewers, error: viewersError } = await supabase
      .from('project_views')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (viewersError) throw viewersError;

    // Get saves count
    const { count: savesCount, error: savesError } = await supabase
      .from('saved_projects')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (savesError) throw savesError;

    // Get connections stats
    const { data: connections, error: connectionsError } = await supabase
      .from('connections')
      .select('status')
      .eq('project_id', projectId);

    if (connectionsError) throw connectionsError;

    const connectionStats = {
      pending: connections?.filter((c) => c.status === 'pending').length || 0,
      accepted: connections?.filter((c) => c.status === 'accepted').length || 0,
      rejected: connections?.filter((c) => c.status === 'rejected').length || 0,
    };

    // Get recent viewers
    const { data: recentViews, error: recentViewsError } = await supabase
      .from('project_views')
      .select('viewer_id, viewed_at')
      .eq('project_id', projectId)
      .order('viewed_at', { ascending: false })
      .limit(10);

    if (recentViewsError) throw recentViewsError;

    // دریافت اطلاعات viewers
    // @ts-ignore - Type inference issue with viewers
    let recentViewersWithNames = [];
    if (recentViews && recentViews.length > 0) {
      const viewerIds = recentViews.map((v) => v.viewer_id);
      const { data: viewers } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', viewerIds);

      recentViewersWithNames = recentViews.map((v) => {
        const viewer = viewers?.find((vr) => vr.id === v.viewer_id);
        return {
          viewer_id: v.viewer_id,
          viewer_name: viewer?.name || viewer?.email || 'Unknown',
          viewed_at: v.viewed_at,
        };
      });
    }

    return {
      project_id: projectId,
      total_views: project.view_count || 0,
      unique_viewers: uniqueViewers || 0,
      total_interests: project.interest_count || 0,
      total_saves: savesCount || 0,
      connections_pending: connectionStats.pending,
      connections_accepted: connectionStats.accepted,
      connections_rejected: connectionStats.rejected,
      recent_viewers: recentViewersWithNames,
    };
  },

  // ==========================================
  // Helper Functions
  // ==========================================

  /**
   * چک کردن اینکه پروژه عمومی هست یا نه
   */
  async isProjectPublic(projectId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('projects')
      .select('visibility')
      .eq('id', projectId)
      .single();

    if (error) return false;
    return data?.visibility === 'public';
  },

  /**
   * چک کردن اینکه پروژه seeking investment هست یا نه
   */
  async isSeekingInvestment(projectId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('projects')
      .select('seeking_investment')
      .eq('id', projectId)
      .single();

    if (error) return false;
    return data?.seeking_investment || false;
  },
};
