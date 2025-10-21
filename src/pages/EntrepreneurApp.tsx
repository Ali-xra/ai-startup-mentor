import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { checkAuth } from '../auth-check';
import { Loader } from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';

// Import entrepreneur components
import { EntrepreneurLayout } from '../components/entrepreneur/EntrepreneurLayout';
import { EntrepreneurDashboard } from '../components/entrepreneur/EntrepreneurDashboard';
import { ProjectsList } from '../components/entrepreneur/ProjectsList';
import { ProjectWorkspace } from '../components/entrepreneur/ProjectWorkspace';
import { EntrepreneurProfile } from '../components/entrepreneur/EntrepreneurProfile';
import MarketplacePage from './MarketplacePage';

import '../index.css';

/**
 * Wrapper با auth check قبل از render
 * فقط برای entrepreneur dashboard
 */
const EntrepreneurAppWithAuthCheck: React.FC = () => {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // چک کردن auth قبل از render - بدون redirect
    checkAuth().then(() => {
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

  return (
    <ErrorBoundary>
      <Routes>
        {/* Layout با صفحات مختلف */}
        <Route path="/" element={<EntrepreneurLayout />}>
          {/* صفحه اصلی داشبورد */}
          <Route index element={<EntrepreneurDashboard />} />

          {/* لیست پروژه‌ها */}
          <Route path="projects" element={<ProjectsList />} />

          {/* بازار پروژه‌ها */}
          <Route path="marketplace" element={<MarketplacePage />} />

          {/* کار روی پروژه */}
          <Route path="project/:projectId" element={<ProjectWorkspace />} />

          {/* پروفایل */}
          <Route path="profile" element={<EntrepreneurProfile />} />
        </Route>

        {/* Redirect any other path to dashboard */}
        <Route path="*" element={<Navigate to="/entrepreneur" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default EntrepreneurAppWithAuthCheck;
