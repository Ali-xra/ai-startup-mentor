/**
 * ==========================================
 * Consultant Panel - HTML Mockup (Compact)
 * ==========================================
 * پنل مشاور - فقط HTML برای نمایش
 * TODO: Backend بعداً اضافه می‌شه
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { checkAndRedirect } from '../auth-check';
import { Loader } from '../components/Loader';
import '../index.css';

type ConsultantPage = 'dashboard' | 'consultations' | 'sessions' | 'profile';

const ConsultantDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<ConsultantPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock Data
  const stats = {
    totalRequests: 18,
    activeConsultations: 5,
    completedSessions: 42,
    totalEarnings: '32,000,000',
  };

  const consultations = [
    {
      id: 1,
      startup: 'اپلیکیشن آموزشی آنلاین',
      entrepreneur: 'سارا احمدی',
      topic: 'استراتژی بازاریابی',
      status: 'pending',
      requestDate: '2 روز پیش',
      budget: '5 میلیون',
    },
    {
      id: 2,
      startup: 'پلتفرم تجارت الکترونیک',
      entrepreneur: 'رضا کریمی',
      topic: 'مدل درآمدی و قیمت‌گذاری',
      status: 'active',
      requestDate: '5 روز پیش',
      budget: '8 میلیون',
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          داشبورد مشاور
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          به پنل خود خوش آمدید! 🎯
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">درخواست‌های جدید</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                {stats.totalRequests}
              </p>
            </div>
            <span className="text-3xl">📬</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">مشاوره‌های فعال</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                {stats.activeConsultations}
              </p>
            </div>
            <span className="text-3xl">💼</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">جلسات انجام شده</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {stats.completedSessions}
              </p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">درآمد کل</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                {stats.totalEarnings} ت
              </p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
      </div>

      {/* Recent Consultations */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            درخواست‌های مشاوره
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">
                      {consultation.startup}
                    </h3>
                    {consultation.status === 'pending' && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded">
                        در انتظار
                      </span>
                    )}
                    {consultation.status === 'active' && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">
                        فعال
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    کارآفرین: {consultation.entrepreneur} • {consultation.requestDate}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                    <span>📋 {consultation.topic}</span>
                    <span>💰 {consultation.budget}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {consultation.status === 'pending' && (
                    <>
                      <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm">
                        پذیرش
                      </button>
                      <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm">
                        رد کردن
                      </button>
                    </>
                  )}
                  {consultation.status === 'active' && (
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                      مشاهده جزئیات
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConsultations = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
        درخواست‌های مشاوره
      </h1>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
        <span className="text-6xl">📬</span>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">
          تمام درخواست‌های مشاوره
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          لیست کامل درخواست‌ها با فیلتر و جستجو
        </p>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
        جلسات من
      </h1>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
        <span className="text-6xl">📅</span>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">
          جلسات برنامه‌ریزی شده
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          تقویم و زمان‌بندی جلسات مشاوره
        </p>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
        پروفایل من
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            اطلاعات پایه
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                placeholder="دکتر علی رضایی"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                تخصص اصلی
              </label>
              <input
                type="text"
                placeholder="مشاور استراتژی کسب‌وکار"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                زمینه‌های تخصصی
              </label>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg">
                  بازاریابی دیجیتال
                </span>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg">
                  مدل کسب‌وکار
                </span>
                <button className="px-3 py-1 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                  + افزودن
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                نرخ ساعتی (تومان)
              </label>
              <input
                type="text"
                placeholder="2,000,000"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            تصویر پروفایل
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-5xl">
              👨‍💼
            </div>
            <button className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm">
              تغییر عکس
            </button>
            <div className="mt-6 w-full space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">امتیاز</span>
                <span className="font-bold text-yellow-600">⭐ 4.9/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">نظرات</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">38</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-emerald-600 dark:bg-emerald-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-emerald-500">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">پنل مشاور</h1>
                <p className="text-xs text-emerald-200 mt-1">Consultant</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-emerald-500 rounded-lg"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: '📊', label: 'داشبورد' },
            { id: 'consultations', icon: '📬', label: 'درخواست‌ها' },
            { id: 'sessions', icon: '📅', label: 'جلسات' },
            { id: 'profile', icon: '👤', label: 'پروفایل' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as ConsultantPage)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-emerald-700 dark:bg-emerald-800'
                  : 'hover:bg-emerald-500'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-emerald-500">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-sm"
          >
            {isSidebarOpen ? 'خروج' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {currentPage === 'dashboard' && 'داشبورد'}
            {currentPage === 'consultations' && 'درخواست‌های مشاوره'}
            {currentPage === 'sessions' && 'جلسات من'}
            {currentPage === 'profile' && 'پروفایل'}
          </h2>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {currentPage === 'dashboard' && renderDashboard()}
          {currentPage === 'consultations' && renderConsultations()}
          {currentPage === 'sessions' && renderSessions()}
          {currentPage === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

// Wrapper with auth check
const ConsultantApp: React.FC = () => {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAndRedirect('consultant').then(() => {
      setAuthChecked(true);
    });
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <ConsultantDashboard />;
};

export default ConsultantApp;
