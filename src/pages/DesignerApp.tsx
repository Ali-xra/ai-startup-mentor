import React, { useEffect, useState } from 'react';
import '../index.css';
import { supabase } from '../services/supabaseClient';
import { checkAndRedirect } from '../auth-check';
import { Loader } from '../components/Loader';

/**
 * ================================================
 * Designer Dashboard - HTML Mockup (No Backend)
 * ================================================
 */

type DesignerPage = 'dashboard' | 'projects' | 'portfolio' | 'profile';

const DesignerDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<DesignerPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  // Mock Data
  const stats = {
    activeProjects: 12,
    totalDesigns: 48,
    portfolioViews: 1240,
    totalEarnings: '28,000,000',
  };

  const mockProjects = [
    {
      id: 1,
      title: 'لوگوی شرکت تک‌سان',
      client: 'شرکت تک‌سان',
      status: 'در حال انجام',
      deadline: '1403/08/15',
      budget: '5,000,000',
    },
    {
      id: 2,
      title: 'طراحی UI اپلیکیشن',
      client: 'استارتاپ نوآوران',
      status: 'در حال انجام',
      deadline: '1403/08/20',
      budget: '12,000,000',
    },
    {
      id: 3,
      title: 'بنر تبلیغاتی',
      client: 'فروشگاه آنلاین',
      status: 'در انتظار تایید',
      deadline: '1403/08/10',
      budget: '3,000,000',
    },
  ];

  const portfolioItems = [
    { id: 1, title: 'طراحی لوگو', category: 'برندینگ', likes: 124, views: 856 },
    { id: 2, title: 'رابط کاربری داشبورد', category: 'UI/UX', likes: 89, views: 642 },
    { id: 3, title: 'پوستر تبلیغاتی', category: 'گرافیک', likes: 156, views: 1023 },
  ];

  // Render Functions
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-purple-100 dark:border-purple-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">پروژه‌های فعال</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {stats.activeProjects}
              </p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-pink-100 dark:border-pink-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">مجموع طرح‌ها</p>
              <p className="text-3xl font-bold text-pink-600 dark:text-pink-400 mt-2">
                {stats.totalDesigns}
              </p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-rose-100 dark:border-rose-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">بازدید پورتفولیو</p>
              <p className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-2">
                {stats.portfolioViews}
              </p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-fuchsia-100 dark:border-fuchsia-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">درآمد کل</p>
              <p className="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400 mt-2">
                {stats.totalEarnings} تومان
              </p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">پروژه‌های اخیر</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  عنوان
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  کارفرما
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  وضعیت
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  ددلاین
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  بودجه
                </th>
              </tr>
            </thead>
            <tbody>
              {mockProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <td className="py-3 px-4 text-slate-900 dark:text-white">{project.title}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{project.client}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'در حال انجام'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {project.deadline}
                  </td>
                  <td className="py-3 px-4 text-slate-900 dark:text-white font-semibold">
                    {project.budget} تومان
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Portfolio Highlights */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          برگزیده‌های پورتفولیو
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-md mb-3 flex items-center justify-center">
                <span className="text-5xl"></span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{item.category}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                <span> {item.likes}</span>
                <span> {item.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">پروژه‌های من</h2>
      <div className="space-y-4">
        {mockProjects.map((project) => (
          <div
            key={project.id}
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  کارفرما: {project.client}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'در حال انجام'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                }`}
              >
                {project.status}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <span> ددلاین: {project.deadline}</span>
              <span> بودجه: {project.budget} تومان</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors">
                مشاهده جزئیات
              </button>
              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-md text-sm transition-colors">
                آپلود فایل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">پورتفولیو من</h2>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors">
          + افزودن کار جدید
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div
            key={item.id}
            className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <span className="text-6xl"></span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{item.category}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-500">
                  <span> {item.likes}</span>
                  <span> {item.views}</span>
                </div>
                <button className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
                  ویرایش
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">پروفایل من</h2>
      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            نام و نام خانوادگی
          </label>
          <input
            type="text"
            defaultValue="سارا محمدی"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            ایمیل
          </label>
          <input
            type="email"
            defaultValue="sara.designer@example.com"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            تخصص
          </label>
          <select
            defaultValue="ui-ux"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="ui-ux">UI/UX Design</option>
            <option value="graphic">Graphic Design</option>
            <option value="branding">Branding</option>
            <option value="illustration">Illustration</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            ابزارهای طراحی
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch', 'InVision'].map((tool) => (
              <label key={tool} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-slate-700 dark:text-slate-300">{tool}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            درباره من
          </label>
          <textarea
            rows={4}
            defaultValue="طراح UI/UX با 5 سال سابقه کار در حوزه طراحی اپلیکیشن موبایل و وب. علاقه‌مند به ایجاد تجربه کاربری منحصربه‌فرد."
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            نرخ ساعتی (تومان)
          </label>
          <input
            type="text"
            defaultValue="500,000"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            readOnly
          />
        </div>

        <div className="pt-4">
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-purple-600 to-fuchsia-600 dark:from-purple-800 dark:to-fuchsia-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">پنل طراح </h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-purple-700/50 rounded-lg transition-colors"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: '', label: 'داشبورد' },
            { id: 'projects', icon: '', label: 'پروژه‌ها' },
            { id: 'portfolio', icon: '', label: 'پورتفولیو' },
            { id: 'profile', icon: '', label: 'پروفایل' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as DesignerPage)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-purple-500/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-red-200"
          >
            <span className="text-xl"></span>
            {sidebarOpen && <span>خروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {currentPage === 'dashboard' && renderDashboard()}
          {currentPage === 'projects' && renderProjects()}
          {currentPage === 'portfolio' && renderPortfolio()}
          {currentPage === 'profile' && renderProfile()}
        </div>
      </main>
    </div>
  );
};

/**
 * Wrapper with auth check
 */
const DesignerAppWithAuthCheck: React.FC = () => {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAndRedirect('designer').then(() => {
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

  return <DesignerDashboard />;
};

export default DesignerAppWithAuthCheck;
