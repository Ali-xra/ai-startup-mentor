import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PublicProject } from '../../types/project';
import { investorProjectService } from '../../services/investorProjectService';
import { connectionService } from '../../services/connectionService';
import { useInvestorAuth } from '../../hooks/useInvestorAuth';

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user, investorProfile } = useInvestorAuth();

  const [project, setProject] = useState<PublicProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasConnection, setHasConnection] = useState(false);

  // مودال ابراز علاقه
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [sendingInterest, setSendingInterest] = useState(false);

  // بارگذاری پروژه
  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      setLoading(true);
      setError(null);

      try {
        // بارگذاری پروژه
        const projectData = await investorProjectService.getProjectById(projectId);
        setProject(projectData);

        // ثبت بازدید
        if (user) {
          await investorProjectService.incrementView(projectId, user.id);
        }

        // چک کردن وضعیت Save
        if (user) {
          const saved = await investorProjectService.isProjectSaved(projectId, user.id);
          setIsSaved(saved);

          // چک کردن اینکه قبلاً درخواست ارتباط فرستادیم یا نه
          const connection = await connectionService.getConnectionByProject(projectId, user.id);
          setHasConnection(!!connection);
        }
      } catch (err: any) {
        console.error('Error loading project:', err);
        setError(err.message || 'خطا در بارگذاری پروژه');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, user]);

  // تغییر وضعیت Save
  const handleSaveToggle = async () => {
    if (!user || !projectId) return;

    try {
      if (isSaved) {
        await investorProjectService.unsaveProject(projectId, user.id);
        setIsSaved(false);
      } else {
        await investorProjectService.saveProject(projectId, user.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  // ارسال درخواست ارتباط
  const handleSendInterest = async () => {
    if (!user || !projectId || !interestMessage.trim()) return;

    setSendingInterest(true);

    try {
      await connectionService.createConnection(projectId, user.id, interestMessage);
      setHasConnection(true);
      setShowInterestModal(false);
      setInterestMessage('');
    } catch (err: any) {
      console.error('Error sending interest:', err);
      alert(err.message || 'خطا در ارسال درخواست');
    } finally {
      setSendingInterest(false);
    }
  };

  // فرمت کردن مبلغ
  const formatInvestment = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-2">
            خطا در بارگذاری پروژه
          </h2>
          <p className="text-red-800 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/investor/explore')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            بازگشت به لیست پروژه‌ها
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* دکمه بازگشت */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        بازگشت
      </button>

      {/* هدر پروژه */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 border border-gray-200 dark:border-gray-700">
        {/* Featured Badge */}
        {project.featured && (
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
            ⭐ پروژه ویژه
          </div>
        )}

        {/* عنوان و دکمه‌های اکشن */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {project.project_name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {project.owner_name}
              </span>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium">
                {project.stage || 'مرحله نامشخص'}
              </span>
            </div>
          </div>

          {/* دکمه Save */}
          <button
            onClick={handleSaveToggle}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isSaved ? 'حذف از ذخیره‌شده‌ها' : 'ذخیره پروژه'}
          >
            {isSaved ? (
              <svg className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* توضیحات پروژه */}
        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {project.initial_idea}
          </p>
        </div>

        {/* آمار */}
        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <span className="flex items-center">
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {project.view_count || 0} بازدید
          </span>
          <span className="flex items-center">
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {project.interest_count || 0} علاقه‌مندی
          </span>
        </div>
      </div>

      {/* اطلاعات سرمایه‌گذاری */}
      {project.seeking_investment && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg shadow-lg p-8 mb-6 border-2 border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <svg className="w-7 h-7 ml-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            اطلاعات سرمایه‌گذاری
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.investment_amount && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">مبلغ درخواستی</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                  {formatInvestment(project.investment_amount)}
                </p>
              </div>
            )}
            {project.equity_offered && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">سهام پیشنهادی</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                  {project.equity_offered}%
                </p>
              </div>
            )}
          </div>

          {/* دکمه ابراز علاقه */}
          {user && (
            <div className="mt-6">
              {hasConnection ? (
                <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-4 flex items-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-900 dark:text-blue-200 font-medium">
                    درخواست ارتباط شما ارسال شده است
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => setShowInterestModal(true)}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  ابراز علاقه به سرمایه‌گذاری
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* مودال ابراز علاقه */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ابراز علاقه به پروژه
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              پیام خود را برای صاحب پروژه بنویسید:
            </p>
            <textarea
              value={interestMessage}
              onChange={(e) => setInterestMessage(e.target.value)}
              placeholder="من به پروژه شما علاقه‌مند هستم و می‌خواهم درباره سرمایه‌گذاری بیشتر بدانم..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSendInterest}
                disabled={sendingInterest || !interestMessage.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingInterest ? 'در حال ارسال...' : 'ارسال درخواست'}
              </button>
              <button
                onClick={() => setShowInterestModal(false)}
                disabled={sendingInterest}
                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
