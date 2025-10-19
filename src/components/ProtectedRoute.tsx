import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'entrepreneur' | 'investor' | 'programmer' | 'consultant' | 'designer' | 'admin';
}

/**
 * ProtectedRoute
 *
 * این component از AuthContext برای check کردن role استفاده می‌کنه
 * اگر user role مناسب نداشته باشه، به صفحه مناسب redirect می‌شه
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { session, loading, userRole } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader />
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // No role assigned - redirect to role selection (or let the app handle it)
  if (!userRole) {
    // This will be handled by the app itself showing RoleSelection component
    return <>{children}</>;
  }

  // Check if user has the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to correct dashboard based on user's role
    const roleRoutes: Record<string, string> = {
      entrepreneur: '/entrepreneur',
      investor: '/investor',
      programmer: '/programmer',
      consultant: '/consultant',
      designer: '/designer',
      admin: '/admin',
    };

    const redirectPath = roleRoutes[userRole] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
};
