import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { Loader } from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'entrepreneur' | 'investor' | 'programmer' | 'consultant' | 'designer' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { session, loading, user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.role) {
          setUserRole(profile.role);
          setHasRole(true);
        } else {
          setHasRole(false);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setChecking(false);
      }
    };

    checkUserRole();
  }, [user]);

  // Loading state
  if (loading || checking) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // No role assigned - redirect to role selection
  if (!hasRole) {
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

    const redirectPath = roleRoutes[userRole || ''] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
};
