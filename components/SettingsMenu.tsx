import React, { useState, useRef, useEffect } from 'react';
import { Locale, t } from '../i18n';

interface SettingsMenuProps {
  onRestart: () => void;
  onSwitchProjects: () => void;
  onExportProject: () => void;
  locale: Locale;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ onRestart, onSwitchProjects, onExportProject, locale }) => {
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute mt-2 w-56 ${locale === 'fa' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}>
          <div className="py-1">
            <button
              onClick={handleSwitch}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${locale === 'fa' ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>
              <span>{t('settings_switch_project', locale)}</span>
            </button>
            <button
              onClick={handleExport}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${locale === 'fa' ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              <span>{t('settings_export_project', locale)}</span>
            </button>
            <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
            <button
              onClick={handleRestart}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ${locale === 'fa' ? 'text-right flex-row-reverse' : 'text-left'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.696v4.992h-4.992v-.001M2.985 4.356h4.992m0 0v4.992m0-4.992L10.186 1.17a8.25 8.25 0 0 0-11.667 0L1 4.356" /></svg>
              <span>{t('settings_restart_project', locale)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};