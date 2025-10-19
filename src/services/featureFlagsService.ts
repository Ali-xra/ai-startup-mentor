import { supabase } from './supabaseClient';
import { FeatureKey, FeatureFlag, UserWithFeatures } from '../types';

export const featureFlagsService = {
  // ==========================================
  // Feature Checking (برای کاربران عادی)
  // ==========================================

  /**
   * چک کردن اینکه آیا کاربر به یک فیچر دسترسی داره یا نه
   */
  async hasFeature(userId: string, featureKey: FeatureKey): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_feature', {
        p_user_id: userId,
        p_feature_key: featureKey,
      });

      if (error) {
        console.error('Error checking feature:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error in hasFeature:', error);
      return false;
    }
  },

  /**
   * گرفتن تمام فیچرهای یک کاربر
   */
  async getUserFeatures(userId: string): Promise<Record<string, boolean>> {
    try {
      const { data, error } = await supabase.rpc('get_user_features', {
        p_user_id: userId,
      });

      if (error) {
        console.error('Error getting user features:', error);
        return {};
      }

      // تبدیل به object ساده: { feature_key: is_enabled }
      const features: Record<string, boolean> = {};
      data?.forEach((item: any) => {
        features[item.feature_key] = item.is_enabled;
      });

      return features;
    } catch (error) {
      console.error('Error in getUserFeatures:', error);
      return {};
    }
  },

  /**
   * چک کردن محدودیت تعداد پروژه
   */
  async getMaxProjects(userId: string): Promise<number> {
    const features = await this.getUserFeatures(userId);

    if (features[FeatureKey.UNLIMITED_PROJECTS]) {
      return Infinity;
    }

    if (features[FeatureKey.MAX_PROJECTS_3]) {
      return 3;
    }

    // Default: Free plan - 1 project
    return 1;
  },

  /**
   * چک کردن محدودیت AI credits
   */
  async getAICredits(userId: string): Promise<number> {
    const features = await this.getUserFeatures(userId);

    if (features[FeatureKey.UNLIMITED_AI]) {
      return Infinity;
    }

    if (features[FeatureKey.AI_CREDITS_2000]) {
      return 2000;
    }

    if (features[FeatureKey.AI_CREDITS_500]) {
      return 500;
    }

    // Default: Free plan - 50 messages
    return 50;
  },

  /**
   * چک کردن محدودیت اشتراک‌گذاری تیمی
   */
  async getMaxTeamMembers(userId: string): Promise<number> {
    const features = await this.getUserFeatures(userId);

    if (features[FeatureKey.TEAM_SHARING_UNLIMITED]) {
      return Infinity;
    }

    if (features[FeatureKey.TEAM_SHARING_10]) {
      return 10;
    }

    if (features[FeatureKey.TEAM_SHARING_2]) {
      return 2;
    }

    // Default: Free plan - no sharing
    return 0;
  },

  /**
   * چک کردن دسترسی به مراحل
   */
  async getMaxPhase(userId: string): Promise<number> {
    const features = await this.getUserFeatures(userId);

    if (features[FeatureKey.ALL_PHASES]) {
      return 8; // همه 8 مرحله
    }

    if (features[FeatureKey.PHASE_5_LIMIT]) {
      return 5;
    }

    // Default: Free plan - فقط مرحله 1
    return 1;
  },

  // ==========================================
  // Admin Functions (فقط برای ادمین‌ها)
  // ==========================================

  /**
   * گرفتن لیست تمام feature flags
   */
  async getAllFeatureFlags(): Promise<FeatureFlag[]> {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .order('category', { ascending: true })
      .order('feature_name', { ascending: true });

    if (error) {
      console.error('Error getting feature flags:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * گرفتن لیست تمام کاربران با فیچرهاشون
   */
  async getAllUsersWithFeatures(
    limit: number = 50,
    offset: number = 0
  ): Promise<UserWithFeatures[]> {
    try {
      // گرفتن لیست کاربران از auth.users
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers({
        page: Math.floor(offset / 1000) + 1,
        perPage: 1000,
      });

      if (usersError) throw usersError;

      // گرفتن فیچرهای همه کاربران
      const { data: userFeatures, error: featuresError } = await supabase
        .from('user_features')
        .select('*');

      if (featuresError) throw featuresError;

      // ترکیب کاربران با فیچرهاشون
      const usersWithFeatures: UserWithFeatures[] = users.users.map((user) => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        features: (userFeatures || []).filter((f) => f.user_id === user.id),
      }));

      return usersWithFeatures.slice(offset % 1000, (offset % 1000) + limit);
    } catch (error) {
      console.error('Error getting users with features:', error);
      throw error;
    }
  },

  /**
   * جستجوی کاربر با User ID
   */
  async getUserById(userId: string): Promise<UserWithFeatures | null> {
    try {
      // گرفتن فیچرهای کاربر
      const { data: userFeatures, error: featuresError } = await supabase
        .from('user_features')
        .select('*')
        .eq('user_id', userId);

      if (featuresError) throw featuresError;

      // سعی کنیم ایمیل رو از profiles بگیریم
      let email = userId.slice(0, 8) + '...'; // پیش‌فرض: قسمتی از UUID
      let created_at = new Date().toISOString();

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, created_at')
          .eq('id', userId)
          .single();

        if (profile?.email) {
          email = profile.email;
        }
        if (profile?.created_at) {
          created_at = profile.created_at;
        }
      } catch (profileError) {
        // اگر profiles نداشتیم، مشکلی نیست
        console.log('No profile found for user, using UUID');
      }

      // تشخیص پلن فعلی کاربر بر اساس فیچرها
      const current_plan = this.detectUserPlan(userFeatures || []);

      // پیدا کردن تاریخ انقضا (از اولین فیچری که expires_at داره)
      const plan_expires_at = userFeatures?.find((f) => f.expires_at)?.expires_at;

      return {
        id: userId,
        email: email,
        created_at: created_at,
        features: userFeatures || [],
        current_plan,
        plan_expires_at,
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  },

  /**
   * تشخیص پلن کاربر بر اساس فیچرهایش
   */
  detectUserPlan(features: any[]): string {
    const featureKeys = features.filter((f) => f.is_enabled).map((f) => f.feature_key);

    // Enterprise: unlimited AI
    if (featureKeys.includes(FeatureKey.UNLIMITED_AI)) {
      return 'enterprise';
    }

    // Pro: unlimited projects
    if (featureKeys.includes(FeatureKey.UNLIMITED_PROJECTS)) {
      return 'pro';
    }

    // Starter: 3 projects
    if (featureKeys.includes(FeatureKey.MAX_PROJECTS_3)) {
      return 'starter';
    }

    // Default: free
    return 'free';
  },

  /**
   * جستجوی کاربر با User ID
   */
  async searchUsers(userId: string): Promise<UserWithFeatures[]> {
    try {
      const user = await this.getUserById(userId.trim());
      if (user) {
        return [user];
      }
      return [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  /**
   * فعال/غیرفعال کردن یک فیچر برای کاربر
   */
  async toggleUserFeature(
    userId: string,
    featureKey: FeatureKey,
    isEnabled: boolean,
    adminId: string,
    expiresAt?: string,
    notes?: string
  ): Promise<void> {
    try {
      // چک کردن اینکه آیا قبلاً وجود داره
      const { data: existing } = await supabase
        .from('user_features')
        .select('id')
        .eq('user_id', userId)
        .eq('feature_key', featureKey)
        .single();

      if (existing) {
        // Update
        const { error } = await supabase
          .from('user_features')
          .update({
            is_enabled: isEnabled,
            expires_at: expiresAt || null,
            notes: notes || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from('user_features').insert({
          user_id: userId,
          feature_key: featureKey,
          is_enabled: isEnabled,
          expires_at: expiresAt || null,
          granted_by: adminId,
          notes: notes || null,
        });

        if (error) throw error;
      }

      // ثبت در audit log
      await this.logAdminAction(adminId, isEnabled ? 'grant_feature' : 'revoke_feature', userId, {
        feature_key: featureKey,
        notes,
      });
    } catch (error) {
      console.error('Error toggling user feature:', error);
      throw error;
    }
  },

  /**
   * فعال کردن دسته‌ای از فیچرها برای یک کاربر (مثلاً برای یک plan)
   */
  async grantPlan(
    userId: string,
    planName: 'free' | 'starter' | 'pro' | 'enterprise',
    adminId: string,
    expiresAt?: string
  ): Promise<void> {
    const planFeatures: Record<string, FeatureKey[]> = {
      free: [
        FeatureKey.MAX_PROJECTS_1,
        FeatureKey.AI_CREDITS_50,
        FeatureKey.TEAM_SHARING_DISABLED,
        FeatureKey.EXPORT_DISABLED,
        FeatureKey.PHASE_3_LIMIT,
        FeatureKey.STORAGE_50MB,
      ],
      starter: [
        FeatureKey.MAX_PROJECTS_3,
        FeatureKey.AI_CREDITS_500,
        FeatureKey.TEAM_SHARING_2,
        FeatureKey.EXPORT_BASIC,
        FeatureKey.ALL_PHASES,
        FeatureKey.STORAGE_500MB,
      ],
      pro: [
        FeatureKey.UNLIMITED_PROJECTS,
        FeatureKey.AI_CREDITS_2000,
        FeatureKey.TEAM_SHARING_10,
        FeatureKey.EXPORT_ADVANCED,
        FeatureKey.ALL_PHASES,
        FeatureKey.STORAGE_5GB,
      ],
      enterprise: [
        FeatureKey.UNLIMITED_PROJECTS,
        FeatureKey.UNLIMITED_AI,
        FeatureKey.TEAM_SHARING_UNLIMITED,
        FeatureKey.EXPORT_ADVANCED,
        FeatureKey.ALL_PHASES,
        FeatureKey.STORAGE_UNLIMITED,
      ],
    };

    const newFeatures = planFeatures[planName];

    // ✅ گام 1: غیرفعال کردن همه فیچرهای قبلی کاربر
    const { data: existingFeatures } = await supabase
      .from('user_features')
      .select('feature_key')
      .eq('user_id', userId)
      .eq('is_enabled', true);

    if (existingFeatures && existingFeatures.length > 0) {
      for (const feature of existingFeatures) {
        // فقط اگر در پلن جدید نباشد، غیرفعالش کن
        if (!newFeatures.includes(feature.feature_key as FeatureKey)) {
          await this.toggleUserFeature(
            userId,
            feature.feature_key as FeatureKey,
            false, // turn off
            adminId,
            undefined,
            `Removed during ${planName} plan grant`
          );
        }
      }
    }

    // ✅ گام 2: فعال کردن فیچرهای پلن جدید
    for (const featureKey of newFeatures) {
      await this.toggleUserFeature(
        userId,
        featureKey,
        true,
        adminId,
        expiresAt,
        `Granted via ${planName} plan`
      );
    }
  },

  /**
   * حذف تمام فیچرهای یک کاربر (برگشت به Free plan)
   */
  async revokeAllFeatures(userId: string, adminId: string): Promise<void> {
    const { error } = await supabase.from('user_features').delete().eq('user_id', userId);

    if (error) throw error;

    await this.logAdminAction(adminId, 'revoke_all_features', userId, {});
  },

  /**
   * تغییر وضعیت global یک feature
   */
  async toggleGlobalFeature(featureKey: FeatureKey, isEnabled: boolean): Promise<void> {
    const { error } = await supabase
      .from('feature_flags')
      .update({ is_enabled_globally: isEnabled })
      .eq('feature_key', featureKey);

    if (error) throw error;
  },

  /**
   * ثبت عملیات ادمین در audit log
   */
  async logAdminAction(
    adminId: string,
    action: string,
    targetUserId?: string,
    details?: any
  ): Promise<void> {
    try {
      await supabase.from('admin_audit_log').insert({
        admin_id: adminId,
        action,
        target_user_id: targetUserId || null,
        details: details || null,
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
      // Don't throw - audit log failure shouldn't break the main operation
    }
  },

  /**
   * گرفتن audit log
   */
  async getAuditLog(limit: number = 50, offset: number = 0) {
    const { data, error } = await supabase
      .from('admin_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },
};
