import React from 'react';
import { SettingsMenu } from './SettingsMenu';
import { SearchBox } from './SearchBox';
import { Locale, t } from '../i18n';

interface HeaderProps {
  progress: number;
  theme: 'light' | 'dark';
  locale: Locale;
  projectName?: string;
  initialIdea?: string;
  startupData?: any;
  onThemeToggle: () => void;
  onLocaleToggle: () => void;
  onRestart: () => void;
  onSwitchProjects: () => void;
  onExportProject: () => void;
  onExportPDF: () => void;
  onExportWord: () => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onToggleTheme: () => void;
  onPublishToggle?: () => void;
  currentTheme: 'light' | 'dark';
  isPublished?: boolean;
  onNavigate?: (section: string) => void;
  onSearch?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  locale,
  projectName,
  initialIdea,
  startupData,
  onRestart,
  onSwitchProjects,
  onExportProject,
  onExportPDF,
  onExportWord,
  onExportCSV,
  onExportExcel,
  onToggleTheme,
  onPublishToggle,
  currentTheme,
  isPublished,
  onNavigate,
  onSearch,
}) => {
  const title = projectName || initialIdea || t('header_title_unnamed', locale);
  return (
    <header className="p-4 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4 flex-1">
            <h1
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 truncate max-w-sm md:max-w-md lg:max-w-lg"
              title={title}
            >
              {title}
            </h1>
            {startupData && (
              <SearchBox
                startupData={startupData}
                locale={locale}
                onNavigate={onNavigate}
                onSearch={onSearch}
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onSwitchProjects}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={t('header_switch_project_tooltip', locale)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
                />
              </svg>
            </button>
            <SettingsMenu
              onRestart={onRestart}
              onSwitchProjects={onSwitchProjects}
              onExportProject={onExportProject}
              onExportPDF={onExportPDF}
              onExportWord={onExportWord}
              onExportCSV={onExportCSV}
              onExportExcel={onExportExcel}
              onToggleTheme={onToggleTheme}
              onPublishToggle={onPublishToggle}
              currentTheme={currentTheme}
              isPublished={isPublished}
              locale={locale}
            />
          </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </header>
  );
};
