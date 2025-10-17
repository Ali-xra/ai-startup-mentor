# 📋 دستورالعمل کامل پیاده‌سازی دیتابیس Supabase

## 🎯 **مروری بر پروژه**

این پروژه یک پلتفرم منتورینگ استارتاپ‌های هوش مصنوعی است که شامل دو گروه اصلی کاربران می‌شود:

### **کارآفرینان (Entrepreneurs):**
- ایجاد پروژه و دریافت مشاوره AI
- ۸ مرحله توسعه استارتاپ
- انتشار پروژه برای جذب سرمایه

### **سرمایه‌گذاران (Investors):**
- جستجو و فیلترینگ پروژه‌ها
- محدودیت بازدید ماهانه (۱۰ پروژه برای free)
- سیستم اتصال با کارآفرینان

---

## 🗄️ **ساختار جداول مورد نیاز**

### **مرحله ۱: ایجاد پروژه Supabase**
1. به [supabase.com](https://supabase.com) بروید
2. پروژه جدید ایجاد کنید
3. تنظیمات اولیه را تکمیل کنید

### **مرحله ۲: اجرای migrationهای اصلی**

#### **Migration ۱: جداول اصلی کاربران**
```sql
-- ایجاد جدول profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    bio TEXT,
    company TEXT,
    position TEXT,
    role TEXT DEFAULT 'entrepreneur' CHECK (role IN ('entrepreneur', 'investor')),
    user_type TEXT DEFAULT 'idea_creator',
    verified BOOLEAN DEFAULT false,
    verification_status TEXT DEFAULT 'unverified',
    verification_date TIMESTAMP WITH TIME ZONE,
    avatar_url TEXT,
    location TEXT,
    website TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    profile_visibility TEXT DEFAULT 'public',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایجاد جدول investor_profiles
CREATE TABLE investor_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
    investor_type TEXT CHECK (investor_type IN ('individual', 'vc', 'corporate', 'angel')),
    company_name TEXT,
    investment_min DECIMAL(15,2),
    investment_max DECIMAL(15,2),
    preferred_industries TEXT[],
    preferred_stages TEXT[],
    preferred_locations TEXT[],
    years_of_experience INTEGER,
    portfolio JSONB DEFAULT '[]'::jsonb,
    verification_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    monthly_project_views INTEGER DEFAULT 0,
    last_view_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Migration ۲: جداول پروژه‌ها**
```sql
-- ایجاد جدول projects (پروژه‌های خصوصی)
CREATE TABLE projects (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_name TEXT,
    initial_idea TEXT,
    stage TEXT,
    startup_data JSONB,
    messages JSONB,
    visibility TEXT DEFAULT 'private',
    seeking_investment BOOLEAN DEFAULT false,
    investment_amount DECIMAL(15,2),
    equity_offered DECIMAL(5,2),
    view_count INTEGER DEFAULT 0,
    interest_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    featured_until TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- ایجاد جدول public_projects (پروژه‌های عمومی)
CREATE TABLE public_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    phase_completed INTEGER DEFAULT 1,
    total_phases INTEGER DEFAULT 8,
    thumbnail_url TEXT,
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);
```

#### **Migration ۳: جداول تعاملات**
```sql
-- ایجاد جدول project_comments
CREATE TABLE project_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایجاد جدول project_likes
CREATE TABLE project_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- ایجاد جدول saved_projects
CREATE TABLE saved_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);

-- ایجاد جدول project_views
CREATE TABLE project_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, viewer_id, (viewed_at::date))
);
```

#### **Migration ۴: جداول اتصالات**
```sql
-- ایجاد جدول connections
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    message TEXT,
    response TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(project_id, investor_id)
);

-- ایجاد جدول connection_messages
CREATE TABLE connection_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Migration ۵: جداول سیستم**
```sql
-- ایجاد جدول stage_translations
CREATE TABLE stage_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id TEXT NOT NULL,
    language_code TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(stage_id, language_code)
);

-- ایجاد جدول feature_flags
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key TEXT UNIQUE NOT NULL,
    feature_name TEXT NOT NULL,
    feature_name_en TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    is_enabled_globally BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایجاد جدول user_features
CREATE TABLE user_features (
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

-- ایجاد جدول upgrade_requests
CREATE TABLE upgrade_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requested_plan TEXT NOT NULL DEFAULT 'pro' CHECK (requested_plan IN ('pro', 'enterprise')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    admin_notes TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایجاد جدول admins
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایجاد جدول admin_audit_log
CREATE TABLE admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_user_id UUID REFERENCES auth.users(id),
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایجاد جدول verification_requests
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL CHECK (request_type IN ('investor_verification')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    documents JSONB,
    admin_notes TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **مرحله ۳: فعال کردن RLS و پالیسی‌های امنیتی**

#### **پالیسی‌های جدول profiles:**
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by all" ON profiles
    FOR SELECT USING (profile_visibility = 'public' OR auth.uid() = id);
```

