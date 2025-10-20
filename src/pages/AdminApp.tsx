import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { UsersManagement } from '../components/admin/UsersManagement';
import { UserDetailsPage } from '../components/admin/UserDetailsPage';
import { UpgradeRequestsPanel } from '../components/admin/UpgradeRequestsPanel';
import { AuditLog } from '../components/admin/AuditLog';
import { Loader } from '../components/Loader';
import '../index.css';

type AdminPage = 'dashboard' | 'users' | 'upgrade-requests' | 'audit' | 'user-details';

const AdminPanelContent: React.FC = () => {
  const { isAdmin, isLoading } = useAdminAuth();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader />
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const handleViewUserDetails = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentPage('user-details');
  };

  const handleBackToUsers = () => {
    setSelectedUserId(null);
    setCurrentPage('users');
  };

  const handleNavigate = (page: 'dashboard' | 'users' | 'upgrade-requests' | 'audit') => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout
      currentPage={currentPage === 'user-details' ? 'users' : currentPage}
      onNavigate={handleNavigate}
    >
      {currentPage === 'dashboard' && <AdminDashboard />}
      {currentPage === 'users' && <UsersManagement onViewUserDetails={handleViewUserDetails} />}
      {currentPage === 'user-details' && selectedUserId && (
        <UserDetailsPage userId={selectedUserId} onBack={handleBackToUsers} />
      )}
      {currentPage === 'upgrade-requests' && user && <UpgradeRequestsPanel adminId={user.id} />}
      {currentPage === 'audit' && <AuditLog />}
    </AdminLayout>
  );
};

const AdminApp: React.FC = () => {
  return <AdminPanelContent />;
};

export default AdminApp;
