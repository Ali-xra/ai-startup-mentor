-- ==========================================
-- Migration: اضافه کردن نقش 'admin' به profiles.role
-- Add 'admin' role to profiles table
-- ==========================================
--
-- این migration:
-- 1. نقش 'admin' رو به CHECK CONSTRAINT اضافه می‌کنه
-- 2. اطمینان می‌ده که کاربران admin می‌تونن در profiles ثبت بشن
--

-- حذف constraint قدیمی
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- اضافه کردن constraint جدید با 6 نقش (شامل admin)
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('entrepreneur', 'investor', 'programmer', 'consultant', 'designer', 'admin'));

-- نمایش وضعیت
SELECT
    'CHECK CONSTRAINT آپدیت شد ✅' as status,
    'حالا می‌تونی نقش admin رو هم انتخاب کنی' as message;

-- ==========================================
-- تنظیم یک کاربر به عنوان Admin (اختیاری)
-- ==========================================
--
-- IMPORTANT: این query رو فقط یکبار اجرا کن!
-- قبل از اجرا، email رو به email واقعی خودت تغییر بده
--

/*
-- گام 1: پیدا کردن user_id از email
-- این query رو اجرا کن تا user_id رو پیدا کنی:
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL@example.com';

-- گام 2: اضافه کردن user به جدول admins
INSERT INTO admins (user_id, email, role, is_active)
VALUES (
    'USER_ID_از_گام_1',
    'YOUR_EMAIL@example.com',
    'super_admin',
    true
)
ON CONFLICT (user_id) DO NOTHING;

-- گام 3: آپدیت role در profiles
UPDATE profiles
SET role = 'admin'
WHERE user_id = 'USER_ID_از_گام_1';
*/

-- ==========================================
-- نکات مهم:
-- ==========================================
--
-- 1. بعد از اجرای migration، باید یک کاربر رو به عنوان admin تنظیم کنی
-- 2. کاربر admin باید در هر دو جدول وجود داشته باشه:
--    - profiles.role = 'admin'
--    - admins table (برای دسترسی‌های admin panel)
-- 3. اگر کاربر admin همچنین entrepreneur هم هست، نیازی به تغییر نیست
--    فقط role رو از 'entrepreneur' به 'admin' تغییر بده
--
