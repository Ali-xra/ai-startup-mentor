import React, { useState, useEffect, useRef } from 'react';
import { StartupData, Locale, Stage } from '../types';
import { t } from '../i18n';
import { STAGE_TO_DATA_KEY } from '../hooks/useStartupJourney';

// Confirmed Content Display Component (similar to StageIndicator style)
interface ConfirmedContentProps {
  startupData: Partial<StartupData>;
  locale: Locale;
  selectedStage: string | null;
  onEditStage?: (stage: Stage) => void;
}

const ConfirmedContent: React.FC<ConfirmedContentProps> = ({ startupData, locale, selectedStage, onEditStage }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['CORE_CONCEPT']));
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Auto-expand section and scroll to item when selectedStage changes
  useEffect(() => {
    if (selectedStage) {
      // Find which section contains this stage
      const dataKey = STAGE_TO_DATA_KEY[selectedStage as any];
      if (dataKey) {
        // Find which section contains this dataKey and expand it
        const sectionId = findSectionForDataKey(dataKey);
        if (sectionId) {
          setExpandedSections(prev => new Set([...prev, sectionId]));

          // Wait for expand animation, then scroll
          setTimeout(() => {
            const element = itemRefs.current[selectedStage];
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }
      }
    }
  }, [selectedStage]);

  const findSectionForDataKey = (dataKey: string): string | null => {
    // Map common data keys to section IDs
    const keyToSectionMap: {[key: string]: string} = {
      'idea_title': 'IDEA_DEFINITION',
      'elevator_pitch': 'IDEA_DEFINITION',
      'executive_summary': 'IDEA_DEFINITION',
      'problem_description': 'PROBLEM_STATEMENT',
      'problem_magnitude': 'PROBLEM_STATEMENT',
      'current_solutions': 'PROBLEM_STATEMENT',
      'customer_segments': 'TARGET_AUDIENCE',
      'early_adopter_persona': 'TARGET_AUDIENCE',
      'product_description': 'SOLUTION',
      'how_it_works': 'SOLUTION',
      'uvp_statement': 'VALUE_PROPOSITION',
      'unfair_advantage': 'VALUE_PROPOSITION',
      'validation_summary': 'VALIDATION',
      'business_goals_timeline': 'VALIDATION',
    };
    return keyToSectionMap[dataKey] || null;
  };

  const renderDataItem = (label: string, data: any, stageId?: string) => {
    if (!data) return null;

    const isHighlighted = selectedStage === stageId;

    return (
      <div
        ref={(el) => { if (stageId) itemRefs.current[stageId] = el; }}
        className={`py-2 ${locale === 'fa' ? 'pr-6' : 'pl-6'} border-transparent ${locale === 'fa' ? 'border-r-2' : 'border-l-2'} border-slate-200 dark:border-slate-600 transition-all duration-300 ${
          isHighlighted ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 !border-r-4' : ''
        }`}
      >
        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">{label}</div>
        <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
          {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        </div>
      </div>
    );
  };

  const sections = [
    {
      id: 'PROJECT_INFO',
      title: locale === 'fa' ? 'اطلاعات پروژه' : 'Project Info',
      icon: '📋',
      data: [
        { label: locale === 'fa' ? 'نام پروژه' : 'Project Name', value: startupData.projectName },
        { label: locale === 'fa' ? 'ایده اولیه' : 'Initial Idea', value: startupData.initialIdea },
      ]
    },
    {
      id: 'IDEA_DEFINITION',
      title: locale === 'fa' ? 'تعریف ایده' : 'Idea Definition',
      icon: '💡',
      data: [
        { label: t('IDEA_TITLE', locale), value: startupData.idea_title, stageId: 'IDEA_TITLE' },
        { label: t('ELEVATOR_PITCH', locale), value: startupData.elevator_pitch, stageId: 'ELEVATOR_PITCH' },
        { label: t('EXECUTIVE_SUMMARY', locale), value: startupData.executive_summary, stageId: 'EXECUTIVE_SUMMARY' },
      ]
    },
    {
      id: 'PROBLEM_STATEMENT',
      title: locale === 'fa' ? 'بیان مسئله' : 'Problem Statement',
      icon: '❓',
      data: [
        { label: t('PROBLEM_DESCRIPTION', locale), value: startupData.problem_description, stageId: 'PROBLEM_DESCRIPTION' },
        { label: t('PROBLEM_MAGNITUDE', locale), value: startupData.problem_magnitude, stageId: 'PROBLEM_MAGNITUDE' },
        { label: t('CURRENT_SOLUTIONS', locale), value: startupData.current_solutions, stageId: 'CURRENT_SOLUTIONS' },
      ]
    },
    {
      id: 'TARGET_AUDIENCE',
      title: locale === 'fa' ? 'مخاطب هدف' : 'Target Audience',
      icon: '👥',
      data: [
        { label: t('CUSTOMER_SEGMENTS', locale), value: startupData.customer_segments, stageId: 'CUSTOMER_SEGMENTS' },
        { label: t('EARLY_ADOPTER_PERSONA', locale), value: startupData.early_adopter_persona, stageId: 'EARLY_ADOPTER_PERSONA' },
      ]
    },
    {
      id: 'SOLUTION',
      title: locale === 'fa' ? 'راه‌حل' : 'Solution',
      icon: '🔧',
      data: [
        { label: t('PRODUCT_DESCRIPTION', locale), value: startupData.product_description, stageId: 'PRODUCT_DESCRIPTION' },
        { label: t('HOW_IT_WORKS', locale), value: startupData.how_it_works, stageId: 'HOW_IT_WORKS' },
      ]
    },
    {
      id: 'VALUE_PROPOSITION',
      title: locale === 'fa' ? 'ارزش پیشنهادی' : 'Value Proposition',
      icon: '💎',
      data: [
        { label: t('UVP_STATEMENT', locale), value: startupData.uvp_statement, stageId: 'UVP_STATEMENT' },
        { label: t('UNFAIR_ADVANTAGE', locale), value: startupData.unfair_advantage, stageId: 'UNFAIR_ADVANTAGE' },
      ]
    },
    {
      id: 'VALIDATION',
      title: locale === 'fa' ? 'اعتبارسنجی' : 'Validation',
      icon: '✅',
      data: [
        { label: t('VALIDATION_SUMMARY', locale), value: startupData.validation_summary, stageId: 'VALIDATION_SUMMARY' },
        { label: t('BUSINESS_GOALS_TIMELINE', locale), value: startupData.business_goals_timeline, stageId: 'BUSINESS_GOALS_TIMELINE' },
      ]
    },
    {
      id: 'MARKET_ANALYSIS',
      title: locale === 'fa' ? 'تحلیل بازار' : 'Market Analysis',
      icon: '📊',
      data: [
        { label: t('MARKET_ANALYSIS_SIZE', locale), value: startupData.marketAnalysis_size },
        { label: t('MARKET_ANALYSIS_TRENDS', locale), value: startupData.marketAnalysis_trends },
        { label: t('MARKET_ANALYSIS_OPP_THREATS', locale), value: startupData.marketAnalysis_oppThreats },
        { label: t('MARKET_ANALYSIS_COMPETITOR_IDENTIFICATION', locale), value: startupData.marketAnalysis_competitor_list },
        { label: t('MARKET_ANALYSIS_COMPETITOR_ANALYSIS', locale), value: startupData.marketAnalysis_competitors },
        { label: t('MARKET_ANALYSIS_SWOT_STRENGTHS', locale), value: startupData.marketAnalysis_swot },
        { label: t('MARKET_ANALYSIS_RISK_IDENTIFICATION', locale), value: startupData.marketAnalysis_identified_risks },
        { label: t('MARKET_ANALYSIS_RISK_MITIGATION', locale), value: startupData.marketAnalysis_risk_analysis },
        { label: t('MARKET_ANALYSIS_SUMMARY', locale), value: startupData.marketAnalysisSummary },
      ]
    },
    {
      id: 'BUSINESS_MODEL',
      title: locale === 'fa' ? 'مدل کسب و کار' : 'Business Model',
      icon: '💼',
      data: [
        { label: t('BMC_VALUE_PROPOSITIONS', locale), value: startupData.bmc_valuePropositions },
        { label: t('BMC_CUSTOMER_SEGMENTS', locale), value: startupData.bmc_customerSegments },
        { label: t('BMC_CHANNELS', locale), value: startupData.bmc_channels },
        { label: t('BMC_CUSTOMER_RELATIONSHIPS', locale), value: startupData.bmc_customerRelationships },
        { label: t('BMC_REVENUE_STREAMS', locale), value: startupData.bmc_revenueStreams },
        { label: t('BMC_KEY_ACTIVITIES', locale), value: startupData.bmc_keyActivities },
        { label: t('BMC_KEY_RESOURCES', locale), value: startupData.bmc_keyResources },
        { label: t('BMC_KEY_PARTNERSHIPS', locale), value: startupData.bmc_keyPartnerships },
        { label: t('BMC_COST_STRUCTURE', locale), value: startupData.bmc_costStructure },
        { label: t('BUSINESS_MODELING_SUMMARY', locale), value: startupData.businessModelingSummary },
      ]
    },
    {
      id: 'BRANDING',
      title: locale === 'fa' ? 'برندینگ' : 'Branding',
      icon: '🎨',
      data: [
        { label: t('BRANDING_VISION', locale), value: startupData.branding_vision },
        { label: t('BRANDING_MISSION', locale), value: startupData.branding_mission },
        { label: t('BRANDING_CORE_VALUES', locale), value: startupData.branding_coreValues },
        { label: t('BRANDING_PERSONALITY', locale), value: startupData.branding_personality },
        { label: t('BRANDING_POSITIONING', locale), value: startupData.branding_positioning },
        { label: t('BRANDING_NAME', locale), value: startupData.branding_name },
        { label: t('BRANDING_TAGLINE', locale), value: startupData.branding_tagline },
        { label: t('BRANDING_TONE_OF_VOICE', locale), value: startupData.branding_toneOfVoice },
        { label: t('BRANDING_KEY_MESSAGES', locale), value: startupData.branding_keyMessages },
        { label: t('BRANDING_LOGO', locale), value: startupData.branding_logo },
        { label: t('BRANDING_COLOR_PALETTE', locale), value: startupData.branding_colorPalette },
        { label: t('BRANDING_TYPOGRAPHY', locale), value: startupData.branding_typography },
        { label: t('BRANDING_VISUAL_STYLE', locale), value: startupData.branding_visualStyle },
        { label: t('BRANDING_GUIDELINES', locale), value: startupData.branding_guidelines },
      ]
    },
    {
      id: 'PRODUCT_DEV',
      title: locale === 'fa' ? 'توسعه محصول' : 'Product Development',
      icon: '🚀',
      data: [
        { label: t('PRODUCT_DEV_CORE_FEATURES', locale), value: startupData.productDev_coreFeatures },
        { label: t('PRODUCT_DEV_USER_BENEFITS', locale), value: startupData.productDev_userBenefits },
        { label: t('PRODUCT_DEV_DIFFERENTIATORS', locale), value: startupData.productDev_differentiators },
        { label: t('PRODUCT_DEV_MVP_DEFINITION', locale), value: startupData.productDev_mvpDefinition },
        { label: t('PRODUCT_DEV_MVP_PHASES', locale), value: startupData.productDev_mvpPhases },
        { label: t('PRODUCT_DEV_MVP_TECH_STACK', locale), value: startupData.productDev_mvpTechStack },
        { label: t('PRODUCT_DEV_MVP_DATA_MODEL', locale), value: startupData.productDev_mvpDataModel },
        { label: t('PRODUCT_DEV_MVP_USER_FLOW', locale), value: startupData.productDev_mvpUserFlow },
        { label: t('PRODUCT_DEV_MVP_RESOURCES', locale), value: startupData.productDev_mvpResources },
        { label: t('PRODUCT_DEV_SUMMARY', locale), value: startupData.productDevSummary },
      ]
    },
    {
      id: 'MARKETING',
      title: locale === 'fa' ? 'بازاریابی و فروش' : 'Marketing & Sales',
      icon: '📢',
      data: [
        { label: t('MARKETING_OBJECTIVES', locale), value: startupData.marketing_objectives },
        { label: t('MARKETING_STRATEGY_CONTENT', locale), value: startupData.marketing_strategy_content },
        { label: t('MARKETING_STRATEGY_SEO', locale), value: startupData.marketing_strategy_seo },
        { label: t('MARKETING_STRATEGY_SMM', locale), value: startupData.marketing_strategy_smm },
        { label: t('MARKETING_STRATEGY_PAID_ADS', locale), value: startupData.marketing_strategy_paid_ads },
        { label: t('MARKETING_STRATEGY_EMAIL', locale), value: startupData.marketing_strategy_email },
        { label: t('MARKETING_STRATEGY_PR', locale), value: startupData.marketing_strategy_pr },
        { label: t('MARKETING_STRATEGY_INFLUENCER', locale), value: startupData.marketing_strategy_influencer },
        { label: t('SALES_STRATEGY_CHANNELS', locale), value: startupData.sales_strategy_channels },
        { label: t('SALES_STRATEGY_PROCESS', locale), value: startupData.sales_strategy_process },
        { label: t('INITIAL_CAMPAIGN_PLANNING', locale), value: startupData.initial_campaigns },
        { label: t('MARKETING_MEASUREMENT_KPIS', locale), value: startupData.marketing_kpis },
        { label: t('MARKETING_MEASUREMENT_TOOLS', locale), value: startupData.marketing_tools },
        { label: t('MARKETING_MEASUREMENT', locale), value: startupData.marketing_measurement },
        { label: t('MARKETING_SUMMARY', locale), value: startupData.marketingSummary },
      ]
    },
    {
      id: 'ORGANIZATION',
      title: locale === 'fa' ? 'سازمان و مالی' : 'Organization & Financials',
      icon: '🏢',
      data: [
        { label: t('ORGANIZATION_LEGAL_TEAM', locale), value: startupData.org_team },
        { label: t('ORGANIZATION_LEGAL_AGREEMENT', locale), value: startupData.org_agreement },
        { label: t('ORGANIZATION_LEGAL_STRUCTURE', locale), value: startupData.org_structure },
        { label: t('ORGANIZATION_LEGAL_IP', locale), value: startupData.org_ip },
        { label: t('ORGANIZATION_LEGAL_TERMS', locale), value: startupData.org_terms },
        { label: t('ORGANIZATION_LEGAL_COMPLIANCE', locale), value: startupData.org_compliance },
        { label: t('ORGANIZATION_MANAGEMENT_LEGAL', locale), value: startupData.org_managementLegal },
        { label: t('ORGANIZATION_COMPANY_SUMMARY', locale), value: startupData.org_companyDescription },
        { label: t('ORGANIZATION_OPERATIONS_DAILY_PROCESSES', locale), value: startupData.org_ops_dailyProcesses },
        { label: t('ORGANIZATION_OPERATIONS_PRODUCT_ROADMAP', locale), value: startupData.org_ops_productRoadmap },
        { label: t('ORGANIZATION_OPERATIONAL_PLAN', locale), value: startupData.org_operationalPlan },
        { label: t('ORGANIZATION_FINANCIALS_ASSUMPTIONS', locale), value: startupData.org_financials_assumptions },
        { label: t('ORGANIZATION_FINANCIALS_SALES_FORECAST', locale), value: startupData.org_financials_sales_forecast },
        { label: t('ORGANIZATION_FINANCIALS_PNL', locale), value: startupData.org_financials_pnl },
        { label: t('ORGANIZATION_FINANCIALS_CASH_FLOW', locale), value: startupData.org_financials_cash_flow },
        { label: t('ORGANIZATION_FINANCIALS_BREAK_EVEN', locale), value: startupData.org_financials_break_even },
        { label: t('ORGANIZATION_FINANCIALS_FUNDING_NEEDS', locale), value: startupData.org_financials_funding_needs },
        { label: t('ORGANIZATION_FINANCIAL_PROJECTIONS', locale), value: startupData.org_financialProjections },
        { label: t('ORGANIZATION_SUMMARY', locale), value: startupData.orgSummary },
      ]
    },
    {
      id: 'FINAL_OUTPUTS',
      title: locale === 'fa' ? 'خروجی نهایی' : 'Final Outputs',
      icon: '📋',
      data: [
        { label: t('COMPREHENSIVE_BUSINESS_PLAN', locale), value: startupData.final_businessPlan },
        { label: t('INVESTOR_PITCH_DECK', locale), value: startupData.final_pitchDeck },
        { label: t('FUNDING_REQUEST', locale), value: startupData.final_fundingRequest },
        { label: t('APPENDICES', locale), value: startupData.final_appendices },
        { label: t('FINAL_OUTPUTS_SUMMARY', locale), value: startupData.finalOutputsSummary },
      ]
    }
  ];

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const hasData = section.data.some(item => item.value);
        if (!hasData) return null;

        const isExpanded = expandedSections.has(section.id);

        return (
          <div key={section.id} className="bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{section.icon}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{section.title}</span>
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
              <div className="border-t border-slate-200 dark:border-slate-600">
                {section.data.map((item: any, index: number) => (
                  item.value && (
                    <div key={index}>
                      {renderDataItem(item.label, item.value, item.stageId)}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface BlueprintPreviewProps {
    startupData: Partial<StartupData>;
    locale: Locale;
    selectedStage?: string | null;
}




export const BlueprintPreview: React.FC<BlueprintPreviewProps> = ({ startupData, locale, selectedStage }) => {
    const hasAnyData = Object.values(startupData).some(value => value);

    return (
        <div className="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-full overflow-y-auto shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-100">
                {locale === 'fa' ? 'متن‌های تایید شده' : 'Confirmed Content'}
            </h2>

            {hasAnyData ? (
                <ConfirmedContent startupData={startupData} locale={locale} selectedStage={selectedStage || null} />
            ) : (
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
            )}
        </div>
    );
};
