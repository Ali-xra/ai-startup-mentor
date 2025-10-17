# 💰 Investor Portal MVP - Implementation Plan

> **تاریخ شروع:** آماده برای اجرا
> **مدت زمان تخمینی:** 7-10 روز
> **هدف:** راه‌اندازی یک پنل ساده و کاربردی برای سرمایه‌گذاران

---

## 🎯 اهداف MVP

### چی می‌خوایم بسازیم؟
```
یک پنل ساده که:
├─ سرمایه‌گذارها بتونن ثبت‌نام کنن
├─ پروفایلشون رو تکمیل کنن
├─ پروژه‌های عمومی رو ببینن
├─ فیلتر و جستجو کنن
├─ به پروژه‌ها علاقه نشون بدن
└─ با صاحب پروژه ارتباط برقرار کنن
```

### چی توی MVP نیست؟ (فاز بعدی)
```
❌ پرداخت و پلن‌های پولی
❌ Analytics پیشرفته
❌ Messaging پیچیده
❌ Mobile app
❌ AI suggestions
```

---

## 📊 فازهای اجرا

### فاز 1: Database Setup (روز 1-2)
### فاز 2: Authentication & Profiles (روز 3-4)
### فاز 3: Project Discovery (روز 5-6)
### فاز 4: Connections (روز 7-8)
### فاز 5: Admin Panel (روز 9)
### فاز 6: Testing & Polish (روز 10)

---

## 🗃️ فاز 1: Database Setup (روز 1-2)

### هدف
ساخت تمام جداول، RLS policies، و functions مورد نیاز

---

### مرحله 1.1: ایجاد جداول پایه

**فایل:** `supabase/migrations/001_investor_portal_base_tables.sql`

```sql
-- ============================================
-- 1. توسعه جدول users
-- ============================================

-- اضافه کردن فیلدهای جدید
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'idea_creator';
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP;

-- ایجاد index برای بهینه‌سازی
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_verified ON users(verified);

-- ============================================
-- 2. جدول user_profiles
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- اطلاعات عمومی
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,

  -- تنظیمات
  profile_visibility TEXT DEFAULT 'public',

  -- متادیتا
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id)
);

-- ============================================
-- 3. جدول investor_profiles
-- ============================================

CREATE TABLE IF NOT EXISTS investor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- اطلاعات سرمایه‌گذاری
  investor_type TEXT, -- 'angel', 'vc', 'corporate', 'partner'
  company_name TEXT,

  -- بازه سرمایه‌گذاری (به دلار)
  investment_min NUMERIC,
  investment_max NUMERIC,

  -- علایق (آرایه‌ها)
  preferred_industries TEXT[],
  preferred_stages TEXT[],
  preferred_locations TEXT[],

  -- تجربه
  years_of_experience INTEGER,
  portfolio JSONB DEFAULT '[]'::jsonb,

  -- وضعیت Verification
  tier TEXT DEFAULT 'free', -- 'free', 'verified', 'premium'
  verification_notes TEXT,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),

  -- محدودیت‌های Free tier
  monthly_project_views INTEGER DEFAULT 0,
  last_view_reset TIMESTAMP DEFAULT NOW(),

  -- متادیتا
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_investor_profiles_tier ON investor_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_investor_profiles_industries ON investor_profiles USING GIN(preferred_industries);

-- ============================================
-- 4. توسعه جدول projects
-- ============================================

-- اضافه کردن فیلدهای جدید
ALTER TABLE projects ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS seeking_investment BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS investment_amount NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS equity_offered NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS pitch_deck_url TEXT;

-- آمار
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS interest_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_seeking_investment ON projects(seeking_investment);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- ============================================
-- 5. جدول project_views
-- ============================================

CREATE TABLE IF NOT EXISTS project_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES users(id) ON DELETE CASCADE,

  viewed_at TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Unique constraint: یک بازدید در روز برای هر کاربر
CREATE UNIQUE INDEX IF NOT EXISTS idx_project_views_unique
  ON project_views(project_id, viewer_id, (viewed_at::date));

CREATE INDEX IF NOT EXISTS idx_project_views_project ON project_views(project_id);
CREATE INDEX IF NOT EXISTS idx_project_views_viewer ON project_views(viewer_id);

-- ============================================
-- 6. جدول connections
-- ============================================

CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- طرفین
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  investor_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- وضعیت
  status TEXT DEFAULT 'pending',
  -- مقادیر: 'pending', 'accepted', 'rejected', 'contacted', 'closed'

  -- پیام اولیه
  message TEXT,

  -- پاسخ
  response TEXT,

  -- تایم‌لاین
  requested_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  last_activity TIMESTAMP DEFAULT NOW(),

  -- متادیتا
  metadata JSONB DEFAULT '{}'::jsonb,

  UNIQUE(project_id, investor_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_project ON connections(project_id);
CREATE INDEX IF NOT EXISTS idx_connections_investor ON connections(investor_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);

-- ============================================
-- 7. جدول connection_messages
-- ============================================

CREATE TABLE IF NOT EXISTS connection_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE,

  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,

  message TEXT NOT NULL,

  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),

  CHECK (char_length(message) > 0)
);

CREATE INDEX IF NOT EXISTS idx_connection_messages_connection ON connection_messages(connection_id);

-- ============================================
-- 8. جدول verification_requests
-- ============================================

CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  request_type TEXT NOT NULL,

  submitted_data JSONB NOT NULL,

  status TEXT DEFAULT 'pending',

  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  admin_notes TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_requests_user ON verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);

-- ============================================
-- 9. جدول saved_projects (برای ذخیره پروژه‌ها)
-- ============================================

CREATE TABLE IF NOT EXISTS saved_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,

  saved_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,

  UNIQUE(user_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_projects_user ON saved_projects(user_id);
```

