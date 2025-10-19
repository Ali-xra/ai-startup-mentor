import { useCallback } from 'react';
import {
  handleError,
  getUserFriendlyMessage,
  ErrorType,
  ErrorSeverity,
  AppError,
} from '../services/errorHandler';

interface UseErrorHandlerOptions {
  locale?: 'fa' | 'en';
  onError?: (error: AppError) => void;
}

/**
 * Custom Hook برای مدیریت خطا در کامپوننت‌ها
 *
 * استفاده:
 * ```tsx
 * const { handleComponentError, getErrorMessage } = useErrorHandler({ locale: 'fa' });
 *
 * try {
 *   // some code
 * } catch (error) {
 *   const appError = handleComponentError(error, { context: 'fetching data' });
 *   toast.error(getErrorMessage(appError));
 * }
 * ```
 */
export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { locale = 'fa', onError } = options;

  /**
   * Handle کردن خطا با context و type و severity دلخواه
   */
  const handleComponentError = useCallback(
    (
      error: Error | unknown,
      context?: Record<string, any>,
      type?: ErrorType,
      severity?: ErrorSeverity
    ): AppError => {
      const appError = handleError(error, context, type, severity);

      // فراخوانی callback اگر ارائه شده باشد
      if (onError) {
        onError(appError);
      }

      return appError;
    },
    [onError]
  );

  /**
   * دریافت پیام user-friendly از AppError
   */
  const getErrorMessage = useCallback(
    (error: AppError): string => {
      return getUserFriendlyMessage(error, locale);
    },
    [locale]
  );

  /**
   * Handle خطاهای async/await
   */
  const handleAsyncError = useCallback(
    async <T>(
      promise: Promise<T>,
      context?: Record<string, any>
    ): Promise<[T | null, AppError | null]> => {
      try {
        const result = await promise;
        return [result, null];
      } catch (error) {
        const appError = handleComponentError(error, context);
        return [null, appError];
      }
    },
    [handleComponentError]
  );

  /**
   * Wrapper برای توابع که ممکن است خطا بدهند
   */
  const wrapWithErrorHandler = useCallback(
    <T extends (...args: any[]) => any>(
      fn: T,
      context?: Record<string, any>
    ): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
      return (...args: Parameters<T>) => {
        try {
          return fn(...args);
        } catch (error) {
          handleComponentError(error, {
            ...context,
            functionName: fn.name,
            arguments: args,
          });
          return undefined;
        }
      };
    },
    [handleComponentError]
  );

  return {
    handleComponentError,
    getErrorMessage,
    handleAsyncError,
    wrapWithErrorHandler,
  };
};

/**
 * Hook ساده‌تر برای موارد ساده
 */
export const useSimpleErrorHandler = (locale: 'fa' | 'en' = 'fa') => {
  const handleSimpleError = useCallback(
    (error: Error | unknown): string => {
      const appError = handleError(error);
      return getUserFriendlyMessage(appError, locale);
    },
    [locale]
  );

  return { handleSimpleError };
};
