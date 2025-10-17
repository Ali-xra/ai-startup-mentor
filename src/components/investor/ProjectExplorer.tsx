import React, { useState, useEffect, useCallback } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectFilters } from './ProjectFilters';
import type { PublicProject } from '../../types/project';
import type { ProjectFilters as Filters } from '../../types/project';
import { investorProjectService } from '../../services/investorProjectService';
import { useInvestorAuth } from '../../hooks/useInvestorAuth';

export const ProjectExplorer: React.FC = () => {
  const { user, investorProfile } = useInvestorAuth();
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [savedProjectIds, setSavedProjectIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [viewLimitReached, setViewLimitReached] = useState(false);

  const PAGE_SIZE = 12;

  // بارگذاری پروژه‌های ذخیره شده
  const loadSavedProjects = useCallback(async () => {
    if (!user) return;

    try {
      const saved = await investorProjectService.getSavedProjects(user.id);
      const ids = new Set(saved.map(p => p.id));
      setSavedProjectIds(ids);
    } catch (err) {
      console.error('Error loading saved projects:', err);
    }
  }, [user]);

  // بارگذاری پروژه‌ها
  const loadProjects = useCallback(async (resetPage = false) => {
    setLoading(true);
    setError(null);

    try {
      const currentPage = resetPage ? 0 : page;

      const result = await investorProjectService.getPublicProjects({
        ...filters,
        searchQuery: searchQuery || undefined,
        limit: PAGE_SIZE,
        offset: currentPage * PAGE_SIZE
      });

      if (resetPage) {
        setProjects(result.projects);
        setPage(0);
      } else {
        setProjects(prev => [...prev, ...result.projects]);
      }

      setHasMore(result.has_more);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message || 'خطا در بارگذاری پروژه‌ها');
    } finally {
      setLoading(false);
    }
  }, [page, filters, searchQuery]);

  // چک کردن محدودیت view (برای Free tier)
  useEffect(() => {
    if (investorProfile?.tier === 'free') {
      const remaining = 10 - (investorProfile.monthly_project_views || 0);
      if (remaining <= 0) {
        setViewLimitReached(true);
      }
    }
  }, [investorProfile]);

  // بارگذاری اولیه
  useEffect(() => {
    loadProjects(true);
    loadSavedProjects();
  }, [filters, searchQuery]); // وقتی فیلتر یا جستجو تغییر می‌کنه، از اول بارگذاری کن

  // بارگذاری صفحه بعدی
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadProjects(false);
    }
  };

  // تغییر وضعیت Save
  const handleSaveToggle = (projectId: string, saved: boolean) => {
    setSavedProjectIds(prev => {
      const newSet = new Set(prev);
      if (saved) {
        newSet.add(projectId);
      } else {
        newSet.delete(projectId);
      }
      return newSet;
    });
  };

  // تغییر فیلترها
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  // تغییر جستجو
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* هدر */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          کشف پروژه‌ها
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          پروژه‌های در جستجوی سرمایه را جستجو و کشف کنید
        </p>
      </div>

      {/* اخطار محدودیت Free tier */}
      {viewLimitReached && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-500 ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                محدودیت ماهانه به پایان رسید
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
                شما در این ماه به حد مجاز 10 بازدید رسیده‌اید. برای دسترسی نامحدود، حساب خود را ارتقا دهید.
              </p>
              <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium text-sm transition-colors">
                ارتقا به Verified
              </button>
            </div>
          </div>
        </div>
      )}

      {/* باکس جستجو */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="جستجو در پروژه‌ها..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* فیلترها */}
      <ProjectFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />

      {/* نتایج */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {loading && page === 0 ? (
        // Loading اولیه
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری پروژه‌ها...</p>
          </div>
        </div>
      ) : projects.length === 0 ? (
        // هیچ پروژه‌ای نیست
        <div className="text-center py-20">
          <svg className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            پروژه‌ای یافت نشد
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            با فیلترهای انتخابی، پروژه‌ای پیدا نشد. لطفاً فیلترها را تغییر دهید.
          </p>
          <button
            onClick={() => {
              setFilters({});
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            پاک کردن فیلترها
          </button>
        </div>
      ) : (
        <>
          {/* گرید پروژه‌ها */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isSaved={savedProjectIds.has(project.id)}
                onSaveToggle={(saved) => handleSaveToggle(project.id, saved)}
              />
            ))}
          </div>

          {/* دکمه Load More */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    در حال بارگذاری...
                  </span>
                ) : (
                  'نمایش بیشتر'
                )}
              </button>
            </div>
          )}

          {/* پایان لیست */}
          {!hasMore && projects.length > 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              همه پروژه‌ها نمایش داده شد
            </div>
          )}
        </>
      )}
    </div>
  );
};
