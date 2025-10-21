# راهنمای جامع سیستم پرداخت - AI Startup Mentor

## 📋 فهرست مطالب

1. [گزینه‌های پرداخت](#گزینه‌های-پرداخت)
2. [معماری سیستم](#معماری-سیستم)
3. [پیاده‌سازی گام‌به‌گام](#پیاده‌سازی-گام‌به‌گام)
4. [مدیریت اشتراک](#مدیریت-اشتراک)
5. [امنیت](#امنیت)
6. [تست](#تست)

---

## 🌍 گزینه‌های پرداخت

### 1️⃣ برای کاربران ایرانی 🇮🇷

#### زرین‌پال (توصیه شده)

- **وب‌سایت:** https://www.zarinpal.com
- **مستندات:** https://www.zarinpal.com/docs/
- **کارمزد:** 1.5% - 2%
- **مزایا:**
  - محبوب‌ترین درگاه ایران
  - API ساده و کامل
  - پشتیبانی خوب
  - داشبورد حرفه‌ای

#### گزینه‌های جایگزین:

- **Pay.ir** - کارمزد کمتر (1.5%)
- **IDPay** - بدون کارمزد تا 500 هزار تومان
- **NextPay** - API پیشرفته
- **Zibal** - گزارش‌گیری عالی

### 2️⃣ برای کاربران بین‌المللی 🌍

#### Stripe (توصیه اول)

- **وب‌سایت:** https://stripe.com
- **مستندات:** https://stripe.com/docs
- **کارمزد:** 2.9% + $0.30
- **مزایا:**
  - بهترین API در دنیا
  - مدیریت اشتراک built-in
  - Webhook قوی
  - پشتیبانی 135+ ارز
- **محدودیت:** نیاز به شرکت خارجی (ایران ساپورت نمی‌شود)

#### LemonSqueezy (توصیه دوم) 🍋

- **وب‌سایت:** https://lemonsqueezy.com
- **کارمزد:** 5% + $0.50
- **مزایا:**
  - Merchant of Record
  - مالیات و VAT خودکار
  - راه‌اندازی سریع‌تر از Stripe
  - محدودیت‌های جغرافیایی کمتر

#### Paddle

- **وب‌سایت:** https://paddle.com
- **کارمزد:** 5% + $0.50
- **مشابه LemonSqueezy**

#### پرداخت کریپتو (اختیاری)

- **NOWPayments:** https://nowpayments.io
- **Coinbase Commerce:** https://commerce.coinbase.com
- **کارمزد:** 0.5% - 1%
- **مزایا:** بدون محدودیت جغرافیایی

---

## 🏗️ معماری سیستم

### ساختار دیتابیس (Supabase)

```sql
-- جدول اشتراک‌ها
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL, -- 'free', 'starter', 'pro', 'enterprise'
  status TEXT NOT NULL, -- 'active', 'canceled', 'expired', 'trial'
  payment_provider TEXT, -- 'zarinpal', 'stripe', 'crypto', 'manual'

  -- تاریخ‌ها
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,

  -- پرداخت
  billing_cycle TEXT, -- 'monthly', 'yearly'
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD', -- 'USD', 'IRR'

  -- شناسه‌های خارجی
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول تراکنش‌ها
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),

  -- اطلاعات پرداخت
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  payment_provider TEXT NOT NULL,
  payment_method TEXT, -- 'card', 'bank', 'crypto'

  -- وضعیت
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'

  -- شناسه‌های خارجی
  provider_transaction_id TEXT,
  provider_payment_id TEXT,

  -- متادیتا
  metadata JSONB,
  description TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایندکس‌ها برای سرعت
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

---

## 🚀 پیاده‌سازی گام‌به‌گام

### مرحله 1: نصب پکیج‌ها

```bash
# برای زرین‌پال
npm install axios

# برای Stripe (اختیاری)
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### مرحله 2: ساختار فولدرها

```
src/
├── services/
│   ├── payment/
│   │   ├── zarinpal.ts      # سرویس زرین‌پال
│   │   ├── stripe.ts         # سرویس Stripe (اختیاری)
│   │   ├── paymentService.ts # سرویس اصلی
│   │   └── types.ts          # تایپ‌ها
│   └── subscription/
│       ├── subscriptionService.ts
│       └── plans.ts
├── components/
│   ├── payment/
│   │   ├── CheckoutButton.tsx
│   │   ├── PaymentModal.tsx
│   │   └── PaymentSuccess.tsx
│   └── subscription/
│       └── SubscriptionManager.tsx
└── pages/
    └── CheckoutPage.tsx
```

### مرحله 3: تایپ‌های TypeScript

```typescript
// src/services/payment/types.ts

export type PaymentProvider = 'zarinpal' | 'stripe' | 'crypto' | 'manual';
export type Currency = 'USD' | 'IRR';
export type BillingCycle = 'monthly' | 'yearly';

export interface PaymentRequest {
  userId: string;
  planId: string;
  billingCycle: BillingCycle;
  amount: number;
  currency: Currency;
  callbackUrl: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
}

export interface VerifyPaymentRequest {
  transactionId: string;
  authority?: string; // برای زرین‌پال
  paymentIntentId?: string; // برای Stripe
}

export interface VerifyPaymentResult {
  success: boolean;
  refId?: string;
  cardPan?: string;
  error?: string;
}
```

### مرحله 4: سرویس زرین‌پال

```typescript
// src/services/payment/zarinpal.ts

import axios from 'axios';
import { PaymentRequest, PaymentResult, VerifyPaymentResult } from './types';

const ZARINPAL_MERCHANT_ID = import.meta.env.VITE_ZARINPAL_MERCHANT_ID;
const ZARINPAL_REQUEST_URL = 'https://api.zarinpal.com/pg/v4/payment/request.json';
const ZARINPAL_VERIFY_URL = 'https://api.zarinpal.com/pg/v4/payment/verify.json';
const ZARINPAL_PAYMENT_URL = 'https://www.zarinpal.com/pg/StartPay/';

export class ZarinpalService {
  /**
   * ایجاد درخواست پرداخت
   */
  static async createPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // تبدیل دلار به تومان (اگر لازمه)
      const amountInTomans =
        request.currency === 'USD'
          ? request.amount * 55000 // نرخ تقریبی - باید از API نرخ ارز بگیرید
          : request.amount;

      const response = await axios.post(ZARINPAL_REQUEST_URL, {
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: amountInTomans * 10, // زرین‌پال به ریال کار می‌کنه
        description: `خرید پلن ${request.planId} - ${request.billingCycle}`,
        callback_url: request.callbackUrl,
        metadata: {
          email: '', // ایمیل کاربر
          mobile: '', // موبایل کاربر (اختیاری)
        },
      });

      const { data, errors } = response.data;

      if (errors && errors.length > 0) {
        return {
          success: false,
          error: errors[0].message,
        };
      }

      return {
        success: true,
        transactionId: data.authority,
        paymentUrl: `${ZARINPAL_PAYMENT_URL}${data.authority}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'خطا در ایجاد درخواست پرداخت',
      };
    }
  }

  /**
   * تایید پرداخت
   */
  static async verifyPayment(
    authority: string,
    amountInTomans: number
  ): Promise<VerifyPaymentResult> {
    try {
      const response = await axios.post(ZARINPAL_VERIFY_URL, {
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: amountInTomans * 10, // به ریال
        authority,
      });

      const { data, errors } = response.data;

      if (errors && errors.length > 0) {
        return {
          success: false,
          error: errors[0].message,
        };
      }

      return {
        success: true,
        refId: data.ref_id?.toString(),
        cardPan: data.card_pan,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'خطا در تایید پرداخت',
      };
    }
  }
}
```

### مرحله 5: سرویس مدیریت اشتراک

```typescript
// src/services/subscription/subscriptionService.ts

import { supabase } from '../../supabaseClient';
import { PaymentProvider, BillingCycle } from '../payment/types';

export interface CreateSubscriptionParams {
  userId: string;
  planId: string;
  billingCycle: BillingCycle;
  paymentProvider: PaymentProvider;
  amount: number;
  currency: string;
  transactionId: string;
}

export class SubscriptionService {
  /**
   * ایجاد اشتراک جدید
   */
  static async createSubscription(params: CreateSubscriptionParams) {
    const expiresAt = this.calculateExpiryDate(params.billingCycle);

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: params.userId,
        plan_id: params.planId,
        status: 'active',
        payment_provider: params.paymentProvider,
        billing_cycle: params.billingCycle,
        amount: params.amount,
        currency: params.currency,
        started_at: new Date().toISOString(),
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * ثبت تراکنش
   */
  static async createTransaction(params: {
    userId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    paymentProvider: PaymentProvider;
    status: 'pending' | 'completed' | 'failed';
    providerTransactionId?: string;
  }) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: params.userId,
        subscription_id: params.subscriptionId,
        amount: params.amount,
        currency: params.currency,
        payment_provider: params.paymentProvider,
        status: params.status,
        provider_transaction_id: params.providerTransactionId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * دریافت اشتراک فعال کاربر
   */
  static async getActiveSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * لغو اشتراک
   */
  static async cancelSubscription(subscriptionId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * محاسبه تاریخ انقضا
   */
  private static calculateExpiryDate(billingCycle: BillingCycle): string {
    const now = new Date();
    if (billingCycle === 'monthly') {
      now.setMonth(now.getMonth() + 1);
    } else {
      now.setFullYear(now.getFullYear() + 1);
    }
    return now.toISOString();
  }

  /**
   * بررسی انقضای اشتراک‌ها (CRON Job)
   */
  static async checkExpiredSubscriptions() {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('status', 'active')
      .lt('expires_at', new Date().toISOString())
      .select();

    if (error) throw error;
    return data;
  }
}
```

### مرحله 6: کامپوننت دکمه پرداخت

```typescript
// src/components/payment/CheckoutButton.tsx

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ZarinpalService } from '../../services/payment/zarinpal';
import { SubscriptionService } from '../../services/subscription/subscriptionService';

interface CheckoutButtonProps {
  planId: string;
  planName: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  currency: 'USD' | 'IRR';
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  planId,
  planName,
  price,
  billingCycle,
  currency,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      alert(language === 'fa' ? 'لطفاً ابتدا وارد شوید' : 'Please sign in first');
      window.location.href = '/login';
      return;
    }

    setLoading(true);

    try {
      // ایجاد درخواست پرداخت
      const paymentResult = await ZarinpalService.createPayment({
        userId: user.id,
        planId,
        billingCycle,
        amount: price,
        currency,
        callbackUrl: `${window.location.origin}/payment/callback`,
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error);
      }

      // ذخیره اطلاعات در localStorage برای بعد از callback
      localStorage.setItem(
        'pending_payment',
        JSON.stringify({
          userId: user.id,
          planId,
          billingCycle,
          amount: price,
          currency,
          transactionId: paymentResult.transactionId,
        })
      );

      // هدایت به درگاه پرداخت
      if (paymentResult.paymentUrl) {
        window.location.href = paymentResult.paymentUrl;
      }
    } catch (error: any) {
      alert(error.message || 'خطا در ایجاد درخواست پرداخت');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-3 px-6 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 transition-all"
    >
      {loading
        ? language === 'fa'
          ? 'در حال پردازش...'
          : 'Processing...'
        : language === 'fa'
          ? `خرید ${planName}`
          : `Buy ${planName}`}
    </button>
  );
};

export default CheckoutButton;
```

### مرحله 7: صفحه Callback پرداخت

```typescript
// src/pages/PaymentCallbackPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ZarinpalService } from '../services/payment/zarinpal';
import { SubscriptionService } from '../services/subscription/subscriptionService';

const PaymentCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // دریافت اطلاعات از URL
      const authority = searchParams.get('Authority');
      const statusParam = searchParams.get('Status');

      if (statusParam !== 'OK' || !authority) {
        setStatus('failed');
        setMessage(language === 'fa' ? 'پرداخت لغو شد' : 'Payment canceled');
        return;
      }

      // دریافت اطلاعات از localStorage
      const pendingPaymentStr = localStorage.getItem('pending_payment');
      if (!pendingPaymentStr) {
        throw new Error('Payment information not found');
      }

      const pendingPayment = JSON.parse(pendingPaymentStr);

      // تایید پرداخت با زرین‌پال
      const verifyResult = await ZarinpalService.verifyPayment(
        authority,
        pendingPayment.amount
      );

      if (!verifyResult.success) {
        throw new Error(verifyResult.error);
      }

      // ایجاد اشتراک در دیتابیس
      const subscription = await SubscriptionService.createSubscription({
        userId: pendingPayment.userId,
        planId: pendingPayment.planId,
        billingCycle: pendingPayment.billingCycle,
        paymentProvider: 'zarinpal',
        amount: pendingPayment.amount,
        currency: pendingPayment.currency,
        transactionId: authority,
      });

      // ثبت تراکنش
      await SubscriptionService.createTransaction({
        userId: pendingPayment.userId,
        subscriptionId: subscription.id,
        amount: pendingPayment.amount,
        currency: pendingPayment.currency,
        paymentProvider: 'zarinpal',
        status: 'completed',
        providerTransactionId: authority,
      });

      // پاک کردن localStorage
      localStorage.removeItem('pending_payment');

      setStatus('success');
      setMessage(
        language === 'fa'
          ? `پرداخت موفق! کد پیگیری: ${verifyResult.refId}`
          : `Payment successful! Reference ID: ${verifyResult.refId}`
      );

      // هدایت به داشبورد بعد از 3 ثانیه
      setTimeout(() => {
        navigate('/entrepreneur');
      }, 3000);
    } catch (error: any) {
      setStatus('failed');
      setMessage(error.message || 'خطا در تایید پرداخت');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {status === 'processing' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold">
              {language === 'fa' ? 'در حال تایید پرداخت...' : 'Verifying payment...'}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              {language === 'fa' ? 'پرداخت موفق!' : 'Payment Successful!'}
            </h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              {language === 'fa' ? 'پرداخت ناموفق' : 'Payment Failed'}
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/pricing')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {language === 'fa' ? 'بازگشت' : 'Go Back'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallbackPage;
```

---

## 🔐 امنیت

### 1. متغیرهای محیطی (.env)

```bash
# زرین‌پال
VITE_ZARINPAL_MERCHANT_ID=your-merchant-id

# Stripe (اختیاری)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_... # فقط در backend

# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role # فقط در backend
```

### 2. Edge Functions (برای Webhooks)

```typescript
// supabase/functions/zarinpal-webhook/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { authority, status } = await req.json();

    // تایید امضا (اگر زرین‌پال ساپورت می‌کنه)

    // به‌روزرسانی وضعیت اشتراک
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // ... لاجیک پردازش

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

### 3. Row Level Security (RLS)

```sql
-- فقط خود کاربر بتونه اشتراکش رو ببینه
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- فقط خود کاربر بتونه تراکنش‌هاش رو ببینه
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🧪 تست

### تست محیط توسعه (Sandbox)

زرین‌پال Sandbox دارد:

- **URL:** https://sandbox.zarinpal.com
- **Merchant ID تست:** مطابق مستندات

### تست کارت‌های بانکی

برای تست در Sandbox:

- شماره کارت: `5022-2910-XXXX-XXXX` (هر 8 رقم دیگه)
- CVV2: هر 3 یا 4 رقم
- تاریخ انقضا: هر تاریخی در آینده

---

## 📊 مدیریت و گزارش‌گیری

### داشبورد ادمین برای مشاهده:

- تعداد اشتراک‌های فعال
- درآمد ماهیانه/سالیانه
- نرخ تبدیل (Conversion Rate)
- تراکنش‌های ناموفق

---

## 🚀 مراحل بعدی

### فاز 1: MVP (Minimum Viable Product)

- [x] طراحی دیتابیس
- [ ] پیاده‌سازی زرین‌پال
- [ ] صفحه Checkout
- [ ] صفحه Callback
- [ ] تست کامل

### فاز 2: بهبود

- [ ] افزودن Stripe برای بین‌الملل
- [ ] Webhook برای خودکارسازی
- [ ] ایمیل اطلاع‌رسانی
- [ ] داشبورد ادمین

### فاز 3: مقیاس‌پذیری

- [ ] پرداخت کریپتو
- [ ] تخفیف و کوپن
- [ ] برنامه وابستگی (Affiliate)
- [ ] فاکتور خودکار (Invoice)

---

## 📚 منابع مفید

### زرین‌پال

- مستندات: https://www.zarinpal.com/docs/
- ویدیوهای آموزشی: https://www.aparat.com/zarinpal
- پشتیبانی: support@zarinpal.com

### Stripe

- مستندات: https://stripe.com/docs
- راهنمای React: https://stripe.com/docs/stripe-js/react

### Supabase

- Edge Functions: https://supabase.com/docs/guides/functions
- RLS: https://supabase.com/docs/guides/auth/row-level-security

---

## ❓ سوالات متداول

### 1. کدوم درگاه رو انتخاب کنم؟

- **ایرانی:** زرین‌پال (محبوب‌ترین)
- **بین‌المللی:** Stripe (بهترین API) یا LemonSqueezy (راحت‌تر)

### 2. چطور نرخ ارز رو مدیریت کنم؟

- از API نرخ ارز استفاده کنید (مثل exchangerate-api.com)
- نرخ رو هر 24 ساعت به‌روز کنید
- یا نرخ ثابت تعیین کنید و دستی تغییر بدید

### 3. اگر کاربر پرداخت کنه ولی Callback نیاد چی؟

- از Webhook استفاده کنید
- یا یک CRON Job برای چک کردن تراکنش‌های pending

### 4. چطور فاکتور صادر کنم؟

- از jsPDF برای ساخت PDF
- قالب فاکتور استاندارد ایرانی
- شماره‌گذاری خودکار

### 5. آیا باید شرکت ثبت کنم؟

- برای زرین‌پال: نیاز به شناسه ملی/شماره شبا
- برای Stripe: نیاز به شرکت خارجی

---

## 💡 نکات طلایی

1. **همیشه تست کنید:** قبل از production حتماً تست کامل کنید
2. **Log همه چیز:** تمام تراکنش‌ها رو لاگ کنید
3. **Webhook مهمه:** برای اطمینان از پرداخت موفق
4. **امنیت اول:** هیچ‌وقت API Key رو commit نکنید
5. **UX خوب:** فرآیند پرداخت باید سریع و ساده باشه
6. **پشتیبانی:** برای مشکلات پرداخت پشتیبانی سریع داشته باشید

---

**ساخته شده با ❤️ برای AI Startup Mentor**
