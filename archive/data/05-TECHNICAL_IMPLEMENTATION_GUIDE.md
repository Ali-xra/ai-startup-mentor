# 🔧 راهنمای پیاده‌سازی فنی پروژه AI Startup Mentor

## 📁 **ساختار دقیق فایل‌ها و کدهای نمونه**

### **۱. فایل‌های اصلی پروژه**

#### **package.json**
```json
{
  "name": "ai-startup-mentor",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx,ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@supabase/supabase-js": "^2.12.0",
    "lucide-react": "^0.263.0",
    "react-hook-form": "^7.43.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.38.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.2",
    "vite": "^4.3.0"
  }
}
```

#### **tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'vazir': ['Vazir', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        }
      }
    },
  },
  plugins: [],
}
```

#### **vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})
```

### **۲. فایل‌های TypeScript اصلی**

#### **types/index.ts**
```typescript
export type Locale = 'en' | 'fa';
export type UserRole = 'entrepreneur' | 'investor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface Project {
  id: number;
  user_id: string;
  project_name: string;
  initial_idea: string;
  stage: string;
  startup_data: Record<string, any>;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface Stage {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  order: number;
}
```

#### **i18n/translations.ts**
```typescript
import { Locale } from '../types';

export const translations = {
  welcome_title: {
    en: 'AI Startup Mentor',
    fa: 'مربی استارتاپ هوش مصنوعی'
  },
  welcome_subtitle: {
    en: 'Transform your idea into a successful business',
    fa: 'ایده خود را به یک کسب‌وکار موفق تبدیل کنید'
  },
  auth_sign_in_tab: {
    en: 'Sign In',
    fa: 'ورود'
  },
  auth_sign_up_tab: {
    en: 'Sign Up',
    fa: 'ثبت‌نام'
  },
  // ... سایر ترجمه‌ها
} as const;

export function t(key: keyof typeof translations, locale: Locale): string {
  return translations[key][locale] || translations[key].en;
}
```

### **۳. سرویس‌های اصلی**

#### **services/supabaseClient.ts**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// تابع کمکی برای مدیریت خطاها
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'خطا در اتصال به دیتابیس');
};
```

#### **services/investorService.ts**
```typescript
import { supabase } from './supabaseClient';

export const investorService = {
  // دریافت پروژه‌های عمومی با فیلتر
  async getPublicProjects(filters?: {
    industry?: string;
    stage?: string;
    location?: string;
  }) {
    let query = supabase
      .from('public_projects')
      .select(`
        *,
        profiles:user_id (
          name,
          avatar_url
        )
      `)
      .eq('is_published', true);

    if (filters?.industry) {
      query = query.contains('tags', [filters.industry]);
    }

    const { data, error } = await query.limit(20);

    if (error) throw error;
    return data;
  },

  // چک کردن محدودیت بازدید ماهانه
  async checkViewLimit(userId: string): Promise<boolean> {
    const { data: profile } = await supabase
      .from('investor_profiles')
      .select('tier, monthly_project_views, last_view_reset')
      .eq('user_id', userId)
      .single();

    if (!profile) return false;

    // اگر verified یا premium باشد، محدودیت ندارد
    if (profile.tier === 'verified' || profile.tier === 'premium') {
      return true;
    }

    // چک کردن محدودیت ماهانه (۱۰ پروژه)
    return profile.monthly_project_views < 10;
  }
};
```

### **۴. کامپوننت‌های کلیدی**

#### **components/AuthScreen.tsx**
```typescript
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Locale, t } from '../i18n';

