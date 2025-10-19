import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from './ProjectCard';
import type { PublicProject } from '../../types/project';
import { investorProjectService } from '../../services/investorProjectService';
import { useInvestorAuth } from '../../hooks/useInvestorAuth';

export const SavedProjects: React.FC = () => {
  const { user } = useInvestorAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // بارگذاری پروژه‌های ذخیره شده
  useEffect(() => {
    if (!user) {
      navigate('/investor/login');
      return;
    }

    const loadSavedProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const savedProjects = await investorProjectService.getSavedProjects(user.id);
        setProjects(savedProjects);
      } catch (err: any) {
        console.error('Error loading saved projects:', err);
        setError(err.message || 'خطا در بارگذاری پروژه‌های ذخیره شده');
      } finally {
        setLoading(false);
      }
    };

    loadSavedProjects();
  }, [user, navigate]);

  // حذف از لیست ذخیره شده
  const handleRemoveFromSaved = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
            >
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
            <p className="text-gray-600 dark:text-gray-400">
              در حال بارگذاری پروژه‌های ذخیره شده...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* هدر */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
          <svg className="w-8 h-8 ml-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
          پروژه‌های ذخیره شده
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          پروژه‌هایی که برای بررسی بعدی ذخیره کرده‌اید
        </p>
      </div>

      {/* خطا */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* محتوا */}
      {projects.length === 0 ? (
        <div className="text-center py-20">
          <svg
            className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            هنوز پروژه‌ای ذخیره نکرده‌اید
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            پروژه‌های مورد علاقه خود را ذخیره کنید تا بعداً به راحتی به آن‌ها دسترسی داشته باشید
          </p>
          <button
            onClick={() => navigate('/investor/explore')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            مشاهده پروژه‌ها
          </button>
        </div>
      ) : (
        <>
          {/* آمار */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-blue-900 dark:text-blue-200 font-medium">
                  {projects.length} پروژه ذخیره شده
                </span>
              </div>
              <button
                onClick={() => navigate('/investor/explore')}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                + افزودن پروژه جدید
              </button>
            </div>
          </div>

          {/* گرید پروژه‌ها */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isSaved={true}
                onSaveToggle={(saved) => {
                  if (!saved) {
                    handleRemoveFromSaved(project.id);
                  }
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
