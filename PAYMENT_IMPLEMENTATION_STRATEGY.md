# استراتژی پیاده‌سازی سیستم پرداخت

## راهنمای جامع برای AI Startup Mentor

---

## 🎯 **تحلیل وضعیت فعلی**

### ✅ **چیزهایی که الان دارید (خیلی خوبه!):**

```typescript
✅ معماری Supabase (PostgreSQL + Auth + RLS)
✅ Feature Flags System (کامل و حرفه‌ای!)
✅ User Authentication & Authorization
✅ Plan Management (Free, Starter, Pro, Enterprise)
✅ Admin Panel برای مدیریت کاربران
✅ Audit Log برای ردیابی تغییرات
✅ React + TypeScript (Type-safe)
✅ Multi-language (FA/EN)
```

### 📊 **ساختار فعلی دیتابیس شما:**

```
Tables موجود:
├── auth.users              ✅ Authentication
├── profiles                ✅ User profiles
├── projects                ✅ Startup projects
├── feature_flags           ✅ Feature definitions
├── user_features           ✅ User's enabled features
├── admin_audit_log         ✅ Admin actions tracking
├── upgrade_requests        ✅ Upgrade requests
└── public_projects         ✅ Marketplace
```

### 🎉 **نتیجه‌گیری:**

**معماری شما 100% آماده برای اضافه کردن سیستم پرداخت است!**

شما فقط باید این جدول‌ها رو اضافه کنید:

- `subscriptions` - مدیریت اشتراک‌ها
- `transactions` - تراکنش‌های مالی
- `invoices` - فاکتورها (اختیاری برای فاز 2)

---

## 🏗️ **معماری پیشنهادی: مرحله‌به‌مرحله**

### **فاز 0: آماده‌سازی (الان - قبل از شروع)**

```
کارهایی که باید انجام بدید:
✅ خواندن این سند
✅ تصمیم‌گیری درباره درگاه پرداخت
✅ ثبت‌نام در زرین‌پال (1-2 روز کاری)
□ دریافت Merchant ID از زرین‌پال
□ تنظیم متغیرهای محیطی (.env)
```

---

### **فاز 1: MVP - پرداخت ایرانی (هفته 1-2)** 🇮🇷

#### مرحله 1.1: ایجاد جدول‌های دیتابیس

```sql
-- در Supabase SQL Editor اجرا کنید:

-- جدول اشتراک‌ها
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL, -- 'free', 'starter', 'pro', 'enterprise'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'expired', 'trial'
  payment_provider TEXT, -- 'zarinpal', 'stripe', 'manual'

  -- زمان‌ها
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,

  -- پرداخت
  billing_cycle TEXT, -- 'monthly', 'yearly'
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'IRR', -- 'USD', 'IRR'

  -- شناسه‌های خارجی
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  zarinpal_authority TEXT,

  -- متادیتا
  metadata JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول تراکنش‌ها
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- اطلاعات پرداخت
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'IRR',
  payment_provider TEXT NOT NULL,
  payment_method TEXT, -- 'card', 'bank', 'crypto'

  -- وضعیت
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'

  -- شناسه‌های خارجی
  provider_transaction_id TEXT,
  provider_payment_id TEXT,
  provider_reference_id TEXT, -- RefID from ZarinPal

  -- جزئیات کارت (4 رقم آخر)
  card_pan TEXT,

  -- متادیتا
  description TEXT,
  metadata JSONB,
  error_message TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایندکس‌ها برای performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires_at ON subscriptions(expires_at);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_subscription_id ON transactions(subscription_id);

-- Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies: فقط خود کاربر می‌تونه اشتراکش رو ببینه
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Admin می‌تونه همه رو ببینه
CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

#### مرحله 1.2: افزودن سرویس‌های پرداخت

ساختار فایل‌ها:

```
src/
└── services/
    ├── payment/
    │   ├── types.ts                    # تایپ‌های TypeScript
    │   ├── zarinpal.service.ts         # سرویس زرین‌پال
    │   ├── payment.service.ts          # سرویس اصلی
    │   └── config.ts                   # تنظیمات
    └── subscription/
        ├── subscription.service.ts     # مدیریت اشتراک
        └── plans.config.ts             # تعریف پلن‌ها
