# 🚀 مراحل بعدی: Setup کردن Routing برای Investor Portal

> **تاریخ:** 2025-10-16
> **وضعیت فعلی:** کامپوننت‌ها آماده، Routing نیاز به setup دارد

---

## 🔍 وضعیت فعلی

### ✅ چیزهایی که آماده هستند:
- تمام کامپوننت‌های Project Discovery (5 کامپوننت)
- Services کامل و تست شده
- Types و interfaces
- Dark mode و RTL support

### ⚠️ مشکل فعلی:
**React Router نصب نشده است!**

پروژه فعلی از React Router استفاده نمی‌کنه و routing ندارد.

---

## 📋 دو راه حل ممکن:

### راه حل 1: نصب React Router (توصیه می‌شود)

#### مزایا:
✅ Routing استاندارد و حرفه‌ای
✅ URL management
✅ Browser history
✅ Protected routes
✅ Deep linking support

#### مراحل:

```bash
# نصب React Router
npm install react-router-dom

# یا
yarn add react-router-dom
```

بعد از نصب، باید:

1. **ساخت فایل Router اصلی:**

```typescript
// src/Router.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import کامپوننت‌های Investor
import {
  InvestorSignup,
  InvestorProfileSetup,
  InvestorDashboard,
  ProjectExplorer,
  ProjectDetail,
  SavedProjects
} from './components/investor';

// Import کامپوننت‌های قبلی
import AppContent from './AppContent'; // صفحه اصلی (IDE maker)

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) return <Loader />;
  if (!session) return <Navigate to="/investor/signup" replace />;

  return <>{children}</>;
};

// Investor-only Route Component
const InvestorRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, userType } = useAuth();

  if (loading) return <Loader />;
  if (!session) return <Navigate to="/investor/signup" replace />;
  if (userType !== 'investor') return <Navigate to="/" replace />;

  return <>{children}</>;
};

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* صفحه اصلی (IDE Maker) */}
        <Route path="/" element={<AppContent />} />

        {/* Investor Portal - Public Routes */}
        <Route path="/investor/signup" element={<InvestorSignup />} />

        {/* Investor Portal - Protected Routes */}
        <Route
          path="/investor/profile-setup"
          element={
            <ProtectedRoute>
              <InvestorProfileSetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/investor/dashboard"
          element={
            <InvestorRoute>
              <InvestorDashboard />
            </InvestorRoute>
          }
        />

        <Route
          path="/investor/explore"
          element={
            <InvestorRoute>
              <ProjectExplorer />
            </InvestorRoute>
          }
        />

        <Route
          path="/investor/projects/:projectId"
          element={
            <InvestorRoute>
              <ProjectDetail />
            </InvestorRoute>
          }
        />

        <Route
          path="/investor/saved"
          element={
            <InvestorRoute>
              <SavedProjects />
            </InvestorRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
```

2. **بروزرسانی index.tsx:**

```typescript
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from './Router';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <Router />
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);
```

3. **بروزرسانی AuthContext:**

نیاز داره `userType` رو بر اساس دیتابیس بگیره:

```typescript
// contexts/AuthContext.tsx
export interface AuthContextType {
  session: Session | null;
  loading: boolean;
  userType: 'idea_creator' | 'investor' | null; // 🆕 اضافه شد
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

---

### راه حل 2: Routing بدون React Router (ساده‌تر اما محدودتر)

#### مزایا:
✅ نیازی به نصب چیزی نیست
✅ سریع‌تر پیاده‌سازی می‌شه

#### معایب:
❌ URL management ندارد
❌ Browser history کار نمی‌کنه
❌ Deep linking support ندارد
❌ کمتر حرفه‌ای

#### مراحل:

```typescript
// AppContent.tsx (بروزرسانی شده)
import { useState } from 'react';

type AppView =
  | 'ide' // صفحه اصلی IDE
  | 'investor-signup'
  | 'investor-profile-setup'
  | 'investor-dashboard'
  | 'investor-explore'
  | 'investor-project-detail'
  | 'investor-saved';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('ide');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // ... rest of code

  // Render based on currentView
  switch (currentView) {
    case 'investor-signup':
      return <InvestorSignup onSuccess={() => setCurrentView('investor-profile-setup')} />;

    case 'investor-profile-setup':
      return <InvestorProfileSetup onComplete={() => setCurrentView('investor-dashboard')} />;

    case 'investor-dashboard':
      return <InvestorDashboard />;

    case 'investor-explore':
      return <ProjectExplorer />;

    case 'investor-project-detail':
      return <ProjectDetail projectId={selectedProjectId} />;

    case 'investor-saved':
      return <SavedProjects />;

    default:
      return <div>IDE content...</div>;
  }
};
```

---

## 🎯 توصیه:

### استفاده از راه حل 1 (React Router) پیشنهاد می‌شود چون:
1. ✅ استاندارد صنعت
2. ✅ URL management
3. ✅ قابلیت SEO
4. ✅ UX بهتر (back/forward button)
5. ✅ امکان share کردن لینک
6. ✅ آماده برای scale شدن

---

## 📝 Checklist برای Setup:

### راه حل 1 (React Router):
- [ ] نصب `react-router-dom`
- [ ] ساخت `Router.tsx`
- [ ] ساخت `ProtectedRoute` و `InvestorRoute`
- [ ] بروزرسانی `index.tsx`
- [ ] بروزرسانی `AuthContext` (اضافه کردن `userType`)
- [ ] تست routing
- [ ] تست protected routes

### راه حل 2 (بدون Router):
- [ ] بروزرسانی `AppContent.tsx`
- [ ] اضافه کردن state management برای views
- [ ] تست navigation

---

## 🚦 مرحله بعد بعد از Routing:

1. **تست کامل:**
   - تست جستجو و فیلترها
   - تست Save/Unsave
   - تست Navigation
   - تست Connection Request
   - تست محدودیت Free tier

2. **Connections UI:**
   - ConnectionsList
   - ConnectionDetail
   - MessageThread

3. **Polish:**
   - بهبود UX
   - اضافه کردن animations بیشتر
   - بهبود responsive design
   - اضافه کردن notifications

---

## 💡 نکات مهم:

1. **AuthContext باید user_type رو بگیره:**
   ```typescript
   const { data: userData } = await supabase
     .from('users')
     .select('user_type')
     .eq('id', user.id)
     .single();
   ```

2. **Navigation در کامپوننت‌ها:**
   تمام کامپوننت‌ها از `useNavigate` استفاده می‌کنن، پس React Router ضروریه.

3. **Protected Routes:**
   باید بررسی کنیم کاربر:
   - Login کرده باشه
   - نوع کاربرش `investor` باشه
   - پروفایلش تکمیل باشه (برای بعضی صفحات)

---

## 🎉 خلاصه:

### کارهای انجام شده: ✅
- 5 کامپوننت Project Discovery
- Services کامل
- Types و interfaces
- مستندات کامل

### کار بعدی: 🚀
**نصب و Setup کردن React Router**

بعد از Setup، همه چیز آماده تست و استفاده است!

---

**تاریخ:** 2025-10-16
**نوشته شده توسط:** Claude
