import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { FeatureManagement } from '../components/admin/FeatureManagement';
import { UsersManagement } from '../components/admin/UsersManagement';
import { UpgradeRequestsPanel } from '../components/admin/UpgradeRequestsPanel';
import { AuditLog } from '../components/admin/AuditLog';
import { Loader } from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';
import '../index.css';

type AdminPage = 'dashboard' | 'features' | 'users' | 'upgrade-requests' | 'audit';

const AdminPanelContent: React.FC = () => {
    const { isAdmin, isLoading } = useAdminAuth();
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    return (
        <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage}>
            {currentPage === 'dashboard' && <AdminDashboard />}
            {currentPage === 'features' && <FeatureManagement />}
            {currentPage === 'users' && <UsersManagement />}
            {currentPage === 'upgrade-requests' && user && <UpgradeRequestsPanel adminId={user.id} />}
            {currentPage === 'audit' && <AuditLog />}
        </AdminLayout>
    );
};

const AdminApp: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <AdminPanelContent />
            </AuthProvider>
        </ErrorBoundary>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<AdminApp />);


export default AdminApp;
