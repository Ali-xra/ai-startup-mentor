# طرح جامع Design System

## AI Startup Mentor - سیستم طراحی یکپارچه

---

## 🎯 **اهداف:**

1. ✅ تم روشن/تیره یکپارچه در تمام صفحات
2. ✅ رنگ‌بندی ثابت و حرفه‌ای
3. ✅ کامپوننت‌های مشترک و قابل استفاده مجدد
4. ✅ نگهداری آسان
5. ✅ Performance بهتر

---

## 🏗️ **معماری پیشنهادی:**

```
src/
├── styles/
│   └── theme.ts                  # تعریف رنگ‌ها و تم‌ها
├── contexts/
│   └── ThemeContext.tsx          # Theme Provider مرکزی
├── components/
│   └── ui/                       # کامپوننت‌های مشترک
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Badge.tsx
│       └── index.ts
└── hooks/
    └── useTheme.ts               # Custom hook برای theme
```

---

## 🎨 **رنگ‌بندی پیشنهادی:**

### Brand Colors (رنگ‌های اصلی برند)

```typescript
const brandColors = {
  primary: {
    50: '#f5f3ff', // خیلی روشن
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6', // اصلی ⭐
    600: '#7c3aed', // تیره‌تر
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95', // خیلی تیره
  },
  secondary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // اصلی ⭐
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
};

// رنگ‌های وضعیت
const statusColors = {
  success: '#10b981', // سبز
  warning: '#f59e0b', // نارنجی
  error: '#ef4444', // قرمز
  info: '#3b82f6', // آبی
};
```

### استراتژی استفاده:

```
✅ Primary (Purple): دکمه‌های اصلی، لینک‌ها، هدرها
✅ Secondary (Indigo): دکمه‌های ثانویه، accent elements
✅ Success (Green): موفقیت، تایید، پیشرفت
✅ Warning (Orange): هشدار، توجه
✅ Error (Red): خطا، حذف، لغو
✅ Info (Blue): اطلاعات، راهنما
```

---

## 🌓 **تم روشن و تیره:**

### Light Theme:

```typescript
{
  background: {
    primary: '#ffffff',      // پس‌زمینه اصلی
    secondary: '#f9fafb',    // پس‌زمینه ثانویه
    tertiary: '#f3f4f6',     // کارت‌ها و پنل‌ها
  },
  text: {
    primary: '#111827',      // متن اصلی
    secondary: '#6b7280',    // متن ثانویه
    tertiary: '#9ca3af',     // متن کم‌رنگ
  },
  border: '#e5e7eb',         // حاشیه‌ها
}
```

### Dark Theme:

```typescript
{
  background: {
    primary: '#0f172a',      // پس‌زمینه اصلی
    secondary: '#1e293b',    // پس‌زمینه ثانویه
    tertiary: '#334155',     // کارت‌ها و پنل‌ها
  },
  text: {
    primary: '#f8fafc',      // متن اصلی
    secondary: '#cbd5e1',    // متن ثانویه
    tertiary: '#94a3b8',     // متن کم‌رنگ
  },
  border: '#475569',         // حاشیه‌ها
}
```

---

## 📦 **کامپوننت‌های مشترک:**

### 1. Button Component

```typescript
// Variants:
- primary    → bg-purple-600 hover:bg-purple-700
- secondary  → bg-indigo-600 hover:bg-indigo-700
- success    → bg-green-600 hover:bg-green-700
- danger     → bg-red-600 hover:bg-red-700
- outline    → border-2 border-purple-600 text-purple-600
- ghost      → transparent hover:bg-purple-50

// Sizes:
- sm   → px-3 py-1.5 text-sm
- md   → px-4 py-2 text-base
- lg   → px-6 py-3 text-lg
- xl   → px-8 py-4 text-xl
```

### 2. Card Component

```typescript
// Variants:
- default    → bg-white dark:bg-slate-800
- elevated   → shadow-lg
- bordered   → border-2
- interactive → hover:shadow-xl transition-all
```

### 3. Badge Component

```typescript
// Variants:
- success → bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100
- warning → bg-yellow-100 text-yellow-800
- error   → bg-red-100 text-red-800
- info    → bg-blue-100 text-blue-800
```

---

## 🔧 **پیاده‌سازی مرحله‌به‌مرحله:**

