import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import LanguageSelector from '../LanguageSelector';

/**
 * EntrepreneurLayout
 * Layout اصلی برای تمام صفحات پنل کارآفرین
 * شامل: Sidebar, Navigation, Header
 */
export const EntrepreneurLayout: React.FC = () => {
  const { t } = useTranslation('entrepreneur');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  // لیست منوها
  const navItems = [
    {
      nameKey: 'dashboard',
      path: '/entrepreneur',
      icon: '',
    },
    {
      nameKey: 'my_projects',
      path: '/entrepreneur/projects',
      icon: '',
    },
    {
      nameKey: 'marketplace',
      path: '/entrepreneur/marketplace',
      icon: '',
    },
    {
      nameKey: 'profile',
      path: '/entrepreneur/profile',
      icon: '',
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/entrepreneur') {
      return location.pathname === '/entrepreneur';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 text-white transition-all duration-300 flex flex-col shadow-xl`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">{t('panel_title')}</h1>
                <p className="text-xs text-purple-200 mt-1">Entrepreneur Panel</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActivePath(item.path) ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span>{t(item.nameKey)}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl"></span>
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-purple-200">{t('entrepreneur')}</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
            >
              <span></span>
              <span>{t('logout')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
