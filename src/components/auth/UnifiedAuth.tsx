import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

type AuthMode = 'login' | 'signup';
type UserRole = 'entrepreneur' | 'investor';

export const UnifiedAuth: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'نام الزامی است';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل 6 کاراکتر باشد';
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیست';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Login
  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // چک کردن نقش کاربر
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      // Redirect بر اساس نقش
      const rolePages: Record<string, string> = {
        'entrepreneur': '/entrepreneur.html',
        'investor': '/investor',
        'programmer': '/programmer.html',
        'consultant': '/consultant.html',
        'designer': '/designer.html'
      };

      if (profile?.role && rolePages[profile.role]) {
        navigate(rolePages[profile.role]);
      } else {
        navigate('/login.html');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setSubmitError(error.message || 'خطا در ورود. ایمیل یا رمز عبور اشتباه است.');
    }
  };

  // Handle Signup
  const handleSignup = async () => {
    try {
      // ثبت‌نام در Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('خطا در ثبت‌نام');

      // ساخت پروفایل با نقش
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: formData.email,
        name: formData.name,
        role: role, // entrepreneur یا investor
      });

      if (profileError) throw profileError;

      // اگر investor هست، ساخت investor_profiles
      if (role === 'investor') {
        const { error: investorError } = await supabase.from('investor_profiles').insert({
          id: authData.user.id,
          tier: 'free',
          monthly_project_views: 0,
        });

        if (investorError) throw investorError;

        // هدایت به profile setup
        navigate('/investor/profile-setup');
      } else {
        // Redirect بر اساس نقش
        const rolePages: Record<string, string> = {
          'entrepreneur': '/entrepreneur.html',
          'programmer': '/programmer.html',
          'consultant': '/consultant.html',
          'designer': '/designer.html'
        };

        if (rolePages[role]) {
          navigate(rolePages[role]);
        } else {
          navigate('/login.html');
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setSubmitError(error.message || 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Input Change
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Switch Mode
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AI Startup Mentor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === 'login' ? 'خوش آمدید! وارد حساب خود شوید' : 'شروع سفر کارآفرینی یا سرمایه‌گذاری'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            ورود
          </button>
          <button
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
              mode === 'signup'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            ثبت‌نام
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-start">
              <svg className="w-5 h-5 ml-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{submitError}</span>
            </div>
          )}

          {/* Role Selection (فقط در signup) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                من یک...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('entrepreneur')}
                  className={`relative p-4 border-2 rounded-xl transition-all ${
                    role === 'entrepreneur'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {role === 'entrepreneur' && (
                    <div className="absolute top-2 left-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-3xl mb-2">💡</div>
                    <div className="font-semibold text-gray-900 dark:text-white">کارآفرین</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">ایده‌پرداز</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('investor')}
                  className={`relative p-4 border-2 rounded-xl transition-all ${
                    role === 'investor'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {role === 'investor' && (
                    <div className="absolute top-2 left-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <div className="font-semibold text-gray-900 dark:text-white">سرمایه‌گذار</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Investor</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Name (فقط در signup) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نام و نام خانوادگی
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                  errors.name ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="نام شما"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="email@example.com"
              dir="ltr"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                errors.password ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="حداقل 6 کاراکتر"
              dir="ltr"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
          </div>

          {/* Confirm Password (فقط در signup) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تکرار رمز عبور
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                  errors.confirmPassword ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="تکرار رمز عبور"
                dir="ltr"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {mode === 'login' ? 'در حال ورود...' : 'در حال ثبت‌نام...'}
              </>
            ) : (
              <>{mode === 'login' ? 'ورود' : 'ثبت‌نام'}</>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          با {mode === 'login' ? 'ورود' : 'ثبت‌نام'}، شما{' '}
          <a href="#" className="text-blue-600 hover:underline">
            شرایط و قوانین
          </a>{' '}
          را می‌پذیرید
        </div>
      </div>
    </div>
  );
};
