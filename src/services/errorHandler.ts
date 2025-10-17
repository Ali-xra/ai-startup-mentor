/**
 * Centralized Error Handler Service
 *
 * این سرویس تمام خطاهای اپلیکیشن را مدیریت می‌کند:
 * - Logging خطاها
 * - ارسال به error tracking service (Sentry)
 * - نمایش پیام‌های user-friendly
 * - دسته‌بندی انواع خطاها
 */

// انواع خطاهای مختلف
export enum ErrorType {
    NETWORK = 'NETWORK',
    AUTH = 'AUTH',
    VALIDATION = 'VALIDATION',
    DATABASE = 'DATABASE',
    PERMISSION = 'PERMISSION',
    NOT_FOUND = 'NOT_FOUND',
    UNKNOWN = 'UNKNOWN',
}

// سطح اهمیت خطا
export enum ErrorSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export interface AppError {
    type: ErrorType;
    severity: ErrorSeverity;
    message: string;
    originalError?: Error | unknown;
    context?: Record<string, any>;
    timestamp: Date;
    userId?: string;
    stackTrace?: string;
}

class ErrorHandlerService {
    private isDevelopment = import.meta.env.DEV;
    private errors: AppError[] = [];
    private maxErrorsInMemory = 50;

    /**
     * Log خطا به console و ذخیره در memory
     */
    private logError(error: AppError): void {
        // Log در development
        if (this.isDevelopment) {
            console.group(`🔴 Error [${error.type}] - ${error.severity}`);
            console.error('Message:', error.message);
            console.error('Original Error:', error.originalError);
            console.error('Context:', error.context);
            console.error('Stack:', error.stackTrace);
            console.error('Timestamp:', error.timestamp);
            console.groupEnd();
        }

        // ذخیره در memory (برای نمایش در admin panel)
        this.errors.unshift(error);
        if (this.errors.length > this.maxErrorsInMemory) {
            this.errors.pop();
        }

        // TODO: ارسال به Sentry یا سرویس tracking دیگر
        // this.sendToSentry(error);
    }

    /**
     * ارسال خطا به Sentry
     * TODO: باید Sentry SDK نصب و configure شود
     */
    private sendToSentry(error: AppError): void {
        // if (window.Sentry) {
        //     window.Sentry.captureException(error.originalError, {
        //         level: this.mapSeverityToSentry(error.severity),
        //         tags: {
        //             errorType: error.type,
        //         },
        //         extra: error.context,
        //     });
        // }
    }

    /**
     * تبدیل severity به format Sentry
     */
    private mapSeverityToSentry(severity: ErrorSeverity): string {
        const map = {
            [ErrorSeverity.LOW]: 'info',
            [ErrorSeverity.MEDIUM]: 'warning',
            [ErrorSeverity.HIGH]: 'error',
            [ErrorSeverity.CRITICAL]: 'fatal',
        };
        return map[severity];
    }

    /**
     * تشخیص نوع خطا از روی error object
     */
    private detectErrorType(error: any): ErrorType {
        if (!error) return ErrorType.UNKNOWN;

        const message = error.message?.toLowerCase() || '';
        const name = error.name?.toLowerCase() || '';

        // خطاهای شبکه
        if (message.includes('network') || message.includes('fetch') || name === 'networkerror') {
            return ErrorType.NETWORK;
        }

        // خطاهای احراز هویت
        if (message.includes('auth') || message.includes('unauthorized') || message.includes('token')) {
            return ErrorType.AUTH;
        }

        // خطاهای validation
        if (message.includes('validation') || message.includes('invalid')) {
            return ErrorType.VALIDATION;
        }

        // خطاهای دیتابیس
        if (message.includes('database') || message.includes('supabase') || message.includes('query')) {
            return ErrorType.DATABASE;
        }

        // خطاهای دسترسی
        if (message.includes('permission') || message.includes('forbidden') || message.includes('access denied')) {
            return ErrorType.PERMISSION;
        }

        // خطاهای not found
        if (message.includes('not found') || message.includes('404')) {
            return ErrorType.NOT_FOUND;
        }

        return ErrorType.UNKNOWN;
    }

