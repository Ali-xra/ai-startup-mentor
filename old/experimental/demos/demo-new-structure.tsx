/**
 * DEMO PAGE FOR NEW HIERARCHICAL STRUCTURE
 *
 * این فایل فقط برای دمو و تست است
 * بعد از تایید، این ساختار را در پروژه اصلی integrate می‌کنیم
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { StageIndicatorNew } from './components/StageIndicatorNew';
import { PHASES_STRUCTURE, Stage, StageStatus } from './types-new-structure';
import { Locale } from './types';

const DemoApp: React.FC = () => {
    const [locale, setLocale] = useState<Locale>('fa');
    const [currentStageId, setCurrentStageId] = useState<string | null>('stage_1_1_1');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Initialize phases with some stages marked as completed/in-progress for demo
    const [phases, setPhases] = useState(() => {
        const demoPhases = JSON.parse(JSON.stringify(PHASES_STRUCTURE));

        // Mark first phase as expanded by default
        if (demoPhases[0]) {
            demoPhases[0].isExpanded = true;
            if (demoPhases[0].sections[0]) {
                demoPhases[0].sections[0].isExpanded = true;
                if (demoPhases[0].sections[0].subSections[0]) {
                    demoPhases[0].sections[0].subSections[0].isExpanded = true;

                    // Mark some stages as completed
                    const stages = demoPhases[0].sections[0].subSections[0].stages;
                    if (stages[0]) stages[0].status = StageStatus.IN_PROGRESS;
                    if (stages[1]) stages[1].status = StageStatus.NOT_STARTED;
                }
            }
        }

        return demoPhases;
    });

    const handleStageClick = (stageId: string) => {
        console.log('Stage clicked:', stageId);
        setCurrentStageId(stageId);

        // Update stage status to IN_PROGRESS when clicked
        setPhases(prevPhases => {
            const newPhases = JSON.parse(JSON.stringify(prevPhases));
            for (const phase of newPhases) {
                for (const section of phase.sections) {
                    for (const subSection of section.subSections) {
                        const stage = subSection.stages.find((s: Stage) => s.id === stageId);
                        if (stage && stage.status === StageStatus.NOT_STARTED) {
                            stage.status = StageStatus.IN_PROGRESS;
                        }
                    }
                }
            }
            return newPhases;
        });
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    const toggleLocale = () => {
        setLocale(prev => prev === 'fa' ? 'en' : 'fa');
        document.documentElement.dir = locale === 'fa' ? 'ltr' : 'rtl';
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                {/* Header */}
                <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 p-4">
                    <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {locale === 'fa' ? '🎯 دمو ساختار جدید' : '🎯 New Structure Demo'}
                        </h1>

                        <div className="flex items-center gap-3">
                            {/* Language Toggle */}
                            <button
                                onClick={toggleLocale}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                {locale === 'fa' ? '🇬🇧 EN' : '🇮🇷 FA'}
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-screen-2xl mx-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Stage Navigator (Left Sidebar) */}
                        <div className="lg:col-span-1">
                            <StageIndicatorNew
                                phases={phases}
                                currentStageId={currentStageId}
                                onStageClick={handleStageClick}
                                locale={locale}
                            />
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                                    {locale === 'fa' ? 'محتوای مرحله فعلی' : 'Current Stage Content'}
                                </h2>

                                {currentStageId ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <p className="font-mono text-sm text-blue-900 dark:text-blue-100">
                                                <strong>Stage ID:</strong> {currentStageId}
                                            </p>
                                        </div>

                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="text-slate-600 dark:text-slate-300">
                                                {locale === 'fa'
                                                    ? 'این صفحه برای دمو و تست ساختار جدید است. روی هر فاز، بخش یا مرحله کلیک کنید تا باز/بسته شود.'
                                                    : 'This is a demo page for testing the new structure. Click on any phase, section, or stage to expand/collapse it.'
                                                }
                                            </p>

                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4">
                                                {locale === 'fa' ? 'ویژگی‌های جدید:' : 'New Features:'}
                                            </h3>
                                            <ul className="text-slate-600 dark:text-slate-300">
                                                <li>{locale === 'fa' ? '✨ ساختار درختی سلسله‌مراتی' : '✨ Hierarchical tree structure'}</li>
                                                <li>{locale === 'fa' ? '🔽 قابلیت باز/بسته کردن هر سطح' : '🔽 Collapse/Expand at each level'}</li>
                                                <li>{locale === 'fa' ? '📊 نمایش وضعیت پیشرفت' : '📊 Progress status indicators'}</li>
                                                <li>{locale === 'fa' ? '🎨 پشتیبانی از تم تیره/روشن' : '🎨 Dark/Light theme support'}</li>
                                                <li>{locale === 'fa' ? '🌐 چند زبانه (فارسی/انگلیسی)' : '🌐 Multi-language (Persian/English)'}</li>
                                                <li>{locale === 'fa' ? '↔️ پشتیبانی RTL' : '↔️ RTL support'}</li>
                                            </ul>
                                        </div>

                                        {/* Demo Actions */}
                                        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
                                                {locale === 'fa' ? 'اقدامات دمو:' : 'Demo Actions:'}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => {
                                                        const newPhases = JSON.parse(JSON.stringify(phases));
                                                        newPhases[0].isExpanded = true;
                                                        newPhases[0].sections[0].isExpanded = true;
                                                        newPhases[0].sections[0].subSections[0].isExpanded = true;
                                                        setPhases(newPhases);
                                                    }}
                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                                                >
                                                    {locale === 'fa' ? 'باز کردن فاز ۱' : 'Expand Phase 1'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newPhases = phases.map(p => ({
                                                            ...p,
                                                            isExpanded: false,
                                                            sections: p.sections.map(s => ({
                                                                ...s,
                                                                isExpanded: false,
                                                                subSections: s.subSections.map(ss => ({
                                                                    ...ss,
                                                                    isExpanded: false
                                                                }))
                                                            }))
                                                        }));
                                                        setPhases(newPhases);
                                                    }}
                                                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
                                                >
                                                    {locale === 'fa' ? 'بستن همه' : 'Collapse All'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 dark:text-slate-400">
                                        {locale === 'fa'
                                            ? 'لطفاً یک مرحله را از منوی سمت چپ انتخاب کنید'
                                            : 'Please select a stage from the left menu'
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Render the demo app
const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <DemoApp />
        </React.StrictMode>
    );
}
