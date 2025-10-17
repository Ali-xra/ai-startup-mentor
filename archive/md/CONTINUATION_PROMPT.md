# دستور ادامه پروژه AI Startup Mentor

## وضعیت فعلی پروژه:
این یک اپلیکیشن **AI Startup Mentor** است که با React + TypeScript + Vite + Supabase ساخته شده. کاربران می‌توانند ایده استارتاپی خود را از 8 مرحله (Phase) عبور دهند و بیزنس پلن کامل دریافت کنند.

### ساختار فایل‌های اصلی:
- `index.html` + `index.tsx` → صفحه لندینگ (صفحه اصلی سایت)
- `app.html` + `app.tsx` → اپلیکیشن اصلی (entry point)
- `AppContent.tsx` → کامپوننت اصلی اپلیکیشن (قبلاً App.tsx بود)
- `admin.html` + `admin.tsx` → پنل ادمین
- `pricing.html` + `pricing.tsx` → صفحه قیمت‌گذاری

### سیستم‌های پیاده‌سازی شده:
✅ احراز هویت کامل با Supabase
✅ سیستم 8 مرحله‌ای (Phase 1-8) برای توسعه استارتاپ
✅ دوزبانه فارسی/انگلیسی با `useLanguage` context
✅ تم روشن/تاریک
✅ سیستم Feature Flags (Free/Pro/Enterprise)
✅ محدودیت Free Plan: فقط Phase 1، 1 پروژه، 50 پیام AI
✅ سیستم Upgrade Request (کاربران Free می‌توانند درخواست ارتقا بدهند)
✅ پنل ادمین با `UpgradeRequestsPanel` برای تایید/رد درخواست‌ها
✅ صفحه لندینگ با showcase پروژه‌های عمومی (فعلاً Mock Data)

---

## 📋 کارهای باقی‌مانده (به ترتیب اولویت):

### **🔴 اولویت بالا - دیتابیس و Backend:**

#### 1. اجرای Migration برای `upgrade_requests`:
فایل SQL موجود است: `supabase/migrations/create_upgrade_requests.sql`
باید در Supabase اجرا شود تا جدول ایجاد شود.

#### 2. ساخت جدول `public_projects`:
جدولی برای نمایش پروژه‌های عمومی کاربران:
```sql
CREATE TABLE public_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  phase_completed INTEGER DEFAULT 1,
  total_phases INTEGER DEFAULT 8,
  thumbnail_url TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. ساخت جدول `project_likes`:
```sql
CREATE TABLE project_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);
```

#### 4. ساخت جدول `project_comments`:
```sql
CREATE TABLE project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. تنظیم RLS Policies:
- همه بتوانند پروژه‌های عمومی را ببینند
- فقط صاحب پروژه بتواند publish/unpublish کند
- کاربران لاگین شده بتوانند لایک و کامنت بگذارند

---

### **🟡 اولویت متوسط - قابلیت‌های Public Projects:**

#### 6. ساخت Service برای Public Projects:
فایل: `services/publicProjectsService.ts`
- `publishProject(projectId)` - انتشار پروژه
- `unpublishProject(projectId)` - عدم انتشار
- `getPublicProjects(filter)` - دریافت لیست (all/trending/completed/recent)
- `likeProject(projectId)` - لایک پروژه
- `unlikeProject(projectId)` - حذف لایک
- `addComment(projectId, text)` - اضافه کردن کامنت
- `getComments(projectId)` - دریافت کامنت‌ها

#### 7. اتصال صفحه لندینگ به Backend:
در `index.tsx`:
- حذف Mock Data
- استفاده از `publicProjectsService` برای دریافت پروژه‌های واقعی
- پیاده‌سازی فیلترها (trending/completed/recent)
- قابلیت لایک/کامنت (با چک کردن لاگین بودن)

#### 8. ساخت صفحه جزئیات پروژه:
فایل جدید: `project-details.html` + `project-details.tsx`
- نمایش کامل اطلاعات پروژه
- نمایش همه کامنت‌ها
- امکان لایک و کامنت‌گذاری

---

### **🟢 اولویت پایین - رفع خطاها و بهبودها:**

#### 9. رفع خطاهای TypeScript:
- فایل `i18n.ts`: خطاهای مربوط به Stage‌های قدیمی (f1, f2, ...) که حذف شده‌اند
- فایل `hooks/useStartupJourney.ts`: متغیرهای استفاده نشده
- فایل‌های دیگر: cleanup کردن unused imports

