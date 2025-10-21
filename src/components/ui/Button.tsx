import React from 'react';
import { cn } from '../../utils/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'outline'
  | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Button Component
 * کامپوننت دکمه یکپارچه با پشتیبانی از dark mode
 *
 * @example
 * <Button variant="primary" size="md">کلیک کنید</Button>
 * <Button variant="outline" loading>در حال بارگذاری</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = 'left',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-md hover:shadow-lg focus:ring-purple-500 dark:bg-purple-600 dark:hover:bg-purple-700',
      secondary:
        'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md hover:shadow-lg focus:ring-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-700',
      success:
        'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-md hover:shadow-lg focus:ring-green-500',
      danger:
        'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-md hover:shadow-lg focus:ring-red-500',
      warning:
        'bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white shadow-md hover:shadow-lg focus:ring-yellow-500',
      outline:
        'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100 focus:ring-purple-500 dark:text-purple-400 dark:border-purple-500 dark:hover:bg-purple-900/20 dark:active:bg-purple-900/30',
      ghost:
        'text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children || 'Loading...'}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
