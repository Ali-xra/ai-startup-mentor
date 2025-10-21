import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function برای ترکیب و merge کردن className ها
 * از clsx برای شرطی کردن و twMerge برای حل تداخل Tailwind استفاده می‌کنه
 *
 * @example
 * cn('px-4 py-2', 'bg-blue-500', 'hover:bg-blue-600')
 * cn('px-4', condition && 'bg-red-500')
 * cn('px-4', { 'bg-red-500': isError, 'bg-green-500': isSuccess })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
