import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Import pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import EntrepreneurApp from './pages/EntrepreneurApp';
import InvestorApp from './pages/InvestorApp';
import ProgrammerApp from './pages/ProgrammerApp';
import ConsultantApp from './pages/ConsultantApp';
import DesignerApp from './pages/DesignerApp';
import AdminApp from './pages/AdminApp';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';

// Protected Route Component
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  // Force dark theme globally for all pages
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Protected Routes */}
            <Route
              path="/app/*"
              element={
                <ProtectedRoute requiredRole="entrepreneur">
                  <EntrepreneurApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/investor/*"
              element={
                <ProtectedRoute requiredRole="investor">
                  <InvestorApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/programmer/*"
              element={
                <ProtectedRoute requiredRole="programmer">
                  <ProgrammerApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultant/*"
              element={
                <ProtectedRoute requiredRole="consultant">
                  <ConsultantApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/designer/*"
              element={
                <ProtectedRoute requiredRole="designer">
                  <DesignerApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminApp />
                </ProtectedRoute>
              }
            />

            {/* Redirect old paths */}
            <Route path="/login.html" element={<Navigate to="/login" replace />} />
            <Route path="/investor.html" element={<Navigate to="/investor" replace />} />
            <Route path="/programmer.html" element={<Navigate to="/programmer" replace />} />
            <Route path="/consultant.html" element={<Navigate to="/consultant" replace />} />
            <Route path="/designer.html" element={<Navigate to="/designer" replace />} />
            <Route path="/admin.html" element={<Navigate to="/admin" replace />} />
            <Route path="/pricing.html" element={<Navigate to="/pricing" replace />} />
            <Route path="/about.html" element={<Navigate to="/about" replace />} />

            {/* Catch all - 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
