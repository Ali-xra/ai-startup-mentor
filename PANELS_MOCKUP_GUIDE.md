# 🎨 راهنمای Mockup پنل‌های جدید

**تاریخ:** 2025-10-20
**وضعیت:** Mockup HTML فقط - بدون Backend

---

## ✅ پنل‌هایی که ساخته شد:

### 1️⃣ **پنل برنامه‌نویس** (ProgrammerApp.tsx) ✅

**فایل:** `src/pages/ProgrammerApp.tsx`

**صفحات:**
- 📊 Dashboard - آمار + پروژه‌های جدید
- 🔍 Browse Projects - مرور پروژه‌ها
- 📝 My Applications - درخواست‌های ارسالی
- 👤 Profile - پروفایل و مهارت‌ها

**ویژگی‌ها:**
- ✅ Sidebar با قابلیت collapse
- ✅ 4 صفحه مختلف
- ✅ Mock data برای نمایش
- ✅ Dark mode support
- ✅ Responsive design

---

## 🚀 چطور ببینمش؟

### **روش 1: Development Server**

```bash
npm run dev
```

بعد به این آدرس برو:
- **برنامه‌نویس:** `http://localhost:5173/programmer`

**⚠️ نکته مهم:** باید اول login کنی و role رو `programmer` انتخاب کنی!

---

### **روش 2: مستقیم تست کردن**

اگه می‌خوای **بدون login** ببینیش:

1. فایل `src/pages/ProgrammerApp.tsx` رو باز کن
2. خط 356 رو پیدا کن:
```typescript
checkAndRedirect('programmer').then(() => {
```

3. موقتاً comment کن:
```typescript
// checkAndRedirect('programmer').then(() => {
  setAuthChecked(true);
// });
```

4. حالا می‌تونی مستقیم ببینیش!

---

## 📋 چک‌لیست بررسی

وقتی وارد پنل میشی، این موارد رو چک کن:

### ✅ **Dashboard:**
- [ ] 4 تا card آمار نمایش داده میشه؟
- [ ] لیست 2 پروژه نمایش داده میشه؟
- [ ] آیکون‌ها درست نمایش داده میشن؟
- [ ] Dark mode کار می‌کنه؟

### ✅ **Sidebar:**
- [ ] کلیک روی منوها کار می‌کنه؟
- [ ] دکمه collapse/expand کار می‌کنه؟
- [ ] منوی فعال highlight میشه؟

### ✅ **صفحات دیگه:**
- [ ] Browse Projects نمایش داده میشه؟
- [ ] My Applications نمایش داده میشه؟
- [ ] Profile نمایش داده میشه؟

### ✅ **Responsive:**
- [ ] در mobile خوب نمایش داده میشه؟
- [ ] در tablet خوب نمایش داده میشه؟

---

## 🎯 بعدی کار چیه؟

### **اگه HTML موردتایید بود:**

1. ✅ تایید کردن طراحی
2. 🔜 ساخت پنل مشاور (ConsultantApp)
3. 🔜 ساخت پنل طراح (DesignerApp)
4. 🔜 اضافه کردن Backend
5. 🔜 اتصال به Supabase
6. 🔜 ساخت جداول دیتابیس

### **اگه تغییراتی لازمه:**

فقط بگو چه تغییراتی می‌خوای! مثلاً:
- رنگ sidebar عوض بشه
- menu item جدید اضافه بشه
- layout تغییر کنه
- ...

---

## 📸 Screenshot ها (به زودی)

من الان screenshot ها رو نمی‌تونم بگیرم، ولی تو می‌تونی بعد از دیدن بهم بگی نظرت چیه!

---

## 💡 نکات مهم:

1. **این فقط HTML است!**
   - هیچ backend نداره
   - داده‌ها mock هستند
   - دکمه‌ها فعلاً کار نمی‌کنند (فقط navigation)

2. **Auth Check هست:**
   - باید login کنی
   - باید role programmer داشته باشی
   - وگرنه redirect میشی

3. **طراحی مشابه Admin Panel:**
   - همون سبک sidebar
   - همون color scheme (indigo)
   - consistency با بقیه پنل‌ها

---

## 🐛 مشکلات احتمالی:

### مشکل 1: صفحه سفید!
**راه حل:** Console رو باز کن و error رو ببین. احتمالاً auth check مشکل داره.

### مشکل 2: Redirect میشه به login!
**راه حل:** باید اول با role `programmer` login کنی.

### مشکل 3: Sidebar ظاهر نمیشه!
**راه حل:** Tailwind CSS رو چک کن. مطمئن شو که build درست انجام شده.

---

## 📞 سوالات؟

هر سوالی داشتی بپرس! من آماده‌ام که:
- تغییرات اعمال کنم
- صفحات جدید اضافه کنم
- طراحی رو عوض کنم
- Backend رو اضافه کنم

---

**بعدی:** پنل‌های مشاور و طراح 🚀
