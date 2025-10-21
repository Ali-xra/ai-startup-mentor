/**
 * ==========================================
 * Programmer Panel - HTML Mockup (Compact)
 * ==========================================
 * پنل برنامه‌نویس - فقط HTML برای نمایش
 * TODO: Backend بعداً اضافه می‌شه
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { checkAndRedirect } from '../auth-check';
import { Loader } from '../components/Loader';
import '../index.css';

type ProgrammerPage = 'dashboard' | 'browse' | 'applications' | 'profile';

const ProgrammerDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<ProgrammerPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock Data
  const stats = {
    availableProjects: 24,
    myApplications: 5,
    acceptedProjects: 2,
    totalEarnings: '15,000,000',
  };

  const projects = [
    {
      id: 1,
      title: 'اپلیکیشن فروشگاهی',
      company: 'استارتاپ تجارت آنلاین',
      budget: '20-40 میلیون',
      duration: '3 ماه',
      tech: ['React', 'Node.js', 'MongoDB'],
      applicants: 8,
    },
    {
      id: 2,
      title: 'سیستم مدیریت املاک',
      company: 'شرکت ساختمانی نوین',
      budget: '30-50 میلیون',
      duration: '4 ماه',
      tech: ['Next.js', 'PostgreSQL'],
      applicants: 12,
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
          داشبورد برنامه‌نویس
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">به پنل خود خوش آمدید!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">پروژه‌های موجود</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                {stats.availableProjects}
              </p>
            </div>
            <span className="text-3xl"></span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">درخواست‌های من</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                {stats.myApplications}
              </p>
            </div>
            <span className="text-3xl"></span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">پذیرفته شده</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {stats.acceptedProjects}
              </p>
            </div>
            <span className="text-3xl"></span>
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
            <span className="text-3xl"></span>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">پروژه‌های جدید</h2>
        </div>
        <div className="p-6 space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{project.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {project.company}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                    <span> {project.budget}</span>
                    <span> {project.duration}</span>
                    <span> {project.applicants} نفر</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                  مشاهده
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBrowse = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">مرور پروژه‌ها</h1>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
        <span className="text-6xl"></span>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">
          لیست کامل پروژه‌ها
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          اینجا می‌تونید تمام پروژه‌های موجود رو ببینید و فیلتر کنید
        </p>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">درخواست‌های من</h1>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
        <span className="text-6xl"></span>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">
          درخواست‌های ارسالی
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          لیست تمام درخواست‌هایی که ارسال کردید
        </p>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">پروفایل من</h1>
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
                placeholder="علی محمدی"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                عنوان شغلی
              </label>
              <input
                type="text"
                placeholder="Full Stack Developer"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                مهارت‌ها
              </label>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                  React
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                  TypeScript
                </span>
                <button className="px-3 py-1 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                  + افزودن
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            تصویر پروفایل
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-5xl"></div>
            <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
              تغییر عکس
            </button>
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
        } bg-indigo-600 dark:bg-indigo-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-indigo-500">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">پنل برنامه‌نویس</h1>
                <p className="text-xs text-indigo-200 mt-1">Programmer</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-indigo-500 rounded-lg"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: '', label: 'داشبورد' },
            { id: 'browse', icon: '', label: 'مرور پروژه‌ها' },
            { id: 'applications', icon: '', label: 'درخواست‌ها' },
            { id: 'profile', icon: '', label: 'پروفایل' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as ProgrammerPage)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id ? 'bg-indigo-700 dark:bg-indigo-800' : 'hover:bg-indigo-500'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-indigo-500">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-sm"
          >
            {isSidebarOpen ? 'خروج' : ''}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {currentPage === 'dashboard' && 'داشبورد'}
            {currentPage === 'browse' && 'مرور پروژه‌ها'}
            {currentPage === 'applications' && 'درخواست‌های من'}
            {currentPage === 'profile' && 'پروفایل'}
          </h2>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {currentPage === 'dashboard' && renderDashboard()}
          {currentPage === 'browse' && renderBrowse()}
          {currentPage === 'applications' && renderApplications()}
          {currentPage === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

// Wrapper with auth check
const ProgrammerApp: React.FC = () => {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAndRedirect('programmer').then(() => {
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

  return <ProgrammerDashboard />;
};

export default ProgrammerApp;