#### **پالیسی‌های جدول investor_profiles:**
```sql
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own investor profile" ON investor_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own investor profile" ON investor_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own investor profile" ON investor_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Verified investor profiles viewable by project owners" ON investor_profiles
    FOR SELECT USING (
        (tier = ANY (ARRAY['verified'::text, 'premium'::text])) AND
        (EXISTS (
            SELECT 1 FROM connections c
            WHERE (c.investor_id = investor_profiles.user_id) AND
            (c.project_id IN (SELECT projects.id FROM projects WHERE (projects.user_id = auth.uid())))
        ))
    );
```

#### **پالیسی‌های سایر جداول:**
```sql
-- پالیسی‌های projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view owned and shared projects" ON projects
    FOR SELECT USING (
        (auth.uid() = user_id) OR
        (id IN (SELECT project_members.project_id FROM project_members WHERE (project_members.user_id = auth.uid()) AND (project_members.status = 'accepted'::text)))
    );

CREATE POLICY "Users can insert projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update owned projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete owned projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- پالیسی‌های public_projects
ALTER TABLE public_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published projects" ON public_projects
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view their own projects" ON public_projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public_projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public_projects
    FOR DELETE USING (auth.uid() = user_id);

-- پالیسی‌های project_comments
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments" ON project_comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add comments" ON project_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON project_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON project_comments
    FOR DELETE USING (auth.uid() = user_id);

-- پالیسی‌های project_likes
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON project_likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like projects" ON project_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON project_likes
    FOR DELETE USING (auth.uid() = user_id);

-- پالیسی‌های saved_projects
ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved projects" ON saved_projects
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can save projects" ON saved_projects
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave projects" ON saved_projects
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can update their saved projects notes" ON saved_projects
    FOR UPDATE USING (user_id = auth.uid());

-- پالیسی‌های connections
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners can view their connections" ON connections
    FOR SELECT USING (project_id IN (SELECT projects.id FROM projects WHERE (projects.user_id = auth.uid())));

CREATE POLICY "Investors can view their connections" ON connections
    FOR SELECT USING (investor_id = auth.uid());

CREATE POLICY "Verified investors can create connections" ON connections
    FOR INSERT WITH CHECK (
        (investor_id = auth.uid()) AND
        (EXISTS (SELECT 1 FROM investor_profiles WHERE (investor_profiles.user_id = auth.uid()) AND (investor_profiles.tier = ANY (ARRAY['verified'::text, 'premium'::text]))))
    );

CREATE POLICY "Project owners can update connections" ON connections
    FOR UPDATE USING (project_id IN (SELECT projects.id FROM projects WHERE (projects.user_id = auth.uid())));

CREATE POLICY "Investors can update their connections" ON connections
    FOR UPDATE USING (investor_id = auth.uid());

-- پالیسی‌های connection_messages
ALTER TABLE connection_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Connection participants can view messages" ON connection_messages
    FOR SELECT USING (
        connection_id IN (
            SELECT connections.id FROM connections
            WHERE (connections.investor_id = auth.uid()) OR
            (connections.project_id IN (SELECT projects.id FROM projects WHERE (projects.user_id = auth.uid())))
        )
    );

CREATE POLICY "Connection participants can send messages" ON connection_messages
    FOR INSERT WITH CHECK (
        (connection_id IN (
            SELECT connections.id FROM connections
            WHERE (connections.investor_id = auth.uid()) OR
            (connections.project_id IN (SELECT projects.id FROM projects WHERE (projects.user_id = auth.uid())))
        )) AND
        (sender_id = auth.uid())
    );

CREATE POLICY "Message sender can update own messages" ON connection_messages
    FOR UPDATE USING (sender_id = auth.uid());

-- پالیسی‌های project_views
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners can view their project views" ON project_views
    FOR SELECT USING (project_id IN (SELECT projects.id FROM projects WHERE (projects.user_id = auth.uid())));

CREATE POLICY "Anyone can insert views" ON project_views
    FOR INSERT WITH CHECK (true);

-- پالیسی‌های stage_translations
ALTER TABLE stage_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON stage_translations
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON stage_translations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Allow authenticated update" ON stage_translations
    FOR UPDATE USING (auth.role() = 'authenticated'::text);

-- پالیسی‌های feature_flags
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view feature flags" ON feature_flags
    FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE (admins.user_id = auth.uid()) AND (admins.is_active = true)));

CREATE POLICY "Admins can update feature flags" ON feature_flags
    FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE (admins.user_id = auth.uid()) AND (admins.is_active = true)));

-- پالیسی‌های user_features
ALTER TABLE user_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own features" ON user_features
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all user features" ON user_features
    FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE (admins.user_id = auth.uid()) AND (admins.is_active = true)));

-- پالیسی‌های upgrade_requests
ALTER TABLE upgrade_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create upgrade requests" ON upgrade_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own upgrade requests" ON upgrade_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all upgrade requests" ON upgrade_requests
    FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE (admins.user_id = auth.uid()) AND (admins.is_active = true)));

CREATE POLICY "Admins can update upgrade requests" ON upgrade_requests
    FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE (admins.user_id = auth.uid()) AND (admins.is_active = true)));

-- پالیسی‌های admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own admin status" ON admins
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all admins" ON admins
    FOR ALL USING ((user_id = auth.uid()) AND (role = 'super_admin'::text) AND (is_active = true));

-- پالیسی‌های admin_audit_log
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON admin_audit_log
    FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE (admins.user_id = auth.uid()) AND (admins.is_active = true)));

-- پالیسی‌های verification_requests
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification requests" ON verification_requests
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create verification requests" ON verification_requests
    FOR INSERT WITH CHECK ((user_id = auth.uid()) AND (NOT (EXISTS (SELECT 1 FROM verification_requests verification_requests_1 WHERE ((verification_requests_1.user_id = auth.uid()) AND (verification_requests_1.status = 'pending'::text))))));

CREATE POLICY "Admins can view all verification requests" ON verification_requests
    FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE (admins.user_id = auth.uid()) AND (admins.is_active = true)));

CREATE POLICY "Admins can update verification requests" ON verification_requests
    FOR UPDATE USING (EXISTS (SELECT 1 FROM admins WHERE (admins.user_id = auth.uid()) AND (admins.is_active = true)));
```

