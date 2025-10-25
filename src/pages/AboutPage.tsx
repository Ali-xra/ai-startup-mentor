import React from 'react';
import { useTranslation } from 'react-i18next';
import { PublicNavigation } from '../components/PublicNavigation';
import '../index.css';

const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as 'en' | 'fa';

  const teamMembers = [
    {
      name: t('about_member1_name'),
      role: t('about_member1_role'),
      desc: t('about_member1_desc'),
      avatar: 'علی',
      social: { linkedin: '#', twitter: '#' },
    },
    {
      name: t('about_member2_name'),
      role: t('about_member2_role'),
      desc: t('about_member2_desc'),
      avatar: 'سارا',
      social: { linkedin: '#', twitter: '#' },
    },
    {
      name: t('about_member3_name'),
      role: t('about_member3_role'),
      desc: t('about_member3_desc'),
      avatar: 'محمد',
      social: { linkedin: '#', twitter: '#' },
    },
    {
      name: t('about_member4_name'),
      role: t('about_member4_role'),
      desc: t('about_member4_desc'),
      avatar: 'فاطمه',
      social: { linkedin: '#', twitter: '#' },
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20 transition-colors duration-300`}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
    >
      {/* Public Navigation */}
      <PublicNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            {t('about_hero_title')}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-3xl mx-auto">
            {t('about_hero_subtitle')}
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
            {t('about_story_title')}
          </h3>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
            <div className="space-y-6 text-slate-700 dark:text-slate-300">
              <p className="text-lg leading-relaxed">{t('about_story_text1')}</p>
              <p className="text-lg leading-relaxed">{t('about_story_text2')}</p>
              <p className="text-lg leading-relaxed">{t('about_story_text3')}</p>
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
              {t('about_mission_title')}
            </h3>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              {t('about_mission_text')}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
              {t('about_vision_title')}
            </h3>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              {t('about_vision_text')}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('about_values_title')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'about_value1_title', desc: 'about_value1_desc', icon: '' },
            { title: 'about_value2_title', desc: 'about_value2_desc', icon: '' },
            { title: 'about_value3_title', desc: 'about_value3_desc', icon: '' },
            { title: 'about_value4_title', desc: 'about_value4_desc', icon: '' },
          ].map((value, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-slate-200 dark:border-slate-700 text-center"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {t(value.title)}
              </h4>
              <p className="text-slate-600 dark:text-slate-400">{t(value.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('about_team_title')}
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('about_team_subtitle')}</p>
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
                {member.name}
              </h4>
              <p className="text-purple-600 dark:text-purple-400 font-semibold mb-3">
                {member.role}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {member.desc}
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <a
                  href={member.social.linkedin}
                  className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                ></a>
                <a
                  href={member.social.twitter}
                  className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                ></a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 sm:p-12 text-center text-white">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">{t('about_contact_title')}</h3>
          <p className="text-lg mb-6 opacity-90">{t('about_contact_subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@aistartupmentor.com"
              className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
            >
              {t('about_email_us')}
            </a>
            <div className="px-8 py-3 bg-purple-700 rounded-xl font-bold">
              {t('about_follow_us')}
            </div>
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
                {t('nav_home')}
              </a>
              <a
                href="/pricing"
                className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {t('nav_pricing')}
              </a>
            </div>
          </div>
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-2">{t('about_footer_tagline')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © 2025 AI Startup Mentor. {t('about_footer_rights')}
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

export default AboutPage;
