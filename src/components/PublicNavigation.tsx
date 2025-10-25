import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import { Locale } from '../i18n';

/**
 * Navigation Component یکپارچه برای تمام صفحات عمومی
 * این component در تمام صفحات (Landing, Marketplace, Pricing, About) استفاده می‌شود
 * و تضمین می‌کند که navigation بدون تغییر باقی می‌ماند
 */
export const PublicNavigation: React.FC = () => {
  const { t } = useTranslation('common');
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const locale: Locale = language === 'fa' ? 'fa' : 'en';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // تشخیص صفحه فعال برای استایل دادن
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-xl sm:text-2xl">💡</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Startup Mentor
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {t('app_tagline')}
              </p>
            </div>
          </Link>

          {/* Navigation Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Navigation Links */}
            <Link
              to="/"
              className={`px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              {t('nav_home')}
            </Link>

            <Link
              to="/marketplace"
              className={`px-3 py-2 text-xs sm:text-sm font-medium transition-colors hidden sm:block ${
                isActive('/marketplace')
                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              {t('nav_marketplace')}
            </Link>

            <Link
              to="/pricing"
              className={`px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                isActive('/pricing')
                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              {t('nav_pricing')}
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 text-xs sm:text-sm font-medium transition-colors hidden sm:block ${
                isActive('/about')
                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              {t('nav_about_us')}
            </Link>

            {/* Login/Logout Link */}
            {!user ? (
              <Link
                to="/login"
                className={`px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  isActive('/login') || isActive('/auth')
                    ? 'text-purple-600 dark:text-purple-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                {t('nav_login')}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login?switch=true"
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {t('nav_switch_account')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  {t('nav_logout')}
                </button>
              </div>
            )}

            {/* Language Selector - After Login */}
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
};
