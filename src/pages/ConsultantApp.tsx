import React, { useEffect, useState } from 'react';
import '../index.css';
import { supabase } from '../services/supabaseClient';
import { checkAndRedirect } from '../auth-check';
import { Loader } from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * صفحه ساده مشاور - بدون هیچ پیچیدگی
 */
const SimpleConsultantDashboard: React.FC = () => {
    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/login';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-9xl mb-8">🎯</div>
                <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
                    داشبورد مشاور
                </h1>
                <p className="text-2xl text-slate-600 dark:text-slate-300 mb-8">
                    Consultant Dashboard
                </p>
                <button
                    onClick={handleLogout}
                    className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
                >
                    خروج از حساب کاربری
                </button>
            </div>
        </div>
    );
};

/**
 * Wrapper با auth check قبل از render
 */
const ConsultantAppWithAuthCheck: React.FC = () => {
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        checkAndRedirect('consultant').then(() => {
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

    return <SimpleConsultantDashboard />;
};

export default ConsultantAppWithAuthCheck;
