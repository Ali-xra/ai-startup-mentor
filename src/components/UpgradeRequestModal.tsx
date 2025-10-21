import React, { useState } from 'react';
import { Locale } from '../i18n';
import { Loader } from './Loader';

interface UpgradeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  locale: Locale;
}

export const UpgradeRequestModal: React.FC<UpgradeRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  locale,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (key: string) => {
    const translations: Record<string, { fa: string; en: string }> = {
      title: {
        fa: ' به محدودیت نسخه رایگان رسیدید!',
        en: " You've reached the free version limit!",
      },
      message_line1: {
        fa: 'این پلتفرم در حال حاضر در مرحله Beta قرار دارد و ما در حال جمع‌آوری بازخورد کاربران هستیم.',
        en: 'This platform is currently in Beta stage and we are collecting user feedback.',
      },
      message_line2: {
        fa: ' خبر خوب: تا پایان دوره بتا، استفاده از تمامی امکانات رایگان است!',
        en: ' Good news: Until the end of the beta period, all features are free!',
      },
      message_line3: {
        fa: 'برای دریافت دسترسی کامل به تمام مراحل و ابزارها به مدت ۱ ماه، کافیست درخواست خود را ثبت کنید.',
        en: 'To get full access to all phases and tools for 1 month, simply submit your request.',
      },
      message_line4: {
        fa: 'درخواست‌ها در کمترین زمان ممکن بررسی و فعال می‌شوند.',
        en: 'Requests will be reviewed and activated as soon as possible.',
      },
      submit_button: {
        fa: ' ارسال درخواست دسترسی رایگان',
        en: ' Request Free Access',
      },
      cancel_button: {
        fa: 'بستن',
        en: 'Close',
      },
      success_message: {
        fa: ' درخواست شما با موفقیت ارسال شد! تیم ما به زودی آن را بررسی خواهد کرد.',
        en: ' Your request has been successfully submitted! Our team will review it soon.',
      },
      error_message: {
        fa: ' خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.',
        en: ' Error submitting request. Please try again.',
      },
    };
    return translations[key]?.[locale] || key;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
      alert(t('success_message'));
      onClose();
    } catch (error) {
      console.error('Error submitting upgrade request:', error);
      alert(t('error_message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">{t('title')}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
          <div className="space-y-3 text-slate-700 dark:text-slate-300">
            <p className="leading-relaxed">{t('message_line1')}</p>
            <p className="leading-relaxed font-semibold text-green-600 dark:text-green-400">
              {t('message_line2')}
            </p>
            <p className="leading-relaxed">{t('message_line3')}</p>
            <p className="leading-relaxed text-sm text-slate-600 dark:text-slate-400">
              {t('message_line4')}
            </p>
          </div>

          {/* Features preview */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {locale === 'fa' ? 'شامل:' : 'Includes:'}
            </p>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-green-500"></span>
                {locale === 'fa' ? 'دسترسی به تمام 8 مرحله' : 'Access to all 8 phases'}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500"></span>
                {locale === 'fa' ? 'AI نامحدود' : 'Unlimited AI'}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500"></span>
                {locale === 'fa' ? 'Export پیشرفته' : 'Advanced Export'}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500"></span>
                {locale === 'fa' ? 'پشتیبانی اولویت‌دار' : 'Priority Support'}
              </li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div
          className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700"
          dir={locale === 'fa' ? 'rtl' : 'ltr'}
        >
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-semibold disabled:opacity-50"
          >
            {t('cancel_button')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all font-semibold flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader />
                <span>{locale === 'fa' ? 'در حال ارسال...' : 'Submitting...'}</span>
              </>
            ) : (
              t('submit_button')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
