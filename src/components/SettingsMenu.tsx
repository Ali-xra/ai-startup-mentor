import React, { useState, useRef, useEffect } from 'react';
import { Locale, t } from '../i18n';

interface SettingsMenuProps {
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
  locale: Locale;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
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
  isPublished = false,
  locale,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRestart = () => {
    onRestart();
    setIsOpen(false);
  };

  const handleSwitch = () => {
    onSwitchProjects();
    setIsOpen(false);
  };

  const handleExport = () => {
    onExportProject();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        title={t('settings_tooltip', locale)}
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
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute mt-2 w-72 ${locale === 'fa' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
        >
          <div className="py-1">
            {/* Project Management Section */}
            <button
              onClick={handleSwitch}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${locale === 'fa' ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
                />
              </svg>
              <span>{t('settings_switch_project', locale)}</span>
            </button>

            {/* Share & Publish Section */}
            {onPublishToggle && (
              <>
                <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                <div className="px-4 py-2">
                  <p className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${locale === 'fa' ? 'text-right' : 'text-left'}`}>
                    {locale === 'fa' ? '📢 اشتراک‌گذاری' : '📢 Share'}
                  </p>
                </div>
                <div className="px-3 py-2 mx-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <button
                    onClick={() => {
                      onPublishToggle();
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                      isPublished
                        ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                    } ${locale === 'fa' ? 'text-right' : 'text-left'}`}
                  >
                    <div className={`flex items-center gap-3 ${locale === 'fa' ? 'flex-row-reverse' : ''}`}>
                      <div className={`p-2 rounded-lg ${
                        isPublished
                          ? 'bg-green-100 dark:bg-green-900/50'
                          : 'bg-blue-100 dark:bg-blue-900/50'
                      }`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className={`w-5 h-5 ${
                            isPublished
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {isPublished ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                            />
                          )}
                        </svg>
                        {isPublished && (
                          <svg
                            className="w-3 h-3 absolute -mt-1 -mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                              className="text-green-600 dark:text-green-400"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          isPublished
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}>
                          {isPublished
                            ? locale === 'fa' ? '🌐 عمومی' : '🌐 Public'
                            : locale === 'fa' ? '🔒 خصوصی' : '🔒 Private'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {isPublished
                            ? locale === 'fa'
                              ? 'در بازار نمایش داده می‌شود'
                              : 'Visible in marketplace'
                            : locale === 'fa'
                              ? 'فقط شما می‌بینید'
                              : 'Only you can see'}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isPublished
                        ? 'bg-green-600 dark:bg-green-700 text-white'
                        : 'bg-blue-600 dark:bg-blue-700 text-white'
                    }`}>
                      {isPublished
                        ? locale === 'fa' ? 'خصوصی کن' : 'Unpublish'
                        : locale === 'fa' ? 'انتشار' : 'Publish'}
                    </div>
                  </button>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-1">
                    {locale === 'fa'
                      ? 'با انتشار عمومی، پروژه شما در بازار نمایش داده می‌شود'
                      : 'When published, your project will be visible in the marketplace'}
                  </p>
                </div>
              </>
            )}

            {/* Export Section */}
            <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
            <div className="px-4 py-2">
              <p className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${locale === 'fa' ? 'text-right' : 'text-left'}`}>
                {locale === 'fa' ? '📥 خروجی' : '📥 Export'}
              </p>
            </div>
            <button
              onClick={handleExport}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${locale === 'fa' ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              <span>{t('settings_export_project', locale)}</span>
            </button>

            <button
              onClick={() => {
                onExportPDF();
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${locale === 'fa' ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <span>{t('export_pdf', locale)}</span>
            </button>
            <button
              onClick={() => {
                onExportWord();
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${locale === 'fa' ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0v3m0 0v3.75m0-3.75h9.75c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H8.25c-.621 0-1.125-.504-1.125-1.125V11.25c0-.621.504-1.125 1.125-1.125H9m6.75 0v3.75M9 15.75v3.75M15 15.75v3.75"
                />
              </svg>
              <span>{t('export_word', locale)}</span>
            </button>
            <button
              onClick={() => {
                onExportCSV();
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${locale === 'fa' ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 19.5h17.25m0 0a1.125 1.125 0 0 1-1.125 1.125H4.5a1.125 1.125 0 0 1-1.125-1.125m0 0V5.25a1.125 1.125 0 0 1 1.125-1.125h4.5a1.125 1.125 0 0 1 1.125 1.125v13.5m-6.75 0h6.75m0 0v-3.375A3.375 3.375 0 0 0 12.375 15H8.25"
                />
              </svg>
              <span>{t('export_csv', locale)}</span>
            </button>
            <button
              onClick={() => {
                onExportExcel();
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${locale === 'fa' ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 19.5h17.25m0 0a1.125 1.125 0 0 1-1.125 1.125H4.5a1.125 1.125 0 0 1-1.125-1.125m0 0V5.25a1.125 1.125 0 0 1 1.125-1.125h4.5a1.125 1.125 0 0 1 1.125 1.125v13.5m-6.75 0h6.75m0 0v-3.375A3.375 3.375 0 0 0 12.375 15H8.25"
                />
              </svg>
              <span>{t('export_excel', locale)}</span>
            </button>

            <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
            <button
              onClick={() => {
                onToggleTheme();
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${locale === 'fa' ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              {currentTheme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              )}
              <span>
                {currentTheme === 'dark'
                  ? t('theme_light', locale) || 'روشن'
                  : t('theme_dark', locale) || 'تیره'}
              </span>
            </button>
            <button
              onClick={handleRestart}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ${locale === 'fa' ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.696v4.992h-4.992v-.001M2.985 4.356h4.992m0 0v4.992m0-4.992L10.186 1.17a8.25 8.25 0 0 0-11.667 0L1 4.356"
                />
              </svg>
              <span>{t('settings_restart_project', locale)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
