# 🔧 راهنمای تنظیم Admin در Database

این راهنما نشون می‌ده چطور یک کاربر رو به عنوان Admin تنظیم کنی.

---

## گام ۱: اجرای Migration

1. **باز کن:** Supabase Dashboard → SQL Editor
2. **کپی کن:** محتوای فایل `supabase/migrations/add_admin_role_to_profiles.sql`
3. **Paste کن** در SQL Editor
4. **اجرا کن:** Run

این کار `admin` رو به لیست role های مجاز اضافه می‌کنه.

---

## گام ۲: پیدا کردن User ID خودت

**اجرا کن در SQL Editor:**

```sql
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL@example.com';
```

**جایگزین کن:** `YOUR_EMAIL@example.com` رو با email واقعی خودت

**نتیجه:** یه چیزی شبیه این میگیری:
```
id: 550e8400-e29b-41d4-a716-446655440000
email: ali@example.com
```

**کپی کن:** این `id` رو (یه UUID هست)

---

## گام ۳: اضافه کردن کاربر به جدول admins

**اجرا کن در SQL Editor:**

```sql
INSERT INTO admins (user_id, email, role, is_active)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',  -- 👈 USER_ID که از گام 2 گرفتی
    'YOUR_EMAIL@example.com',                 -- 👈 Email خودت
    'super_admin',                            -- نقش: super_admin یا admin
    true                                      -- فعال
)
ON CONFLICT (user_id) DO NOTHING;
```

**جایگزین کن:**
- `550e8400-e29b-41d4-a716-446655440000` → USER_ID واقعی خودت
- `YOUR_EMAIL@example.com` → Email واقعی خودت

---

## گام ۴: آپدیت role در جدول profiles

**اجرا کن در SQL Editor:**

```sql
UPDATE profiles
SET role = 'admin'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';  -- 👈 USER_ID خودت
```

**جایگزین کن:** `550e8400-e29b-41d4-a716-446655440000` → USER_ID واقعی خودت

---

## گام ۵: چک کردن اینکه درست تنظیم شده

**اجرا کن:**

```sql
-- چک کردن admins table
SELECT * FROM admins WHERE email = 'YOUR_EMAIL@example.com';

-- چک کردن profiles table
SELECT user_id, role FROM profiles WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
```

**نتیجه مورد انتظار:**

```
-- admins table:
id: ...
user_id: 550e8400-e29b-41d4-a716-446655440000
email: YOUR_EMAIL@example.com
role: super_admin
is_active: true

-- profiles table:
user_id: 550e8400-e29b-41d4-a716-446655440000
role: admin
```

---

## 🎯 خلاصه Commands (کپی/پیست آماده)

```sql
-- 1️⃣ Migration: اضافه کردن admin به role ها
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('entrepreneur', 'investor', 'programmer', 'consultant', 'designer', 'admin'));

-- 2️⃣ پیدا کردن USER_ID
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL@example.com';

-- 3️⃣ اضافه کردن به admins table (جایگزین کن USER_ID و EMAIL)
INSERT INTO admins (user_id, email, role, is_active)
VALUES (
    'USER_ID_FROM_STEP_2',
    'YOUR_EMAIL@example.com',
    'super_admin',
    true
)
ON CONFLICT (user_id) DO NOTHING;

-- 4️⃣ آپدیت profiles (جایگزین کن USER_ID)
UPDATE profiles
SET role = 'admin'
WHERE user_id = 'USER_ID_FROM_STEP_2';

-- 5️⃣ چک کردن نتیجه
SELECT
    a.user_id,
    a.email,
    a.role as admin_role,
    p.role as profile_role,
    a.is_active
FROM admins a
JOIN profiles p ON a.user_id = p.user_id
WHERE a.email = 'YOUR_EMAIL@example.com';
```

---

## ❓ سوالات متداول

### Q: اگر الان entrepreneur هستم چی؟
A: مشکلی نیست! فقط `role` رو در `profiles` از `entrepreneur` به `admin` تغییر بده. بعد از login، به صفحه admin می‌ری.

### Q: می‌تونم هم admin باشم هم entrepreneur؟
A: در حال حاضر نه، چون یک user فقط می‌تونه یک `role` داشته باشه. ولی می‌تونیم این رو پیاده‌سازی کنیم (multi-role system).

### Q: تفاوت admin و super_admin چیه؟
A:
- `admin`: دسترسی‌های معمولی admin panel
- `super_admin`: دسترسی‌های بیشتر (مثل مدیریت admin های دیگه)

### Q: چطور یک admin دیگه اضافه کنم؟
A: همین گام‌های بالا رو برای email اون شخص تکرار کن.

---

## ⚠️ نکات امنیتی

1. ✅ فقط به افراد مورد اعتماد دسترسی admin بده
2. ✅ هر admin باید email verify شده داشته باشه
3. ✅ حتماً `is_active = true` رو چک کن
4. ✅ همیشه از `super_admin` role برای خودت استفاده کن
5. ✅ Admin credentials رو در جای امن نگهداری کن

---

**آخرین به‌روزرسانی:** 2025-10-19
