# بهبودهای پنل ادمین - Feature Management

## مشکل قبلی:
در قسمت "مدیریت کاربران" پنل ادمین، دکمه‌های انتخاب پلن به صورت دکمه‌های جداگانه بودند که می‌توانستند به مشکلات زیر منجر شوند:
- کاربر می‌توانست چندین پلن مختلف را پشت سر هم کلیک کند
- نمایش پلن فعلی کاربر وجود نداشت
- UI کاربرپسند نبود (دکمه‌های جدا از هم)

## تغییرات اعمال شده:

### 1. تغییر UI از دکمه‌های جداگانه به Radio Buttons
**فایل:** `components/admin/FeatureManagement.tsx`

قبل:
```tsx
<button onClick={() => handleGrantPlan(userData.id, 'free')}>Free</button>
<button onClick={() => handleGrantPlan(userData.id, 'starter')}>Starter</button>
<button onClick={() => handleGrantPlan(userData.id, 'pro')}>Pro</button>
<button onClick={() => handleGrantPlan(userData.id, 'enterprise')}>Enterprise</button>
```

بعد:
```tsx
{(['free', 'starter', 'pro', 'enterprise'] as const).map((planName) => (
    <label className="flex items-center gap-2 p-3 rounded-lg cursor-pointer">
        <input
            type="radio"
            name={`plan-${userData.id}`}
            value={planName}
            checked={userData.current_plan === planName}
            onChange={() => handleGrantPlan(userData.id, planName)}
        />
        <span>{planName}</span>
    </label>
))}
```

### 2. نمایش پلن فعلی کاربر
اضافه شدن بخش جدید که پلن فعلی و تاریخ انقضا را نمایش می‌دهد:
```tsx
<div className="mb-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
    <p className="text-sm">پلن فعلی:</p>
    <span className="px-3 py-1 rounded-full">{userData.current_plan || 'free'}</span>
    {userData.plan_expires_at && (
        <span>انقضا: {new Date(userData.plan_expires_at).toLocaleDateString('fa-IR')}</span>
    )}
</div>
```

### 3. اضافه کردن فیلدهای جدید به Type
**فایل:** `types.ts`

```typescript
export interface UserWithFeatures {
    id: string;
    email: string;
    created_at: string;
    features: UserFeature[];
    current_plan?: string;        // ✅ جدید
    plan_expires_at?: string;     // ✅ جدید
}
```

### 4. تشخیص خودکار پلن کاربر
**فایل:** `services/featureFlagsService.ts`

اضافه شدن تابع `detectUserPlan` که بر اساس فیچرهای فعال کاربر، پلن او را تشخیص می‌دهد:

```typescript
detectUserPlan(features: any[]): string {
    const featureKeys = features
        .filter(f => f.is_enabled)
        .map(f => f.feature_key);

    // Enterprise: unlimited AI
    if (featureKeys.includes(FeatureKey.UNLIMITED_AI)) {
        return 'enterprise';
    }

    // Pro: unlimited projects
    if (featureKeys.includes(FeatureKey.UNLIMITED_PROJECTS)) {
        return 'pro';
    }

    // Starter: 3 projects
    if (featureKeys.includes(FeatureKey.MAX_PROJECTS_3)) {
        return 'starter';
    }

    // Default: free
    return 'free';
}
```

## نتیجه:

✅ **UI بهبود یافته**: Radio button به جای دکمه‌های مجزا
✅ **نمایش پلن فعلی**: ادمین می‌تواند ببیند کاربر الان چه پلنی دارد
✅ **نمایش تاریخ انقضا**: اگر پلن محدود به زمان باشد، تاریخ انقضا نمایش داده می‌شود
✅ **جلوگیری از خطا**: فقط یک پلن قابل انتخاب است (radio button)
✅ **تشخیص خودکار**: پلن فعلی بر اساس فیچرهای فعال تشخیص داده می‌شود

## استفاده:

1. وارد پنل ادمین شوید
2. به تب "Feature Management" بروید
3. به قسمت "مدیریت کاربران" بروید
4. User ID کاربر را جستجو کنید
5. پلن فعلی کاربر نمایش داده می‌شود
6. برای تغییر پلن، از radio button استفاده کنید
7. تغییرات به صورت خودکار اعمال می‌شود

## توجه:
- هر بار که پلن عوض می‌شود، تمام فیچرهای مربوط به آن پلن فعال می‌شوند
- تاریخ انقضا از `upgrade_requests` گرفته می‌شود (برای پلن‌های Beta)
- پلن Free هیچ تاریخ انقضایی ندارد
