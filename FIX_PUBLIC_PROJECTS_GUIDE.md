# 🔧 راهنمای رفع خطای Public Projects

## ❌ مشکل:

خطای `invalid input syntax for type uuid: "58"` هنگام انتشار پروژه

## 🔍 علت:

- جدول `public_projects` انتظار `project_id` به صورت UUID داره
- ولی جدول اصلی `projects` از BIGINT استفاده می‌کنه
- `selectedProjectId` = 58 (عدد ساده) ولی دیتابیس UUID می‌خواد

## ✅ راه‌حل:

### مرحله ۱: اجرای Migration در Supabase Dashboard

1. برو به **Supabase Dashboard**: https://supabase.com/dashboard
2. پروژه خودت رو انتخاب کن
3. از منوی سمت چپ **SQL Editor** رو باز کن
4. یک **New Query** بزن
5. محتوای فایل زیر رو کپی و paste کن:

```
supabase/migrations/fix_public_projects_project_id_type.sql
```

6. دکمه **Run** رو بزن
7. اگر موفق بود، باید پیام "Success" رو ببینی

### مرحله ۲: تست کردن

1. برگرد به برنامه و refresh کن
2. یک پروژه رو انتخاب کن
3. از منوی Settings → Share بخش، دکمه "انتشار" رو بزن
4. باید پیام "✅ پروژه در بازار منتشر شد!" رو ببینی

### مرحله ۳: بررسی در Marketplace

1. برو به صفحه اصلی `/`
2. اسکرول کن پایین تا بخش "🌟 پروژه‌های عمومی"
3. باید پروژه منتشر شده رو ببینی
4. روی دکمه "مشاهده همه پروژه‌ها" کلیک کن
5. در صفحه `/marketplace` پروژه رو باید ببینی

## 🔍 تغییرات اعمال شده:

### Before (قبل):

```sql
project_id UUID NOT NULL  -- ❌ نوع اشتباه
```

### After (بعد):

```sql
project_id BIGINT NOT NULL  -- ✅ نوع صحیح
```

## 📊 جداول تغییر یافته:

- ✅ `public_projects` - project_id از UUID به BIGINT
- ✅ `project_likes` - بازسازی با foreign key صحیح
- ✅ `project_comments` - بازسازی با foreign key صحیح
- ✅ RLS Policies - بازسازی کامل
- ✅ RPC Functions - به‌روزرسانی با نوع داده صحیح

## ⚠️ نکات مهم:

1. این migration جداول موجود رو **DROP** می‌کنه و دوباره می‌سازه
2. اگر داده‌های test در جداول داری، پاک میشن
3. بعد از اجرا، همه چیز دوباره از صفر شروع میشه
4. اگر می‌خوای داده‌ها رو نگه داری، قبل از اجرا backup بگیر

## 🐛 Debugging:

اگر بعد از migration هنوز خطا داری:

### بررسی ۱: نوع project_id

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'public_projects'
AND column_name = 'project_id';
```

باید `bigint` رو نشون بده.

### بررسی ۲: بررسی RLS Policies

```sql
SELECT * FROM public_projects WHERE is_published = true;
```

اگر خالیه، یعنی هنوز پروژه‌ای publish نشده.

### بررسی ۳: تست RPC Function

```sql
SELECT * FROM get_public_projects('all', 10, 0);
```

باید لیست پروژه‌ها رو برگردونه (اگر publish شده باشن).

## 💡 Alternative: استفاده از UUID در همه جا

اگر می‌خوای از UUID استفاده کنی (Best Practice):

1. جدول `projects` رو تغییر بده که از UUID استفاده کنه
2. همه foreign key ها رو به‌روزرسانی کن
3. کد فرانت‌اند رو به‌روزرسانی کن که با UUID کار کنه

ولی این کار زمان‌برتره و نیاز به تغییرات گسترده‌تری داره.

## 📝 بعد از اصلاح:

Migration رو commit کن:

```bash
git add supabase/migrations/fix_public_projects_project_id_type.sql
git commit -m "fix: Change public_projects.project_id from UUID to BIGINT"
```