```

#### مرحله 1.3: افزودن کامپوننت‌های UI

```
src/
└── components/
    └── payment/
        ├── CheckoutButton.tsx          # دکمه پرداخت
        ├── PaymentModal.tsx            # مودال انتخاب روش پرداخت
        └── SubscriptionCard.tsx        # کارت نمایش اشتراک
```

#### مرحله 1.4: صفحه Callback

```typescript
// src/pages/payment/CallbackPage.tsx
// این صفحه بعد از پرداخت باز می‌شه
```

---

### **فاز 2: بهبود و خودکارسازی (هفته 3-4)**

```
✅ Webhook برای زرین‌پال (اگر ساپورت کنه)
✅ Email notifications بعد از پرداخت
✅ CRON Job برای چک کردن اشتراک‌های منقضی شده
✅ داشبورد مدیریت اشتراک برای کاربر
✅ تاریخچه تراکنش‌ها
✅ دانلود فاکتور (PDF)
```

---

### **فاز 3: پرداخت بین‌المللی (ماه 2-3)** 🌍

```
⏳ ثبت شرکت خارجی (LLC)
⏳ ثبت‌نام در Stripe یا LemonSqueezy
⏳ تشخیص خودکار موقعیت کاربر (Geolocation)
⏳ انتخاب خودکار درگاه مناسب
⏳ پشتیبانی از چند ارز (USD, EUR, IRR)
```

---

### **فاز 4: قابلیت‌های پیشرفته (ماه 4+)**

```
⏳ کوپن تخفیف
⏳ پرداخت کریپتو (برای کاربران ایرانی در خارج)
⏳ برنامه Affiliate/Referral
⏳ Trial period (دوره آزمایشی)
⏳ Proration (محاسبه نسبی هنگام تغییر پلن)
```

---

## 📱 **استراتژی موبایل: Web vs Native**

### گزینه 1: PWA (Progressive Web App) ⭐ توصیه می‌شه

**مزایا:**

- همین کد React فعلی رو استفاده می‌کنید
- یک codebase برای همه پلتفرم‌ها
- نصب مستقیم روی موبایل (بدون App Store)
- به‌روزرسانی آسان (بدون نیاز به approve)

**معایب:**

- دسترسی محدود به قابلیت‌های Native
- نیاز به اینترنت

**پیاده‌سازی:**

```typescript
// 1. اضافه کردن Service Worker
// 2. تنظیم manifest.json
// 3. بهینه‌سازی برای موبایل
// 4. افزودن offline support
```

### گزینه 2: React Native

**مزایا:**

- دسترسی کامل به Native APIs
- عملکرد بهتر
- App Store presence

**معایب:**

- نیاز به کد جداگانه
- تیم توسعه جداگانه
- هزینه بیشتر

**توصیه من:**

```
📱 فاز 1: PWA (همین الان)
📱 فاز 2: React Native (بعد از 6 ماه اگر نیاز بود)
```

---

## 💰 **مدل درآمدی پیشنهادی**

### قیمت‌گذاری فعلی شما:

| پلن        | ماهانه | سالانه | صرفه‌جویی    |
| ---------- | ------ | ------ | ------------ |
| Free       | $0     | $0     | -            |
| Starter    | $29    | $290   | $58 (2 ماه)  |
| Pro        | $79    | $790   | $158 (2 ماه) |
| Enterprise | $199   | $1990  | $398 (2 ماه) |

### معادل تومانی (با نرخ 55,000 تومان):

| پلن        | ماهانه           | سالانه            |
| ---------- | ---------------- | ----------------- |
| Starter    | 1,595,000 تومان  | 15,950,000 تومان  |
| Pro        | 4,345,000 تومان  | 43,450,000 تومان  |
| Enterprise | 10,945,000 تومان | 109,450,000 تومان |

### 🎯 **استراتژی قیمت‌گذاری دو کشوری:**

#### برای بازار ایران:

```
Starter:  990,000 تومان/ماه یا 9,900,000/سال
Pro:      2,490,000 تومان/ماه یا 24,900,000/سال
Enterprise: تماس برای قیمت
```

#### برای بازار بین‌الملل:

```
Starter:  $29/mo یا $290/yr
Pro:      $79/mo یا $790/yr
Enterprise: $199/mo یا $1990/yr
```

---

## 🔐 **امنیت و Compliance**

### چک‌لیست امنیتی:

```
✅ HTTPS برای تمام درخواست‌ها
✅ Environment Variables برای API Keys
✅ Row Level Security (RLS) در Supabase
✅ Validation در Backend (نه فقط Frontend)
✅ Rate Limiting برای API calls
✅ Logging تمام تراکنش‌ها
✅ Webhook Signature Verification
✅ PCI DSS Compliance (درگاه پرداخت این رو هندل می‌کنه)
```

### حفاظت از اطلاعات کاربران:

```typescript
❌ NEVER store: CVV2, کارت کامل, رمز عبور
✅ OK to store: 4 رقم آخر کارت, RefID, Transaction ID
```

---

## 🧪 **استراتژی تست**

### مرحله 1: محیط Sandbox

```bash
✅ تست با Merchant ID تستی زرین‌پال
✅ کارت‌های تستی
✅ تراکنش‌های فیک
```

### مرحله 2: Beta Testing

```bash
✅ انتخاب 10-20 کاربر واقعی
✅ تخفیف 50% برای Beta Testers
✅ جمع‌آوری Feedback
```

### مرحله 3: Soft Launch

```bash
✅ فعال‌سازی برای کاربران جدید
✅ مانیتورینگ 24/7
✅ آماده‌باش برای رفع باگ
```

### مرحله 4: Full Launch

```bash
🎉 اعلام رسمی
🎉 کمپین بازاریابی
🎉 پشتیبانی کامل
```

---

## 📊 **مانیتورینگ و Analytics**

### KPI های مهم:

```
💰 MRR (Monthly Recurring Revenue)
💰 ARR (Annual Recurring Revenue)
📈 Conversion Rate (Free → Paid)
📉 Churn Rate (نرخ ترک)
💳 Average Transaction Value
⏱️ Time to First Purchase
🔄 Upgrade/Downgrade Rate
```

### ابزارهای پیشنهادی:

```
📊 Google Analytics - رفتار کاربران
📊 Mixpanel - Product Analytics
📊 Sentry - Error Tracking
📊 Supabase Dashboard - Database monitoring
```

---

## 🚀 **استراتژی Go-to-Market**

### Pre-Launch (2 هفته قبل):

```
📣 اعلام قیمت‌ها در سایت
📣 Early Bird Discount (20% off)
📣 بلاگ پست درباره ویژگی‌های جدید
📣 ایمیل به کاربران فعلی
```

### Launch Day:

```
🎉 فعال‌سازی سیستم پرداخت
🎉 پست در شبکه‌های اجتماعی
🎉 پشتیبانی آنلاین 24 ساعته
🎉 مانیتورینگ لحظه‌ای
```

### Post-Launch (1 ماه بعد):

```
📈 تحلیل داده‌ها
📈 جمع‌آوری نظرات
📈 بهینه‌سازی
📈 برنامه‌ریزی برای فاز بعدی
```

---

## ❓ **سوالات متداول فنی**

### Q1: آیا باید همه چیز رو از اول بنویسم؟

**پاسخ:** خیر! معماری فعلی شما عالیه. فقط باید:

1. 2 جدول به دیتابیس اضافه کنید (10 دقیقه)
2. سرویس پرداخت بنویسید (2-3 ساعت)
3. UI کامپوننت‌ها اضافه کنید (1 روز)
4. صفحه Callback بسازید (2-3 ساعت)

### Q2: Feature Flags فعلی من چی میشه؟

**پاسخ:** دقیقاً همون‌طور که الان هست کار می‌کنه! فقط بعد از پرداخت موفق، شما `grantPlan()` رو صدا می‌زنید و همه فیچرهای پلن به کاربر داده میشه.

### Q3: چطور از Duplicate Purchase جلوگیری کنم؟

**پاسخ:**

```typescript
// قبل از redirect به درگاه:
const activeSubscription = await getActiveSubscription(userId);
if (activeSubscription && activeSubscription.plan_id === planId) {
  throw new Error('Already subscribed to this plan');
}
```

### Q4: چطور Refund رو هندل کنم؟

**پاسخ:**

```typescript
// 1. تغییر status تراکنش به 'refunded'
// 2. تغییر status اشتراک به 'canceled'
// 3. غیرفعال کردن فیچرها با revokeAllFeatures()
// 4. Log در audit_log
```

### Q5: اگر کاربر پرداخت کنه ولی Callback fail بشه؟

**پاسخ:** چند راه حل:

1. **Webhook** (بهترین): زرین‌پال خودش به شما اطلاع میده
2. **CRON Job**: هر 10 دقیقه تراکنش‌های pending رو چک کن
3. **Manual Verification**: ادمین می‌تونه RefID رو چک کنه

---

## 🎯 **چک‌لیست اجرایی**

### هفته 1: آماده‌سازی

- [ ] ثبت‌نام در زرین‌پال
- [ ] دریافت Merchant ID
- [ ] اضافه کردن جدول‌ها به Supabase
- [ ] تنظیم Environment Variables
- [ ] نصب پکیج‌های لازم

### هفته 2: Development

- [ ] نوشتن سرویس زرین‌پال
- [ ] نوشتن سرویس Subscription
- [ ] ساخت UI کامپوننت‌ها
- [ ] ساخت صفحه Callback
- [ ] اتصال به PricingPage

### هفته 3: Testing

- [ ] تست در Sandbox
- [ ] تست سناریوهای مختلف
- [ ] تست با کاربران Beta
- [ ] رفع باگ‌ها
- [ ] بهینه‌سازی Performance

### هفته 4: Launch

- [ ] Switch به Production
- [ ] مانیتورینگ
- [ ] پشتیبانی
- [ ] جمع‌آوری Feedback

---

## 💡 **نکات طلایی**

### 1. **شروع کوچک، رشد تدریجی**

```
✅ ابتدا فقط زرین‌پال
✅ بعد Stripe
✅ بعد قابلیت‌های پیشرفته
```

### 2. **تست، تست، تست**

```
هر قابلیت رو 3 بار تست کن:
1. Sandbox
2. Beta Users
3. Production (با مانیتورینگ)
```

### 3. **امنیت اولویت اول**

```
❌ هیچ‌وقت API Key رو commit نکن
❌ هیچ‌وقت اطلاعات کارت ذخیره نکن
✅ همیشه HTTPS استفاده کن
✅ همیشه validate کن
```

### 4. **مستندات بنویس**

```
📝 چطور پرداخت کنیم؟
📝 چطور فاکتور بگیریم؟
📝 چطور اشتراک لغو کنیم?
📝 پشتیبانی چطوری؟
```

### 5. **پشتیبانی سریع**

```
⏱️ مشکلات پرداخت = اولویت 1
⏱️ پاسخ حداکثر 2 ساعت
⏱️ رفع باگ حداکثر 24 ساعت
```

---

## 🎓 **منابع یادگیری**

### زرین‌پال:

- [مستندات رسمی](https://www.zarinpal.com/docs/)
- [API Reference](https://www.zarinpal.com/docs/paymentGateway/)
- [ویدیوهای آموزشی](https://www.aparat.com/zarinpal)

### Stripe (برای آینده):

- [Stripe Docs](https://stripe.com/docs)
- [Stripe + React](https://stripe.com/docs/stripe-js/react)
- [Stripe Webhook](https://stripe.com/docs/webhooks)

### Supabase:

- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

---

## 🎉 **جمع‌بندی**

### ✅ **شما الان دارید:**

- معماری قوی و مقیاس‌پذیر
- Feature Flags System حرفه‌ای
- Authentication & Authorization
- Admin Panel

### 🚀 **قدم بعدی:**

- اضافه کردن 2 جدول (subscriptions, transactions)
- پیاده‌سازی سرویس زرین‌پال (2-3 ساعت)
- اتصال به UI موجود (1 روز)

### 💰 **هدف:**

- راه‌اندازی MVP تا 2 هفته
- اولین پرداخت واقعی تا 3 هفته
- Launch رسمی تا 1 ماه

---

## 📞 **مرحله بعدی با من:**

حالا که استراتژی رو دیدید، به من بگید:

**آیا می‌خواید:**

1. 🏗️ **من جدول‌ها رو براتون بسازم؟** (10 دقیقه)
2. 💻 **من سرویس زرین‌پال رو کامل پیاده کنم؟** (1 ساعت)
3. 🎨 **من UI کامپوننت‌ها رو بسازم؟** (2-3 ساعت)
4. 📄 **من صفحه Callback رو بنویسم؟** (30 دقیقه)
5. 🔗 **من همه رو به هم وصل کنم؟** (کامل end-to-end)

**یا ترجیح می‌دید:**

- من فقط راهنمایی کنم و شما پیاده کنید؟
- من بخش‌های خاص رو بنویسم؟

بهم بگید از کجا شروع کنیم! 🚀

---

**ساخته شده با ❤️ برای موفقیت پروژه شما**
