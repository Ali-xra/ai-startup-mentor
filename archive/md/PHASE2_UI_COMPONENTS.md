# ✅ فاز 2.3 - UI Components (بخش اول)

> **تاریخ:** 2025-10-16
> **وضعیت:** ✅ کامپوننت‌های اصلی ایجاد شد
> **نسخه:** MVP v1.0

---

## 📦 فایل‌های ایجاد شده

### 1. Hook: useInvestorAuth
**مسیر:** `hooks/useInvestorAuth.ts`

**قابلیت‌ها:**
- ✅ مدیریت authentication state
- ✅ ثبت‌نام سرمایه‌گذار جدید (`signUpInvestor`)
- ✅ ورود (`signIn`)
- ✅ خروج (`signOut`)
- ✅ رفرش پروفایل (`refreshProfile`)
- ✅ Auto-create investor_profile بعد از signup
- ✅ Listen به تغییرات auth state

**State شامل:**
```typescript
{
  user: any | null;
  profile: UserProfile | null;
  investorProfile: InvestorProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isInvestor: boolean;
}
```

---

### 2. Component: InvestorSignup
**مسیر:** `components/investor/InvestorSignup.tsx`

**ویژگی‌ها:**
- ✅ فرم ثبت‌نام با validation
- ✅ فیلدها: نام، ایمیل، رمز عبور، تکرار رمز
- ✅ نمایش خطاها به صورت realtime
- ✅ Loading state
- ✅ هدایت به صفحه تکمیل پروفایل بعد از signup
- ✅ لینک به صفحه ورود
- ✅ UI responsive و dark mode compatible

**Validation:**
- نام: الزامی
- ایمیل: الزامی + فرمت صحیح
- رمز عبور: حداقل 6 کاراکتر
- تکرار رمز: باید با رمز اصلی یکسان باشه

---

### 3. Component: InvestorProfileSetup
**مسیر:** `components/investor/InvestorProfileSetup.tsx`

**ویژگی‌ها:**
- ✅ فرآیند 4 مرحله‌ای (Multi-step wizard)
- ✅ Progress bar
- ✅ دکمه‌های Next/Previous
- ✅ امکان Skip و تکمیل بعدی
- ✅ Loading state
- ✅ هدایت به داشبورد بعد از تکمیل

**مراحل:**

#### مرحله 1: اطلاعات پایه
- نوع سرمایه‌گذار * (Angel, VC, Corporate, Partner)
- نام شرکت (اختیاری)
- لینکدین (اختیاری)

#### مرحله 2: بازه سرمایه‌گذاری
- حداقل سرمایه ($)
- حداکثر سرمایه ($)

#### مرحله 3: علایق
- صنعت‌های مورد علاقه (چند انتخابی)
- مراحل مورد علاقه (چند انتخابی)

#### مرحله 4: تجربه
- سال‌های تجربه
- بیوگرافی (textarea)

**صنعت‌های موجود:**
فناوری، سلامت، آموزش، املاک، خرده‌فروشی، غذا و نوشیدنی، حمل و نقل، انرژی، مالی، سرگرمی

**مراحل موجود:**
ایده، MVP، رشد اولیه، رشد، بلوغ

---

### 4. Component: InvestorDashboard
**مسیر:** `components/investor/InvestorDashboard.tsx`

**ویژگی‌ها:**
- ✅ نمایش آمار در 4 کارت:
  - پروژه‌های ذخیره شده
  - درخواست‌های در انتظار
  - اتصالات فعال
  - بازدیدهای ماهانه باقیمانده
- ✅ نمایش Tier Badge (Free/Verified/Premium)
- ✅ دسترسی سریع (Quick Actions):
  - جستجوی پروژه
  - پروژه‌های ذخیره شده
  - اتصالات من
- ✅ CTA برای ارتقا حساب (فقط Free tier)
- ✅ Loading state
- ✅ Auto-redirect اگر کاربر investor نباشه

**آمار دریافتی از Backend:**
```typescript
{
  total_projects_viewed: number;
  saved_projects_count: number;
  pending_connections: number;
  accepted_connections: number;
  monthly_views_remaining: number; // -1 = unlimited
}
```

---

### 5. Export Index
**مسیر:** `components/investor/index.ts`

Export مرکزی برای استفاده آسان:
```typescript
export { InvestorSignup } from './InvestorSignup';
export { InvestorProfileSetup } from './InvestorProfileSetup';
export { InvestorDashboard } from './InvestorDashboard';
```

---

## 🎨 ویژگی‌های UI/UX

### Design System
- ✅ Tailwind CSS
- ✅ Dark Mode Support
- ✅ Responsive Design (Mobile/Tablet/Desktop)
- ✅ RTL Support (فارسی)

