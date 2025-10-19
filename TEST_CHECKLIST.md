# 🧪 چک‌لیست تست کاربری - AI Startup Mentor

**تاریخ تست:** 2025-10-19
**URL:** http://localhost:5174
**تستر:** Ali

---

## ✅ چیزهای کامل شده که باید تست بشند:

### Task 1.1: Navigation System ✅ (🆕 تازه کامل شد!)
### Task 1.2: Error Boundaries ✅
### Task 1.3: Error Handler متمرکز ✅
### Task 1.4: Loading States System ✅
### Task 1.5: State Management (85%) ⚠️
### Task 1.7: Security & API Keys ✅
### Task 1.8: Refactor useStartupJourney Hook ✅
### Task 1.10: Git Workflow ✅

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
   import { useProjectManager } from './useProjectManager'
   import { useStageManager } from './useStageManager'
   import { useChatManager } from './useChatManager'
   import { useExportManager } from './useExportManager'
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
**تاریخ اتمام:** ___________
**توسط:** Ali
