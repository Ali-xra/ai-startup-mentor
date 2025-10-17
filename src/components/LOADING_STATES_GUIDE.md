# راهنمای استفاده از Loading States

سیستم کامل مدیریت حالت‌های loading در پروژه

---

## 📦 کامپوننت‌های موجود

### 1. LoadingSpinner

Spinner با سایزها و رنگ‌های مختلف

```tsx
import { LoadingSpinner } from '@/components/LoadingSpinner';

// استفاده ساده
<LoadingSpinner size="md" variant="primary" />

// با متن
<LoadingSpinner size="lg" text="در حال بارگذاری..." />

// تمام صفحه
<LoadingSpinner fullScreen text="لطفاً صبر کنید..." />
```

**Props:**
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'primary' | 'secondary' | 'white' | 'success' | 'warning' | 'error'
- `fullScreen`: boolean
- `text`: string (optional)

---

### 2. Skeleton Loaders

برای نمایش placeholder در هنگام بارگذاری محتوا

```tsx
import {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonText,
  SkeletonProfile
} from '@/components/SkeletonLoader';

// Skeleton ساده
<Skeleton variant="text" width="100%" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width="100%" height={200} />

// Skeleton آماده برای کارت پروژه
<SkeletonCard />

// Skeleton برای لیست (3 آیتم)
<SkeletonList count={3} />

// Skeleton برای جدول
<SkeletonTable rows={5} cols={4} />

// Skeleton برای متن
<SkeletonText lines={3} />

// Skeleton برای پروفایل
<SkeletonProfile />
```

---

### 3. Progress Bars

نوارهای پیشرفت با انواع مختلف

#### Progress Bar خطی

```tsx
import { ProgressBar } from '@/components/ProgressBar';

// ساده
<ProgressBar value={75} />

// با label
<ProgressBar
  value={50}
  variant="success"
  showLabel
  label="دانلود فایل"
/>

// با نوار راه‌راه و انیمیشن
<ProgressBar
  value={60}
  striped
  animated
  variant="primary"
/>
```

#### Progress دایره‌ای

```tsx
import { CircularProgress } from '@/components/ProgressBar';

<CircularProgress
  value={75}
  size={120}
  variant="primary"
  showLabel
/>
```

#### Progress مرحله‌ای

```tsx
import { StepProgress } from '@/components/ProgressBar';

const steps = [
  { label: 'ایده', description: 'توضیح ایده' },
  { label: 'طراحی', description: 'طراحی اولیه' },
  { label: 'توسعه', description: 'کدنویسی' },
  { label: 'تست', description: 'آزمایش' },
];

<StepProgress steps={steps} currentStep={1} variant="primary" />
```

---

## 🎣 Hooks

### 1. useLoading

برای مدیریت loading state محلی

```tsx
import { useLoading } from '@/hooks/useLoading';

const MyComponent = () => {
  const { isLoading, withLoading, startLoading, stopLoading } = useLoading();

  const fetchData = async () => {
    // روش 1: خودکار
    const data = await withLoading(api.fetchData());

    // روش 2: دستی
    startLoading();
    const data = await api.fetchData();
    stopLoading();
  };

  return (
    <div>
      {isLoading ? <LoadingSpinner /> : <DataDisplay />}
    </div>
  );
};
```

### 2. useMultipleLoading

برای چند loading state مختلف

```tsx
import { useMultipleLoading } from '@/hooks/useLoading';

const MyComponent = () => {
  const loading = useMultipleLoading(['fetch', 'save', 'delete']);

  const fetchData = async () => {
    await loading.withLoading('fetch', api.fetchData());
  };

  const saveData = async () => {
    await loading.withLoading('save', api.saveData());
  };

  return (
    <div>
      {loading.isLoading('fetch') && <LoadingSpinner text="در حال دریافت..." />}
      <button disabled={loading.isLoading('save')}>
        {loading.isLoading('save') ? 'در حال ذخیره...' : 'ذخیره'}
      </button>
    </div>
  );
};
```

