import React from 'react';

export type ProgressVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';
export type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  label?: string;
  striped?: boolean;
  animated?: boolean;
  className?: string;
}

const variantClasses: Record<ProgressVariant, string> = {
  primary: 'bg-purple-600 dark:bg-purple-500',
  success: 'bg-green-600 dark:bg-green-500',
  warning: 'bg-yellow-600 dark:bg-yellow-500',
  error: 'bg-red-600 dark:bg-red-500',
  info: 'bg-blue-600 dark:bg-blue-500',
};

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

/**
 * Progress Bar Component
 *
 * نوار پیشرفت با انیمیشن و استایل‌های مختلف
 *
 * @example
 * <ProgressBar value={75} variant="primary" showLabel />
 * <ProgressBar value={50} variant="success" striped animated />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  label,
  striped = false,
  animated = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label || 'پیشرفت'}
          </span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${striped ? 'bg-stripe' : ''}
            ${animated ? 'animate-progress' : ''}
            transition-all duration-300 ease-out
            rounded-full
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

/**
 * Circular Progress Component
 *
 * نوار پیشرفت دایره‌ای
 */
interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  variant = 'primary',
  showLabel = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses: Record<ProgressVariant, string> = {
    primary: 'stroke-purple-600 dark:stroke-purple-500',
    success: 'stroke-green-600 dark:stroke-green-500',
    warning: 'stroke-yellow-600 dark:stroke-yellow-500',
    error: 'stroke-red-600 dark:stroke-red-500',
    info: 'stroke-blue-600 dark:stroke-blue-500',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-slate-200 dark:stroke-slate-700"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClasses[variant]} transition-all duration-500 ease-out`}
          fill="none"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Step Progress Component
 *
 * نوار پیشرفت مرحله‌ای
 */
interface Step {
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  variant?: ProgressVariant;
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  variant = 'primary',
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    transition-all duration-300
                    ${isCompleted ? `${variantClasses[variant]} text-white` : ''}
                    ${isCurrent ? `border-2 ${variantClasses[variant].replace('bg-', 'border-')} text-slate-700 dark:text-white` : ''}
                    ${isPending ? 'bg-slate-200 dark:bg-slate-700 text-slate-500' : ''}
                  `}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                {/* Label */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                  )}
                </div>
              </div>
              {/* Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700 mx-2 -mt-12">
                  <div
                    className={`h-full ${variantClasses[variant]} transition-all duration-300`}
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
