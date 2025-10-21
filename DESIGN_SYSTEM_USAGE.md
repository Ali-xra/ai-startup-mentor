# راهنمای استفاده از Design System

## AI Startup Mentor

---

## 🎉 **سیستم طراحی شما آماده است!**

شما الان دارید:

- ✅ Theme Provider مرکزی
- ✅ کامپوننت‌های یکپارچه (Button, Card, Badge, Input)
- ✅ Dark Mode support در همه جا
- ✅ Utility function (cn)
- ✅ Tailwind config بهینه شده

---

## 🚀 **چطور شروع کنم؟**

### مرحله 1: اضافه کردن ThemeProvider به App

```typescript
// src/App.tsx یا src/main.tsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* بقیه کامپوننت‌ها */}
    </ThemeProvider>
  );
}
```

### مرحله 2: استفاده از کامپوننت‌ها

```typescript
// هر کامپوننتی که می‌خواید
import { Button, Card, Badge, Input } from './components/ui';

function MyComponent() {
  return (
    <Card variant="elevated" padding="md">
      <h2>عنوان</h2>
      <p>محتوا</p>
      <Badge variant="success">فعال</Badge>
      <Button variant="primary">کلیک کنید</Button>
    </Card>
  );
}
```

### مرحله 3: استفاده از Theme Hook

```typescript
import { useTheme } from './contexts/ThemeContext';

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

---

## 📦 **کامپوننت‌های موجود**

### 1. Button

```typescript
import { Button } from './components/ui';

// Variants
<Button variant="primary">اصلی</Button>
<Button variant="secondary">ثانویه</Button>
<Button variant="success">موفقیت</Button>
<Button variant="danger">خطر</Button>
<Button variant="warning">هشدار</Button>
<Button variant="outline">خطی</Button>
<Button variant="ghost">شبح</Button>

// Sizes
<Button size="sm">کوچک</Button>
<Button size="md">متوسط</Button>
<Button size="lg">بزرگ</Button>
<Button size="xl">خیلی بزرگ</Button>

// با آیکون
<Button icon={<Icon />} iconPosition="left">با آیکون</Button>

// Loading
<Button loading>در حال بارگذاری</Button>

// Full Width
<Button fullWidth>تمام عرض</Button>
```

### 2. Card

```typescript
import { Card, CardHeader, CardBody, CardFooter } from './components/ui';

// ساده
<Card>
  محتوای کارت
</Card>

// کامل
<Card variant="elevated" padding="md">
  <CardHeader title="عنوان" subtitle="زیرعنوان" />
  <CardBody>
    محتوای اصلی کارت
  </CardBody>
  <CardFooter align="right">
    <Button>ذخیره</Button>
  </CardFooter>
</Card>

// Interactive
<Card variant="interactive" hoverable>
  کارت کلیک‌پذیر
</Card>
```

### 3. Badge

```typescript
import { Badge } from './components/ui';

// Variants
<Badge variant="primary">اصلی</Badge>
<Badge variant="success">موفق</Badge>
<Badge variant="warning">هشدار</Badge>
<Badge variant="danger">خطر</Badge>
<Badge variant="info">اطلاعات</Badge>

// با نقطه
<Badge variant="success" dot>فعال</Badge>

// Sizes
<Badge size="sm">کوچک</Badge>
<Badge size="md">متوسط</Badge>
<Badge size="lg">بزرگ</Badge>
```

### 4. Input

```typescript
import { Input } from './components/ui';

// ساده
<Input placeholder="متن خود را وارد کنید" />

// با Label
<Input label="نام" placeholder="نام خود را وارد کنید" />

// با خطا
<Input
  label="ایمیل"
  error="ایمیل معتبر نیست"
  variant="error"
/>

// با راهنما
<Input
  label="رمز عبور"
  hint="حداقل 8 کاراکتر"
/>

// با آیکون
<Input
  icon={<SearchIcon />}
  iconPosition="left"
  placeholder="جستجو..."
/>

// Sizes
<Input inputSize="sm" />
<Input inputSize="md" />
<Input inputSize="lg" />
```

---

## 🎨 **رنگ‌بندی استاندارد**

### رنگ‌های اصلی (Purple - Indigo)

```typescript
// در Tailwind:
bg - purple - 500; // اصلی
bg - purple - 600; // تیره‌تر
bg - indigo - 500; // ثانویه
```

### رنگ‌های وضعیت

```typescript
// Success (سبز)
bg-green-500 text-green-700

// Warning (نارنجی/زرد)
bg-yellow-500 text-yellow-700

// Error (قرمز)
bg-red-500 text-red-700

// Info (آبی)
bg-blue-500 text-blue-700
```

### Dark Mode

همیشه `dark:` prefix استفاده کنید:

```typescript
// مثال:
className = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white';
```

---

## 🔧 **Utility Function: cn()**

برای ترکیب className ها:

```typescript
import { cn } from './utils/cn';

