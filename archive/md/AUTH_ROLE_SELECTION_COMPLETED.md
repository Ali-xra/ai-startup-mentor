# ✅ Auth با Role Selection - تکمیل شد

## 📅 تاریخ: 2025-10-16

---

## 🎯 خلاصه

صفحه Auth قبلی (`AuthScreen.tsx`) رو اصلاح کردیم و **Role Selection** بهش اضافه شد.

**قبل:** فقط Login/Signup ساده
**الان:** Login/Signup + انتخاب نقش (💡 کارآفرین یا 💰 سرمایه‌گذار)

---

## ✨ ویژگی‌های اضافه شده

### 1. **Role Selection در Signup**
- دو گزینه: 💡 کارآفرین | 💰 سرمایه‌گذار
- فقط در حالت Signup نمایش داده میشه
- طراحی کارت‌های انتخابی با checkmark
- RTL support کامل

### 2. **Login با تشخیص نقش**
- بعد از login، role از database خونده میشه
- اگر investor → redirect به `/investor.html`
- اگر entrepreneur → می‌مونه در `/app.html`

### 3. **Signup با ذخیره نقش**
- ساخت profile با role انتخابی
- اگر investor:
  - ساخت investor_profile
  - Redirect به `/investor.html`
- اگر entrepreneur:
  - می‌مونه در `/app.html` (startup journey)

### 4. **Google OAuth با Role**
- قبل از OAuth، role انتخابی در localStorage ذخیره میشه
- بعد از redirect برگشت، AppContent چک می‌کنه:
  - اگه profile نداره → میسازه با role ذخیره شده
  - اگه investor هست → redirect به `/investor.html`

---

## 🗂️ فایل‌های اصلاح شده

### 1. **AuthScreen.tsx** (`components/AuthScreen.tsx`)
**تغییرات:**
- ✅ اضافه شدن state برای `role`
- ✅ UI برای Role Selection (2 کارت)
- ✅ Logic signup برای ذخیره role
- ✅ Logic login برای redirect بر اساس role
- ✅ Google OAuth با ذخیره role در localStorage

**خطوط کلیدی:**
- L22-30: اضافه شدن role state
- L32-104: logic signup/login با role
- L106-128: Google OAuth با role handling
- L154-216: UI برای Role Selection

---

### 2. **AppContent.tsx**
**تغییرات:**
- ✅ اضافه شدن useEffect برای چک کردن profile
- ✅ ساخت خودکار profile بعد از Google OAuth
- ✅ Redirect به investor portal اگه لازم باشه

**خطوط کلیدی:**
- L23: اضافه شدن `profileCheckDone` state
- L30-82: useEffect برای profile check

---

## 🔄 Flow‌های مختلف

### Flow 1: Signup با Email (Entrepreneur)
```
1. کاربر کلیک "ثبت‌نام"
2. انتخاب role: 💡 کارآفرین
3. وارد کردن email/password
4. Submit
5. ساخت profile با role = 'entrepreneur'
6. می‌مونه در /app.html
7. شروع Startup Journey
```

### Flow 2: Signup با Email (Investor)
```
1. کاربر کلیک "ثبت‌نام"
2. انتخاب role: 💰 سرمایه‌گذار
3. وارد کردن email/password
4. Submit
5. ساخت profile با role = 'investor'
6. ساخت investor_profile (tier: free)
7. Redirect به /investor.html
8. نمایش Investor Portal
```

### Flow 3: Login
```
1. کاربر کلیک "ورود"
2. وارد کردن email/password
3. Submit
4. خواندن role از database
5. اگر investor → /investor.html
6. اگر entrepreneur → /app.html
```

### Flow 4: Google OAuth (Entrepreneur)
```
1. کاربر کلیک "ثبت‌نام"
2. انتخاب role: 💡 کارآفرین
3. کلیک "Continue with Google"
4. ذخیره role='entrepreneur' در localStorage
5. OAuth flow
6. Redirect به /app.html
7. AppContent چک می‌کنه:
   - profile نداره؟
   - می‌سازه با role='entrepreneur'
8. شروع Startup Journey
```

### Flow 5: Google OAuth (Investor)
```
1. کاربر کلیک "ثبت‌نام"
2. انتخاب role: 💰 سرمایه‌گذار
3. کلیک "Continue with Google"
4. ذخیره role='investor' در localStorage
5. OAuth flow
6. Redirect به /app.html
7. AppContent چک می‌کنه:
   - profile نداره؟
   - می‌سازه با role='investor'
   - می‌سازه investor_profile
8. Redirect به /investor.html
```

