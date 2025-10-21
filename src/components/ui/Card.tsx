import React from 'react';
import { cn } from '../../utils/cn';

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'interactive';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
}

/**
 * Card Component
 * کامپوننت کارت یکپارچه با پشتیبانی از dark mode
 *
 * @example
 * <Card variant="elevated" padding="md">محتوای کارت</Card>
 * <Card variant="interactive" hoverable>کلیک کنید</Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', padding = 'md', hoverable = false, className, children, ...props },
    ref
  ) => {
    const baseStyles =
      'bg-white dark:bg-slate-800 rounded-lg transition-all duration-200 border border-slate-200 dark:border-slate-700';

    const variants: Record<CardVariant, string> = {
      default: '',
      elevated: 'shadow-lg',
      bordered: 'border-2',
      interactive:
        'hover:shadow-xl cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]',
    };

    const paddings: Record<CardPadding, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          hoverable && 'hover:shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader Component
 * بخش Header کارت
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {title && <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{title}</h3>}
      {subtitle && <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>}
      {children}
    </div>
  );
};

/**
 * CardBody Component
 * بخش Body کارت
 */
export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;

export const CardBody: React.FC<CardBodyProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('text-slate-700 dark:text-slate-300', className)} {...props}>
      {children}
    </div>
  );
};

/**
 * CardFooter Component
 * بخش Footer کارت
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  align = 'right',
  className,
  children,
  ...props
}) => {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={cn(
        'mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-2',
        alignments[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
