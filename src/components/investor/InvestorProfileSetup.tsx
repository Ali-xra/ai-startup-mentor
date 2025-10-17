// ==========================================
// Component: InvestorProfileSetup
// تکمیل پروفایل اولیه سرمایه‌گذار
// ==========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestorAuth } from '../../hooks/useInvestorAuth';
import { investorProfileService } from '../../services/investorProfileService';
import type { InvestorType } from '../../types/investor';

const INVESTOR_TYPES: { value: InvestorType; label: string }[] = [
  { value: 'angel', label: 'سرمایه‌گذار فرشته (Angel Investor)' },
  { value: 'vc', label: 'سرمایه‌گذار خطرپذیر (VC)' },
  { value: 'corporate', label: 'سرمایه‌گذاری شرکتی' },
  { value: 'partner', label: 'شریک استراتژیک' }
];

const INDUSTRIES = [
  'فناوری', 'سلامت و پزشکی', 'آموزش', 'املاک', 'خرده‌فروشی',
  'غذا و نوشیدنی', 'حمل و نقل', 'انرژی', 'مالی', 'سرگرمی'
];

const STAGES = [
  'ایده', 'MVP', 'رشد اولیه', 'رشد', 'بلوغ'
];

export const InvestorProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useInvestorAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Step 1: اطلاعات پایه
    investor_type: '' as InvestorType | '',
    company_name: '',
    linkedin_url: '',

    // Step 2: بازه سرمایه‌گذاری
    investment_min: '',
    investment_max: '',

    // Step 3: علایق
    preferred_industries: [] as string[],
    preferred_stages: [] as string[],
    preferred_locations: [] as string[],

    // Step 4: تجربه
    years_of_experience: '',
    bio: ''
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'preferred_industries' | 'preferred_stages' | 'preferred_locations', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // آپدیت investor profile
      await investorProfileService.updateInvestorProfile(user.id, {
        investor_type: formData.investor_type as InvestorType,
        company_name: formData.company_name || null,
        investment_min: formData.investment_min ? parseFloat(formData.investment_min) : null,
        investment_max: formData.investment_max ? parseFloat(formData.investment_max) : null,
        preferred_industries: formData.preferred_industries,
        preferred_stages: formData.preferred_stages,
        preferred_locations: formData.preferred_locations,
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null
      } as any);

      // آپدیت user profile
      await investorProfileService.upsertUserProfile(user.id, {
        linkedin_url: formData.linkedin_url || null,
        bio: formData.bio || null
      } as any);

      await refreshProfile();

      // هدایت به داشبورد
      navigate('/investor/dashboard');
    } catch (err: any) {
      console.error('Profile setup error:', err);
      setError(err.message || 'خطا در ذخیره اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">اطلاعات پایه</h3>

      {/* Investor Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          نوع سرمایه‌گذار *
        </label>
        <select
          value={formData.investor_type}
          onChange={(e) => handleChange('investor_type', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        >
          <option value="">انتخاب کنید...</option>
          {INVESTOR_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          نام شرکت (اختیاری)
        </label>
        <input
          type="text"
          value={formData.company_name}
          onChange={(e) => handleChange('company_name', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="نام شرکت یا صندوق سرمایه‌گذاری"
        />
      </div>

      {/* LinkedIn */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          لینکدین (اختیاری)
        </label>
        <input
          type="url"
          value={formData.linkedin_url}
          onChange={(e) => handleChange('linkedin_url', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="https://linkedin.com/in/yourprofile"
          dir="ltr"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">بازه سرمایه‌گذاری</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">مبالغ به دلار وارد شوند</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Min Investment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            حداقل ($)
          </label>
          <input
            type="number"
            value={formData.investment_min}
            onChange={(e) => handleChange('investment_min', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="10000"
            dir="ltr"
            min="0"
          />
        </div>

        {/* Max Investment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            حداکثر ($)
          </label>
          <input
            type="number"
            value={formData.investment_max}
            onChange={(e) => handleChange('investment_max', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="100000"
            dir="ltr"
            min="0"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">علایق سرمایه‌گذاری</h3>

      {/* Industries */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          صنعت‌های مورد علاقه
        </label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map(industry => (
            <button
              key={industry}
              type="button"
              onClick={() => toggleArrayItem('preferred_industries', industry)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                formData.preferred_industries.includes(industry)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Stages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          مراحل مورد علاقه
        </label>
        <div className="flex flex-wrap gap-2">
          {STAGES.map(stage => (
            <button
              key={stage}
              type="button"
              onClick={() => toggleArrayItem('preferred_stages', stage)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                formData.preferred_stages.includes(stage)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">تجربه و بیوگرافی</h3>

      {/* Years of Experience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          سال‌های تجربه
        </label>
        <input
          type="number"
          value={formData.years_of_experience}
          onChange={(e) => handleChange('years_of_experience', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="5"
          min="0"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          درباره شما
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          placeholder="چند خط درباره تجربه و علایق سرمایه‌گذاری خود بنویسید..."
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              مرحله {step} از 4
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((step / 4) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            تکمیل پروفایل سرمایه‌گذار
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Steps */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                قبلی
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !formData.investor_type}
                className="mr-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                بعدی
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mr-auto px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    در حال ذخیره...
                  </>
                ) : (
                  'تکمیل و ورود به داشبورد'
                )}
              </button>
            )}
          </div>

          {/* Skip Button */}
          {step < 4 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/investor/dashboard')}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                رد کردن و بعداً تکمیل کنم
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