### 3. useProgress

برای مدیریت progress

```tsx
import { useProgress } from '@/hooks/useLoading';

const UploadComponent = () => {
  const { progress, setProgress, isComplete, reset } = useProgress();

  const handleUpload = async (file: File) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      const percent = (e.loaded / e.total) * 100;
      setProgress(percent);
    });
    // ... upload logic
  };

  return (
    <div>
      <ProgressBar value={progress} showLabel />
      {isComplete && <p>آپلود کامل شد!</p>}
    </div>
  );
};
```

### 4. useDebouncedLoading

Loading با تاخیر (برای جلوگیری از فلش سریع)

```tsx
import { useDebouncedLoading } from '@/hooks/useLoading';

const QuickComponent = () => {
  // اگر عملیات کمتر از 200ms طول بکشد، loading نمایش داده نمی‌شود
  const { isLoading, withLoading } = useDebouncedLoading(200);

  const quickFetch = async () => {
    await withLoading(api.quickFetch());
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};
```

---

## 🌍 Global Loading (Context)

برای loading state سراسری در تمام اپلیکیشن

### Setup

```tsx
// در فایل اصلی (main.tsx یا App.tsx)
import { LoadingProvider } from '@/contexts/LoadingContext';

<LoadingProvider>
  <App />
</LoadingProvider>
```

### استفاده

```tsx
import { useLoadingContext } from '@/contexts/LoadingContext';

const MyComponent = () => {
  const { showLoading, hideLoading, withLoading } = useLoadingContext();

  const fetchData = async () => {
    // روش 1: دستی
    showLoading('در حال بارگذاری داده‌ها...');
    await api.fetchData();
    hideLoading();

    // روش 2: خودکار
    await withLoading(
      api.fetchData(),
      'در حال بارگذاری داده‌ها...'
    );
  };

  return <button onClick={fetchData}>بارگذاری</button>;
};
```

**مزایا:**
- Loading تمام صفحه به طور خودکار نمایش داده می‌شود
- یک loading state واحد برای کل اپلیکیشن
- کاربر نمی‌تواند با UI تعامل کند در حین loading

---

## 📝 مثال‌های کامل

### مثال 1: صفحه لیست پروژه‌ها

```tsx
import { useLoading } from '@/hooks/useLoading';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SkeletonCard } from '@/components/SkeletonLoader';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const { isLoading, withLoading } = useLoading({ initialLoading: true });

  useEffect(() => {
    const loadProjects = async () => {
      const data = await withLoading(api.getProjects());
      setProjects(data);
    };
    loadProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
```

### مثال 2: فرم با Multiple Loading States

```tsx
import { useMultipleLoading } from '@/hooks/useLoading';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const ProjectForm = () => {
  const loading = useMultipleLoading(['save', 'delete', 'export']);

  const handleSave = async () => {
    await loading.withLoading('save', api.saveProject(data));
    alert('ذخیره شد');
  };

  const handleDelete = async () => {
    await loading.withLoading('delete', api.deleteProject(id));
  };

  const handleExport = async () => {
    await loading.withLoading('export', api.exportProject(id));
  };

  return (
    <div>
      <button
        onClick={handleSave}
        disabled={loading.isAnyLoading()}
      >
        {loading.isLoading('save') ? (
          <>
            <LoadingSpinner size="sm" variant="white" />
            در حال ذخیره...
          </>
        ) : (
          'ذخیره'
        )}
      </button>

      <button
        onClick={handleDelete}
        disabled={loading.isAnyLoading()}
      >
        {loading.isLoading('delete') ? 'در حال حذف...' : 'حذف'}
      </button>

      <button
        onClick={handleExport}
        disabled={loading.isAnyLoading()}
      >
        {loading.isLoading('export') ? 'در حال خروجی...' : 'خروجی'}
      </button>
    </div>
  );
};
```

### مثال 3: آپلود فایل با Progress

