# 🧪 چک‌لیست تست کاربری - AI Startup Mentor

**تاریخ تست:** 2025-10-18
**URL:** http://localhost:5174
**تستر:** Ali

---

## ✅ چیزهای کامل شده که باید تست بشند:

### Task 1.2: Error Boundaries ✅
### Task 1.3: Error Handler متمرکز ✅
### Task 1.4: Loading States System ✅
### Task 1.5: State Management (85%) ⚠️
### Task 1.7: Security & API Keys ✅

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
