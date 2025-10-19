import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * AdminProtectedRoute
 *
 * این component فقط به کاربران با role = 'admin' اجازه دسترسی می‌دهد
 *
 * اگر کاربر admin نباشه، به صفحه لاگین redirect می‌شه
 *
 * @example
 * <Route path="/admin" element={
 *   <AdminProtectedRoute>
 *     <AdminDashboard />
 *   </AdminProtectedRoute>
 * } />
 */
export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setUserRole(data?.role || null);
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
        }
      }
      setRoleLoading(false);
    };

    if (!loading) {
      fetchUserRole();
    }
  }, [user, loading]);

  // در حال بارگذاری
  if (loading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // کاربر لاگین نکرده
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // کاربر admin نیست
  if (userRole !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-6xl">🚫</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">Access Denied</h1>
          <p className="mb-6 text-gray-600">
            You don't have permission to access this page. Admin access required.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // کاربر admin هست - نمایش محتوا
  return <>{children}</>;
};

export default AdminProtectedRoute;
