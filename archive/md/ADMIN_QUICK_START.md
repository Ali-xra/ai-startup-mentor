# 🚀 راه‌اندازی سریع پنل ادمین

## ✅ کارهایی که انجام شد:

1. ✅ جداول SQL ساخته شد (تا مرحله 13)
2. ✅ Feature Flags insert شد
3. ✅ پسورد تنظیم شد: `Admin@123456`

---

## 📝 مراحل باقی‌مانده:

### مرحله 14: پیدا کردن User ID

در Supabase SQL Editor این دستور رو اجرا کن:

```sql
SELECT id, email FROM auth.users WHERE email = 'ali69.iceland@gmail.com';
```

**خروجی:** یک UUID مثل `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

اون UUID رو **کپی** کن!

---

### مرحله 15: اضافه کردن خودت به عنوان Super Admin

این دستور رو اجرا کن (USER_ID رو جایگزین کن):

```sql
INSERT INTO admins (user_id, email, role, is_active)
VALUES (
    'USER_ID_که_کپی_کردی',
    'ali69.iceland@gmail.com',
    'super_admin',
    true
);
```

**مثال:**
```sql
INSERT INTO admins (user_id, email, role, is_active)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'ali69.iceland@gmail.com',
    'super_admin',
    true
);
```

---

### مرحله 16: چک کردن

```sql
SELECT * FROM admins WHERE email = 'ali69.iceland@gmail.com';
```

باید یک رکورد ببینی.

---

## 🎉 ورود به پنل

**آدرس:**
```
http://localhost:5175/admin.html
```

**اطلاعات ورود:**
- Email: `ali69.iceland@gmail.com`
- Password: `Admin@123456`

---

## 🛠️ نحوه استفاده

### 1. فعال کردن فیچر برای کاربر:

1. از Supabase، User ID کاربر رو پیدا کن:
   - **Supabase** → **Authentication** → **Users** → کپی User ID

2. در پنل ادمین، User ID رو جستجو کن

3. روی دکمه‌های **Free** / **Starter** / **Pro** / **Enterprise** کلیک کن

یا:

4. دستی checkbox فیچرها رو فعال/غیرفعال کن

---

## 🐛 اگر صفحه سفید بود:

1. Terminal رو باز کن
2. این دستور رو اجرا کن:
```bash
npm run dev
```

3. Browser Console رو باز کن (`F12`)
4. خطاها رو بفرست

---

## 📞 چک کردن خطاها:

```sql
-- چک کردن جداول
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('feature_flags', 'user_features', 'admins', 'admin_audit_log');

-- چک کردن Feature Flags
SELECT COUNT(*) FROM feature_flags;

-- چک کردن Functions
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('is_admin', 'has_feature', 'get_user_features');
```

---

## ✅ تمام!

بعد از مرحله 15، می‌تونی وارد پنل بشی و شروع کنی! 🚀
