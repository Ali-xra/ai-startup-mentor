# 📚 راهنمای State Management در AI Startup Mentor

**آخرین به‌روزرسانی:** 2025-10-19

این راهنما توضیح می‌دهد که چگونه state management در این پروژه پیاده‌سازی شده و چطور از آن استفاده کنیم.

---

## 📋 فهرست مطالب

1. [معماری State Management](#معماری-state-management)
2. [Context های موجود](#context-های-موجود)
3. [استفاده از هر Context](#استفاده-از-هر-context)
4. [Best Practices](#best-practices)
5. [نکات Performance](#نکات-performance)
6. [مثال‌های کاربردی](#مثالهای-کاربردی)

---

## 🏗️ معماری State Management

این پروژه از **React Context API** برای مدیریت state استفاده می‌کند. این رویکرد برای این پروژه مناسب است چون:

- ✅ **سادگی:** نیازی به نصب کتابخانه اضافی نیست
- ✅ **TypeScript Support:** Type-safe و خوانا
- ✅ **Testing:** تست Context ها ساده است
- ✅ **اندازه پروژه:** برای پروژه‌های small-to-medium مناسب است

### 📊 ساختار کلی:

```
src/contexts/
├── AuthContext.tsx          # مدیریت Authentication
├── LanguageContext.tsx      # مدیریت زبان و i18n
└── LoadingContext.tsx       # مدیریت global loading states
```

---

## 🎯 Context های موجود

### 1. AuthContext

**مسئولیت:** مدیریت authentication و user session

**State:**
- `session: Session | null` - Supabase session
- `user: User | null` - اطلاعات کاربر
- `loading: boolean` - وضعیت بارگذاری

**Actions:**
- `signIn(email, password)` - ورود کاربر
- `signOut()` - خروج کاربر

**فایل:** [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx)

---

### 2. LanguageContext

**مسئولیت:** مدیریت زبان اپلیکیشن و i18n

**State:**
- `language: LanguageCode` - زبان فعلی ('en' | 'fa')
- `isRTL: boolean` - آیا زبان RTL است؟

**Actions:**
- `setLanguage(lang)` - تغییر زبان

**ویژگی‌های خاص:**
- ✅ ذخیره در localStorage
- ✅ همگام‌سازی با Supabase user metadata
- ✅ تغییر خودکار dir="rtl/ltr" در document
- ✅ تغییر خودکار lang attribute

**فایل:** [`src/contexts/LanguageContext.tsx`](src/contexts/LanguageContext.tsx)

---

### 3. LoadingContext

**مسئولیت:** مدیریت global loading states

**State:**
- `isLoading: boolean` - آیا در حال loading است؟
- `message?: string` - پیام loading

**Actions:**
- `showLoading(message?)` - نمایش loading
- `hideLoading()` - پنهان کردن loading
- `withLoading(promise, message?)` - Wrapper برای promise ها

**ویژگی‌های خاص:**
- ✅ نمایش خودکار LoadingSpinner به صورت fullscreen
- ✅ withLoading برای استفاده آسان با async operations

**فایل:** [`src/contexts/LoadingContext.tsx`](src/contexts/LoadingContext.tsx)

---

## 🔧 استفاده از هر Context

### ✅ AuthContext

#### راه‌اندازی در App:

```tsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app content */}
    </AuthProvider>
  );
}
```

#### استفاده در کامپوننت:

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, session, loading, signIn, signOut } = useAuth();

  // چک کردن اینکه کاربر لاگین کرده یا نه
  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!user) {
    return <div>لطفاً ابتدا وارد شوید</div>;
  }

  // استفاده از اطلاعات کاربر
  return (
    <div>
      <p>خوش آمدید {user.email}</p>
      <button onClick={signOut}>خروج</button>
    </div>
  );
}
```

#### مثال Login:

```tsx
function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      // موفقیت - redirect خودکار انجام می‌شود
    } catch (error) {
      console.error('Login failed:', error);
      // نمایش error به کاربر
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">ورود</button>
    </form>
  );
}
```

---

### ✅ LanguageContext

#### راه‌اندازی در App:

```tsx
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        {/* Your app content */}
      </LanguageProvider>
    </AuthProvider>
  );
}
```

**نکته:** LanguageProvider باید **داخل** AuthProvider باشد چون به user نیاز دارد.

#### استفاده در کامپوننت:

```tsx
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../services/translationService';

