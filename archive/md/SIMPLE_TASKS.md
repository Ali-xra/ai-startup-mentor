# کارهای ساده برای کمک به پروژه AI Startup Mentor

## 📌 اطلاعات کلی:
این یک پروژه React + TypeScript + Tailwind است.
همه چیز دوزبانه است: **فارسی** و **انگلیسی**
تم: روشن/تاریک (Dark/Light Mode)

---

## ✅ Task 1: تکمیل صفحه Pricing

**فایل:** `pricing.tsx`

**کار:**
1. ترجمه‌های فارسی/انگلیسی رو کامل کن (مثل index.tsx)
2. دکمه‌های CTA اضافه کن:
   - "شروع رایگان" / "Start Free"
   - "ارتقا به Pro" / "Upgrade to Pro"
3. دکمه‌ها رو به `/app.html` لینک کن
4. استایل رو مثل صفحه لندینگ زیبا کن

**الگو برای ترجمه:**
```typescript
const t = (key: string) => {
    const translations: Record<string, { fa: string; en: string }> = {
        page_title: { fa: 'قیمت‌گذاری', en: 'Pricing' },
        free_plan: { fa: 'رایگان', en: 'Free' },
        // ... ادامه
    };
    return translations[key]?.[locale] || key;
};
```

---

## ✅ Task 2: بهبود UI صفحه لندینگ

**فایل:** `index.tsx`

**کارها:**
1. بخش Testimonials (نظرات کاربران) اضافه کن:
```typescript
const testimonials = [
    {
        name: 'علی احمدی',
        avatar: '👨‍💼',
        comment: 'این ابزار واقعاً کمک کرد ایده‌ام رو به بیزنس پلن تبدیل کنم!',
        rating: 5
    },
    // ... 3-4 نمونه دیگر
];
```

2. بخش FAQ (سوالات متداول) اضافه کن
3. انیمیشن‌های موجود رو بهتر کن
4. Responsive بودن در موبایل رو تست کن

---

## ✅ Task 3: ساخت صفحه About Us

**فایل‌های جدید:** `about.html` + `about.tsx`

**محتوا:**
- معرفی پروژه
- داستان شروع
- اهداف و چشم‌انداز
- معرفی تیم (Mock Data با avatar emoji)

**ساختار مثل index.tsx:**
```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
// ... ادامه مثل index.tsx
```

**بعد از ساخت:**
- در `vite.config.ts` اضافه کن:
```typescript
about: resolve(__dirname, 'about.html'),
```
- در footer صفحه لندینگ لینک اضافه کن

---

## ✅ Task 4: بهبود ProfileModal

**فایل:** `components/ProfileModal.tsx`

**کار:**
1. فرم ویرایش پروفایل کامل کن:
   - نام
   - بیو (توضیحات کوتاه)
   - انتخاب آواتار (emoji picker یا لیست emoji)
2. دکمه‌های Save/Cancel
3. استایل زیبا با Tailwind
4. دوزبانه بودن

---

## ✅ Task 5: بهبود SearchBox

**فایل:** `components/SearchBox.tsx`

**کار:**
1. آیکون ذره‌بین اضافه کن: 🔍
2. Placeholder دوزبانه:
   - فارسی: "جستجو..."
   - English: "Search..."
3. استایل مدرن با border-radius و shadow
4. Focus state خوب

---

## ✅ Task 6: پاکسازی کد (Code Cleanup)

**در همه فایل‌ها:**
1. پیدا کردن و حذف:
   - `import` های استفاده نشده
   - `console.log` های اضافی
   - کامنت‌های قدیمی و غیرضروری
2. مرتب‌سازی imports
3. فرمت کد (Prettier)

**ابزار کمکی:**
```bash
# چک کردن خطاهای TypeScript
npm run build

# فرمت کردن کد
npx prettier --write "**/*.{ts,tsx}"
```

---

## ✅ Task 7: افزودن Loading States

**کار:**
1. در صفحه لندینگ، هنگام لود پروژه‌ها Skeleton نشان بده:
```tsx
{isLoading ? (
    <div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>
) : (
    // محتوای اصلی
)}
```

2. در دکمه‌های Submit، Loading Spinner اضافه کن
3. از کامپوننت `Loader` موجود استفاده کن

---

## ✅ Task 8: بهبود Footer

**فایل:** `index.tsx` (بخش Footer)

**کار:**
1. لینک‌های Social Media:
   - Twitter/X
   - LinkedIn
   - GitHub
2. لینک به صفحات:
   - About Us
   - Privacy Policy (فعلاً placeholder)
   - Terms of Service (فعلاً placeholder)
3. Newsletter signup form (فعلاً UI only)

---

## 🎨 راهنمای استایل:

**رنگ‌ها:**
- Primary: Purple/Indigo gradient
- Background Light: slate-50
- Background Dark: slate-900
- Text Light: slate-800
- Text Dark: white

**فونت:**
- فارسی: Vazir (در CSS موجود است)
- انگلیسی: Inter

**Tailwind Classes پرکاربرد:**
```
bg-gradient-to-r from-purple-600 to-indigo-600
hover:shadow-xl transition-all
rounded-xl
dark:bg-slate-800
```

---

## 🚀 نحوه اجرا:

```bash
cd c:\Users\Ali\Desktop\proje\ide-maker
npm run dev
```

سایت در `http://localhost:5177` اجرا می‌شه.

---

## ❓ سوالات متداول:

**Q: چطور دوزبانه کنم؟**
A: از `useLanguage()` استفاده کن و یک تابع `t()` بساز (مثل index.tsx)

**Q: چطور تم تاریک/روشن رو اعمال کنم؟**
A: از کلاس‌های `dark:` در Tailwind استفاده کن

**Q: کجا تست کنم؟**
A: صفحه رو در مرورگر باز کن و دکمه تغییر زبان/تم رو امتحان کن

---

## 📞 در صورت سوال:

اگر به کمک نیاز داشتی، این موارد رو چک کن:
- فایل‌های مشابه (index.tsx, pricing.tsx)
- کامپوننت‌های موجود در `components/`
- استایل‌ها در `index.css`

موفق باشی! 🚀
