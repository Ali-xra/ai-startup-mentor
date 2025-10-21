import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Loader } from '../Loader';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  phone?: string;
  company?: string;
  bio?: string;
  avatar_url?: string;
}

/**
 * EntrepreneurProfile
 * صفحه تنظیمات پروفایل کارآفرین
 */
export const EntrepreneurProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    role: 'entrepreneur',
  });

  // دریافت اطلاعات پلن و فیچرها
  const {
    planName,
    maxProjects,
    aiCredits,
    maxTeamMembers,
    canExport,
    maxPhase,
    isLoading: featuresLoading,
  } = useFeatureFlags();

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          name: data.name || '',
          email: data.email || user.email || '',
          role: data.role || 'entrepreneur',
          phone: data.phone || '',
          company: data.company || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        });
      } else {
        // اگر پروفایل وجود نداشت، فقط ایمیل رو بذار
        setProfile((prev) => ({
          ...prev,
          email: user.email || '',
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        phone: profile.phone,
        company: profile.company,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      alert(' پروفایل با موفقیت بروزرسانی شد');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(' خطا در ذخیره پروفایل');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">تنظیمات پروفایل</h1>
        <p className="text-slate-600 dark:text-slate-400">مدیریت اطلاعات شخصی و حساب کاربری</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'E'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              تصویر پروفایل
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              فرمت‌های مجاز: JPG, PNG - حداکثر 2MB
            </p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
              آپلود تصویر
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">اطلاعات شخصی</h3>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="نام خود را وارد کنید"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              ایمیل
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="example@email.com"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
              readOnly
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              برای تغییر ایمیل با پشتیبانی تماس بگیرید
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              شماره تماس
            </label>
            <input
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="09123456789"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              نام شرکت/استارتاپ
            </label>
            <input
              type="text"
              value={profile.company || ''}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              placeholder="نام شرکت یا استارتاپ خود"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              درباره من
            </label>
            <textarea
              rows={4}
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="توضیحی کوتاه درباره خود و تجربیاتتان..."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Account Info */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            اطلاعات حساب
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">نقش کاربری</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">کارآفرین</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">شناسه کاربری</p>
              <p className="text-sm font-mono text-slate-900 dark:text-white truncate">
                {user?.id}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Plan */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">پلن اشتراک</h3>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                planName === 'Enterprise'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : planName === 'Pro'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : planName === 'Starter'
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                      : 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-200'
              }`}
            >
              {planName === 'Enterprise'
                ? ' سازمانی'
                : planName === 'Pro'
                  ? ' حرفه‌ای'
                  : planName === 'Starter'
                    ? ' استارتر'
                    : ' رایگان'}
            </span>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Max Projects */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl"></span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  تعداد پروژه
                </p>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {maxProjects === Infinity ? 'نامحدود' : maxProjects}
              </p>
            </div>

            {/* AI Credits */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl"></span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  اعتبار هوش مصنوعی
                </p>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {aiCredits === Infinity ? 'نامحدود' : aiCredits.toLocaleString('fa-IR')}
              </p>
            </div>

            {/* Team Members */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl"></span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">اعضای تیم</p>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {maxTeamMembers === Infinity
                  ? 'نامحدود'
                  : maxTeamMembers === 0
                    ? 'ندارد'
                    : maxTeamMembers}
              </p>
            </div>

            {/* Export Options */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl"></span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">خروجی فایل</p>
              </div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {canExport === 'advanced' ? 'پیشرفته' : canExport === 'basic' ? 'پایه' : 'ندارد'}
              </p>
            </div>

            {/* Max Phase */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-xl border border-pink-200 dark:border-pink-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl"></span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  مراحل قابل دسترسی
                </p>
              </div>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {maxPhase === 8 ? 'همه' : `تا مرحله ${maxPhase.toLocaleString('fa-IR')}`}
              </p>
            </div>

            {/* Plan Status */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl"></span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  وضعیت اشتراک
                </p>
              </div>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">فعال</p>
            </div>
          </div>

          {/* Upgrade Button */}
          {planName !== 'Enterprise' && (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold mb-2">
                    {planName === 'Free' ? ' آماده برای ارتقا هستید؟' : ' به پلن بالاتر ارتقا دهید'}
                  </h4>
                  <p className="text-purple-100">
                    {planName === 'Free'
                      ? 'با پلن‌های پولی، پروژه‌های بیشتر، AI نامحدود و امکانات حرفه‌ای بیشتری داشته باشید'
                      : 'با ارتقا به پلن‌های بالاتر، امکانات بیشتری در اختیار داشته باشید'}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/pricing')}
                  className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors whitespace-nowrap shadow-lg hover:shadow-xl"
                >
                  مشاهده پلن‌ها
                </button>
              </div>
            </div>
          )}

          {/* Enterprise Success Message */}
          {planName === 'Enterprise' && (
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3">
                <span className="text-4xl"></span>
                <div>
                  <h4 className="text-xl font-bold mb-1">شما از پلن سازمانی استفاده می‌کنید!</h4>
                  <p className="text-green-100">
                    از تمام امکانات پیشرفته و نامحدود پلتفرم بهره‌مند هستید
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex gap-4">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
          <button
            onClick={loadProfile}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors font-medium"
          >
            لغو
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-6">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">منطقه خطرناک</h3>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          حذف حساب کاربری شما منجر به حذف تمام پروژه‌ها و داده‌های شما خواهد شد.
        </p>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium">
          حذف حساب کاربری
        </button>
      </div>
    </div>
  );
};
