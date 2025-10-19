import React from 'react';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { Locale } from '../i18n';

interface PlanBadgeProps {
  locale: Locale;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ locale }) => {
  const { planName, maxProjects, aiCredits, maxTeamMembers, maxPhase } = useFeatureFlags();

  const planColors: Record<string, { bg: string; text: string; border: string }> = {
    Free: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-600',
    },
    Starter: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
    },
    Pro: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-300 dark:border-purple-700',
    },
    Enterprise: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-300 dark:border-yellow-700',
    },
  };

  const colors = planColors[planName] || planColors.Free;

  const getPlanEmoji = (plan: string) => {
    switch (plan) {
      case 'Starter':
        return '🚀';
      case 'Pro':
        return '💎';
      case 'Enterprise':
        return '👑';
      default:
        return '🆓';
    }
  };

  return (
    <div className={`${colors.bg} ${colors.text} border ${colors.border} rounded-lg p-3 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getPlanEmoji(planName)}</span>
          <div>
            <h3 className="font-bold text-lg">{planName} Plan</h3>
            <p className="text-xs opacity-75">
              {locale === 'fa' ? 'پلن فعلی شما' : 'Your Current Plan'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between">
          <span className="opacity-75">{locale === 'fa' ? '📁 پروژه‌ها:' : '📁 Projects:'}</span>
          <span className="font-semibold">
            {maxProjects === Infinity ? (locale === 'fa' ? 'نامحدود' : 'Unlimited') : maxProjects}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="opacity-75">{locale === 'fa' ? '🤖 پیام AI:' : '🤖 AI Messages:'}</span>
          <span className="font-semibold">
            {aiCredits === Infinity ? (locale === 'fa' ? 'نامحدود' : 'Unlimited') : aiCredits}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="opacity-75">
            {locale === 'fa' ? '👥 اعضای تیم:' : '👥 Team Members:'}
          </span>
          <span className="font-semibold">
            {maxTeamMembers === Infinity
              ? locale === 'fa'
                ? 'نامحدود'
                : 'Unlimited'
              : maxTeamMembers}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="opacity-75">{locale === 'fa' ? '🎯 مراحل:' : '🎯 Phases:'}</span>
          <span className="font-semibold">
            {locale === 'fa' ? `تا مرحله ${maxPhase}` : `Up to Phase ${maxPhase}`}
          </span>
        </div>
      </div>

      {planName === 'Free' && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <a
            href="/pricing"
            className="block text-center px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            {locale === 'fa' ? '⬆️ ارتقای پلن' : '⬆️ Upgrade Plan'}
          </a>
        </div>
      )}
    </div>
  );
};
