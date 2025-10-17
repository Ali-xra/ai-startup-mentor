# رفع خطاهای Upgrade Request System

## مشکلات قبلی:
1. **406 Not Acceptable** - هنگام چک کردن pending request
2. **500 Internal Server Error** - هنگام ساخت درخواست جدید
3. لیست درخواست‌ها در پنل ادمین خالی بود

## علت اصلی مشکل:
استفاده از `.single()` به جای `.maybeSingle()` در فایل `services/upgradeRequestService.ts`

### توضیح:
- `.single()` انتظار دارد دقیقاً یک ردیف برگردد
- اگر هیچ ردیفی وجود نداشته باشد، خطای PGRST116 می‌دهد
- اگر بیش از یک ردیف وجود داشته باشد، خطای 406 می‌دهد
- `.maybeSingle()` می‌تواند صفر یا یک ردیف برگرداند (مناسب‌تر برای این حالت)

## تغییرات انجام شده:

### 1. تابع `createUpgradeRequest` (خط 13-28):
```typescript
// قبل:
.single();
if (checkError && checkError.code !== 'PGRST116') {
    throw checkError;
}

// بعد:
.maybeSingle(); // Use maybeSingle instead of single to avoid PGRST116 error
if (checkError) {
    throw checkError;
}
```

### 2. تابع `hasPendingRequest` (خط 62-76):
```typescript
// قبل:
.single();
if (error && error.code !== 'PGRST116') {
    console.error('Error checking pending request:', error);
    return false;
}

// بعد:
.maybeSingle(); // Use maybeSingle to handle zero or one row
if (error) {
    console.error('Error checking pending request:', error);
    return false;
}
```

## نتیجه:
✅ خطای 406 رفع شد
✅ خطای 500 رفع شد
✅ سیستم upgrade request کامل کار می‌کند

## تست:
1. کاربر Free وارد می‌شود
2. تلاش برای ساخت پروژه دوم یا دسترسی به Phase 2 می‌کند
3. مودال محدودیت نمایش داده می‌شود
4. دکمه "Request Upgrade" کلیک می‌شود
5. درخواست با موفقیت ثبت می‌شود
6. پیام موفقیت نمایش داده می‌شود
7. در پنل ادمین، درخواست قابل مشاهده است

## توجه:
خطای 403 در `/auth/v1/user` مشکل جداگانه‌ای است و مربوط به permission های Supabase Auth می‌باشد، نه سیستم upgrade_requests.
