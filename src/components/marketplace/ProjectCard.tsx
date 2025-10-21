import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PublicProject } from '../../services/publicProjectsService';
import { PublicProjectsService } from '../../services/publicProjectsService';

interface ProjectCardProps {
  project: PublicProject;
  isClickable?: boolean; // آیا دکمه‌ها فعالند؟
  onLike?: (projectId: string) => void;
  onComment?: (project: PublicProject) => void;
  onClick?: () => void; // کلیک روی کارت (برای redirect)
  showStats?: boolean; // نمایش آمار لایک/کامنت
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isClickable = false,
  onLike,
  onComment,
  onClick,
  showStats = true,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(project.likes_count);
  const [loading, setLoading] = useState(false);

  // چک کردن لایک کاربر در بارگذاری اولیه
  React.useEffect(() => {
    if (isClickable) {
      checkUserLike();
    }
  }, [project.id, isClickable]);

  const checkUserLike = async () => {
    try {
      const liked = await PublicProjectsService.hasUserLikedProject(project.id);
      setIsLiked(liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isClickable) return;

    setLoading(true);
    try {
      if (isLiked) {
        await PublicProjectsService.unlikeProject(project.id);
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await PublicProjectsService.likeProject(project.id);
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }

      if (onLike) {
        onLike(project.id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isClickable) return;

    if (onComment) {
      onComment(project);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (isClickable) {
      // اگر clickable است و onClick نداده شده، به صفحه جزئیات پروژه می‌ریم
      navigate(`/marketplace/${project.id}`);
    }
  };

  // محاسبه درصد پیشرفت
  const progressPercentage =
    project.total_phases > 0
      ? Math.round((project.phase_completed / project.total_phases) * 100)
      : 0;

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 ${
        onClick || isClickable ? 'cursor-pointer' : ''
      }`}
    >
      {/* Thumbnail */}
      {project.thumbnail_url && (
        <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* محتوای اصلی */}
      <div className="p-5">
        {/* هدر - عنوان */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {project.title}
        </h3>

        {/* توضیحات */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* پیشرفت پروژه */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>پیشرفت پروژه</span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>
              فاز {project.phase_completed} از {project.total_phases}
            </span>
          </div>
        </div>

        {/* تگ‌ها */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* صاحب پروژه */}
        <div className="flex items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          {project.owner_avatar ? (
            <img
              src={project.owner_avatar}
              alt={project.owner_name}
              className="w-8 h-8 rounded-full ml-2"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ml-2">
              <span className="text-white text-sm font-bold">
                {project.owner_name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {project.owner_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">صاحب پروژه</p>
          </div>
        </div>

        {/* آمار و دکمه‌ها */}
        {showStats && (
          <div className="flex items-center justify-between">
            {/* دکمه لایک */}
            <button
              onClick={handleLikeClick}
              disabled={!isClickable || loading}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                isClickable
                  ? isLiked
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default'
              }`}
              title={isClickable ? (isLiked ? 'حذف لایک' : 'لایک کردن') : 'غیرفعال'}
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
              ) : (
                <svg
                  className={`w-4 h-4 ${isLiked && isClickable ? 'fill-current' : ''}`}
                  fill={isLiked && isClickable ? 'currentColor' : 'none'}
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
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            {/* دکمه کامنت */}
            <button
              onClick={handleCommentClick}
              disabled={!isClickable}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                isClickable
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default'
              }`}
              title={isClickable ? 'نظرات' : 'غیرفعال'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-sm font-medium">{project.comments_count}</span>
            </button>

            {/* تاریخ ایجاد */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(project.created_at).toLocaleDateString('fa-IR')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
