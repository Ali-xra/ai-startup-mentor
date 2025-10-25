import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabaseClient';
import { Locale } from '../i18n';
import { Loader } from './Loader';

interface RoleSelectionProps {
  locale: Locale;
  userId: string;
  onComplete: () => void;
}

type UserRole = 'entrepreneur' | 'investor' | 'programmer' | 'consultant' | 'designer';

export const RoleSelection: React.FC<RoleSelectionProps> = ({ locale, userId, onComplete }) => {
  const { t } = useTranslation('auth');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRole = async () => {
    if (!selectedRole) return;

    setLoading(true);
    setError(null);

    try {
      // گرفتن اطلاعات کاربر از auth.users
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not found');
      }

      // چک کردن اینکه profile موجود هست یا نه
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', userId)
        .maybeSingle();

      if (existingProfile) {
        // اگر profile موجود هست، role و email رو update کن
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            role: selectedRole,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          })
          .eq('id', userId);

        if (updateError) throw updateError;
      } else {
        // اگر profile موجود نیست، جدید بساز با email و name
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userId,
          role: selectedRole,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        });

        if (insertError) throw insertError;
      }

      // برای investor، investor_profile هم بساز (اگر نداره)
      if (selectedRole === 'investor') {
        const { data: existingInvestorProfile } = await supabase
          .from('investor_profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (!existingInvestorProfile) {
          const { error: investorError } = await supabase.from('investor_profiles').insert({
            id: userId,
            tier: 'free',
            monthly_project_views: 0,
          });

          if (investorError) throw investorError;
        }
      }

      // ریدایرکت بر اساس نقش انتخابی (با React Router)
      const rolePages: Record<UserRole, string> = {
        investor: '/investor',
        programmer: '/programmer',
        consultant: '/consultant',
        designer: '/designer',
        entrepreneur: '/entrepreneur',
      };

      window.location.href = rolePages[selectedRole];
    } catch (err: any) {
      console.error('Error saving role:', err);
      setError(err.message || t('role_save_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 font-sans transition-colors duration-300">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl mb-6 shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            {t('role_selection_welcome')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('role_selection_subtitle')}
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          {/* Entrepreneur Card */}
          <button
            onClick={() => setSelectedRole('entrepreneur')}
            disabled={loading}
            className={`relative p-8 rounded-2xl border-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedRole === 'entrepreneur'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-xl'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-purple-300 dark:hover:border-purple-700 shadow-lg'
            }`}
          >
            {selectedRole === 'entrepreneur' && (
              <div className={`absolute top-4 ${locale === 'fa' ? 'left-4' : 'right-4'}`}>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {t('role_entrepreneur')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {t('role_entrepreneur_desc')}
              </p>
            </div>
          </button>

          {/* Investor Card */}
          <button
            onClick={() => setSelectedRole('investor')}
            disabled={loading}
            className={`relative p-8 rounded-2xl border-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedRole === 'investor'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-xl'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-purple-300 dark:hover:border-purple-700 shadow-lg'
            }`}
          >
            {selectedRole === 'investor' && (
              <div className={`absolute top-4 ${locale === 'fa' ? 'left-4' : 'right-4'}`}>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {t('role_investor')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {t('role_investor_desc')}
              </p>
            </div>
          </button>

          {/* Programmer Card */}
          <button
            onClick={() => setSelectedRole('programmer')}
            disabled={loading}
            className={`relative p-8 rounded-2xl border-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedRole === 'programmer'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-xl'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-purple-300 dark:hover:border-purple-700 shadow-lg'
            }`}
          >
            {selectedRole === 'programmer' && (
              <div className={`absolute top-4 ${locale === 'fa' ? 'left-4' : 'right-4'}`}>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {t('role_programmer')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {t('role_programmer_desc')}
              </p>
            </div>
          </button>

          {/* Consultant Card */}
          <button
            onClick={() => setSelectedRole('consultant')}
            disabled={loading}
            className={`relative p-8 rounded-2xl border-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedRole === 'consultant'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-xl'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-purple-300 dark:hover:border-purple-700 shadow-lg'
            }`}
          >
            {selectedRole === 'consultant' && (
              <div className={`absolute top-4 ${locale === 'fa' ? 'left-4' : 'right-4'}`}>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {t('role_consultant')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {t('role_consultant_desc')}
              </p>
            </div>
          </button>

          {/* Designer Card */}
          <button
            onClick={() => setSelectedRole('designer')}
            disabled={loading}
            className={`relative p-8 rounded-2xl border-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedRole === 'designer'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-xl'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-purple-300 dark:hover:border-purple-700 shadow-lg'
            }`}
          >
            {selectedRole === 'designer' && (
              <div className={`absolute top-4 ${locale === 'fa' ? 'left-4' : 'right-4'}`}>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {t('role_designer')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {t('role_designer_desc')}
              </p>
            </div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-start">
            <svg
              className="w-5 h-5 ml-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleSelectRole}
          disabled={!selectedRole || loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader />
              <span className="mr-2">{t('role_saving')}</span>
            </>
          ) : (
            <>
              {t('role_continue')}
              <svg
                className={`w-5 h-5 ${locale === 'fa' ? 'mr-2' : 'ml-2'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={locale === 'fa' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                />
              </svg>
            </>
          )}
        </button>

        {/* Help Text */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          {t('role_change_later')}
        </p>
      </div>
    </div>
  );
};
