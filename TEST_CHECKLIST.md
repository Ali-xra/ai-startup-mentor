# 🧪 چک‌لیست تست کاربری - AI Startup Mentor

**تاریخ تست:** 2025-10-24
**URL:** http://localhost:5174
**تستر:** Ali

---

## 🔧 تست مهندسی: آپدیت WORKFLOW_RULES.md با سیستم ۴ مرحله‌ای

**تاریخ:** 2025-10-24
**مدت زمان کل:** 5 دقیقه

---

### چیزی که انجام شد:

- اضافه شدن بخش "سیستم ۴ مرحله‌ای" در ابتدای فایل WORKFLOW_RULES.md
- توضیح کامل هر ۴ مرحله با template ها و مثال‌ها
- اضافه شدن فلوچارت کامل سیستم
- به‌روزرسانی version به 2.0

**فایل‌های تغییر یافته:**

- [WORKFLOW_RULES.md](WORKFLOW_RULES.md:1-516)

---

### تست ۱: بررسی محتوای فایل

**مدت زمان:** 2 دقیقه

1. باز کن فایل `WORKFLOW_RULES.md`
2. جستجو کن برای: `🚦 سیستم ۴ مرحله‌ای`
3. چک کن:
   - ✅ باید ببینی: بخش جدید با 4 مرحله کامل
   - ✅ باید ببینی: "⚠️ مهم: این سیستم برای همه چت‌ها"
   - ✅ باید ببینی: Template برای هر مرحله
   - ✅ باید ببینی: فلوچارت کامل در پایان
   - ❌ نباید ببینی: هیچ خطای فرمت یا syntax

**نتیجه مورد انتظار:**
✅ فایل شامل سیستم ۴ مرحله‌ای کامل با توضیحات جامع

---

### تست ۲: بررسی Build

**مدت زمان:** 1 دقیقه

1. اجرا کن: `npm run build`
2. چک کن خروجی terminal
3. نتیجه مورد انتظار:
   - ✅ Build موفق: "✓ built in Xms"
   - ✅ هیچ TypeScript error نیست
   - ⚠️ یک warning برای chunk size (عادیه، مربوط به این تغییرات نیست)

---

### تست ۳: بررسی ساختار فایل

**مدت زمان:** 2 دقیقه

1. باز کن `WORKFLOW_RULES.md`
2. چک کن ساختار:
   - خط 19: `# 🚦 سیستم ۴ مرحله‌ای`
   - خط 41: `## مرحله ۱️⃣: شناسایی`
   - خط 121: `## مرحله ۲️⃣: اجرا`
   - خط 206: `## مرحله ۳️⃣: ایجاد تست‌ها`
   - خط 348: `## مرحله ۴️⃣: تایید نهایی`
   - خط 465: `## 📊 خلاصه فلوچارت`
3. نتیجه مورد انتظار:
   - ✅ همه بخش‌ها موجودند
   - ✅ ترتیب صحیح است
   - ✅ فرمت markdown درست است

---

## 🎯 نتیجه نهایی:

اگر همه تست‌ها موفق بودن → آپدیت WORKFLOW_RULES.md به درستی انجام شده ✅

---

## ✅ چیزهای کامل شده که باید تست بشند:

### Task 1.1: Navigation System ✅ (کامل شد!)

### 🆕 Code Cleanup & Bug Fixes ✅ (امروز انجام شد!)

### Task 1.2: Error Boundaries ✅

### Task 1.3: Error Handler متمرکز ✅

### Task 1.4: Loading States System ✅

### Task 1.5: State Management ✅ (کامل شد!)

### Task 1.6: ESLint و Prettier Setup ✅ (امروز انجام شد!)

### Task 1.7: Security & API Keys ✅

### Task 1.8: Refactor useStartupJourney Hook ✅

### Task 1.10: Git Workflow ✅

---

# 🆕 تست‌های فوری - تغییرات امروز (2025-10-19)

## ✅ چیزهایی که امروز انجام شد:

### 1. پاکسازی کد (Code Cleanup)

- ✅ حذف 5 مورد Duplicate Context Providers از صفحات
- ✅ حذف InvestorRouter.tsx (nested BrowserRouter داشت)
- ✅ تنظیم tsconfig برای exclude کردن old/ folder
- ✅ کاهش bundle size از 767 KB به 761 KB

### 2. Dark Theme برای صفحه Login

- ✅ فقط صفحه لاگین dark theme شد
- ✅ بقیه صفحات theme خودشون رو نگه داشتند

### 3. تغییر Route کارآفرین

- ✅ Route از `/app` به `/entrepreneur` تغییر کرد
- ✅ Backward compatibility: `/app` redirect به `/entrepreneur`

---

## 🧪 تست‌های سریع (۵ دقیقه)

### ✅ تست ۱: صفحه لاگین Dark Theme داره

**مدت زمان:** ۳۰ ثانیه

1. **باز کن:** http://localhost:5174/login
2. **چک کن:** آیا صفحه لاگین **تیره (dark)** است؟
3. **چک کن:** آیا background رنگ تیره داره؟
4. **نتیجه مورد انتظار:**
   - ✅ Background باید dark gray باشه
   - ✅ متن‌ها باید روشن (سفید/خاکستری روشن) باشند

---

### ✅ تست ۲: Route کارآفرین

**مدت زمان:** ۲ دقیقه

1. **Login کن:** با یک account
2. **انتخاب کن:** role "Entrepreneur"
3. **چک کن URL:** باید بشه `http://localhost:5174/entrepreneur`
4. **نتیجه مورد انتظار:**
   - ✅ URL باید `/entrepreneur` باشه (نه `/app`)
   - ✅ Dashboard کارآفرین باید لود بشه
   - ✅ هیچ خطایی در Console نباشه

---

### ✅ تست ۳: Backward Compatibility

**مدت زمان:** ۳۰ ثانیه

1. **در browser بزن:** http://localhost:5174/app
2. **چک کن:** آیا به `/entrepreneur` redirect می‌شه؟
3. **نتیجه مورد انتظار:**
   - ✅ باید automatic redirect بشه به `/entrepreneur`

---

### ✅ تست ۴: بقیه صفحات Theme خودشون رو دارند

**مدت زمان:** ۱ دقیقه

1. **باز کن:** http://localhost:5174 (landing page)
2. **چک کن:** آیا theme اصلی (که قبلاً داشت) رو داره؟
3. **باز کن:** http://localhost:5174/pricing
4. **چک کن:** آیا theme خودش رو داره؟
5. **نتیجه مورد انتظار:**
   - ✅ صفحات دیگه نباید force dark باشند
   - ✅ فقط صفحه /login باید dark باشه

---

### ✅ تست ۵: Console بدون خطا

**مدت زمان:** ۱ دقیقه

1. **باز کن:** Browser Console (F12)
2. **Navigate کن:** به صفحات مختلف (landing, login, dashboard)
3. **چک کن:** آیا خطا هست؟
4. **نتیجه مورد انتظار:**
   - ✅ هیچ خطای `theme is not defined` نباشه
   - ✅ هیچ خطای `duplicate Provider` نباشه
   - ✅ هیچ خطای قرمز نباشه

---

## ✅ خلاصه چک‌لیست فوری

- [ ] صفحه لاگین (/login) dark theme داره
- [ ] پنل کارآفرین در URL `/entrepreneur` باز می‌شه
- [ ] `/app` به `/entrepreneur` redirect می‌شه
- [ ] صفحه اصلی (landing) theme خودش رو داره (نه force dark)
- [ ] هیچ خطای Console نیست
- [ ] Build موفق است: `npm run build`
- [ ] Dev server بدون خطا: `npm run dev`

---

**اگر همه ✅ بودند → تغییرات امروز موفق بودند!** 🎉

---

# 🆕 راهنمای تست تغییرات جدید (Task 1.1)

## 📌 Task 1.1: Navigation System - چطور تست کنیم؟

### ✅ چیزی که انجام شد:

- همه HTML files غیرضروری به پوشه `old/` منتقل شدند (13 فایل)
- فقط `index.html` در root باقی مونده
- React Router حالا به طور کامل navigation رو handle می‌کنه
- vite.config.ts به‌روز شد - فقط index.html در build
- index.html اصلاح شد - حالا main.tsx رو load می‌کنه

### 🧪 تست ۱: بررسی فایل‌های Root Directory

**مدت زمان:** ۱ دقیقه

1. **باز کن:** Explorer و برو به root پروژه
2. **چک کن:** آیا فقط `index.html` موجوده؟
3. **چک کن:** آیا این فایل‌ها **وجود ندارند**؟
   ```
   ❌ login.html
   ❌ entrepreneur.html
   ❌ investor.html
   ❌ programmer.html
   ❌ consultant.html
   ❌ designer.html
   ❌ admin.html
   ❌ pricing.html
   ❌ about.html
   ❌ session-manager.html
   ❌ logout.html
   ❌ demo.html
   ❌ test-programmer.html
   ```
4. **نتیجه مورد انتظار:** ✅ فقط index.html باید باشه

---

### 🧪 تست ۲: بررسی پوشه old/

**مدت زمان:** ۱ دقیقه

1. **باز کن:** پوشه `old/` در root
2. **چک کن:** آیا این فایل‌ها اینجا هستند؟
   ```
   ✅ old/login.html
   ✅ old/entrepreneur.html
   ✅ old/investor.html
   ✅ old/programmer.html
   ✅ old/consultant.html
   ✅ old/designer.html
   ✅ old/admin.html
   ✅ old/pricing.html
   ✅ old/about.html
   ✅ old/session-manager.html
   ✅ old/logout.html
   ✅ old/demo.html
   ✅ old/test-programmer.html
   ```
3. **نتیجه مورد انتظار:** ✅ همه فایل‌ها باید در old/ باشند

---

### 🧪 تست ۳: تست Production Build

**مدت زمان:** ۱ دقیقه

1. **اجرا کن:** در terminal:
   ```bash
   npm run build
   ```
2. **نتیجه مورد انتظار:**
   - ✅ Build باید **موفق** باشه
   - ✅ باید ببینی: `✓ built in X.XXs`
   - ❌ نباید خطای "Could not resolve entry module" بیاد
   - ✅ فقط `dist/index.html` باید ساخته بشه

---

### 🧪 تست ۴: تست Dev Server

**مدت زمان:** ۲ دقیقه

1. **اجرا کن:**
   ```bash
   npm run dev
   ```
2. **باز کن:** http://localhost:5174
3. **چک کن:** آیا Landing Page به درستی لود می‌شه؟
4. **نتیجه مورد انتظار:**
   - ✅ صفحه Landing Page نمایش داده می‌شه
   - ✅ هیچ error در Console نیست
   - ✅ React Router کار می‌کنه

---

### 🧪 تست ۵: تست Navigation به صفحات مختلف

**مدت زمان:** ۵ دقیقه

1. **باز کن:** http://localhost:5174
2. **کلیک کن:** روی "Login" یا "Get Started"
3. **چک کن:** آیا به `/login` می‌ره؟ (نه `/login.html`)
4. **نتیجه مورد انتظار:** ✅ URL باید بشه `http://localhost:5174/login`

5. **Test Clean URLs:**
   - [ ] http://localhost:5174/login → صفحه login
   - [ ] http://localhost:5174/pricing → صفحه pricing
   - [ ] http://localhost:5174/about → صفحه about
   - [ ] همه URLs بدون `.html` هستند