### مرحله 1: تنظیم Tailwind Config

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          50: '#f5f3ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          // ...
        },
        // Background Colors
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        // Text Colors
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
      },
    },
  },
};
```

### مرحله 2: CSS Variables

```css
/* src/index.css */
:root {
  /* Light Theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --border-color: #e5e7eb;
}

.dark {
  /* Dark Theme */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --border-color: #475569;
}
```

### مرحله 3: Theme Context

```typescript
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### مرحله 4: UI Components

```typescript
// src/components/ui/Button.tsx
import React from 'react';
import { cn } from '../../utils/cn'; // utility برای merge کردن classNames

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20',
    ghost: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};
```

```typescript
// src/components/ui/Card.tsx
import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'bg-white dark:bg-slate-800 rounded-lg transition-all duration-200';

  const variants = {
    default: '',
    elevated: 'shadow-lg',
    bordered: 'border-2 border-slate-200 dark:border-slate-700',
    interactive: 'hover:shadow-xl cursor-pointer transform hover:scale-[1.02]',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```

---

## 🚀 **مراحل اجرا:**

### فاز 1: Setup (1 روز)

- [x] ایجاد ThemeContext
- [ ] ایجاد CSS Variables
- [ ] به‌روزرسانی tailwind.config.js
- [ ] ساخت utility function (cn)

### فاز 2: UI Components (2-3 روز)

- [ ] Button
- [ ] Card
- [ ] Input
- [ ] Modal
- [ ] Badge
- [ ] Alert

### فاز 3: Migration (3-4 روز)

- [ ] جایگزینی دکمه‌ها با Button component
- [ ] جایگزینی کارت‌ها با Card component
- [ ] حذف استایل‌های inline و hardcoded

### فاز 4: Testing & Polish (1-2 روز)

- [ ] تست تمام صفحات در Light/Dark mode
- [ ] بررسی consistency
- [ ] رفع باگ‌ها

---

## 📐 **استانداردهای طراحی:**

### فاصله‌گذاری (Spacing):

```
xs:  4px   (gap-1, p-1)
sm:  8px   (gap-2, p-2)
md:  16px  (gap-4, p-4)
lg:  24px  (gap-6, p-6)
xl:  32px  (gap-8, p-8)
2xl: 48px  (gap-12, p-12)
```

### Typography:

```
xs:  text-xs   (12px)
sm:  text-sm   (14px)
base: text-base (16px) ⭐
lg:  text-lg   (18px)
xl:  text-xl   (20px)
2xl: text-2xl  (24px)
3xl: text-3xl  (30px)
```

### Border Radius:

```
sm:  rounded-sm   (2px)
md:  rounded-md   (6px)
lg:  rounded-lg   (8px) ⭐
xl:  rounded-xl   (12px)
2xl: rounded-2xl  (16px)
full: rounded-full (9999px)
```

### Shadows:

```
sm:  shadow-sm
md:  shadow-md
lg:  shadow-lg   ⭐
xl:  shadow-xl
2xl: shadow-2xl
```

---

## 🎯 **مثال استفاده:**

### قبل:

```tsx
<button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
  کلیک کنید
</button>
```

### بعد:

```tsx
<Button variant="primary" size="md">
  کلیک کنید
</Button>
```

### مزایا:

✅ کد کمتر
✅ consistency بیشتر
✅ نگهداری آسان‌تر
✅ تغییرات سریع‌تر

---

## 💡 **نکات مهم:**

1. **تمام رنگ‌ها از theme بیان** - نه hardcoded
2. **Dark mode رو در نظر بگیرید** - همیشه `dark:` prefix
3. **از کامپوننت‌های مشترک استفاده کنید** - نه copy/paste
4. **Accessibility رو رعایت کنید** - contrast ratio، keyboard navigation
5. **Performance:** استفاده از Tailwind JIT mode

---

## 🔗 **منابع:**

- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [Shadcn/ui](https://ui.shadcn.com/) - الهام برای UI components
- [Radix Colors](https://www.radix-ui.com/colors) - رنگ‌بندی حرفه‌ای

---

## 📊 **قبل و بعد:**

### وضعیت فعلی:

```
❌ 195 استفاده از رنگ‌های مختلف
❌ هر صفحه استایل متفاوت
❌ تکرار کد زیاد
❌ نگهداری سخت
```

### بعد از پیاده‌سازی:

```
✅ یک Design System یکپارچه
✅ تم روشن/تیره در همه جا
✅ کد تمیز و قابل نگهداری
✅ تغییرات سریع و آسان
```

---

**آماده برای شروع؟** 🚀
