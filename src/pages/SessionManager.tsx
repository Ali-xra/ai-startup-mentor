import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from '../components/Loader';
import '../index.css';

interface SessionInfo {
    user_id: string;
    email: string | null;
    created_at: string;
    expires_at: string;
    last_sign_in_at: string | null;
}

const SessionManagerContent: React.FC = () => {
    const { user, session } = useAuth();
    const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [clearing, setClearing] = useState(false);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        loadSessionInfo();
    }, [session]);

    const loadSessionInfo = async () => {
        setLoading(true);
        try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();

            if (currentSession) {
                setSessionInfo({
                    user_id: currentSession.user.id,
                    email: currentSession.user.email || null,
                    created_at: currentSession.user.created_at || '',
                    expires_at: new Date(currentSession.expires_at! * 1000).toLocaleString('fa-IR'),
                    last_sign_in_at: currentSession.user.last_sign_in_at || null
                });
            } else {
                setSessionInfo(null);
            }
        } catch (error) {
            console.error('Error loading session:', error);
            setMessage('خطا در بارگذاری اطلاعات session');
        } finally {
            setLoading(false);
        }
    };

    const handleClearSession = async () => {
        if (!confirm('آیا مطمئن هستید که می‌خواهید session فعلی را پاک کنید؟')) {
            return;
        }

        setClearing(true);
        setMessage('');

        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw error;
            }

            setMessage('✅ Session با موفقیت پاک شد! در حال انتقال به صفحه ورود...');
            setSessionInfo(null);

            // مستقیم به صفحه لاگین بره
            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        } catch (error: any) {
            console.error('Error clearing session:', error);
            setMessage(`❌ خطا در پاک کردن session: ${error.message}`);
            setClearing(false);
        }
    };

    const handleClearAllSessions = async () => {
        if (!confirm('⚠️ این عملیات تمام session های شما را در تمام دستگاه‌ها پاک می‌کند. ادامه می‌دهید؟')) {
            return;
        }

        setClearing(true);
        setMessage('');

        try {
            // اول چک کنیم که session داریم یا نه
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setMessage('❌ هیچ session فعالی وجود ندارد!');
                setClearing(false);
                return;
            }

            // Sign out از همه دستگاه‌ها
            const { error } = await supabase.auth.signOut({ scope: 'global' });

            if (error) {
                throw error;
            }

            setMessage('✅ تمام session ها با موفقیت پاک شدند! در حال انتقال به صفحه ورود...');
            setSessionInfo(null);

            // مستقیم به صفحه لاگین بره
            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        } catch (error: any) {
            console.error('Error clearing all sessions:', error);
            setMessage(`❌ خطا در پاک کردن session ها: ${error.message}`);
            setClearing(false);
        }
    };

    const handleBackToHome = () => {
        window.location.href = '/';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 font-sans transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    مدیریت Session
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    Session Manager
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleBackToHome}
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            بازگشت به صفحه اصلی
                        </button>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg mb-6 ${
                            message.includes('✅')
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        }`}>
                            {message}
                        </div>
                    )}
                </div>

                {/* Session Info */}
                {sessionInfo ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Session فعال
                        </h2>

                        <div className="space-y-4">
                            <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">User ID</div>
                                <div className="font-mono text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 p-2 rounded">
                                    {sessionInfo.user_id}
                                </div>
                            </div>

                            <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">ایمیل</div>
                                <div className="font-semibold text-slate-900 dark:text-white">
                                    {sessionInfo.email || 'نامشخص'}
                                </div>
                            </div>

                            <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">آخرین ورود</div>
                                <div className="text-slate-900 dark:text-white">
                                    {sessionInfo.last_sign_in_at
                                        ? new Date(sessionInfo.last_sign_in_at).toLocaleString('fa-IR')
                                        : 'نامشخص'
                                    }
                                </div>
                            </div>

                            <div className="pb-4">
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">انقضای Session</div>
                                <div className="text-slate-900 dark:text-white">
                                    {sessionInfo.expires_at}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            <button
                                onClick={handleClearSession}
                                disabled={clearing}
                                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
                            >
                                {clearing ? <Loader /> : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        پاک کردن Session فعلی
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleClearAllSessions}
                                disabled={clearing}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
                            >
                                {clearing ? <Loader /> : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        پاک کردن همه Session ها
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>توجه:</strong> پاک کردن همه session ها شما را در تمام دستگاه‌ها خارج می‌کند.
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center">
                        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            هیچ Session فعالی وجود ندارد
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            برای استفاده از پلتفرم ابتدا وارد شوید
                        </p>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all font-semibold"
                        >
                            ورود به حساب کاربری
                        </button>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        عملیات سریع
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                            onClick={() => loadSessionInfo()}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                        >
                            🔄 بارگذاری مجدد
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                        >
                            🏠 صفحه اصلی
                        </button>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                        >
                            🔐 صفحه ورود
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionManagerContent;
