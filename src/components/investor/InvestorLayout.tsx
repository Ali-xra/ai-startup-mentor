import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useInvestorAuth } from '../../hooks/useInvestorAuth';
import { supabase } from '../../services/supabaseClient';
import LanguageSelector from '../LanguageSelector';

/**
 * InvestorLayout
 * Layout اصلی برای تمام صفحات Investor Portal
 * شامل: Header, Navigation, Sidebar
 */
export const InvestorLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, investorProfile } = useInvestorAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect به صفحه لاگین
    window.location.href = '/login';
  };

  // لیست منوها
  const navItems = [
    {
      name: 'داشبورد',
      path: '/investor',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'کشف پروژه‌ها',
      path: '/investor/explore',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      name: 'ذخیره شده',
      path: '/investor/saved',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      ),
    },
    {
      name: 'اتصالات',
      path: '/investor/connections',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/investor') {
      return location.pathname === '/investor';
    }
    return location.pathname.startsWith(path);
  };

  const tierBadgeColors = {
    free: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    verified: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };

  const tierLabels = {
    free: 'رایگان',
    verified: 'تایید شده',
    premium: 'پرمیوم',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/investor" className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    پورتال سرمایه‌گذار
                  </h1>
                </div>
              </Link>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-4 space-x-reverse">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="mr-2">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Language Selector */}
            <LanguageSelector />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 space-x-reverse focus:outline-none"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {profile?.name || 'سرمایه‌گذار'}
                  </p>
                  {investorProfile && (
                    <p
                      className={`text-xs px-2 py-0.5 rounded-full inline-block ${tierBadgeColors[investorProfile.tier]}`}
                    >
                      {tierLabels[investorProfile.tier]}
                    </p>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {profile?.name?.charAt(0).toUpperCase() || 'I'}
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>

                  {/* Menu */}
                  <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {profile?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/investor"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        داشبورد
                      </Link>
                      <Link
                        to="/investor/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        تنظیمات پروفایل
                      </Link>
                      {investorProfile?.tier === 'free' && (
                        <Link
                          to="/investor/verification"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          ارتقا حساب
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-right px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        خروج
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <nav className="flex justify-around py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg ${
                  isActivePath(item.path)
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};
