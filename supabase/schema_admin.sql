-- ==========================================
-- Admin Panel - Database Schema
-- ==========================================

-- 1. جدول feature_flags: تعریف فیچرهای سیستم
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key TEXT UNIQUE NOT NULL,
    feature_name TEXT NOT NULL,
    feature_name_en TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'projects', 'ai', 'team', 'export', 'phases', 'storage'
    is_enabled_globally BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول user_features: فیچرهای فعال هر کاربر
CREATE TABLE IF NOT EXISTS user_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    granted_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, feature_key)
);

-- 3. جدول admins: لیست ادمین‌ها
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. جدول admin_audit_log: ثبت فعالیت‌های ادمین
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL, -- 'grant_feature', 'revoke_feature', 'create_admin', etc.
    target_user_id UUID REFERENCES auth.users(id),
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- Indexes برای بهبود performance
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_user_features_user_id ON user_features(user_id);
CREATE INDEX IF NOT EXISTS idx_user_features_feature_key ON user_features(feature_key);
CREATE INDEX IF NOT EXISTS idx_user_features_expires_at ON user_features(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_target_user_id ON admin_audit_log(target_user_id);

-- ==========================================
-- RLS (Row Level Security) Policies
-- ==========================================

-- Enable RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: فقط ادمین‌ها می‌تونن feature_flags رو ببینن
CREATE POLICY "Admins can view feature flags" ON feature_flags
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
            AND admins.is_active = true
        )
    );

-- Policy: فقط ادمین‌ها می‌تونن feature_flags رو ویرایش کنن
CREATE POLICY "Admins can update feature flags" ON feature_flags
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
            AND admins.is_active = true
        )
    );

-- Policy: کاربران می‌تونن فیچرهای خودشون رو ببینن
CREATE POLICY "Users can view their own features" ON user_features
    FOR SELECT
    USING (user_id = auth.uid());

-- Policy: ادمین‌ها می‌تونن همه user_features رو ببینن و ویرایش کنن
CREATE POLICY "Admins can manage all user features" ON user_features
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
            AND admins.is_active = true
        )
    );

-- Policy: فقط super_admin‌ها می‌تونن لیست admins رو ببینن
CREATE POLICY "Super admins can view admins" ON admins
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
            AND admins.role = 'super_admin'
            AND admins.is_active = true
        )
    );

-- Policy: فقط super_admin‌ها می‌تونن ادمین اضافه کنن
CREATE POLICY "Super admins can manage admins" ON admins
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
            AND admins.role = 'super_admin'
            AND admins.is_active = true
        )
    );

-- Policy: ادمین‌ها می‌تونن audit log خودشون رو ببینن
CREATE POLICY "Admins can view audit logs" ON admin_audit_log
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
            AND admins.is_active = true
        )
    );

-- ==========================================
-- Insert default feature flags
-- ==========================================

