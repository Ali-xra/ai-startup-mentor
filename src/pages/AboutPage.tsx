import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { Locale } from '../i18n';
import LanguageSelector from '../components/LanguageSelector';
import ErrorBoundary from '../components/ErrorBoundary';
import '../index.css';

const AboutPage: React.FC = () => {
    const { language } = useLanguage();
    const locale: Locale = language === 'fa' ? 'fa' : 'en';
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        return savedTheme || 'dark';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

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
            // Navigation
            home: { fa: 'خانه', en: 'Home' },
            pricing: { fa: 'قیمت‌گذاری', en: 'Pricing' },
            about: { fa: 'درباره ما', en: 'About Us' },
            sign_out: { fa: 'خروج', en: 'Sign Out' },
            back_to_home: { fa: 'بازگشت به خانه', en: 'Back to Home' },

            // Hero Section
            hero_title: { fa: 'درباره AI Startup Mentor', en: 'About AI Startup Mentor' },
            hero_subtitle: { fa: 'داستان ما، تیم ما، و چشم‌اندازی که برای آینده استارتاپ‌ها داریم', en: 'Our story, our team, and the vision we have for the future of startups' },

            // Story Section
            story_title: { fa: '📖 داستان ما', en: '📖 Our Story' },
            story_text1: {
                fa: 'همه چیز از یک ایده ساده شروع شد - چطور می‌توانیم کارآفرینان را در مسیر راه‌اندازی استارتاپ‌های موفق همراهی کنیم؟',
                en: 'It all started with a simple idea - how can we help entrepreneurs on their journey to build successful startups?'
            },
            story_text2: {
                fa: 'پس از سال‌ها تجربه در حوزه کارآفرینی و تکنولوژی، تصمیم گرفتیم تا یک پلتفرم هوشمند بسازیم که از هوش مصنوعی برای راهنمایی گام به گام استفاده کند.',
                en: 'After years of experience in entrepreneurship and technology, we decided to build an intelligent platform that uses AI for step-by-step guidance.'
            },
            story_text3: {
                fa: 'امروز، AI Startup Mentor به هزاران کارآفرین کمک کرده تا ایده‌هایشان را به بیزنس پلن‌های حرفه‌ای تبدیل کنند.',
                en: 'Today, AI Startup Mentor has helped thousands of entrepreneurs turn their ideas into professional business plans.'
            },

            // Mission Section
            mission_title: { fa: '🎯 ماموریت ما', en: '🎯 Our Mission' },
            mission_text: {
                fa: 'دموکراتیک کردن فرآیند راه‌اندازی استارتاپ و کمک به کارآفرینان برای تبدیل ایده‌های نوآورانه به کسب‌وکارهای موفق.',
                en: 'Democratizing the startup process and helping entrepreneurs turn innovative ideas into successful businesses.'
            },

            // Vision Section
            vision_title: { fa: '🚀 چشم‌انداز ما', en: '🚀 Our Vision' },
            vision_text: {
                fa: 'ساختن آینده‌ای که در آن هر کسی با یک ایده خوب بتواند استارتاپ موفقی راه‌اندازی کند، بدون توجه به پیشینه یا منابع مالی.',
                en: 'Building a future where anyone with a good idea can launch a successful startup, regardless of their background or financial resources.'
            },

            // Values Section
            values_title: { fa: '💎 ارزش‌های ما', en: '💎 Our Values' },
            value1_title: { fa: 'نوآوری', en: 'Innovation' },
            value1_desc: { fa: 'همیشه در جستجوی راه‌های جدید برای حل مشکلات کارآفرینان', en: 'Always seeking new ways to solve entrepreneurs\' problems' },
            value2_title: { fa: 'دسترسی‌پذیری', en: 'Accessibility' },
            value2_desc: { fa: 'ایجاد فرصت‌های برابر برای همه کارآفرینان', en: 'Creating equal opportunities for all entrepreneurs' },
            value3_title: { fa: 'شفافیت', en: 'Transparency' },
            value3_desc: { fa: 'صداقت کامل با کاربران و جامعه استارتاپی', en: 'Complete honesty with our users and the startup community' },
            value4_title: { fa: 'تعالی', en: 'Excellence' },
            value4_desc: { fa: 'تلاش برای ارائه بهترین تجربه ممکن به کاربران', en: 'Striving to provide the best possible experience for our users' },

            // Team Section
            team_title: { fa: '👥 تیم ما', en: '👥 Our Team' },
            team_subtitle: { fa: 'تیم متنوعی از کارآفرینان، مهندسان و متخصصان حوزه کسب‌وکار', en: 'A diverse team of entrepreneurs, engineers, and business experts' },

            // Team Members
            member1_name: { fa: 'علی رضایی', en: 'Ali Rezaei' },
            member1_role: { fa: 'بنیان‌گذار و مدیرعامل', en: 'Founder & CEO' },
            member1_desc: { fa: 'کارآفرین سریالی با بیش از ۱۰ سال تجربه در راه‌اندازی استارتاپ‌های موفق', en: 'Serial entrepreneur with over 10 years of experience in launching successful startups' },

            member2_name: { fa: 'سارا احمدی', en: 'Sarah Johnson' },
            member2_role: { fa: 'مدیر فنی', en: 'CTO' },
            member2_desc: { fa: 'متخصص هوش مصنوعی با سابقه کار در شرکت‌های بزرگ تکنولوژی', en: 'AI specialist with experience at major technology companies' },

            member3_name: { fa: 'محمد کریمی', en: 'Michael Chen' },
            member3_role: { fa: 'مدیر محصول', en: 'Product Manager' },
            member3_desc: { fa: 'متخصص تجربه کاربری با تمرکز روی طراحی محصولات کاربرپسند', en: 'UX specialist focused on designing user-friendly products' },

            member4_name: { fa: 'فاطمه نوروزی', en: 'Fatima Al-Zahra' },
            member4_role: { fa: 'مشاور کسب‌وکار', en: 'Business Advisor' },
            member4_desc: { fa: 'مشاور باتجربه در حوزه سرمایه‌گذاری و استراتژی کسب‌وکار', en: 'Experienced advisor in investment and business strategy' },

            // Contact Section
            contact_title: { fa: '📧 با ما در تماس باشید', en: '📧 Get in Touch' },
            contact_subtitle: { fa: 'برای همکاری، پیشنهادها یا سوالات با ما تماس بگیرید', en: 'Contact us for partnerships, suggestions, or questions' },
            email_us: { fa: 'ایمیل', en: 'Email' },
            follow_us: { fa: 'شبکه‌های اجتماعی', en: 'Social Media' },

            // Footer
            footer_tagline: { fa: 'ساخته شده با ❤️ برای استارتاپ‌های آینده', en: 'Made with ❤️ for future startups' },
            footer_rights: { fa: 'تمامی حقوق محفوظ است.', en: 'All rights reserved.' },
        };
        return translations[key]?.[locale] || key;
    };

    const teamMembers = [
        {
            name: 'member1_name',
            role: 'member1_role',
            desc: 'member1_desc',
            avatar: 'علی',
            social: { linkedin: '#', twitter: '#' }
        },
        {
            name: 'member2_name',
            role: 'member2_role',
            desc: 'member2_desc',
            avatar: 'سارا',
            social: { linkedin: '#', twitter: '#' }
        },
        {
            name: 'member3_name',
            role: 'member3_role',
            desc: 'member3_desc',
            avatar: 'محمد',
            social: { linkedin: '#', twitter: '#' }
        },
        {
            name: 'member4_name',
            role: 'member4_role',
            desc: 'member4_desc',
            avatar: 'فاطمه',
            social: { linkedin: '#', twitter: '#' }
        }
    ];

    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20 transition-colors duration-300`} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-xl sm:text-2xl">🚀</span>
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
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            <a
                                href="/"
                                className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                {t('home')}
                            </a>
                            <a
                                href="/pricing.html"
                                className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                {t('pricing')}
                            </a>
                            <a
                                href="/"
                                className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                {t('back_to_home')}
                            </a>
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
                    <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-3xl mx-auto">
                        {t('hero_subtitle')}
                    </p>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>
            </section>

            {/* Story Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('story_title')}
                    </h3>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
                        <div className="space-y-6 text-slate-700 dark:text-slate-300">
                            <p className="text-lg leading-relaxed">
                                {t('story_text1')}
                            </p>
                            <p className="text-lg leading-relaxed">
                                {t('story_text2')}
                            </p>
                            <p className="text-lg leading-relaxed">
                                {t('story_text3')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Mission */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                            {t('mission_title')}
                        </h3>
                        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            {t('mission_text')}
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                            {t('vision_title')}
                        </h3>
                        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            {t('vision_text')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('values_title')}
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'value1_title', desc: 'value1_desc', icon: '💡' },
                        { title: 'value2_title', desc: 'value2_desc', icon: '🌍' },
                        { title: 'value3_title', desc: 'value3_desc', icon: '🔍' },
                        { title: 'value4_title', desc: 'value4_desc', icon: '⭐' }
                    ].map((value, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-slate-200 dark:border-slate-700 text-center"
                        >
                            <div className="text-4xl mb-4">{value.icon}</div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                {t(value.title)}
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400">
                                {t(value.desc)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('team_title')}
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        {t('team_subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-slate-200 dark:border-slate-700 text-center"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                                {member.avatar}
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {t(member.name)}
                            </h4>
                            <p className="text-purple-600 dark:text-purple-400 font-semibold mb-3">
                                {t(member.role)}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t(member.desc)}
                            </p>
                            <div className="flex justify-center gap-3 mt-4">
                                <a href={member.social.linkedin} className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    💼
                                </a>
                                <a href={member.social.twitter} className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    🐦
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 sm:p-12 text-center text-white">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                        {t('contact_title')}
                    </h3>
                    <p className="text-lg mb-6 opacity-90">
                        {t('contact_subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:info@aistartupmentor.com"
                            className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
                        >
                            📧 {t('email_us')}
                        </a>
                        <div className="px-8 py-3 bg-purple-700 rounded-xl font-bold">
                            📱 {t('follow_us')}
                        </div>
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
                            <a href="/pricing.html" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                {t('pricing')}
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

const AboutApp: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <LanguageProvider>
                    <AboutPage />
                </LanguageProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<AboutApp />);
