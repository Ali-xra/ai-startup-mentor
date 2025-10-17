-- ==========================================
-- اضافه کردن نقش‌های جدید به جدول profiles
-- Add New Roles to profiles table
-- ==========================================
--
-- این اسکریپت CHECK CONSTRAINT را آپدیت می‌کنه
-- تا نقش‌های programmer, consultant, designer رو هم قبول کنه
--

-- حذف constraint قدیمی
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- اضافه کردن constraint جدید با 5 نقش
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('entrepreneur', 'investor', 'programmer', 'consultant', 'designer'));

-- نمایش وضعیت
SELECT
    'CHECK CONSTRAINT آپدیت شد ✅' as status,
    'حالا می‌تونی 5 نقش رو انتخاب کنی' as message;
