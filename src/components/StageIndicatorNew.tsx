/**
 * StageIndicatorNew - Collapsible Hierarchical Stage Navigator
 *
 * Features:
 * - Tree structure with Phase → Section → SubSection → Stage
 * - Expand/Collapse functionality at each level
 * - Click to navigate to specific stage
 * - Visual indicators for completed/in-progress stages
 * - RTL support for Persian/Arabic
 */

import React, { useState } from 'react';
import { Locale } from '../types';
import {
    Phase,
    Section,
    SubSection,
    Stage as StageType,
    StageStatus,
    PHASES_STRUCTURE
} from '../types-new-structure';
import { getNewPhaseTranslation } from '../i18n-new-phases';

interface StageIndicatorNewProps {
    phases: Phase[];
    currentStageId: string | null;
    onStageClick: (stageId: string) => void;
    locale: Locale;
}

export const StageIndicatorNew: React.FC<StageIndicatorNewProps> = ({
    phases: initialPhases,
    currentStageId,
    onStageClick,
    locale,
}) => {
    // State to manage expanded/collapsed sections
    const [phases, setPhases] = useState<Phase[]>(initialPhases);

    // Toggle phase expansion
    const togglePhase = (phaseId: string) => {
        setPhases(prevPhases =>
            prevPhases.map(phase =>
                phase.id === phaseId
                    ? { ...phase, isExpanded: !phase.isExpanded }
                    : phase
            )
        );
    };

    // Toggle section expansion
    const toggleSection = (phaseId: string, sectionId: string) => {
        setPhases(prevPhases =>
            prevPhases.map(phase =>
                phase.id === phaseId
                    ? {
                          ...phase,
                          sections: phase.sections.map(section =>
                              section.id === sectionId
                                  ? { ...section, isExpanded: !section.isExpanded }
                                  : section
                          ),
                      }
                    : phase
            )
        );
    };

    // Toggle subsection expansion
    const toggleSubSection = (phaseId: string, sectionId: string, subSectionId: string) => {
        setPhases(prevPhases =>
            prevPhases.map(phase =>
                phase.id === phaseId
                    ? {
                          ...phase,
                          sections: phase.sections.map(section =>
                              section.id === sectionId
                                  ? {
                                        ...section,
                                        subSections: section.subSections.map(subSection =>
                                            subSection.id === subSectionId
                                                ? { ...subSection, isExpanded: !subSection.isExpanded }
                                                : subSection
                                        ),
                                    }
                                  : section
                          ),
                      }
                    : phase
            )
        );
    };

    // Get status icon based on stage status
    const getStatusIcon = (status: StageStatus) => {
        switch (status) {
            case StageStatus.COMPLETED:
                return '✓';
            case StageStatus.IN_PROGRESS:
                return '●';
            case StageStatus.NOT_STARTED:
            default:
                return '○';
        }
    };

    // Get status color
    const getStatusColor = (status: StageStatus, isActive: boolean) => {
        if (isActive) return 'text-blue-600 dark:text-blue-400';
        switch (status) {
            case StageStatus.COMPLETED:
                return 'text-green-600 dark:text-green-400';
            case StageStatus.IN_PROGRESS:
                return 'text-yellow-600 dark:text-yellow-400';
            case StageStatus.NOT_STARTED:
            default:
                return 'text-slate-400 dark:text-slate-600';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 h-full overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">
                {locale === 'fa' ? 'سفر استارتاپ' : 'Startup Journey'}
            </h2>

            <div className="space-y-2">
                {phases.map((phase) => (
                    <div key={phase.id} className="border-l-2 border-slate-200 dark:border-slate-700 pl-2">
                        {/* PHASE LEVEL */}
                        <button
                            onClick={() => togglePhase(phase.id)}
                            className="w-full text-left flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                        >
                            {/* Expand/Collapse Icon */}
                            <span className="text-slate-500 dark:text-slate-400 text-sm">
                                {phase.isExpanded ? '▼' : locale === 'fa' ? '◄' : '►'}
                            </span>

                            {/* Phase Title */}
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-100 flex-1">
                                {getNewPhaseTranslation(phase.titleKey, locale)}
                            </span>
                        </button>

                        {/* SECTIONS (shown when phase is expanded) */}
                        {phase.isExpanded && (
                            <div className="mt-1 ml-4 space-y-1">
                                {phase.sections.map((section) => (
                                    <div key={section.id} className="border-l-2 border-slate-200 dark:border-slate-600 pl-2">
                                        {/* SECTION LEVEL */}
                                        <button
                                            onClick={() => toggleSection(phase.id, section.id)}
                                            className="w-full text-left flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            {/* Expand/Collapse Icon */}
                                            <span className="text-slate-400 dark:text-slate-500 text-xs">
                                                {section.isExpanded ? '▼' : locale === 'fa' ? '◄' : '►'}
                                            </span>

                                            {/* Section Title */}
                                            <span className="font-semibold text-xs text-slate-700 dark:text-slate-200 flex-1">
                                                {getNewPhaseTranslation(section.titleKey, locale)}
                                            </span>
                                        </button>

                                        {/* SUBSECTIONS (shown when section is expanded) */}
                                        {section.isExpanded && (
                                            <div className="mt-1 ml-3 space-y-1">
                                                {section.subSections.map((subSection) => (
                                                    <div key={subSection.id} className="border-l-2 border-slate-100 dark:border-slate-600 pl-2">
                                                        {/* SUBSECTION LEVEL */}
                                                        <button
                                                            onClick={() => toggleSubSection(phase.id, section.id, subSection.id)}
                                                            className="w-full text-left flex items-center gap-2 p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                                        >
                                                            {/* Expand/Collapse Icon */}
                                                            <span className="text-slate-300 dark:text-slate-600 text-xs">
                                                                {subSection.isExpanded ? '▼' : locale === 'fa' ? '◄' : '►'}
                                                            </span>

                                                            {/* SubSection Title */}
                                                            <span className="text-xs text-slate-600 dark:text-slate-300 flex-1">
                                                                {getNewPhaseTranslation(subSection.titleKey, locale)}
                                                            </span>
                                                        </button>

                                                        {/* STAGES (shown when subsection is expanded) */}
                                                        {subSection.isExpanded && (
                                                            <div className="mt-0.5 ml-3 space-y-0.5">
                                                                {subSection.stages.map((stage) => {
                                                                    const isActive = stage.id === currentStageId;
                                                                    const statusColor = getStatusColor(stage.status, isActive);

                                                                    return (
                                                                        <button
                                                                            key={stage.id}
                                                                            onClick={() => onStageClick(stage.id)}
                                                                            className={`
                                                                                w-full text-left flex items-center gap-2 p-1 rounded text-xs
                                                                                transition-all duration-200
                                                                                ${
                                                                                    isActive
                                                                                        ? 'bg-blue-100 dark:bg-blue-900/30 font-semibold'
                                                                                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/20'
                                                                                }
                                                                            `}
                                                                        >
                                                                            {/* Status Icon */}
                                                                            <span className={`${statusColor} text-xs`}>
                                                                                {getStatusIcon(stage.status)}
                                                                            </span>

                                                                            {/* Stage Title */}
                                                                            <span className={`flex-1 ${statusColor}`}>
                                                                                {getNewPhaseTranslation(stage.titleKey, locale)}
                                                                            </span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    {locale === 'fa' ? 'راهنما:' : 'Legend:'}
                </p>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span>{locale === 'fa' ? 'تکمیل شده' : 'Completed'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-600 dark:text-yellow-400">●</span>
                        <span>{locale === 'fa' ? 'در حال انجام' : 'In Progress'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 dark:text-slate-600">○</span>
                        <span>{locale === 'fa' ? 'شروع نشده' : 'Not Started'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
