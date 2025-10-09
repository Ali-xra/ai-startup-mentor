import React from 'react';
import { Stage, MajorSection } from '../types';
import { Locale, t } from '../i18n';

interface StageIndicatorProps {
    stages: Stage[];
    currentStage: Stage;
    onStageSelect: (stage: Stage) => void;
    onEditStage: (stage: Stage) => void;
    locale: Locale;
}

const STAGES_BY_SECTION: Record<MajorSection, Stage[]> = {
    [MajorSection.CORE_CONCEPT]: [
        Stage.CORE_CONCEPT_IDEA_TITLE,
        Stage.CORE_CONCEPT_IDEA_ABSTRACT,
        Stage.CORE_CONCEPT_PROBLEM_STATEMENT,
        Stage.CORE_CONCEPT_INITIAL_TARGET_AUDIENCE,
        Stage.CORE_CONCEPT_PROPOSED_SOLUTION,
        Stage.CORE_CONCEPT_VALUE_PROPOSITION,
        Stage.CORE_CONCEPT_BUSINESS_GOALS,
        Stage.CORE_CONCEPT_SUMMARY,
    ],
    [MajorSection.MARKET_ANALYSIS]: [
        Stage.MARKET_ANALYSIS_SIZE,
        Stage.MARKET_ANALYSIS_TRENDS,
        Stage.MARKET_ANALYSIS_OPP_THREATS,
        Stage.MARKET_ANALYSIS_COMPETITOR_IDENTIFICATION,
        Stage.MARKET_ANALYSIS_COMPETITOR_ANALYSIS,
        Stage.MARKET_ANALYSIS_SWOT_STRENGTHS,
        Stage.MARKET_ANALYSIS_SWOT_WEAKNESSES,
        Stage.MARKET_ANALYSIS_SWOT_OPPORTUNITIES,
        Stage.MARKET_ANALYSIS_SWOT_THREATS,
        Stage.MARKET_ANALYSIS_RISK_IDENTIFICATION,
        Stage.MARKET_ANALYSIS_RISK_MITIGATION,
        Stage.MARKET_ANALYSIS_SUMMARY,
    ],
    [MajorSection.BUSINESS_MODELING]: [
        Stage.BMC_CUSTOMER_SEGMENTS,
        Stage.BMC_VALUE_PROPOSITIONS,
        Stage.BMC_CHANNELS,
        Stage.BMC_CUSTOMER_RELATIONSHIPS,
        Stage.BMC_REVENUE_STREAMS,
        Stage.BMC_KEY_ACTIVITIES,
        Stage.BMC_KEY_RESOURCES,
        Stage.BMC_KEY_PARTNERSHIPS,
        Stage.BMC_COST_STRUCTURE,
        Stage.BUSINESS_MODELING_SUMMARY,
    ],
    [MajorSection.BRANDING]: [
        Stage.BRANDING_VISION,
        Stage.BRANDING_MISSION,
        Stage.BRANDING_CORE_VALUES,
        Stage.BRANDING_PERSONALITY,
        Stage.BRANDING_POSITIONING,
        Stage.BRANDING_NAME,
        Stage.BRANDING_TAGLINE,
        Stage.BRANDING_TONE_OF_VOICE,
        Stage.BRANDING_KEY_MESSAGES,
        Stage.BRANDING_LOGO,
        Stage.BRANDING_COLOR_PALETTE,
        Stage.BRANDING_TYPOGRAPHY,
        Stage.BRANDING_VISUAL_STYLE,
        Stage.BRANDING_GUIDELINES,
    ],
    [MajorSection.PRODUCT_DEVELOPMENT]: [
        Stage.PRODUCT_DEV_CORE_FEATURES,
        Stage.PRODUCT_DEV_USER_BENEFITS,
        Stage.PRODUCT_DEV_DIFFERENTIATORS,
        Stage.PRODUCT_DEV_MVP_DEFINITION,
        Stage.PRODUCT_DEV_MVP_PHASES,
        Stage.PRODUCT_DEV_MVP_TECH_STACK,
        Stage.PRODUCT_DEV_MVP_DATA_MODEL,
        Stage.PRODUCT_DEV_MVP_USER_FLOW,
        Stage.PRODUCT_DEV_MVP_RESOURCES,
        Stage.PRODUCT_DEV_SUMMARY,
    ],
    [MajorSection.MARKETING_SALES]: [
        Stage.MARKETING_OBJECTIVES,
        Stage.MARKETING_STRATEGY_CONTENT,
        Stage.MARKETING_STRATEGY_SEO,
        Stage.MARKETING_STRATEGY_SMM,
        Stage.MARKETING_STRATEGY_PAID_ADS,
        Stage.MARKETING_STRATEGY_EMAIL,
        Stage.MARKETING_STRATEGY_PR,
        // FIX: Corrected typo from MARKET_STRATEGY_INFLUENCER to MARKETING_STRATEGY_INFLUENCER.
        Stage.MARKETING_STRATEGY_INFLUENCER,
        Stage.SALES_STRATEGY_CHANNELS,
        Stage.SALES_STRATEGY_PROCESS,
        Stage.INITIAL_CAMPAIGN_PLANNING,
        Stage.MARKETING_MEASUREMENT_KPIS,
        Stage.MARKETING_MEASUREMENT_TOOLS,
        Stage.MARKETING_MEASUREMENT,
        Stage.MARKETING_SUMMARY,
    ],
    [MajorSection.ORGANIZATION_FINANCIALS]: [
        Stage.ORGANIZATION_LEGAL_TEAM,
        Stage.ORGANIZATION_LEGAL_AGREEMENT,
        Stage.ORGANIZATION_LEGAL_STRUCTURE,
        Stage.ORGANIZATION_LEGAL_IP,
        Stage.ORGANIZATION_LEGAL_TERMS,
        Stage.ORGANIZATION_LEGAL_COMPLIANCE,
        Stage.ORGANIZATION_MANAGEMENT_LEGAL,
        Stage.ORGANIZATION_COMPANY_SUMMARY,
        Stage.ORGANIZATION_OPERATIONS_DAILY_PROCESSES,
        Stage.ORGANIZATION_OPERATIONS_PRODUCT_ROADMAP,
        Stage.ORGANIZATION_OPERATIONAL_PLAN,
        Stage.ORGANIZATION_FINANCIALS_ASSUMPTIONS,
        Stage.ORGANIZATION_FINANCIALS_SALES_FORECAST,
        Stage.ORGANIZATION_FINANCIALS_PNL,
        Stage.ORGANIZATION_FINANCIALS_CASH_FLOW,
        Stage.ORGANIZATION_FINANCIALS_BREAK_EVEN,
        Stage.ORGANIZATION_FINANCIALS_FUNDING_NEEDS,
        Stage.ORGANIZATION_FINANCIAL_PROJECTIONS,
        Stage.ORGANIZATION_SUMMARY,
    ],
    [MajorSection.FINAL_OUTPUTS]: [
        Stage.FUNDING_REQUEST,
        Stage.COMPREHENSIVE_BUSINESS_PLAN,
        Stage.INVESTOR_PITCH_DECK,
        Stage.APPENDICES,
        Stage.FINAL_OUTPUTS_SUMMARY,
    ],
    // Market research tool is a standalone feature, not in the main journey list
    [MajorSection.MARKET_RESEARCH_TOOL]: [],
};