### **مرحله ۴: ایجاد ایندکس‌ها برای عملکرد بهتر**

```sql
-- ایندکس‌های profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_verified ON profiles(verified);
CREATE INDEX idx_profiles_user_type ON profiles(user_type);

-- ایندکس‌های investor_profiles
CREATE INDEX idx_investor_profiles_tier ON investor_profiles(tier);
CREATE INDEX idx_investor_profiles_verified_at ON investor_profiles(verified_at);
CREATE INDEX idx_investor_profiles_monthly_views ON investor_profiles(monthly_project_views);

-- ایندکس‌های projects
CREATE INDEX idx_projects_visibility ON projects(visibility);
CREATE INDEX idx_projects_seeking_investment ON projects(seeking_investment);
CREATE INDEX idx_projects_featured ON projects(featured);

-- ایندکس‌های public_projects
CREATE INDEX idx_public_projects_user_id ON public_projects(user_id);
CREATE INDEX idx_public_projects_is_published ON public_projects(is_published);
CREATE INDEX idx_public_projects_created_at ON public_projects(created_at DESC);
CREATE INDEX idx_public_projects_likes_count ON public_projects(likes_count DESC);

-- ایندکس‌های project_comments
CREATE INDEX idx_project_comments_project_id ON project_comments(project_id);
CREATE INDEX idx_project_comments_user_id ON project_comments(user_id);
CREATE INDEX idx_project_comments_created_at ON project_comments(created_at DESC);

-- ایندکس‌های project_likes
CREATE INDEX idx_project_likes_project_id ON project_likes(project_id);
CREATE INDEX idx_project_likes_user_id ON project_likes(user_id);

-- ایندکس‌های saved_projects
CREATE INDEX idx_saved_projects_user ON saved_projects(user_id);
CREATE INDEX idx_saved_projects_project ON saved_projects(project_id);

-- ایندکس‌های connections
CREATE INDEX idx_connections_project ON connections(project_id);
CREATE INDEX idx_connections_investor ON connections(investor_id);
CREATE INDEX idx_connections_status ON connections(status);

-- ایندکس‌های connection_messages
CREATE INDEX idx_connection_messages_connection ON connection_messages(connection_id);

-- ایندکس‌های project_views
CREATE INDEX idx_project_views_project ON project_views(project_id);
CREATE INDEX idx_project_views_viewer ON project_views(viewer_id);

-- ایندکس‌های user_features
CREATE INDEX idx_user_features_user_id ON user_features(user_id);
CREATE INDEX idx_user_features_feature_key ON user_features(feature_key);
CREATE INDEX idx_user_features_expires_at ON user_features(expires_at) WHERE (expires_at IS NOT NULL);

-- ایندکس‌های upgrade_requests
CREATE INDEX idx_upgrade_requests_user_id ON upgrade_requests(user_id);
CREATE INDEX idx_upgrade_requests_status ON upgrade_requests(status);
CREATE INDEX idx_upgrade_requests_requested_at ON upgrade_requests(requested_at DESC);

-- ایندکس‌های verification_requests
CREATE INDEX idx_verification_requests_user ON verification_requests(user_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);

-- ایندکس‌های admins
CREATE INDEX idx_admins_user_id ON admins(user_id);
CREATE INDEX idx_admins_email ON admins(email);

-- ایندکس‌های admin_audit_log
CREATE INDEX idx_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_log_target_user_id ON admin_audit_log(target_user_id);
```