```tsx
import { useProgress } from '@/hooks/useLoading';
import { ProgressBar, CircularProgress } from '@/components/ProgressBar';

const FileUpload = () => {
  const { progress, setProgress, isComplete, reset } = useProgress();

  const handleUpload = async (file: File) => {
    reset();

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        setProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        alert('آپلود موفق!');
      }
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />

      {progress > 0 && !isComplete && (
        <div className="mt-4">
          <ProgressBar
            value={progress}
            showLabel
            label="در حال آپلود"
            variant="primary"
            animated
          />

          <div className="mt-4 flex justify-center">
            <CircularProgress value={progress} size={100} />
          </div>
        </div>
      )}

      {isComplete && (
        <p className="text-green-600 mt-4">✓ آپلود با موفقیت انجام شد</p>
      )}
    </div>
  );
};
```

### مثال 4: Wizard با Step Progress

```tsx
import { useState } from 'react';
import { StepProgress } from '@/components/ProgressBar';
import { useLoading } from '@/hooks/useLoading';

const StartupWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { isLoading, withLoading } = useLoading();

  const steps = [
    { label: 'ایده', description: 'توضیح ایده خود' },
    { label: 'بازار', description: 'تحلیل بازار' },
    { label: 'رقبا', description: 'تحلیل رقبا' },
    { label: 'مدل درآمد', description: 'مدل کسب درآمد' },
    { label: 'تیم', description: 'اعضای تیم' },
  ];

  const handleNext = async () => {
    await withLoading(
      api.saveStep(currentStep, formData)
    );
    setCurrentStep(prev => prev + 1);
  };

  return (
    <div>
      <StepProgress
        steps={steps}
        currentStep={currentStep}
        variant="primary"
      />

      <div className="mt-8">
        {/* Form content for current step */}
      </div>

      <button onClick={handleNext} disabled={isLoading}>
        {isLoading ? 'در حال ذخیره...' : 'مرحله بعد'}
      </button>
    </div>
  );
};
```

---

## 🎨 بهترین شیوه‌ها (Best Practices)

### 1. انتخاب درست نوع Loading

- **Spinner**: برای عملیات‌های کوتاه (< 3 ثانیه)
- **Skeleton**: برای بارگذاری محتوا و لیست‌ها
- **Progress Bar**: برای عملیات‌های طولانی با progress قابل اندازه‌گیری
- **Global Loading**: برای عملیات‌های critical که کاربر نباید تعامل کند

### 2. Debouncing برای عملیات سریع

```tsx
// اگر API کمتر از 200ms طول بکشد، loading نشان نده
const { isLoading, withLoading } = useDebouncedLoading(200);
```

### 3. Multiple Loading States

برای فرم‌هایی با چند action:

```tsx
const loading = useMultipleLoading(['save', 'delete', 'export']);
// هر action loading state جداگانه دارد
```

### 4. Skeleton Loaders برای UX بهتر

به جای spinner خالی، skeleton استفاده کنید:

```tsx
// ❌ بد
{isLoading ? <LoadingSpinner /> : <ProjectList />}

// ✅ خوب
{isLoading ? <SkeletonCard /> : <ProjectList />}
```

### 5. Disable کردن دکمه‌ها در حین Loading

```tsx
<button disabled={isLoading || isSaving}>
  {isLoading ? 'در حال بارگذاری...' : 'ذخیره'}
</button>
```

---

## 🔧 تنظیمات CSS

برای انیمیشن‌های stripe و wave، این CSS را اضافه کنید (در index.css):

```css
@keyframes wave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes progress {
  0% { background-position: 0 0; }
  100% { background-position: 40px 40px; }
}

.bg-stripe {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 40px 40px;
}

.animate-wave {
  animation: wave 2s linear infinite;
}

.animate-progress {
  animation: progress 2s linear infinite;
}
```

---

**تمام کامپوننت‌ها و hooks آماده استفاده هستند! 🎉**
