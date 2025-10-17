import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InvestorLayout } from './InvestorLayout';
import { InvestorProfileSetup } from './InvestorProfileSetup';
import { InvestorDashboard } from './InvestorDashboard';
import { ProjectExplorer } from './ProjectExplorer';
import { ProjectDetail } from './ProjectDetail';
import { SavedProjects } from './SavedProjects';
import { useInvestorAuth } from '../../hooks/useInvestorAuth';

/**
 * Protected Route Component
 * فقط سرمایه‌گذارهای لاگین شده می‌تونن دسترسی داشته باشن
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useInvestorAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-600 dark:text-slate-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect به صفحه لاگین اصلی
    window.location.href = '/login.html';
    return null;
  }

  return <>{children}</>;
};

/**
 * InvestorRouter
 * مسیریابی کامل برای Investor Portal
 */
export const InvestorRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - صفحات عمومی */}
        <Route path="/investor/profile-setup" element={<InvestorProfileSetup />} />

        {/* Protected routes - صفحات محافظت شده */}
        <Route
          path="/investor"
          element={
            <ProtectedRoute>
              <InvestorLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard - صفحه اصلی */}
          <Route index element={<InvestorDashboard />} />

          {/* Project Discovery - کشف پروژه‌ها */}
          <Route path="explore" element={<ProjectExplorer />} />
          <Route path="project/:projectId" element={<ProjectDetail />} />

          {/* Saved Projects - پروژه‌های ذخیره شده */}
          <Route path="saved" element={<SavedProjects />} />

          {/* Connections - اتصالات (بعداً پیاده می‌شه) */}
          <Route path="connections" element={<div className="p-8 text-center text-slate-600 dark:text-slate-400">صفحه Connections به زودی...</div>} />

          {/* Verification - درخواست تایید حساب (بعداً) */}
          <Route path="verification" element={<div className="p-8 text-center text-slate-600 dark:text-slate-400">صفحه Verification به زودی...</div>} />
        </Route>

        {/* Fallback - redirect به dashboard */}
        <Route path="*" element={<Navigate to="/investor" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
