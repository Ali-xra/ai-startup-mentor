import React from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'white' | 'success' | 'warning' | 'error';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-3',
  xl: 'h-16 w-16 border-4',
};

const variantClasses: Record<SpinnerVariant, string> = {
  primary: 'border-purple-600 border-r-transparent dark:border-purple-400',
  secondary: 'border-slate-600 border-r-transparent dark:border-slate-400',
  white: 'border-white border-r-transparent',
  success: 'border-green-600 border-r-transparent dark:border-green-400',
  warning: 'border-yellow-600 border-r-transparent dark:border-yellow-400',
  error: 'border-red-600 border-r-transparent dark:border-red-400',
};

/**
 * Loading Spinner Component
 *
 * کامپوننت Spinner با سایزها و رنگ‌های مختلف
 *
 * @example
 * <LoadingSpinner size="md" variant="primary" />
 * <LoadingSpinner size="lg" variant="white" text="در حال بارگذاری..." />
 * <LoadingSpinner fullScreen text="لطفاً صبر کنید..." />
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  text,
  className = '',
}) => {
  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`
          animate-spin rounded-full
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          motion-reduce:animate-[spin_1.5s_linear_infinite]
        `}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Export alias for backward compatibility
export const Loader = LoadingSpinner;
