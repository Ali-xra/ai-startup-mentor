import React, { useState, useEffect } from 'react';
import { featureFlagsService } from '../../services/featureFlagsService';
import { FeatureKey, UserWithFeatures } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Copy, Check } from 'lucide-react';

interface UserDetailsPageProps {
  userId: string;
  onBack: () => void;
}

export const UserDetailsPage: React.FC<UserDetailsPageProps> = ({ userId, onBack }) => {
  const { user: adminUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<UserWithFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'starter' | 'pro' | 'enterprise'>(
    'free'
  );

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    const user = await featureFlagsService.getUserById(userId);
    if (user) {
      setSelectedUser(user);
      setSelectedPlan(user.current_plan as 'free' | 'starter' | 'pro' | 'enterprise');
    }
    setLoading(false);
  };

  const handleCopyUserId = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handlePlanChange = async (plan: 'free' | 'starter' | 'pro' | 'enterprise') => {
    if (!selectedUser || !adminUser) return;

    try {
      setLoading(true);
      await featureFlagsService.grantPlan(selectedUser.id, plan, adminUser.id);
      setSelectedPlan(plan);
      await loadUserData();
    } catch (error) {
      console.error('Error granting plan:', error);
      alert('خطا در تغییر پلن کاربر');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = async (featureKey: FeatureKey, categoryKey: string) => {
    if (!selectedUser || !adminUser) return;

    try {
      setLoading(true);

      // Get all features in this category
      const categoryFeatures = featuresByCategory[categoryKey] || [];

      // Turn off all features in this category first
      for (const fKey of categoryFeatures) {
        await featureFlagsService.toggleUserFeature(
          selectedUser.id,
          fKey as FeatureKey,
          false,
          adminUser.id
        );
      }

      // Turn on the selected feature
      await featureFlagsService.toggleUserFeature(selectedUser.id, featureKey, true, adminUser.id);

      await loadUserData();
    } catch (error) {
      console.error('Error toggling feature:', error);
      alert('خطا در تغییر فیچر');
    } finally {
      setLoading(false);
    }
  };

  // Feature categories (same as FeatureManagement)
  const featuresByCategory: Record<string, FeatureKey[]> = {
    projects: [FeatureKey.MAX_PROJECTS_1, FeatureKey.MAX_PROJECTS_3, FeatureKey.UNLIMITED_PROJECTS],
    ai: [
      FeatureKey.AI_CREDITS_50,
      FeatureKey.AI_CREDITS_500,
      FeatureKey.AI_CREDITS_2000,
      FeatureKey.UNLIMITED_AI,
    ],
    team: [
      FeatureKey.TEAM_SHARING_DISABLED,
      FeatureKey.TEAM_SHARING_2,
      FeatureKey.TEAM_SHARING_10,
      FeatureKey.TEAM_SHARING_UNLIMITED,
    ],
    export: [FeatureKey.EXPORT_DISABLED, FeatureKey.EXPORT_BASIC, FeatureKey.EXPORT_ADVANCED],
    phases: [FeatureKey.PHASE_3_LIMIT, FeatureKey.PHASE_5_LIMIT, FeatureKey.ALL_PHASES],
    storage: [
      FeatureKey.STORAGE_50MB,
      FeatureKey.STORAGE_500MB,
      FeatureKey.STORAGE_5GB,
      FeatureKey.STORAGE_UNLIMITED,
    ],
  };

  const categoryLabels: Record<string, string> = {
    projects: ' پروژه‌ها',
    ai: ' AI',
    team: ' تیم',
    export: ' خروجی',
    phases: ' مراحل',
    storage: ' فضای ذخیره‌سازی',
  };

  const featureLabels: Record<string, string> = {
    [FeatureKey.MAX_PROJECTS_1]: '1 پروژه',
    [FeatureKey.MAX_PROJECTS_3]: '3 پروژه',
    [FeatureKey.UNLIMITED_PROJECTS]: 'نامحدود',
    [FeatureKey.AI_CREDITS_50]: '50 پیام',
    [FeatureKey.AI_CREDITS_500]: '500 پیام',
    [FeatureKey.AI_CREDITS_2000]: '2000 پیام',
    [FeatureKey.UNLIMITED_AI]: 'نامحدود',
    [FeatureKey.TEAM_SHARING_DISABLED]: 'غیرفعال',
    [FeatureKey.TEAM_SHARING_2]: '2 نفر',
    [FeatureKey.TEAM_SHARING_10]: '10 نفر',
    [FeatureKey.TEAM_SHARING_UNLIMITED]: 'نامحدود',
    [FeatureKey.EXPORT_DISABLED]: 'غیرفعال',
    [FeatureKey.EXPORT_BASIC]: 'پایه',
    [FeatureKey.EXPORT_ADVANCED]: 'پیشرفته',
    [FeatureKey.PHASE_3_LIMIT]: 'تا مرحله 3',
    [FeatureKey.PHASE_5_LIMIT]: 'تا مرحله 5',
    [FeatureKey.ALL_PHASES]: 'همه مراحل',
    [FeatureKey.STORAGE_50MB]: '50MB',
    [FeatureKey.STORAGE_500MB]: '500MB',
    [FeatureKey.STORAGE_5GB]: '5GB',
    [FeatureKey.STORAGE_UNLIMITED]: 'نامحدود',
  };

  const planLabels: Record<string, string> = {
    free: 'رایگان (Free)',
    starter: 'شروع (Starter)',
    pro: 'حرفه‌ای (Pro)',
    enterprise: 'سازمانی (Enterprise)',
  };

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      entrepreneur: ' کارآفرین',
      investor: ' سرمایه‌گذار',
      programmer: ' برنامه‌نویس',
      consultant: ' مشاور',
      designer: ' طراح',
      admin: ' ادمین',
    };
    return roleNames[role] || role;
  };

  if (loading && !selectedUser) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="p-6">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
        >
          بازگشت
        </button>
        <p className="text-red-400">کاربر یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          بازگشت به لیست کاربران
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">جزئیات کاربر</h2>
      </div>

      {/* User Info Card */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm">ایمیل:</label>
            <p className="text-white font-medium">{selectedUser.email}</p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">پلن فعلی:</label>
            <p className="text-white font-medium">
              {planLabels[selectedUser.current_plan || 'free']}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-gray-400 text-sm mb-2 block">شناسه کاربر (User ID):</label>
            <div className="flex items-center gap-2 bg-gray-900 p-3 rounded border border-gray-700">
              <code className="text-green-400 text-sm flex-1 font-mono break-all">
                {selectedUser.id}
              </code>
              <button
                onClick={handleCopyUserId}
                className="p-2 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                title="کپی کردن"
              >
                {copySuccess ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">انتخاب پلن</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['free', 'starter', 'pro', 'enterprise'] as const).map((plan) => (
            <label
              key={plan}
              className={`
 relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
 ${
   selectedPlan === plan
     ? 'border-blue-500 bg-blue-500/10'
     : 'border-gray-600 hover:border-gray-500'
 }
 ${loading ? 'opacity-50 cursor-not-allowed' : ''}
 `}
            >
              <input
                type="radio"
                name="plan"
                value={plan}
                checked={selectedPlan === plan}
                onChange={() => handlePlanChange(plan)}
                disabled={loading}
                className="sr-only"
              />
              <div className="text-center">
                <div
                  className={`
 w-4 h-4 rounded-full border-2 mx-auto mb-2
 ${selectedPlan === plan ? 'border-blue-500 bg-blue-500' : 'border-gray-500'}
 `}
                >
                  {selectedPlan === plan && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className="text-white font-medium">{planLabels[plan]}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Feature Management */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">مدیریت فیچرها</h3>

        <div className="space-y-6">
          {Object.entries(featuresByCategory).map(([categoryKey, features]) => (
            <div key={categoryKey} className="border border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-3">
                {categoryLabels[categoryKey]}
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {features.map((featureKey) => {
                  const isEnabled = selectedUser.features.some(
                    (f) => f.feature_key === featureKey && f.is_enabled
                  );

                  return (
                    <label
                      key={`${categoryKey}-${featureKey}`}
                      className={`
 relative flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
 ${isEnabled ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-gray-500'}
 ${loading ? 'opacity-50 cursor-not-allowed' : ''}
 `}
                    >
                      <input
                        type="radio"
                        name={`feature-${categoryKey}`}
                        value={featureKey}
                        checked={isEnabled}
                        onChange={() => handleFeatureToggle(featureKey, categoryKey)}
                        disabled={loading}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div
                          className={`
 w-4 h-4 rounded-full border-2 mx-auto mb-2
 ${isEnabled ? 'border-green-500 bg-green-500' : 'border-gray-500'}
 `}
                        >
                          {isEnabled && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <span className="text-white text-sm">{featureLabels[featureKey]}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