    /**
     * تعیین severity خطا
     */
    private determineSeverity(type: ErrorType): ErrorSeverity {
        const severityMap = {
            [ErrorType.NETWORK]: ErrorSeverity.MEDIUM,
            [ErrorType.AUTH]: ErrorSeverity.HIGH,
            [ErrorType.VALIDATION]: ErrorSeverity.LOW,
            [ErrorType.DATABASE]: ErrorSeverity.HIGH,
            [ErrorType.PERMISSION]: ErrorSeverity.MEDIUM,
            [ErrorType.NOT_FOUND]: ErrorSeverity.LOW,
            [ErrorType.UNKNOWN]: ErrorSeverity.MEDIUM,
        };
        return severityMap[type];
    }

    /**
     * Handle خطا و log کردن آن
     */
    public handleError(
        error: Error | unknown,
        context?: Record<string, any>,
        customType?: ErrorType,
        customSeverity?: ErrorSeverity
    ): AppError {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        const type = customType || this.detectErrorType(errorObj);
        const severity = customSeverity || this.determineSeverity(type);

        const appError: AppError = {
            type,
            severity,
            message: errorObj.message,
            originalError: error,
            context,
            timestamp: new Date(),
            stackTrace: errorObj.stack,
        };

        this.logError(appError);
        return appError;
    }

    /**
     * دریافت پیام user-friendly بر اساس نوع خطا
     */
    public getUserFriendlyMessage(error: AppError, locale: 'fa' | 'en' = 'fa'): string {
        const messages: Record<ErrorType, { fa: string; en: string }> = {
            [ErrorType.NETWORK]: {
                fa: 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.',
                en: 'Connection error. Please check your internet connection.',
            },
            [ErrorType.AUTH]: {
                fa: 'خطا در احراز هویت. لطفاً دوباره وارد شوید.',
                en: 'Authentication error. Please sign in again.',
            },
            [ErrorType.VALIDATION]: {
                fa: 'اطلاعات وارد شده نامعتبر است. لطفاً بررسی کنید.',
                en: 'Invalid data entered. Please check your input.',
            },
            [ErrorType.DATABASE]: {
                fa: 'خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.',
                en: 'Error saving data. Please try again.',
            },
            [ErrorType.PERMISSION]: {
                fa: 'شما اجازه دسترسی به این بخش را ندارید.',
                en: 'You do not have permission to access this section.',
            },
            [ErrorType.NOT_FOUND]: {
                fa: 'اطلاعات درخواستی یافت نشد.',
                en: 'Requested information not found.',
            },
            [ErrorType.UNKNOWN]: {
                fa: 'خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.',
                en: 'An unexpected error occurred. Please try again.',
            },
        };

        return messages[error.type]?.[locale] || messages[ErrorType.UNKNOWN][locale];
    }

    /**
     * دریافت تمام خطاهای ذخیره شده (برای admin panel)
     */
    public getErrors(): AppError[] {
        return [...this.errors];
    }

    /**
     * پاک کردن تمام خطاهای ذخیره شده
     */
    public clearErrors(): void {
        this.errors = [];
    }

    /**
     * دریافت آمار خطاها
     */
    public getErrorStats(): {
        total: number;
        byType: Record<ErrorType, number>;
        bySeverity: Record<ErrorSeverity, number>;
    } {
        const stats = {
            total: this.errors.length,
            byType: {} as Record<ErrorType, number>,
            bySeverity: {} as Record<ErrorSeverity, number>,
        };

        // Initialize counters
        Object.values(ErrorType).forEach(type => {
            stats.byType[type] = 0;
        });
        Object.values(ErrorSeverity).forEach(severity => {
            stats.bySeverity[severity] = 0;
        });

        // Count errors
        this.errors.forEach(error => {
            stats.byType[error.type]++;
            stats.bySeverity[error.severity]++;
        });

        return stats;
    }
}

// Export singleton instance
export const errorHandler = new ErrorHandlerService();

// Export helper functions
export const handleError = (
    error: Error | unknown,
    context?: Record<string, any>,
    type?: ErrorType,
    severity?: ErrorSeverity
) => errorHandler.handleError(error, context, type, severity);

export const getUserFriendlyMessage = (error: AppError, locale: 'fa' | 'en' = 'fa') =>
    errorHandler.getUserFriendlyMessage(error, locale);

export const getErrorStats = () => errorHandler.getErrorStats();
export const getErrors = () => errorHandler.getErrors();
export const clearErrors = () => errorHandler.clearErrors();
