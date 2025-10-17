-- Migration: اضافه کردن فیلد role به جدول profiles
-- تاریخ: 2025-01-16
-- هدف: اضافه کردن سیستم نقش کاربر (entrepreneur/investor)

-- اضافه کردن فیلد role به جدول profiles
ALTER TABLE profiles
ADD COLUMN role TEXT DEFAULT 'entrepreneur' CHECK (role IN ('entrepreneur', 'investor'));

-- ایجاد ایندکس برای بهبود عملکرد جستجو بر اساس نقش
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- کامنت برای توضیح فیلد جدید
COMMENT ON COLUMN profiles.role IS 'نقش کاربر: entrepreneur (کارآفرین) یا investor (سرمایه‌گذار)';
