import React, { useState, useEffect } from 'react';
import type { ProjectFilters as Filters } from '../../types/project';

interface ProjectFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  initialFilters?: Filters;
}

// لیست صنعت‌ها (مطابق با پلن اصلی)
const INDUSTRIES = [
  'فناوری',
  'سلامت',
  'آموزش',
  'املاک',
  'خرده‌فروشی',
  'غذا و نوشیدنی',
  'حمل و نقل',
  'انرژی',
  'مالی',
  'سرگرمی'
];

// مراحل پروژه
const STAGES = [
  'ایده',
  'MVP',
  'رشد اولیه',
  'رشد',
  'بلوغ'
];

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  onFiltersChange,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  // اعمال فیلترها
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  // تغییر صنعت
  const handleIndustryToggle = (industry: string) => {
    const current = filters.industries || [];
    const updated = current.includes(industry)
      ? current.filter(i => i !== industry)
      : [...current, industry];

    setFilters({ ...filters, industries: updated });
  };

  // تغییر مرحله
  const handleStageToggle = (stage: string) => {
    const current = filters.stages || [];
    const updated = current.includes(stage)
      ? current.filter(s => s !== stage)
      : [...current, stage];

    setFilters({ ...filters, stages: updated });
  };

  // تغییر بازه سرمایه‌گذاری
  const handleInvestmentChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFilters({
      ...filters,
      [type === 'min' ? 'investmentMin' : 'investmentMax']: numValue
    });
  };

  // پاک کردن همه فیلترها
  const handleClearAll = () => {
    setFilters({});
  };

  // تعداد فیلترهای فعال
  const activeFiltersCount =
    (filters.industries?.length || 0) +
    (filters.stages?.length || 0) +
    (filters.investmentMin ? 1 : 0) +
    (filters.investmentMax ? 1 : 0) +
    (filters.seekingInvestment ? 1 : 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700">
      {/* هدر فیلترها */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 ml-2 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            فیلترها
            {activeFiltersCount > 0 && (
              <span className="mr-2 text-sm text-blue-600 dark:text-blue-400">
                ({activeFiltersCount} فعال)
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              پاک کردن همه
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            {isExpanded ? '▲ بستن' : '▼ باز کردن'}
          </button>
        </div>
      </div>

      {/* محتوای فیلترها */}
      {isExpanded && (
        <div className="space-y-6">
          {/* فیلتر: فقط در جستجوی سرمایه */}
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.seekingInvestment || false}
                onChange={(e) => setFilters({ ...filters, seekingInvestment: e.target.checked })}
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                فقط پروژه‌های در جستجوی سرمایه
              </span>
            </label>
          </div>

          {/* فیلتر: بازه سرمایه‌گذاری */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              بازه سرمایه‌گذاری (دلار)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="حداقل"
                  value={filters.investmentMin || ''}
                  onChange={(e) => handleInvestmentChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="حداکثر"
                  value={filters.investmentMax || ''}
                  onChange={(e) => handleInvestmentChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* فیلتر: صنعت */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              صنعت
            </label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((industry) => {
                const isSelected = filters.industries?.includes(industry);
                return (
                  <button
                    key={industry}
                    onClick={() => handleIndustryToggle(industry)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {industry}
                  </button>
                );
              })}
            </div>
          </div>

          {/* فیلتر: مرحله */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              مرحله پروژه
            </label>
            <div className="flex flex-wrap gap-2">
              {STAGES.map((stage) => {
                const isSelected = filters.stages?.includes(stage);
                return (
                  <button
                    key={stage}
                    onClick={() => handleStageToggle(stage)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      isSelected
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