### رنگ‌ها
- Primary: Blue 600
- Success: Green 600
- Warning: Yellow 600
- Danger: Red 600
- Purple برای Premium features

### Icons
- استفاده از Heroicons (SVG inline)
- Icon های معنادار برای هر بخش

### Animations
- Smooth transitions
- Loading spinners
- Progress bars

---

## 🔌 وابستگی‌ها

### Hooks مورد استفاده:
- `useInvestorAuth` - مدیریت auth
- `useNavigate` (react-router) - navigation
- `useLanguage` - چندزبانه (آماده)

### Services مورد استفاده:
- `investorProfileService`
  - `getUserProfile()`
  - `getInvestorProfile()`
  - `updateInvestorProfile()`
  - `upsertUserProfile()`
  - `getDashboardStats()`
- `supabase.auth`
  - `signUp()`
  - `signInWithPassword()`
  - `getSession()`
  - `onAuthStateChange()`

---

## 📋 Flow کاربر

```
1. صفحه اصلی
   ↓
2. InvestorSignup (ثبت‌نام)
   ↓
3. InvestorProfileSetup (تکمیل پروفایل 4 مرحله)
   ↓ (یا Skip)
4. InvestorDashboard (داشبورد)
   ↓
5. جستجوی پروژه / مدیریت اتصالات / ...
```

---

## ⏭️ مراحل بعدی (باقیمانده از فاز 2)

### کامپوننت‌های مورد نیاز:

#### 1. Authentication (تکمیل)
- ✅ InvestorSignup
- ⏳ InvestorLogin (ساده - مشابه Signup)

#### 2. Profile (تکمیل)
- ✅ InvestorProfileSetup
- ✅ InvestorDashboard
- ⏳ InvestorProfileEdit (برای ویرایش بعدی)

#### 3. Project Discovery (اولویت بالا)
- ⏳ ProjectExplorer - لیست پروژه‌ها با فیلتر
- ⏳ ProjectCard - کارت نمایش پروژه
- ⏳ ProjectFilters - فیلترهای جستجو
- ⏳ ProjectDetail - جزئیات پروژه
- ⏳ SavedProjects - لیست ذخیره شده‌ها

#### 4. Connections (اولویت متوسط)
- ⏳ ConnectionsList - لیست اتصالات
- ⏳ ConnectionDetail - جزئیات یک اتصال
- ⏳ MessageThread - نمایش پیام‌ها

#### 5. Verification
- ⏳ VerificationRequestForm - درخواست تایید حساب

---

## 🧪 نحوه تست

### تست Manual:

1. **ثبت‌نام:**
```bash
npm run dev
# برو به /investor/signup
# فرم رو پر کن
# چک کن که به /investor/profile-setup بره
```

2. **تکمیل پروفایل:**
```bash
# 4 مرحله رو طی کن
# چک کن که داده‌ها ذخیره بشن
# چک کن که به /investor/dashboard بره
```

3. **داشبورد:**
```bash
# چک کن آمار نمایش داده بشه
# چک کن دکمه‌ها کار کنن
# چک کن tier badge صحیح باشه
```

### تست با Supabase:
```sql
-- چک کردن داده‌های ایجاد شده
SELECT * FROM profiles WHERE user_type = 'investor';
SELECT * FROM investor_profiles;
```

---

## 📝 نکات مهم

### 1. Routing
برای استفاده از این کامپوننت‌ها، باید routing اضافه بشه:
```typescript
<Route path="/investor/signup" element={<InvestorSignup />} />
<Route path="/investor/profile-setup" element={<InvestorProfileSetup />} />
<Route path="/investor/dashboard" element={<InvestorDashboard />} />
```

### 2. Protected Routes
داشبورد نیاز به authentication داره. باید یک ProtectedRoute wrapper اضافه کنیم.

### 3. i18n (چندزبانه)
در حال حاضر متن‌ها فارسی hard-code شدن. برای چندزبانه کامل باید:
- از `useLanguage` استفاده کنیم
- فایل ترجمه اضافه کنیم

### 4. Form Validation
Validation ها ساده هستند. برای production می‌تونیم:
- از کتابخانه‌هایی مثل Yup یا Zod استفاده کنیم
- Validation های پیچیده‌تر اضافه کنیم

---

## ✅ خلاصه پیشرفت

| بخش | تعداد فایل | وضعیت |
|-----|-----------|-------|
| Hooks | 1 | ✅ کامل |
| Components | 3 | ✅ کامل |
| Exports | 1 | ✅ کامل |
| **جمع** | **5 فایل** | **✅ آماده** |

**زمان صرف شده:** ~1-2 ساعت
**آماده برای:** تست و اضافه کردن routing

---

**تاریخ تکمیل:** 2025-10-16
**بعدی:** اضافه کردن کامپوننت‌های Project Discovery
