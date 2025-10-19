# 🧪 راهنمای تست Admin RBAC System

این راهنما به تو کمک می‌کنه سیستم RBAC (Role-Based Access Control) برای Admin رو تست کنی.

---

## ✅ چیزی که پیاده‌سازی شد:

### 1. Database:
- ✅ اضافه شدن `admin` به `profiles.role` constraint
- ✅ جدول `admins` برای مدیریت admin ها

### 2. Backend (AuthContext):
- ✅ Fetch کردن `userRole` از database
- ✅ محاسبه `isAdmin` (true/false)
- ✅ Auto-update role بعد از login

### 3. Frontend:
- ✅ `ProtectedRoute` - استفاده از `userRole` از AuthContext
- ✅ `AdminProtectedRoute` - محافظت از صفحات admin
- ✅ Auto-redirect based on role

---

## 📋 پیش‌نیاز: تنظیم Database

**قبل از تست، باید یک کاربر رو به عنوان Admin تنظیم کنی!**

### راه سریع (کپی/پیست):

1. **باز کن:** Supabase Dashboard → SQL Editor
2. **اجرا کن این query رو:**

```sql
-- 1️⃣ اضافه کردن admin به role constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('entrepreneur', 'investor', 'programmer', 'consultant', 'designer', 'admin'));

-- 2️⃣ پیدا کردن USER_ID خودت
-- جایگزین کن: YOUR_EMAIL@example.com
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL@example.com';
-- کپی کن این ID رو

-- 3️⃣ اضافه کردن به admins table
-- جایگزین کن: USER_ID و EMAIL
INSERT INTO admins (user_id, email, role, is_active)
VALUES (
    'USER_ID_FROM_STEP_2',
    'YOUR_EMAIL@example.com',
    'super_admin',
    true
)
ON CONFLICT (user_id) DO NOTHING;

-- 4️⃣ آپدیت role در profiles
-- جایگزین کن: USER_ID
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

**نتیجه مورد انتظار:**
```
user_id: (یک UUID)
email: YOUR_EMAIL@example.com
admin_role: super_admin
profile_role: admin
is_active: true
```

---

## 🧪 تست ۱: تست Auto-redirect به Admin Dashboard

### هدف:
وقتی admin login می‌کنه، باید به صفحه `/admin` redirect بشه

### مراحل:

1. **Logout کن** (اگر login هستی):
   - کلیک روی Logout button

2. **باز کن:** http://localhost:5174/login

3. **Login کن** با email که admin کردی

4. **نتیجه مورد انتظار:**
   - ✅ باید بعد از login به `/admin` redirect بشی
   - ✅ صفحه Admin Dashboard نمایش داده بشه
   - ✅ **نباید** به Role Selection یا Entrepreneur Dashboard بری

### اگر مشکل بود:
- چک کن که `profiles.role = 'admin'` برای این user
- چک کن Browser Console (F12) برای error ها
- Logout کن و دوباره Login کن

---

## 🧪 تست ۲: دسترسی مستقیم به /admin

### هدف:
وقتی admin به `/admin` می‌ره، نباید redirect بشه

### مراحل:

1. **Login کن** به عنوان admin (از تست قبل)

2. **تایپ کن در address bar:**
   ```
   http://localhost:5174/admin
   ```

3. **نتیجه مورد انتظار:**
   - ✅ صفحه Admin Dashboard نمایش داده بشه
   - ✅ هیچ redirect نشه
   - ✅ همه فیچرهای admin کار کنن

---

## 🧪 تست ۳: Non-admin نمی‌تونه به /admin دسترسی داشته باشه

### هدف:
کاربران غیر admin نباید به صفحه admin دسترسی داشته باشن

### مراحل:

1. **Logout کن**

2. **Login کن** با یک account که **admin نیست** (entrepreneur, investor, etc.)

3. **تایپ کن در address bar:**
   ```
   http://localhost:5174/admin
   ```

4. **نتیجه مورد انتظار:**
   - ✅ باید به صفحه مناسب role خودش redirect بشه
   - مثلاً اگر entrepreneur باشه → `/entrepreneur`
   - مثلاً اگر investor باشه → `/investor`
   - ✅ **نباید** صفحه admin رو ببینه
   - ✅ **نباید** "Access Denied" ببینه (چون auto-redirect میشه)

---

## 🧪 تست ۴: تست با User بدون Login

### هدف:
کاربران که login نکردن نباید به admin دسترسی داشته باشن

### مراحل:

1. **Logout کن** (اگر login هستی)

2. **باز کن:**
   ```
   http://localhost:5174/admin
   ```

3. **نتیجه مورد انتظار:**
   - ✅ باید به `/auth` یا `/login` redirect بشه
   - ✅ صفحه login نمایش داده بشه

---

## 🧪 تست ۵: تست AuthContext - isAdmin

### هدف:
چک کردن اینکه AuthContext درست `isAdmin` رو محاسبه می‌کنه

### مراحل:

1. **باز کن:** Browser Console (F12) → Console tab

2. **Login کن** به عنوان admin

3. **تایپ کن در Console:**
   ```javascript
   // این خطا میده ولی می‌تونی از React DevTools استفاده کنی
   ```

4. **روش بهتر - باز کن:** React DevTools → Components → AuthProvider

5. **چک کن:**
   - `userRole: "admin"`
   - `isAdmin: true`

6. **نتیجه مورد انتظار:**
   - ✅ `userRole` باید `"admin"` باشه
   - ✅ `isAdmin` باید `true` باشه

---

## 🧪 تست ۶: تست با چند User (Admin و Non-admin)

### هدف:
مطمئن شدن که سیستم RBAC برای هر دو نوع user کار می‌کنه

### مراحل:

1. **Login کن** به عنوان Admin:
   - ✅ باید به `/admin` redirect بشه

2. **Logout کن**

3. **Login کن** به عنوان Entrepreneur:
   - ✅ باید به `/entrepreneur` redirect بشه

4. **تایپ کن:**
   ```
   http://localhost:5174/admin
   ```
   - ✅ باید به `/entrepreneur` redirect بشه (چون entrepreneur هست)

5. **Logout کن**

6. **Login کن** به عنوان Investor:
   - ✅ باید به `/investor` redirect بشه

7. **تایپ کن:**
   ```
   http://localhost:5174/admin
   ```
   - ✅ باید به `/investor` redirect بشه (چون investor هست)

---

## 🧪 تست ۷: Build و Production Test

### مراحل:

1. **اجرا کن:**
   ```bash
   npm run build
   ```

2. **نتیجه مورد انتظار:**
   ```bash
   ✓ built in X.XXs
   ```

3. **چک کن:**
   - ✅ هیچ TypeScript error نباشه
   - ✅ Build موفق باشه

---

## ✅ خلاصه چک‌لیست

- [ ] Database migration اجرا شد (`admin` به role constraint اضافه شد)
- [ ] یک user به عنوان admin تنظیم شد (admins table + profiles.role)
- [ ] Admin بعد از login به `/admin` redirect می‌شه
- [ ] Admin می‌تونه مستقیماً به `/admin` دسترسی داشته باشه
- [ ] Non-admin ها نمی‌تونن به `/admin` دسترسی داشته باشن (auto-redirect)
- [ ] User های بدون login به `/admin` دسترسی ندارن (redirect به login)
- [ ] AuthContext درست `userRole` و `isAdmin` رو محاسبه می‌کنه
- [ ] Build موفق است (`npm run build`)

---

## 🐛 مشکلات رایج و راه‌حل‌ها

### مشکل ۱: Admin بعد از login به entrepreneur می‌ره
**علت:** `profiles.role` هنوز `entrepreneur` هست

**راه‌حل:**
```sql
UPDATE profiles
SET role = 'admin'
WHERE user_id = 'YOUR_USER_ID';
```

---

### مشکل ۲: Error: "role 'admin' not allowed"
**علت:** Migration اجرا نشده

**راه‌حل:**
```sql
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('entrepreneur', 'investor', 'programmer', 'consultant', 'designer', 'admin'));
```

---

### مشکل ۳: isAdmin همیشه false هست
**علت:** AuthContext role رو fetch نمی‌کنه

**راه‌حل:**
- Logout کن
- Clear browser cache (Ctrl + Shift + Delete)
- Login دوباره کن

---

### مشکل ۴: Console error: "Error fetching user role"
**علت:** RLS policies ممکنه دسترسی رو block کنن

**راه‌حل:**
```sql
-- اضافه کردن policy برای read profiles
CREATE POLICY "Users can read their own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = user_id);
```

---

## 📊 نتایج مورد انتظار

### قبل از RBAC:
- ❌ Admin باید manual به `/admin.html` بره
- ❌ هر کسی می‌تونست به admin panel دسترسی داشته باشه
- ❌ Session management برای admin جداگانه بود

### بعد از RBAC:
- ✅ Admin بعد از login خودکار به `/admin` می‌ره
- ✅ فقط user های با `role = 'admin'` می‌تونن به admin panel دسترسی داشته باشن
- ✅ از همون Auth system برای همه استفاده می‌کنیم
- ✅ Auto-redirect based on role
- ✅ مهندسی بهتر و امنیت بالاتر

---

**آخرین به‌روزرسانی:** 2025-10-19

**اگر همه تست‌ها ✅ بودند → RBAC موفق بود!** 🎉
