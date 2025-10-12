import React from 'react';
import { Stage } from '../types';
import { Locale, t } from '../i18n';
import { PHASE_1 } from '../config/stages/phase1';
import { getStageTitle } from '../config/stages';

interface StageIndicatorProps {
    stages: Stage[];
    currentStage: Stage;
    onStageSelect: (stage: Stage) => void;
    locale: Locale;
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({ stages, currentStage, onStageSelect, locale }) => {
    const currentStageIndex = stages.indexOf(currentStage);

    // Find which subsection contains the current stage
    const findCurrentSubsection = () => {
        for (const subsection of PHASE_1.subsections) {
            if (subsection.stages.some(s => s.id === currentStage)) {
                return subsection.id;
            }
        }
        return null;
    };

    // Track which phase is expanded - only expand if current stage is in this phase
    const phaseStages = PHASE_1.subsections.flatMap(sub => sub.stages.map(s => s.id as Stage));
    const isCurrentStageInPhase = phaseStages.includes(currentStage);
    const [isPhaseExpanded, setIsPhaseExpanded] = React.useState(isCurrentStageInPhase);

    // Track which subsections are expanded - only expand the one with current stage
    const currentSubsectionId = findCurrentSubsection();
    const [expandedSubsections, setExpandedSubsections] = React.useState<Set<string>>(
        new Set(currentSubsectionId ? [currentSubsectionId] : [])
    );

    // Update expanded state when current stage changes
    React.useEffect(() => {
        const newCurrentSubsection = findCurrentSubsection();
        if (newCurrentSubsection) {
            setIsPhaseExpanded(true);
            setExpandedSubsections(new Set([newCurrentSubsection]));
        }
    }, [currentStage]);

    const togglePhase = () => {
        setIsPhaseExpanded(!isPhaseExpanded);
    };

    const toggleSubsection = (subsectionId: string) => {
        const newExpanded = new Set(expandedSubsections);
        if (newExpanded.has(subsectionId)) {
            newExpanded.delete(subsectionId);
        } else {
            newExpanded.add(subsectionId);
        }
        setExpandedSubsections(newExpanded);
    };

    const renderStageItem = (stageId: string) => {
        const stage = stageId as Stage;
        const stageIndex = stages.indexOf(stage);
        const isCompleted = stageIndex < currentStageIndex;
        const isActive = stage === currentStage;
        const isClickable = isCompleted || isActive; // می‌تونیم روی completed و active کلیک کنیم

        return (
            <div
                key={stage}
                className={`group flex items-center justify-between text-sm py-2 ${locale === 'fa' ? 'pr-2' : 'pl-2'} border-transparent ${locale === 'fa' ? 'border-r-2' : 'border-l-2'} transition-colors duration-200
                ${isActive ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-900/20' : ''}
                ${isCompleted ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}
                ${isClickable ? 'cursor-pointer hover:border-purple-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/30' : ''}
                `}
                onClick={isClickable ? () => onStageSelect(stage) : undefined}
                title={isClickable ? t('stage_indicator_view_tooltip', locale) : ''}
            >
                <span className="truncate flex items-center gap-2">
                    {isCompleted ? (
                        <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                    ) : isActive ? (
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                    ) : (
                        <span className="block h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    )}
                    <span className="text-xs">{getStageTitle(stage, locale)}</span>
                </span>
            </div>
        );
    };

    // Check if phase has any active or completed stages
    const isPhaseActive = phaseStages.some(stage => stage === currentStage);
    const isPhaseComplete = phaseStages.every(stage => stages.indexOf(stage) < currentStageIndex);

    return (
        <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-full overflow-y-auto w-full">
            <h2 className="text-base font-bold text-center mb-3 text-slate-800 dark:text-slate-100">
                {t('stage_indicator_title', locale)}
            </h2>

            <div className="space-y-2">
                {/* Phase 1 Header */}
                <div>
                    <div
                        className={`font-bold mb-2 flex items-center gap-2 text-base cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/50 p-2 rounded-lg transition-all ${
                            isPhaseActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'
                        }`}
                        onClick={togglePhase}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-transform ${isPhaseExpanded ? 'rotate-90' : ''} ${locale === 'fa' ? 'rotate-180' : ''} ${
                                isPhaseComplete ? 'text-green-500' : isPhaseActive ? 'text-purple-500' : 'text-slate-400 dark:text-slate-600'
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{locale === 'fa' ? PHASE_1.title_fa : PHASE_1.title_en}</span>
                    </div>

                    {/* Subsections */}
                    {isPhaseExpanded && (
                        <div className={`${locale === 'fa' ? 'mr-4 border-r-2' : 'ml-4 border-l-2'} border-slate-300 dark:border-slate-600 space-y-1`}>
                            {PHASE_1.subsections.map((subsection) => {
                                const isSubExpanded = expandedSubsections.has(subsection.id);
                                const subsectionStages = subsection.stages.map(s => s.id as Stage);
                                const isSubActive = subsectionStages.some(stage => stage === currentStage);
                                const isSubComplete = subsectionStages.every(stage => stages.indexOf(stage) < currentStageIndex);

                                return (
                                    <div key={subsection.id}>
                                        {/* Subsection Header */}
                                        <div
                                            className={`font-semibold text-sm py-1.5 ${locale === 'fa' ? 'pr-4' : 'pl-4'} flex items-center gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/30 rounded transition-colors ${
                                                isSubActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-400'
                                            }`}
                                            onClick={() => toggleSubsection(subsection.id)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-4 w-4 transition-transform ${isSubExpanded ? 'rotate-90' : ''} ${locale === 'fa' ? 'rotate-180' : ''} ${
                                                    isSubComplete ? 'text-green-500' : isSubActive ? 'text-purple-500' : 'text-slate-400 dark:text-slate-600'
                                                }`}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="flex-1 text-sm">{locale === 'fa' ? subsection.title_fa : subsection.title_en}</span>
                                        </div>

                                        {/* Stages in Subsection */}
                                        {isSubExpanded && (
                                            <div className="space-y-0.5">
                                                {subsection.stages.map((stage) => renderStageItem(stage.id))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
