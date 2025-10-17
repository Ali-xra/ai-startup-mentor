# 🔐 راهنمای راه‌اندازی پنل ادمین

## 📋 مراحل نصب

### مرحله 1: اجرای اسکریپت SQL در Supabase

1. وارد پنل Supabase شوید: https://supabase.com/dashboard
2. پروژه خود را انتخاب کنید
3. از منوی سمت چپ، روی **SQL Editor** کلیک کنید
4. فایل `supabase/schema_admin.sql` را باز کنید
5. تمام محتوای آن را کپی کرده و در SQL Editor پیست کنید
6. روی **Run** کلیک کنید

✅ این اسکریپت جداول زیر را ایجاد می‌کند:
- `feature_flags`: تعریف فیچرهای سیستم
- `user_features`: فیچرهای اختصاص داده شده به هر کاربر
- `admins`: لیست ادمین‌ها
- `admin_audit_log`: لاگ تغییرات ادمین‌ها

---

### مرحله 2: اضافه کردن اولین Super Admin

1. ابتدا یک اکانت کاربری در سیستم بسازید (ثبت‌نام معمولی)
2. از پنل Supabase، بخش **Authentication** > **Users** بروید
3. User ID خودتان را کپی کنید (یک UUID مثل: `a1b2c3d4-...`)
4. در **SQL Editor** این دستور را اجرا کنید:

```sql
INSERT INTO admins (user_id, email, role, is_active)
VALUES (
    'YOUR_USER_ID_HERE',  -- جایگزین کنید
    'your-email@example.com',  -- جایگزین کنید
    'super_admin',
    true
);
```

✅ حالا شما Super Admin شدید!

---

### مرحله 3: دسترسی به پنل ادمین

پنل ادمین در آدرس زیر قرار دارد:

```
http://localhost:5175/admin.html
```

یا در production:

```
https://yourdomain.com/admin.html
```

**لاگین:**
- از همان ایمیل و پسوردی که در مرحله 2 ساختید استفاده کنید
- اگر ادمین نباشید، پیام "Access Denied" نمایش داده می‌شود

---

## 🎛️ استفاده از پنل ادمین

### 1️⃣ مدیریت فیچرهای کاربران

#### جستجوی کاربر:
1. از تب **"مدیریت کاربران"** استفاده کنید
2. ایمیل کاربر را در باکس جستجو وارد کنید
3. روی **جستجو** کلیک کنید

#### فعال/غیرفعال کردن فیچرها:
- روی هر checkbox کلیک کنید تا فیچر فعال/غیرفعال شود
- تغییرات فوری اعمال می‌شود

#### اختصاص پلن سریع:
- از دکمه‌های **Free**, **Starter**, **Pro**, **Enterprise** استفاده کنید
- تمام فیچرهای آن پلن به صورت خودکار فعال می‌شود

---

### 2️⃣ پلن‌های موجود

| Plan | تعداد پروژه | AI Messages | Team Sharing | Export | Phases |
|------|------------|-------------|--------------|--------|---------|
| **Free** | 1 | 50 | ❌ | ❌ | تا مرحله 3 |
| **Starter** | 3 | 500 | 2 نفر | Basic | همه مراحل |
| **Pro** | نامحدود | 2000 | 10 نفر | Advanced | همه مراحل |
| **Enterprise** | نامحدود | نامحدود | نامحدود | Advanced | همه مراحل |

---

### 3️⃣ دسته‌بندی فیچرها

#### 📁 **Projects (پروژه‌ها)**
- `unlimited_projects`: پروژه‌های نامحدود
- `max_projects_3`: حداکثر 3 پروژه
- `max_projects_1`: حداکثر 1 پروژه (Free)

#### 🤖 **AI**
- `unlimited_ai`: پیام‌های AI نامحدود
- `ai_credits_2000`: 2000 پیام در ماه
- `ai_credits_500`: 500 پیام در ماه
- `ai_credits_50`: 50 پیام در ماه (Free)

#### 👥 **Team (اشتراک‌گذاری)**
- `team_sharing_unlimited`: اشتراک نامحدود
- `team_sharing_10`: اشتراک با 10 نفر
- `team_sharing_2`: اشتراک با 2 نفر
- `team_sharing_disabled`: بدون اشتراک (Free)

#### 📤 **Export**
- `export_advanced`: Export به React, Vue, Next.js
- `export_basic`: Export به HTML/CSS/JS
- `export_disabled`: بدون Export (Free)

#### 🎯 **Phases (مراحل)**
- `all_phases`: دسترسی به همه 8 مرحله
- `phase_5_limit`: دسترسی تا مرحله 5
- `phase_3_limit`: دسترسی تا مرحله 3 (Free)

