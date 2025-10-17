# راهنمای استفاده از Error Handling System

این پروژه دارای یک سیستم مدیریت خطای متمرکز و قدرتمند است که شامل موارد زیر می‌شود:

## فایل‌های مرتبط

- `src/services/errorHandler.ts` - سرویس اصلی مدیریت خطا
- `src/components/ErrorBoundary.tsx` - کامپوننت Error Boundary
- `src/components/ErrorFallback.tsx` - UI برای نمایش خطاها
- `src/hooks/useErrorHandler.ts` - Hook برای استفاده در کامپوننت‌ها

---

## 1. استفاده در کامپوننت‌ها (با Hook)

### مثال ساده:

```tsx
import { useErrorHandler } from '../hooks/useErrorHandler';

const MyComponent: React.FC = () => {
    const { handleComponentError, getErrorMessage } = useErrorHandler({ locale: 'fa' });

    const fetchData = async () => {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            return data;
        } catch (error) {
            const appError = handleComponentError(error, {
                action: 'fetching data',
                endpoint: '/api/data',
            });
            alert(getErrorMessage(appError));
        }
    };

    return <button onClick={fetchData}>بارگذاری داده</button>;
};
```

### استفاده با async/await:

```tsx
import { useErrorHandler } from '../hooks/useErrorHandler';

const MyComponent: React.FC = () => {
    const { handleAsyncError } = useErrorHandler({ locale: 'fa' });

    const loadUserData = async (userId: string) => {
        const [data, error] = await handleAsyncError(
            fetchUserData(userId),
            { userId, action: 'load user data' }
        );

        if (error) {
            // خطا رخ داده - می‌توانید UI مناسب نمایش دهید
            console.error('Failed to load user:', error);
            return;
        }

        // داده با موفقیت دریافت شد
        console.log('User data:', data);
    };

    return <div>...</div>;
};
```

### استفاده ساده (بدون context اضافی):

```tsx
import { useSimpleErrorHandler } from '../hooks/useErrorHandler';

const MyComponent: React.FC = () => {
    const { handleSimpleError } = useSimpleErrorHandler('fa');

    const onButtonClick = () => {
        try {
            // some code that might throw
            riskyOperation();
        } catch (error) {
            const message = handleSimpleError(error);
            toast.error(message);
        }
    };

    return <button onClick={onButtonClick}>انجام عملیات</button>;
};
```

---

## 2. استفاده مستقیم از ErrorHandler Service

اگر نیاز به استفاده خارج از کامپوننت React دارید:

```typescript
import { handleError, ErrorType, ErrorSeverity } from '../services/errorHandler';

// در هر جای کد
try {
    await someAsyncOperation();
} catch (error) {
    const appError = handleError(
        error,
        { operation: 'user login', userId: '123' },
        ErrorType.AUTH,
        ErrorSeverity.HIGH
    );

    console.error('Login failed:', appError);
}
```

---

## 3. انواع خطاها (ErrorType)

```typescript
export enum ErrorType {
    NETWORK = 'NETWORK',       // خطاهای شبکه
    AUTH = 'AUTH',             // خطاهای احراز هویت
    VALIDATION = 'VALIDATION', // خطاهای اعتبارسنجی
    DATABASE = 'DATABASE',     // خطاهای دیتابیس
    PERMISSION = 'PERMISSION', // خطاهای دسترسی
    NOT_FOUND = 'NOT_FOUND',   // خطاهای یافت نشدن
    UNKNOWN = 'UNKNOWN',       // خطاهای نامشخص
}
```

**تشخیص خودکار**: اگر `type` را مشخص نکنید، سیستم به طور خودکار نوع خطا را تشخیص می‌دهد.

---

## 4. سطوح اهمیت (ErrorSeverity)

```typescript
export enum ErrorSeverity {
    LOW = 'LOW',           // خطاهای کم‌اهمیت
    MEDIUM = 'MEDIUM',     // خطاهای متوسط
    HIGH = 'HIGH',         // خطاهای مهم
    CRITICAL = 'CRITICAL', // خطاهای بحرانی
}
```

---

## 5. پیام‌های User-Friendly

سیستم به طور خودکار پیام‌های user-friendly به دو زبان فارسی و انگلیسی تولید می‌کند:

```typescript
import { getUserFriendlyMessage } from '../services/errorHandler';

const appError = handleError(error);

// دریافت پیام فارسی
const messageFa = getUserFriendlyMessage(appError, 'fa');

// دریافت پیام انگلیسی
const messageEn = getUserFriendlyMessage(appError, 'en');
```

---

## 6. استفاده از ErrorBoundary

ErrorBoundary باید در سطح بالای اپلیکیشن (یا بخش‌های مهم) قرار گیرد:

