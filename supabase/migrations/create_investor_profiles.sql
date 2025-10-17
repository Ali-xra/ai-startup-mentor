-- Migration: ایجاد جدول investor_profiles
-- تاریخ: 2025-01-16
-- هدف: ذخیره اطلاعات خاص سرمایه‌گذاران

-- ایجاد جدول investor_profiles
CREATE TABLE investor_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
    investor_type TEXT CHECK (investor_type IN ('individual', 'vc', 'corporate', 'angel')),
    company_name TEXT,
    investment_min DECIMAL(15,2),
    investment_max DECIMAL(15,2),
    preferred_industries TEXT[],
    preferred_stages TEXT[],
    preferred_locations TEXT[],
    years_of_experience INTEGER,
    portfolio TEXT[], -- لیست شرکت‌های قبلی سرمایه‌گذاری
    verification_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    monthly_project_views INTEGER DEFAULT 0,
    last_view_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایجاد ایندکس‌ها برای بهبود عملکرد
CREATE INDEX IF NOT EXISTS idx_investor_profiles_tier ON investor_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_investor_profiles_verified_at ON investor_profiles(verified_at);
CREATE INDEX IF NOT EXISTS idx_investor_profiles_monthly_views ON investor_profiles(monthly_project_views);

-- فعال کردن RLS
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;

-- پالیسی‌های امنیتی
CREATE POLICY "Users can view own investor profile" ON investor_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own investor profile" ON investor_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own investor profile" ON investor_profiles
    FOR UPDATE USING (auth.uid() = id);

-- کامنت برای توضیح جدول
COMMENT ON TABLE investor_profiles IS 'اطلاعات خاص سرمایه‌گذاران شامل ترجیحات سرمایه‌گذاری و وضعیت تایید';