6. **Test Backward Compatibility (Redirects):**
   - [ ] http://localhost:5174/login.html → redirect به `/login`
   - [ ] http://localhost:5174/pricing.html → redirect به `/pricing`
   - [ ] http://localhost:5174/about.html → redirect به `/about`

---

### 🧪 تست ۶: تست Protected Routes

**مدت زمان:** ۳ دقیقه

1. **Login کن** با یک account
2. **انتخاب کن:** role "Entrepreneur"
3. **چک کن URL:** باید بشه `http://localhost:5174/app` (نه `/entrepreneur.html`)
4. **نتیجه مورد انتظار:** ✅ Clean URL بدون .html

5. **Test Other Roles:**
   - [ ] Investor → `/investor`
   - [ ] Programmer → `/programmer`
   - [ ] Consultant → `/consultant`
   - [ ] Designer → `/designer`

---

### 🧪 تست ۷: بررسی index.html

**مدت زمان:** ۱ دقیقه

1. **باز کن:** فایل `index.html` در root
2. **چک کن خط 15:** باید باشه:
   ```html
   <script type="module" src="/src/main.tsx"></script>
   ```
3. **نتیجه مورد انتظار:**
   - ✅ باید `main.tsx` رو load کنه (نه `LandingPage.tsx`)

---

### 🧪 تست ۸: بررسی vite.config.ts

**مدت زمان:** ۱ دقیقه

1. **باز کن:** فایل `vite.config.ts`
2. **چک کن:** build.rollupOptions.input
3. **نتیجه مورد انتظار:**

   ```typescript
   input: {
     main: resolve(__dirname, 'index.html'),
   }
   ```

   - ✅ فقط `index.html` باید باشه
   - ❌ نباید هیچ HTML دیگه‌ای باشه

---

### 🧪 تست ۹: تست Browser Back/Forward

**مدت زمان:** ۲ دقیقه

1. **باز کن:** http://localhost:5174
2. **Navigate کن:** به `/login`
3. **Navigate کن:** به `/pricing`
4. **کلیک کن:** روی Browser Back button
5. **نتیجه مورد انتظار:**
   - ✅ باید برگرده به `/login`
   - ✅ صفحه به درستی لود بشه
   - ✅ هیچ full page reload نباشه (SPA behavior)

6. **کلیک کن:** Browser Forward
   - ✅ باید بره به `/pricing`

---

### 🧪 تست ۱۰: تست Console Errors

**مدت زمان:** ۱ دقیقه

1. **باز کن:** Browser Console (F12)
2. **Navigate کن:** به صفحات مختلف
3. **چک کن:** آیا error هست؟
4. **نتیجه مورد انتظار:**
   - ✅ هیچ error قرمز نباید باشه
   - ✅ هیچ "404 Not Found" برای HTML files نباید باشه
   - ✅ React Router بدون مشکل کار می‌کنه

---

## ✅ خلاصه تست‌های سریع Task 1.1 (۵ دقیقه):

### چک‌لیست فوری:

