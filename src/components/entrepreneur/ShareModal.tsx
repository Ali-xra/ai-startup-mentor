import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';

interface ShareModalProps {
  projectId: string;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ShareModal
 * مودال اشتراک‌گذاری پروژه با قابلیت:
 * 1. تنظیمات عمومی/خصوصی (Public/Private)
 * 2. اشتراک‌گذاری با ایمیل کاربران خاص
 */
export const ShareModal: React.FC<ShareModalProps> = ({
  projectId,
  projectName,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [sharedEmails, setSharedEmails] = useState<string[]>([]);
  const [addingEmail, setAddingEmail] = useState(false);

  useEffect(() => {
    if (isOpen && projectId) {
      loadProjectSettings();
    }
  }, [isOpen, projectId]);

  // بارگذاری تنظیمات پروژه
  const loadProjectSettings = async () => {
    try {
      setLoading(true);

      // چک کردن وضعیت عمومی/خصوصی
      const { data: publicProject } = await supabase
        .from('public_projects')
        .select('is_published')
        .eq('project_id', projectId)
        .eq('user_id', user?.id)
        .single();

      setIsPublic(publicProject?.is_published || false);

      // TODO: بارگذاری لیست ایمیل‌های اشتراک‌گذاری شده از جدول project_shares
      // فعلاً خالی می‌ذاریم
      setSharedEmails([]);
    } catch (error) {
      console.error('Error loading project settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // تغییر وضعیت عمومی/خصوصی
  const togglePublicStatus = async () => {
    if (!user) return;

    try {
      setUpdating(true);

      if (!isPublic) {
        // عمومی کردن پروژه
        const { data: project } = await supabase
          .from('projects')
          .select('project_name, startup_data')
          .eq('id', projectId)
          .single();

        if (project) {
          // چک کنیم که آیا قبلاً در public_projects وجود دارد
          const { data: existingPublicProject } = await supabase
            .from('public_projects')
            .select('id')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .single();

          if (existingPublicProject) {
            // اگر وجود دارد، فقط is_published را true کن
            const { error } = await supabase
              .from('public_projects')
              .update({
                is_published: true,
                title: project.project_name || 'پروژه بدون نام',
                description:
                  project.startup_data?.businessIdea || project.startup_data?.initialIdea || '',
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingPublicProject.id);

            if (error) throw error;
          } else {
            // اگر وجود ندارد، یک رکورد جدید بساز
            const { error } = await supabase.from('public_projects').insert({
              project_id: projectId,
              user_id: user.id,
              title: project.project_name || 'پروژه بدون نام',
              description:
                project.startup_data?.businessIdea || project.startup_data?.initialIdea || '',
              tags: [],
              is_published: true,
            });

            if (error) throw error;
          }
        }
      } else {
        // خصوصی کردن پروژه
        const { error } = await supabase
          .from('public_projects')
          .update({ is_published: false })
          .eq('project_id', projectId)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      setIsPublic(!isPublic);
    } catch (error) {
      console.error('Error updating public status:', error);
      alert('خطا در تغییر وضعیت پروژه');
    } finally {
      setUpdating(false);
    }
  };

  // اضافه کردن ایمیل برای اشتراک‌گذاری
  const addEmail = async () => {
    if (!emailInput.trim()) {
      alert('لطفاً ایمیل را وارد کنید');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      alert('فرمت ایمیل صحیح نیست');
      return;
    }

    try {
      setAddingEmail(true);

      // TODO: ذخیره در جدول project_shares
      // فعلاً فقط به لیست local اضافه می‌کنیم
      setSharedEmails([...sharedEmails, emailInput]);
      setEmailInput('');

      alert(` پروژه با ${emailInput} به اشتراک گذاشته شد`);
    } catch (error) {
      console.error('Error sharing project:', error);
      alert('خطا در اشتراک‌گذاری پروژه');
    } finally {
      setAddingEmail(false);
    }
  };

  // حذف ایمیل از لیست اشتراک
  const removeEmail = async (email: string) => {
    try {
      // TODO: حذف از جدول project_shares
      setSharedEmails(sharedEmails.filter((e) => e !== email));
      alert(` اشتراک‌گذاری با ${email} لغو شد`);
    } catch (error) {
      console.error('Error removing share:', error);
      alert('خطا در لغو اشتراک‌گذاری');
    }
  };

  // کپی کردن لینک عمومی
  const copyPublicLink = () => {
    const link = `${window.location.origin}/marketplace?project=${projectId}`;
    navigator.clipboard.writeText(link);
    alert(' لینک کپی شد!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              اشتراک‌گذاری پروژه
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{projectName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-2xl"
          ></button>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* بخش عمومی/خصوصی */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    دسترسی عمومی
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isPublic
                      ? 'پروژه شما در بازار عمومی قابل مشاهده است'
                      : 'پروژه شما خصوصی است و فقط شما آن را می‌بینید'}
                  </p>
                </div>
                <button
                  onClick={togglePublicStatus}
                  disabled={updating}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                    isPublic
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-slate-300 dark:bg-slate-600'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                      isPublic ? 'translate-x-9' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {isPublic && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl"></span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        لینک عمومی پروژه
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                        {window.location.origin}/marketplace?project={projectId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={copyPublicLink}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    کپی لینک
                  </button>
                </div>
              )}
            </div>

            {/* بخش اشتراک‌گذاری با ایمیل */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                اشتراک‌گذاری با کاربران خاص
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                ایمیل کاربرانی که می‌خواهید پروژه را با آنها به اشتراک بگذارید
              </p>

              {/* Input برای اضافه کردن ایمیل */}
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                  placeholder="example@email.com"
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                />
                <button
                  onClick={addEmail}
                  disabled={addingEmail || !emailInput.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white rounded-lg text-sm font-medium transition-all"
                >
                  {addingEmail ? '...' : 'افزودن'}
                </button>
              </div>

              {/* لیست ایمیل‌های اشتراک‌گذاری شده */}
              {sharedEmails.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                    به اشتراک گذاشته شده با:
                  </p>
                  {sharedEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg"></span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {email}
                        </span>
                      </div>
                      <button
                        onClick={() => removeEmail(email)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg px-4 py-8 text-center border border-slate-200 dark:border-slate-700">
                  <span className="text-4xl mb-2 block"></span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    هنوز با کسی به اشتراک نگذاشته‌اید
                  </p>
                </div>
              )}
            </div>

            {/* دکمه بستن */}
            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors font-medium"
              >
                بستن
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
