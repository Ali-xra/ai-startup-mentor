-- حذف ستون user_type از جدول profiles
-- این ستون قدیمی بود و دیگر استفاده نمی‌شود
-- به جای آن از ستون role استفاده می‌کنیم

ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_type;

-- Comment برای مستندات
COMMENT ON TABLE public.profiles IS
'User profiles table. Contains user information including role, email, and name.
Role field determines user type (entrepreneur, investor, programmer, consultant, designer, admin).';