### **مرحله ۵: ایجاد توابع مفید**

#### **تابع handle_new_user (برای ساخت خودکار پروفایل)**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'name',
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ایجاد تریگر
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### **تابع check_investor_view_limit (بررسی محدودیت بازدید)**
```sql
CREATE OR REPLACE FUNCTION public.check_investor_view_limit(p_investor_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_profile RECORD;
BEGIN
  SELECT * INTO v_profile
  FROM investor_profiles
  WHERE user_id = p_investor_id;

  IF v_profile IS NULL THEN
    RETURN false;
  END IF;

  IF v_profile.tier IN ('verified', 'premium') THEN
    RETURN true;
  END IF;

  IF v_profile.last_view_reset < date_trunc('month', NOW()) THEN
    UPDATE investor_profiles
    SET monthly_project_views = 0,
        last_view_reset = NOW()
    WHERE user_id = p_investor_id;

    RETURN true;
  END IF;

  IF v_profile.monthly_project_views < 10 THEN
    UPDATE investor_profiles
    SET monthly_project_views = monthly_project_views + 1
    WHERE user_id = p_investor_id;

    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$function$
```

#### **توابع مدیریت پروژه‌ها**
```sql
-- تابع get_public_projects (دریافت پروژه‌های عمومی)
CREATE OR REPLACE FUNCTION public.get_public_projects(p_filter text DEFAULT 'all'::text, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
RETURNS TABLE(id uuid, user_id uuid, project_id uuid, title text, description text, phase_completed integer, total_phases integer, thumbnail_url text, tags text[], likes_count integer, comments_count integer, created_at timestamp with time zone, owner_name text, owner_avatar text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        pp.id,
        pp.user_id,
        pp.project_id,
        pp.title,
        pp.description,
        pp.phase_completed,
        pp.total_phases,
        pp.thumbnail_url,
        pp.tags,
        pp.likes_count,
        pp.comments_count,
        pp.created_at,
        COALESCE(
            (u.raw_user_meta_data->>'full_name')::TEXT,
            SPLIT_PART(u.email, '@', 1),
            'Anonymous'
        ) as owner_name,
        (u.raw_user_meta_data->>'avatar_url')::TEXT as owner_avatar
    FROM public.public_projects pp
    LEFT JOIN auth.users u ON pp.user_id = u.id
    WHERE pp.is_published = true
        AND CASE
            WHEN p_filter = 'trending' THEN pp.likes_count >= 5
            WHEN p_filter = 'completed' THEN pp.phase_completed = pp.total_phases
            WHEN p_filter = 'recent' THEN pp.created_at >= NOW() - INTERVAL '7 days'
            ELSE true
        END
    ORDER BY
        CASE
            WHEN p_filter = 'trending' THEN pp.likes_count
            WHEN p_filter = 'recent' THEN EXTRACT(EPOCH FROM pp.created_at)::INTEGER
            ELSE pp.likes_count
        END DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$function$

-- تابع has_feature (بررسی دسترسی به فیچر)
CREATE OR REPLACE FUNCTION public.has_feature(p_user_id uuid, p_feature_key text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    v_has_feature BOOLEAN;
    v_is_enabled_globally BOOLEAN;
BEGIN
    SELECT is_enabled_globally INTO v_is_enabled_globally
    FROM feature_flags
    WHERE feature_key = p_feature_key;

    IF v_is_enabled_globally THEN
        RETURN true;
    END IF;

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
$function$
```

### **مرحله ۶: درج داده‌های اولیه**