---

### مرحله 1.2: ایجاد RLS Policies

**فایل:** `supabase/migrations/002_investor_portal_rls_policies.sql`

```sql
-- ============================================
-- RLS Policies
-- ============================================

-- 1. user_profiles
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- همه می‌تونن پروفایل‌های عمومی رو ببینن
CREATE POLICY "Public profiles are viewable by everyone"
  ON user_profiles FOR SELECT
  USING (profile_visibility = 'public');

-- کاربر می‌تونه پروفایل خودش رو ببینه
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- کاربر می‌تونه پروفایل خودش رو ویرایش کنه
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- کاربر می‌تونه پروفایل خودش رو بسازه
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. investor_profiles
-- ============================================

ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;

-- Verified investors قابل مشاهده هستن
CREATE POLICY "Verified investor profiles are viewable"
  ON investor_profiles FOR SELECT
  USING (tier IN ('verified', 'premium'));

-- سرمایه‌گذار می‌تونه پروفایل خودش رو ببینه
CREATE POLICY "Investors can view their own profile"
  ON investor_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- سرمایه‌گذار می‌تونه پروفایل خودش رو ویرایش کنه
CREATE POLICY "Investors can update their own profile"
  ON investor_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- سرمایه‌گذار می‌تونه پروفایل خودش رو بسازه
CREATE POLICY "Investors can insert their own profile"
  ON investor_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. projects (توسعه policies موجود)
-- ============================================

-- پروژه‌های عمومی قابل مشاهده
CREATE POLICY "Public projects are viewable by everyone"
  ON projects FOR SELECT
  USING (visibility = 'public');

-- (policies قبلی برای صاحب پروژه باقی می‌مونن)

-- ============================================
-- 4. project_views
-- ============================================

ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

-- صاحب پروژه می‌تونه بازدیدهای پروژش رو ببینه
CREATE POLICY "Project owners can view their project views"
  ON project_views FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- همه می‌تونن view ثبت کنن
CREATE POLICY "Anyone can insert views"
  ON project_views FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 5. connections
-- ============================================

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- صاحب پروژه می‌تونه connection های پروژش رو ببینه
CREATE POLICY "Project owners can view their connections"
  ON connections FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- سرمایه‌گذار می‌تونه connection های خودش رو ببینه
CREATE POLICY "Investors can view their connections"
  ON connections FOR SELECT
  USING (auth.uid() = investor_id);

-- سرمایه‌گذار می‌تونه connection بسازه
CREATE POLICY "Investors can create connections"
  ON connections FOR INSERT
  WITH CHECK (auth.uid() = investor_id);

-- صاحب پروژه می‌تونه connection رو آپدیت کنه (برای accept/reject)
CREATE POLICY "Project owners can update connections"
  ON connections FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 6. connection_messages
-- ============================================

ALTER TABLE connection_messages ENABLE ROW LEVEL SECURITY;

-- شرکت‌کنندگان connection می‌تونن پیام‌ها رو ببینن
CREATE POLICY "Connection participants can view messages"
  ON connection_messages FOR SELECT
  USING (
    connection_id IN (
      SELECT id FROM connections
      WHERE investor_id = auth.uid()
         OR project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    )
  );

-- شرکت‌کنندگان می‌تونن پیام بفرستن
CREATE POLICY "Connection participants can send messages"
  ON connection_messages FOR INSERT
  WITH CHECK (
    connection_id IN (
      SELECT id FROM connections
      WHERE investor_id = auth.uid()
         OR project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    )
    AND sender_id = auth.uid()
  );

-- ============================================
-- 7. verification_requests
-- ============================================

ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- کاربر می‌تونه درخواست‌های خودش رو ببینه
CREATE POLICY "Users can view their own verification requests"
  ON verification_requests FOR SELECT
  USING (auth.uid() = user_id);

-- کاربر می‌تونه درخواست verification بفرسته
CREATE POLICY "Users can create verification requests"
  ON verification_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 8. saved_projects
-- ============================================

ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;

-- کاربر می‌تونه پروژه‌های ذخیره شده خودش رو ببینه
CREATE POLICY "Users can view their saved projects"
  ON saved_projects FOR SELECT
  USING (auth.uid() = user_id);

-- کاربر می‌تونه پروژه save کنه
CREATE POLICY "Users can save projects"
  ON saved_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- کاربر می‌تونه پروژه رو از لیست saved حذف کنه
CREATE POLICY "Users can unsave projects"
  ON saved_projects FOR DELETE
  USING (auth.uid() = user_id);
```

