# مثال Migration: PricingPage

## خلاصه تغییرات:

### 1. استفاده از ThemeContext به جای localStorage

**قبل:**

```typescript
const [theme, setTheme] = useState<'light' | 'dark'>(() => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
  return savedTheme || 'dark';
});

useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [theme]);
```

**بعد:**

```typescript
import { useTheme } from '../contexts/ThemeContext';

const { theme, toggleTheme } = useTheme();
// تمام! دیگه نیازی به useState و useEffect نیست
```

### 2. استفاده از Button Component

**قبل:**

```typescript
<button
  onClick={handleSelectPlan}
  disabled={isCurrentPlan}
  className="w-full py-3 px-6 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all"
>
  خرید پلن
</button>
```

**بعد:**

```typescript
import { Button } from '../components/ui';

<Button
  variant="primary"
  fullWidth
  onClick={handleSelectPlan}
  disabled={isCurrentPlan}
>
  خرید پلن
</Button>
```

### 3. استفاده از Card Component

**قبل:**

```typescript
<div className="pricing-card relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden ring-4 ring-purple-500">
  <div className="p-8">
    {/* محتوا */}
  </div>
</div>
```

**بعد:**

```typescript
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui';

<Card variant="elevated" padding="lg" className="ring-4 ring-purple-500">
  <CardHeader title="عنوان" />
  <CardBody>{/* محتوا */}</CardBody>
  <CardFooter>{/* دکمه‌ها */}</CardFooter>
</Card>
```

### 4. استفاده از Badge Component

**قبل:**

```typescript
<span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
  محبوب‌ترین
</span>
```

**بعد:**

```typescript
import { Badge } from '../components/ui';

<Badge variant="success">محبوب‌ترین</Badge>
```

---

## مزایای Migration:

1. کد کمتر (حدود 30-40% کاهش)
2. Consistency بیشتر
3. نگهداری آسان‌تر
4. Dark mode یکپارچه
5. Type-safe
6. قابلیت استفاده مجدد

---

## مراحل Migration برای صفحات دیگر:

### مرحله 1: Import کامپوننت‌ها

```typescript
import { Button, Card, Badge, Input } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';
```

### مرحله 2: جایگزینی دکمه‌ها

```typescript
// پیدا کن: <button className="...">
// جایگزین کن: <Button variant="primary">
```

### مرحله 3: جایگزینی کارت‌ها

```typescript
// پیدا کن: <div className="bg-white dark:bg-slate-800 rounded...">
// جایگزین کن: <Card variant="elevated">
```

### مرحله 4: استفاده از Theme Hook

```typescript
// پیدا کن: localStorage.getItem('theme')
// جایگزین کن: const { theme, toggleTheme } = useTheme();
```

### مرحله 5: تست

- تست Light/Dark mode
- تست Responsive
- تست تمام دکمه‌ها و کارت‌ها

---

## چک‌لیست Migration:

- [ ] ThemeContext به جای useState
- [ ] Button component به جای button
- [ ] Card component به جای div.card
- [ ] Badge component به جای span.badge
- [ ] Input component به جای input
- [ ] تست Dark/Light mode
- [ ] تست Responsive
- [ ] حذف استایل‌های hardcoded

---

**توجه:** PricingPage بعد از migration حدود 200 خط کوتاه‌تر میشه!