const SECTION_ORDER = [
    MajorSection.CORE_CONCEPT,
    MajorSection.MARKET_ANALYSIS,
    MajorSection.BUSINESS_MODELING,
    MajorSection.BRANDING,
    MajorSection.PRODUCT_DEVELOPMENT,
    MajorSection.MARKETING_SALES,
    MajorSection.ORGANIZATION_FINANCIALS,
    MajorSection.FINAL_OUTPUTS,
];

export const StageIndicator: React.FC<StageIndicatorProps> = ({ stages, currentStage, onStageSelect, onEditStage, locale }) => {
    const currentStageIndex = stages.indexOf(currentStage);

    const renderStageItem = (stage: Stage, options?: {isIndented?: boolean}) => {
        const stageIndex = stages.indexOf(stage);
        const isCompleted = stageIndex < currentStageIndex;
        const isActive = stage === currentStage;
        const isSummary = stage.endsWith("_SUMMARY") || stage.endsWith("_LEGAL") || stage.endsWith("_MEASUREMENT") || stage.endsWith("_PLAN") || stage === Stage.ORGANIZATION_FINANCIAL_PROJECTIONS;
        const isGenerated = isSummary || stage === Stage.BRANDING_GUIDELINES;

        if (isSummary) return null;

        const canJump = isCompleted && !isActive;

        const paddingClass = options?.isIndented 
            ? (locale === 'fa' ? 'pr-8' : 'pl-8')
            : (locale === 'fa' ? 'pr-4' : 'pl-4');

        return (
            <div 
                key={stage} 
                className={`group flex items-center justify-between text-sm py-1.5 ${paddingClass} ${locale === 'fa' ? '-mr-0.5' : '-ml-0.5'} border-transparent ${locale === 'fa' ? 'border-r-2' : 'border-l-2'} transition-colors duration-200
                ${isActive ? 'border-purple-500 text-purple-600 dark:text-purple-300 font-semibold' : ''}
                ${isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}
                ${canJump ? 'cursor-pointer hover:border-purple-400 hover:text-slate-800 dark:hover:text-slate-200' : ''}
                `}
                onClick={canJump ? () => onStageSelect(stage) : undefined}
                title={canJump ? t('stage_indicator_jump_tooltip', locale) : ''}
            >
                <span className="truncate">{t(stage, locale)}</span>
                {isCompleted && !isGenerated && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditStage(stage);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 p-1 rounded-full transition-opacity"
                        title={t('stage_indicator_edit_tooltip', locale)}
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-full">
            <h2 className="text-lg font-bold text-center mb-6 text-slate-800 dark:text-slate-100">{t('stage_indicator_title', locale)}</h2>
            <div className="space-y-6">
                {SECTION_ORDER.map((section) => {
                    const sectionStages = STAGES_BY_SECTION[section];
                    if (!sectionStages || sectionStages.length === 0) return null;
                    
                    const isSectionComplete = sectionStages.every(stage => stages.indexOf(stage) < currentStageIndex);
                    const isSectionActive = sectionStages.some(stage => stage === currentStage);

                    return (
                        <div key={section}>
                             <h3 className={`font-bold mb-2 flex items-center gap-2 text-base ${isSectionActive ? 'text-purple-600 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                {isSectionComplete ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                ) : isSectionActive ? (
                                    <span className="h-5 w-5 flex items-center justify-center">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                                        </span>
                                    </span>
                                ) : (
                                    <span className="h-5 w-5 flex items-center justify-center">
                                        <span className="block h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600"></span>
                                    </span>
                                )}
                                {t(section, locale)}
                            </h3>
                            {section === MajorSection.MARKET_ANALYSIS ? (
                                <div className={`space-y-1 ${locale === 'fa' ? 'border-r-2' : 'border-l-2'} border-slate-300 dark:border-slate-600 ml-2.5`}>
                                    <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_market_environment', locale)}
                                    </h4>
                                    {[Stage.MARKET_ANALYSIS_SIZE, Stage.MARKET_ANALYSIS_TRENDS, Stage.MARKET_ANALYSIS_OPP_THREATS].map(stage => renderStageItem(stage, { isIndented: true }))}
                                    
                                    <div className="pt-2"></div>

                                    <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_competitive_landscape', locale)}
                                    </h4>
                                    {[Stage.MARKET_ANALYSIS_COMPETITOR_IDENTIFICATION, Stage.MARKET_ANALYSIS_COMPETITOR_ANALYSIS].map(stage => renderStageItem(stage, { isIndented: true }))}
                                    
                                    <div className="pt-2"></div>
                                    
                                    <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_strategic_positioning', locale)}
                                    </h4>
                                    <div className={locale === 'fa' ? 'pr-4' : 'pl-4'}>
                                        <h5 className="font-medium text-sm pt-2 text-slate-500 dark:text-slate-400">
                                            {t('subsection_swot_analysis', locale)}
                                        </h5>
                                        {[
                                            Stage.MARKET_ANALYSIS_SWOT_STRENGTHS,
                                            Stage.MARKET_ANALYSIS_SWOT_WEAKNESSES,
                                            Stage.MARKET_ANALYSIS_SWOT_OPPORTUNITIES,
                                            Stage.MARKET_ANALYSIS_SWOT_THREATS,
                                        ].map(stage => renderStageItem(stage))}
                                    </div>
                                    <div className="pt-2"></div>
                                    <div className={locale === 'fa' ? 'pr-4' : 'pl-4'}>
                                        <h5 className="font-medium text-sm pt-2 text-slate-500 dark:text-slate-400">
                                            {t('subsection_risk_analysis', locale)}
                                        </h5>
                                        {[
                                            Stage.MARKET_ANALYSIS_RISK_IDENTIFICATION,
                                            Stage.MARKET_ANALYSIS_RISK_MITIGATION,
                                        ].map(stage => renderStageItem(stage))}
                                    </div>
                                </div>
                            ) : section === MajorSection.BRANDING ? (
                                <div className={`space-y-1 ${locale === 'fa' ? 'border-r-2' : 'border-l-2'} border-slate-300 dark:border-slate-600 ml-2.5`}>
                                     <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_brand_strategy', locale)}
                                    </h4>
                                    {[
                                        Stage.BRANDING_VISION,
                                        Stage.BRANDING_MISSION,
                                        Stage.BRANDING_CORE_VALUES,
                                        Stage.BRANDING_PERSONALITY,
                                        Stage.BRANDING_POSITIONING,
                                    ].map(stage => renderStageItem(stage, { isIndented: true }))}
                                    
                                    <div className="pt-2"></div>

                                    <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_verbal_identity', locale)}
                                    </h4>
                                    {[
                                        Stage.BRANDING_NAME,
                                        Stage.BRANDING_TAGLINE,
                                        Stage.BRANDING_TONE_OF_VOICE,
                                        Stage.BRANDING_KEY_MESSAGES,
                                    ].map(stage => renderStageItem(stage, { isIndented: true }))}

                                    <div className="pt-2"></div>

                                    <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_visual_identity', locale)}
                                    </h4>
                                    {[
                                        Stage.BRANDING_LOGO,
                                        Stage.BRANDING_COLOR_PALETTE,
                                        Stage.BRANDING_TYPOGRAPHY,
                                        Stage.BRANDING_VISUAL_STYLE,
                                    ].map(stage => renderStageItem(stage, { isIndented: true }))}
                                    
                                    <div className="pt-2 border-t border-slate-300 dark:border-slate-600 my-2 mx-4"></div>

                                    {[
                                        Stage.BRANDING_GUIDELINES,
                                    ].map(stage => renderStageItem(stage))}
                                </div>
                            ) : section === MajorSection.PRODUCT_DEVELOPMENT ? (
                                <div className={`space-y-1 ${locale === 'fa' ? 'border-r-2' : 'border-l-2'} border-slate-300 dark:border-slate-600 ml-2.5`}>
                                     <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_product_description', locale)}
                                    </h4>
                                    {[
                                        Stage.PRODUCT_DEV_CORE_FEATURES,
                                        Stage.PRODUCT_DEV_USER_BENEFITS,
                                        Stage.PRODUCT_DEV_DIFFERENTIATORS,
                                    ].map(stage => renderStageItem(stage, { isIndented: true }))}
                                    
                                    <div className="pt-2"></div>

                                    <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_mvp_plan', locale)}
                                    </h4>
                                    {[
                                        Stage.PRODUCT_DEV_MVP_DEFINITION,
                                        Stage.PRODUCT_DEV_MVP_PHASES,
                                        Stage.PRODUCT_DEV_MVP_TECH_STACK,
                                        Stage.PRODUCT_DEV_MVP_DATA_MODEL,
                                        Stage.PRODUCT_DEV_MVP_USER_FLOW,
                                        Stage.PRODUCT_DEV_MVP_RESOURCES,
                                    ].map(stage => renderStageItem(stage, {isIndented: true}))}
                                </div>
                            ) : section === MajorSection.MARKETING_SALES ? (
                                <div className={`space-y-1 ${locale === 'fa' ? 'border-r-2' : 'border-l-2'} border-slate-300 dark:border-slate-600 ml-2.5`}>
                                    {renderStageItem(Stage.MARKETING_OBJECTIVES)}
                                    <div className="pt-2"></div>
                                    <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_marketing_strategies', locale)}
                                    </h4>
                                    {[
                                        Stage.MARKETING_STRATEGY_CONTENT,
                                        Stage.MARKETING_STRATEGY_SEO,
                                        Stage.MARKETING_STRATEGY_SMM,
                                        Stage.MARKETING_STRATEGY_PAID_ADS,
                                        Stage.MARKETING_STRATEGY_EMAIL,
                                        Stage.MARKETING_STRATEGY_PR,
                                        Stage.MARKETING_STRATEGY_INFLUENCER,
                                    ].map(stage => renderStageItem(stage, {isIndented: true}))}
                                    <div className="pt-2"></div>
                                    <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_sales_strategy', locale)}
                                    </h4>
                                     {[
                                        Stage.SALES_STRATEGY_CHANNELS,
                                        Stage.SALES_STRATEGY_PROCESS,
                                     ].map(stage => renderStageItem(stage, {isIndented: true}))}
                                    <div className="pt-2"></div>
                                    {renderStageItem(Stage.INITIAL_CAMPAIGN_PLANNING)}
                                    <div className="pt-2"></div>
                                    <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_measurement_improvement', locale)}
                                    </h4>
                                    {[
                                        Stage.MARKETING_MEASUREMENT_KPIS,
                                        Stage.MARKETING_MEASUREMENT_TOOLS,
                                    ].map(stage => renderStageItem(stage, {isIndented: true}))}
                                </div>
                            ) : section === MajorSection.ORGANIZATION_FINANCIALS ? (
                                <div className={`space-y-1 ${locale === 'fa' ? 'border-r-2' : 'border-l-2'} border-slate-300 dark:border-slate-600 ml-2.5`}>
                                     <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_org_legal', locale)}
                                    </h4>
                                    {[
                                        Stage.ORGANIZATION_LEGAL_TEAM,
                                        Stage.ORGANIZATION_LEGAL_AGREEMENT,
                                        Stage.ORGANIZATION_LEGAL_STRUCTURE,
                                        Stage.ORGANIZATION_LEGAL_IP,
                                        Stage.ORGANIZATION_LEGAL_TERMS,
                                        Stage.ORGANIZATION_LEGAL_COMPLIANCE,
                                    ].map(stage => renderStageItem(stage, { isIndented: true }))}
                                    
                                    <div className="pt-2"></div>
                                    {renderStageItem(Stage.ORGANIZATION_COMPANY_SUMMARY)}

                                    <div className="pt-2"></div>
                                    <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_operational_plan', locale)}
                                    </h4>
                                    {[
                                        Stage.ORGANIZATION_OPERATIONS_DAILY_PROCESSES,
                                        Stage.ORGANIZATION_OPERATIONS_PRODUCT_ROADMAP,
                                    ].map(stage => renderStageItem(stage, {isIndented: true}))}
                                    
                                    <div className="pt-2"></div>
                                    <h4 className={`font-semibold text-sm pt-2 pb-1 text-slate-500 dark:text-slate-400 ${locale === 'fa' ? 'pr-4' : 'pl-4'}`}>
                                        {t('subsection_financial_projections', locale)}
                                    </h4>
                                    {[
                                        Stage.ORGANIZATION_FINANCIALS_ASSUMPTIONS,
                                        Stage.ORGANIZATION_FINANCIALS_SALES_FORECAST,
                                        Stage.ORGANIZATION_FINANCIALS_PNL,
                                        Stage.ORGANIZATION_FINANCIALS_CASH_FLOW,
                                        Stage.ORGANIZATION_FINANCIALS_BREAK_EVEN,
                                        Stage.ORGANIZATION_FINANCIALS_FUNDING_NEEDS,
                                    ].map(stage => renderStageItem(stage, {isIndented: true}))}
                                </div>
                            ) : (
                                <div className={`space-y-1 ${locale === 'fa' ? 'border-r-2' : 'border-l-2'} border-slate-300 dark:border-slate-600 ml-2.5`}>
                                    {sectionStages.map((stage) => renderStageItem(stage))}
                                </div>
                            )}
                        </div>
                    )
                })}
                 {currentStage === Stage.COMPLETE && (
                     <div>
                        <h3 className={`font-bold mb-2 flex items-center gap-2 text-base text-green-500`}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Complete
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
};