---

## 🧪 تست‌ها

### ✅ تست کن:

#### 1. Signup - Entrepreneur (Email)
```
URL: http://localhost:5175/app.html
1. کلیک "ثبت‌نام"
2. انتخاب 💡 کارآفرین
3. Email: test1@test.com
4. Password: 123456
5. Submit
6. باید بمونه در /app.html
```

#### 2. Signup - Investor (Email)
```
URL: http://localhost:5175/app.html
1. کلیک "ثبت‌نام"
2. انتخاب 💰 سرمایه‌گذار
3. Email: test2@test.com
4. Password: 123456
5. Submit
6. باید بره /investor.html
```

#### 3. Login
```
URL: http://localhost:5175/app.html
1. کلیک "ورود"
2. Email: (از signup قبلی)
3. Password: (از signup قبلی)
4. Submit
5. Redirect بر اساس role
```

#### 4. Google OAuth - Entrepreneur
```
URL: http://localhost:5175/app.html
1. کلیک "ثبت‌نام"
2. انتخاب 💡 کارآفرین
3. کلیک "Continue with Google"
4. انتخاب Google account
5. بعد از redirect، باید بمونه /app.html
```

#### 5. Google OAuth - Investor
```
URL: http://localhost:5175/app.html
1. کلیک "ثبت‌نام"
2. انتخاب 💰 سرمایه‌گذار
3. کلیک "Continue with Google"
4. انتخاب Google account
5. بعد از redirect، باید بره /investor.html
```

---

## 📊 در مورد اسم فایل

### ❌ `app.html` - نام نامناسب!
این فایل صفحه **Startup Journey** هست، نه صفحه Auth.

### ✅ پیشنهاد اسم‌های بهتر:
1. **`startup.html`** ⭐ (بهترین)
2. **`journey.html`** (خوب)
3. **`workspace.html`** (مناسب)

**فعلاً همون `app.html` باقی موند.** اگه بخوای تغییرش بدی، باید:
- Rename کنی `app.html` → `startup.html`
- Rename کنی `app.tsx` → `startup.tsx`
- آپدیت کنی `vite.config.ts`
- آپدیت کنی تمام لینک‌ها

---

## ✅ مزایای این رویکرد

| مزیت | توضیح |
|------|-------|
| **از صفحه قبلی استفاده کردیم** | کد قبلی حفظ شد (Google OAuth, etc.) |
| **UI ساده و واضح** | کاربر راحت انتخاب می‌کنه |
| **یک Entry Point** | `/app.html` برای همه |
| **Google OAuth کار می‌کنه** | با role selection کامل |
| **Flexible** | راحت میشه role جدید اضافه کرد |

---

## 🎨 طراحی UI

- کارت‌های انتخابی با border purple
- Emoji برای هر role (💡 💰)
- Checkmark برای انتخاب فعال
- RTL support
- Dark mode support
- همون استایل قبلی حفظ شد

---

## 🔧 نکات فنی

### چرا localStorage برای Google OAuth؟
چون OAuth redirect می‌کنه به یک URL جدید، state از دست میره. localStorage باعث میشه role رو نگه داریم.

### چرا AppContent چک می‌کنه؟
چون بعد از Google OAuth، کاربر ممکنه profile نداشته باشه. AppContent این رو handle می‌کنه.

### چرا redirect داخل AuthScreen نیست؟
چون AppContent باید اول profile رو بسازه، بعد redirect کنه.

---

## ⏭️ مرحله بعدی

فعلاً همه چی آماده است! میتونی:

1. **تست کنی** - تمام flow‌ها رو امتحان کن
2. **Rename کنی** - اگه می‌خوای `app.html` → `startup.html`
3. **Connections UI** - شروع فاز بعدی

---

## 📝 دستور استفاده

```bash
# Development
npm run dev

# URLs
http://localhost:5175/app.html       # Startup Journey (با Auth)
http://localhost:5175/investor.html  # Investor Portal
```

---

**✨ Auth با Role Selection آماده است!**

حالا:
- ✅ یک صفحه Auth واحد
- ✅ Role Selection (Entrepreneur/Investor)
- ✅ Google OAuth با role
- ✅ Login با redirect خودکار
- ✅ همه چی روی صفحه قبلی پیاده شد

**آماده برای تست!** 🚀
