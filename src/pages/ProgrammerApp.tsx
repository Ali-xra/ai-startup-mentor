import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { supabase } from '../services/supabaseClient';
import { checkAndRedirect } from '../auth-check';
import { Loader } from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * صفحه ساده برنامه‌نویس/فریلنسر - بدون هیچ پیچیدگی
 */
const SimpleProgrammerDashboard: React.FC = () => {
    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/login.html';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-9xl mb-8">💻</div>
                <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
                    داشبورد برنامه‌نویس
                </h1>
                <p className="text-2xl text-slate-600 dark:text-slate-300 mb-8">
                    Programmer Dashboard
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
const ProgrammerAppWithAuthCheck: React.FC = () => {
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        checkAndRedirect('programmer').then(() => {
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

    return <SimpleProgrammerDashboard />;
};

const root = createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <ProgrammerAppWithAuthCheck />
        </ErrorBoundary>
    </React.StrictMode>
);


export default ProgrammerAppWithAuthCheck;
