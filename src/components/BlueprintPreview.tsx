import React, { useState, useEffect, useRef } from 'react';
import { StartupData, Locale, Stage } from '../types';
import { STAGE_TO_DATA_KEY } from '../hooks/useStartupJourney';
import { ALL_PHASES, getStageTitle } from '../config/stages';

interface BlueprintPreviewProps {
    startupData: Partial<StartupData>;
    locale: Locale;
    selectedStage?: string | null;
    onEditStage?: (stage: string) => void;
    searchTerm?: string;
    onNavigate?: (section: string) => void;
}

export const BlueprintPreview: React.FC<BlueprintPreviewProps> = ({
    startupData,
    locale,
    selectedStage,
    onEditStage,
    searchTerm = '',
    // onNavigate is unused but kept for future use
}) => {
    const [activeTab, setActiveTab] = useState<string>('phase-1');
    const [expandedSubsections, setExpandedSubsections] = useState<Set<string>>(new Set());
    const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
    const hasAnyData = Object.values(startupData).some(value => value);

    // Find which phase and subsection contain the selected stage
    const findPhaseAndSubsectionForStage = (stageId: string) => {
        for (const phase of ALL_PHASES.phases) {
            for (const subsection of phase.subsections) {
                if (subsection.stages.some(s => s.id === stageId)) {
                    return { phaseId: phase.id, subsectionId: subsection.id };
                }
            }
        }
        return null;
    };

    // Auto-switch tab and expand subsection when selectedStage changes
    useEffect(() => {
        if (selectedStage) {
            const location = findPhaseAndSubsectionForStage(selectedStage);
            if (location) {
                // Switch to the correct tab
                const phaseNumber = ALL_PHASES.phases.findIndex(p => p.id === location.phaseId) + 1;
                setActiveTab(`phase-${phaseNumber}`);

                // Expand the subsection
                setExpandedSubsections(prev => new Set([...prev, location.subsectionId]));

                // Scroll to the item after a short delay
                setTimeout(() => {
                    const element = itemRefs.current[selectedStage];
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        }
    }, [selectedStage]);

    const toggleSubsection = (subsectionId: string) => {
        const newExpanded = new Set(expandedSubsections);
        if (newExpanded.has(subsectionId)) {
            newExpanded.delete(subsectionId);
        } else {
            newExpanded.add(subsectionId);
        }
        setExpandedSubsections(newExpanded);
    };

    // Generate printable content for PDF
    const generatePrintableContent = () => {
        const currentPhase = ALL_PHASES.phases.find((_, index) => `phase-${index + 1}` === activeTab);
        if (!currentPhase) return '';

        const phaseTitle = locale === 'fa' ? currentPhase.title_fa : currentPhase.title_en;

        let content = `
            <!DOCTYPE html>
            <html dir="${locale === 'fa' ? 'rtl' : 'ltr'}">
            <head>
                <meta charset="UTF-8">
                <title>${phaseTitle} - ${locale === 'fa' ? 'متن‌های تایید شده' : 'Confirmed Content'}</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        direction: ${locale === 'fa' ? 'rtl' : 'ltr'};
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #e2e8f0;
                        padding-bottom: 20px;
                    }
                    .section {
                        margin-bottom: 25px;
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: bold;
                        color: #1e293b;
                        margin-bottom: 15px;
                        padding: 10px;
                        background-color: #f8fafc;
                        border-radius: 5px;
                    }
                    .stage-title {
                        font-size: 16px;
                        font-weight: bold;
                        color: #7c3aed;
                        margin-bottom: 10px;
                    }
                    .stage-content {
                        font-size: 14px;
                        color: #334155;
                        margin-bottom: 15px;
                        padding: 10px;
                        background-color: #ffffff;
                        border: 1px solid #e2e8f0;
                        border-radius: 5px;
                        white-space: pre-wrap;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${phaseTitle}</h1>
                    <h2>${locale === 'fa' ? 'متن‌های تایید شده' : 'Confirmed Content'}</h2>
                    <p>${new Date().toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}</p>
                </div>
        `;

        // Add content for current phase
        for (const subsection of currentPhase.subsections) {
            const subsectionTitle = locale === 'fa' ? subsection.title_fa : subsection.title_en;

            content += `
                <div class="section">
                    <div class="section-title">${subsectionTitle}</div>
            `;

            for (const stage of subsection.stages) {
                const dataKey = STAGE_TO_DATA_KEY[stage.id as Stage];
                if (dataKey && startupData[dataKey]) {
                    const stageTitle = getStageTitle(stage.id, locale);
                    const data = startupData[dataKey];

                    content += `
                        <div class="stage">
                            <div class="stage-title">${stageTitle}</div>
                            <div class="stage-content">${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}</div>
                        </div>
                    `;
                }
            }

            content += `</div>`;
        }

        content += `
            </body>
            </html>
        `;

        return content;
    };

    // هایلایت متن جستجو شده
    const highlightText = (text: string, searchTerm: string) => {
        if (!searchTerm.trim()) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
                    {part}
                </mark>
            ) : part
        );
    };

    const renderStageItem = (stageId: string, stageTitle: string) => {
        const dataKey = STAGE_TO_DATA_KEY[stageId as Stage];
        if (!dataKey) return null;

        const data = startupData[dataKey];
        if (!data) return null;

        const isHighlighted = selectedStage === stageId;
        const isClickable = onEditStage;

        return (
            <div
                key={stageId}
                ref={(el) => { itemRefs.current[stageId] = el; }}
                onClick={() => {
                    if (isClickable) {
                        onEditStage(stageId);
                    }
                }}
                className={`p-4 bg-white dark:bg-slate-800 rounded-lg border transition-all duration-300 ${
                    isHighlighted
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                        : 'border-slate-200 dark:border-slate-700'
                } ${isClickable ? 'cursor-pointer hover:border-purple-400 hover:shadow-md' : ''}`}
                title={isClickable ? (locale === 'fa' ? 'کلیک برای ویرایش' : 'Click to edit') : ''}
            >
                <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">
                    {stageTitle}
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {typeof data === 'string' ? highlightText(data, searchTerm) : highlightText(JSON.stringify(data, null, 2), searchTerm)}
                </div>
            </div>
        );
    };

    const renderSubsection = (subsection: any) => {
        const subsectionStages = subsection.stages.map((s: any) => s.id);
        const hasData = subsectionStages.some((stageId: string) => {
            const dataKey = STAGE_TO_DATA_KEY[stageId as Stage];
            return dataKey && startupData[dataKey];
        });

        if (!hasData) return null;

        const isExpanded = expandedSubsections.has(subsection.id);
        const subsectionTitle = locale === 'fa' ? subsection.title_fa : subsection.title_en;

        return (
            <div key={subsection.id} className="mb-4">
                <div
                    className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600"
                    onClick={() => toggleSubsection(subsection.id)}
                >
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {subsectionTitle}
                        </span>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform text-slate-500 ${isExpanded ? 'rotate-90' : ''} ${locale === 'fa' ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </div>

                {isExpanded && (
                    <div className="mt-3 space-y-3 pl-4">
                        {subsection.stages.map((stage: any) =>
                            renderStageItem(stage.id, getStageTitle(stage.id, locale))
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderPhaseContent = (phase: any) => {
        return (
            <div className="space-y-4">
                {phase.subsections.map((subsection: any) => renderSubsection(subsection))}
            </div>
        );
    };

    if (!hasAnyData) {
        return (
            <div className="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-full overflow-y-auto shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-100">
                    {locale === 'fa' ? 'متن‌های تایید شده' : 'Confirmed Content'}
                </h2>
                <div className="text-center py-8">
                    <div className="text-slate-500 dark:text-slate-400">
                        <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium mb-2">
                            {locale === 'fa' ? 'هنوز متنی تایید نشده' : 'No confirmed content yet'}
                        </p>
                        <p className="text-sm">
                            {locale === 'fa'
                                ? 'با ادامه کار، متن‌های تایید شده در این بخش نمایش داده می‌شوند'
                                : 'Confirmed content will appear here as you progress through the stages'
                            }
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-full shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {locale === 'fa' ? 'متن‌های تایید شده' : 'Confirmed Content'}
                    </h2>
                    <button
                        onClick={() => {
                            // Generate PDF functionality
                            const printWindow = window.open('', '_blank');
                            if (printWindow) {
                                const content = generatePrintableContent();
                                printWindow.document.write(content);
                                printWindow.document.close();
                                printWindow.print();
                            }
                        }}
                        className="px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        title={locale === 'fa' ? 'چاپ PDF' : 'Print PDF'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L3.61 21.5m10.56 0L21.39 13.829m-10.56 0L3.61 13.829m10.56 0L21.39 13.829M12 21.5V13.5" />
                        </svg>
                        <span>{locale === 'fa' ? 'چاپ' : 'Print'}</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
                {ALL_PHASES.phases.map((phase, index) => {
                    const phaseNumber = index + 1;
                    const tabId = `phase-${phaseNumber}`;
                    const isActive = activeTab === tabId;
                    const phaseTitle = locale === 'fa' ? phase.title_fa : phase.title_en;

                    return (
                        <button
                            key={phase.id}
                            onClick={() => setActiveTab(tabId)}
                            className={`flex-shrink-0 px-4 py-3 font-medium text-sm transition-all whitespace-nowrap ${
                                isActive
                                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-slate-800'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            {phaseTitle}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {ALL_PHASES.phases.map((phase, index) => {
                    const phaseNumber = index + 1;
                    const tabId = `phase-${phaseNumber}`;

                    if (activeTab !== tabId) return null;

                    return (
                        <div key={phase.id}>
                            {renderPhaseContent(phase)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
