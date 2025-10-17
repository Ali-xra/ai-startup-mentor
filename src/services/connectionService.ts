// ==========================================
// Connection Service
// ==========================================

import { supabase } from './supabaseClient';
import type {
  Connection,
  ConnectionWithProject,
  ConnectionWithInvestor,
  ConnectionMessage,
  ConnectionMessageWithSender,
  ConnectionStatus
} from '../types/connection';

export const connectionService = {
  // ==========================================
  // Connection Management
  // ==========================================

  /**
   * ایجاد Connection Request (سرمایه‌گذار به پروژه علاقه نشون میده)
   */
  async createConnectionRequest(
    projectId: string,
    investorId: string,
    message: string
  ): Promise<string> {
    const { data, error } = await supabase.rpc('create_connection_request', {
      p_project_id: projectId,
      p_investor_id: investorId,
      p_message: message
    });

    if (error) throw error;
    return data; // returns connection_id
  },

  /**
   * پاسخ به Connection Request (صاحب پروژه Accept/Reject میکنه)
   */
  async respondToConnection(
    connectionId: string,
    projectOwnerId: string,
    status: 'accepted' | 'rejected',
    response?: string
  ): Promise<void> {
    const { error } = await supabase.rpc('respond_to_connection', {
      p_connection_id: connectionId,
      p_project_owner_id: projectOwnerId,
      p_status: status,
      p_response: response || null
    });

    if (error) throw error;
  },

  /**
   * آپدیت وضعیت Connection
   */
  async updateConnectionStatus(
    connectionId: string,
    status: ConnectionStatus
  ): Promise<void> {
    const { error } = await supabase
      .from('connections')
      .update({
        status,
        last_activity: new Date().toISOString()
      })
      .eq('id', connectionId);

    if (error) throw error;
  },

  /**
   * گرفتن یک Connection به همراه جزئیات پروژه
   */
  async getConnectionById(connectionId: string): Promise<ConnectionWithProject | null> {
    const { data: connection, error } = await supabase
      .from('connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!connection) return null;

    // دریافت اطلاعات پروژه
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', connection.project_id)
      .single();

    if (projectError) throw projectError;

    // دریافت اطلاعات صاحب پروژه
    const { data: owner, error: ownerError } = await supabase
      .from('profiles')
      .select('name, email, avatar_url')
      .eq('id', project.user_id)
      .single();

    if (ownerError && ownerError.code !== 'PGRST116') throw ownerError;

    return {
      ...connection,
      project: {
        ...project,
        owner_name: owner?.name || owner?.email || 'Unknown',
        owner_email: owner?.email || ''
      }
    };
  },

  /**
   * گرفتن Connections یک سرمایه‌گذار
   */
  async getInvestorConnections(investorId: string): Promise<ConnectionWithProject[]> {
    const { data: connections, error } = await supabase
      .from('connections')
      .select('*')
      .eq('investor_id', investorId)
      .order('last_activity', { ascending: false });

    if (error) throw error;
    if (!connections || connections.length === 0) return [];

    // دریافت اطلاعات پروژه‌ها
    const projectIds = connections.map(c => c.project_id);
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .in('id', projectIds);

    if (projectsError) throw projectsError;

    // دریافت اطلاعات صاحبان پروژه
    const userIds = projects?.map(p => p.user_id) || [];
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // ترکیب داده‌ها
    return connections.map(conn => {
      const project = projects?.find(p => p.id === conn.project_id);
      const owner = profiles?.find(p => p.id === project?.user_id);

      return {
        ...conn,
        project: {
          ...project,
          owner_name: owner?.name || owner?.email || 'Unknown',
          owner_email: owner?.email || ''
        }
      };
    });
  },

  /**
   * گرفتن Connections یک پروژه (برای صاحب پروژه)
   */
  async getProjectConnections(projectId: string): Promise<ConnectionWithInvestor[]> {
    const { data: connections, error } = await supabase
      .from('connections')
      .select('*')
      .eq('project_id', projectId)
      .order('last_activity', { ascending: false });

    if (error) throw error;
    if (!connections || connections.length === 0) return [];

    // دریافت اطلاعات investor profiles
    const investorIds = connections.map(c => c.investor_id);
    const { data: investorProfiles, error: investorError } = await supabase
      .from('investor_profiles')
      .select('*')
      .in('user_id', investorIds);

    if (investorError) throw investorError;

    // دریافت اطلاعات user profiles
    const { data: userProfiles, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', investorIds);

    if (userError) throw userError;

    // ترکیب داده‌ها
    return connections.map(conn => {
      const investorProfile = investorProfiles?.find(ip => ip.user_id === conn.investor_id);
      const userProfile = userProfiles?.find(up => up.id === conn.investor_id);

      return {
        ...conn,
        investor: {
          ...(investorProfile || {}),
          user_profile: userProfile || {}
        } as any
      };
    });
  },

  /**
   * گرفتن تعداد Connections بر اساس وضعیت
   */
  async getConnectionsCount(
    userId: string,
    userType: 'investor' | 'project_owner',
    status?: ConnectionStatus
  ): Promise<number> {
    let query = supabase
      .from('connections')
      .select('*', { count: 'exact', head: true });

    if (userType === 'investor') {
      query = query.eq('investor_id', userId);
    } else {
      // برای project owner باید بر اساس پروژه‌هایی که داره فیلتر کنیم
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', userId);

      if (!projects || projects.length === 0) return 0;

      const projectIds = projects.map(p => p.id);
      query = query.in('project_id', projectIds);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { count, error } = await query;
    if (error) throw error;

    return count || 0;
  },

  /**
   * چک کردن اینکه آیا قبلاً connection درخواست داده یا نه
   */
  async hasExistingConnection(
    projectId: string,
    investorId: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('connections')
      .select('id')
      .eq('project_id', projectId)
      .eq('investor_id', investorId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  // ==========================================
  // Messaging
  // ==========================================

  /**
   * ارسال پیام در یک Connection
   */
  async sendMessage(
    connectionId: string,
    senderId: string,
    message: string
  ): Promise<ConnectionMessage> {
    const { data, error } = await supabase
      .from('connection_messages')
      .insert([{
        connection_id: connectionId,
        sender_id: senderId,
        message
      }])
      .select()
      .single();

    if (error) throw error;

    // آپدیت last_activity
    await supabase
      .from('connections')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', connectionId);

    return data;
  },

  /**
   * گرفتن پیام‌های یک Connection
   */
  async getMessages(connectionId: string): Promise<ConnectionMessageWithSender[]> {
    const { data: messages, error } = await supabase
      .from('connection_messages')
      .select('*')
      .eq('connection_id', connectionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!messages || messages.length === 0) return [];

    // دریافت اطلاعات فرستندگان
    const senderIds = [...new Set(messages.map(m => m.sender_id))];
    const { data: senders, error: sendersError } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url')
      .in('id', senderIds);

    if (sendersError) throw sendersError;

    // ترکیب داده‌ها
    return messages.map(msg => {
      const sender = senders?.find(s => s.id === msg.sender_id);
      return {
        ...msg,
        sender: {
          id: msg.sender_id,
          name: sender?.name || sender?.email || 'Unknown',
          email: sender?.email || '',
          avatar_url: sender?.avatar_url || null
        }
      };
    });
  },

  /**
   * مارک کردن پیام به عنوان خوانده شده
   */
  async markMessageAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('connection_messages')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) throw error;
  },

  /**
   * مارک کردن همه پیام‌های یک Connection به عنوان خوانده شده
   */
  async markAllMessagesAsRead(connectionId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('connection_messages')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('connection_id', connectionId)
      .neq('sender_id', userId) // فقط پیام‌های طرف مقابل
      .eq('read', false);

    if (error) throw error;
  },

  /**
   * گرفتن تعداد پیام‌های خوانده نشده
   */
  async getUnreadMessagesCount(userId: string): Promise<number> {
    // روش بهتر: دو query جداگانه

    // 1. گرفتن connections به عنوان investor
    const { data: investorConns } = await supabase
      .from('connections')
      .select('id')
      .eq('investor_id', userId);

    // 2. گرفتن connections به عنوان project owner
    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', userId);

    let ownerConns: any[] = [];
    if (projects && projects.length > 0) {
      const projectIds = projects.map(p => p.id);
      const { data } = await supabase
        .from('connections')
        .select('id')
        .in('project_id', projectIds);

      ownerConns = data || [];
    }

    // ترکیب همه connection IDs
    const allConnectionIds = [
      ...(investorConns?.map(c => c.id) || []),
      ...(ownerConns?.map(c => c.id) || [])
    ];

    if (allConnectionIds.length === 0) return 0;

    // شمارش پیام‌های خوانده نشده
    const { count, error } = await supabase
      .from('connection_messages')
      .select('*', { count: 'exact', head: true })
      .in('connection_id', allConnectionIds)
      .neq('sender_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  // ==========================================
  // Helper Functions
  // ==========================================

  /**
   * چک کردن دسترسی کاربر به یک Connection
   */
  async canAccessConnection(connectionId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('connections')
      .select('investor_id, project_id')
      .eq('id', connectionId)
      .single();

    if (error) return false;

    // چک کردن اگر investor است
    if (data.investor_id === userId) return true;

    // چک کردن اگر project owner است
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', data.project_id)
      .single();

    return project?.user_id === userId;
  },

  /**
   * گرفتن Connection بین یک پروژه و سرمایه‌گذار (اگر وجود دارد)
   */
  async getConnectionByProject(
    projectId: string,
    investorId: string
  ): Promise<Connection | null> {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('project_id', projectId)
      .eq('investor_id', investorId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Alias برای سازگاری
  createConnection: async function(
    projectId: string,
    investorId: string,
    message: string
  ): Promise<string> {
    return this.createConnectionRequest(projectId, investorId, message);
  }
};
