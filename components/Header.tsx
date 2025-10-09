import React from 'react';
import { SettingsMenu } from './SettingsMenu';
import { Locale, t } from '../i18n';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
    progress: number;
    theme: 'light' | 'dark';
    locale: Locale;
    projectName?: string;
    initialIdea?: string;
    onThemeToggle: () => void;
    onLocaleToggle: () => void;
    onRestart: () => void;
    onSwitchProjects: () => void;
    onExportProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({ progress, theme, locale, projectName, initialIdea, onThemeToggle, onLocaleToggle, onRestart, onSwitchProjects, onExportProject }) => {
    const title = projectName || initialIdea || t('header_title_unnamed', locale);
    return (
        <header className="p-4 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-screen-2xl mx-auto">
                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 truncate max-w-sm md:max-w-md lg:max-w-lg" title={title}>
                        {title}
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onSwitchProjects}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title={t('header_switch_project_tooltip', locale)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
                            </svg>
                        </button>
                        <button 
                            onClick={onThemeToggle}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title={theme === 'dark' ? t('header_theme_light_tooltip', locale) : t('header_theme_dark_tooltip', locale)}
                        >
                            {theme === 'dark' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
                            )}
                        </button>
                         <LanguageSelector />
                        <SettingsMenu onRestart={onRestart} onSwitchProjects={onSwitchProjects} onExportProject={onExportProject} locale={locale}/>
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