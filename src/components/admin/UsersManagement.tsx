import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../services/supabaseClient';
import { featureFlagsService } from '../../services/featureFlagsService';
import { Loader } from '../Loader';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  plan?: string;
  role?: string;
}

interface UsersManagementProps {
  onViewUserDetails?: (userId: string) => void;
}

export const UsersManagement: React.FC<UsersManagementProps> = ({ onViewUserDetails }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [deleteConfirmUserId, setDeleteConfirmUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t, i18n } = useTranslation('admin');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(
        (user) =>
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
      const { data, error } = await supabase.rpc('get_all_users');

      if (error) {
        console.error('Error from get_all_users:', error);
        throw error;
      }

      // گرفتن پلن و role برای هر کاربر
      const usersWithDetails = await Promise.all(
        (data || []).map(async (user: User) => {
          const userWithFeatures = await featureFlagsService.getUserById(user.id);

          // گرفتن role از profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          return {
            ...user,
            plan: userWithFeatures?.current_plan || 'free',
            role: profile?.role || 'entrepreneur',
          };
        })
      );

      setUsers(usersWithDetails);
      setFilteredUsers(usersWithDetails);
    } catch (error) {
      console.error('Error loading users:', error);
      // اگر function وجود نداشت، از profiles استفاده کن
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, created_at, role')
          .order('created_at', { ascending: false });

        if (!profilesError && profilesData) {
          // گرفتن پلن برای هر کاربر
          const usersWithDetails = await Promise.all(
            (profilesData || []).map(async (user: User) => {
              const userWithFeatures = await featureFlagsService.getUserById(user.id);
              return {
                ...user,
                plan: userWithFeatures?.current_plan || 'free',
                role: user.role || 'entrepreneur',
              };
            })
          );

          setUsers(usersWithDetails);
          setFilteredUsers(usersWithDetails);
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
    alert(t('copied'));
  };

  const getPlanBadge = (plan: string) => {
    const planConfig: Record<string, { label: string; bgClass: string; textClass: string }> = {
      free: {
        label: t('plan_free'),
        bgClass: 'bg-gray-100 dark:bg-gray-800',
        textClass: 'text-gray-700 dark:text-gray-300',
      },
      starter: {
        label: t('plan_starter'),
        bgClass: 'bg-blue-100 dark:bg-blue-900/30',
        textClass: 'text-blue-700 dark:text-blue-300',
      },
      pro: {
        label: t('plan_pro'),
        bgClass: 'bg-purple-100 dark:bg-purple-900/30',
        textClass: 'text-purple-700 dark:text-purple-300',
      },
      enterprise: {
        label: t('plan_enterprise'),
        bgClass: 'bg-amber-100 dark:bg-amber-900/30',
        textClass: 'text-amber-700 dark:text-amber-300',
      },
    };

    const config = planConfig[plan] || planConfig.free;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bgClass} ${config.textClass}`}
      >
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<
      string,
      { label: string; icon: string; bgClass: string; textClass: string }
    > = {
      entrepreneur: {
        label: t('role_entrepreneur'),
        icon: '',
        bgClass: 'bg-green-100 dark:bg-green-900/30',
        textClass: 'text-green-700 dark:text-green-300',
      },
      investor: {
        label: t('role_investor'),
        icon: '',
        bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
        textClass: 'text-emerald-700 dark:text-emerald-300',
      },
      programmer: {
        label: t('role_programmer'),
        icon: '',
        bgClass: 'bg-cyan-100 dark:bg-cyan-900/30',
        textClass: 'text-cyan-700 dark:text-cyan-300',
      },
      consultant: {
        label: t('role_consultant'),
        icon: '',
        bgClass: 'bg-orange-100 dark:bg-orange-900/30',
        textClass: 'text-orange-700 dark:text-orange-300',
      },
      designer: {
        label: t('role_designer'),
        icon: '',
        bgClass: 'bg-pink-100 dark:bg-pink-900/30',
        textClass: 'text-pink-700 dark:text-pink-300',
      },
      admin: {
        label: t('role_admin'),
        icon: '',
        bgClass: 'bg-red-100 dark:bg-red-900/30',
        textClass: 'text-red-700 dark:text-red-300',
      },
    };

    const config = roleConfig[role] || roleConfig.entrepreneur;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bgClass} ${config.textClass} flex items-center gap-1.5 w-fit`}
      >
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
  };

  const handleDeleteUser = async (userId: string) => {
    setIsDeleting(true);
    try {
      // استفاده از RPC function برای حذف کامل از تمام جداول
      const { data, error } = await supabase.rpc('delete_user_completely', {
        target_user_id: userId,
      });

      if (error) {
        throw error;
      }

      // بررسی نتیجه
      if (data && data.success) {
        // به‌روزرسانی لیست کاربران
        setUsers(users.filter((u) => u.id !== userId));
        setFilteredUsers(filteredUsers.filter((u) => u.id !== userId));

        alert(t('user_deleted_success'));
        setDeleteConfirmUserId(null);
      } else {
        throw new Error(data?.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(t('delete_user_error') + ': ' + (error as any).message);
    } finally {
      setIsDeleting(false);
    }
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
              <p className="text-sm text-slate-600 dark:text-slate-400">{t('total_users_stat')}</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                {users.length}
              </p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t('filtered_users')}</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                {filteredUsers.length}
              </p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t('today')}</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                {
                  users.filter((u) => {
                    const today = new Date().toDateString();
                    return new Date(u.created_at).toDateString() === today;
                  }).length
                }
              </p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-2xl"></div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_email_or_id')}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              {t('clear')}
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
                  {t('email')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {t('user_type')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {t('plan')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {t('registration_date')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          {user.email?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">
                          {user.email || t('no_email')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role || 'entrepreneur')}</td>
                  <td className="px-6 py-4">{getPlanBadge(user.plan || 'free')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(user.created_at).toLocaleDateString(
                      i18n.language === 'fa' ? 'fa-IR' : 'en-US'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewUserDetails?.(user.id)}
                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors text-sm font-medium"
                      >
                        {t('view_details')}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmUserId(user.id)}
                        className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                      >
                        {t('delete')}
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
            <div className="text-6xl mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {searchQuery ? t('no_users_found') : t('no_users_exist')}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {t('confirm_delete_user')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                {t('confirm_delete_message')}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mb-6 font-mono bg-slate-100 dark:bg-slate-700 p-2 rounded">
                {users.find((u) => u.id === deleteConfirmUserId)?.email}
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
                <p className="text-sm text-red-800 dark:text-red-400">
                  {t('irreversible_warning')}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmUserId(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium disabled:opacity-50"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteConfirmUserId)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isDeleting ? t('deleting') : t('confirm_delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl"></div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">{t('help')}</h4>
            <p className="text-sm text-blue-800 dark:text-blue-400">{t('help_message')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
