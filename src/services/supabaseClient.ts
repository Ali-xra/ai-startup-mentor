import { createClient } from '@supabase/supabase-js';
import { ProjectMemberRole } from '../types';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// تابع کمکی برای ایجاد/آپدیت جدول profiles
export const initializeDatabase = async () => {
  try {
    // چک کردن وجود جدول profiles
    const { error: checkError } = await supabase.from('profiles').select('id').limit(1);

    // اگر جدول وجود نداشت، پیام می‌دیم که باید دستی ایجاد بشه
    if (checkError && checkError.code === 'PGRST116') {
      console.log('جدول profiles وجود ندارد');
      console.log('لطفاً این جدول رو در Supabase ایجاد کنید:');
      console.log(`
                CREATE TABLE profiles (
                    id UUID REFERENCES auth.users(id) PRIMARY KEY,
                    name TEXT,
                    email TEXT,
                    phone TEXT,
                    bio TEXT,
                    company TEXT,
                    position TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );

                ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

                CREATE POLICY "Users can view own profile" ON profiles
                    FOR SELECT USING (auth.uid() = id);

                CREATE POLICY "Users can update own profile" ON profiles
                    FOR UPDATE USING (auth.uid() = id);

                CREATE POLICY "Users can insert own profile" ON profiles
                    FOR INSERT WITH CHECK (auth.uid() = id);
            `);
    }
  } catch (error) {
    console.log('خطا در بررسی جدول profiles:', error);
  }
};

// Project members service functions
export const projectMembersService = {
  // Add a member to project
  async addMember(projectId: string, email: string, role: ProjectMemberRole, invitedBy: string) {
    const { data, error } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        user_email: email,
        role: role,
        invited_by: invitedBy,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get project members
  async getMembers(projectId: string) {
    const { data, error } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  },

  // Update member role
  async updateMemberRole(memberId: string, role: ProjectMemberRole) {
    const { data, error } = await supabase
      .from('project_members')
      .update({ role })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove member from project
  async removeMember(memberId: string) {
    const { error } = await supabase.from('project_members').delete().eq('id', memberId);

    if (error) throw error;
  },

  // Accept invitation
  async acceptInvitation(memberId: string, userId: string) {
    const { data, error } = await supabase
      .from('project_members')
      .update({
        status: 'accepted',
        user_id: userId,
        responded_at: new Date().toISOString(),
      })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Decline invitation
  async declineInvitation(memberId: string) {
    const { data, error } = await supabase
      .from('project_members')
      .update({
        status: 'declined',
        responded_at: new Date().toISOString(),
      })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's pending invitations
  async getPendingInvitations(userEmail: string) {
    const { data, error } = await supabase
      .from('project_members')
      .select('*')
      .eq('user_email', userEmail)
      .eq('status', 'pending');

    if (error) throw error;
    return data;
  },

  // ✅ تابع جدید: بررسی اینکه کاربر صاحب پروژه هست یا نه (برای لایه امنیتی)
  async isProjectOwner(projectId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error checking project ownership:', error);
      return false;
    }

    return data?.user_id === userId;
  },
};
