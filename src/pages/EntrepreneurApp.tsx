import React, { useEffect, useState } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import AppContent from './AppContent';
import '../index.css';
import { checkAndRedirect, checkAuth } from '../auth-check';
import { Loader } from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';

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

  return <AppContent />;
};

export default EntrepreneurAppWithAuthCheck;