---

### مرحله 1.3: ایجاد Database Functions

**فایل:** `supabase/migrations/003_investor_portal_functions.sql`

```sql
-- ============================================
-- Database Functions
-- ============================================

-- 1. افزایش view count
-- ============================================

CREATE OR REPLACE FUNCTION increment_project_view(
  p_project_id UUID,
  p_viewer_id UUID DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- افزایش view_count
  UPDATE projects
  SET view_count = view_count + 1
  WHERE id = p_project_id;

  -- ثبت بازدید (اگر viewer_id داده شده باشه)
  IF p_viewer_id IS NOT NULL THEN
    INSERT INTO project_views (project_id, viewer_id, ip_address, user_agent)
    VALUES (p_project_id, p_viewer_id, p_ip_address, p_user_agent)
    ON CONFLICT (project_id, viewer_id, viewed_at::date) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. چک کردن محدودیت Free tier
-- ============================================

CREATE OR REPLACE FUNCTION check_investor_view_limit(p_investor_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_profile investor_profiles;
  v_can_view BOOLEAN;
BEGIN
  -- گرفتن پروفایل
  SELECT * INTO v_profile
  FROM investor_profiles
  WHERE user_id = p_investor_id;

  -- اگر پروفایلی وجود نداره، false
  IF v_profile IS NULL THEN
    RETURN false;
  END IF;

  -- اگر Verified یا Premium باشه، محدودیتی نداره
  IF v_profile.tier IN ('verified', 'premium') THEN
    RETURN true;
  END IF;

  -- ریست کردن شمارنده در اول ماه
  IF v_profile.last_view_reset < date_trunc('month', NOW()) THEN
    UPDATE investor_profiles
    SET monthly_project_views = 0,
        last_view_reset = NOW()
    WHERE user_id = p_investor_id;

    v_profile.monthly_project_views := 0;
  END IF;

  -- چک کردن محدودیت (10 پروژه در ماه)
  IF v_profile.monthly_project_views < 10 THEN
    -- افزایش شمارنده
    UPDATE investor_profiles
    SET monthly_project_views = monthly_project_views + 1
    WHERE user_id = p_investor_id;

    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. ایجاد Connection Request
-- ============================================

CREATE OR REPLACE FUNCTION create_connection_request(
  p_project_id UUID,
  p_investor_id UUID,
  p_message TEXT
)
RETURNS UUID AS $$
DECLARE
  v_connection_id UUID;
BEGIN
  -- چک کردن که investor واقعاً investor باشه
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE id = p_investor_id AND user_type = 'investor'
  ) THEN
    RAISE EXCEPTION 'User is not an investor';
  END IF;

  -- چک کردن که پروژه عمومی باشه
  IF NOT EXISTS (
    SELECT 1 FROM projects WHERE id = p_project_id AND visibility = 'public'
  ) THEN
    RAISE EXCEPTION 'Project is not public';
  END IF;

  -- ایجاد connection
  INSERT INTO connections (project_id, investor_id, message, status)
  VALUES (p_project_id, p_investor_id, p_message, 'pending')
  RETURNING id INTO v_connection_id;

  -- افزایش interest_count
  UPDATE projects
  SET interest_count = interest_count + 1
  WHERE id = p_project_id;

  RETURN v_connection_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. تایید/رد Connection
-- ============================================

CREATE OR REPLACE FUNCTION respond_to_connection(
  p_connection_id UUID,
  p_project_owner_id UUID,
  p_status TEXT, -- 'accepted' یا 'rejected'
  p_response TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- چک کردن که واقعاً صاحب پروژه هست
  IF NOT EXISTS (
    SELECT 1 FROM connections c
    JOIN projects p ON c.project_id = p.id
    WHERE c.id = p_connection_id AND p.user_id = p_project_owner_id
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- آپدیت connection
  UPDATE connections
  SET
    status = p_status,
    response = p_response,
    responded_at = NOW(),
    last_activity = NOW()
  WHERE id = p_connection_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. گرفتن پروژه‌های عمومی با فیلتر
-- ============================================

CREATE OR REPLACE FUNCTION get_public_projects(
  p_industries TEXT[] DEFAULT NULL,
  p_stages TEXT[] DEFAULT NULL,
  p_investment_min NUMERIC DEFAULT NULL,
  p_investment_max NUMERIC DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  industry TEXT,
  current_stage TEXT,
  seeking_investment BOOLEAN,
  investment_amount NUMERIC,
  equity_offered NUMERIC,
  view_count INTEGER,
  interest_count INTEGER,
  created_at TIMESTAMP,
  user_id UUID,
  owner_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.description,
    p.industry,
    p.current_stage,
    p.seeking_investment,
    p.investment_amount,
    p.equity_offered,
    p.view_count,
    p.interest_count,
    p.created_at,
    p.user_id,
    COALESCE(up.display_name, u.email) as owner_name
  FROM projects p
  JOIN users u ON p.user_id = u.id
  LEFT JOIN user_profiles up ON u.id = up.user_id
  WHERE
    p.visibility = 'public'
    AND (p_industries IS NULL OR p.industry = ANY(p_industries))
    AND (p_stages IS NULL OR p.current_stage = ANY(p_stages))
    AND (p_investment_min IS NULL OR p.investment_amount >= p_investment_min)
    AND (p_investment_max IS NULL OR p.investment_amount <= p_investment_max)
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### چک‌لیست فاز 1:
```
□ اجرای Migration 001 (ایجاد جداول)
□ اجرای Migration 002 (RLS Policies)
□ اجرای Migration 003 (Functions)
□ تست دیتابیس با SQL queries ساده
□ بررسی RLS policies با کاربرهای مختلف
□ مستندسازی schema
```

---

## 👤 فاز 2: Authentication & Profiles (روز 3-4)

### هدف
سیستم ثبت‌نام و پروفایل برای سرمایه‌گذاران

---

### مرحله 2.1: TypeScript Types

**فایل:** `types/investor.ts`

```typescript
export type InvestorType = 'angel' | 'vc' | 'corporate' | 'partner';
export type InvestorTier = 'free' | 'verified' | 'premium';

