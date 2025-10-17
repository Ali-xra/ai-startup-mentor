# تحلیل وضعیت فعلی دیتابیس و مشکلات احراز هویت

## ✅ وضعیت فعلی دیتابیس (بر اساس نتایج استخراج شده)

### جداول موجود:
- ✅ `profiles` - وجود دارد و ساختار کاملی دارد
- ✅ `investor_profiles` - وجود دارد و ساختار کاملی دارد
- ✅ سایر جداول مرتبط (connections, project_views, etc.)

### ساختار جداول مهم:

#### جدول `profiles`:
```sql
- id (UUID, PRIMARY KEY, FOREIGN KEY to auth.users)
- name, email, phone, bio, company, position
- role (TEXT, DEFAULT 'entrepreneur') ✅
- user_type (TEXT, DEFAULT 'idea_creator')
- verified, verification_status, verification_date
- avatar_url, location, website, linkedin_url, twitter_url
- profile_visibility (DEFAULT 'public')
- created_at, updated_at
```

#### جدول `investor_profiles`:
```sql
- id (UUID, PRIMARY KEY, FOREIGN KEY to auth.users)
- user_id (UUID, UNIQUE, FOREIGN KEY to auth.users)
- tier (TEXT, DEFAULT 'free')
- investor_type, company_name, investment_min, investment_max
- preferred_industries (ARRAY), preferred_stages (ARRAY), preferred_locations (ARRAY)
- years_of_experience, portfolio (JSONB)
- verification_notes, verified_at, verified_by
- monthly_project_views (INTEGER, DEFAULT 0)
- last_view_reset, created_at, updated_at
```

## 🔍 مشکلات شناسایی شده:

### ۱. مشکل اصلی: پالیسی‌های RLS بیش از حد محدودکننده
بر اساس نتایج استخراج شده، پالیسی‌های امنیتی روی جداول ممکن است اجازه INSERT ندهند:

**پالیسی‌های فعلی جدول `profiles`:**
- ✅ Users can view own profile
- ✅ Users can update own profile
- ❌ **Users can insert own profile** - ممکن است مشکل داشته باشد!

**پالیسی‌های فعلی جدول `investor_profiles`:**
- ✅ Users can view own investor profile
- ✅ Users can update own investor profile
- ❌ **Users can insert own investor profile** - ممکن است مشکل داشته باشد!

### ۲. مشکل احتمالی: عدم وجود پروفایل برای کاربران جدید
وقتی کاربر جدید ثبت‌نام می‌کند، ممکن است پروفایل به طور خودکار ساخته نشود.

## 🛠️ راه حل‌های پیشنهادی:

### راه حل ۱: اصلاح پالیسی‌های INSERT
```sql
-- بررسی پالیسی فعلی INSERT برای جدول profiles
SELECT * FROM pg_policies
WHERE tablename = 'profiles' AND cmd = 'INSERT';

-- اگر پالیسی INSERT مشکل دارد، این دستور را اجرا کنید:
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
```

### راه حل ۲: اصلاح پالیسی‌های INSERT برای investor_profiles
```sql
-- بررسی پالیسی فعلی INSERT برای جدول investor_profiles
SELECT * FROM pg_policies
WHERE tablename = 'investor_profiles' AND cmd = 'INSERT';

-- اگر پالیسی INSERT مشکل دارد، این دستور را اجرا کنید:
DROP POLICY IF EXISTS "Users can insert their own investor profile" ON investor_profiles;
CREATE POLICY "Users can insert their own investor profile" ON investor_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
```

### راه حل ۳: فعال کردن تریگر handle_new_user
```sql
-- بررسی وجود تریگر
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'handle_new_user';

-- اگر تریگر وجود ندارد یا غیرفعال است:
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ایجاد تریگر اگر وجود ندارد
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🧪 تست پس از اعمال تغییرات:

### تست ۱: ثبت‌نام کاربر جدید
1. یک کاربر جدید با ایمیل و پسورد ثبت‌نام کنید
2. بررسی کنید که پروفایل در جدول `profiles` ساخته شده است
3. بررسی کنید که صفحه RoleSelection نمایش داده می‌شود

### تست ۲: انتخاب نقش سرمایه‌گذار
1. نقش "سرمایه‌گذار" را انتخاب کنید
2. بررسی کنید که رکورد در جدول `investor_profiles` ساخته شده است
3. بررسی کنید که به صفحه `/investor.html` هدایت می‌شوید

### تست ۳: لاگین کاربر موجود
1. با یک کاربر موجود که نقش دارد لاگین کنید
2. بررسی کنید که به صفحه مناسب هدایت می‌شوید

## 📋 دستورات نهایی برای اجرا:

```sql
-- ۱. اصلاح پالیسی INSERT برای profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ۲. اصلاح پالیسی INSERT برای investor_profiles
DROP POLICY IF EXISTS "Users can insert their own investor profile" ON investor_profiles;
CREATE POLICY "Users can insert their own investor profile" ON investor_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ۳. فعال کردن تریگر ساخت خودکار پروفایل
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🎯 نتیجه مورد انتظار:

پس از اجرای این دستورات:
- ✅ ثبت‌نام با ایمیل و پسورد بدون خطا کار می‌کند
- ✅ صفحه انتخاب نقش نمایش داده می‌شود
- ✅ انتخاب نقش سرمایه‌گذار بدون خطا کار می‌کند
- ✅ لاگین با گوگل به صفحه انتخاب نقش هدایت می‌کند
- ✅ کاربران به پنل مناسب هدایت می‌شوند

## ⚠️ نکات مهم:

1. این دستورات را در محیط production Supabase خود اجرا کنید
2. قبل از اجرا، از دیتابیس بکاپ بگیرید
3. اگر خطایی در اجرای دستورات دیدید، متن خطا را گزارش دهید
4. بعد از اجرا، تست‌های فوق را انجام دهید و نتیجه را گزارش دهید