function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useLanguage();

  return (
    <div>
      <p>زبان فعلی: {language === 'fa' ? 'فارسی' : 'English'}</p>
      <p>RTL: {isRTL ? 'بله' : 'خیر'}</p>

      <button onClick={() => setLanguage('en')}>English</button>
      <button onClick={() => setLanguage('fa')}>فارسی</button>
    </div>
  );
}
```

#### استفاده با Translation Service:

```tsx
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../services/translationService';

function MyComponent() {
  const { language } = useLanguage();

  return (
    <div>
      <h1>{translate('welcome', language)}</h1>
      <p>{translate('description', language)}</p>
    </div>
  );
}
```

---

### ✅ LoadingContext

#### راه‌اندازی در App:

```tsx
import { LoadingProvider } from './contexts/LoadingContext';

function App() {
  return (
    <LoadingProvider>
      {/* Your app content */}
    </LoadingProvider>
  );
}
```

#### روش 1️⃣: استفاده دستی

```tsx
import { useLoadingContext } from '../contexts/LoadingContext';

function MyComponent() {
  const { showLoading, hideLoading } = useLoadingContext();

  const handleAction = async () => {
    showLoading('در حال بارگذاری داده‌ها...');
    try {
      await fetchData();
    } finally {
      hideLoading();
    }
  };

  return <button onClick={handleAction}>بارگذاری</button>;
}
```

#### روش 2️⃣: استفاده با withLoading (توصیه می‌شود ⭐)

```tsx
import { useLoadingContext } from '../contexts/LoadingContext';

