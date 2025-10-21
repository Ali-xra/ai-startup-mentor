import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { featureFlagsService } from '../../services/featureFlagsService';
import { FeatureFlag, UserWithFeatures, FeatureKey } from '../../types';
import { Loader } from '../Loader';

export const FeatureManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'global' | 'users' | 'plans'>('users');

  // State for features
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true);

  // State for users
  const [users, setUsers] = useState<UserWithFeatures[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load features
  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const data = await featureFlagsService.getAllFeatureFlags();
      setFeatures(data);
    } catch (error) {
      console.error('Error loading features:', error);
    } finally {
      setIsLoadingFeatures(false);
    }
  };

  // Search users
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    setIsLoadingUsers(true);
    try {
      const results = await featureFlagsService.searchUsers(searchQuery);
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
      alert('خطا در جستجو');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Toggle feature for user
  const handleToggleFeature = async (
    userId: string,
    featureKey: FeatureKey,
    currentValue: boolean
  ) => {
    if (!user) return;

    try {
      await featureFlagsService.toggleUserFeature(userId, featureKey, !currentValue, user.id);

      // Refresh user list
      await handleSearch();
      alert('تغییرات با موفقیت اعمال شد');
    } catch (error) {
      console.error('Error toggling feature:', error);
      alert('خطا در اعمال تغییرات');
    }
  };

  // تغییر فیچر در یک category (فقط یکی فعال می‌ماند)
  const handleChangeFeatureInCategory = async (
    userId: string,
    category: string,
    selectedFeatureKey: FeatureKey,
    categoryFeatures: FeatureFlag[]
  ) => {
    if (!user) return;

    try {
      // غیرفعال کردن همه فیچرهای این category
      for (const feature of categoryFeatures) {
        const userFeature = users
          .find((u) => u.id === userId)
          ?.features.find((f) => f.feature_key === feature.feature_key);
        if (userFeature?.is_enabled) {
          await featureFlagsService.toggleUserFeature(
            userId,
            feature.feature_key as FeatureKey,
            false, // turn off
            user.id
          );
        }
      }

      // فعال کردن فیچر انتخاب شده
      await featureFlagsService.toggleUserFeature(
        userId,
        selectedFeatureKey,
        true, // turn on
        user.id
      );

      // Refresh user list
      await handleSearch();
      alert('تغییرات با موفقیت اعمال شد');
    } catch (error) {
      console.error('Error changing feature:', error);
      alert('خطا در اعمال تغییرات');
    }
  };

  // Grant plan to user
  const handleGrantPlan = async (
    userId: string,
    planName: 'free' | 'starter' | 'pro' | 'enterprise'
  ) => {
    if (!user) return;

    const confirmMsg = `آیا از فعال‌سازی پلن "${planName}" برای این کاربر اطمینان دارید؟`;
    if (!confirm(confirmMsg)) return;

    try {
      await featureFlagsService.grantPlan(userId, planName, user.id);
      await handleSearch();
      alert(`پلن ${planName} با موفقیت فعال شد`);
    } catch (error) {
      console.error('Error granting plan:', error);
      alert('خطا در فعال‌سازی پلن');
    }
  };

  // Group features by category
  const featuresByCategory = features.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    },
    {} as Record<string, FeatureFlag[]>
  );

  const categoryLabels: Record<string, { fa: string; icon: string }> = {
    projects: { fa: 'پروژه‌ها', icon: '' },
    ai: { fa: 'AI', icon: '' },
    team: { fa: 'تیم', icon: '' },
    export: { fa: 'Export', icon: '' },
    phases: { fa: 'مراحل', icon: '' },
    storage: { fa: 'ذخیره‌سازی', icon: '' },
  };

  if (isLoadingFeatures) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          مدیریت کاربران
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'plans'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          پلن‌ها
        </button>
        <button
          onClick={() => setActiveTab('global')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'global'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          تنظیمات Global
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              جستجوی کاربر با User ID
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              برای پیدا کردن User ID: Supabase Authentication Users کپی User ID
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="User ID (UUID) را وارد کنید..."
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={isLoadingUsers || !searchQuery.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {isLoadingUsers ? <Loader /> : ''}
                <span>جستجو</span>
              </button>
            </div>
          </div>

          {/* User Results */}
          {users.length > 0 && (
            <div className="space-y-4">
              {users.map((userData) => (
                <div
                  key={userData.id}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          {userData.email}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          User ID: {userData.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>

                    {/* Current Plan Display */}
                    <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">پلن فعلی:</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            userData.current_plan === 'enterprise'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : userData.current_plan === 'pro'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                : userData.current_plan === 'starter'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {userData.current_plan || 'free'}
                        </span>
                        {userData.plan_expires_at && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            انقضا: {new Date(userData.plan_expires_at).toLocaleDateString('fa-IR')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Plan Selection with Radio Buttons */}
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        تغییر پلن:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(['free', 'starter', 'pro', 'enterprise'] as const).map((planName) => (
                          <label
                            key={planName}
                            className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                              userData.current_plan === planName ||
                              (!userData.current_plan && planName === 'free')
                                ? 'border-indigo-600 bg-indigo-100 dark:bg-indigo-900/40'
                                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-slate-800'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`plan-${userData.id}`}
                              value={planName}
                              checked={
                                userData.current_plan === planName ||
                                (!userData.current_plan && planName === 'free')
                              }
                              onChange={() => handleGrantPlan(userData.id, planName)}
                              className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                              {planName === 'free'
                                ? ' Free'
                                : planName === 'starter'
                                  ? ' Starter'
                                  : planName === 'pro'
                                    ? ' Pro'
                                    : ' Enterprise'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Features Grid - با Radio Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => {
                      // پیدا کردن فیچر فعال در این category
                      const activeFeature = categoryFeatures.find((feature) => {
                        const userFeature = userData.features.find(
                          (f) => f.feature_key === feature.feature_key
                        );
                        return userFeature?.is_enabled;
                      });

                      return (
                        <div
                          key={category}
                          className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-3"
                        >
                          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-200 dark:border-slate-600 pb-2">
                            <span>{categoryLabels[category]?.icon}</span>
                            <span>{categoryLabels[category]?.fa}</span>
                          </h4>
                          <div className="space-y-2">
                            {categoryFeatures.map((feature) => {
                              const userFeature = userData.features.find(
                                (f) => f.feature_key === feature.feature_key
                              );
                              const isEnabled = userFeature?.is_enabled || false;

                              return (
                                <label
                                  key={feature.id}
                                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all border ${
                                    isEnabled
                                      ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-500'
                                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`feature-${category}-${userData.id}`}
                                    checked={isEnabled}
                                    onChange={() => {
                                      if (!isEnabled) {
                                        handleChangeFeatureInCategory(
                                          userData.id,
                                          category,
                                          feature.feature_key as FeatureKey,
                                          categoryFeatures
                                        );
                                      }
                                    }}
                                    className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                  />
                                  <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                                    {feature.feature_name}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoadingUsers && users.length === 0 && searchQuery && (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-8 text-center">
              <div className="text-4xl mb-2"></div>
              <p className="text-slate-600 dark:text-slate-400">کاربری با این ایمیل پیدا نشد</p>
            </div>
          )}
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['free', 'starter', 'pro', 'enterprise'].map((planName) => {
            const planFeatures: Record<string, string[]> = {
              free: ['1 پروژه', '50 پیام AI', 'بدون اشتراک‌گذاری', 'تا مرحله 3'],
              starter: ['3 پروژه', '500 پیام AI', 'اشتراک با 2 نفر', 'همه مراحل'],
              pro: ['پروژه نامحدود', '2000 پیام AI', 'اشتراک با 10 نفر', 'Export پیشرفته'],
              enterprise: ['نامحدود', 'AI نامحدود', 'تیم نامحدود', 'همه امکانات'],
            };

            const colors: Record<string, string> = {
              free: 'slate',
              starter: 'blue',
              pro: 'purple',
              enterprise: 'yellow',
            };

            const color = colors[planName];

            return (
              <div
                key={planName}
                className={`bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border-2 border-${color}-200 dark:border-${color}-800`}
              >
                <h3
                  className={`text-xl font-bold text-${color}-600 dark:text-${color}-400 capitalize mb-4`}
                >
                  {planName}
                </h3>
                <ul className="space-y-2">
                  {planFeatures[planName].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-green-500"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Global Tab */}
      {activeTab === 'global' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <p className="text-slate-600 dark:text-slate-400 mb-4">تنظیمات Global به زودی...</p>
          <div className="space-y-4">
            {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <span>{categoryLabels[category]?.icon}</span>
                  <span>{categoryLabels[category]?.fa}</span>
                </h3>
                <div className="space-y-2">
                  {categoryFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">
                          {feature.feature_name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          feature.is_enabled_globally
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {feature.is_enabled_globally ? 'فعال برای همه' : 'غیرفعال'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
