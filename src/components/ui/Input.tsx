import React, { useId } from 'react';
import { cn } from '../../utils/cn';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'error' | 'success';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  inputSize?: InputSize;
  variant?: InputVariant;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Input Component
 * کامپوننت فیلد ورودی با پشتیبانی از dark mode
 *
 * @example
 * <Input label="نام" placeholder="نام خود را وارد کنید" />
 * <Input error="این فیلد الزامی است" variant="error" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      inputSize = 'md',
      variant = 'default',
      icon,
      iconPosition = 'left',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const baseStyles =
      'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500';

    const sizes: Record<InputSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const variants: Record<InputVariant, string> = {
      default:
        'border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20',
      error: 'border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-red-500/20',
      success:
        'border-green-500 dark:border-green-400 focus:border-green-500 focus:ring-green-500/20',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              baseStyles,
              sizes[inputSize],
              variants[variant],
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              className
            )}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}
        </div>

        {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}

        {hint && !error && (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
