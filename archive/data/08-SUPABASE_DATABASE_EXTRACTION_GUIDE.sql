# ==========================================
# راهنمای کامل استخراج اطلاعات دیتابیس Supabase
# ==========================================
# این فایل شامل تمام دستورات SQL لازم برای استخراج
# ساختار کامل دیتابیس Supabase به صورت مرحله به مرحله
# ==========================================

-- ==========================================
-- تحلیل وضعیت فعلی دیتابیس (بر اساس نتایج استخراج شده)
-- ==========================================
-- ✅ خبر خوب: جداول investor_profiles و profiles هر دو وجود دارند!
-- ✅ خبر خوب: فیلد role در جدول profiles وجود دارد!
-- ✅ خبر خوب: پالیسی‌های امنیتی (RLS) روی جداول فعال است!
-- ❌ مشکل اصلی: ممکن است پالیسی‌های موجود اجازه INSERT ندهند!
-- ❌ مشکل اصلی: ممکن است کاربر هنوز پروفایل نساخته باشد!
-- ==========================================

-- ==========================================
-- راهنمای استفاده:
-- ==========================================
-- ۱. تمام دستورات رو به ترتیب شماره اجرا کنید
-- ۲. هر دستور رو در SQL Editor پروژه Supabase کپی کنید
-- ۳. نتیجه هر دستور رو ذخیره کنید
-- ۴. اگر خطایی دیدید، دستور اصلاح شده رو امتحان کنید
-- ==========================================

-- ==========================================
-- دستورات عمومی و ثابت (برای همه پروژه‌ها):
-- ==========================================
-- ✅ مرحله ۱: استخراج لیست جداول - عمومی
-- ✅ مرحله ۲: استخراج ساختار جداول - عمومی
-- ✅ مرحله ۳: استخراج پالیسی‌ها - عمومی
-- ✅ مرحله ۴: استخراج توابع - عمومی
-- ✅ مرحله ۵: استخراج تریگرها - عمومی
-- ✅ مرحله ۶: استخراج ایندکس‌ها - عمومی
-- ✅ مرحله ۷: استخراج constraints - عمومی
-- ==========================================

-- ==========================================
-- دستورات خاص این پروژه:
-- ==========================================
-- ❌ مرحله ۸: استخراج داده‌های نمونه - خاص این پروژه
-- (نام جداول مثل profiles, projects, public_projects خاص این پروژه است)
-- ❌ دستورات اضافی - برخی خاص این پروژه
-- ==========================================

-- ==========================================
-- نحوه استفاده برای پروژه‌های دیگر:
-- ==========================================
-- برای استفاده در پروژه‌های دیگر:
-- ۱. مراحل ۱ تا ۷ رو بدون تغییر اجرا کنید (عمومی هستن)
-- ۲. برای مرحله ۸، نام جداول رو با جداول پروژه خودتون جایگزین کنید
-- ۳. مثلاً اگر پروژه شما جداول users, posts, comments داره:
--    SELECT * FROM users LIMIT 3;
--    SELECT * FROM posts LIMIT 3;
--    SELECT * FROM comments LIMIT 3;
-- ==========================================

-- ==========================================
-- مرحله ۱: استخراج لیست تمام جداول
-- ==========================================
-- هدف: دیدن تمام جداول موجود در دیتابیس

SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ==========================================
-- مرحله ۲: استخراج ساختار کامل جداول
-- ==========================================
-- هدف: دیدن ساختار دقیق هر جدول با تمام فیلدها

SELECT
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default,
    c.character_maximum_length,
    c.numeric_precision,
    c.numeric_scale,
    CASE WHEN tc.constraint_type = 'PRIMARY KEY' THEN 'PRIMARY KEY' ELSE '' END as pk,
    CASE WHEN tc.constraint_type = 'FOREIGN KEY' THEN 'FOREIGN KEY' ELSE '' END as fk,
    CASE WHEN tc.constraint_type = 'UNIQUE' THEN 'UNIQUE' ELSE '' END as unique_key
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
LEFT JOIN information_schema.key_column_usage kcu ON c.table_name = kcu.table_name AND c.column_name = kcu.column_name
LEFT JOIN information_schema.table_constraints tc ON kcu.table_name = tc.table_name AND kcu.constraint_name = tc.constraint_name
WHERE t.table_schema = 'public'
ORDER BY t.table_name, c.ordinal_position;

-- ==========================================
-- مرحله ۳: استخراج تمام پالیسی‌های امنیتی (RLS)
-- ==========================================
-- هدف: دیدن تمام قوانین امنیتی و دسترسی‌ها

SELECT * FROM pg_policies WHERE schemaname = 'public';

-- اگر دستور بالا خطا داد، از این نسخه ساده استفاده کنید:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd FROM pg_policies WHERE schemaname = 'public';

-- ==========================================
-- مرحله ۴: استخراج تمام توابع سیستم
-- ==========================================
-- هدف: دیدن تمام توابع و پروسیجرهای تعریف شده

SELECT
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    CASE WHEN p.prokind = 'f' THEN 'FUNCTION' WHEN p.prokind = 'p' THEN 'PROCEDURE' END as type,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- اگر دستور بالا خطا داد، از این نسخه ساده استفاده کنید:
-- SELECT proname, pg_get_function_identity_arguments(oid) FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- ==========================================
-- مرحله ۵: استخراج تمام تریگرها
-- ==========================================
-- هدف: دیدن تمام تریگرهای اتوماتیک سیستم