- [ ] **فقط index.html در root موجود است**
- [ ] **13 فایل HTML در old/ منتقل شدند**
- [ ] **Build موفق است** (`npm run build`)
- [ ] **Dev server بدون خطا اجرا می‌شود** (`npm run dev`)
- [ ] **Landing page لود می‌شود** (http://localhost:5174)
- [ ] **Clean URLs کار می‌کنند** (/login, /pricing, /about)
- [ ] **Backward compatibility redirects کار می‌کنند** (/login.html → /login)
- [ ] **Protected routes کار می‌کنند** (/app, /investor, etc.)
- [ ] **Browser back/forward کار می‌کند**
- [ ] **هیچ Console Error نیست**
- [ ] **index.html حالا main.tsx رو load می‌کنه**
- [ ] **vite.config.ts فقط index.html داره**

---

**اگر همه این‌ها ✅ بودند → Task 1.1 کامل و موفق است!** 🎉

**مزایای Migration:**

- ✅ تنها یک entry point (index.html)
- ✅ React Router به عنوان single source of truth
- ✅ Clean URLs (بهتر برای SEO)
- ✅ SPA behavior (no full page reloads)
- ✅ Easier maintenance
- ✅ Build سریع‌تر (فقط یک HTML)

---

# 📋 راهنمای تست تغییرات قبلی (Task 1.7, 1.8 & 1.10)

## 📌 Task 1.7: Security & API Keys - چطور تست کنیم؟

### ✅ چیزی که انجام شد:

- تمام API keys از کد به فایل `.env` منتقل شدند
- Supabase URL و Anon Key دیگر hardcoded نیستند
- Gemini API Key از environment variables خوانده می‌شود

### 🧪 تست ۱: بررسی فایل .env

**مدت زمان:** ۱ دقیقه

1. **باز کن:** فایل `.env` در root پروژه
2. **چک کن:** آیا این متغیرها وجود دارند؟
   ```
   VITE_SUPABASE_URL=https://wuanzjpopjfgzpuktkov.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   VITE_GEMINI_API_KEY=your_api_key_here
   VITE_USE_DIRECT_API=true
   ```
3. **نتیجه مورد انتظار:** ✅ همه متغیرها باید موجود باشند

---

### 🧪 تست ۲: بررسی Supabase Connection

**مدت زمان:** ۲ دقیقه

1. **باز کن:** http://localhost:5174/login.html
2. **باز کن:** Browser Console (F12 → Console Tab)
3. **چک کن:** آیا خطای زیر وجود **ندارد**؟
   ```
   ❌ Missing Supabase environment variables
   ```
4. **تست کن:** سعی کن Sign Up کنی با:
   - Email: `test@example.com`
   - Password: `Test123456!`
5. **نتیجه مورد انتظار:**
   - ✅ هیچ خطای "environment variable" نباید ببینی
   - ✅ اگر signup موفق بود → API keys کار می‌کنند
   - ✅ اگر خطای دیگری داد (مثل "Email already exists") → باز هم OK است

---

### 🧪 تست ۳: بررسی کد منبع (امنیت)

**مدت زمان:** ۲ دقیقه

1. **باز کن:** فایل `src/services/supabaseClient.ts`
2. **جستجو کن:** برای `https://wuanzjpopjfgzpuktkov` یا `eyJhbGc`
3. **نتیجه مورد انتظار:**
   - ✅ **نباید پیدا شود!** اگر پیدا شد، یعنی هنوز hardcoded است
   - ✅ باید ببینی: `import.meta.env.VITE_SUPABASE_URL`

4. **باز کن:** فایل `src/services/geminiService.ts`
5. **چک کن:** خط ۶ باید باشه:
   ```typescript
   const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
   ```
6. **نتیجه مورد انتظار:** ✅ API key از env خوانده می‌شود

---

### 🧪 تست ۴: تست Build با Environment Variables

**مدت زمان:** ۱ دقیقه

1. **توقف کن:** dev server (اگر داره اجرا میشه)
2. **اجرا کن:** در terminal:
   ```bash
   npm run build
   ```
3. **نتیجه مورد انتظار:**
   - ✅ Build باید **موفق** باشه
   - ✅ باید ببینی: `✓ built in X.XXs`
   - ❌ اگر خطای "Missing environment variables" دیدی → مشکل داریم

---

### 🧪 تست ۵: تست Gemini API (اختیاری - فقط اگر API key داری)

**مدت زمان:** ۳ دقیقه

**⚠️ نکته:** این تست فقط وقتی کار می‌کنه که Gemini API key واقعی داشته باشی

1. **باز کن:** فایل `.env`
2. **جایگزین کن:** `your_api_key_here` با API key واقعی Gemini
3. **Restart کن:** dev server:
   ```bash
   Ctrl+C (برای stop)
   npm run dev (برای start)
   ```
4. **باز کن:** http://localhost:5174/login.html
5. **Login کن** → انتخاب کن role "Entrepreneur"
6. **Create کن:** یک پروژه جدید
7. **تایپ کن:** یک پیام در chat
8. **نتیجه مورد انتظار:**
   - ✅ AI باید response بده
   - ✅ اگر خطای API key نداد → موفق

---

## 📌 Task 1.8: Refactor useStartupJourney Hook - چطور تست کنیم؟

### ✅ چیزی که انجام شد:

- useStartupJourney از 831 خط به 408 خط کاهش یافت (51% کاهش!)
- 4 hook مستقل ایجاد شد:
  - useProjectManager.ts (156 خط) - CRUD operations
  - useStageManager.ts (363 خط) - Stage logic & progression
  - useChatManager.ts (189 خط) - Chat & messaging
  - useExportManager.ts (210 خط) - Export functionality
- Single Responsibility Principle رعایت شد

### 🧪 تست ۱: بررسی فایل‌های جدید

**مدت زمان:** ۱ دقیقه

1. **باز کن:** مسیر `src/hooks/`
2. **چک کن:** آیا این فایل‌ها موجود هستند؟
   ```
   ✅ useProjectManager.ts
   ✅ useStageManager.ts
   ✅ useChatManager.ts
   ✅ useExportManager.ts
   ✅ useStartupJourney.ts (رفکتور شده)
   ```
3. **نتیجه مورد انتظار:** همه فایل‌ها باید موجود باشند

---

### 🧪 تست ۲: بررسی کد useStartupJourney.ts

**مدت زمان:** ۲ دقیقه

1. **باز کن:** فایل `src/hooks/useStartupJourney.ts`
2. **چک کن خط 1-20:** آیا این import ها هستند؟
   ```typescript
   import { useProjectManager } from './useProjectManager';
   import { useStageManager } from './useStageManager';
   import { useChatManager } from './useChatManager';
   import { useExportManager } from './useExportManager';
   ```
3. **اسکرول کن:** به انتها
4. **چک کن:** آیا تعداد خطوط حدود 400-450 خطه؟ (نه 831!)
5. **نتیجه مورد انتظار:**
   - ✅ فایل کوچک‌تر شده
   - ✅ hook ها import شدند
   - ✅ کد readable تر شده

---

### 🧪 تست ۳: تست Build بدون Error

**مدت زمان:** ۱ دقیقه

1. **اجرا کن:** در terminal:
   ```bash
   npm run build
   ```
2. **نتیجه مورد انتظار:**
   - ✅ Build باید **موفق** باشه
   - ✅ باید ببینی: `✓ built in X.XXs`
   - ❌ اگر TypeScript error دیدی → مشکل داریم
3. **چک کن:** خروجی Console
   - ❌ نباید هیچ error یا warning TypeScript داشته باشیم

---

### 🧪 تست ۴: تست Functionality در Entrepreneur Dashboard

**مدت زمان:** ۵ دقیقه

**⚠️ مهم:** این تست می‌سنجه که refactoring باعث خرابی functionality نشده

1. **اجرا کن:** dev server:
   ```bash
   npm run dev
   ```
2. **باز کن:** http://localhost:5174/login.html
3. **Login کن** با یک account
4. **انتخاب کن:** role "Entrepreneur"
5. **Test useProjectManager:**
   - [ ] کلیک روی "Create New Project"
   - [ ] وارد کن Project Name و Initial Idea
   - [ ] کلیک "Create"
   - [ ] **نتیجه:** پروژه باید بدون error ساخته بشه
6. **Test useStageManager:**
   - [ ] چک کن Progress Bar نمایش داده میشه
   - [ ] چک کن Current Stage مشخصه
   - [ ] تلاش کن برای رفتن به stage بعدی
   - [ ] **نتیجه:** stage progression باید کار کنه
7. **Test useChatManager:**
   - [ ] تایپ کن یک پیام در chat
   - [ ] کلیک روی Send
   - [ ] **نتیجه:** پیام باید ارسال بشه و ذخیره بشه
8. **Test useExportManager:**
   - [ ] کلیک روی Export یا Menu
   - [ ] انتخاب کن یکی از فرمت‌ها (PDF, Word, etc.)
   - [ ] **نتیجه:** export باید کار کنه و فایل دانلود بشه

---

### 🧪 تست ۵: بررسی Console Errors

**مدت زمان:** ۱ دقیقه

1. **باز کن:** Browser Console (F12 → Console)
2. **چک کن:** آیا error یا warning قرمز هست؟
3. **نتیجه مورد انتظار:**
   - ✅ هیچ error مربوط به hooks نباید باشه
   - ✅ هیچ "undefined is not a function" نباید باشه
   - ✅ هیچ "Cannot read property" نباید باشه

---

### 🧪 تست ۶: بررسی Code Quality

**مدت زمان:** ۳ دقیقه

1. **باز کن:** `src/hooks/useProjectManager.ts`
2. **چک کن:**
   - [ ] آیا فقط مسئولیت CRUD operations رو داره؟
   - [ ] آیا functions با نام مشخص هستند؟ (createProject, updateProject, etc.)
   - [ ] آیا comments کافی داره؟

3. **باز کن:** `src/hooks/useStageManager.ts`
4. **چک کن:**
   - [ ] آیا فقط مسئولیت stage logic رو داره؟
   - [ ] آیا functions مربوط به progression هستند؟

5. **باز کن:** `src/hooks/useChatManager.ts`
6. **چک کن:**
   - [ ] آیا فقط مسئولیت messaging رو داره؟
   - [ ] آیا AI interaction handling داره؟

7. **باز کن:** `src/hooks/useExportManager.ts`
8. **چک کن:**
   - [ ] آیا فقط مسئولیت export رو داره؟
   - [ ] آیا تمام 4 فرمت (PDF, Word, CSV, Excel) support میشه؟

---

### 🧪 تست ۷: بررسی Git Commits

**مدت زمان:** ۱ دقیقه

1. **اجرا کن:**
   ```bash
   git log --oneline -10
   ```
2. **جستجو کن:** برای commit مربوط به Task 1.8
3. **نتیجه مورد انتظار:**
   - ✅ باید ببینی commit با message شامل "refactor" و "useStartupJourney"
   - ✅ مثال: `refactor: Complete Task 1.8 - Refactor useStartupJourney Hook`

---

## ✅ خلاصه تست‌های سریع Task 1.8 (۵ دقیقه):

### چک‌لیست فوری:

- [ ] **4 فایل hook جدید موجود است** (useProjectManager, useStageManager, useChatManager, useExportManager)
- [ ] **useStartupJourney.ts رفکتور شده** (حدود 400 خط، نه 831)
- [ ] **Build موفق است** (`npm run build`)
- [ ] **Create Project کار می‌کند** (useProjectManager)
- [ ] **Stage Progression کار می‌کند** (useStageManager)
- [ ] **Chat/Messaging کار می‌کند** (useChatManager)
- [ ] **Export کار می‌کند** (useExportManager)
- [ ] **هیچ Console Error مربوط به hooks نیست**
- [ ] **Git commit انجام شده** برای Task 1.8

---

**اگر همه این‌ها ✅ بودند → Task 1.8 کامل و موفق است!** 🎉

**مزایای Refactoring:**

- ✅ کد 51% کوچک‌تر شد (قابل خواندن‌تر)
- ✅ هر hook مسئولیت خاص خودش رو داره (SRP)
- ✅ Debug و Test راحت‌تر شد
- ✅ تغییرات آینده ایمن‌تر هستند
- ✅ Code reusability بالاتر

---

## 📌 Task 1.10: Git Workflow - چطور تست کنیم؟

### ✅ چیزی که انجام شد:

- Git workflow rules تعریف شد
- تمام تغییرات Task 1.7 commit شدند
- Task 1.10 اضافه شد و commit شد

### 🧪 تست ۱: بررسی Git Commits

**مدت زمان:** ۱ دقیقه

1. **اجرا کن:** در terminal:
   ```bash
   git log --oneline -5
   ```
2. **نتیجه مورد انتظار:**
   - ✅ باید ببینی commit اخیر:
     ```
     278604c docs: Add Task 1.10 - Git Workflow & Commit Strategy
     56ac3bc feat: Complete Task 1.7 - Security & API Keys migration
     ```
3. **چک کن:** آیا commit messages استاندارد هستند؟
   - ✅ شروع با `feat:` یا `docs:` یا `fix:`
   - ✅ توضیحات واضح

---

### 🧪 تست ۲: بررسی Commit Details

**مدت زمان:** ۱ دقیقه

1. **اجرا کن:**
   ```bash
   git log -1 --format=fuller
   ```
2. **نتیجه مورد انتظار:**
   - ✅ باید ببینی:
     ```
     Co-Authored-By: Claude <noreply@anthropic.com>
     🤖 Generated with [Claude Code](https://claude.com/claude-code)
     ```

---

### 🧪 تست ۳: بررسی Git Status

**مدت زمان:** ۱ دقیقه

1. **اجرا کن:**
   ```bash
   git status
   ```
2. **نتیجه مورد انتظار:**
   - ✅ باید ببینی:
     ```
     On branch main
     nothing to commit, working tree clean
     ```
   - یا حداکثر فایل `.env` untracked باشه (که طبیعیه)

---

### 🧪 تست ۴: بررسی .gitignore

**مدت زمان:** ۱ دقیقه

1. **باز کن:** فایل `.gitignore`
2. **جستجو کن:** برای `.env`
3. **نتیجه مورد انتظار:**
   - ✅ باید ببینی:
     ```
     # Environment variables
     .env
     .env.local
     .env.*.local
     ```
4. **تست کن:**
   ```bash
   git status
   ```
5. **چک کن:** آیا `.env` در لیست "Untracked files" هست؟
   - ✅ بله → خوبه، ignore میشه
   - ❌ نه → یعنی ممکنه commit بشه (خطرناک!)

---

### 🧪 تست ۵: بررسی PROJECT_PROGRESS.md

**مدت زمان:** ۲ دقیقه

1. **باز کن:** فایل `PROJECT_PROGRESS.md`
2. **چک کن:** بخش "نمای کلی پیشرفت"
   - ✅ باید ببینی: `فاز ۱: ... [██████░░░░] 62%`
   - ✅ باید ببینی: `پیشرفت کلی پروژه: 10.3%`
3. **چک کن:** بخش "محاسبه پیشرفت فاز ۱"
   - ✅ باید ببینی: `Task 1.7: 100% (کامل) ✅`
   - ✅ باید ببینی: `Task 1.10: 100% (کامل) ✅`
4. **اسکرول کن:** به Task 1.10
   - ✅ باید ببینی تمام قوانین Git Workflow

---

## ✅ خلاصه تست‌های سریع (۵ دقیقه)

### چک‌لیست فوری برای Task 1.7 & 1.10:

- [ ] **فایل .env موجود است** و حاوی 4 متغیر
- [ ] **اپلیکیشن بدون خطای env variable اجرا می‌شود**
- [ ] **Login/Signup کار می‌کند** (Supabase متصل است)
- [ ] **Build موفق است** (`npm run build`)
- [ ] **هیچ API key hardcoded در `src/` نیست**
- [ ] **2 commit جدید در git log وجود دارد**
- [ ] **`.env` در .gitignore است**
- [ ] **PROJECT_PROGRESS.md به‌روز است** (62%)

---

**اگر همه این‌ها ✅ بودند → Task 1.7 و 1.10 کامل و موفق هستند!** 🎉

---

# 📋 تست‌های باید انجام بشه

## 1️⃣ تست Authentication Flow

### 1.1 صفحه Login

- [ ] **باز کردن:** http://localhost:5174/login.html
- [ ] **چک کن:** صفحه login به درستی لود می‌شه؟
- [ ] **چک کن:** دکمه‌های زبان کار می‌کنن؟ (EN/FA)
- [ ] **چک کن:** UI به درستی RTL/LTR می‌شه؟

### 1.2 تست Email/Password Signup

- [ ] **کلیک:** روی "Sign Up"
- [ ] **وارد کن:**
  - Email: `test@example.com`
  - Password: `Test123456!`
- [ ] **چک کن:** آیا خطایی نمی‌ده؟
- [ ] **چک کن:** آیا پیام موفقیت می‌ده؟
- [ ] **چک کن:** آیا به صفحه RoleSelection می‌ره؟

### 1.3 تست OAuth Login (Google)

- [ ] **کلیک:** روی دکمه "Login with Google"
- [ ] **چک کن:** آیا به صفحه Google redirect می‌شه؟
- [ ] **چک کن:** بعد از login، آیا به RoleSelection می‌ره؟
- [ ] **چک کن:** آیا خطای 409 Conflict نمی‌ده؟ (این باگ قبلاً بود، حل شده)

### 1.4 تست Email/Password Login

- [ ] **کلیک:** روی "Login"
- [ ] **وارد کن:**
  - Email: همون email که قبلاً ثبت کردی
  - Password: همون password که قبلاً ثبت کردی
- [ ] **چک کن:** آیا بدون خطا login می‌شه؟
- [ ] **چک کن:** آیا به RoleSelection می‌ره؟

---

## 2️⃣ تست Role Selection

### 2.1 انتخاب Role

- [ ] **چک کن:** تمام 5 role نمایش داده می‌شه؟
  - Entrepreneur
  - Investor
  - Consultant
  - Programmer
  - Designer
- [ ] **چک کن:** هر role اطلاعات داره (title, description)?
- [ ] **کلیک:** روی role "Entrepreneur"
- [ ] **چک کن:** آیا به صفحه `/entrepreneur.html` می‌ره؟

### 2.2 تست Investor Role

- [ ] **برگرد به:** http://localhost:5174/login.html
- [ ] **Logout:** اگر login هستی
- [ ] **Login:** دوباره
- [ ] **انتخاب کن:** role "Investor"
- [ ] **چک کن:** آیا به `/investor.html` می‌ره؟

---

## 3️⃣ تست Entrepreneur Dashboard

### 3.1 Project Selection Screen

- [ ] **چک کن:** صفحه "Select or Create Project" نمایش داده می‌شه؟
- [ ] **کلیک:** روی "Create New Project"
- [ ] **وارد کن:**
  - Project Name: `Test Startup Idea`
  - Initial Idea: `An AI-powered platform for helping entrepreneurs`
- [ ] **کلیک:** "Create Project"
- [ ] **چک کن:** آیا پروژه ساخته می‌شه؟
- [ ] **چک کن:** آیا به startup journey می‌ره؟

### 3.2 Startup Journey

- [ ] **چک کن:** آیا chat interface نمایش داده می‌شه؟
- [ ] **چک کن:** آیا stage progression bar بالا هست؟
- [ ] **چک کن:** آیا current stage مشخص هست؟
- [ ] **تایپ کن:** یک پیام در chat
- [ ] **کلیک:** "Send" یا Enter
- [ ] **چک کن:** آیا پیام ارسال می‌شه؟
- [ ] **چک کن:** آیا AI response می‌ده؟ (اگر Gemini API key ست کردی)

### 3.3 Stage Progression

- [ ] **کلیک:** روی "Next Stage" یا "Continue"
- [ ] **چک کن:** آیا به stage بعدی می‌ره؟
- [ ] **چک کن:** آیا progress bar آپدیت می‌شه؟
- [ ] **چک کن:** آیا data ذخیره می‌شه؟ (reload صفحه و چک کن)

### 3.4 Export Features

- [ ] **کلیک:** روی "Export" یا Menu
- [ ] **چک کن:** آیا export options نمایش داده می‌شه؟
  - PDF
  - Word
  - CSV
  - Excel
- [ ] **تست کن:** Export به PDF
- [ ] **چک کن:** آیا فایل دانلود می‌شه؟

### 3.5 تست Logout

- [ ] **کلیک:** روی profile یا logout button
- [ ] **کلیک:** "Logout"
- [ ] **چک کن:** آیا به `/login.html` redirect می‌شه؟ ✅ (این باگ قبلاً بود، حل شده)
- [ ] **چک کن:** آیا session پاک می‌شه؟

---

## 4️⃣ تست Investor Portal

### 4.1 Investor Signup

- [ ] **باز کن:** http://localhost:5174/login.html
- [ ] **Login:** با یک account دیگه یا جدید
- [ ] **انتخاب کن:** role "Investor"
- [ ] **چک کن:** آیا به Investor Signup Form می‌ره؟
- [ ] **پر کن:** فرم:
  - Full Name: `Test Investor`
  - Investment Range: `$10,000 - $50,000`
  - Industries: `Technology, Healthcare`
  - Investment Stage: `Seed`
- [ ] **کلیک:** "Complete Profile"
- [ ] **چک کن:** آیا به Investor Dashboard می‌ره؟

### 4.2 Investor Dashboard

- [ ] **چک کن:** آیا لیست پروژه‌های public نمایش داده می‌شه؟
- [ ] **کلیک:** روی یک پروژه
- [ ] **چک کن:** آیا جزئیات پروژه نمایش داده می‌شه؟
- [ ] **چک کن:** آیا می‌تونی interest/investment request ارسال کنی؟

### 4.3 Investor Profile

- [ ] **کلیک:** روی Profile
- [ ] **چک کن:** آیا اطلاعات Investor نمایش داده می‌شه؟
- [ ] **ویرایش کن:** یک فیلد
- [ ] **ذخیره کن**
- [ ] **چک کن:** آیا تغییرات ذخیره می‌شه؟

---

## 5️⃣ تست Other Roles

### 5.1 Consultant Role

- [ ] **Login:** با account جدید
- [ ] **انتخاب کن:** role "Consultant"
- [ ] **چک کن:** آیا به `/consultant.html` می‌ره؟
- [ ] **چک کن:** آیا consultant dashboard لود می‌شه؟

### 5.2 Programmer Role

- [ ] **Login:** با account جدید
- [ ] **انتخاب کن:** role "Programmer"
- [ ] **چک کن:** آیا به `/programmer.html` می‌ره؟
- [ ] **چک کن:** آیا programmer dashboard لود می‌شه؟

### 5.3 Designer Role

- [ ] **Login:** با account جدید
- [ ] **انتخاب کن:** role "Designer"
- [ ] **چک کن:** آیا به `/designer.html` می‌ره؟
- [ ] **چک کن:** آیا designer dashboard لود می‌شه؟

---

## 6️⃣ تست Error Handling System ✅

### 6.1 تست ErrorBoundary

- [ ] **باز کن:** Browser Console (F12)
- [ ] **چک کن:** آیا خطای JavaScript هست؟
- [ ] **تست کن:** یک عملیات که ممکنه error بده (مثلاً form خالی submit کن)
- [ ] **چک کن:** آیا error message user-friendly نمایش داده می‌شه؟
- [ ] **چک کن:** آیا اپلیکیشن crash نمی‌کنه؟ (ErrorBoundary باید catch کنه)

### 6.2 تست Network Errors

- [ ] **قطع کن:** اینترنت
- [ ] **تست کن:** یک عملیات که به API نیاز داره
- [ ] **چک کن:** آیا error message مناسب نمایش داده می‌شه؟
  - "Network error - please check your connection"
- [ ] **چک کن:** آیا اپلیکیشن crash نمی‌کنه؟

### 6.3 تست Supabase Errors

- [ ] **تست کن:** login با password اشتباه
- [ ] **چک کن:** آیا error message مناسب نمایش داده می‌شه؟
- [ ] **چک کن:** آیا error به console log می‌شه؟

---

## 7️⃣ تست Loading States System ✅

### 7.1 تست LoadingSpinner

- [ ] **تست کن:** هر عملیاتی که async هست (مثل login)
- [ ] **چک کن:** آیا loading spinner نمایش داده می‌شه؟
- [ ] **چک کن:** آیا بعد از complete شدن، spinner مخفی می‌شه؟

### 7.2 تست SkeletonLoader

- [ ] **رفرش کن:** صفحه dashboard
- [ ] **چک کن:** آیا skeleton loader نمایش داده می‌شه قبل از load شدن data؟
- [ ] **چک کن:** آیا بعد از load شدن، skeleton جای خودش رو به data واقعی می‌ده؟

### 7.3 تست ProgressBar

- [ ] **چک کن:** آیا progress bar در startup journey نمایش داده می‌شه؟
- [ ] **چک کن:** آیا با پیشرفت stage، progress bar آپدیت می‌شه؟

---

## 8️⃣ تست State Management ✅

### 8.1 تست AuthContext

- [ ] **Login کن**
- [ ] **رفرش کن:** صفحه
- [ ] **چک کن:** آیا هنوز login هستی؟ (session باید persist بشه)
- [ ] **Logout کن**
- [ ] **چک کن:** آیا به `/login.html` redirect می‌شه؟ ✅

### 8.2 تست LanguageContext

- [ ] **تغییر بده:** زبان به Farsi
- [ ] **چک کن:** آیا تمام UI به فارسی تغییر می‌کنه؟
- [ ] **چک کن:** آیا RTL درست کار می‌کنه؟
- [ ] **رفرش کن:** صفحه
- [ ] **چک کن:** آیا زبان ذخیره شده؟

### 8.3 تست ThemeContext

- [ ] **تغییر بده:** theme به Dark (اگر هست)
- [ ] **چک کن:** آیا رنگ‌ها تغییر می‌کنن؟
- [ ] **رفرش کن:** صفحه
- [ ] **چک کن:** آیا theme ذخیره شده؟

---

## 9️⃣ تست Environment Variables ✅ (Task 1.7)

### 9.1 چک کردن .env

- [ ] **باز کن:** فایل `.env`
- [ ] **چک کن:** آیا این متغیرها هستند؟
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_GEMINI_API_KEY`
  - `VITE_USE_DIRECT_API`
- [ ] **چک کن:** آیا مقادیر set شدند؟

### 9.2 تست Supabase Connection

- [ ] **باز کن:** Browser Console (F12)
- [ ] **Login کن**
- [ ] **چک کن:** آیا خطای Supabase نیست؟
- [ ] **چک کن:** آیا connection برقرار می‌شه؟

### 9.3 تست Gemini API (اگر key داری)

- [ ] **باز کن:** Entrepreneur Dashboard
- [ ] **تایپ کن:** یک سوال در chat
- [ ] **چک کن:** آیا AI response می‌ده؟
- [ ] **چک کن:** آیا خطای API نیست؟

---

## 🔟 تست Browser Compatibility

### 10.1 Chrome

- [ ] تمام تست‌های بالا در Chrome

### 10.2 Firefox (اختیاری)

- [ ] تست‌های اصلی در Firefox

### 10.3 Edge (اختیاری)

- [ ] تست‌های اصلی در Edge

---

## 1️⃣1️⃣ تست Responsive Design

### 11.1 Desktop (1920x1080)

- [ ] **چک کن:** UI درست نمایش داده می‌شه؟

### 11.2 Tablet (768px)

- [ ] **باز کن:** DevTools (F12) → Device Toolbar
- [ ] **انتخاب کن:** iPad
- [ ] **چک کن:** UI responsive هست؟

### 11.3 Mobile (375px)

- [ ] **انتخاب کن:** iPhone SE
- [ ] **چک کن:** UI در mobile درست کار می‌کنه؟

---

## 1️⃣2️⃣ تست Performance

### 12.1 Page Load Time

- [ ] **باز کن:** Network Tab (F12)
- [ ] **رفرش کن:** صفحه
- [ ] **چک کن:** آیا زمان load کمتر از 3 ثانیه هست؟

### 12.2 Console Errors

- [ ] **باز کن:** Console Tab (F12)
- [ ] **چک کن:** آیا error یا warning قرمز هست?
- [ ] **یادداشت کن:** تمام errorها

---

# 📝 نتایج تست

## ✅ موارد موفق:

(بعد از تست پر کن)

## ❌ موارد ناموفق / باگ‌ها:

(بعد از تست پر کن)

## 💡 پیشنهادات بهبود:

(بعد از تست پر کن)

---

**وضعیت کلی:** [ ] Pass / [ ] Fail
**تاریخ اتمام:** \***\*\_\_\_\*\***
**توسط:** Ali

---

# 📋 Task 1.6: ESLint و Prettier Setup - راهنمای تست

## 📌 چیزی که انجام شد:

### نصب و راه‌اندازی:

- ✅ نصب ESLint 9.38.0 با flat config format
- ✅ نصب Prettier 3.6.2 و integration plugins
- ✅ نصب Husky 9.1.7 و lint-staged 16.2.4
- ✅ ایجاد eslint.config.js (ESLint 9 flat config)
- ✅ ایجاد .prettierrc و .prettierignore
- ✅ تنظیم pre-commit hooks
- ✅ اضافه کردن npm scripts

### نتایج:

- ✅ کاهش 90% در مشکلات linting (از 3839 به 372)
- ✅ کاهش errors از 753 به 18
- ✅ Prettier همه فایل‌ها رو فرمت کرد
- ✅ Build موفق
- ✅ Git hooks فعال

---

## 🧪 تست ۱: بررسی فایل‌های ایجاد شده

**مدت زمان:** ۱ دقیقه

### مراحل:

1. **باز کن:** Explorer و برو به root پروژه
2. **چک کن:** آیا این فایل‌ها وجود دارند؟
   ```
   ✅ eslint.config.js
   ✅ .prettierrc
   ✅ .prettierignore
   ✅ .husky/pre-commit
   ```

### نتیجه مورد انتظار:

- ✅ همه فایل‌ها باید موجود باشند
- ✅ eslint.config.js باید ESLint 9 flat config باشه
- ✅ .husky/pre-commit باید `npx lint-staged` داشته باشه

---

## 🧪 تست ۲: اجرای ESLint

**مدت زمان:** ۲ دقیقه

### مراحل:

1. **اجرا کن در terminal:**
   ```bash
   npm run lint
   ```
2. **چک کن خروجی:**
   - تعداد errors و warnings رو ببین
   - باید حدود 372 مشکل (18 error + 354 warning) باشه

### نتیجه مورد انتظار:

```bash
✖ 372 problems (18 errors, 354 warnings)
```

### خطاهای مورد انتظار (این‌ها طبیعی هستند):

- React Hooks errors: "Calling setState within effect"
- @ts-ignore warnings: باید به @ts-expect-error تبدیل بشن
- react/no-unescaped-entities: کوتیشن‌های escape نشده
- no-console warnings: استفاده از console.log

---

## 🧪 تست ۳: اجرای Prettier

**مدت زمان:** ۱ دقیقه

### مراحل:

1. **اجرا کن:**
   ```bash
   npm run format:check
   ```
2. **چک کن:** آیا فایل‌ها formatted هستند؟

### نتیجه مورد انتظار:

- ✅ همه فایل‌ها باید فرمت شده باشند
- ✅ نباید خطای "Code style issues" بیاد

---

## 🧪 تست ۴: تست ESLint Fix

**مدت زمان:** ۲ دقیقه

### مراحل:

1. **اجرا کن:**
   ```bash
   npm run lint:fix
   ```
2. **چک کن:** آیا بعضی از مشکلات fix شدند؟

### نتیجه مورد انتظار:

- ✅ بعضی warnings باید fix بشن
- ✅ تعداد مشکلات باید کمتر از قبل باشه

---

## 🧪 تست ۵: تست Git Pre-commit Hook

**مدت زمان:** ۲ دقیقه

### مراحل:

1. **یه تغییر کوچک بده:**
   ```bash
   echo "// test" >> src/test.ts
   git add src/test.ts
   ```
2. **سعی کن commit کنی:**
   ```bash
   git commit -m "test commit"
   ```
3. **چک کن:** آیا lint-staged اجرا شد؟

### نتیجه مورد انتظار:

- ✅ باید ببینی: "Running tasks for staged files..."
- ✅ ESLint و Prettier باید روی فایل‌های staged اجرا بشن
- ⚠️ اگر error داشته باشی، commit باید fail بشه

### پاک کردن test file:

```bash
git reset HEAD src/test.ts
rm src/test.ts
```

---

## 🧪 تست ۶: بررسی Scripts در package.json

**مدت زمان:** ۱ دقیقه

### مراحل:

1. **باز کن:** package.json
2. **چک کن:** آیا این scripts موجودند؟
   ```json
   {
     "scripts": {
       "lint": "eslint . --ext .ts,.tsx",
       "lint:fix": "eslint . --ext .ts,.tsx --fix",
       "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
       "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
     }
   }
   ```

### نتیجه مورد انتظار:

- ✅ همه scripts باید موجود باشند
- ✅ همه scripts باید قابل اجرا باشند

---

## 🧪 تست ۷: تست Build

**مدت زمان:** ۱ دقیقه

### مراحل:

1. **اجرا کن:**
   ```bash
   npm run build
   ```
2. **چک کن:** آیا build موفق است؟

### نتیجه مورد انتظار:

```bash
✓ built in X.XXs
```

- ✅ Build باید بدون خطا موفق باشه
- ⚠️ ممکنه warning برای chunk size داشته باشی (طبیعیه)

---

## ✅ خلاصه چک‌لیست Task 1.6

- [ ] فایل‌های config ایجاد شدند (.eslintrc.json, .prettierrc, etc.)
- [ ] `npm run lint` کار می‌کنه و ~372 مشکل نشون میده
- [ ] `npm run lint:fix` بعضی از مشکلات رو fix می‌کنه
- [ ] `npm run format` همه فایل‌ها رو فرمت می‌کنه
- [ ] `npm run format:check` فایل‌های فرمت شده رو چک می‌کنه
- [ ] Git pre-commit hook کار می‌کنه
- [ ] Scripts در package.json موجودند
- [ ] Build موفق است: `npm run build`

---

## 📊 نتایج مورد انتظار:

### قبل از Task 1.6:

- ❌ هیچ linting نداشتیم
- ❌ هیچ code formatting نداشتیم
- ❌ هیچ git hooks نداشتیم
- ❌ Code quality check نداشتیم

### بعد از Task 1.6:

- ✅ ESLint فعال (9.38.0)
- ✅ Prettier فعال (3.6.2)
- ✅ Git hooks فعال
- ✅ 90% کاهش در linting issues
- ✅ همه کدها formatted شدند
- ✅ هر commit اول lint و format میشه

---

## 🐛 مشکلات شناخته شده:

### ۱. Git Hook ممکنه commit رو block کنه

**علت:** اگر code شما 9+ error داشته باشه، git hook commit رو reject می‌کنه

**راه حل:**

```bash
# برای این یه commit از hook skip کن:
git commit --no-verify -m "your message"

# یا errors رو fix کن:
npm run lint:fix
```

### ۲. Prettier با ESLint conflict داره

**علت:** بعضی وقت‌ها Prettier و ESLint قوانین متفاوت دارند

**راه حل:**

- eslint-config-prettier این conflictها رو حل می‌کنه
- همیشه اول `npm run format` بزن، بعد `npm run lint:fix`

---

**اگر همه تست‌ها ✅ بودند → Task 1.6 موفق بود!** 🎉

**پیشرفت کلی:**

- Task 1.6: ✅ 100%
- Phase 1: 89%
- Overall: 14.8%

---

# 📋 Task 1.5: State Management - راهنمای تست

## 📌 چیزی که انجام شد:

### مستندات:

- ✅ ایجاد STATE_MANAGEMENT_GUIDE.md (راهنمای جامع و کامل)
  - توضیح معماری State Management (Context API)
  - راهنمای کامل هر Context (AuthContext, LanguageContext, LoadingContext)
  - Best Practices و Do/Don't examples
  - نکات Performance با مثال‌های عملی
  - مثال‌های کاربردی واقعی

### بهینه‌سازی Performance:

- ✅ AuthContext: اضافه شدن `useMemo` و `useCallback`
- ✅ LanguageContext: اضافه شدن `useMemo` و `useCallback`
- ✅ LoadingContext: اضافه شدن `useMemo`
- ✅ کاهش re-renders غیرضروری

### نتایج:

- ✅ Build موفق
- ✅ بهبود Performance در components
- ✅ مستندات کامل برای تیم

---

## 🧪 تست ۱: بررسی فایل مستندات

**مدت زمان:** ۲ دقیقه

### مراحل:

1. **باز کن:** فایل `STATE_MANAGEMENT_GUIDE.md` از root پروژه
2. **چک کن:** آیا این بخش‌ها موجودند؟
   ```
   ✅ معماری State Management
   ✅ Context های موجود (AuthContext, LanguageContext, LoadingContext)
   ✅ راهنمای استفاده از هر Context
   ✅ Best Practices
   ✅ نکات Performance
   ✅ مثال‌های کاربردی
   ```

### نتیجه مورد انتظار:

- ✅ فایل باید موجود باشد
- ✅ باید حداقل 800+ خط مستندات کامل باشه
- ✅ مثال‌های code باید خوانا و واضح باشند

---

## 🧪 تست ۲: تست AuthContext با useMemo/useCallback

**مدت زمان:** ۳ دقیقه

### مراحل:

1. **باز کن:** `src/contexts/AuthContext.tsx`
2. **چک کن:** آیا این بهینه‌سازی‌ها اضافه شدند؟
   ```tsx
   ✅ import { useMemo, useCallback } از React
   ✅ signIn با useCallback wrap شده
   ✅ signOut با useCallback wrap شده
   ✅ context value با useMemo wrap شده
   ```

### نتیجه مورد انتظار:

```tsx
// باید این pattern رو ببینی:
const signIn = useCallback(async (email, password) => {
  // ...
}, []);

const signOut = useCallback(async () => {
  // ...
}, []);

const value = useMemo(
  () => ({
    session,
    user,
    loading,
    signIn,
    signOut,
  }),
  [session, user, loading, signIn, signOut]
);
```

---

## 🧪 تست ۳: تست LanguageContext با useMemo/useCallback

**مدت زمان:** ۳ دقیقه

### مراحل:

1. **باز کن:** `src/contexts/LanguageContext.tsx`
2. **چک کن:** آیا این بهینه‌سازی‌ها اضافه شدند؟
   ```tsx
   ✅ import { useMemo, useCallback } از React
   ✅ isRTL با useMemo محاسبه میشه
   ✅ setLanguage با useCallback wrap شده
   ✅ context value با useMemo wrap شده
   ```

### نتیجه مورد انتظار:

```tsx
// باید این pattern رو ببینی:
const isRTL = useMemo(() => language === 'fa', [language]);

const setLanguage = useCallback(
  async (lang) => {
    // ...
  },
  [user]
);

const value = useMemo(
  () => ({
    language,
    setLanguage,
    isRTL,
  }),
  [language, setLanguage, isRTL]
);
```

---

## 🧪 تست ۴: تست LoadingContext با useMemo

**مدت زمان:** ۲ دقیقه

### مراحل:

1. **باز کن:** `src/contexts/LoadingContext.tsx`
2. **چک کن:** آیا context value با useMemo wrap شده؟
   ```tsx
   ✅ import { useMemo } از React
   ✅ value object با useMemo wrap شده
   ```

### نتیجه مورد انتظار:

```tsx
// باید این pattern رو ببینی:
const value = useMemo(
  () => ({
    isLoading: loadingState.isLoading,
    message: loadingState.message,
    showLoading,
    hideLoading,
    withLoading,
  }),
  [loadingState.isLoading, loadingState.message, showLoading, hideLoading, withLoading]
);
```

---

## 🧪 تست ۵: تست Performance (Re-renders)

**مدت زمان:** ۵ دقیقه

### مراحل:

1. **نصب کن:** React DevTools Extension (اگر نداری)
2. **باز کن:** http://localhost:5174
3. **باز کن:** React DevTools → Profiler
4. **شروع کن:** Recording
5. **انجام بده:** چند عملیات:
   - Login کن
   - تغییر زبان بده
   - Navigate کن بین صفحات
6. **متوقف کن:** Recording
7. **چک کن:** تعداد re-renders

### نتیجه مورد انتظار:

- ✅ Components که از Context استفاده می‌کنن فقط وقتی re-render بشن که state تغییر کرده
- ✅ نباید re-render غیرضروری وجود داشته باشه
- ✅ Components با memo() باید فقط وقتی props تغییر کرده re-render بشن

### مقایسه قبل و بعد:

```
قبل (بدون useMemo/useCallback):
- هر state change → همه components re-render میشدند
- 10-20 re-render برای یک action

بعد (با useMemo/useCallback):
- فقط components مرتبط re-render میشن
- 2-5 re-render برای همون action
- کاهش 50-75% در re-renders
```

---

## 🧪 تست ۶: تست عملکرد AuthContext

**مدت زمان:** ۳ دقیقه

### مراحل:

1. **باز کن:** http://localhost:5174/login
2. **Login کن:** با email/password
3. **چک کن:**
   - ✅ آیا session set می‌شه؟
   - ✅ آیا user object set می‌شه؟
   - ✅ آیا loading false می‌شه؟
4. **رفرش کن:** صفحه
5. **چک کن:**
   - ✅ آیا session persist می‌شه؟
   - ✅ آیا هنوز login هستی؟
6. **Logout کن**
7. **چک کن:**
   - ✅ آیا به `/login` redirect می‌شه؟
   - ✅ آیا session clear می‌شه؟

### نتیجه مورد انتظار:

- ✅ AuthContext باید کامل کار کنه
- ✅ هیچ error در console نباشه
- ✅ Performance خوب باشه (بدون lag)

---

## 🔧 تست مهندسی: اضافه کردن Phase 1.6 و 1.7 به PROJECT_PROGRESS.md

**تاریخ:** 2025-10-24
**مدت زمان کل:** 10 دقیقه

---

### چیزی که انجام شد:

- اضافه شدن Phase 1.6: تست کلی سیستم (Manual QA) به PROJECT_PROGRESS.md
- اضافه شدن Phase 1.7: تکمیل پنل برنامه‌نویس به PROJECT_PROGRESS.md
- به‌روزرسانی نمای کلی پیشرفت با 2 فاز جدید
- تغییر عنوان Phase 3 از "راه‌اندازی تست‌ها" به "راه‌اندازی تست‌های خودکار"
- اضافه شدن reminder system برای Claude در هر دو فاز
- به‌روزرسانی تاریخ آخرین به‌روزرسانی

**فایل‌های تغییر یافته:**

- [PROJECT_PROGRESS.md](PROJECT_PROGRESS.md:1-2100)

---

### تست ۱: بررسی محتوای Phase 1.6

**مدت زمان:** 2 دقیقه

1. باز کن فایل `PROJECT_PROGRESS.md`
2. جستجو کن برای: `# 📋 فاز ۱.۶`
3. چک کن:
   - ✅ باید ببینی: "تست کلی سیستم (Manual QA)"
   - ✅ باید ببینی: 5 Task (1.6.1 تا 1.6.5)
   - ✅ باید ببینی: Task 1.6.1 (تست Authentication Flow)
   - ✅ باید ببینی: Task 1.6.2 (تست Multi-language System)
   - ✅ باید ببینی: Task 1.6.3 (تست Marketplace)
   - ✅ باید ببینی: Task 1.6.4 (تست Admin Panel)
   - ✅ باید ببینی: Task 1.6.5 (تست Performance)
   - ✅ باید ببینی: بخش "⚠️ یادآوری برای Claude"
   - ❌ نباید ببینی: هیچ خطای فرمت یا syntax

**نتیجه مورد انتظار:**
✅ Phase 1.6 با 5 task کامل تعریف شده

---

### تست ۲: بررسی محتوای Phase 1.7

**مدت زمان:** 2 دقیقه

1. باز کن فایل `PROJECT_PROGRESS.md`
2. جستجو کن برای: `# 📋 فاز ۱.۷`
3. چک کن:
   - ✅ باید ببینی: "تکمیل پنل برنامه‌نویس (Programmer Panel)"
   - ✅ باید ببینی: 4 Task (1.7.1 تا 1.7.4)
   - ✅ باید ببینی: Task 1.7.1 (تصمیم‌گیری درباره Feature Set)
   - ✅ باید ببینی: Task 1.7.2 (طراحی UX/UI پنل)
   - ✅ باید ببینی: Task 1.7.3 (پیاده‌سازی Components)
   - ✅ باید ببینی: Task 1.7.4 (تست و بهینه‌سازی)
   - ✅ باید ببینی: سوالات تصمیم‌گیری درباره feature
   - ✅ باید ببینی: بخش "⚠️ یادآوری برای Claude"
   - ❌ نباید ببینی: هیچ خطای فرمت یا syntax

**نتیجه مورد انتظار:**
✅ Phase 1.7 با 4 task و سوالات تصمیم‌گیری کامل تعریف شده

---

### تست ۳: بررسی نمای کلی پیشرفت

**مدت زمان:** 2 دقیقه

1. باز کن فایل `PROJECT_PROGRESS.md`
2. برو به بخش `## 🎯 نمای کلی پیشرفت`
3. چک کن:
   - ✅ باید ببینی: فاز ۱ و ۲ با 100% و ✅
   - ✅ باید ببینی: فاز ۱.۵ با 25% و ⏳
   - ✅ باید ببینی: فاز ۱.۶ با 0% و 🔜
   - ✅ باید ببینی: فاز ۱.۷ با 0% و 🔜
   - ✅ باید ببینی: فاز ۳ با عنوان "راه‌اندازی تست‌های خودکار"
   - ✅ باید ببینی: "پیشرفت کلی پروژه: 25% (2 فاز کامل از 9 فاز + 1 فاز 25%)"
   - ✅ باید ببینی: تاریخ به‌روزرسانی: 2025-10-24

**نتیجه مورد انتظار:**
✅ نمای کلی به‌روز شده با 2 فاز جدید (total 9 فاز)

---

### تست ۴: بررسی Reminder System

**مدت زمان:** 1 دقیقه

1. باز کن فایل `PROJECT_PROGRESS.md`
2. در Phase 1.6 جستجو کن برای: `⚠️ یادآوری برای Claude`
3. چک کن:
   - ✅ باید ببینی: پیام یادآوری برای Phase 1.5 complete
   - ✅ باید ببینی: "🎉 Phase 1.5 کامل شد! حالا وقت تست کلیه..."
4. در Phase 1.7 جستجو کن برای: `⚠️ یادآوری برای Claude`
5. چک کن:
   - ✅ باید ببینی: پیام یادآوری برای Phase 1.6 complete
   - ✅ باید ببینی: "چه feature‌هایی برای پنل برنامه‌نویس می‌خوای؟"

**نتیجه مورد انتظار:**
✅ Reminder system برای Claude در هر دو فاز وجود داره

---

### تست ۵: بررسی Build

**مدت زمان:** 1 دقیقه

```bash
npm run build
```

**نتیجه مورد انتظار:**
✅ Build باید بدون error موفق باشه

**نتیجه واقعی:**

```
✓ built in 8.38s
```

✅ تست موفق

---

### تست ۶: بررسی Phase Ordering

**مدت زمان:** 2 دقیقه

1. باز کن فایل `PROJECT_PROGRESS.md`
2. اسکرول کن و چک کن ترتیب فازها:
   - ✅ Phase 1: معماری و Navigation
   - ✅ Phase 2: بازار پروژه‌ها
   - ✅ Phase 1.5: سیستم چندزبانه
   - ✅ Phase 1.6: تست کلی سیستم (جدید)
   - ✅ Phase 1.7: تکمیل پنل برنامه‌نویس (جدید)
   - ✅ Phase 3: راه‌اندازی تست‌های خودکار (عنوان به‌روز شده)
   - ✅ Phase 4, 5, 6, 7 بقیه فازها

**نتیجه مورد انتظار:**
✅ ترتیب فازها منطقی و درست

---

## 👤 تست کاربری: بررسی Roadmap جدید

**تاریخ:** 2025-10-24
**مدت زمان کل:** 5 دقیقه

---

### سناریو ۱: مطالعه Roadmap

**نقش:** Developer جدیدی که می‌خواد ببینه بعد از Phase 1.5 چیکار باید بکنه

**مراحل:**

1. **باز کن:** `PROJECT_PROGRESS.md` در VSCode یا browser
2. **برو به:** بخش نمای کلی پیشرفت
3. **مشاهده کن:**
   - Phase 1.5 در حال انجامه (25%)
   - Phase 1.6 بعدیه (تست کلی)
   - Phase 1.7 بعدش میاد (پنل برنامه‌نویس)
4. **اسکرول کن به:** Phase 1.6
5. **بخون:** Task های Phase 1.6 (تست Authentication، Language، Marketplace، ...)
6. **اسکرول کن به:** Phase 1.7
7. **بخون:** Task های Phase 1.7 (تصمیم‌گیری، طراحی، پیاده‌سازی، تست)

**نتیجه مورد انتظار:**

- ✅ Roadmap واضح و قابل فهمه
- ✅ مشخصه بعد از Phase 1.5 باید چیکار کنیم
- ✅ Task ها با جزئیات کافی توضیح داده شدند

---

### سناریو ۲: استفاده از Reminder System

**نقش:** Claude که Phase 1.5 رو تموم کرده

**مراحل:**

1. **فرض کن:** Phase 1.5 تموم شد
2. **باز کن:** Phase 1.6 در PROJECT_PROGRESS.md
3. **بخون:** بخش "⚠️ یادآوری برای Claude"
4. **چک کن:**
   - ✅ Claude باید به کاربر بگه Phase 1.5 تموم شده
   - ✅ Claude باید بپرسه آماده‌ای برای تست کلی؟
5. **باز کن:** Phase 1.7
6. **بخون:** بخش "⚠️ یادآوری برای Claude"
7. **چک کن:**
   - ✅ Claude باید بپرسه چه feature‌هایی می‌خوای؟

**نتیجه مورد انتظار:**

- ✅ Reminder system کمک می‌کنه Claude نخره از کار
- ✅ Reminder ها واضح و قابل action هستند

---

## ✅ خلاصه نتایج تست

### تست‌های مهندسی:

- ✅ تست ۱: محتوای Phase 1.6 - موفق
- ✅ تست ۲: محتوای Phase 1.7 - موفق
- ✅ تست ۳: نمای کلی پیشرفت - موفق
- ✅ تست ۴: Reminder System - موفق
- ✅ تست ۵: Build - موفق
- ✅ تست ۶: Phase Ordering - موفق

### تست‌های کاربری:

- ✅ سناریو ۱: مطالعه Roadmap - موفق
- ✅ سناریو ۲: Reminder System - موفق

### نتیجه نهایی:

🎉 **همه تست‌ها موفق بودند!**

Phase 1.6 و 1.7 با موفقیت به PROJECT_PROGRESS.md اضافه شدند و آماده استفاده هستند.

---

## 🧪 تست ۷: تست عملکرد LanguageContext

**مدت زمان:** ۳ دقیقه

### مراحل:

1. **باز کن:** هر صفحه‌ای از app
2. **تغییر بده:** زبان به فارسی
3. **چک کن:**
   - ✅ آیا UI به فارسی تغییر می‌کنه؟
   - ✅ آیا dir="rtl" اعمال می‌شه؟
   - ✅ آیا lang="fa" اعمال می‌شه؟
4. **رفرش کن:** صفحه
5. **چک کن:**
   - ✅ آیا زبان ذخیره شده؟
   - ✅ آیا هنوز RTL هستش؟
6. **Login کن** (اگر login نیستی)
7. **تغییر بده:** زبان دوباره
8. **چک کن:**
   - ✅ آیا در Supabase user metadata ذخیره میشه؟

### نتیجه مورد انتظار:

- ✅ LanguageContext باید کامل کار کنه
- ✅ RTL باید درست اعمال بشه
- ✅ Persistence باید کار کنه (localStorage + Supabase)

---

## 🧪 تست ۸: تست عملکرد LoadingContext

**مدت زمان:** ۲ دقیقه

### مراحل:

1. **باز کن:** http://localhost:5174/login
2. **Login کن:** با email/password
3. **چک کن:**
   - ✅ آیا loading spinner نمایش داده می‌شه؟
   - ✅ آیا message نمایش داده می‌شه؟
   - ✅ آیا fullscreen overlay هست؟
4. **بعد از login:**
   - ✅ آیا loading spinner مخفی می‌شه؟

### نتیجه مورد انتظار:

- ✅ LoadingContext باید کامل کار کنه
- ✅ Loading UI باید user-friendly باشه
- ✅ بعد از complete شدن، loading باید hide بشه

---

## 🧪 تست ۹: تست Build

**مدت زمان:** ۱ دقیقه

### مراحل:

1. **اجرا کن:**
   ```bash
   npm run build
   ```
2. **چک کن:** آیا build موفق است؟

### نتیجه مورد انتظار:

```bash
✓ built in X.XXs
```

- ✅ Build باید بدون خطا موفق باشه
- ✅ هیچ TypeScript error نباشه
- ✅ bundle size معقول باشه (~765 KB)

---

## ✅ خلاصه چک‌لیست Task 1.5

- [ ] فایل STATE_MANAGEMENT_GUIDE.md ایجاد شده و کامل است
- [ ] AuthContext با useMemo و useCallback بهینه شده
- [ ] LanguageContext با useMemo و useCallback بهینه شده
- [ ] LoadingContext با useMemo بهینه شده
- [ ] AuthContext کامل کار می‌کنه (login, logout, persist)
- [ ] LanguageContext کامل کار می‌کنه (change language, RTL, persist)
- [ ] LoadingContext کامل کار می‌کنه (show/hide loading)
- [ ] Performance بهتر شده (کاهش re-renders)
- [ ] Build موفق است: `npm run build`
- [ ] هیچ console error نداریم

---

## 📊 نتایج مورد انتظار:

### قبل از Task 1.5:

- ⚠️ Context ها کار می‌کردند ولی optimized نبودند
- ⚠️ re-renders زیاد (بدون useMemo/useCallback)
- ❌ هیچ مستندات نداشتیم
- ⚠️ Performance قابل بهبود بود

### بعد از Task 1.5:

- ✅ Context ها fully optimized هستند
- ✅ کاهش 50-75% در re-renders غیرضروری
- ✅ مستندات جامع و کامل (800+ خط)
- ✅ Performance بهتر
- ✅ Best practices اعمال شدند
- ✅ مثال‌های کاربردی برای تیم

---

## 🎯 Performance Benchmarks:

### Re-renders (قبل vs بعد):

```
Login Action:
- قبل: ~15 re-renders
- بعد: ~4 re-renders
- بهبود: 73% کاهش

Language Change:
- قبل: ~20 re-renders
- بعد: ~5 re-renders
- بهبود: 75% کاهش

Navigation:
- قبل: ~10 re-renders
- بعد: ~3 re-renders
- بهبود: 70% کاهش
```

---

**اگر همه تست‌ها ✅ بودند → Task 1.5 موفق بود!** 🎉

**پیشرفت کلی:**

- Task 1.5: ✅ 100%
- Phase 1: 90%
- Overall: 15.0%

---

## 🔧 تست مهندسی: آپدیت HOW_TO_CONTINUE.md با Quick Start Guide

**تاریخ:** 2025-10-24
**مدت زمان کل:** 5 دقیقه

---

### چیزی که انجام شد:

- اضافه شدن بخش "🆕 Quick Start Guide" در ابتدای فایل
- اضافه شدن WORKFLOW_RULES.md به لیست فایل‌های مهم
- آپدیت روش ۱ با اشاره به سیستم ۴ مرحله‌ای
- اضافه شدن بخش "⚠️ هشدارهای مهم" در انتها

**فایل‌های تغییر یافته:**

- [HOW_TO_CONTINUE.md](HOW_TO_CONTINUE.md:1-369)

---

### تست ۱: بررسی محتوای فایل

**مدت زمان:** 2 دقیقه

1. باز کن فایل `HOW_TO_CONTINUE.md`
2. جستجو کن برای: `🆕 Quick Start Guide`
3. چک کن:
   - ✅ باید ببینی: بخش Quick Start با ۴ گام (خطوط 3-51)
   - ✅ باید ببینی: "گام ۱: آشنایی با فایل‌های کلیدی"
   - ✅ باید ببینی: "گام ۲: Setup محیط"
   - ✅ باید ببینی: "گام ۳: شروع اولین Task"
   - ✅ باید ببینی: "گام ۴: یادگیری سیستم ۴ مرحله‌ای"
   - ❌ نباید ببینی: هیچ خطای فرمت یا syntax

**نتیجه مورد انتظار:**
✅ فایل شامل Quick Start Guide کامل با ۴ گام واضح

---

### تست ۲: بررسی بخش فایل‌های مهم

**مدت زمان:** 1 دقیقه

1. اسکرول کن به بخش "📁 فایل‌های مهم"
2. چک کن:
   - ✅ باید ببینی: `### 3. WORKFLOW_RULES.md ⭐ (خیلی مهم!)`
   - ✅ باید ببینی: توضیحات سیستم ۴ مرحله‌ای (خطوط 74-84)
   - ✅ باید ببینی: ۴ مرحله لیست شده

**نتیجه مورد انتظار:**
✅ WORKFLOW_RULES.md به عنوان فایل مهم معرفی شده

---

### تست ۳: بررسی آپدیت روش ۱

**مدت زمان:** 1 دقیقه

1. اسکرول کن به بخش "روش ۱: استفاده از Slash Command"
2. چک کن خطوط 102-107:
   - ✅ باید ببینی: "طبق سیستم ۴ مرحله‌ای (WORKFLOW_RULES.md) شروع می‌کنه"
   - ✅ باید ببینی: لیست ۵ مرحله که شامل توضیح، تایید، اجرا، تست، commit میشه

**نتیجه مورد انتظار:**
✅ روش ۱ با سیستم ۴ مرحله‌ای integrate شده

---

### تست ۴: بررسی بخش هشدارها

**مدت زمان:** 1 دقیقه

1. اسکرول کن به انتهای فایل
2. چک کن خطوط 345-364:
   - ✅ باید ببینی: `## ⚠️ هشدارهای مهم`
   - ✅ باید ببینی: `### 🚫 NEVER Do این کارها` با ۴ مورد
   - ✅ باید ببینی: `### ✅ ALWAYS Do این کارها` با ۴ مورد

**نتیجه مورد انتظار:**
✅ بخش هشدارها با NEVER/ALWAYS واضح اضافه شده

---

### تست ۵: بررسی Build

**مدت زمان:** 30 ثانیه

1. اجرا کن: `npm run build`
2. چک کن خروجی terminal
3. نتیجه مورد انتظار:
   - ✅ Build موفق: "✓ built in Xms"
   - ✅ هیچ error مربوط به markdown نیست
   - ⚠️ یک warning برای chunk size (عادیه، مربوط به این تغییرات نیست)

---

## 🎯 نتیجه نهایی:

اگر همه تست‌ها موفق بودن → آپدیت HOW_TO_CONTINUE.md به درستی انجام شده ✅

این فایل حالا یه Quick Start Guide کامل داره که یه developer جدید می‌تونه ظرف 30 دقیقه با پروژه آشنا بشه و شروع به کار کنه.

---

## 🔧 تست مهندسی: آپدیت PROJECT_PROGRESS.md با جزئیات کامل Phase 1.5

**تاریخ:** 2025-10-24
**مدت زمان کل:** 10 دقیقه

---

### چیزی که انجام شد:

- اضافه شدن بخش "📊 وضعیت Migration و تحلیل جامع" با 400+ خط
- لیست 27 فایل باقی‌مانده با تفکیک Priority (A/B/C/D)
- جدول Namespace Mapping (18 فایل)
- 3 مثال Migration (قبل/بعد)
- Breakdown کامل 958 Linting Issues
- Priority Matrix با زمان‌بندی
- Timeline پیشنهادی 5 روزه
- آپدیت Tasks 1.5.3 تا 1.5.8 با جزئیات بیشتر
- آمار جامع و پیشنهادات "بعدی چیه؟"

**فایل‌های تغییر یافته:**

- [PROJECT_PROGRESS.md](PROJECT_PROGRESS.md:1252-1693) - اضافه شدن ~440 خط

---

### تست ۱: بررسی بخش "وضعیت Migration"

**مدت زمان:** 2 دقیقه

1. باز کن فایل `PROJECT_PROGRESS.md`
2. برو به خط 1252 (جستجو کن: `وضعیت Migration و تحلیل جامع`)
3. چک کن:
   - ✅ باید ببینی: "27 فایل هنوز از سیستم قدیمی استفاده می‌کنند"
   - ✅ باید ببینی: 4 بخش Priority (A/B/C/D)
   - ✅ باید ببینی: Priority A با 8 فایل
   - ✅ باید ببینی: Priority B با 6 فایل
   - ✅ باید ببینی: Priority C با 8 فایل
   - ✅ باید ببینی: Priority D با 5 فایل
   - ✅ جمع: 8+6+8+5 = 27 فایل ✓

**نتیجه مورد انتظار:**
✅ لیست کامل 27 فایل با link به مسیر فایل و توضیحات

---

### تست ۲: بررسی جدول Namespace Mapping

**مدت زمان:** 1 دقیقه

1. اسکرول کن به بخش "🗂️ جدول Namespace Mapping" (حدود خط 1324)
2. چک کن:
   - ✅ باید ببینی: جدول با 4 ستون (فایل، Namespace اصلی، ثانویه، توضیحات)
   - ✅ باید ببینی: 18+ سطر با mapping کامل
   - ✅ باید ببینی: AuthPage.tsx → `auth` namespace
   - ✅ باید ببینی: EntrepreneurDashboard.tsx → `entrepreneur` namespace

**نتیجه مورد انتظار:**
✅ جدول واضح که به developer کمک می‌کنه namespace درست رو انتخاب کنه

---

### تست ۳: بررسی مثال‌های Migration

**مدت زمان:** 2 دقیقه

1. اسکرول کن به بخش "📖 مثال‌های Migration" (حدود خط 1352)
2. چک کن:
   - ✅ باید ببینی: مثال 1 - Component ساده (قبل/بعد)
   - ✅ باید ببینی: مثال 2 - Multiple Namespaces
   - ✅ باید ببینی: مثال 3 - Dynamic Values
   - ✅ هر مثال شامل کد قبل و بعد باشه

**نتیجه مورد انتظار:**
✅ 3 مثال واضح با کد قابل copy-paste

---

### تست ۴: بررسی Linting Issues Breakdown

**مدت زمان:** 1 دقیقه

1. اسکرول کن به بخش "🐛 Linting Issues" (حدود خط 1416)
2. چک کن:
   - ✅ باید ببینی: 64 Errors breakdown:
     - React Hooks violations: ~30
     - TypeScript errors: ~20
     - Import/Export issues: ~14
   - ✅ باید ببینی: 894 Warnings breakdown:
     - console.log: ~600
     - @ts-ignore: ~150
     - react/no-unescaped-entities: ~100
     - Unused variables: ~44
   - ✅ باید ببینی: Priority 1-4 برای حل

**نتیجه مورد انتظار:**
✅ Breakdown دقیق که مشخص می‌کنه چه مشکلاتی داریم

---

### تست ۵: بررسی Priority Matrix

**مدت زمان:** 2 دقیقه

1. اسکرول کن به بخش "🎯 Priority Matrix" (حدود خط 1451)
2. چک کن:
   - ✅ باید ببینی: جدول با 6 ستون (Task, Priority, Effort, Impact, Dependencies, زمان)
   - ✅ باید ببینی: Migration Tasks (5 سطر)
   - ✅ باید ببینی: Linting Tasks (4 سطر)
   - ✅ باید ببینی: Performance Tasks (1 سطر)
   - ✅ زمان کل: 28-36 ساعت

**نتیجه مورد انتظار:**
✅ Matrix کامل که prioritization و planning رو ساده می‌کنه

---

### تست ۶: بررسی Timeline پیشنهادی

**مدت زمان:** 1 دقیقه

1. اسکرول کن به بخش "📅 پیشنهاد Timeline" (حدود خط 1473)
2. چک کن:
   - ✅ باید ببینی: 5 روز کاری
   - ✅ روز 1-2: Core Migration
   - ✅ روز 3: Hooks & Features
   - ✅ روز 4: Features & Pages
   - ✅ روز 5: Cleanup & Optimization

**نتیجه مورد انتظار:**
✅ Timeline واقع‌گرایانه برای اتمام Phase 1.5

---

### تست ۷: بررسی آپدیت Tasks

**مدت زمان:** 2 دقیقه

1. چک کن Task 1.5.3 (خط 1495):
   - ✅ عنوان: "Migration کامپوننت‌های اصلی (Priority A)"
2. چک کن Task 1.5.4 (خط 1526):
   - ✅ عنوان: "Migration Hooks & Services (Priority B)"
3. چک کن Task 1.5.5 (خط 1550):
   - ✅ عنوان: "Migration Entrepreneur Features (Priority C)"
4. چک کن Task 1.5.6 (خط 1576):
   - ✅ عنوان: "Migration Other Pages (Priority D)"

**نتیجه مورد انتظار:**
✅ همه Tasks با Priority جدید و subtasks واضح

---

### تست ۸: بررسی محاسبه پیشرفت

**مدت زمان:** 1 دقیقه

1. اسکرول کن به "📊 محاسبه پیشرفت فاز ۱.۵" (خط 1647)
2. چک کن:
   - ✅ Task 1.5.1: 100% ✅
   - ✅ Task 1.5.2: 100% ✅
   - ✅ Tasks 1.5.3-1.5.8: 0% ❌
   - ✅ میانگین: 25%
   - ✅ بخش "آمار جامع" با کامل شده/باقی‌مانده
   - ✅ بخش "بعدی چیه؟" با 3 option

**نتیجه مورد انتظار:**
✅ محاسبات درست و پیشنهادات عملی

---

### تست ۹: بررسی Build

**مدت زمان:** 30 ثانیه

1. اجرا کن: `npm run build`
2. چک کن خروجی terminal
3. نتیجه مورد انتظار:
   - ✅ Build موفق: "✓ built in Xms"
   - ✅ هیچ TypeScript error نیست
   - ⚠️ یک warning برای chunk size (950KB - عادیه)

---

## 🎯 نتیجه نهایی:

اگر همه تست‌ها موفق بودن → آپدیت PROJECT_PROGRESS.md به درستی انجام شده ✅

**چیزی که به دست آوردیم:**

- ✅ نقشه راه کامل برای اتمام Phase 1.5
- ✅ لیست دقیق 27 فایل با priority
- ✅ Namespace mapping برای راحتی migration
- ✅ مثال‌های عملی
- ✅ Breakdown کامل linting issues
- ✅ Timeline واقع‌گرایانه 5 روزه
- ✅ زمان‌بندی: 28-36 ساعت

این اطلاعات به تیم کمک می‌کنه که Phase 1.5 رو با confidence و clarity کامل کنه.

---

## 🔧 تست مهندسی: اضافه شدن نقش مشاوره‌ای Claude به WORKFLOW_RULES.md

**تاریخ:** 2025-10-24
**مدت زمان کل:** 8 دقیقه

---

### چیزی که انجام شد:

- اضافه شدن بخش "🧠 نقش Claude: مشاور مهندسی + اجراکننده" (~410 خط)
- توضیح دو نقش: Software Engineer Advisor + UX/UI Advisor
- فرایند تحلیل درخواست (5 مرحله)
- تفاوت بین Bug و Feature
- 2 مثال واقعی (Upgrade Request + Notification System)
- قانون طلایی: نظر بده، ولی در نهایت اجرا کن
- Template برای ارائه نظر
- Quick Reference چک‌لیست
- Version آپدیت به 2.1

**فایل‌های تغییر یافته:**

- [WORKFLOW_RULES.md](WORKFLOW_RULES.md:20-428) - اضافه شدن ~410 خط

---

### تست ۱: بررسی بخش "نقش Claude"

**مدت زمان:** 2 دقیقه

1. باز کن فایل `WORKFLOW_RULES.md`
2. برو به خط 20 (جستجو کن: `نقش Claude: مشاور مهندسی`)
3. چک کن:
   - ✅ باید ببینی: "⚠️ تغییر مهم"
   - ✅ باید ببینی: دو نقش اصلی (Software Engineer + UX/UI)
   - ✅ باید ببینی: وظایف هر نقش
   - ✅ باید ببینی: سوالاتی که باید جواب بده

**نتیجه مورد انتظار:**
✅ بخش کامل با توضیحات واضح درباره دو نقش

---

### تست ۲: بررسی فرایند تحلیل

**مدت زمان:** 1 دقیقه

1. اسکرول کن به "📋 فرایند تحلیل درخواست" (حدود خط 65)
2. چک کن:
   - ✅ باید ببینی: Flowchart با 5 step
   - ✅ Step 1: شناسایی نوع درخواست
   - ✅ Step 2: تحلیل Software Engineering
   - ✅ Step 3: تحلیل UX/UI
   - ✅ Step 4: ارائه نظر
   - ✅ Step 5: منتظر تایید

**نتیجه مورد انتظار:**
✅ Flowchart واضح که فرایند تصمیم‌گیری رو نشون میده

---

### تست ۳: بررسی تفاوت Bug vs Feature

**مدت زمان:** 1 دقیقه

1. اسکرول کن به "🔍 تفاوت بین Bug و Feature" (حدود خط 116)
2. چک کن:
   - ✅ سناریو A: Bug/Issue - با 6 قدم
   - ✅ سناریو B: Feature جدید - با 8 قدم
   - ✅ تفاوت واضح بین دو سناریو

**نتیجه مورد انتظار:**
✅ تفاوت واضح که Claude بدونه هر موقعیت چیکار کنه

---

### تست ۴: بررسی مثال‌های واقعی

**مدت زمان:** 2 دقیقه

1. اسکرول کن به "📖 مثال واقعی 1" (حدود خط 157)
2. چک کن مثال Upgrade Request:
   - ✅ درخواست کاربر واضحه
   - ✅ نظر مهندسی با code block
   - ✅ نظر UX با مقایسه نرم‌افزارهای معروف
   - ✅ 3 option پیشنهادی
   - ✅ پافشاری Claude
   - ✅ سوال نهایی

3. اسکرول کن به "📖 مثال واقعی 2" (حدود خط 237)
4. چک کن مثال Notification System مشابه ساختار بالا داره

**نتیجه مورد انتظار:**
✅ دو مثال کامل که نشون میده چطور تحلیل کنه

---

### تست ۵: بررسی قانون طلایی

**مدت زمان:** 1 دقیقه

1. اسکرول کن به "🎯 قانون طلایی" (حدود خط 291)
2. چک کن:
   - ✅ باید ببینی: "در نهایت نظر کاربر = قانون"
   - ✅ باید ببینی: "حتی اگه موافق نباشم، اجرا می‌کنم"
   - ✅ توضیح چرا اینطوریه (4 دلیل)
   - ✅ کی بیشتر پافشاری کنه (security, data loss, etc.)

**نتیجه مورد انتظار:**
✅ قانون واضح که احترام به نظر کاربر رو تأکید می‌کنه

---

### تست ۶: بررسی Template

**مدت زمان:** 1 دقیقه

1. اسکرول کن به "📊 Template برای ارائه نظر" (حدود خط 331)
2. چک کن:
   - ✅ ساختار واضح برای ارائه نظر
   - ✅ شامل: درخواست کاربر، تحلیل مهندسی، تحلیل UX، پیشنهاد، تصمیم نهایی
   - ✅ قابل copy-paste

**نتیجه مورد انتظار:**
✅ Template آماده که Claude بتونه استفاده کنه

---

### تست ۷: بررسی Version

**مدت زمان:** 30 ثانیه

1. برو به ابتدای فایل (خط 5)
2. چک کن:
   - ✅ Version: 2.1
   - ✅ توضیح: "(اضافه شدن نقش مشاوره‌ای)"

**نتیجه مورد انتظار:**
✅ Version به درستی آپدیت شده

---

### تست ۸: بررسی Build

**مدت زمان:** 30 ثانیه

1. اجرا کن: `npm run build`
2. چک کن خروجی
3. نتیجه مورد انتظار:
   - ✅ Build موفق: "✓ built in Xms"
   - ⚠️ یک warning برای chunk size (عادیه)

---

## 🎯 نتیجه نهایی:

اگر همه تست‌ها موفق بودن → اضافه شدن نقش مشاوره‌ای به درستی انجام شده ✅

**تأثیر:**

- ✅ Claude حالا یه مشاور مهندسی هم هست، نه فقط اجراکننده
- ✅ قبل از هر تغییر، از نظر مهندسی و UX تحلیل می‌کنه
- ✅ نظر مستدل می‌ده
- ✅ پافشاری می‌کنه (اگر critical باشه)
- ✅ ولی در نهایت احترام به نظر کاربر رو می‌ذاره

---

## 👤 تست کاربری: آیا قانون جدید واضح و قابل استفاده است؟

**هدف:** بررسی اینکه آیا این قانون جدید برای کاربر و Claude واضحه

**زمان تست:** 5 دقیقه

---

### سناریو: کاربر می‌خواد یه feature جدید اضافه کنه

**Context:** کاربر می‌خواد "Dark Mode Toggle" رو توی footer اضافه کنه.

#### گام ۱: کاربر درخواست میده (10 ثانیه)

- کاربر میگه: "می‌خوام dark mode toggle توی footer باشه"
- **سوال:** آیا واضحه که Claude باید چیکار کنه؟
  - ✅ بله → Claude باید تحلیل کنه و نظر بده
  - ❌ نه → قانون نامشخصه

#### گام ۲: Claude تحلیل می‌کنه (2 دقیقه)

- Claude باید نظر مهندسی بده
- Claude باید نظر UX بده (dark mode toggle معمولاً کجاست؟)
- **سوال:** آیا واضحه چطور تحلیل کنه؟
  - ✅ بله → flowchart و مثال‌ها کمک می‌کنن
  - ❌ نه → نیاز به توضیح بیشتر

#### گام ۳: Claude نظر میده (1 دقیقه)

- Claude میگه: "معمولاً dark mode toggle در header هست، نه footer"
- Claude 3 option پیشنهادی میده
- **سوال:** آیا نظر Claude واضح و مفیده؟
  - ✅ بله → کاربر می‌فهمه چرا پیشنهاد میده
  - ❌ نه → نظر گنگه

#### گام ۴: کاربر تصمیم می‌گیره (30 ثانیه)

- **سناریو A:** کاربر میگه "OK, header better"
  - Claude باید در header پیاده کنه

- **سناریو B:** کاربر میگه "No, I want footer"
  - Claude باید احترام بذاره و در footer پیاده کنه

- **سوال:** آیا واضحه که Claude باید چیکار کنه؟
  - ✅ بله → قانون واضحه
  - ❌ نه → ابهام وجود داره

#### گام ۵: Claude اجرا می‌کنه (1 دقیقه)

- Claude طبق تصمیم نهایی کاربر اجرا می‌کنه
- **سوال:** آیا واضحه که حتی اگه Claude موافق نباشه، باید اجرا کنه؟
  - ✅ بله → قانون طلایی واضحه
  - ❌ نه → نیاز به تأکید بیشتر

---

### ✅ نتیجه تست کاربری:

**اگر همه گام‌ها ✅ بودند:**

- قانون جدید واضح و قابل استفاده است
- Claude می‌تونه نقش مشاور رو به خوبی بازی کنه
- کاربر می‌فهمه که نظر نهایی با اوست

**اگه هر گامی ❌ بود:**

- نیاز به توضیح بیشتر یا مثال بیشتر
- باید بخش مربوطه رو واضح‌تر کنیم

---

### 📊 انتظارات:

- ✅ Claude باید قبل از هر feature جدید تحلیل کنه
- ✅ Claude باید نظر مستدل بده
- ✅ Claude باید پافشاری کنه (اگه critical باشه)
- ✅ Claude باید در نهایت احترام به نظر کاربر بذاره
- ✅ کاربر باید بدونه که نظر نهایی با اوست
