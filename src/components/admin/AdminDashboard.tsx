import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">کاربران</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">--</p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">پروژه‌ها</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">--</p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">کاربران فعال</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">--</p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">درآمد ماهانه</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">$--</p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">خوش آمدید! </h2>
        <p className="text-indigo-100 mb-6">
          به پنل مدیریت خوش آمدید. از اینجا می‌توانید تمام جنبه‌های سیستم را مدیریت کنید.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl mb-2"></div>
            <h3 className="font-semibold mb-1">Feature Management</h3>
            <p className="text-sm text-indigo-100">مدیریت فیچرها و دسترسی کاربران</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl mb-2"></div>
            <h3 className="font-semibold mb-1">User Management</h3>
            <p className="text-sm text-indigo-100">مشاهده و مدیریت کاربران</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl mb-2"></div>
            <h3 className="font-semibold mb-1">Audit Log</h3>
            <p className="text-sm text-indigo-100">بررسی تاریخچه تغییرات</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          دسترسی سریع
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors text-left">
            <div className="text-2xl mb-2"></div>
            <div className="font-medium">جستجوی کاربر</div>
            <div className="text-sm opacity-75">پیدا کردن و مدیریت کاربران</div>
          </button>

          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left">
            <div className="text-2xl mb-2"></div>
            <div className="font-medium">فعال‌سازی پلن</div>
            <div className="text-sm opacity-75">اختصاص پلن به کاربر</div>
          </button>

          <button className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left">
            <div className="text-2xl mb-2"></div>
            <div className="font-medium">گزارشات</div>
            <div className="text-sm opacity-75">مشاهده آمار و گزارش‌ها</div>
          </button>
        </div>
      </div>
    </div>
  );
};