interface AuthScreenProps {
  locale: Locale;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ locale }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        // هدایت بر اساس نقش کاربر
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profile?.role === 'investor') {
            window.location.href = '/investor.html';
          } else {
            window.location.href = '/app.html';
          }
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;

        // هدایت به صفحه انتخاب نقش
        window.location.href = '/app.html';
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl">
          <div className="mb-6 flex justify-center border rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${
                isLogin ? 'bg-purple-500 text-white' : 'text-slate-500'
              }`}
            >
              {t('auth_sign_in_tab', locale)}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${
                !isLogin ? 'bg-purple-500 text-white' : 'text-slate-500'
              }`}
            >
              {t('auth_sign_up_tab', locale)}
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                {t('auth_email_label', locale)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                {t('auth_password_label', locale)}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg"
            >
              {loading ? '...' : (isLogin ? t('auth_sign_in_button', locale) : t('auth_sign_up_button', locale))}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
```

#### **components/RoleSelection.tsx**
```typescript
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

type UserRole = 'entrepreneur' | 'investor';

interface RoleSelectionProps {
  userId: string;
  onComplete: () => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ userId, onComplete }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectRole = async () => {
    if (!selectedRole) return;

    setLoading(true);

    try {
      // ساخت پروفایل با نقش
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          role: selectedRole
        });

      if (profileError) throw profileError;

      // اگر سرمایه‌گذار انتخاب شده، پروفایل سرمایه‌گذار هم بساز
      if (selectedRole === 'investor') {
        const { error: investorError } = await supabase
          .from('investor_profiles')
          .insert({
            id: userId,
            tier: 'free',
            monthly_project_views: 0
          });

        if (investorError) throw investorError;

        window.location.href = '/investor.html';
      } else {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving role:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-10">
          نقش خود را انتخاب کنید
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* کارآفرین */}
          <button
            onClick={() => setSelectedRole('entrepreneur')}
            className={`p-8 rounded-2xl border-3 transition-all ${
              selectedRole === 'entrepreneur'
                ? 'border-purple-500 bg-purple-50'
                : 'border-slate-200 bg-white hover:border-purple-300'
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-2xl font-bold mb-3">کارآفرین</h3>
              <p className="text-slate-600 text-sm">
                ایده‌پرداز و سازنده کسب‌وکار
              </p>
            </div>
          </button>

          {/* سرمایه‌گذار */}
          <button
            onClick={() => setSelectedRole('investor')}
            className={`p-8 rounded-2xl border-3 transition-all ${
              selectedRole === 'investor'
                ? 'border-purple-500 bg-purple-50'
                : 'border-slate-200 bg-white hover:border-purple-300'
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-3">سرمایه‌گذار</h3>
              <p className="text-slate-600 text-sm">
                حامی و سرمایه‌گذار استارتاپ‌ها
              </p>
            </div>
          </button>
        </div>

        <button
          onClick={handleSelectRole}
          disabled={!selectedRole || loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-xl"
        >
          {loading ? 'در حال ذخیره...' : 'ادامه'}
        </button>
      </div>
    </div>
  );
};
```

### **۵. Contextهای اصلی**

#### **contexts/AuthContext.tsx**
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // دریافت session فعلی
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // شنود تغییرات auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setSession(data.session);
    setUser(data.user);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### **contexts/LanguageContext.tsx**
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '../types';

interface LanguageContextType {
  language: Locale;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Locale>(() => {
    const saved = localStorage.getItem('language') as Locale;
    return saved || 'fa';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fa' ? 'en' : 'fa');
  };

  const value = {
    language,
    toggleLanguage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

### **۶. صفحات HTML اصلی**

#### **index.html**
```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Startup Mentor</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

#### **auth.html**
```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Startup Mentor - احراز هویت</title>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import { createRoot } from 'react-dom/client';
    import { AuthScreen } from './src/components/AuthScreen';
    import { LanguageProvider } from './src/contexts/LanguageContext';

    const root = createRoot(document.getElementById('root'));
    root.render(
      <LanguageProvider>
        <AuthScreen locale="fa" />
      </LanguageProvider>
    );
  </script>
</body>
</html>
```

### **۷. فایل‌های Supabase**

#### **supabase/migrations/001_initial_schema.sql**
```sql
-- ایجاد جدول profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    bio TEXT,
    company TEXT,
    position TEXT,
    role TEXT DEFAULT 'entrepreneur' CHECK (role IN ('entrepreneur', 'investor')),
    user_type TEXT DEFAULT 'idea_creator',
    verified BOOLEAN DEFAULT false,
    verification_status TEXT DEFAULT 'unverified',
    verification_date TIMESTAMP WITH TIME ZONE,
    avatar_url TEXT,
    location TEXT,
    website TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    profile_visibility TEXT DEFAULT 'public',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایجاد جدول investor_profiles
CREATE TABLE investor_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
    investor_type TEXT CHECK (investor_type IN ('individual', 'vc', 'corporate', 'angel')),
    company_name TEXT,
    investment_min DECIMAL(15,2),
    investment_max DECIMAL(15,2),
    preferred_industries TEXT[],
    preferred_stages TEXT[],
    preferred_locations TEXT[],
    years_of_experience INTEGER,
    portfolio JSONB DEFAULT '[]'::jsonb,
    verification_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    monthly_project_views INTEGER DEFAULT 0,
    last_view_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فعال کردن RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;

-- پالیسی‌های امنیتی
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own investor profile" ON investor_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own investor profile" ON investor_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own investor profile" ON investor_profiles
    FOR UPDATE USING (auth.uid() = id);
```

### **۸. فایل‌های پیکربندی**

#### **.env.example**
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_AI_API_KEY=your_ai_service_api_key_here
```

#### **tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 🚀 **دستورالعمل اجرای پروژه**

### **مرحله ۱: راه‌اندازی پروژه**
```bash
# ۱. کلون پروژه
git clone <repository-url>
cd ai-startup-mentor

# ۲. نصب dependencies
npm install

# ۳. راه‌اندازی Supabase
# پروژه جدید در supabase.com ایجاد کنید
# جداول را طبق فایل migration بسازید

# ۴. تنظیم متغیرهای محیطی
cp .env.example .env
# ویرایش .env با اطلاعات واقعی Supabase
```

### **مرحله ۲: اجرای محلی**
```bash
# اجرای در حالت development
npm run dev

# باز کردن صفحات مختلف:
# - http://localhost:3000 - صفحه اصلی اپ
# - http://localhost:3000/auth.html - صفحه احراز هویت
# - http://localhost:3000/investor.html - پنل سرمایه‌گذار
```

### **مرحله ۳: تست ویژگی‌ها**
1. ثبت‌نام کاربر جدید
2. انتخاب نقش (کارآفرین/سرمایه‌گذار)
3. ایجاد پروژه جدید (برای کارآفرینان)
4. جستجوی پروژه‌ها (برای سرمایه‌گذاران)

---

## 📋 **چک‌لیست پیاده‌سازی**

### **هفته ۱: زیرساخت**
- [ ] راه‌اندازی پروژه React + TypeScript
- [ ] نصب و تنظیم Tailwind CSS
- [ ] راه‌اندازی Supabase project
- [ ] ایجاد جداول اصلی دیتابیس
- [ ] تنظیم پالیسی‌های امنیتی

### **هفته ۲: احراز هویت**
- [ ] پیاده‌سازی AuthContext
- [ ] صفحه احراز هویت (لاگین/ثبت‌نام)
- [ ] احراز هویت گوگل OAuth
- [ ] صفحه انتخاب نقش
- [ ] مدیریت session

### **هفته ۳-۴: داشبورد کارآفرینان**
- [ ] سیستم ایجاد پروژه
- [ ] ۸ مرحله پروژه با ویرایشگر متن
- [ ] سیستم ذخیره خودکار
- [ ] چت با AI (اتصال به API)

### **هفته ۵: پنل سرمایه‌گذاران**
- [ ] داشبورد با آمار بازدید
- [ ] لیست پروژه‌های عمومی
- [ ] فیلترهای پیشرفته
- [ ] سیستم محدودیت بازدید ماهانه

### **هفته ۶: تکمیل و تست**
- [ ] تست تمام صفحات
- [ ] بهینه‌سازی عملکرد
- [ ] بررسی امنیتی
- [ ] مستندسازی نهایی

---

این راهنما باید برای پیاده‌سازی کامل پروژه کافی باشد. هر بخش شامل کدهای نمونه و توضیحات دقیق است که برنامه‌نویس می‌تواند از آن‌ها استفاده کند.
