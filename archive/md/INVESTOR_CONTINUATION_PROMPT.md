# 🚀 دستور ادامه کار Investor Portal برای چت جدید

## 📋 پرامپت آماده - گزینه 1: Setup کردن Routing (پیشنهاد می‌شود)

```
سلام! می‌خوام ادامه پروژه Investor Portal MVP رو پیاده کنیم.

📍 وضعیت فعلی:
✅ فاز 1 (Database) - کامل
✅ فاز 2.1 (Types) - کامل
✅ فاز 2.2 (Services) - کامل
✅ فاز 2.3 (UI - بخش اول) - کامل
✅ فاز 2.3 (UI - Project Discovery) - کامل

📦 کامپوننت‌های آماده (8 عدد):
✅ useInvestorAuth hook
✅ InvestorSignup
✅ InvestorProfileSetup
✅ InvestorDashboard
✅ ProjectCard
✅ ProjectFilters
✅ ProjectExplorer
✅ ProjectDetail
✅ SavedProjects

📂 فایل‌های مهم برای مطالعه:
- INVESTOR_PORTAL_MVP_PLAN.md - پلن کامل پروژه
- INVESTOR_PORTAL_MVP_EXECUTED.md - گزارش فاز 1 و 2
- PHASE2_UI_COMPONENTS.md - مستندات کامپوننت‌های فاز اول
- PHASE2_PROJECT_DISCOVERY_COMPLETED.md - گزارش کامل Project Discovery
- NEXT_STEPS_ROUTING.md - راهنمای کامل مرحله بعد

🎯 مرحله بعدی: Setup کردن Routing

طبق فایل NEXT_STEPS_ROUTING.md، می‌خوام گزینه 1 (React Router) رو پیاده کنیم:

مراحل:
1. نصب React Router: npm install react-router-dom
2. ساخت Router.tsx با routes زیر:
   - /investor/signup
   - /investor/profile-setup
   - /investor/dashboard
   - /investor/explore
   - /investor/projects/:projectId
   - /investor/saved
3. ساخت ProtectedRoute و InvestorRoute components
4. بروزرسانی AuthContext برای گرفتن user_type از دیتابیس
5. بروزرسانی index.tsx برای استفاده از Router
6. تست کامل routing و navigation

بیا از مرحله 1 شروع کنیم! 🚀
```

---

## 📋 پرامپت آماده - گزینه 2: Routing ساده بدون React Router

```
سلام! می‌خوام ادامه پروژه Investor Portal MVP رو پیاده کنیم.

📍 وضعیت فعلی:
✅ فاز 1 (Database) - کامل
✅ فاز 2.1 (Types) - کامل
✅ فاز 2.2 (Services) - کامل
✅ فاز 2.3 (UI - بخش اول) - کامل
✅ فاز 2.3 (UI - Project Discovery) - کامل

📦 8 کامپوننت Investor آماده است

📂 فایل‌های مهم برای مطالعه:
- PHASE2_PROJECT_DISCOVERY_COMPLETED.md - آخرین گزارش
- NEXT_STEPS_ROUTING.md - راهنمای مرحله بعد

🎯 مرحله بعدی: Setup کردن Routing بدون React Router

می‌خوام با state management ساده در AppContent.tsx، routing رو پیاده کنیم:

مراحل:
1. اضافه کردن type برای views (AppView)
2. اضافه کردن state برای currentView
3. پیاده‌سازی navigation با setState
4. اضافه کردن switch/case برای render کردن کامپوننت‌ها
5. تست navigation بین صفحات

بیا شروع کنیم! 🚀
```

---

## 📋 پرامپت آماده - گزینه 3: مستقیم سراغ Connections UI

