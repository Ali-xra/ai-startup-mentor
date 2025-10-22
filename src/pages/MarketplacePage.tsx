import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PublicProjectsService,
  PublicProject,
  ProjectFilter,
} from '../services/publicProjectsService';
import { ProjectCard } from '../components/marketplace/ProjectCard';
import { ProjectFilters } from '../components/marketplace/ProjectFilters';
import { CommentsModal } from '../components/marketplace/CommentsModal';
import { PublicNavigation } from '../components/PublicNavigation';
import { supabase } from '../services/supabaseClient';
import '../index.css';

/**
 * صفحه عمومی بازار پروژه‌ها
 * همه کاربران (با یا بدون لاگین) می‌تونن پروژه‌ها رو ببینن
 */
const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);
  const [showComments, setShowComments] = useState(false);

  // چک کردن وضعیت لاگین
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  // بارگذاری پروژه‌ها
  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await PublicProjectsService.getPublicProjects(filter, 100, 0);

      // فیلتر کردن بر اساس جستجو
      let filtered = result;
      if (searchQuery.trim()) {
        filtered = result.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setProjects(filtered);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError('خطا در بارگذاری پروژه‌ها');
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // لایک کردن پروژه
  const handleLike = async (_projectId: string) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // به‌روزرسانی لیست بعد از لایک
    setTimeout(() => loadProjects(), 500);
  };

  // نمایش کامنت‌ها
  const handleShowComments = (project: PublicProject) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setSelectedProject(project);
    setShowComments(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Public Navigation */}
      <PublicNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            کشف ایده‌های نوآورانه
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            پروژه‌های استارتاپی را کشف کنید، با آن‌ها تعامل داشته باشید و ایده‌های جدید بیابید
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در پروژه‌ها..."
              className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filter Tabs - Using shared component */}
          <ProjectFilters activeFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Loading State */}
        {loading && (
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
              <p className="text-slate-600 dark:text-slate-400">در حال بارگذاری پروژه‌ها...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <>
            {projects.length === 0 ? (
              <div className="text-center py-20">
                <svg
                  className="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  پروژه‌ای یافت نشد
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  هیچ پروژه‌ای با این فیلتر پیدا نشد
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isClickable={true}
                    onLike={handleLike}
                    onComment={handleShowComments}
                    showStats={true}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Comments Modal */}
      {showComments && selectedProject && (
        <CommentsModal
          project={selectedProject}
          isOpen={showComments}
          onClose={() => {
            setShowComments(false);
            setSelectedProject(null);
            loadProjects(); // بعد از بستن modal، پروژه‌ها رو به‌روز کن
          }}
        />
      )}
    </div>
  );
};

export default MarketplacePage;
