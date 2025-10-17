import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { Locale } from '../i18n';
import LanguageSelector from '../components/LanguageSelector';
import ErrorBoundary from '../components/ErrorBoundary';
import '../index.css';

const PricingPage: React.FC = () => {
    const { user, signOut } = useAuth();
    const { planName } = useFeatureFlags();
    const { language } = useLanguage();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        // Check if user has a saved theme preference
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        return savedTheme || 'dark'; // Default to dark theme
    });

    // Map LanguageCode to Locale
    const locale: Locale = language === 'fa' ? 'fa' : 'en';

    // Apply theme on component mount and when theme changes
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const t = (key: string) => {
        const translations: Record<string, { fa: string; en: string }> = {
            // Hero Section
            hero_title: {
                fa: 'دستیار هوشمند برای تبدیل ایده به استارتاپ',
                en: 'AI-Powered Assistant to Turn Your Ideas into Startups'
            },
            hero_subtitle: {
                fa: 'از ایده تا بیزنس پلن کامل، همراه با راهنمای گام به گام و هوش مصنوعی پیشرفته',
                en: 'From idea to complete business plan, with step-by-step guidance and advanced AI'
            },
            cta_start: { fa: 'شروع رایگان', en: 'Start Free' },
            cta_login: { fa: 'ورود', en: 'Login' },
            cta_pricing: { fa: 'قیمت‌گذاری', en: 'Pricing' },
            cta_upgrade_pro: { fa: 'ارتقا به Pro', en: 'Upgrade to Pro' },

            // Pricing Section
            title: { fa: 'قیمت‌گذاری ساده و شفاف 💰', en: 'Simple and Transparent Pricing 💰' },
            subtitle: { fa: 'پلنی که متناسب با نیاز شماست را انتخاب کنید', en: 'Choose the plan that fits your needs' },
            monthly: { fa: 'ماهیانه', en: 'Monthly' },
            yearly: { fa: 'سالیانه', en: 'Yearly' },
            save_2months: { fa: '2 ماه رایگان', en: '2 Months Free' },
            popular: { fa: 'محبوب‌ترین', en: 'Most Popular' },
            per_month: { fa: 'ماه', en: 'month' },
            per_year: { fa: 'سال', en: 'year' },
            save_per_year: { fa: 'صرفه‌جویی $%s در سال', en: 'Save $%s per year' },
            current_plan: { fa: '✓ پلن فعلی شما', en: '✓ Your Current Plan' },
            start_free: { fa: 'شروع رایگان', en: 'Start Free' },
            buy_plan: { fa: 'خرید پلن', en: 'Buy Plan' },

            // FAQ Section
            faq_title: { fa: 'سوالات متداول ❓', en: 'Frequently Asked Questions ❓' },
            faq_q1: { fa: 'آیا می‌توانم پلنم را تغییر دهم؟', en: 'Can I change my plan?' },
            faq_a1: { fa: 'بله! شما می‌توانید هر زمان که بخواهید پلن خود را ارتقا یا کاهش دهید.', en: 'Yes! You can upgrade or downgrade your plan at any time.' },
            faq_q2: { fa: 'آیا بازپرداخت وجود دارد؟', en: 'Is there a refund policy?' },
            faq_a2: { fa: 'بله، ما 14 روز ضمانت بازگشت وجه داریم. اگر راضی نبودید، پول شما برگشت داده می‌شود.', en: 'Yes, we have a 14-day money-back guarantee. If you\'re not satisfied, we\'ll refund your money.' },
            faq_q3: { fa: 'چطور پرداخت کنم؟', en: 'How do I pay?' },
            faq_a3: { fa: 'فعلاً برای خرید با پشتیبانی تماس بگیرید. به زودی درگاه پرداخت آنلاین اضافه می‌شود.', en: 'For now, contact support to purchase. Online payment gateway coming soon.' },
            faq_q4: { fa: 'آیا تخفیف دانشجویی دارید؟', en: 'Do you have student discounts?' },
            faq_a4: { fa: 'بله! دانشجویان و استارتاپ‌های اولیه می‌توانند تا 50% تخفیف دریافت کنند.', en: 'Yes! Students and early-stage startups can get up to 50% discount.' },

            // Contact Section
            contact_title: { fa: 'نیاز به راهنمایی دارید? 🤝', en: 'Need Help? 🤝' },
            contact_subtitle: { fa: 'تیم ما آماده است تا به شما کمک کند بهترین پلن را انتخاب کنید', en: 'Our team is ready to help you choose the best plan' },
            email_us: { fa: '📧 ایمیل به ما', en: '📧 Email Us' },
            call_us: { fa: '📱 تماس با ما', en: '📱 Call Us' },

            // Header
            sign_out: { fa: 'خروج', en: 'Sign Out' },
            back_home: { fa: 'بازگشت به خانه', en: 'Back to Home' },
            current_plan_label: { fa: 'پلن فعلی:', en: 'Current Plan:' },

            // Showcase Section
            showcase_title: { fa: '🌟 پروژه‌های عمومی', en: '🌟 Public Projects Showcase' },
            showcase_subtitle: { fa: 'ایده‌های الهام‌بخش از جامعه ما', en: 'Inspiring ideas from our community' },
            filter_all: { fa: 'همه', en: 'All' },
            filter_trending: { fa: 'پرطرفدار', en: 'Trending' },
            filter_completed: { fa: 'تکمیل شده', en: 'Completed' },
            filter_recent: { fa: 'جدیدترین', en: 'Recent' },
            phase_of: { fa: 'مرحله %s از %s', en: 'Phase %s of %s' },
            view_project: { fa: 'مشاهده پروژه', en: 'View Project' },
            likes: { fa: 'پسند', en: 'Likes' },
            comments: { fa: 'نظر', en: 'Comments' },
            testimonials_title: { fa: '💬 نظرات کاربران', en: '💬 User Testimonials' },

            // Features Section
            features_title: { fa: '✨ ویژگی‌های کلیدی', en: '✨ Key Features' },
            feature1_title: { fa: '🤖 هوش مصنوعی پیشرفته', en: '🤖 Advanced AI' },
            feature1_desc: { fa: 'راهنمایی هوشمند در هر مرحله از مسیر استارتاپ', en: 'Smart guidance at every stage of your startup journey' },
            feature2_title: { fa: '📊 8 مرحله جامع', en: '📊 8 Comprehensive Phases' },
            feature2_desc: { fa: 'از تعریف ایده تا آماده‌سازی پیچ برای سرمایه‌گذار', en: 'From idea definition to investor pitch preparation' },
            feature3_title: { fa: '👥 همکاری تیمی', en: '👥 Team Collaboration' },
            feature3_desc: { fa: 'به اشتراک‌گذاری و کار تیمی روی پروژه', en: 'Share and collaborate on projects with your team' },
            feature4_title: { fa: '📤 خروجی حرفه‌ای', en: '📤 Professional Export' },
            feature4_desc: { fa: 'دریافت بیزنس پلن و پیچ دک به فرمت‌های مختلف', en: 'Get business plan and pitch deck in various formats' },

            // Stats Section
            stats_title: { fa: '📈 آمار پلتفرم', en: '📈 Platform Stats' },
            stat_users: { fa: '+ کاربر فعال', en: '+ Active Users' },
            stat_projects: { fa: '+ پروژه ایجاد شده', en: '+ Projects Created' },
            stat_completed: { fa: '+ بیزنس پلن کامل', en: '+ Completed Business Plans' },
            stat_funding: { fa: 'میلیون دلار سرمایه جذب شده', en: 'Million $ Funding Raised' },

            // Footer
            footer_tagline: { fa: 'ساخته شده با ❤️ برای استارتاپ‌های آینده', en: 'Made with ❤️ for future startups' },
            footer_rights: { fa: 'تمامی حقوق محفوظ است.', en: 'All rights reserved.' },
            home: { fa: 'خانه', en: 'Home' },
            about_us: { fa: 'درباره ما', en: 'About Us' },
        };
        return translations[key]?.[locale] || key;
    };

    const plans = [
        {
            id: 'free',
            name: 'Free',
            nameFa: 'رایگان',
            emoji: '🆓',
            price: 0,
            priceYearly: 0,
            description: { fa: 'برای شروع و آزمایش', en: 'To get started and test' },
            features: [
                { icon: '📁', fa: '1 پروژه', en: '1 Project' },
                { icon: '🤖', fa: '50 پیام AI در ماه', en: '50 AI Messages/month' },
                { icon: '👥', fa: 'بدون اشتراک‌گذاری تیمی', en: 'No Team Sharing' },
                { icon: '🎯', fa: 'دسترسی تا مرحله 1', en: 'Access up to Phase 1' },
                { icon: '📤', fa: 'Export غیرفعال', en: 'Export Disabled' },
                { icon: '💾', fa: '50MB فضای ذخیره‌سازی', en: '50MB Storage' }
            ],
            limitations: [
                { icon: '❌', fa: 'بدون پشتیبانی اولویت‌دار', en: 'No Priority Support' },
                { icon: '❌', fa: 'بدون دسترسی به مراحل پیشرفته', en: 'No Advanced Phases' }
            ],
            color: { button: 'bg-slate-600 hover:bg-slate-700' }
        },
        {
            id: 'starter',
            name: 'Starter',
            nameFa: 'استارتر',
            emoji: '🚀',
            price: 29,
            priceYearly: 290,
            description: { fa: 'برای استارتاپ‌های کوچک', en: 'For small startups' },
            features: [
                { icon: '📁', fa: '3 پروژه', en: '3 Projects' },
                { icon: '🤖', fa: '500 پیام AI در ماه', en: '500 AI Messages/month' },
                { icon: '👥', fa: 'اشتراک با 2 عضو', en: 'Share with 2 Members' },
                { icon: '🎯', fa: 'دسترسی به تمام 8 مرحله', en: 'Access to All 8 Phases' },
                { icon: '📤', fa: 'Export پایه (PDF)', en: 'Basic Export (PDF)' },
                { icon: '💾', fa: '500MB فضای ذخیره‌سازی', en: '500MB Storage' },
                { icon: '📧', fa: 'پشتیبانی ایمیلی', en: 'Email Support' }
            ],
            color: { button: 'bg-blue-600 hover:bg-blue-700' },
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            nameFa: 'حرفه‌ای',
            emoji: '💎',
            price: 79,
            priceYearly: 790,
            description: { fa: 'برای کسب‌وکارهای در حال رشد', en: 'For growing businesses' },
            features: [
                { icon: '📁', fa: 'پروژه نامحدود', en: 'Unlimited Projects' },
                { icon: '🤖', fa: '2000 پیام AI در ماه', en: '2000 AI Messages/month' },
                { icon: '👥', fa: 'اشتراک با 10 عضو', en: 'Share with 10 Members' },
                { icon: '🎯', fa: 'دسترسی به تمام مراحل', en: 'Access to All Phases' },
                { icon: '📤', fa: 'Export پیشرفته (PDF, Word, Excel)', en: 'Advanced Export (PDF, Word, Excel)' },
                { icon: '💾', fa: '5GB فضای ذخیره‌سازی', en: '5GB Storage' },
                { icon: '⚡', fa: 'پشتیبانی اولویت‌دار', en: 'Priority Support' },
                { icon: '📊', fa: 'تحلیل و گزارش پیشرفته', en: 'Advanced Analytics' }
            ],
            color: { button: 'bg-purple-600 hover:bg-purple-700' },
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            nameFa: 'سازمانی',
            emoji: '👑',
            price: 199,
            priceYearly: 1990,
            description: { fa: 'برای سازمان‌های بزرگ', en: 'For large organizations' },
            features: [
                { icon: '📁', fa: 'پروژه نامحدود', en: 'Unlimited Projects' },
                { icon: '🤖', fa: 'AI نامحدود', en: 'Unlimited AI' },
                { icon: '👥', fa: 'تیم نامحدود', en: 'Unlimited Team' },
                { icon: '🎯', fa: 'تمام امکانات Pro', en: 'All Pro Features' },
                { icon: '📤', fa: 'Export نامحدود', en: 'Unlimited Export' },
                { icon: '💾', fa: 'فضای نامحدود', en: 'Unlimited Storage' },
                { icon: '🎨', fa: 'سفارشی‌سازی کامل', en: 'Full Customization' },
                { icon: '👨‍💼', fa: 'مشاور اختصاصی', en: 'Dedicated Consultant' },
                { icon: '🔒', fa: 'امنیت سازمانی', en: 'Enterprise Security' }
            ],
            color: { button: 'bg-yellow-600 hover:bg-yellow-700' },
            popular: false
        }
    ];

    const handleSelectPlan = (planId: string) => {
        if (!user) {
            alert(locale === 'fa' ? 'لطفاً ابتدا وارد شوید' : 'Please sign in first');
            window.location.href = '/login.html';
            return;
        }

        if (planId === 'free') {
            alert(locale === 'fa' ? 'شما در حال حاضر از پلن رایگان استفاده می‌کنید' : 'You are currently using the free plan');
            return;
        }

        const msg = locale === 'fa'
            ? `برای خرید پلن ${planId.toUpperCase()} با پشتیبانی تماس بگیرید:\n📧 support@yourstartup.com\n📱 09123456789`
            : `To purchase the ${planId.toUpperCase()} plan, contact support:\n📧 support@yourstartup.com\n📱 +989123456789`;
        alert(msg);
    };

    const handleStartFree = () => {
        window.location.href = '/login.html';
    };

    const handleUpgradePro = () => {
        if (!user) {
            window.location.href = '/login.html';
            return;
        }
        handleSelectPlan('pro');
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/20 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20 transition-colors duration-300`} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    AI Startup Mentor
                                </h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {locale === 'fa' ? 'دستیار هوشمند استارتاپی' : 'Your AI Startup Assistant'}
                                </p>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            <LanguageSelector />
                            <button
                                onClick={() => {
                                    const newTheme = theme === 'light' ? 'dark' : 'light';
                                    setTheme(newTheme);
                                    localStorage.setItem('theme', newTheme);
                                    if (newTheme === 'dark') {
                                        document.documentElement.classList.add('dark');
                                    } else {
                                        document.documentElement.classList.remove('dark');
                                    }
                                }}
                                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            {user && (
                                <div className={`flex items-center gap-3 ${locale === 'fa' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={locale === 'fa' ? 'text-right' : 'text-left'}>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {user.email}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {t('current_plan_label')} <span className="font-semibold">{planName}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={signOut}
                                        className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        {t('sign_out')}
                                    </button>
                                </div>
                            )}
                            <a
                                href="/"
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                {t('back_home')}
                            </a>
                            <a
                                href="/about.html"
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                {t('about_us')}
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                        {t('hero_title')}
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto">
                        {t('hero_subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button
                            onClick={handleStartFree}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-bold shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105"
                        >
                            {t('cta_start')} 🚀
                        </button>
                        <button
                            onClick={handleUpgradePro}
                            className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg rounded-xl border-2 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 transition-all font-bold shadow-lg"
                        >
                            {t('cta_upgrade_pro')} 💎
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
                <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
                    {t('features_title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {['feature1', 'feature2', 'feature3', 'feature4'].map((feature) => (
                        <div
                            key={feature}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-slate-200 dark:border-slate-700"
                        >
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                {t(`${feature}_title`)}
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400">
                                {t(`${feature}_desc`)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('title')}
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                        {t('subtitle')}
                    </p>

                    {/* Billing Cycle Toggle */}
                    <div className="inline-flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                billingCycle === 'monthly'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            {t('monthly')}
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
                                billingCycle === 'yearly'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            {t('yearly')}
                            {billingCycle === 'yearly' && (
                                <span className={`absolute -top-2 ${locale === 'fa' ? '-right-2' : '-left-2'} bg-green-500 text-white text-xs px-2 py-1 rounded-full`}>
                                    {t('save_2months')}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {plans.map((plan) => {
                        const price = billingCycle === 'monthly' ? plan.price : plan.priceYearly;
                        const isCurrentPlan = planName.toLowerCase() === plan.id;

                        return (
                            <div
                                key={plan.id}
                                className={`pricing-card relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden ${
                                    plan.popular ? 'ring-4 ring-purple-500 ring-offset-4 dark:ring-offset-slate-900' : ''
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-2 text-sm font-bold">
                                        ⭐ {t('popular')}
                                    </div>
                                )}

                                <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                                    {/* Header */}
                                    <div className="text-center mb-6">
                                        <div className="text-6xl mb-3">{plan.emoji}</div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                            {locale === 'fa' ? plan.nameFa : plan.name}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {plan.description[locale]}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center mb-6">
                                        <div className="flex items-baseline justify-center gap-2">
                                            <span className="text-5xl font-black text-slate-900 dark:text-white">
                                                ${price}
                                            </span>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                /{t(billingCycle === 'monthly' ? 'per_month' : 'per_year')}
                                            </span>
                                        </div>
                                        {billingCycle === 'yearly' && price > 0 && (
                                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                                {t('save_per_year').replace('%s', String(plan.price * 12 - plan.priceYearly))}
                                            </p>
                                        )}
                                    </div>

                                    {/* Button */}
                                    <button
                                        onClick={() => handleSelectPlan(plan.id)}
                                        disabled={isCurrentPlan}
                                        className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all mb-6 ${
                                            isCurrentPlan
                                                ? 'bg-slate-400 cursor-not-allowed'
                                                : `${plan.color.button} shadow-lg hover:shadow-xl transform hover:scale-105`
                                        }`}
                                    >
                                        {isCurrentPlan ? t('current_plan') : plan.id === 'free' ? t('start_free') : t('buy_plan')}
                                    </button>

                                    {/* Features */}
                                    <div className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className={`flex items-start gap-3 ${locale === 'en' ? 'flex-row' : 'flex-row'}`}>
                                                <span className="text-xl flex-shrink-0">{feature.icon}</span>
                                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                                    {feature[locale]}
                                                </span>
                                            </div>
                                        ))}
                                        {plan.limitations?.map((limitation, index) => (
                                            <div key={index} className={`flex items-start gap-3 opacity-50 ${locale === 'en' ? 'flex-row' : 'flex-row'}`}>
                                                <span className="text-xl flex-shrink-0">{limitation.icon}</span>
                                                <span className="text-sm text-slate-700 dark:text-slate-300 line-through">
                                                    {limitation[locale]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-3xl font-bold text-center text-white mb-12">
                        {t('stats_title')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '2,500', label: 'stat_users' },
                            { value: '1,200', label: 'stat_projects' },
                            { value: '450', label: 'stat_completed' },
                            { value: '12.5', label: 'stat_funding' },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-white">
                                <div className="text-5xl font-black mb-2">{stat.value}</div>
                                <div className="text-lg opacity-90">{t(stat.label)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-16">
                    <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
                        {t('faq_title')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['q1', 'q2', 'q3', 'q4'].map((q) => (
                            <div key={q}>
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                                    {t(`faq_${q}`)}
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    {t(`faq_a${q.slice(1)}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-center text-white">
                    <h3 className="text-3xl font-bold mb-4">
                        {t('contact_title')}
                    </h3>
                    <p className="text-lg mb-6 opacity-90">
                        {t('contact_subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:support@yourstartup.com"
                            className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
                        >
                            {t('email_us')}
                        </a>
                        <a
                            href="tel:+989123456789"
                            className="px-8 py-3 bg-purple-700 text-white rounded-xl font-bold hover:bg-purple-800 transition-all shadow-lg"
                        >
                            {t('call_us')}
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6">
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="/" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                {t('home')}
                            </a>
                            <a href="/about.html" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                {t('about_us')}
                            </a>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                            {t('footer_tagline')}
                        </p>
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
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

const PricingApp: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <LanguageProvider>
                    <PricingPage />
                </LanguageProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<PricingApp />);
