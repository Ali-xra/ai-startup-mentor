import React, { useState } from 'react';
import type { ProjectFilter } from '../../services/publicProjectsService';

interface ProjectFiltersProps {
  activeFilter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filters: Array<{ value: ProjectFilter; label: string; icon: string; description: string }> = [
    {
      value: 'all',
      label: 'همه پروژه‌ها',
      icon: '📋',
      description: 'نمایش تمام پروژه‌های عمومی',
    },
    {
      value: 'trending',
      label: 'پرطرفدار',
      icon: '🔥',
      description: 'پروژه‌هایی با بیشترین لایک',
    },
    {
      value: 'completed',
      label: 'تکمیل شده',
      icon: '✅',
      description: 'پروژه‌هایی که تمام فازها را طی کرده‌اند',
    },
    {
      value: 'recent',
      label: 'جدیدترین',
      icon: '🆕',
      description: 'پروژه‌های اخیراً اضافه شده',
    },
  ];

  const handleFilterClick = (filter: ProjectFilter) => {
    onFilterChange(filter);
  };

  return (
    <div className="mb-6">
      {/* نمایش دسکتاپ - تب‌ها */}
      <div className="hidden md:flex gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className={`flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeFilter === filter.value
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750'
            }`}
          >
            <span className="text-2xl">{filter.icon}</span>
            <span className="text-sm">{filter.label}</span>
            {activeFilter === filter.value && (
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {filter.description}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* نمایش موبایل - دراپ‌داون */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 font-medium"
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">
              {filters.find((f) => f.value === activeFilter)?.icon}
            </span>
            <span>{filters.find((f) => f.value === activeFilter)?.label}</span>
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isExpanded && (
          <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  handleFilterClick(filter.value);
                  setIsExpanded(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  activeFilter === filter.value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                } border-b border-gray-100 dark:border-gray-700 last:border-b-0`}
              >
                <span className="text-2xl">{filter.icon}</span>
                <div className="flex-1 text-right">
                  <p className="font-medium">{filter.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {filter.description}
                  </p>
                </div>
                {activeFilter === filter.value && (
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* نمایش تعداد پروژه‌ها و آمار */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>فیلتر فعال: {filters.find((f) => f.value === activeFilter)?.label}</span>
        </div>
      </div>
    </div>
  );
};