```tsx
import ErrorBoundary from './src/components/ErrorBoundary';

const App: React.FC = () => {
    return (
        <ErrorBoundary locale="fa">
            <YourAppComponents />
        </ErrorBoundary>
    );
};
```

### ErrorBoundary با Fallback سفارشی:

```tsx
import ErrorBoundary from './src/components/ErrorBoundary';
import CustomErrorUI from './components/CustomErrorUI';

const App: React.FC = () => {
    return (
        <ErrorBoundary locale="fa" fallback={<CustomErrorUI />}>
            <YourAppComponents />
        </ErrorBoundary>
    );
};
```

---

## 7. مثال کامل در یک کامپوننت واقعی

```tsx
import React, { useState } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorType } from '../services/errorHandler';
import { supabase } from '../services/supabaseClient';

const UserProfile: React.FC = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const { handleAsyncError, getErrorMessage } = useErrorHandler({ locale: 'fa' });

    const loadProfile = async () => {
        setLoading(true);

        const [data, error] = await handleAsyncError(
            supabase.from('profiles').select('*').single(),
            {
                component: 'UserProfile',
                action: 'loadProfile',
            }
        );

        setLoading(false);

        if (error) {
            // نمایش پیام خطا به کاربر
            alert(getErrorMessage(error));
            return;
        }

        setUser(data);
    };

    const updateProfile = async (updates: any) => {
        const [result, error] = await handleAsyncError(
            supabase.from('profiles').update(updates).eq('id', user.id),
            {
                component: 'UserProfile',
                action: 'updateProfile',
                updates,
            }
        );

        if (error) {
            alert(getErrorMessage(error));
            return;
        }

        alert('پروفایل با موفقیت بروزرسانی شد');
    };

    return (
        <div>
            {loading ? (
                <p>در حال بارگذاری...</p>
            ) : user ? (
                <div>
                    <h1>{user.name}</h1>
                    <button onClick={() => updateProfile({ name: 'New Name' })}>
                        بروزرسانی
                    </button>
                </div>
            ) : (
                <button onClick={loadProfile}>بارگذاری پروفایل</button>
            )}
        </div>
    );
};

export default UserProfile;
```

---

## 8. مشاهده و مدیریت خطاها (برای Admin)

```tsx
import { getErrors, getErrorStats, clearErrors } from '../services/errorHandler';

const AdminErrorPanel: React.FC = () => {
    const errors = getErrors();
    const stats = getErrorStats();

    return (
        <div>
            <h2>آمار خطاها</h2>
            <p>تعداد کل: {stats.total}</p>
            <p>خطاهای AUTH: {stats.byType.AUTH}</p>
            <p>خطاهای CRITICAL: {stats.bySeverity.CRITICAL}</p>

            <button onClick={clearErrors}>پاک کردن همه</button>

            <ul>
                {errors.map((error, index) => (
                    <li key={index}>
                        {error.message} - {error.type} - {error.severity}
                    </li>
                ))}
            </ul>
        </div>
    );
};
```

---

## 9. یکپارچه‌سازی با Sentry (آینده)

برای یکپارچه‌سازی با Sentry:

1. نصب Sentry SDK:
```bash
npm install @sentry/react
```

2. فعال‌سازی در `errorHandler.ts`:
```typescript
// در متد sendToSentry، کامنت را برداشته و Sentry را initialize کنید
```

3. Initialize Sentry در `index.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 10. بهترین شیوه‌ها (Best Practices)

✅ **همیشه context ارائه کنید**: هنگام handle کردن خطا، context مفیدی اضافه کنید

```typescript
handleError(error, {
    userId: user.id,
    action: 'save project',
    projectId: project.id,
});
```

✅ **Type و Severity را مشخص کنید**: برای خطاهای خاص، type و severity را explicit مشخص کنید

```typescript
handleError(error, context, ErrorType.AUTH, ErrorSeverity.CRITICAL);
```

✅ **از Hook استفاده کنید**: در کامپوننت‌ها از `useErrorHandler` استفاده کنید

✅ **پیام‌های user-friendly نمایش دهید**: همیشه از `getErrorMessage` برای نمایش به کاربر استفاده کنید

❌ **خطاها را ignore نکنید**: همیشه خطاها را handle کنید

❌ **اطلاعات حساس log نکنید**: از log کردن password، token و... خودداری کنید

---

## 11. Testing

برای تست error handling:

```tsx
// تست با خطای مصنوعی
const testError = () => {
    throw new Error('This is a test error');
};

// فراخوانی در component
<button onClick={testError}>Test Error Boundary</button>
```

---

**نکته**: این سیستم به طور خودکار در تمام صفحات اصلی پروژه (index.tsx, entrepreneur.tsx, admin.tsx و...) یکپارچه شده است.