// ترکیب ساده
cn('px-4 py-2', 'bg-blue-500')

// شرطی
cn('px-4', isActive && 'bg-blue-500')

// Object
cn('px-4', {
  'bg-red-500': isError,
  'bg-green-500': isSuccess,
})

// در کامپوننت
<div className={cn('base-class', className)}>
```

---

## 📐 **استانداردهای فاصله‌گذاری**

```typescript
// Padding & Margin
p - 4; // 16px
p - 6; // 24px
p - 8; // 32px

// Gap (برای flex/grid)
gap - 2; // 8px
gap - 4; // 16px
gap - 6; // 24px
```

---

## 📝 **مثال‌های عملی**

### مثال 1: صفحه لاگین

```typescript
import { Card, CardHeader, CardBody, CardFooter, Button, Input } from './components/ui';

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        <CardHeader
          title="ورود"
          subtitle="به حساب کاربری خود وارد شوید"
        />
        <CardBody>
          <div className="space-y-4">
            <Input
              label="ایمیل"
              type="email"
              placeholder="example@email.com"
            />
            <Input
              label="رمز عبور"
              type="password"
              placeholder="********"
            />
          </div>
        </CardBody>
        <CardFooter align="right">
          <Button variant="outline">لغو</Button>
          <Button variant="primary">ورود</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

### مثال 2: Dashboard Card

```typescript
import { Card, CardHeader, CardBody, Badge } from './components/ui';

function StatsCard({ title, value, status }) {
  return (
    <Card variant="elevated" hoverable>
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant={status === 'up' ? 'success' : 'danger'}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-3xl font-bold">{value}</p>
      </CardBody>
    </Card>
  );
}
```

### مثال 3: دکمه با Theme Toggle

```typescript
import { useTheme } from './contexts/ThemeContext';
import { Button } from './components/ui';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      icon={theme === 'dark' ? '☀️' : '🌙'}
    >
      {theme === 'dark' ? 'روشن' : 'تیره'}
    </Button>
  );
}
```

---

## 🔄 **Migration Guide**

### قبل:

```typescript
// ❌ قدیمی - هر صفحه استایل متفاوت
<button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md">
  کلیک کنید
</button>

<div className="bg-white p-6 rounded-lg shadow-lg">
  محتوا
</div>
```

### بعد:

```typescript
// ✅ جدید - یکپارچه و استاندارد
<Button variant="primary">
  کلیک کنید
</Button>

<Card variant="elevated" padding="md">
  محتوا
</Card>
```

---

## ✅ **چک‌لیست پیاده‌سازی**

### Setup (انجام شده)

- [x] ThemeProvider
- [x] UI Components
- [x] Utility functions
- [x] Tailwind config

### مراحل بعدی (نیاز به انجام)

- [ ] اضافه کردن ThemeProvider به App.tsx
- [ ] جایگزینی دکمه‌ها با Button component
- [ ] جایگزینی کارت‌ها با Card component
- [ ] جایگزینی input ها با Input component
- [ ] تست Dark/Light mode در تمام صفحات

---

## 💡 **نکات مهم**

1. **همیشه از کامپوننت‌های ui استفاده کنید**

   ```typescript
   // ✅ درست
   import { Button } from './components/ui';

   // ❌ غلط
   <button className="...">
   ```

2. **Dark mode رو فراموش نکنید**

   ```typescript
   // ✅ درست
   className = 'bg-white dark:bg-slate-800';

   // ❌ غلط
   className = 'bg-white';
   ```

3. **از cn() برای ترکیب className استفاده کنید**

   ```typescript
   // ✅ درست
   className={cn('base-class', className)}

   // ❌ غلط
   className={`base-class ${className}`}
   ```

4. **رنگ‌ها رو استاندارد نگه دارید**
   - Primary: Purple
   - Secondary: Indigo
   - Success: Green
   - Error: Red
   - Warning: Yellow

---

## 🆘 **مشکل دارید؟**

### مشکل: کامپوننت‌ها import نمی‌شن

```bash
# مطمئن شوید clsx و tailwind-merge نصب هستن:
npm install clsx tailwind-merge
```

### مشکل: Dark mode کار نمی‌کنه

```typescript
// مطمئن شوید ThemeProvider رو اضافه کردید:
<ThemeProvider>
  <App />
</ThemeProvider>
```

### مشکل: استایل‌ها اعمال نمیشن

```bash
# Tailwind رو restart کنید:
npm run dev
```

---

## 📚 **منابع بیشتر**

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**موفق باشید! 🎉**

اگر سوالی داشتید، فایل `DESIGN_SYSTEM_PLAN.md` رو هم بخونید.