SELECT * FROM information_schema.triggers WHERE trigger_schema = 'public';

-- اگر دستور بالا خطا داد، از این نسخه ساده استفاده کنید:
-- SELECT trigger_name, event_manipulation, event_object_table, action_statement FROM information_schema.triggers WHERE trigger_schema = 'public';

-- ==========================================
-- مرحله ۶: استخراج تمام ایندکس‌ها
-- ==========================================
-- هدف: دیدن تمام ایندکس‌های عملکردی

SELECT * FROM pg_indexes WHERE schemaname = 'public';

-- اگر دستور بالا خطا داد، از این نسخه ساده استفاده کنید:
-- SELECT schemaname, tablename, indexname, indexdef FROM pg_indexes WHERE schemaname = 'public';

-- ==========================================
-- مرحله ۷: استخراج constraints اضافی
-- ==========================================
-- هدف: دیدن constraints به جز primary keys

SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.match_option,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
LEFT JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.constraint_type NOT IN ('PRIMARY KEY')
ORDER BY tc.table_name, tc.constraint_name;

-- ==========================================
-- مرحله ۸: استخراج داده‌های نمونه (اختیاری)
-- ==========================================
-- هدف: دیدن نمونه‌ای از داده‌های واقعی برای تحلیل بهتر
-- ==========================================
-- نحوه اجرا:
-- گزینه ۱: تک تک اجرا کنید (توصیه می‌شود)
-- گزینه ۲: همه رو با هم در یک کوئری بزرگ اجرا کنید
-- گزینه ۳: فقط جداولی که نیاز دارید رو اجرا کنید
-- ==========================================

-- گزینه ۱: تک تک اجرا کنید (توصیه می‌شود)
-- هر دستور رو جداگانه کپی و اجرا کنید:

-- پروفایل‌ها
SELECT * FROM profiles LIMIT 3;

-- پروژه‌ها
SELECT * FROM projects LIMIT 3;

-- پروژه‌های عمومی
SELECT * FROM public_projects LIMIT 3;

-- اعضای پروژه
SELECT * FROM project_members LIMIT 3;

-- کامنت‌های پروژه
SELECT * FROM project_comments LIMIT 3;

-- لایک‌های پروژه
SELECT * FROM project_likes LIMIT 3;

-- ترجمه مراحل
SELECT * FROM stage_translations LIMIT 3;

-- فیچرهای کاربران
SELECT * FROM user_features LIMIT 3;

-- درخواست‌های ارتقا
SELECT * FROM upgrade_requests LIMIT 3;

-- ادمین‌ها
SELECT * FROM admins LIMIT 3;

-- لاگ ادمین‌ها
SELECT * FROM admin_audit_log LIMIT 3;

-- ==========================================
-- گزینه ۲: اجرای همه با هم (اگر بخواید)
-- ==========================================
-- تمام جداول رو در یک کوئری بزرگ اجرا کنید:
/*
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'projects' as table_name, COUNT(*) as row_count FROM projects
UNION ALL
SELECT 'public_projects' as table_name, COUNT(*) as row_count FROM public_projects
UNION ALL
SELECT 'project_members' as table_name, COUNT(*) as row_count FROM project_members
UNION ALL
SELECT 'project_comments' as table_name, COUNT(*) as row_count FROM project_comments
UNION ALL
SELECT 'project_likes' as table_name, COUNT(*) as row_count FROM project_likes
UNION ALL
SELECT 'stage_translations' as table_name, COUNT(*) as row_count FROM stage_translations
UNION ALL
SELECT 'user_features' as table_name, COUNT(*) as row_count FROM user_features
UNION ALL
SELECT 'upgrade_requests' as table_name, COUNT(*) as row_count FROM upgrade_requests
UNION ALL
SELECT 'admins' as table_name, COUNT(*) as row_count FROM admins
UNION ALL
SELECT 'admin_audit_log' as table_name, COUNT(*) as row_count FROM admin_audit_log;
*/

-- ==========================================
-- نکات مهم:
-- ==========================================
-- ۱. تمام دستورات رو به ترتیب اجرا کنید
-- ۲. اگر دستوری خطا داد، از نسخه ساده‌شده استفاده کنید
-- ۳. نتیجه هر دستور رو در فایل جداگانه ذخیره کنید
-- ۴. برای تحلیل بهتر، داده‌های نمونه رو هم استخراج کنید
-- ۵. اگر نیاز به استخراج بیشتر داشتید، از دستورات اضافی استفاده کنید
-- ==========================================

-- ==========================================
-- دستورات اضافی مفید (در صورت نیاز)
-- ==========================================

-- استخراج اندازه جداول
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- استخراج وابستگی‌های بین جداول
SELECT
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public';

-- استخراج viewها (اگر موجود باشد)
SELECT
    table_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public';

-- استخراج sequences (اگر موجود باشد)
SELECT
    sequencename,
    data_type,
    start_value,
    increment_by,
    max_value,
    min_value,
    cache_size,
    cycle_option
FROM pg_sequences
WHERE schemaname = 'public';

-- ==========================================
-- پایان راهنما
-- ==========================================
-- این راهنما تمام دستورات لازم برای استخراج کامل
-- ساختار دیتابیس Supabase رو شامل می‌شود
-- ==========================================