function MyComponent() {
  const { withLoading } = useLoadingContext();

  const handleAction = async () => {
    await withLoading(
      fetchData(),
      'در حال بارگذاری داده‌ها...'
    );
    // Loading به طور خودکار hide می‌شود
  };

  return <button onClick={handleAction}>بارگذاری</button>;
}
```

#### مثال واقعی - فراخوانی API:

```tsx
function DataFetcher() {
  const { withLoading } = useLoadingContext();
  const [data, setData] = useState(null);

  const loadData = async () => {
    const result = await withLoading(
      fetch('/api/data').then(r => r.json()),
      'در حال دریافت اطلاعات از سرور...'
    );
    setData(result);
  };

  return (
    <div>
      <button onClick={loadData}>بارگذاری داده‌ها</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

---

## 🎯 Best Practices

### ✅ DO (انجام بده)

1. **همیشه از custom hooks استفاده کن:**
   ```tsx
   // ✅ درست
   import { useAuth } from '../contexts/AuthContext';
   const { user } = useAuth();

   // ❌ غلط
   import { AuthContext } from '../contexts/AuthContext';
   const value = useContext(AuthContext);
   ```

2. **Provider ها را به ترتیب صحیح قرار بده:**
   ```tsx
   // ✅ درست - AuthProvider بالاتر از LanguageProvider
   <AuthProvider>
     <LanguageProvider>
       <LoadingProvider>
         <App />
       </LoadingProvider>
     </LanguageProvider>
   </AuthProvider>
   ```

3. **از withLoading برای async operations استفاده کن:**
   ```tsx
   // ✅ درست - خودکار و خوانا
   await withLoading(fetchData(), 'Loading...');

   // ❌ قابل قبول ولی طولانی‌تر
   showLoading('Loading...');
   try {
     await fetchData();
   } finally {
     hideLoading();
   }
   ```

4. **Error handling را فراموش نکن:**
   ```tsx
   // ✅ درست
   try {
     await signIn(email, password);
   } catch (error) {
     console.error('Login failed:', error);
     // نمایش error به کاربر
   }
   ```

### ❌ DON'T (انجام نده)

1. **مستقیماً از Context استفاده نکن:**
   ```tsx
   // ❌ غلط
   import AuthContext from '../contexts/AuthContext';
   const value = useContext(AuthContext);

   // ✅ درست
   import { useAuth } from '../contexts/AuthContext';
   const value = useAuth();
   ```

2. **Context را خارج از Provider فراخوانی نکن:**
   ```tsx
   // ❌ این خطا می‌دهد
   function MyComponent() {
     const { user } = useAuth(); // بدون AuthProvider
   }
   ```

3. **State را بیش از حد جزئی نکن:**
   ```tsx
   // ❌ هر form field یک context جداگانه؟ خیر!
   // ✅ از useState در component استفاده کن
   ```

---

## ⚡ نکات Performance

### 1. استفاده از useMemo برای محاسبات سنگین

```tsx
import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

function UserDashboard() {
  const { user } = useAuth();

  // محاسبه سنگین فقط وقتی user تغییر کرد
  const userStats = useMemo(() => {
    if (!user) return null;
    return calculateComplexStats(user);
  }, [user]);

  return <div>{/* Use userStats */}</div>;
}
```

### 2. استفاده از useCallback برای functions

```tsx
import { useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSwitcher() {
  const { setLanguage } = useLanguage();

  // این function فقط یکبار ساخته می‌شود
  const handleChangeToEnglish = useCallback(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <button onClick={handleChangeToEnglish}>English</button>;
}
```

### 3. جلوگیری از re-render های غیرضروری

```tsx
import React, { memo } from 'react';

// این component فقط وقتی props تغییر کرد re-render می‌شود
const UserInfo = memo(({ user }) => {
  return (
    <div>
      <p>{user.email}</p>
      <p>{user.name}</p>
    </div>
  );
});
```

### 4. تقسیم Context های بزرگ به چند Context کوچک

```tsx
// ✅ درست - هر Context مسئولیت خاص خودش را دارد
<AuthProvider>
  <LanguageProvider>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </LanguageProvider>
</AuthProvider>

// ❌ غلط - یک Context برای همه چیز
<GlobalStateProvider>
  <App />
</GlobalStateProvider>
```

---

## 💡 مثال‌های کاربردی

### مثال 1: صفحه Protected (نیاز به Authentication)

```tsx
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h1>صفحه محافظت شده</h1>
      <p>خوش آمدید {user.email}</p>
    </div>
  );
}
```

### مثال 2: Form با Loading و i18n

```tsx
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLoadingContext } from '../contexts/LoadingContext';
import { translate } from '../services/translationService';

function ContactForm() {
  const { language } = useLanguage();
  const { withLoading } = useLoadingContext();
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await withLoading(
      fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      }),
      translate('sending', language)
    );

    alert(translate('success', language));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{translate('contactUs', language)}</h2>

      <input
        type="text"
        placeholder={translate('namePlaceholder', language)}
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
      />

      <input
        type="email"
        placeholder={translate('emailPlaceholder', language)}
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
      />

      <button type="submit">
        {translate('submit', language)}
      </button>
    </form>
  );
}
```

### مثال 3: Dashboard با همه Context ها

```tsx
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useLoadingContext } from '../contexts/LoadingContext';
import { translate } from '../services/translationService';

function UserDashboard() {
  const { user, signOut } = useAuth();
  const { language, setLanguage, isRTL } = useLanguage();
  const { withLoading } = useLoadingContext();

  const handleLogout = async () => {
    await withLoading(
      signOut(),
      translate('loggingOut', language)
    );
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1>{translate('dashboard', language)}</h1>

      <div>
        <p>{translate('welcome', language)} {user?.email}</p>
      </div>

      <div>
        <button onClick={() => setLanguage('en')}>English</button>
        <button onClick={() => setLanguage('fa')}>فارسی</button>
      </div>

      <button onClick={handleLogout}>
        {translate('logout', language)}
      </button>
    </div>
  );
}
```

---

## 🔍 Testing Context ها

### تست AuthContext:

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

describe('AuthContext', () => {
  it('should provide auth state', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
```

---

## 📚 منابع بیشتر

- [React Context API Documentation](https://react.dev/learn/passing-data-deeply-with-context)
- [TypeScript with React Context](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/)
- [Performance Optimization](https://react.dev/learn/render-and-commit)

---

## 🎯 خلاصه

| Context | مسئولیت | Hook | Provider ترتیب |
|---------|---------|------|----------------|
| AuthContext | Authentication | `useAuth()` | 1️⃣ اول |
| LanguageContext | i18n & Language | `useLanguage()` | 2️⃣ دوم |
| LoadingContext | Loading States | `useLoadingContext()` | 3️⃣ سوم |

**ترتیب صحیح Provider ها:**

```tsx
<AuthProvider>           {/* 1️⃣ */}
  <LanguageProvider>     {/* 2️⃣ */}
    <LoadingProvider>    {/* 3️⃣ */}
      <App />
    </LoadingProvider>
  </LanguageProvider>
</AuthProvider>
```

---

**ساخته شده با ❤️ برای AI Startup Mentor**

**آخرین به‌روزرسانی:** 2025-10-19
