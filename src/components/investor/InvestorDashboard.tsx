// ==========================================
// Component: InvestorDashboard
// داشبورد سرمایه‌گذار
// ==========================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestorAuth } from '../../hooks/useInvestorAuth';
import { investorProfileService } from '../../services/investorProfileService';
import { connectionService } from '../../services/connectionService';
import type { InvestorDashboardStats } from '../../types/investor';

export const InvestorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, investorProfile, isInvestor, loading: authLoading } = useInvestorAuth();

  const [stats, setStats] = useState<InvestorDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isInvestor) {
      // اگر کاربر investor نیست، redirect
      navigate('/');
      return;
    }

    if (user?.id) {
      loadDashboardData();
    }
  }, [user, authLoading, isInvestor]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const dashboardStats = await investorProfileService.getDashboardStats(user.id);
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!isInvestor || !investorProfile) {
    return null;
  }

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                داشبورد سرمایه‌گذار
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                خوش آمدید، {profile?.name || 'سرمایه‌گذار'}
              </p>
            </div>

            {/* Tier Badge */}
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium ${tierBadgeColors[investorProfile.tier]}`}
            >
              {tierLabels[investorProfile.tier]}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Saved Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">پروژه‌های ذخیره شده</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats?.saved_projects_count || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Connections */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">درخواست‌های در انتظار</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats?.pending_connections || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Accepted Connections */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">اتصالات فعال</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats?.accepted_connections || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Monthly Views */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">بازدیدهای ماهانه</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats?.monthly_views_remaining === -1
                    ? '∞'
                    : stats?.monthly_views_remaining || 0}
                </p>
                {investorProfile.tier === 'free' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">از 10</p>
                )}
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">دسترسی سریع</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/investor/explore')}
              className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">جستجوی پروژه</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">کشف پروژه‌های جدید</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/investor/saved')}
              className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">پروژه‌های ذخیره شده</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats?.saved_projects_count || 0} پروژه
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/investor/connections')}
              className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <svg
                className="w-8 h-8 text-purple-600 dark:text-purple-400 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">اتصالات من</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats?.accepted_connections || 0} فعال
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Profile Completion */}
        {investorProfile.tier === 'free' && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  حساب خود را ارتقا دهید
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  با تایید حساب، دسترسی نامحدود به پروژه‌ها و امکانات ویژه را دریافت کنید
                </p>
                <button
                  onClick={() => navigate('/investor/verification')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  درخواست تایید حساب
                </button>
              </div>
              <svg
                className="w-16 h-16 text-blue-400 dark:text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
