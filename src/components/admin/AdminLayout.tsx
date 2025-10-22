import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import LanguageSelector from '../LanguageSelector';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'users' | 'upgrade-requests' | 'audit';
  onNavigate: (page: 'dashboard' | 'users' | 'upgrade-requests' | 'audit') => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { t } = useTranslation('admin');
  const { user, signOut } = useAuth();
  const { isSuperAdmin } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  type AdminPage = 'dashboard' | 'users' | 'upgrade-requests' | 'audit';

  const menuItems: Array<{ id: AdminPage; icon: string; labelKey: string; enabled: boolean }> = [
    { id: 'dashboard', icon: '', labelKey: 'dashboard', enabled: true },
    { id: 'users', icon: '', labelKey: 'users', enabled: true },
    { id: 'upgrade-requests', icon: '', labelKey: 'upgrade_requests', enabled: true },
    { id: 'audit', icon: '', labelKey: 'audit_log', enabled: isSuperAdmin },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-indigo-600 dark:bg-indigo-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-indigo-500">
          <div className="flex items-center justify-between mb-3">
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">{t('panel_title')}</h1>
                <p className="text-xs text-indigo-200 mt-1">Admin Panel</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>
          {isSidebarOpen && (
            <div className="flex justify-center">
              <LanguageSelector />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems
            .filter((item) => item.enabled)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-indigo-700 dark:bg-indigo-800'
                    : 'hover:bg-indigo-500 dark:hover:bg-indigo-800'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                {isSidebarOpen && <span className="font-medium">{t(item.labelKey)}</span>}
              </button>
            ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-indigo-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-xl"></span>
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-indigo-200">
                  {isSuperAdmin ? t('super_admin') : t('admin')}
                </p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <button
              onClick={signOut}
              className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg transition-colors text-sm font-medium"
            >
              {t('logout')}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {t(menuItems.find((item) => item.id === currentPage)?.labelKey || 'dashboard')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {t('system_management')}
            </p>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </div>
    </div>
  );
};
