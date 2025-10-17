-- ==========================================
-- 🔧 حل نهایی مشکلات احراز هویت
-- Final Fix for Authentication Issues
-- ==========================================
-- دستورات پیشنهادی دوست شما برای حل مشکلات RLS
-- Run this in Supabase Dashboard → SQL Editor
-- ==========================================

-- ۱. اصلاح پالیسی INSERT برای جدول profiles
-- Fix INSERT policy for profiles table
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ۲. اصلاح پالیسی INSERT برای جدول investor_profiles
-- Fix INSERT policy for investor_profiles table
DROP POLICY IF EXISTS "Users can insert their own investor profile" ON investor_profiles;
DROP POLICY IF EXISTS "Investors can insert their own profile" ON investor_profiles;

CREATE POLICY "Users can insert their own investor profile" ON investor_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ۳. فعال کردن تریگر ساخت خودکار پروفایل
-- Enable automatic profile creation trigger
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
EXCEPTION
    WHEN others THEN
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- حذف تریگر قدیمی و ساخت تریگر جدید
-- Drop old trigger and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ۴. اطمینان از وجود پالیسی‌های SELECT و UPDATE
-- Ensure SELECT and UPDATE policies exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Investors can view their own profile" ON investor_profiles;
CREATE POLICY "Investors can view their own profile" ON investor_profiles
    FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Investors can update their own profile" ON investor_profiles;
CREATE POLICY "Investors can update their own profile" ON investor_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ۵. تایید فعال بودن RLS
-- Confirm RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ✅ تکمیل شد!
-- پس از اجرا، تست کنید:
-- 1. ثبت‌نام کاربر جدید
-- 2. انتخاب نقش (سرمایه‌گذار)
-- 3. لاگین با گوگل
-- ==========================================