export interface InvestorProfile {
  id: string;
  user_id: string;
  investor_type: InvestorType | null;
  company_name: string | null;
  investment_min: number | null;
  investment_max: number | null;
  preferred_industries: string[];
  preferred_stages: string[];
  preferred_locations: string[];
  years_of_experience: number | null;
  portfolio: PortfolioItem[];
  tier: InvestorTier;
  verification_notes: string | null;
  verified_at: string | null;
  verified_by: string | null;
  monthly_project_views: number;
  last_view_reset: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  name: string;
  url?: string;
  amount?: number;
  year?: number;
  description?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  website: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  profile_visibility: 'public' | 'private' | 'verified_only';
  created_at: string;
  updated_at: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  request_type: 'investor_verification';
  submitted_data: InvestorVerificationData;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestorVerificationData {
  company_name?: string;
  investor_type: InvestorType;
  investment_range: {
    min: number;
    max: number;
  };
  industries: string[];
  linkedin: string;
  experience: string;
  portfolio: PortfolioItem[];
}
```

**فایل:** `types/project.ts` (توسعه types موجود)

```typescript
// اضافه کردن به Project interface موجود
export interface Project {
  // ... فیلدهای موجود

  // فیلدهای جدید:
  visibility: 'private' | 'public' | 'unlisted';
  seeking_investment: boolean;
  investment_amount: number | null;
  equity_offered: number | null;
  pitch_deck_url: string | null;
  view_count: number;
  interest_count: number;
  featured: boolean;
  featured_until: string | null;
}

export interface PublicProject extends Project {
  owner_name: string;
}
```

**فایل:** `types/connection.ts`

```typescript
export type ConnectionStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'contacted'
  | 'closed';

export interface Connection {
  id: string;
  project_id: string;
  investor_id: string;
  status: ConnectionStatus;
  message: string;
  response: string | null;
  requested_at: string;
  responded_at: string | null;
  last_activity: string;
  metadata: Record<string, any>;
}

export interface ConnectionWithDetails extends Connection {
  project: PublicProject;
  investor: InvestorProfile & { user_profile: UserProfile };
}

export interface ConnectionMessage {
  id: string;
  connection_id: string;
  sender_id: string;
  message: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
}
```

---

### مرحله 2.2: Services

**فایل:** `services/investorProfileService.ts`

```typescript
import { supabase } from './supabaseClient';
import type { InvestorProfile, UserProfile, VerificationRequest } from '../types/investor';

export const investorProfileService = {
  // ایجاد پروفایل سرمایه‌گذار
  async createInvestorProfile(data: Partial<InvestorProfile>): Promise<InvestorProfile> {
    const { data: profile, error } = await supabase
      .from('investor_profiles')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  // گرفتن پروفایل سرمایه‌گذار
  async getInvestorProfile(userId: string): Promise<InvestorProfile | null> {
    const { data, error } = await supabase
      .from('investor_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  // آپدیت پروفایل
  async updateInvestorProfile(
    userId: string,
    updates: Partial<InvestorProfile>
  ): Promise<InvestorProfile> {
    const { data, error } = await supabase
      .from('investor_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // درخواست Verification
  async requestVerification(
    userId: string,
    verificationData: any
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

  // چک کردن وضعیت verification
  async getVerificationStatus(userId: string): Promise<VerificationRequest | null> {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('request_type', 'investor_verification')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // ایجاد/آپدیت User Profile
  async upsertUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert([data])
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  // گرفتن User Profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // چک کردن محدودیت view
  async checkViewLimit(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('check_investor_view_limit', {
        p_investor_id: userId
      });

    if (error) throw error;
    return data;
  }
};
```

---

**فایل:** `services/investorProjectService.ts`

```typescript
import { supabase } from './supabaseClient';
import type { PublicProject } from '../types/project';

export interface ProjectFilters {
  industries?: string[];
  stages?: string[];
  investmentMin?: number;
  investmentMax?: number;
  limit?: number;
  offset?: number;
}

export const investorProjectService = {
  // گرفتن پروژه‌های عمومی
  async getPublicProjects(filters: ProjectFilters = {}): Promise<PublicProject[]> {
    const { data, error } = await supabase.rpc('get_public_projects', {
      p_industries: filters.industries || null,
      p_stages: filters.stages || null,
      p_investment_min: filters.investmentMin || null,
      p_investment_max: filters.investmentMax || null,
      p_limit: filters.limit || 20,
      p_offset: filters.offset || 0
    });

    if (error) throw error;
    return data;
  },

  // گرفتن جزئیات یک پروژه
  async getProjectById(projectId: string): Promise<PublicProject> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        user_profiles!inner(display_name),
        users!inner(email)
      `)
      .eq('id', projectId)
      .eq('visibility', 'public')
      .single();

    if (error) throw error;

    return {
      ...data,
      owner_name: data.user_profiles?.display_name || data.users?.email
    };
  },

  // ثبت بازدید
  async incrementView(projectId: string, userId?: string): Promise<void> {
    const { error } = await supabase.rpc('increment_project_view', {
      p_project_id: projectId,
      p_viewer_id: userId || null
    });

    if (error) throw error;
  },

  // Save کردن پروژه
  async saveProject(projectId: string, userId: string, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('saved_projects')
      .insert([{
        user_id: userId,
        project_id: projectId,
        notes: notes || null
      }]);

    if (error) throw error;
  },

  // Unsave کردن پروژه
  async unsaveProject(projectId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_projects')
      .delete()
      .eq('user_id', userId)
      .eq('project_id', projectId);

    if (error) throw error;
  },

  // گرفتن پروژه‌های Save شده
  async getSavedProjects(userId: string): Promise<PublicProject[]> {
    const { data, error } = await supabase
      .from('saved_projects')
      .select(`
        project_id,
        notes,
        projects (
          *,
          user_profiles!inner(display_name),
          users!inner(email)
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return data.map(item => ({
      ...item.projects,
      owner_name: item.projects.user_profiles?.display_name || item.projects.users?.email
    }));
  },

  // چک کردن اینکه پروژه save شده یا نه
  async isProjectSaved(projectId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('saved_projects')
      .select('id')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};
```

---

### مرحله 2.3: Components

**فایل:** `components/investor/InvestorSignup.tsx`

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

export const InvestorSignup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. ثبت‌نام
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: 'investor'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. آپدیت user_type در جدول users
        const { error: updateError } = await supabase
          .from('users')
          .update({ user_type: 'investor' })
          .eq('id', authData.user.id);

        if (updateError) throw updateError;

        // 3. هدایت به صفحه تکمیل پروفایل
        navigate('/investor/profile/setup');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">ثبت‌نام سرمایه‌گذار</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">ایمیل</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">رمز عبور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
        </button>
      </form>
    </div>
  );
};
```

**تذکر:** این فقط یک نمونه ساده است. در ادامه باید کامپوننت‌های کامل‌تر بنویسیم.

---

### چک‌لیست فاز 2:
```
□ ایجاد TypeScript types
□ ایجاد Services
□ کامپوننت ثبت‌نام سرمایه‌گذار
□ کامپوننت تکمیل پروفایل
□ کامپوننت درخواست Verification
□ تست flow کامل ثبت‌نام
```

---

## 🔍 فاز 3: Project Discovery (روز 5-6)

این فاز شامل صفحات:
- Investor Dashboard
- Explore Projects (با فیلتر)
- Project Detail Page
- Saved Projects

### کامپوننت‌های کلیدی:
```
components/investor/
├─ InvestorDashboard.tsx
├─ ProjectExplorer.tsx
├─ ProjectFilters.tsx
├─ ProjectCard.tsx
├─ ProjectDetailInvestor.tsx
└─ SavedProjects.tsx
```

---

## 🤝 فاز 4: Connections (روز 7-8)

این فاز شامل:
- سیستم Show Interest
- مدیریت Connection Requests برای Investors
- مدیریت Connection Requests برای Project Owners
- پیام‌رسانی ساده

---

## 🛠️ فاز 5: Admin Panel (روز 9)

صفحات ادمین برای:
- بررسی Verification Requests
- Approve/Reject سرمایه‌گذاران
- مدیریت کاربران

---

## ✨ فاز 6: Testing & Polish (روز 10)

- تست کامل تمام flows
- رفع باگ‌ها
- بهبود UI/UX
- آماده‌سازی برای لانچ

---

## 📝 نکات مهم برای اجرا

### 1. شروع از Database
```bash
# اجرای migrations به ترتیب:
001_investor_portal_base_tables.sql
002_investor_portal_rls_policies.sql
003_investor_portal_functions.sql
```

### 2. تست دیتابیس قبل از کدنویسی
```sql
-- تست ایجاد investor profile
-- تست RLS policies
-- تست functions
```

### 3. ساخت تدریجی کامپوننت‌ها
```
روز 3: Types + Services
روز 4: Signup + Profile Setup
روز 5-6: Discovery
روز 7-8: Connections
```

### 4. Checklist قبل از هر مرحله
```
□ Types آماده؟
□ Service functions آماده؟
□ Database RLS تست شده؟
□ UI mockup داریم؟
```

---

## 🎯 تعریف "Done" برای MVP

MVP زمانی تمومه که:
```
✅ سرمایه‌گذار می‌تونه ثبت‌نام کنه
✅ پروفایلش رو تکمیل کنه
✅ درخواست Verification بفرسته
✅ پروژه‌های عمومی رو ببینه
✅ فیلتر و جستجو کنه
✅ پروژه save کنه
✅ به پروژه‌ها علاقه نشون بده
✅ با صاحب پروژه (بعد از تایید) ارتباط برقرار کنه
✅ صاحب پروژه بتونه درخواست‌ها رو مدیریت کنه
✅ ادمین بتونه سرمایه‌گذارها رو تایید/رد کنه
```

---

## 🚀 آماده برای شروع!

این پلن کامل MVP سرمایه‌گذاران است. توی چت جدید:

1. از فاز 1 شروع کن (Database)
2. کدهای SQL رو بگیر و اجرا کن
3. بعد به سراغ فازهای بعدی بریم

موفق باشی! 💪