```
سلام! می‌خوام ادامه پروژه Investor Portal MVP رو پیاده کنیم.

📍 وضعیت فعلی:
✅ فاز 1 (Database) - کامل
✅ فاز 2 (Types & Services) - کامل
✅ فاز 2.3 (UI - Auth & Profiles) - کامل
✅ فاز 2.3 (UI - Project Discovery) - کامل

📦 8 کامپوننت Investor آماده است
📦 Services کامل (investorProjectService, connectionService, investorProfileService)

📂 فایل‌های مهم برای مطالعه:
- INVESTOR_PORTAL_MVP_PLAN.md - پلن کامل
- PHASE2_PROJECT_DISCOVERY_COMPLETED.md - آخرین گزارش

🎯 مرحله بعدی: فاز 4 - Connections UI

طبق پلن اصلی، نیاز داریم کامپوننت‌های زیر رو بسازیم:

1. **ConnectionsList** - لیست درخواست‌های ارتباط
   - برای Investor: لیست پروژه‌هایی که بهشون علاقه نشون داده
   - برای Project Owner: لیست سرمایه‌گذارهایی که درخواست داده‌ن
   - فیلتر بر اساس status (pending, accepted, rejected)
   - نمایش آخرین پیام

2. **ConnectionDetail** - صفحه جزئیات یک ارتباط
   - نمایش اطلاعات پروژه/سرمایه‌گذار
   - نمایش پیام اولیه
   - دکمه‌های Accept/Reject (برای Project Owner)
   - دسترسی به MessageThread

3. **MessageThread** - نمایش و ارسال پیام‌ها
   - لیست پیام‌ها به صورت چت
   - فرم ارسال پیام
   - Mark as read
   - Real-time updates (optional)

توجه: Routing هنوز Setup نشده، فعلاً روی ساخت کامپوننت‌ها تمرکز می‌کنیم.

بیا از ConnectionsList شروع کنیم! 🚀
```

---

## 🎯 توصیه انتخاب:

### برای کار حرفه‌ای و کامل:
→ **گزینه 1** (React Router)

### برای پیشرفت سریع:
→ **گزینه 3** (Connections UI) + بعداً Routing

### برای سادگی بدون dependency:
→ **گزینه 2** (Routing ساده)

---

## 📊 پیشرفت فعلی MVP:

| بخش | وضعیت | درصد |
|-----|-------|------|
| Database | ✅ | 100% |
| Backend Services | ✅ | 100% |
| Authentication UI | ✅ | 100% |
| Project Discovery UI | ✅ | 100% |
| Connections UI | ⏳ | 0% |
| Routing & Integration | ⏳ | 0% |
| Testing & Polish | ⏳ | 0% |

**کل: ~70%**

---

## 📁 ساختار فایل‌ها:

```
ide-maker/
├── components/investor/
│   ├── InvestorSignup.tsx ✅
│   ├── InvestorProfileSetup.tsx ✅
│   ├── InvestorDashboard.tsx ✅
│   ├── ProjectCard.tsx ✅
│   ├── ProjectFilters.tsx ✅
│   ├── ProjectExplorer.tsx ✅
│   ├── ProjectDetail.tsx ✅
│   ├── SavedProjects.tsx ✅
│   └── index.ts ✅
│
├── services/
│   ├── investorProfileService.ts ✅
│   ├── investorProjectService.ts ✅
│   └── connectionService.ts ✅
│
├── hooks/
│   └── useInvestorAuth.ts ✅
│
├── types/
│   ├── investor.ts ✅
│   ├── project.ts ✅
│   └── connection.ts ✅
│
└── مستندات/
    ├── INVESTOR_PORTAL_MVP_PLAN.md
    ├── INVESTOR_PORTAL_MVP_EXECUTED.md
    ├── PHASE2_UI_COMPONENTS.md
    ├── PHASE2_PROJECT_DISCOVERY_COMPLETED.md
    └── NEXT_STEPS_ROUTING.md
```

---

## ⚙️ تنظیمات محیط:

- **Working directory:** `c:\Users\Ali\Desktop\proje\ide-maker`
- **Git branch:** main
- **Database:** Supabase
- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **State:** Context API

---

## 🔑 نکات مهم:

1. **تمام کامپوننت‌ها از `useNavigate` استفاده می‌کنن** - اگر Router نصب نیست، باید تغییر کنن

2. **AuthContext نیاز به `user_type` داره** برای تشخیص investor از idea_creator

3. **Dark Mode و RTL** در همه کامپوننت‌ها پشتیبانی می‌شه

4. **Services کامل هستن** و تست شدن، نیازی به تغییر ندارن

5. **محدودیت Free tier** باید در همه جا چک بشه (10 view در ماه)

---

**این فایل رو کپی کن و توی چت جدید paste کن!** 📌
