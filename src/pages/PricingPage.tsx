import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { PublicNavigation } from '../components/PublicNavigation';
import '../index.css';

const PricingPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { planName } = useFeatureFlags();
  const { t, i18n } = useTranslation('common');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const locale = i18n.language as 'en' | 'fa';

  const plans = [
    {
      id: 'free',
      name: t('pricing_plan_free_name'),
      emoji: '',
      price: 0,
      priceYearly: 0,
      description: t('pricing_plan_free_desc'),
      features: [
        { icon: '', text: t('pricing_feature_projects_1') },
        { icon: '', text: t('pricing_feature_ai_50') },
        { icon: '', text: t('pricing_feature_no_team') },
        { icon: '', text: t('pricing_feature_phases_1') },
        { icon: '', text: t('pricing_feature_export_disabled') },
        { icon: '', text: t('pricing_feature_storage_50mb') },
      ],
      limitations: [
        { icon: '', text: t('pricing_feature_no_priority_support') },
        { icon: '', text: t('pricing_feature_no_advanced_phases') },
      ],
      color: { button: 'bg-slate-600 hover:bg-slate-700' },
    },
    {
      id: 'starter',
      name: t('pricing_plan_starter_name'),
      emoji: '',
      price: 29,
      priceYearly: 290,
      description: t('pricing_plan_starter_desc'),
      features: [
        { icon: '', text: t('pricing_feature_projects_3') },
        { icon: '', text: t('pricing_feature_ai_500') },
        { icon: '', text: t('pricing_feature_team_2') },
        { icon: '', text: t('pricing_feature_phases_all') },
        { icon: '', text: t('pricing_feature_export_basic') },
        { icon: '', text: t('pricing_feature_storage_500mb') },
        { icon: '', text: t('pricing_feature_email_support') },
      ],
      color: { button: 'bg-blue-600 hover:bg-blue-700' },
      popular: false,
    },
    {
      id: 'pro',
      name: t('pricing_plan_pro_name'),
      emoji: '',
      price: 79,
      priceYearly: 790,
      description: t('pricing_plan_pro_desc'),
      features: [
        { icon: '', text: t('pricing_feature_projects_unlimited') },
        { icon: '', text: t('pricing_feature_ai_2000') },
        { icon: '', text: t('pricing_feature_team_10') },
        { icon: '', text: t('pricing_feature_phases_all') },
        { icon: '', text: t('pricing_feature_export_advanced') },
        { icon: '', text: t('pricing_feature_storage_5gb') },
        { icon: '', text: t('pricing_feature_priority_support') },
        { icon: '', text: t('pricing_feature_analytics') },
      ],
      color: { button: 'bg-purple-600 hover:bg-purple-700' },
      popular: true,
    },
    {
      id: 'enterprise',
      name: t('pricing_plan_enterprise_name'),
      emoji: '',
      price: 199,
      priceYearly: 1990,
      description: t('pricing_plan_enterprise_desc'),
      features: [
        { icon: '', text: t('pricing_feature_projects_unlimited') },
        { icon: '', text: t('pricing_feature_ai_unlimited') },
        { icon: '', text: t('pricing_feature_team_unlimited') },
        { icon: '', text: t('pricing_feature_all_pro') },
        { icon: '', text: t('pricing_feature_export_unlimited') },
        { icon: '', text: t('pricing_feature_storage_unlimited') },
        { icon: '', text: t('pricing_feature_customization') },
        { icon: '', text: t('pricing_feature_consultant') },
        { icon: '', text: t('pricing_feature_security') },
      ],
      color: { button: 'bg-yellow-600 hover:bg-yellow-700' },
      popular: false,
    },
  ];

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      alert(t('pricing_alert_signin_first'));
      window.location.href = '/login';
      return;
    }

    if (planId === 'free') {
      alert(t('pricing_alert_already_free'));
      return;
    }

    const msg = t('pricing_alert_contact_support').replace('%s', planId.toUpperCase());
    alert(msg);
  };

  const handleStartFree = () => {
    window.location.href = '/login';
  };

  const handleUpgradePro = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    handleSelectPlan('pro');
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/20 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20 transition-colors duration-300`}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
    >
      {/* Public Navigation */}
      <PublicNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            {t('pricing_hero_title')}
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto">
            {t('pricing_hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleStartFree}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-bold shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105"
            >
              {t('pricing_cta_start')}
            </button>
            <button
              onClick={handleUpgradePro}
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg rounded-xl border-2 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 transition-all font-bold shadow-lg"
            >
              {t('pricing_cta_upgrade_pro')}
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
          {t('pricing_features_title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['feature1', 'feature2', 'feature3', 'feature4'].map((feature) => (
            <div
              key={feature}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-slate-200 dark:border-slate-700"
            >
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {t(`pricing_${feature}_title`)}
              </h4>
              <p className="text-slate-600 dark:text-slate-400">{t(`pricing_${feature}_desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('pricing_title')}
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">{t('pricing_subtitle')}</p>

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
              {t('pricing_monthly')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t('pricing_yearly')}
              {billingCycle === 'yearly' && (
                <span
                  className={`absolute -top-2 ${locale === 'fa' ? '-right-2' : '-left-2'} bg-green-500 text-white text-xs px-2 py-1 rounded-full`}
                >
                  {t('pricing_save_2months')}
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
                  plan.popular
                    ? 'ring-4 ring-purple-500 ring-offset-4 dark:ring-offset-slate-900'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-2 text-sm font-bold">
                    {t('pricing_popular')}
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-3">{plan.emoji}</div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-black text-slate-900 dark:text-white">
                        ${price}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        /{t(billingCycle === 'monthly' ? 'pricing_per_month' : 'pricing_per_year')}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && price > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        {t('pricing_save_per_year').replace(
                          '%s',
                          String(plan.price * 12 - plan.priceYearly)
                        )}
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
                    {isCurrentPlan
                      ? t('pricing_current_plan')
                      : plan.id === 'free'
                        ? t('pricing_start_free')
                        : t('pricing_buy_plan')}
                  </button>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 ${locale === 'en' ? 'flex-row' : 'flex-row'}`}
                      >
                        <span className="text-xl flex-shrink-0">{feature.icon}</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                    {plan.limitations?.map((limitation, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 opacity-50 ${locale === 'en' ? 'flex-row' : 'flex-row'}`}
                      >
                        <span className="text-xl flex-shrink-0">{limitation.icon}</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 line-through">
                          {limitation.text}
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
            {t('pricing_stats_title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2,500', label: 'pricing_stat_users' },
              { value: '1,200', label: 'pricing_stat_projects' },
              { value: '450', label: 'pricing_stat_completed' },
              { value: '12.5', label: 'pricing_stat_funding' },
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
            {t('pricing_faq_title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['q1', 'q2', 'q3', 'q4'].map((q) => (
              <div key={q}>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {t(`pricing_faq_${q}`)}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {t(`pricing_faq_a${q.slice(1)}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">{t('pricing_contact_title')}</h3>
          <p className="text-lg mb-6 opacity-90">{t('pricing_contact_subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@yourstartup.com"
              className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
            >
              {t('pricing_email_us')}
            </a>
            <a
              href="tel:+989123456789"
              className="px-8 py-3 bg-purple-700 text-white rounded-xl font-bold hover:bg-purple-800 transition-all shadow-lg"
            >
              {t('pricing_call_us')}
            </a>
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
                {t('pricing_home')}
              </a>
              <a
                href="/about"
                className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {t('pricing_about_us')}
              </a>
            </div>
          </div>
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-2">{t('pricing_footer_tagline')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © 2025 AI Startup Mentor. {t('pricing_footer_rights')}
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

export default PricingPage;