#### **درج ترجمه مراحل پروژه**
```sql
INSERT INTO stage_translations (stage_id, language_code, title, description) VALUES
('1', 'fa', 'ایده و خلاصه اجرایی', 'توصیف ایده اولیه و خلاصه اجرایی پروژه'),
('2', 'fa', 'تحلیل مشکل و بازار', 'شناسایی مشکل و تحلیل بازار هدف'),
('3', 'fa', 'راه‌حل و ارزش پیشنهادی', 'توصیف راه‌حل و ارزش پیشنهادی منحصر به فرد'),
('4', 'fa', 'تحلیل بازار و رقبا', 'بررسی بازار و تحلیل رقبا'),
('5', 'fa', 'مدل کسب‌وکار', 'طراحی مدل کسب‌وکار و منابع درآمد'),
('6', 'fa', 'برنامه‌ریزی محصول', 'برنامه‌ریزی توسعه محصول و MVP'),
('7', 'fa', 'برنامه بازاریابی و فروش', 'استراتژی بازاریابی و فروش'),
('8', 'fa', 'برنامه مالی و عملیاتی', 'برنامه‌ریزی مالی و عملیاتی');

-- ترجمه انگلیسی
INSERT INTO stage_translations (stage_id, language_code, title, description) VALUES
('1', 'en', 'Idea & Executive Summary', 'Describe your initial idea and executive summary'),
('2', 'en', 'Problem & Market Analysis', 'Identify the problem and analyze target market'),
('3', 'en', 'Solution & Value Proposition', 'Describe your solution and unique value proposition'),
('4', 'en', 'Market & Competitor Analysis', 'Market research and competitor analysis'),
('5', 'en', 'Business Model', 'Design business model and revenue streams'),
('6', 'en', 'Product Planning', 'Product development planning and MVP'),
('7', 'en', 'Marketing & Sales Plan', 'Marketing and sales strategy'),
('8', 'en', 'Financial & Operations Plan', 'Financial and operational planning');
```

#### **درج فیچرهای پیش‌فرض**
```sql
INSERT INTO feature_flags (feature_key, feature_name, feature_name_en, description, category, is_enabled_globally) VALUES
('unlimited_projects', 'پروژه‌های نامحدود', 'Unlimited Projects', 'امکان ایجاد پروژه‌های نامحدود', 'projects', true),
('ai_chat', 'چت با AI', 'AI Chat', 'دسترسی به چت با هوش مصنوعی', 'ai', true),
('export_projects', 'خروجی پروژه‌ها', 'Export Projects', 'امکان خروجی گرفتن از پروژه‌ها', 'export', true),
('team_collaboration', 'همکاری تیمی', 'Team Collaboration', 'امکان همکاری اعضای تیم روی پروژه‌ها', 'team', false),
('advanced_analytics', 'تحلیل‌های پیشرفته', 'Advanced Analytics', 'دسترسی به تحلیل‌های پیشرفته', 'analytics', false);
```

### **مرحله ۷: تست و اعتبارسنجی**

#### **تست احراز هویت**
1. ثبت‌نام کاربر جدید
2. انتخاب نقش (کارآفرین/سرمایه‌گذار)
3. لاگین با گوگل
4. بررسی ساخت پروفایل خودکار

#### **تست پروژه کارآفرینان**
1. ایجاد پروژه جدید
2. تکمیل مراحل پروژه
3. انتشار پروژه عمومی
4. تست چت با AI

#### **تست پنل سرمایه‌گذاران**
1. جستجوی پروژه‌ها
2. ذخیره پروژه‌ها
3. بررسی محدودیت بازدید ماهانه
4. تست اتصال با کارآفرینان

---

## 🚨 **نکات مهم امنیتی**

1. **همه پالیسی‌های RLS را بررسی کنید** - مطمئن شوید که کاربران فقط به داده‌های خود دسترسی دارند
2. **API keys را امن نگه دارید** - کلیدهای Supabase را در محیط production امن کنید
3. **Rate limiting اضافه کنید** - برای جلوگیری از سوءاستفاده از APIها
4. **Input validation** - تمام ورودی‌های کاربر را اعتبارسنجی کنید

---

## 📊 **مراحل بعدی پس از پیاده‌سازی**

1. **تنظیم دامنه و SSL** - اتصال دامنه و گواهی SSL
2. **مانیتورینگ** - راه‌اندازی سیستم لاگ‌گیری و مانیتورینگ
3. **بکاپ‌گیری** - تنظیم بکاپ خودکار دیتابیس
4. **مستندسازی API** - مستندسازی APIها برای توسعه‌دهندگان
5. **تست بار** - تست عملکرد با تعداد زیاد کاربر

---

این دستورالعمل کامل باید برای پیاده‌سازی کامل دیتابیس کافی باشد. اگر در هر مرحله به مشکل برخوردید، لطفاً جزئیات خطا را گزارش دهید تا بتوانم کمک کنم.
