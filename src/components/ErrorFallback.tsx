import React from 'react';

interface ErrorFallbackProps {
  error?: Error | null;
  resetError?: () => void;
}

/**
 * کامپوننت Fallback UI برای نمایش خطاها
 * می‌تواند به صورت سفارشی در ErrorBoundary استفاده شود
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
          {/* آیکون خطا */}
          <div className="text-8xl mb-6 animate-pulse"></div>

          {/* عنوان */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            اوه! مشکلی پیش آمد
          </h1>

          {/* توضیحات */}
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            متاسفیم، خطایی رخ داده است. لطفاً دوباره تلاش کنید.
          </p>

          {/* پیام خطا (فقط در development) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
              <p className="text-sm font-mono text-red-800 dark:text-red-200">{error.message}</p>
            </div>
          )}

          {/* دکمه‌های اقدام */}
          <div className="flex flex-col gap-3">
            {resetError && (
              <button
                onClick={resetError}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                تلاش مجدد
              </button>
            )}
            <button
              onClick={() => (window.location.href = '/')}
              className="w-full px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-lg transition-all"
            >
              بازگشت به خانه
            </button>
          </div>

          {/* لینک پشتیبانی */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              نیاز به کمک دارید؟{' '}
              <a
                href="mailto:support@example.com"
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                با پشتیبانی تماس بگیرید
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
