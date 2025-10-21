import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import { Locale } from '../i18n';
import {
  PublicProjectsService,
  PublicProject as PublicProjectType,
  ProjectFilter,
} from '../services/publicProjectsService';
import { ProjectCard } from '../components/marketplace/ProjectCard';
import { ProjectFilters } from '../components/marketplace/ProjectFilters';
import '../index.css';

interface PublicProject extends PublicProjectType {
  name?: string; // Alias for title
}

const LandingPageContent: React.FC = () => {
  const { language } = useLanguage();
  const locale: Locale = language === 'fa' ? 'fa' : 'en';
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );
  const [selectedFilter, setSelectedFilter] = useState<ProjectFilter>('all');
  const [publicProjects, setPublicProjects] = useState<PublicProject[]>([]);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // دریافت پروژه‌ها از backend - محدود به 8 پروژه برای LandingPage
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        // فقط 8 پروژه برای نمایش در LandingPage
        const projects = await PublicProjectsService.getPublicProjects(selectedFilter, 8, 0);
        setPublicProjects(projects);
        // برای نمایش دکمه "View All" باید بدانیم که آیا پروژه بیشتری وجود دارد
        const allProjects = await PublicProjectsService.getPublicProjects(selectedFilter, 100, 0);
        setTotalProjects(allProjects.length);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedFilter]);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const t = (key: string) => {
    const translations: Record<string, { fa: string; en: string }> = {
      hero_title: {
        fa: 'دستیار هوشمند برای تبدیل ایده به استارتاپ',
        en: 'AI-Powered Assistant to Turn Your Ideas into Startups',
      },
      hero_subtitle: {
        fa: 'از ایده تا بیزنس پلن کامل، همراه با راهنمای گام به گام و هوش مصنوعی پیشرفته',
        en: 'From idea to complete business plan, with step-by-step guidance and advanced AI',
      },
      cta_start: { fa: 'شروع رایگان', en: 'Start Free' },
      cta_login: { fa: 'ورود', en: 'Login' },
      cta_pricing: { fa: 'قیمت‌گذاری', en: 'Pricing' },
      features_title: { fa: ' ویژگی‌های کلیدی', en: ' Key Features' },
      feature1_title: { fa: ' هوش مصنوعی پیشرفته', en: ' Advanced AI' },
      feature1_desc: {
        fa: 'راهنمایی هوشمند در هر مرحله از مسیر استارتاپ',
        en: 'Smart guidance at every stage of your startup journey',
      },
      feature2_title: { fa: ' 8 مرحله جامع', en: ' 8 Comprehensive Phases' },
      feature2_desc: {
        fa: 'از تعریف ایده تا آماده‌سازی پیچ برای سرمایه‌گذار',
        en: 'From idea definition to investor pitch preparation',
      },
      feature3_title: { fa: ' همکاری تیمی', en: ' Team Collaboration' },
      feature3_desc: {
        fa: 'به اشتراک‌گذاری و کار تیمی روی پروژه',
        en: 'Share and collaborate on projects with your team',
      },
      feature4_title: { fa: ' خروجی حرفه‌ای', en: ' Professional Export' },
      feature4_desc: {
        fa: 'دریافت بیزنس پلن و پیچ دک به فرمت‌های مختلف',
        en: 'Get business plan and pitch deck in various formats',
      },
      showcase_title: { fa: ' پروژه‌های عمومی', en: ' Public Projects Showcase' },
      showcase_subtitle: {
        fa: 'ایده‌های الهام‌بخش از جامعه ما',
        en: 'Inspiring ideas from our community',
      },
      filter_all: { fa: 'همه', en: 'All' },
      filter_trending: { fa: 'پرطرفدار', en: 'Trending' },
      filter_completed: { fa: 'تکمیل شده', en: 'Completed' },
      filter_recent: { fa: 'جدیدترین', en: 'Recent' },
      phase_of: { fa: 'مرحله %s از %s', en: 'Phase %s of %s' },
      view_project: { fa: 'مشاهده پروژه', en: 'View Project' },
      likes: { fa: 'پسند', en: 'Likes' },
      comments: { fa: 'نظر', en: 'Comments' },
      stats_title: { fa: ' آمار پلتفرم', en: ' Platform Stats' },
      stat_users: { fa: '+ کاربر فعال', en: '+ Active Users' },
      stat_projects: { fa: '+ پروژه ایجاد شده', en: '+ Projects Created' },
      stat_completed: { fa: '+ بیزنس پلن کامل', en: '+ Completed Business Plans' },
      stat_funding: { fa: 'میلیون دلار سرمایه جذب شده', en: 'Million $ Funding Raised' },
      testimonials_title: { fa: ' نظرات کاربران', en: ' User Testimonials' },
      testimonial1_name: { fa: 'سارا احمدی', en: 'Sarah Johnson' },
      testimonial1_role: { fa: 'بنیان‌گذار TechStart', en: 'Founder of TechStart' },
      testimonial1_text: {
        fa: 'این پلتفرم واقعاً مسیر راه‌اندازی استارتاپ من را تغییر داد. هوش مصنوعی به من کمک کرد تا بیزنس پلن حرفه‌ای بسازم.',
        en: 'This platform truly transformed my startup journey. The AI helped me create a professional business plan.',
      },
      testimonial2_name: { fa: 'علی رضایی', en: 'Alex Chen' },
      testimonial2_role: { fa: 'مدیرعامل GreenTech', en: 'CEO of GreenTech' },
      testimonial2_text: {
        fa: 'راهنمایی گام به گام و پشتیبانی عالی. بدون این پلتفرم نمی‌توانستم ایده‌ام را به محصول تبدیل کنم.',
        en: "Step-by-step guidance and excellent support. I couldn't have turned my idea into a product without this platform.",
      },
      testimonial3_name: { fa: 'مریم کرمی', en: 'Mary Davis' },
      testimonial3_role: { fa: 'کارآفرین حوزه سلامت', en: 'Healthcare Entrepreneur' },
      testimonial3_text: {
        fa: '۸ مرحله جامع واقعاً کمک‌کننده بود. حالا می‌توانم با اعتماد به نفس بیشتری با سرمایه‌گذاران صحبت کنم.',
        en: 'The 8 comprehensive phases were incredibly helpful. Now I can confidently pitch to investors.',
      },

      // FAQ Section
      faq_title: { fa: 'سوالات متداول ', en: 'Frequently Asked Questions ' },
      faq_q1: { fa: 'چطور می‌توانم شروع کنم؟', en: 'How do I get started?' },
      faq_a1: {
        fa: 'کافی است روی "شروع رایگان" کلیک کنید و حساب کاربری بسازید. سپس می‌توانید اولین پروژه استارتاپی خود را شروع کنید.',
        en: 'Simply click "Start Free" and create your account. Then you can begin your first startup project.',
      },
      faq_q2: { fa: 'آیا هوش مصنوعی واقعاً کمک می‌کند؟', en: 'Does the AI really help?' },
      faq_a2: {
        fa: 'بله! هوش مصنوعی ما بر اساس بهترین تجربیات کارآفرینی آموزش دیده و در هر مرحله راهنمایی‌های عملی ارائه می‌دهد.',
        en: 'Yes! Our AI is trained on the best entrepreneurial experiences and provides practical guidance at every stage.',
      },
      faq_q3: {
        fa: 'آیا می‌توانم پروژه‌هایم را با تیمم به اشتراک بگذارم؟',
        en: 'Can I share my projects with my team?',
      },
      faq_a3: {
        fa: 'بله! بسته به پلن انتخابی‌تان می‌توانید پروژه‌ها را با تعداد مختلفی از اعضای تیم به اشتراک بگذارید.',
        en: 'Yes! Depending on your chosen plan, you can share projects with different numbers of team members.',
      },
      faq_q4: {
        fa: 'خروجی نهایی چه فرمت‌هایی دارد؟',
        en: 'What formats are available for final output?',
      },
      faq_a4: {
        fa: 'می‌توانید بیزنس پلن و پیچ دک خود را در فرمت‌های PDF، Word و Excel دریافت کنید.',
        en: 'You can get your business plan and pitch deck in PDF, Word, and Excel formats.',
      },
      footer_tagline: {
        fa: 'ساخته شده با برای استارتاپ‌های آینده',
        en: 'Made with for future startups',
      },
      footer_rights: { fa: 'تمامی حقوق محفوظ است.', en: 'All rights reserved.' },
      about_us: { fa: 'درباره ما', en: 'About Us' },
    };
    return translations[key]?.[locale] || key;
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20 transition-colors duration-300`}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-xl sm:text-2xl"></span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Startup Mentor
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  {locale === 'fa' ? 'دستیار هوشمند استارتاپی' : 'Your AI Startup Assistant'}
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSelector />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              >
                {theme === 'dark' ? '' : ''}
              </button>
              <a
                href="/marketplace"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors hidden sm:block"
              >
                {locale === 'fa' ? 'بازار پروژه‌ها' : 'Marketplace'}
              </a>
              <a
                href="/pricing"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {t('cta_pricing')}
              </a>
              <a
                href="/about"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors hidden sm:block"
              >
                {t('about_us')}
              </a>
              <button
                onClick={handleLogin}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
              >
                {t('cta_login')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            {t('hero_title')}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-3xl mx-auto px-4">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <button
              onClick={handleLogin}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base sm:text-lg rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-bold shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 w-full sm:w-auto"
            >
              {t('cta_start')}
            </button>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12 animate-fade-in-up">
          {t('features_title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['feature1', 'feature2', 'feature3', 'feature4'].map((feature, index) => (
            <div
              key={feature}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-slate-200 dark:border-slate-700 animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {t(`${feature}_title`)}
              </h4>
              <p className="text-slate-600 dark:text-slate-400">{t(`${feature}_desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Public Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('showcase_title')}
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('showcase_subtitle')}</p>
        </div>

        {/* Filters */}
        <ProjectFilters activeFilter={selectedFilter} onFilterChange={setSelectedFilter} />

        {/* Projects Grid - Limited to 8 projects */}
        {loading ? (
          // Loading State
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              {locale === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}
            </p>
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-12">
            <div className="text-6xl mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">
              {locale === 'fa' ? 'خطا در بارگذاری پروژه‌ها' : 'Error loading projects'}
            </p>
          </div>
        ) : publicProjects.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <div className="text-6xl mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">
              {locale === 'fa' ? 'هنوز پروژه‌ای منتشر نشده است' : 'No projects published yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {publicProjects.slice(0, 8).map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isClickable={false}
                  onClick={() => navigate('/marketplace')}
                  showStats={true}
                />
              ))}
            </div>

            {/* View All Button */}
            {totalProjects > 8 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => navigate('/marketplace')}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span></span>
                  <span>{locale === 'fa' ? 'مشاهده همه پروژه‌ها' : 'View All Projects'}</span>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    +{totalProjects - 8}
                  </span>
                  <span></span>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('testimonials_title')}
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            ببینید دیگران چطور با کمک ما به موفقیت رسیدند
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'testimonial1_name',
              role: 'testimonial1_role',
              text: 'testimonial1_text',
              avatar: 'سارا',
            },
            {
              name: 'testimonial2_name',
              role: 'testimonial2_role',
              text: 'testimonial2_text',
              avatar: 'علی',
            },
            {
              name: 'testimonial3_name',
              role: 'testimonial3_role',
              text: 'testimonial3_text',
              avatar: 'مریم',
            },
          ].map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div className={`mr-4 ${locale === 'fa' ? 'mr-4' : 'ml-4'}`}>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {t(testimonial.name)}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t(testimonial.role)}
                  </p>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic">
                &ldquo;{t(testimonial.text)}&rdquo;
              </p>
              <div className="flex text-yellow-400 mt-4">{''.repeat(5)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-white mb-12">{t('stats_title')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2,500', label: 'stat_users' },
              { value: '1,200', label: 'stat_projects' },
              { value: '450', label: 'stat_completed' },
              { value: '12.5', label: 'stat_funding' },
            ].map((stat, idx) => (
              <div key={idx} className="text-white">
                <div className="text-4xl md:text-5xl font-black mb-2 animate-pulse">
                  {stat.value}
                </div>
                <div className="text-sm md:text-lg opacity-90">{t(stat.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
          <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
            {t('faq_title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['q1', 'q2', 'q3', 'q4'].map((q) => (
              <div
                key={q}
                className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0"
              >
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                  <span className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    ?
                  </span>
                  {t(`faq_${q}`)}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm pr-9">
                  {t(`faq_a${q.slice(1)}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a
                href="/"
                className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {t('home')}
              </a>
              <a
                href="/pricing"
                className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {t('cta_pricing')}
              </a>
              <a
                href="/about"
                className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {t('about_us')}
              </a>
            </div>
          </div>
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-2">{t('footer_tagline')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © 2025 AI Startup Mentor. {t('footer_rights')}
            </p>
          </div>
        </div>
      </footer>

      <style>{`
 @keyframes blob {
 0%, 100% { transform: translate(0, 0) scale(1); }
 25% { transform: translate(20px, -50px) scale(1.1); }
 50% { transform: translate(-20px, 20px) scale(0.9); }
 75% { transform: translate(50px, 50px) scale(1.05); }
 }
 @keyframes fadeInUp {
 from {
 opacity: 0;
 transform: translateY(30px);
 }
 to {
 opacity: 1;
 transform: translateY(0);
 }
 }
 @keyframes slideInLeft {
 from {
 opacity: 0;
 transform: translateX(-50px);
 }
 to {
 opacity: 1;
 transform: translateX(0);
 }
 }
 @keyframes slideInRight {
 from {
 opacity: 0;
 transform: translateX(50px);
 }
 to {
 opacity: 1;
 transform: translateX(0);
 }
 }
 @keyframes bounce {
 0%, 20%, 53%, 80%, 100% {
 transform: translate3d(0,0,0);
 }
 40%, 43% {
 transform: translate3d(0, -20px, 0);
 }
 70% {
 transform: translate3d(0, -10px, 0);
 }
 90% {
 transform: translate3d(0, -4px, 0);
 }
 }
 .animate-blob {
 animation: blob 7s infinite;
 }
 .animation-delay-2000 {
 animation-delay: 2s;
 }
 .animation-delay-4000 {
 animation-delay: 4s;
 }
 .animate-fade-in-up {
 animation: fadeInUp 0.8s ease-out;
 }
 .animate-slide-in-left {
 animation: slideInLeft 0.8s ease-out;
 }
 .animate-slide-in-right {
 animation: slideInRight 0.8s ease-out;
 }
 .animate-bounce {
 animation: bounce 2s infinite;
 }
 .line-clamp-2 {
 display: -webkit-box;
 -webkit-line-clamp: 2;
 -webkit-box-orient: vertical;
 overflow: hidden;
 }
 `}</style>
    </div>
  );
};

export default LandingPageContent;