INSERT INTO feature_flags (feature_key, feature_name, feature_name_en, description, category, is_enabled_globally)
VALUES
    -- Projects
    ('unlimited_projects', 'پروژه‌های نامحدود', 'Unlimited Projects', 'امکان ساخت تعداد نامحدود پروژه', 'projects', false),
    ('max_projects_3', 'حداکثر 3 پروژه', 'Max 3 Projects', 'حداکثر 3 پروژه همزمان', 'projects', false),
    ('max_projects_1', 'حداکثر 1 پروژه', 'Max 1 Project', 'حداکثر 1 پروژه (Free Plan)', 'projects', true),

    -- AI Credits
    ('unlimited_ai', 'AI نامحدود', 'Unlimited AI', 'پیام‌های نامحدود با AI', 'ai', false),
    ('ai_credits_2000', '2000 پیام AI', '2000 AI Messages', '2000 پیام در ماه', 'ai', false),
    ('ai_credits_500', '500 پیام AI', '500 AI Messages', '500 پیام در ماه', 'ai', false),
    ('ai_credits_50', '50 پیام AI', '50 AI Messages', '50 پیام در ماه (Free Plan)', 'ai', true),

    -- Team Sharing
    ('team_sharing_unlimited', 'اشتراک‌گذاری نامحدود', 'Unlimited Team Sharing', 'اشتراک‌گذاری با تعداد نامحدود کاربر', 'team', false),
    ('team_sharing_10', 'اشتراک با 10 نفر', 'Share with 10 Members', 'اشتراک‌گذاری با حداکثر 10 نفر', 'team', false),
    ('team_sharing_2', 'اشتراک با 2 نفر', 'Share with 2 Members', 'اشتراک‌گذاری با حداکثر 2 نفر', 'team', false),
    ('team_sharing_disabled', 'بدون اشتراک‌گذاری', 'No Team Sharing', 'امکان اشتراک‌گذاری وجود ندارد', 'team', true),

    -- Export
    ('export_advanced', 'Export پیشرفته', 'Advanced Export', 'Export به React, Vue, Next.js', 'export', false),
    ('export_basic', 'Export ساده', 'Basic Export', 'Export به HTML/CSS/JS', 'export', false),
    ('export_disabled', 'بدون Export', 'No Export', 'امکان Export وجود ندارد', 'export', true),

    -- Phases
    ('all_phases', 'دسترسی به همه مراحل', 'All Phases Access', 'دسترسی به تمام 8 مرحله', 'phases', false),
    ('phase_5_limit', 'تا مرحله 5', 'Up to Phase 5', 'دسترسی تا مرحله 5', 'phases', false),
    ('phase_3_limit', 'تا مرحله 3', 'Up to Phase 3', 'دسترسی تا مرحله 3 (Free Plan)', 'phases', true),

    -- Storage
    ('storage_unlimited', 'فضای نامحدود', 'Unlimited Storage', 'فضای ذخیره‌سازی نامحدود', 'storage', false),
    ('storage_5gb', 'فضای 5GB', '5GB Storage', '5 گیگابایت فضا', 'storage', false),
    ('storage_500mb', 'فضای 500MB', '500MB Storage', '500 مگابایت فضا', 'storage', false),
    ('storage_50mb', 'فضای 50MB', '50MB Storage', '50 مگابایت فضا (Free Plan)', 'storage', true)
ON CONFLICT (feature_key) DO NOTHING;

-- ==========================================
-- Functions
-- ==========================================

-- تابع برای چک کردن دسترسی ادمین
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admins
        WHERE user_id = auth.uid()
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تابع برای چک کردن یک فیچر خاص برای کاربر
CREATE OR REPLACE FUNCTION has_feature(p_user_id UUID, p_feature_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_has_feature BOOLEAN;
    v_is_enabled_globally BOOLEAN;
BEGIN
    -- اول چک می‌کنیم که آیا این فیچر برای همه فعاله
    SELECT is_enabled_globally INTO v_is_enabled_globally
    FROM feature_flags
    WHERE feature_key = p_feature_key;

    IF v_is_enabled_globally THEN
        RETURN true;
    END IF;

    -- چک می‌کنیم که آیا کاربر این فیچر رو داره
    SELECT
        CASE
            WHEN expires_at IS NULL THEN is_enabled
            WHEN expires_at > NOW() THEN is_enabled
            ELSE false
        END INTO v_has_feature
    FROM user_features
    WHERE user_id = p_user_id
    AND feature_key = p_feature_key;

    RETURN COALESCE(v_has_feature, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تابع برای گرفتن تمام فیچرهای یک کاربر
CREATE OR REPLACE FUNCTION get_user_features(p_user_id UUID)
RETURNS TABLE(
    feature_key TEXT,
    feature_name TEXT,
    is_enabled BOOLEAN,
    expires_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ff.feature_key,
        ff.feature_name,
        COALESCE(
            CASE
                WHEN ff.is_enabled_globally THEN true
                WHEN uf.expires_at IS NULL THEN uf.is_enabled
                WHEN uf.expires_at > NOW() THEN uf.is_enabled
                ELSE false
            END,
            false
        ) as is_enabled,
        uf.expires_at
    FROM feature_flags ff
    LEFT JOIN user_features uf ON uf.feature_key = ff.feature_key AND uf.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Triggers for updated_at
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_features_updated_at BEFORE UPDATE ON user_features
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- تمام!
-- ==========================================

-- نکته: برای اضافه کردن اولین super_admin، بعد از ثبت‌نام این دستور رو اجرا کنید:
-- INSERT INTO admins (user_id, email, role)
-- VALUES ('YOUR_USER_ID', 'your-email@example.com', 'super_admin');
