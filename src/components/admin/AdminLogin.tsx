import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { Loader } from '../Loader';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
    const { user, signIn } = useAuth();
    const { isAdmin, isLoading: isCheckingAdmin } = useAdminAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // اگر کاربر لاگین کرده و ادمینه، خودکار redirect کن
    useEffect(() => {
        if (user && isAdmin && !isCheckingAdmin) {
            onLoginSuccess();
        }
    }, [user, isAdmin, isCheckingAdmin, onLoginSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await signIn(email, password);
            // بعد از لاگین، useEffect بالا چک می‌کنه که ادمینه یا نه
        } catch (err: any) {
            setError(err.message || 'خطا در ورود');
        } finally {
            setIsLoading(false);
        }
    };

    // اگر در حال چک کردن ادمین بودن هست
    if (isCheckingAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <Loader />
            </div>
        );
    }

    // اگر لاگین کرده ولی ادمین نیست
    if (user && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🚫</div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            Access Denied
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            شما به پنل مدیریت دسترسی ندارید.
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            بازگشت به صفحه اصلی
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">🔐</div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                        Admin Panel
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        ورود به پنل مدیریت
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            ایمیل
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="admin@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            رمز عبور
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader />
                                <span>در حال ورود...</span>
                            </>
                        ) : (
                            <span>ورود به پنل</span>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        بازگشت به صفحه اصلی
                    </a>
                </div>
            </div>
        </div>
    );
};
