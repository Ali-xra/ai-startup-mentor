import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PublicProject } from '../../types/project';
import { investorProjectService } from '../../services/investorProjectService';
import { useInvestorAuth } from '../../hooks/useInvestorAuth';

interface ProjectCardProps {
  project: PublicProject;
  onSaveToggle?: (saved: boolean) => void;
  isSaved?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSaveToggle,
  isSaved = false,
}) => {
  const navigate = useNavigate();
  const { user } = useInvestorAuth();
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // جلوگیری از کلیک روی کارت

    if (!user) {
      navigate('/investor/signup');
      return;
    }

    setLoading(true);

    try {
      if (saved) {
        await investorProjectService.unsaveProject(project.id, user.id);
        setSaved(false);
        onSaveToggle?.(false);
      } else {
        await investorProjectService.saveProject(project.id, user.id);
        setSaved(true);
        onSaveToggle?.(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/investor/project/${project.id}`);
  };

  // فرمت کردن مبلغ سرمایه‌گذاری
  const formatInvestment = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* بخش بالا - Featured Badge */}
      {project.featured && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 text-center">
          ⭐ پروژه ویژه
        </div>
      )}

      {/* محتوای اصلی */}
      <div className="p-5">
        {/* هدر - نام پروژه و دکمه Save */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex-1 line-clamp-2">
            {project.project_name}
          </h3>
          <button
            onClick={handleSaveToggle}
            disabled={loading}
            className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            title={saved ? 'حذف از ذخیره‌شده‌ها' : 'ذخیره پروژه'}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : saved ? (
              <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* توضیحات */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {project.initial_idea}
        </p>

        {/* صاحب پروژه */}
        <div className="flex items-center mb-4 text-xs text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {project.owner_name}
        </div>

        {/* اطلاعات سرمایه‌گذاری */}
        {project.seeking_investment && project.investment_amount && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700 dark:text-gray-300 font-medium">درخواست سرمایه:</span>
              <span className="text-green-700 dark:text-green-400 font-bold">
                {formatInvestment(project.investment_amount)}
              </span>
            </div>
            {project.equity_offered && (
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-700 dark:text-gray-300">سهام پیشنهادی:</span>
                <span className="text-green-700 dark:text-green-400 font-bold">
                  {project.equity_offered}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* تگ مرحله پروژه */}
        <div className="flex items-center justify-between">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            {project.stage || 'مرحله نامشخص'}
          </span>

          {/* آمار */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {/* بازدیدها */}
            <div className="flex items-center">
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {project.view_count || 0}
            </div>

            {/* علاقه‌مندی‌ها */}
            <div className="flex items-center">
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {project.interest_count || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