#### 10. تکمیل صفحه Pricing:
فایل: `pricing.tsx`
- دوزبانه کامل (فارسی/انگلیسی)
- دکمه‌های CTA برای هر پلن
- ریدایرکت به صفحه لاگین یا upgrade request

#### 11. بهبود پنل Admin:
- تست کامل `UpgradeRequestsPanel`
- اضافه کردن Dashboard با آمار
- امکان مدیریت پروژه‌های عمومی (تایید/رد/حذف)

#### 12. قابلیت‌های جانبی:
- سیستم نوتیفیکیشن (زمان تایید upgrade request)
- صفحه پروفایل کاربر (`ProfileModal` موجود است)
- دکمه "Publish as Public" در هدر یا منوی پروژه
- Export پروژه به PDF (جزئی پیاده شده، نیاز به تکمیل)

---

## 📁 فایل‌های کلیدی موجود:

### Components:
- `components/UpgradeRequestModal.tsx` - مودال درخواست ارتقا (✅ کامل)
- `components/admin/UpgradeRequestsPanel.tsx` - پنل ادمین برای مدیریت درخواست‌ها (✅ کامل)
- `components/ProfileModal.tsx` - مودال پروفایل کاربر (⚠️ نیاز به تست)
- `components/ProjectMembersModal.tsx` - مدیریت اعضای تیم (⚠️ نیاز به تست)
- `components/SearchBox.tsx` - جستجو (⚠️ نیاز به استفاده)

### Services:
- `services/upgradeRequestService.ts` - سرویس upgrade requests (✅ کامل)
- `services/featureFlagsService.ts` - مدیریت محدودیت‌های پلن (✅ کامل)
- `services/supabaseClient.ts` - کلاینت Supabase (✅ کامل)

### Hooks:
- `hooks/useFeatureFlags.ts` - هوک برای چک کردن محدودیت‌ها (✅ کامل)
- `hooks/useStartupJourney.ts` - مدیریت مسیر 8 مرحله‌ای (⚠️ دارای خطاهای TS)

### Config:
- `config/stages/phase1.ts` تا `phase8.ts` - تعریف 8 مرحله (✅ کامل)
- `config/stages/index.ts` - export همه مراحل (✅ کامل)

### Types:
- `types.ts` - تایپ‌های اصلی شامل `UpgradeRequest`, `StartupData`, etc (✅ کامل)
- `types/supabase.ts` - تایپ‌های Supabase (✅ کامل)

### Database:
- `supabase/migrations/create_upgrade_requests.sql` - ⚠️ نیاز به اجرا

---

## 🚀 دستور برای ادامه:

**"سلام! این پروژه AI Startup Mentor را از جایی که قطع شده ادامه بده. همه کارهای اصلی انجام شده و اپلیکیشن کار می‌کند. حالا باید کارهای باقی‌مانده را انجام دهیم:**

**اولویت اول: دیتابیس و Backend برای Public Projects**
1. Migration جدول upgrade_requests را اجرا کن
2. جداول public_projects، project_likes، project_comments را بساز
3. RLS policies مناسب تنظیم کن
4. سرویس publicProjectsService.ts را بساز

**اولویت دوم: اتصال صفحه لندینگ به Backend**
5. Mock data را حذف کن و از backend واقعی استفاده کن
6. قابلیت لایک/کامنت را پیاده کن
7. صفحه جزئیات پروژه بساز

**اولویت سوم: رفع خطاها و تکمیل**
8. خطاهای TypeScript در i18n.ts و useStartupJourney.ts را رفع کن
9. صفحه pricing را دوزبانه کامل کن
10. پنل ادمین را تست و بهبود بده

**لطفاً از کار شماره 1 شروع کن و گام به گام پیش برو. بعد از هر مرحله به من بگو تا تایید کنم.**"

---

## ⚙️ تنظیمات محیط:
- **Working directory:** `c:\Users\Ali\Desktop\proje\ide-maker`
- **Dev server:** اجرا شده در background (multiple instances)
- **Port:** 5177 (یا پورت‌های دیگر)
- **Git branch:** main
- **Database:** Supabase

## 🔑 نکات مهم:
- همه چیز دوزبانه است (فارسی/انگلیسی)
- از `useLanguage()` برای زبان و `localStorage.getItem('theme')` برای تم استفاده کن
- همیشه RLS policies را فراموش نکن
- Free Plan فقط به Phase 1 دسترسی دارد (maxPhase = 1)
- Backend در Supabase است، نه سرور جداگانه
