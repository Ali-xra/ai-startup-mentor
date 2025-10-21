import { supabase } from './supabaseClient';

export interface PublicProject {
  id: string;
  user_id: string;
  project_id: string;
  title: string;
  description: string;
  phase_completed: number;
  total_phases: number;
  thumbnail_url?: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  owner_name: string;
  owner_avatar?: string;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_avatar?: string;
}

export type ProjectFilter = 'all' | 'trending' | 'completed' | 'recent';

export class PublicProjectsService {
  /**
   * انتشار پروژه به صورت عمومی
   */
  static async publishProject(
    projectId: string,
    title: string,
    description: string,
    tags: string[] = []
  ): Promise<PublicProject> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // اول چک می‌کنیم که آیا پروژه قبلاً منتشر شده یا نه
    const { data: existingProject } = await supabase
      .from('public_projects')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (existingProject) {
      // اگر منتشر شده، فقط آپدیت می‌کنیم
      const { data, error } = await supabase
        .from('public_projects')
        .update({
          title,
          description,
          tags,
          is_published: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProject.id)
        .select()
        .single();

      if (error) throw error;
      return data as any;
    } else {
      // اگر منتشر نشده، پروژه جدید می‌سازیم
      const { data, error } = await supabase
        .from('public_projects')
        .insert({
          user_id: user.id,
          project_id: projectId,
          title,
          description,
          tags,
          is_published: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data as any;
    }
  }

  /**
   * عدم انتشار پروژه
   */
  static async unpublishProject(projectId: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('public_projects')
      .update({ is_published: false })
      .eq('project_id', projectId)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  /**
   * دریافت لیست پروژه‌های عمومی با فیلتر
   */
  static async getPublicProjects(
    filter: ProjectFilter = 'all',
    limit: number = 20,
    offset: number = 0
  ): Promise<PublicProject[]> {
    const { data, error } = await supabase.rpc('get_public_projects', {
      p_filter: filter,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) throw error;
    return data || [];
  }

  /**
   * لایک کردن پروژه
   */
  static async likeProject(projectId: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.from('project_likes').insert({
      project_id: projectId,
      user_id: user.id,
    });

    if (error) throw error;
  }

  /**
   * حذف لایک پروژه
   */
  static async unlikeProject(projectId: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('project_likes')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  /**
   * چک کردن اینکه کاربر پروژه را لایک کرده یا نه
   */
  static async hasUserLikedProject(projectId: string): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase.rpc('has_user_liked_project', {
      p_project_id: projectId,
      p_user_id: user.id,
    });

    if (error) throw error;
    return data || false;
  }

  /**
   * اضافه کردن کامنت به پروژه
   */
  static async addComment(projectId: string, commentText: string): Promise<ProjectComment> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('add_project_comment', {
      p_project_id: projectId,
      p_comment_text: commentText,
    });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No data returned');

    const commentData = data[0];
    return {
      id: commentData.id,
      project_id: commentData.project_id,
      user_id: commentData.user_id,
      comment_text: commentData.comment_text,
      created_at: commentData.created_at,
      updated_at: commentData.updated_at,
      user_name: commentData.user_name || 'Unknown User',
      user_avatar: commentData.user_avatar,
    };
  }

  /**
   * دریافت کامنت‌های پروژه
   */
  static async getComments(projectId: string): Promise<ProjectComment[]> {
    const { data, error } = await supabase.rpc('get_project_comments', {
      p_project_id: projectId,
    });

    if (error) throw error;

    return (data || []).map((comment: any) => ({
      id: comment.id,
      project_id: comment.project_id,
      user_id: comment.user_id,
      comment_text: comment.comment_text,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      user_name: comment.user_name || 'Unknown User',
      user_avatar: comment.user_avatar,
    }));
  }

  /**
   * حذف کامنت
   */
  static async deleteComment(commentId: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.rpc('delete_project_comment', {
      p_comment_id: commentId,
    });

    if (error) throw error;
  }

  /**
   * ویرایش کامنت
   */
  static async updateComment(commentId: string, commentText: string): Promise<ProjectComment> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('project_comments')
      .update({ comment_text: commentText, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .eq('user_id', user.id)
      .select(
        `
                *,
                user_name:auth.users!project_comments_user_id_fkey(raw_user_meta_data->>full_name),
                user_avatar:auth.users!project_comments_user_id_fkey(raw_user_meta_data->>avatar_url)
            `
      )
      .single();

    if (error || !data) throw error || new Error('No data returned');

    const commentData = data as any;
    return {
      id: commentData.id,
      project_id: commentData.project_id,
      user_id: commentData.user_id,
      comment_text: commentData.comment_text,
      created_at: commentData.created_at,
      updated_at: commentData.updated_at,
      user_name: commentData.user_name || user.email?.split('@')[0] || 'Unknown User',
      user_avatar: commentData.user_avatar,
    };
  }

  /**
   * دریافت پروژه‌های کاربر فعلی
   */
  static async getUserProjects(): Promise<PublicProject[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('public_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
  }

  /**
   * دریافت آمار پروژه‌های عمومی
   */
  static async getPublicProjectsStats(): Promise<{
    total: number;
    trending: number;
    completed: number;
    recent: number;
  }> {
    const { data, error } = await supabase
      .from('public_projects')
      .select('id, phase_completed, total_phases, created_at, likes_count')
      .eq('is_published', true);

    if (error) throw error;

    const projects = data || [];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: projects.length,
      trending: projects.filter((p) => p.likes_count >= 10).length,
      completed: projects.filter((p) => p.phase_completed === p.total_phases).length,
      recent: projects.filter((p) => new Date(p.created_at) >= weekAgo).length,
    };
  }
}
