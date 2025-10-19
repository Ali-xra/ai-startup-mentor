# راهنمای فعال‌سازی قابلیت حذف کاربر برای ادمین

## مشکل

وقتی ادمین می‌خواهد یک کاربر را حذف کند، ممکن است با خطای دسترسی (permission denied) مواجه شود. این به دلیل Row Level Security (RLS) policies است که در Supabase روی جدول `profiles` تنظیم شده است.

## راه‌حل

باید یک RLS policy اضافه کنیم که به کاربران با role='admin' اجازه حذف از جدول profiles را بدهد.

## مراحل راه‌اندازی

### قدم 1: باز کردن SQL Editor در Supabase

1. وارد پنل Supabase شوید
2. به بخش **SQL Editor** بروید
3. یک Query جدید ایجاد کنید

### قدم 2: اجرای SQL زیر

```sql
-- ایجاد policy برای حذف کاربران توسط ادمین
CREATE POLICY "Admins can delete any profile"
ON public.profiles
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);
```

### قدم 3: تست کردن

1. لاگین کنید با حساب admin (ali69.iceland@gmail.com)
2. به پنل ادمین بروید (/admin)
3. به صفحه Users بروید
4. روی دکمه "🗑️ حذف" کلیک کنید
5. در دیالوگ تایید، روی "✓ تایید حذف" کلیک کنید
6. باید پیام "✅ کاربر با موفقیت حذف شد" نمایش داده شود

## بررسی RLS Policies فعلی

برای بررسی اینکه چه policy هایی روی جدول profiles وجود دارد:

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';
```

## نکات مهم

1. **امنیت**: این policy فقط به کاربرانی که role='admin' دارند اجازه حذف می‌دهد
2. **حذف از auth.users**: فعلاً فقط از جدول `profiles` حذف می‌شود (که کافی است)
3. **غیرقابل بازگشت**: عملیات حذف غیرقابل بازگشت است
4. **سایر policies**: مطمئن شوید که سایر policies موجود را disable نکرده‌اید

## عیب‌یابی

### خطا: "permission denied for table profiles"

اگر این خطا را دریافت کردید، یعنی policy به درستی اجرا نشده است. دوباره SQL بالا را اجرا کنید.

### خطا: "policy already exists"

اگر این خطا را دریافت کردید، یعنی policy قبلاً ایجاد شده است. می‌توانید ابتدا آن را حذف کرده و دوباره ایجاد کنید:

```sql
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;

-- سپس دوباره CREATE POLICY را اجرا کنید
```

## حذف کامل کاربر (اختیاری)

اگر می‌خواهید کاربر از `auth.users` نیز حذف شود (توصیه نمی‌شود)، باید یک RPC function ایجاد کنید:

```sql
CREATE OR REPLACE FUNCTION delete_user(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- بررسی که فراخواننده admin است
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;

  -- حذف از auth.users
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;
```

**توجه**: حذف از `auth.users` می‌تواند مشکلاتی ایجاد کند. بهتر است فقط از `profiles` حذف کنید.

## مستندات بیشتر

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