#### 💾 **Storage (ذخیره‌سازی)**
- `storage_unlimited`: فضای نامحدود
- `storage_5gb`: 5 گیگابایت
- `storage_500mb`: 500 مگابایت
- `storage_50mb`: 50 مگابایت (Free)

---

## 🔄 سناریوی معمولی فروش

### وقتی کاربر می‌خواد پلن بخره:

1. **کاربر با شما تماس می‌گیره** (تلگرام، ایمیل، واتساپ)
2. **پرداخت دستی انجام میشه** (کارت به کارت یا درگاه)
3. **شما وارد پنل ادمین می‌شید**
4. **ایمیل کاربر رو جستجو می‌کنید**
5. **روی دکمه پلن مورد نظر کلیک می‌کنید** (مثلاً Pro)
6. **کاربر فوری دسترسی پیدا می‌کنه!** ✅

---

## 🛠️ نکات فنی

### چک کردن Feature Flags در کد

```typescript
import { useFeatureFlags } from './hooks/useFeatureFlags';

const MyComponent = () => {
    const {
        maxProjects,
        aiCredits,
        maxTeamMembers,
        planName
    } = useFeatureFlags();

    console.log(maxProjects); // 1, 3, یا Infinity
    console.log(planName); // "Free", "Starter", "Pro", "Enterprise"
};
```

### محدود کردن تعداد پروژه:

```typescript
const canCreateProject = projects.length < maxProjects;

if (!canCreateProject) {
    alert('شما به حداکثر تعداد پروژه رسیده‌اید. برای افزایش، پلن خود را ارتقا دهید.');
    return;
}
```

### محدود کردن AI Credits:

```typescript
const [aiUsage, setAiUsage] = useState(0);

const sendAIMessage = async () => {
    if (aiUsage >= aiCredits) {
        alert('اعتبار پیام‌های AI شما تمام شده است.');
        return;
    }

    // ارسال پیام...
    setAiUsage(aiUsage + 1);
};
```

---

## 🔒 امنیت

### Row Level Security (RLS)

تمام جداول با RLS محافظت شده‌اند:

- ✅ فقط ادمین‌ها می‌توانند `feature_flags` را ببینند
- ✅ فقط ادمین‌ها می‌توانند `user_features` را ویرایش کنند
- ✅ کاربران عادی فقط فیچرهای خودشان را می‌بینند
- ✅ فقط Super Admin‌ها می‌توانند ادمین جدید اضافه کنند

### Audit Log

تمام تغییرات ادمین‌ها در جدول `admin_audit_log` ثبت می‌شود:

```sql
SELECT * FROM admin_audit_log
ORDER BY created_at DESC
LIMIT 50;
```

---

## 🚀 بعداً چی اضافه می‌شه؟

### فاز 2: اتوماتیک‌سازی (ماه بعد)
- ✅ یکپارچه‌سازی با درگاه پرداخت (Stripe, زرین‌پال)
- ✅ فعال‌سازی خودکار بعد از پرداخت
- ✅ ایمیل نوتیفیکیشن
- ✅ صفحه Pricing برای کاربران

### فاز 3: پیشرفته (2-3 ماه بعد)
- ✅ Dashboard با آمار واقعی
- ✅ گزارشات فروش
- ✅ مدیریت کوپن تخفیف
- ✅ اشتراک ماهانه/سالانه با تمدید خودکار

---

## ❓ سوالات متداول

### چطوری یک کاربر رو به Free plan برگردونم؟
روی دکمه **Free** در کنار اطلاعات کاربر کلیک کنید.

### چطوری یک فیچر رو برای همه فعال کنم؟
از تب **"تنظیمات Global"** استفاده کنید (به زودی فعال می‌شود).

### چطوری یک ادمین جدید اضافه کنم؟
فقط Super Admin‌ها می‌توانند ادمین اضافه کنند:

```sql
INSERT INTO admins (user_id, email, role)
VALUES ('USER_ID', 'email@example.com', 'admin');
```

### اگر کاربری پول پرداخت کرد ولی فیچر فعال نشد؟
1. مطمئن شوید ایمیل صحیح است
2. چک کنید که در جدول `user_features` رکورد درست ثبت شده
3. از تابع `refreshFeatures()` استفاده کنید:

```typescript
const { refreshFeatures } = useFeatureFlags();
await refreshFeatures();
```

---

## 📞 پشتیبانی

اگر مشکلی پیش اومد:
1. لاگ‌های browser console رو چک کنید
2. در Supabase، بخش **Logs** رو ببینید
3. جدول `admin_audit_log` رو بررسی کنید

---

✅ **پنل ادمین آماده است!** حالا می‌توانید شروع به فروش و مدیریت کاربران کنید! 🎉
