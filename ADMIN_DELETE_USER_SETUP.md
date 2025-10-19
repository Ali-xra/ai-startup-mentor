# راهنمای فعال‌سازی قابلیت حذف کاربر برای ادمین

## مشکل

وقتی ادمین می‌خواهد یک کاربر را حذف کند، باید از تمام جداول مرتبط حذف شود. این کار شامل:
- `investor_profiles`
- `user_features`
- `profiles`

همچنین باید RLS policy مناسب برای admin وجود داشته باشد تا از خطاهای دسترسی جلوگیری شود.

## راه‌حل

ما از یک **RPC function** استفاده می‌کنیم که:
1. تمام جداول را به ترتیب صحیح حذف می‌کند
2. از خطاهای Foreign Key جلوگیری می‌کند
3. فقط توسط admin قابل اجرا است
4. جلوگیری از حذف خود admin

## مراحل راه‌اندازی

### قدم 1: ایجاد RPC Function

1. وارد پنل Supabase شوید
2. به بخش **SQL Editor** بروید
3. SQL زیر را کپی و اجرا کنید:

```sql
-- Function برای حذف کامل کاربر از تمام جداول مرتبط
CREATE OR REPLACE FUNCTION public.delete_user_completely(target_user_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  deleted_count integer := 0;
BEGIN
  -- بررسی که فراخواننده admin است
  IF NOT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Only active admins can delete users';
  END IF;

  -- جلوگیری از حذف خود admin
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete yourself';
  END IF;

  -- حذف از investor_profiles
  DELETE FROM public.investor_profiles WHERE id = target_user_id;

  -- حذف از user_features
  DELETE FROM public.user_features WHERE user_id = target_user_id;

  -- حذف از profiles
  DELETE FROM public.profiles WHERE id = target_user_id;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- اگر حذف موفق بود، نتیجه را برگردان
  IF deleted_count > 0 THEN
    result := json_build_object(
      'success', true,
      'message', 'User deleted successfully',
      'user_id', target_user_id
    );
  ELSE
    result := json_build_object(
      'success', false,
      'message', 'User not found or already deleted',
      'user_id', target_user_id
    );
  END IF;

  RETURN result;
END;
$$;
```

### قدم 2: بررسی RLS Policy

اگر مشکل "infinite recursion" داشتید، این SQL را اجرا کنید:

```sql
-- حذف policy قدیمی (اگر وجود دارد و مشکل دارد)
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;

-- ایجاد policy جدید با استفاده از admins table
CREATE POLICY "Admins can delete any profile"
ON public.profiles
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.admins
    WHERE admins.user_id = auth.uid()
    AND admins.is_active = true
  )
);
```

**توجه**: این policy از جدول `admins` استفاده می‌کند نه `profiles` تا از infinite recursion جلوگیری کند.

### قدم 3: تست کردن

1. لاگین کنید با حساب admin
2. به پنل ادمین بروید (`/admin`)
3. به صفحه **Users** بروید
4. روی دکمه "🗑️ حذف" کنار یک کاربر کلیک کنید
5. در دیالوگ تایید، روی "✓ تایید حذف" کلیک کنید
6. باید پیام "✅ کاربر با موفقیت حذف شد" نمایش داده شود
7. کاربر از لیست حذف شود و از database نیز پاک شود

## بررسی RLS Policies فعلی

برای بررسی اینکه چه policy هایی روی جدول profiles وجود دارد:

```sql
SELECT
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles';
```

## ویژگی‌های امنیتی

1. **فقط Admin**: فقط کاربرانی که در جدول `admins` با `is_active = true` هستند می‌توانند حذف کنند
2. **جلوگیری از حذف خود**: Admin نمی‌تواند خودش را حذف کند
3. **حذف کامل**: تمام رکوردهای مرتبط از جداول مختلف حذف می‌شوند
4. **بدون خطای Foreign Key**: به ترتیب صحیح حذف می‌شود
5. **Audit Trail**: می‌توانید logging اضافه کنید برای ثبت چه کسی چه کاربری را حذف کرده

## عیب‌یابی

### خطا: "Only active admins can delete users"

این یعنی کاربر فعلی در جدول `admins` نیست یا `is_active = false` است.

**راه‌حل**:
```sql
-- بررسی وضعیت admin بودن
SELECT * FROM admins WHERE user_id = auth.uid();

-- اگر وجود ندارد، اضافه کنید
INSERT INTO admins (user_id, is_active) VALUES (auth.uid(), true);
```

### خطا: "You cannot delete yourself"

این یک ویژگی امنیتی است. Admin نمی‌تواند خودش را حذف کند.

### خطا: "infinite recursion detected"

این به این معنی است که RLS policy از خود جدول `profiles` برای بررسی دسترسی استفاده می‌کند.

**راه‌حل**: از جدول `admins` استفاده کنید (قدم 2 را دوباره اجرا کنید)

### خطا: "function public.delete_user_completely does not exist"

Function ساخته نشده است. قدم 1 را دوباره اجرا کنید.

## مستندات بیشتر

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)

## نکات پیشرفته (اختیاری)

### اضافه کردن Audit Log

می‌توانید یک جدول `audit_log` بسازید و در function قبل از حذف، یک رکورد ثبت کنید:

```sql
-- اضافه به function قبل از DELETE ها
INSERT INTO audit_log (admin_id, action, target_user_id, timestamp)
VALUES (auth.uid(), 'DELETE_USER', target_user_id, NOW());
```

### حذف از auth.users نیز (پیشنهاد نمی‌شود)

اگر می‌خواهید کاربر از `auth.users` نیز حذف شود:

```sql
-- اضافه کردن به آخر function
DELETE FROM auth.users WHERE id = target_user_id;
```

**هشدار**: این کار می‌تواند مشکلاتی ایجاد کند و معمولاً توصیه نمی‌شود.
