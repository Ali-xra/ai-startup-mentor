import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * جلوگیری از crash کل اپلیکیشن در صورت بروز خطا در کامپوننت‌ها
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // بروزرسانی state برای نمایش fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // لاگ کردن خطا برای debugging
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    // TODO: ارسال به error tracking service (مثل Sentry)
    // sendErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // اگر fallback custom داشتیم نمایش بده
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // در غیر این صورت نمایش پیام خطای پیش‌فرض
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                خطایی رخ داده است
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Something went wrong
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                  Error Details (Development Mode):
                </h3>
                <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs text-red-600 dark:text-red-400 mt-2 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                تلاش مجدد / Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-lg transition-colors"
              >
                بازگشت به صفحه اصلی / Go Home
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              <p>در صورت تکرار مشکل، لطفاً با پشتیبانی تماس بگیرید</p>
              <p className="text-xs mt-1">If the problem persists, please contact support</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
