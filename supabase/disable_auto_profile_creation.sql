-- ==========================================
-- غیرفعال کردن ساخت خودکار profile
-- Disable Auto Profile Creation
-- ==========================================
--
-- این اسکریپت trigger ساخت خودکار profile را غیرفعال می‌کنه
-- تا کاربر بتونه خودش role رو انتخاب کنه
--

-- حذف trigger ساخت خودکار profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- حذف function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- اطمینان از اینکه default value برای role وجود نداره
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

-- نمایش وضعیت فعلی
SELECT
    'Trigger حذف شد ✅' as status;
