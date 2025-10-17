import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Loader } from '../Loader';

interface User {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at?: string;
}

export const UsersManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = users.filter(user =>
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.id.includes(searchQuery)
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    const loadUsers = async () => {
        try {
            // گرفتن لیست کاربران از auth.users با استفاده از function
            const { data, error } = await supabase
                .rpc('get_all_users');

            if (error) {
                console.error('Error from get_all_users:', error);
                throw error;
            }

            setUsers(data || []);
            setFilteredUsers(data || []);
        } catch (error) {
            console.error('Error loading users:', error);
            // اگر function وجود نداشت، از profiles استفاده کن
            try {
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, email, created_at')
                    .order('created_at', { ascending: false });

                if (!profilesError && profilesData) {
                    setUsers(profilesData || []);
                    setFilteredUsers(profilesData || []);
                }
            } catch (fallbackError) {
                console.error('Fallback error:', fallbackError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('کپی شد! ✓');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">مجموع کاربران</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                                {users.length}
                            </p>
                        </div>
                        <div className="text-4xl">👥</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">کاربران فیلتر شده</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                                {filteredUsers.length}
                            </p>
                        </div>
                        <div className="text-4xl">🔍</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">امروز</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                                {users.filter(u => {
                                    const today = new Date().toDateString();
                                    return new Date(u.created_at).toDateString() === today;
                                }).length}
                            </p>
                        </div>
                        <div className="text-4xl">✨</div>
                    </div>
                </div>
            </div>

            {/* Search Box */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="text-2xl">🔍</div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="جستجو با ایمیل یا User ID..."
                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            پاک کردن
                        </button>
                    )}
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                            <tr>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                    ایمیل
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                    User ID
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                    تاریخ ثبت‌نام
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                    عملیات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                                                    {user.email?.[0]?.toUpperCase() || '?'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-slate-100">
                                                    {user.email || 'بدون ایمیل'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => copyToClipboard(user.id)}
                                            className="font-mono text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 group"
                                            title="کلیک کنید تا کپی شود"
                                        >
                                            <span>{user.id.slice(0, 8)}...</span>
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">📋</span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {new Date(user.created_at).toLocaleDateString('fa-IR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSearchQuery(user.id);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors text-sm font-medium"
                                            >
                                                مشاهده جزئیات
                                            </button>
                                            <button
                                                onClick={() => copyToClipboard(user.id)}
                                                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                                            >
                                                کپی ID
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            {searchQuery ? 'کاربری یافت نشد' : 'هیچ کاربری وجود ندارد'}
                        </p>
                    </div>
                )}
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                            راهنما
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                            برای مدیریت فیچرهای هر کاربر، User ID را کپی کرده و به بخش "Feature Management" بروید.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
