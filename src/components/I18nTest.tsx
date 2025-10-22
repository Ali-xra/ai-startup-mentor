import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Simple test component to verify i18next is working
 * This component displays translations and allows language switching
 */
const I18nTest: React.FC = () => {
  const { t, i18n } = useTranslation('common');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
        i18next Test - {t('header_title_unnamed')}
      </h1>

      <p className="text-lg mb-6 text-slate-700 dark:text-slate-300">
        {t('system_start_journey')} <strong>Testing i18next</strong>
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
          Settings Menu Translations:
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            {t('settings_switch_project')}
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded">
            {t('settings_export_project')}
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded">
            {t('settings_restart_project')}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
          Current Language: <span className="text-purple-600">{i18n.language}</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => changeLanguage('en')}
            className={`px-4 py-2 rounded ${
              i18n.language === 'en'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
            }`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => changeLanguage('fa')}
            className={`px-4 py-2 rounded ${
              i18n.language === 'fa'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
            }`}
          >
            🇮🇷 فارسی
          </button>
          <button
            onClick={() => changeLanguage('is')}
            className={`px-4 py-2 rounded ${
              i18n.language === 'is'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
            }`}
          >
            🇮🇸 Icelandic (Placeholder)
          </button>
        </div>
      </div>

      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
        <p className="text-sm text-green-800 dark:text-green-200">
          ✅ If you can see this and the language changes when you click the buttons above, then
          i18next is working correctly!
        </p>
      </div>
    </div>
  );
};

export default I18nTest;
