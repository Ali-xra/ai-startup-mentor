import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from '../Loader';
import { ShareModal } from './ShareModal';

interface Project {
  id: string;
  project_name: string;
  created_at: string;
  updated_at: string;
  startup_data: any;
  user_id: string;
}

/**
 * ProjectsList
 * صفحه لیست پروژه‌های کاربر
 */
export const ProjectsList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('entrepreneur');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null);

  // State برای فرم ساخت پروژه جدید
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectIdea, setNewProjectIdea] = useState('');
  const [creating, setCreating] = useState(false);

  // تابع محاسبه درصد پیشرفت از startup_data
  const calculateProgress = (startupData: any): number => {
    if (!startupData) return 0;

    // اگر stage ذخیره شده باشد، از آن استفاده کن
    if (startupData.stage) {
      // لیست تمام stages
      const ALL_STAGES = [
        'INITIAL',
        'IDEA_TITLE',
        'ELEVATOR_PITCH',
        'EXECUTIVE_SUMMARY',
        'PROBLEM_DESCRIPTION',
        'PROBLEM_MAGNITUDE',
        'CURRENT_SOLUTIONS',
        'CUSTOMER_SEGMENTS',
        'EARLY_ADOPTER_PERSONA',
        'PRODUCT_DESCRIPTION',
        'HOW_IT_WORKS',
        'UVP_STATEMENT',
        'UNFAIR_ADVANTAGE',
        'VALIDATION_SUMMARY',
        'BUSINESS_GOALS_TIMELINE',
        'PESTEL_ANALYSIS',
        'TAM_ANALYSIS',
        'SAM_ANALYSIS',
        'SOM_ANALYSIS',
        'COMPETITOR_IDENTIFICATION',
        'COMPETITOR_ANALYSIS',
        'SWOT_ANALYSIS',
        'RISK_ANALYSIS',
        'BMC_CUSTOMER_SEGMENTS',
        'BMC_VALUE_PROPOSITIONS',
        'BMC_CHANNELS',
        'BMC_CUSTOMER_RELATIONSHIPS',
        'BMC_REVENUE_STREAMS',
        'BMC_KEY_RESOURCES',
        'BMC_KEY_ACTIVITIES',
        'BMC_KEY_PARTNERSHIPS',
        'BMC_COST_STRUCTURE',
        'BRAND_VISION',
        'BRAND_MISSION',
        'CORE_VALUES',
        'BRAND_PERSONALITY',
        'BRAND_NAME',
        'TAGLINE',
        'TONE_OF_VOICE',
        'LOGO_DESIGN_CONCEPTS',
        'COLOR_PALETTE',
        'TYPOGRAPHY',
        'FULL_PRODUCT_DESCRIPTION',
        'FEATURE_PRIORITIZATION',
        'PRODUCT_ROADMAP',
        'MVP_SCOPE',
        'MVP_USER_FLOW',
        'TECH_STACK',
        'QA_PLAN',
        'MARKETING_OBJECTIVES',
        'KPIS',
        'CONTENT_MARKETING',
        'SOCIAL_MEDIA_MARKETING',
        'PAID_ADVERTISING',
        'SALES_PROCESS',
        'PRICING_STRATEGY',
        'LAUNCH_CAMPAIGN',
        'FOUNDING_TEAM',
        'HIRING_PLAN',
        'LEGAL_STRUCTURE',
        'IP_STRATEGY',
        'KEY_MILESTONES',
        'STARTUP_COSTS',
        'FUNDING_AMOUNT',
        'REVENUE_MODEL',
        'COST_PROJECTIONS',
        'BREAK_EVEN_ANALYSIS',
        'KPI_TRACKING',
        'PITCH_DECK_OUTLINE',
        'EXECUTIVE_SUMMARY_FINAL',
        'APPENDICES',
        'COMPLETE',
      ];

      const stageIndex = ALL_STAGES.indexOf(startupData.stage);
      if (stageIndex >= 0) {
        return Math.round((stageIndex / (ALL_STAGES.length - 1)) * 100);
      }
    }

    // اگر stage نبود، از شمارش فیلدها استفاده کن
    const allFields = [
      'idea_title',
      'elevator_pitch',
      'executive_summary',
      'problem_description',
      'problem_magnitude',
      'current_solutions',
      'customer_segments',
      'early_adopter_persona',
      'product_description',
      'how_it_works',
      'uvp_statement',
      'unfair_advantage',
      'validation_summary',
      'business_goals_timeline',
      'pestel_analysis',
      'tam_analysis',
      'sam_analysis',
      'som_analysis',
      'competitor_identification',
      'competitor_analysis',
      'swot_analysis',
      'risk_analysis',
      'bmc_customer_segments',
      'bmc_value_propositions',
      'bmc_channels',
      'bmc_customer_relationships',
      'bmc_revenue_streams',
      'bmc_key_resources',
      'bmc_key_activities',
      'bmc_key_partnerships',
      'bmc_cost_structure',
      'brand_vision',
      'brand_mission',
      'core_values',
      'brand_personality',
      'brand_name',
      'tagline',
      'tone_of_voice',
      'logo_design_concepts',
      'color_palette',
      'typography',
      'full_product_description',
      'feature_prioritization',
    ];

    const filledFields = allFields.filter((field) => {
      const value = startupData[field];
      return value && value !== '' && value !== null && value !== undefined;
    });

    return Math.round((filledFields.length / allFields.length) * 100);
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!window.confirm(t('confirm_delete', { name: projectName }))) return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', projectId);

      if (error) throw error;

      // حذف از لیست
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      alert(t('project_deleted'));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(t('delete_error'));
    }
  };

  // ساخت پروژه جدید
  const handleCreateNewProject = async () => {
    if (!user) return;

    if (!newProjectName.trim()) {
      alert(t('enter_project_name'));
      return;
    }

    if (!newProjectIdea.trim()) {
      alert(t('enter_initial_idea'));
      return;
    }

    try {
      setCreating(true);

      // ساخت پروژه جدید با داده‌های اولیه
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          project_name: newProjectName,
          startup_data: {
            projectName: newProjectName,
            initialIdea: newProjectIdea,
          },
        })
        .select()
        .single();

      if (error) throw error;

      // هدایت به صفحه پروژه جدید
      navigate(`/entrepreneur/project/${newProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert(t('create_error'));
    } finally {
      setCreating(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const progress = calculateProgress(project.startup_data);

    // فیلتر بر اساس وضعیت
    if (filter === 'in-progress' && (progress === 0 || progress === 100)) {
      return false;
    }
    if (filter === 'completed' && progress !== 100) {
      return false;
    }

    // فیلتر بر اساس جستجو
    if (searchQuery && !project.project_name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {t('my_projects')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{t('projects_subtitle')}</p>

        {/* کارت ساخت پروژه جدید */}
        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-8 mb-8 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg"></div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('start_new_journey')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {t('turn_idea_to_reality')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* نام پروژه */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('project_name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder={t('project_name_placeholder')}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-800 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors"
                disabled={creating}
              />
            </div>

            {/* ایده اولیه */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('initial_idea')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newProjectIdea}
                onChange={(e) => setNewProjectIdea(e.target.value)}
                placeholder={t('initial_idea_placeholder')}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-800 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors"
                disabled={creating}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCreateNewProject}
              disabled={creating || !newProjectName.trim() || !newProjectIdea.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 disabled:scale-100 flex items-center gap-3 font-bold text-lg"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{t('creating')}</span>
                </>
              ) : (
                <>
                  <span></span>
                  <span>{t('start_journey')}</span>
                  <span></span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder={t('search_projects')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {t('filter_all')}
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                filter === 'in-progress'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {t('filter_in_progress')}
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {t('filter_completed')}
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
            {searchQuery
              ? t('no_projects_found')
              : projects.length === 0
                ? t('no_projects_yet')
                : t('no_projects_in_category')}
          </p>
          {projects.length === 0 && (
            <Link
              to="/entrepreneur/new-project"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 font-semibold"
            >
              {t('create_first_project')}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const progress = calculateProgress(project.startup_data);
            return (
              <div
                key={project.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700"
              >
                {/* Project Header */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 truncate">
                    {project.project_name || t('unnamed_project')}
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <p>
                      {t('created_on')}:{' '}
                      {new Date(project.created_at).toLocaleDateString(
                        i18n.language === 'fa' ? 'fa-IR' : 'en-US'
                      )}
                    </p>
                    <p>
                      {t('last_update')}:{' '}
                      {new Date(project.updated_at).toLocaleDateString(
                        i18n.language === 'fa' ? 'fa-IR' : 'en-US'
                      )}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t('progress')}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          progress >= 80
                            ? 'bg-green-500'
                            : progress >= 50
                              ? 'bg-yellow-500'
                              : progress >= 25
                                ? 'bg-orange-500'
                                : 'bg-slate-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    {progress === 100 ? (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                        {t('status_completed')}
                      </span>
                    ) : progress > 0 ? (
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                        {t('status_in_progress')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                        {t('status_not_started')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex gap-2">
                  <Link
                    to={`/entrepreneur/project/${project.id}`}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all text-center text-sm font-semibold shadow-md hover:shadow-lg"
                  >
                    {t('continue_work')}
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedProject({ id: project.id, name: project.project_name });
                      setShareModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    title={t('share_project')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id, project.project_name)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                    title={t('delete_project')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {filteredProjects.length > 0 && (
        <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
          {t('showing_projects', { count: filteredProjects.length, total: projects.length })}
        </div>
      )}

      {/* Share Modal */}
      {selectedProject && (
        <ShareModal
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};
