# 🚀 IDE Maker - Platform Expansion Master Plan

> **تاریخ:** 2025-10-16
> **وضعیت:** Planning Phase
> **هدف:** توسعه پلتفرم از IDE Maker به یک اکوسیستم کامل کسب‌وکار

---

## 📋 فهرست مطالب

1. [نگاه کلی (Overview)](#نگاه-کلی-overview)
2. [انواع کاربران (User Types)](#انواع-کاربران-user-types)
3. [معماری دیتابیس (Database Schema)](#معماری-دیتابیس-database-schema)
4. [فازهای توسعه (Development Phases)](#فازهای-توسعه-development-phases)
5. [مدل درآمدزایی (Monetization)](#مدل-درآمدزایی-monetization)
6. [امنیت و Privacy](#امنیت-و-privacy)
7. [نقشه راه (Roadmap)](#نقشه-راه-roadmap)

---

## نگاه کلی (Overview)

### وضعیت فعلی
```
┌─────────────────────────────────┐
│   IDE Maker (Current State)     │
│                                 │
│  User → Creates Idea → Gets     │
│         Blueprint               │
└─────────────────────────────────┘
```

### چشم‌انداز آینده
```
┌──────────────────────────────────────────────────────────┐
│              IDE Maker Ecosystem                         │
│                                                          │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────┐ │
│  │Idea Creators│◄──►│  Investors   │◄──►│ Developers │ │
│  └─────────────┘    └──────────────┘    └────────────┘ │
│         ▲                  ▲                    ▲       │
│         │                  │                    │       │
│         └──────────────────┴────────────────────┘       │
│                      Platform                           │
└──────────────────────────────────────────────────────────┘
```

### اصول طراحی
1. **توسعه‌پذیری (Scalability)**: معماری باید برای افزودن نقش‌های جدید آماده باشه
2. **سادگی شروع (Simple Start)**: اول MVP ساده، بعد توسعه
3. **کیفیت (Quality)**: سیستم Verification و کنترل کیفیت
4. **درآمدزایی (Monetization)**: مدل Freemium با قابلیت توسعه

---

## انواع کاربران (User Types)

### 1️⃣ Idea Creator (موجود - نیاز به توسعه)

**توضیح:**
کاربری که ایده کسب‌وکار دارد و با استفاده از IDE Maker آن را به بلوپرینت تبدیل می‌کند.

**امکانات فعلی:**
- ✅ ساخت پروژه
- ✅ تکمیل مراحل (Phases)
- ✅ دریافت Blueprint
- ✅ مدیریت پروژه‌ها

**امکانات جدید (نیاز به توسعه):**
- 🆕 عمومی کردن پروژه (Make Public)
- 🆕 تنظیم نیاز به سرمایه‌گذاری
- 🆕 مشاهده علاقه‌مندی‌های سرمایه‌گذاران
- 🆕 مدیریت درخواست‌های اتصال (Connection Requests)
- 🆕 آمار و تحلیل (چند نفر دیدن، چند نفر علاقمند شدن)
- 🆕 Upgrade به Pro Plan

**Plans:**
```
Free Plan:
├─ تا 3 پروژه
├─ 1 پروژه می‌تونه عمومی بشه
├─ آمار ساده
└─ AI suggestions محدود

Pro Plan ($15/month):
├─ پروژه‌های نامحدود
├─ همه پروژه‌ها می‌تونن عمومی بشن
├─ آمار پیشرفته
├─ 1 Featured project
└─ AI suggestions نامحدود

Team Plan ($49/month) [آینده]:
├─ همه چیز Pro
├─ تا 5 عضو تیم
├─ Collaboration tools
└─ Priority support
```

---

### 2️⃣ Investor (جدید - فاز 1)

**توضیح:**
سرمایه‌گذار یا شرکتی که به دنبال پروژه‌های جدید برای سرمایه‌گذاری است.

**نقش‌های مختلف:**
- 👤 سرمایه‌گذار انفرادی (Angel Investor)
- 🏢 شرکت سرمایه‌گذاری (VC)
- 🤝 شریک تجاری (Business Partner)

**امکانات:**
- 🔍 جستجو و فیلتر پروژه‌های عمومی
- 👁️ مشاهده Blueprint کامل
- ⭐ ذخیره پروژه‌ها (Save for later)
- 💬 نشان دادن علاقه‌مندی (Show Interest)
- 📊 مدیریت پروژه‌های علاقه‌مند
- 📈 Dashboard اختصاصی

**Tiers:**
```
Free Tier:
├─ تایید ایمیل و تلفن
├─ مشاهده 10 پروژه در ماه
├─ فیلترهای ساده (صنعت، مرحله)
└─ نمی‌تونه مستقیماً تماس بگیره

Verified Tier (رایگان اما نیاز به تایید):
├─ بررسی دستی ادمین
├─ مشاهده نامحدود پروژه‌ها
├─ فیلترهای پیشرفته
├─ امکان Show Interest
├─ دسترسی به اطلاعات تماس (بعد از تایید صاحب پروژه)
└─ ذخیره نامحدود

Premium Tier ($99/month) [فاز 2]:
├─ همه چیز Verified
├─ Early Access (7 روز زودتر)
├─ Advanced Analytics
├─ Export Data
├─ Direct Messaging
└─ Investment Portfolio Tracker
```

**فرآیند Verification:**
```
1. ثبت‌نام اولیه
   └─ ایمیل + شماره تلفن

2. تکمیل پروفایل سرمایه‌گذار
   ├─ نام و شرکت
   ├─ بازه سرمایه‌گذاری
   ├─ صنایع مورد علاقه
   ├─ تجربیات قبلی
   └─ لینک LinkedIn

3. درخواست Verification
   └─ ارسال برای بررسی ادمین

4. بررسی دستی
   ├─ بررسی اطلاعات
   ├─ چک کردن LinkedIn
   └─ تایید یا رد

5. Verified Investor
   └─ دسترسی کامل
```

---

### 3️⃣ Developer/CTO (آینده - فاز 3)

**توضیح:**
برنامه‌نویس یا CTO که به دنبال پروژه برای ساخت یا شراکت است.

**امکانات:**
- مشاهده پروژه‌هایی که به Developer نیاز دارن
- پیشنهاد ساخت MVP
- همکاری به عنوان Co-founder فنی

**Tiers:**
```
Free:
├─ مشاهده پروژه‌ها
└─ ارسال پیشنهاد (محدود)

Pro ($29/month):
├─ پیشنهادات نامحدود
└─ Portfolio نمایش
```

---

### 4️⃣ Designer (آینده - فاز 3)

**توضیح:**
طراح UI/UX که می‌خواهد در پروژه‌های استارتاپی همکاری کند.

**امکانات:**
- مشاهده پروژه‌های نیازمند طراحی
- ارائه پیشنهاد طراحی

---

### 5️⃣ Business Consultant (آینده - فاز 4)

**توضیح:**
مشاور کسب‌وکار که می‌تواند به Idea Creators کمک کند.

**امکانات:**
- ارائه مشاوره
- بهبود بلوپرینت‌ها

---

### 6️⃣ Co-founder Seeker (آینده - فاز 4)

**توضیح:**
کسی که به دنبال شریک تجاری برای ایده‌اش است.

**امکانات:**
- پست گذاشتن برای پیدا کردن Co-founder
- Matching با افراد مناسب

---

## معماری دیتابیس (Database Schema)

### نگاه کلی

```
users (موجود)
├─ user_profiles (جدید)
├─ investor_profiles (جدید)
├─ developer_profiles (آینده)
└─ designer_profiles (آینده)

projects (موجود - نیاز به توسعه)
├─ project_visibility (جدید)
├─ project_investment_info (جدید)
└─ project_stats (جدید)

connections (جدید)
├─ connection_messages (جدید)
└─ connection_history (جدید)

subscriptions (جدید)
└─ subscription_history (جدید)
```

---

### جداول جدید و تغییرات

#### 1. توسعه جدول `users`

```sql
-- اضافه کردن فیلدهای جدید به جدول موجود users
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'idea_creator';
-- مقادیر: 'idea_creator', 'investor', 'developer', 'designer', 'consultant'

ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
-- مقادیر: 'unverified', 'pending', 'verified', 'rejected'

ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP;
```

---

#### 2. جدول `user_profiles` (پروفایل عمومی)

```sql
CREATE TABLE user_profiles (
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
  profile_visibility TEXT DEFAULT 'public', -- 'public', 'private', 'verified_only'

  -- متادیتا
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id)
);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON user_profiles FOR SELECT
  USING (profile_visibility = 'public');

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

#### 3. جدول `investor_profiles` (پروفایل سرمایه‌گذار)

```sql
CREATE TABLE investor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- اطلاعات سرمایه‌گذاری
  investor_type TEXT, -- 'angel', 'vc', 'corporate', 'partner'
  company_name TEXT,

  -- بازه سرمایه‌گذاری (به دلار)
  investment_min NUMERIC,
  investment_max NUMERIC,

  -- علایق
  preferred_industries TEXT[], -- آرایه از صنایع: ['technology', 'healthcare', ...]
  preferred_stages TEXT[], -- آرایه از مراحل: ['idea', 'mvp', 'launch', ...]
  preferred_locations TEXT[], -- آرایه از مکان‌ها

  -- تجربه
  years_of_experience INTEGER,
  portfolio JSONB, -- آرایه‌ای از پروژه‌های قبلی
  -- مثال: [{"name": "Project X", "url": "...", "amount": 50000, "year": 2023}]

  -- وضعیت Verification
  tier TEXT DEFAULT 'free', -- 'free', 'verified', 'premium'
  verification_notes TEXT, -- یادداشت‌های ادمین
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),

  -- محدودیت‌ها (برای Free tier)
  monthly_project_views INTEGER DEFAULT 0,
  last_view_reset TIMESTAMP DEFAULT NOW(),

  -- متادیتا
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id)
);

-- RLS Policies
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Verified investor profiles are viewable by project owners"
  ON investor_profiles FOR SELECT
  USING (tier IN ('verified', 'premium'));

CREATE POLICY "Investors can view their own profile"
  ON investor_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Investors can update their own profile"
  ON investor_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Investors can insert their own profile"
  ON investor_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

#### 4. توسعه جدول `projects`

```sql
-- اضافه کردن فیلدهای جدید به جدول موجود projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private';
-- مقادیر: 'private', 'public', 'unlisted'

ALTER TABLE projects ADD COLUMN IF NOT EXISTS seeking_investment BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS investment_amount NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS equity_offered NUMERIC; -- درصد
ALTER TABLE projects ADD COLUMN IF NOT EXISTS pitch_deck_url TEXT;

-- آمار
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS interest_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP;
```

---

#### 5. جدول `project_views` (ترک کردن بازدیدها)

```sql
CREATE TABLE project_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- جزئیات بازدید
  viewed_at TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,

  -- متادیتا
  UNIQUE(project_id, viewer_id, viewed_at::date) -- یک بازدید در روز برای هر کاربر
);

-- Index برای سرعت
CREATE INDEX idx_project_views_project ON project_views(project_id);
CREATE INDEX idx_project_views_viewer ON project_views(viewer_id);

-- RLS Policies
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners can view their project views"
  ON project_views FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert views"
  ON project_views FOR INSERT
  WITH CHECK (true);
```

---

#### 6. جدول `connections` (اتصالات بین Investors و Projects)

```sql
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- طرفین
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  investor_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- وضعیت
  status TEXT DEFAULT 'pending',
  -- مقادیر: 'pending', 'accepted', 'rejected', 'contacted', 'meeting', 'invested', 'closed'

  -- پیام اولیه سرمایه‌گذار
  message TEXT,

  -- پاسخ صاحب پروژه
  response TEXT,

  -- تایم‌لاین
  requested_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  last_activity TIMESTAMP DEFAULT NOW(),

  -- متادیتا
  metadata JSONB, -- برای اطلاعات اضافی در آینده

  UNIQUE(project_id, investor_id)
);

-- Indexes
CREATE INDEX idx_connections_project ON connections(project_id);
CREATE INDEX idx_connections_investor ON connections(investor_id);
CREATE INDEX idx_connections_status ON connections(status);

-- RLS Policies
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners can view their connections"
  ON connections FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Investors can view their own connections"
  ON connections FOR SELECT
  USING (auth.uid() = investor_id);

CREATE POLICY "Investors can create connections"
  ON connections FOR INSERT
  WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "Project owners can update their connections"
  ON connections FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );
```

---

#### 7. جدول `connection_messages` (پیام‌های بین طرفین)

```sql
CREATE TABLE connection_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE,

  -- فرستنده
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- محتوا
  message TEXT NOT NULL,

  -- وضعیت
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,

  -- متادیتا
  created_at TIMESTAMP DEFAULT NOW(),

  CHECK (char_length(message) > 0)
);

-- Index
CREATE INDEX idx_connection_messages_connection ON connection_messages(connection_id);

-- RLS Policies
ALTER TABLE connection_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Connection participants can view messages"
  ON connection_messages FOR SELECT
  USING (
    connection_id IN (
      SELECT id FROM connections
      WHERE investor_id = auth.uid()
         OR project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    )
  );

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
```

---

#### 8. جدول `subscriptions` (اشتراک‌ها)

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- نوع کاربر و پلن
  user_type TEXT NOT NULL, -- 'idea_creator', 'investor'
  plan_type TEXT NOT NULL, -- 'free', 'pro', 'premium', 'team'

  -- قیمت و دوره
  amount NUMERIC,
  currency TEXT DEFAULT 'USD',
  billing_period TEXT, -- 'monthly', 'annually'

  -- وضعیت
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'paused'

  -- تاریخ‌ها
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  cancelled_at TIMESTAMP,

  -- اطلاعات پرداخت
  payment_provider TEXT, -- 'stripe', 'paypal', etc.
  payment_id TEXT,

  -- متادیتا
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id)
);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- فقط از طریق server-side functions می‌تونه insert/update بشه
```

---

#### 9. جدول `verification_requests` (درخواست‌های تایید)

```sql
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- نوع درخواست
  request_type TEXT NOT NULL, -- 'investor_verification', 'developer_verification', etc.

  -- اطلاعات ارسالی
  submitted_data JSONB NOT NULL,
  -- مثال برای investor:
  -- {
  --   "company_name": "...",
  --   "investment_range": {...},
  --   "linkedin": "...",
  --   "experience": "...",
  --   "portfolio": [...]
  -- }

  -- وضعیت
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'

  -- بررسی
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  admin_notes TEXT,

  -- تاریخ‌ها
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_verification_requests_user ON verification_requests(user_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);

-- RLS Policies
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification requests"
  ON verification_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create verification requests"
  ON verification_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

### Database Functions

#### Function 1: افزایش شمارنده بازدید

```sql
CREATE OR REPLACE FUNCTION increment_project_view(
  p_project_id UUID,
  p_viewer_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- افزایش view_count
  UPDATE projects
  SET view_count = view_count + 1
  WHERE id = p_project_id;

  -- ثبت بازدید (اگر viewer_id داده شده باشه)
  IF p_viewer_id IS NOT NULL THEN
    INSERT INTO project_views (project_id, viewer_id)
    VALUES (p_project_id, p_viewer_id)
    ON CONFLICT (project_id, viewer_id, viewed_at::date) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Function 2: چک کردن محدودیت Free Tier برای Investor

```sql
CREATE OR REPLACE FUNCTION check_investor_view_limit(p_investor_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_profile investor_profiles;
  v_can_view BOOLEAN;
BEGIN
  -- گرفتن پروفایل سرمایه‌گذار
  SELECT * INTO v_profile
  FROM investor_profiles
  WHERE user_id = p_investor_id;

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
```

#### Function 3: ایجاد Connection Request

```sql
CREATE OR REPLACE FUNCTION create_connection_request(
  p_project_id UUID,
  p_investor_id UUID,
  p_message TEXT
)
RETURNS UUID AS $$
DECLARE
  v_connection_id UUID;
  v_project_owner UUID;
BEGIN
  -- ایجاد connection
  INSERT INTO connections (project_id, investor_id, message, status)
  VALUES (p_project_id, p_investor_id, p_message, 'pending')
  RETURNING id INTO v_connection_id;

  -- افزایش interest_count پروژه
  UPDATE projects
  SET interest_count = interest_count + 1
  WHERE id = p_project_id;

  -- TODO: ارسال نوتیفیکیشن به صاحب پروژه

  RETURN v_connection_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## فازهای توسعه (Development Phases)

### فاز 0: آماده‌سازی (1 روز)
```
✅ بررسی و تایید پلن
✅ تصمیم‌گیری درباره جزئیات
✅ آماده‌سازی محیط توسعه
```

---

### فاز 1: Foundation & Database (2-3 روز)

**هدف:** آماده‌سازی زیرساخت دیتابیس و امنیت

**وظایف:**
```
□ ایجاد جداول جدید:
  ├─ user_profiles
  ├─ investor_profiles
  ├─ project_views
  ├─ connections
  ├─ connection_messages
  ├─ subscriptions
  └─ verification_requests

□ تغییر جداول موجود:
  ├─ users (اضافه کردن user_type, verified, ...)
  └─ projects (اضافه کردن visibility, seeking_investment, ...)

□ ایجاد RLS Policies برای همه جداول

□ ایجاد Database Functions:
  ├─ increment_project_view()
  ├─ check_investor_view_limit()
  └─ create_connection_request()

□ ایجاد Indexes برای بهینه‌سازی

□ تست دیتابیس و Policies
```

**خروجی:**
- دیتابیس کامل و آماده
- تمام Policies تست شده
- مستندات SQL

---

### فاز 2: MVP Investor Portal (5-7 روز)

**هدف:** یک پنل ساده برای سرمایه‌گذاران

**صفحات مورد نیاز:**

#### 2.1. صفحه ثبت‌نام سرمایه‌گذار
```
/investor/signup
├─ انتخاب نوع کاربر (Investor)
├─ فرم ثبت‌نام اولیه
└─ تایید ایمیل و تلفن
```

#### 2.2. تکمیل پروفایل سرمایه‌گذار
```
/investor/profile/setup
├─ اطلاعات شخصی/شرکتی
├─ بازه سرمایه‌گذاری
├─ صنایع مورد علاقه
├─ تجربیات و Portfolio
└─ لینک LinkedIn
```

#### 2.3. درخواست Verification
```
/investor/verification
├─ نمایش اطلاعات وارد شده
├─ دکمه "Request Verification"
└─ پیام "در انتظار بررسی"
```

#### 2.4. Dashboard سرمایه‌گذار
```
/investor/dashboard
├─ خوش‌آمدگویی و وضعیت Tier
├─ آمار (پروژه‌های دیده شده، ذخیره شده، ...)
├─ پروژه‌های جدید (Latest Projects)
└─ درخواست‌های من (My Connections)
```

#### 2.5. صفحه جستجوی پروژه‌ها
```
/investor/explore
├─ فیلترهای جستجو:
│  ├─ صنعت (Industry)
│  ├─ مرحله (Stage)
│  ├─ مبلغ سرمایه مورد نیاز
│  └─ مکان
├─ لیست پروژه‌های عمومی (Grid/List view)
└─ پیش‌نمایش سریع (Quick Preview)
```

#### 2.6. صفحه جزئیات پروژه (برای سرمایه‌گذار)
```
/investor/projects/:id
├─ اطلاعات کامل پروژه
├─ Blueprint کامل
├─ اطلاعات سرمایه‌گذاری
├─ دکمه "Show Interest"
└─ دکمه "Save"
```

#### 2.7. صفحه مدیریت Connections
```
/investor/connections
├─ تب‌ها:
│  ├─ Pending (در انتظار پاسخ)
│  ├─ Active (تایید شده)
│  └─ Archived
├─ لیست درخواست‌ها
└─ امکان پیام‌رسانی
```

#### 2.8. صفحه پروژه‌های ذخیره شده
```
/investor/saved
├─ لیست پروژه‌های Save شده
└─ امکان حذف از لیست
```

**کامپوننت‌های مورد نیاز:**
```
components/investor/
├─ InvestorDashboard.tsx
├─ InvestorProfileSetup.tsx
├─ ProjectExplorer.tsx
│  ├─ ProjectFilters.tsx
│  ├─ ProjectCard.tsx
│  └─ ProjectGrid.tsx
├─ ProjectDetailInvestor.tsx
├─ ConnectionsList.tsx
├─ ConnectionCard.tsx
├─ ShowInterestModal.tsx
└─ VerificationStatus.tsx
```

**Services مورد نیاز:**
```
services/
├─ investorProfileService.ts
│  ├─ createInvestorProfile()
│  ├─ updateInvestorProfile()
│  ├─ getInvestorProfile()
│  └─ requestVerification()
│
├─ investorProjectService.ts
│  ├─ getPublicProjects()
│  ├─ getProjectById()
│  ├─ searchProjects()
│  └─ incrementView()
│
└─ connectionService.ts
   ├─ createConnectionRequest()
   ├─ getMyConnections()
   ├─ updateConnectionStatus()
   └─ sendMessage()
```

---

### فاز 3: Idea Creator Updates (3-4 روز)

**هدف:** اضافه کردن امکانات جدید برای Idea Creators

**تغییرات:**

#### 3.1. تنظیمات پروژه (Project Settings)
```
/projects/:id/settings
├─ تب Visibility:
│  ├─ Private (پیش‌فرض)
│  ├─ Public (عمومی برای همه)
│  └─ Investors Only
│
├─ تب Investment:
│  ├─ ☑ Seeking Investment
│  ├─ مبلغ مورد نیاز
│  ├─ درصد سهام پیشنهادی
│  └─ آپلود Pitch Deck (اختیاری)
│
└─ دکمه Save
```

#### 3.2. Dashboard Updates
```
/dashboard
├─ آمار پروژه‌های عمومی:
│  ├─ تعداد بازدید
│  ├─ تعداد علاقه‌مندی
│  └─ درخواست‌های جدید (Badge)
│
└─ لیست پروژه‌ها با نمایش وضعیت Public/Private
```

#### 3.3. صفحه Connection Requests
```
/projects/:id/requests
├─ لیست سرمایه‌گذاران علاقه‌مند
├─ هر کارت شامل:
│  ├─ نام و شرکت سرمایه‌گذار
│  ├─ بازه سرمایه‌گذاری
│  ├─ پیام اولیه
│  └─ دکمه‌های Accept / Reject
│
└─ بعد از Accept:
   └─ نمایش اطلاعات تماس
```

#### 3.4. صفحه آمار پروژه
```
/projects/:id/analytics
├─ نمودار بازدیدها (در طول زمان)
├─ منابع بازدید
├─ سرمایه‌گذاران علاقه‌مند
└─ نرخ تبدیل (View → Interest)
```

**کامپوننت‌های جدید:**
```
components/creator/
├─ ProjectVisibilitySettings.tsx
├─ InvestmentSettings.tsx
├─ ConnectionRequestsList.tsx
├─ ConnectionRequestCard.tsx
├─ AcceptRequestModal.tsx
└─ ProjectAnalytics.tsx
```

---

### فاز 4: Admin Panel (2-3 روز)

**هدف:** پنل مدیریت برای تایید سرمایه‌گذاران

**صفحات:**

#### 4.1. Dashboard ادمین
```
/admin/dashboard
├─ آمار کلی:
│  ├─ تعداد کاربران (تفکیک شده)
│  ├─ تعداد پروژه‌های عمومی
│  ├─ تعداد Connections
│  └─ درآمد ماهانه (آینده)
│
└─ درخواست‌های در انتظار بررسی (Badge)
```

#### 4.2. صفحه Verification Requests
```
/admin/verifications
├─ فیلتر (Pending, Approved, Rejected)
├─ لیست درخواست‌ها
└─ هر کارت شامل:
   ├─ اطلاعات کامل سرمایه‌گذار
   ├─ لینک LinkedIn
   ├─ Portfolio
   ├─ فیلد یادداشت ادمین
   └─ دکمه‌های Approve / Reject
```

#### 4.3. مدیریت کاربران
```
/admin/users
├─ جستجو و فیلتر
├─ لیست کاربران
└─ امکانات:
   ├─ تغییر Tier
   ├─ Ban/Unban
   └─ مشاهده فعالیت‌ها
```

**کامپوننت‌ها:**
```
components/admin/
├─ AdminDashboard.tsx
├─ VerificationRequestsList.tsx
├─ VerificationRequestCard.tsx
├─ ApproveRejectModal.tsx
└─ UserManagement.tsx
```

**Service:**
```
services/adminService.ts
├─ getVerificationRequests()
├─ approveVerification()
├─ rejectVerification()
├─ updateUserTier()
└─ getAdminStats()
```

---

### فاز 5: Polish & UX (2-3 روز)

**بهبودها:**
```
□ نوتیفیکیشن‌ها:
  ├─ سرمایه‌گذار جدید علاقه نشون داد
  ├─ درخواست تایید شد/رد شد
  └─ پیام جدید

□ ایمیل‌ها:
  ├─ خوش‌آمدگویی
  ├─ تایید Verification
  └─ علاقه‌مندی جدید

□ بهبود UI/UX:
  ├─ Loading states
  ├─ Empty states
  ├─ Error handling
  └─ Responsive design

□ SEO:
  ├─ Meta tags برای پروژه‌های عمومی
  └─ Sitemap

□ Performance:
  ├─ Lazy loading
  ├─ Image optimization
  └─ Caching
```

---

### فاز 6: Monetization (3-4 روز)

**یکپارچه‌سازی پرداخت:**
```
□ انتخاب Payment Gateway (Stripe توصیه می‌شه)
□ ایجاد صفحه Pricing
□ صفحه Checkout
□ Webhook handling
□ مدیریت اشتراک‌ها
□ صفحه Billing برای کاربران
```

---

## مدل درآمدزایی (Monetization)

### Plans برای Idea Creators

#### Free Plan
```
قیمت: $0

محدودیت‌ها:
├─ حداکثر 3 پروژه
├─ 1 پروژه عمومی
├─ آمار ساده (تعداد بازدید)
└─ AI suggestions محدود (5 در ماه)

امکانات:
├─ دسترسی کامل به IDE
├─ ساخت Blueprint
└─ دریافت Connection Requests
```

#### Pro Plan
```
قیمت: $15/month یا $150/year (save 16%)

امکانات:
├─ پروژه‌های نامحدود
├─ همه پروژه‌ها می‌تونن عمومی بشن
├─ آمار پیشرفته:
│  ├─ نمودارهای تعاملی
│  ├─ منابع ترافیک
│  └─ Demographics سرمایه‌گذاران
├─ 1 Featured Project
├─ AI suggestions نامحدود
├─ Priority support
└─ Export to PDF/DOCX
```

#### Team Plan (فاز 3)
```
قیمت: $49/month

امکانات Pro +
├─ تا 5 عضو تیم
├─ Collaboration tools
├─ 3 Featured Projects
└─ Dedicated support
```

---

### Plans برای Investors

#### Free Tier
```
قیمت: $0

محدودیت‌ها:
├─ 10 پروژه در ماه
├─ فیلترهای ساده
└─ نمی‌تونه مستقیماً تماس بگیره

امکانات:
├─ مشاهده پروژه‌های عمومی
└─ ذخیره پروژه‌ها
```

#### Verified Tier
```
قیمت: رایگان (نیاز به تایید دستی)

امکانات:
├─ مشاهده نامحدود
├─ فیلترهای پیشرفته
├─ Show Interest
├─ دسترسی به اطلاعات تماس (بعد از تایید صاحب پروژه)
└─ پیام‌رسانی
```

#### Premium Tier (فاز 2)
```
قیمت: $99/month یا $990/year (save 16%)

امکانات Verified +
├─ Early Access (7 روز زودتر)
├─ Advanced Analytics
├─ Export project data
├─ Direct messaging
├─ Investment Portfolio Tracker
├─ Custom alerts
└─ API access (آینده)
```

---

### Featured Listings (فاز 3)
```
قیمت: $99 برای 30 روز

مزایا:
├─ نمایش در صفحه اول
├─ نشان "Featured"
├─ بیشتر به سرمایه‌گذاران نشون داده میشه
└─ Analytics دقیق‌تر
```

---

### Commission Model (فاز 4 - آینده)
```
در صورت موفقیت سرمایه‌گذاری:
├─ 2-5% از مبلغ سرمایه‌گذاری
└─ یا مبلغ ثابت $500-$2000

چالش‌ها:
├─ نیاز به tracking دستی
├─ نیاز به قرارداد
└─ trust issues
```

---

## امنیت و Privacy

### Privacy Levels

#### برای Projects:
```
1. Private (پیش‌فرض):
   └─ فقط صاحب پروژه می‌بینه

2. Public:
   ├─ همه می‌تونن ببینن
   └─ اطلاعات تماس صاحب پروژه مخفی

3. Investors Only:
   ├─ فقط Verified Investors می‌تونن ببینن
   └─ اطلاعات تماس مخفی
```

#### اطلاعات نمایش داده شده:
```
Public Info:
├─ عنوان پروژه
├─ توضیحات
├─ صنعت
├─ مرحله
├─ Blueprint کامل
└─ مبلغ سرمایه مورد نیاز

Hidden Info (تا زمان تایید Connection):
├─ نام و ایمیل صاحب پروژه
├─ شماره تماس
└─ اطلاعات مالی دقیق (اختیاری)
```

---

### Connection Flow (محافظت از Privacy)

```
┌─────────────────────────────────────────────────────┐
│ 1. Investor می‌بینه پروژه رو (بدون اطلاعات تماس)  │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ 2. Investor میزنه "Show Interest" + پیام می‌نویسه  │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ 3. صاحب پروژه Notification می‌گیره                 │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ 4. صاحب پروژه پروفایل سرمایه‌گذار رو می‌بینه      │
│    ├─ شرکت                                         │
│    ├─ بازه سرمایه‌گذاری                            │
│    ├─ Portfolio                                     │
│    └─ LinkedIn                                      │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ 5. صاحب پروژه تصمیم می‌گیره:                       │
│    ├─ Accept ──► اطلاعات تماس رد و بدل میشه       │
│    └─ Reject ──► سرمایه‌گذار متوجه میشه            │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ 6. پیام‌رسانی از طریق پلتفرم                       │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ 7. در صورت توافق، خارج از پلتفرم ادامه می‌دن      │
└─────────────────────────────────────────────────────┘
```

---

### Terms & Legal

#### Disclaimer
```
"IDE Maker یک پلتفرم معرفی و ارتباط است. ما:
├─ مسئول موفقیت یا شکست سرمایه‌گذاری نیستیم
├─ صحت اطلاعات پروژه‌ها را تضمین نمی‌کنیم
├─ مشاوره مالی یا حقوقی ارائه نمی‌دهیم
└─ توصیه می‌کنیم پیش از سرمایه‌گذاری با وکیل و حسابدار مشورت کنید"
```

#### برای Idea Creators:
```
├─ مسئولیت صحت اطلاعات با شماست
├─ IP protection خودتون رو قبل از عمومی کردن انجام بدین
└─ عمومی کردن پروژه به معنی موافقت با Terms است
```

#### برای Investors:
```
├─ Due diligence کامل انجام بدین
├─ از اطلاعات پروژه‌ها سوءاستفاده نکنید
└─ به NDA (در صورت وجود) احترام بگذارید
```

---

## نقشه راه (Roadmap)

### Q1 2025: Foundation (در حال انجام)
```
✅ فاز 0: Planning
□ فاز 1: Database Setup (Week 1)
□ فاز 2: MVP Investor Portal (Week 2-3)
□ فاز 3: Idea Creator Updates (Week 4)
□ فاز 4: Admin Panel (Week 5)
□ فاز 5: Polish & UX (Week 6)
```

**Milestone:** راه‌اندازی MVP Investor Portal

---

### Q2 2025: Monetization & Growth
```
□ فاز 6: Payment Integration
□ لانچ پلن‌های پولی
□ بازاریابی و جذب کاربر
□ جمع‌آوری بازخورد
□ بهبودهای UX
```

**Milestone:** اولین پرداخت‌های موفق

---

### Q3 2025: Mobile Apps
```
□ React Native app برای iOS
□ React Native app برای Android
□ سینک بین Web و Mobile
□ Push notifications
```

**Milestone:** لانچ در App Store و Play Store

---

### Q4 2025: Platform Expansion
```
□ افزودن نقش Developer
□ افزودن نقش Designer
□ سیستم Matching هوشمند
□ Featured Listings
□ Advanced Analytics
```

**Milestone:** Multi-sided Platform کامل

---

### 2026: Scale & AI
```
□ AI-powered matching
□ پیشنهادات هوشمند
□ Auto-translation (چند زبانه)
□ API برای third-party integrations
□ Community features (forums, events)
□ Commission tracking system
```

---

## آمار و KPIs

### Metrics مهم برای Track کردن:

#### User Metrics:
```
├─ تعداد کاربران (تفکیک شده به نوع)
├─ نرخ تبدیل (signup → active user)
├─ نرخ Retention (روزانه، هفتگی، ماهانه)
└─ Churn rate
```

#### Project Metrics:
```
├─ تعداد پروژه‌های ساخته شده
├─ تعداد پروژه‌های عمومی
├─ میانگین تعداد فازهای تکمیل شده
└─ نرخ تبدیل (private → public)
```

#### Investor Metrics:
```
├─ تعداد سرمایه‌گذاران ثبت‌نام شده
├─ تعداد Verified investors
├─ میانگین تعداد پروژه‌های مشاهده شده
└─ نرخ تبدیل (view → interest)
```

#### Connection Metrics:
```
├─ تعداد Connection requests
├─ نرخ پذیرش (acceptance rate)
├─ زمان میانگین پاسخ
└─ تعداد سرمایه‌گذاری‌های موفق (self-reported)
```

#### Revenue Metrics:
```
├─ MRR (Monthly Recurring Revenue)
├─ تعداد اشتراک‌های فعال (تفکیک شده)
├─ Churn rate
├─ Customer Lifetime Value (CLV)
└─ درآمد از Featured Listings
```

---

## چک‌لیست قبل از لانچ

### Technical:
```
□ همه Database tables و RLS policies تست شدن
□ همه API endpoints کار می‌کنن
□ Error handling در همه جا
□ Loading states
□ Responsive design (Mobile, Tablet, Desktop)
□ Cross-browser testing
□ Performance optimization
□ Security audit
```

### Content:
```
□ Privacy Policy
□ Terms of Service
□ Investment Disclaimer
□ صفحه About
□ صفحه Pricing
□ FAQ
```

### Marketing:
```
□ Landing page برای investors
□ SEO optimization
□ Social media assets
□ Email templates
```

### Operations:
```
□ پروسه Verification مشخص
□ Support system (ایمیل، چت)
□ Analytics dashboard برای ادمین
□ Backup و Recovery plan
```

---

## نکات مهم برای توسعه‌دهنده آینده (شما!)

### کدهایی که باید Modular باشن:
```
1. User Role System:
   ├─ باید راحت بتونی نقش جدید اضافه کنی
   └─ از Enum استفاده کن، نه Hardcode

2. Verification System:
   ├─ قابل توسعه برای انواع مختلف verification
   └─ Template-based

3. Connection System:
   ├─ عمومی باشه (نه فقط investor-project)
   └─ بشه برای Developer, Designer هم استفاده کرد

4. Subscription System:
   ├─ Plan-based و نه Hardcode
   └─ راحت بشه plan جدید اضافه کرد
```

### جاهایی که باید Comment بذاری:
```
// TODO: فاز 2 - اضافه کردن Premium features
// FUTURE: این بخش برای Developer role هم باید کار کنه
// OPTIMIZE: اینجا می‌تونه با caching بهینه بشه
```

### Best Practices:
```
├─ همیشه TypeScript type ها رو کامل بنویس
├─ هر Component باید reusable باشه
├─ Services جدا از Components
├─ همیشه Error handling
└─ همیشه Loading states
```

---

## منابع و References

### مشابه‌های موفق:
```
1. AngelList (Wellfound):
   └─ پلتفرم اتصال Startups به Investors

2. F6S:
   └─ Funding و Accelerator programs

3. Gust:
   └─ سیستم مدیریت سرمایه‌گذاری

4. ProductHunt:
   └─ Discovery platform (الهام برای UX)
```

### تکنولوژی‌های استفاده شده:
```
Frontend:
├─ React + TypeScript
├─ Tailwind CSS
└─ i18next (چندزبانه)

Backend:
├─ Supabase (PostgreSQL)
├─ Row Level Security
└─ Edge Functions (آینده)

Payments:
└─ Stripe (پیشنهادی)

Analytics:
├─ Google Analytics
└─ Custom dashboard
```

---

## خلاصه Executive Summary

### چی داریم می‌سازیم؟
```
یک پلتفرم multi-sided که:
├─ Idea Creators ایده‌هاشون رو تکمیل می‌کنن
├─ Investors پروژه‌های مناسب پیدا می‌کنن
└─ اتصال بینشون برقرار میشه
```

### چرا متمایزیم؟
```
├─ فقط IDE نیستیم، اکوسیستم کاملی هستیم
├─ کیفیت بالا (Verification system)
├─ Privacy محور
└─ قابل توسعه به نقش‌های دیگه
```

### مدل درآمدزایی:
```
Freemium:
├─ Idea Creators: $15/month (Pro)
├─ Investors: $99/month (Premium)
└─ Featured Listings: $99/30 days

آینده:
└─ Commission از سرمایه‌گذاری‌های موفق
```

### تایم‌لاین:
```
Week 1: Database
Week 2-3: MVP Investor Portal
Week 4: Idea Creator Updates
Week 5: Admin Panel
Week 6: Polish & Launch
```

---

## پایان پلن جامع

این پلن کامل و جامع برای توسعه پلتفرم IDE Maker به یک اکوسیستم multi-sided است.

**نکته مهم:** این پلن یک سند زنده است. در طول توسعه:
- ✏️ یادداشت‌هات رو اضافه کن
- ✅ وظایف انجام شده رو تیک بزن
- 🔄 در صورت تغییر استراتژی، آپدیت کن
- 📊 KPIs و نتایج رو track کن

موفق باشی! 🚀
