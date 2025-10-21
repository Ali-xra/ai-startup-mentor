import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { upgradeRequestService } from '../services/upgradeRequestService';
import { useAuth } from '../contexts/AuthContext';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: 'projects' | 'ai_messages' | 'phase' | 'team_members' | 'export';
  currentValue?: number;
  maxValue?: number;
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({
  isOpen,
  onClose,
  limitType,
  currentValue,
  maxValue,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const translations = {
    title: {
      fa: ' محدودیت نسخه رایگان',
      en: ' Free Plan Limit Reached',
    },
    beta_message: {
      fa: ' خبر خوب! ما در حال حاضر نسخه بتا را ارائه می‌دهیم',
      en: ' Good News! We are currently in Beta',
    },
    beta_description: {
      fa: 'در دوره بتا، شما می‌توانید **رایگان** نسخه Pro یا Enterprise را دریافت کنید! ما به دنبال بازخورد کاربران هستیم تا محصول را بهبود دهیم.',
      en: 'During Beta, you can get **Pro or Enterprise plan for FREE**! We are looking for user feedback to improve the product.',
    },
    limit_messages: {
      projects: {
        fa: `شما به حداکثر تعداد پروژه‌های مجاز (${maxValue}) رسیده‌اید.`,
        en: `You have reached the maximum number of projects (${maxValue}).`,
      },
      ai_messages: {
        fa: `شما ${currentValue} پیام AI از ${maxValue} پیام مجاز استفاده کرده‌اید.`,
        en: `You have used ${currentValue} out of ${maxValue} AI messages.`,
      },
      phase: {
        fa: `در نسخه رایگان، فقط به مرحله ${maxValue} دسترسی دارید.`,
        en: `In the free plan, you only have access to Phase ${maxValue}.`,
      },
      team_members: {
        fa: 'در نسخه رایگان، قابلیت اشتراک‌گذاری با تیم وجود ندارد.',
        en: 'In the free plan, team sharing is not available.',
      },
      export: {
        fa: 'در نسخه رایگان، قابلیت Export وجود ندارد.',
        en: 'In the free plan, export is not available.',
      },
    },
    pro_features: {
      fa: ' مزایای نسخه Pro (رایگان در دوره بتا):',
      en: ' Pro Plan Benefits (FREE during Beta):',
    },
    features: {
      projects: { fa: '• تا 10 پروژه همزمان', en: '• Up to 10 concurrent projects' },
      ai: { fa: '• 2000 پیام AI', en: '• 2000 AI messages' },
      phases: { fa: '• دسترسی به تمام 8 مرحله', en: '• Access to all 8 phases' },
      team: { fa: '• اشتراک‌گذاری با 10 نفر', en: '• Share with 10 team members' },
      export: { fa: '• Export به PDF, Word, Excel', en: '• Export to PDF, Word, Excel' },
      priority: { fa: '• پشتیبانی اولویت‌دار', en: '• Priority support' },
    },
    enterprise_features: {
      fa: ' مزایای نسخه Enterprise (رایگان در دوره بتا):',
      en: ' Enterprise Plan Benefits (FREE during Beta):',
    },
    enterprise_list: {
      unlimited: { fa: '• پروژه و AI نامحدود', en: '• Unlimited projects & AI' },
      all_phases: { fa: '• تمام مراحل', en: '• All phases' },
      unlimited_team: { fa: '• اعضای تیم نامحدود', en: '• Unlimited team members' },
      advanced_export: { fa: '• Export پیشرفته', en: '• Advanced export options' },
      api: { fa: '• دسترسی API', en: '• API access' },
      dedicated: { fa: '• پشتیبانی اختصاصی', en: '• Dedicated support' },
    },
    request_button: {
      fa: ' درخواست ارتقا رایگان',
      en: ' Request Free Upgrade',
    },
    feedback_note: {
      fa: ' توجه: پس از استفاده، لطفاً بازخورد خود را با ما به اشتراک بگذارید.',
      en: ' Note: After using, please share your feedback with us.',
    },
    close: { fa: 'بستن', en: 'Close' },
    success_title: { fa: ' درخواست شما ارسال شد!', en: ' Request Submitted!' },
    success_message: {
      fa: 'درخواست شما با موفقیت ثبت شد. ما در اسرع وقت آن را بررسی و فعال خواهیم کرد. ایمیل تاییدیه برای شما ارسال می‌شود.',
      en: 'Your request has been submitted successfully. We will review and activate it as soon as possible. You will receive a confirmation email.',
    },
    submitting: { fa: 'در حال ارسال...', en: 'Submitting...' },
  };

  const t = (key: keyof typeof translations) => {
    // @ts-expect-error - Complex union type indexing
    return translations[key][language as 'fa' | 'en'];
  };

  const handleRequestUpgrade = async () => {
    if (!user) {
      setError(language === 'fa' ? 'لطفاً ابتدا وارد شوید' : 'Please login first');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await upgradeRequestService.createUpgradeRequest(user.id, 'pro');
      setIsSuccess(true);
    } catch (err: any) {
      if (err.message.includes('already have a pending request')) {
        setError(
          language === 'fa'
            ? 'شما قبلاً یک درخواست در حال بررسی دارید.'
            : 'You already have a pending request.'
        );
      } else {
        setError(
          language === 'fa'
            ? 'خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.'
            : 'Error submitting request. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      dir={language === 'fa' ? 'rtl' : 'ltr'}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold">{t('title')}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!isSuccess ? (
            <>
              {/* Limit Message */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  {translations.limit_messages[limitType][language as 'fa' | 'en']}
                </p>
              </div>

              {/* Beta Message */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                  {t('beta_message')}
                </h3>
                <p className="text-purple-800 dark:text-purple-200">{t('beta_description')}</p>
              </div>

              {/* Pro Features */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3">
                  {t('pro_features')}
                </h4>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <p>{translations.features.projects[language as 'fa' | 'en']}</p>
                  <p>{translations.features.ai[language as 'fa' | 'en']}</p>
                  <p>{translations.features.phases[language as 'fa' | 'en']}</p>
                  <p>{translations.features.team[language as 'fa' | 'en']}</p>
                  <p>{translations.features.export[language as 'fa' | 'en']}</p>
                  <p>{translations.features.priority[language as 'fa' | 'en']}</p>
                </div>
              </div>

              {/* Enterprise Features */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="font-bold text-lg text-amber-900 dark:text-amber-100 mb-3">
                  {t('enterprise_features')}
                </h4>
                <div className="space-y-2 text-amber-800 dark:text-amber-200">
                  <p>{translations.enterprise_list.unlimited[language as 'fa' | 'en']}</p>
                  <p>{translations.enterprise_list.all_phases[language as 'fa' | 'en']}</p>
                  <p>{translations.enterprise_list.unlimited_team[language as 'fa' | 'en']}</p>
                  <p>{translations.enterprise_list.advanced_export[language as 'fa' | 'en']}</p>
                  <p>{translations.enterprise_list.api[language as 'fa' | 'en']}</p>
                  <p>{translations.enterprise_list.dedicated[language as 'fa' | 'en']}</p>
                </div>
              </div>

              {/* Feedback Note */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">{t('feedback_note')}</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 flex-col sm:flex-row">
                <button
                  onClick={handleRequestUpgrade}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? t('submitting') : t('request_button')}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  {t('close')}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center py-8">
                <div className="text-6xl mb-4"></div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {t('success_title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{t('success_message')}</p>
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {t('close')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LimitReachedModal;
