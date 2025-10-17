import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UnifiedAuth } from '../components/auth/UnifiedAuth';
import { AuthProvider } from '../contexts/AuthContext';
import '../index.css';

/**
 * Entry Point برای صفحه Unified Auth
 *
 * این صفحه هم Login و هم Signup رو پوشش می‌ده
 * با امکان انتخاب نقش (Entrepreneur یا Investor)
 */

const AuthApp: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UnifiedAuth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AuthApp />
    </AuthProvider>
  </React.StrictMode>
);
