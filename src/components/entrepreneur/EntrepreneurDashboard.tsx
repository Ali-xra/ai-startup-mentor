import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from '../Loader';
import { Card, CardHeader, CardBody, Button, Badge } from '../ui';

interface ProjectStats {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  publishedProjects: number;
}

interface RecentProject {
  id: string;
  name: string;
  lastModified: string;
  progress: number;
  isPublished: boolean;
}

/**
 * EntrepreneurDashboard
 * صفحه اصلی داشبورد کارآفرین
 */
export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    publishedProjects: 0,
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

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

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // دریافت لیست پروژه‌ها
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // محاسبه آمار
      const total = projects?.length || 0;
      const completed =
        projects?.filter((p) => calculateProgress(p.startup_data) === 100).length || 0;
      const inProgress =
        projects?.filter((p) => {
          const prog = calculateProgress(p.startup_data);
          return prog > 0 && prog < 100;
        }).length || 0;

      // دریافت پروژه‌های منتشر شده
      const { data: publicProjects } = await supabase
        .from('public_projects')
        .select('project_id')
        .eq('user_id', user.id)
        .eq('is_published', true);

      const published = publicProjects?.length || 0;

      setStats({
        totalProjects: total,
        completedProjects: completed,
        inProgressProjects: inProgress,
        publishedProjects: published,
      });

      // پروژه‌های اخیر
      const recent: RecentProject[] =
        projects?.slice(0, 5).map((p) => ({
          id: p.id,
          name: p.project_name || 'پروژه بدون نام',
          lastModified: new Date(p.updated_at).toLocaleDateString('fa-IR'),
          progress: calculateProgress(p.startup_data),
          isPublished: publicProjects?.some((pp) => pp.project_id === p.id) || false,
        })) || [];

      setRecentProjects(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">داشبورد کارآفرین</h1>
        <p className="text-slate-600 dark:text-slate-400">مدیریت پروژه‌ها و استارتاپ‌های خود</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* کل پروژه‌ها */}
        <Card variant="elevated" padding="md" className="border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">کل پروژه‌ها</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.totalProjects}
              </p>
            </div>
          </div>
        </Card>

        {/* در حال پیشرفت */}
        <Card variant="elevated" padding="md" className="border-r-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">در حال پیشرفت</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.inProgressProjects}
              </p>
            </div>
          </div>
        </Card>

        {/* تکمیل شده */}
        <Card variant="elevated" padding="md" className="border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">تکمیل شده</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.completedProjects}
              </p>
            </div>
          </div>
        </Card>

        {/* منتشر شده */}
        <Card variant="elevated" padding="md" className="border-r-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">منتشر شده</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.publishedProjects}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card variant="elevated" padding="md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">پروژه‌های اخیر</h2>
            <Link
              to="/entrepreneur/projects"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              مشاهده همه
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          {recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">هنوز پروژه‌ای ندارید</p>
              <Link to="/entrepreneur/new-project">
                <Button variant="primary" size="lg">
                  ساخت اولین پروژه
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/entrepreneur/project/${project.id}`}
                  className="block border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {project.name}
                        </h3>
                        {project.isPublished && (
                          <Badge variant="success" size="sm">
                            منتشر شده
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        آخرین بروزرسانی: {project.lastModified}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              project.progress >= 80
                                ? 'bg-green-500'
                                : project.progress >= 50
                                  ? 'bg-yellow-500'
                                  : project.progress >= 25
                                    ? 'bg-orange-500'
                                    : 'bg-slate-400'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl mr-4"></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
