import React, { useState, useCallback } from 'react';
// FIX: Imported the `Stage` enum to resolve the "Cannot find name 'Stage'" error.
import { StartupData, Locale, MajorSection, Stage, TargetAudiencePersona } from '../types';
import { t } from '../i18n';
import { Loader } from './Loader';
import * as geminiService from '../services/geminiService'; // Assuming a service for Gemini exists

interface BlueprintPreviewProps {
    startupData: Partial<StartupData>;
    locale: Locale;
}

const Section: React.FC<{ title: string; children: React.ReactNode; InitiallyOpen?: boolean }> = ({ title, children, InitiallyOpen = true }) => {
    const [isOpen, setIsOpen] = useState(InitiallyOpen);
    return (
        <div className="mb-6 bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
            <h3 onClick={() => setIsOpen(!isOpen)} className="text-lg font-bold text-slate-700 dark:text-slate-200 cursor-pointer flex justify-between items-center hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {title}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </h3>
            {isOpen && <div className="mt-4 space-y-3 pl-7">{children}</div>}
        </div>
    );
};

const SubSection: React.FC<{ title: string; children: React.ReactNode; InitiallyOpen?: boolean }> = ({ title, children, InitiallyOpen = true }) => {
    const [isOpen, setIsOpen] = useState(InitiallyOpen);
    return (
        <div className="border-r-2 border-indigo-200 dark:border-indigo-700 pr-4">
            <h4
                onClick={() => setIsOpen(!isOpen)}
                className="font-semibold text-slate-600 dark:text-slate-300 mb-2 cursor-pointer flex justify-between items-center hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
                {title}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </h4>
            {isOpen && <div className="space-y-2 ml-2">{children}</div>}
        </div>
    );
};

const DataDisplay: React.FC<{ label: string; data: any; }> = ({ label, data }) => {
    if (!data) return null;

    const renderContent = () => {
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                return <pre className="whitespace-pre-wrap text-xs bg-slate-200 dark:bg-slate-700 p-2 rounded"><code>{JSON.stringify(parsed, null, 2)}</code></pre>;
            } catch (e) {
                // Not a JSON string, render as text
                return <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{data}</p>;
            }
        }
        return <pre className="whitespace-pre-wrap text-xs"><code>{JSON.stringify(data, null, 2)}</code></pre>;
    };

    return (
        <div className="mb-3">
            <h4 className="font-semibold text-slate-600 dark:text-slate-400">{label}</h4>
            {renderContent()}
        </div>
    );
};

const PersonaCard: React.FC<{ persona: TargetAudiencePersona }> = ({ persona }) => (
    <div className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg mb-2">
        <h5 className="font-bold">{persona.personaName}</h5>
        <p><strong>Demographics:</strong> {persona.demographics}</p>
        <p><strong>Needs & Goals:</strong> {persona.needsAndGoals}</p>
        <p><strong>Pain Points:</strong> {persona.painPoints}</p>
    </div>
);

const MarketResearchTool: React.FC<{ startupData: Partial<StartupData>, locale: Locale }> = ({ startupData, locale }) => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<{ text: string, sources?: { uri: string, title: string }[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const researchResult = await geminiService.generateResponseForStage('MARKET_ANALYSIS_TRENDS' as Stage, { ...startupData, marketAnalysis_trends: query }, locale);
            setResult(researchResult);
        } catch (e) {
            setError(t('blueprint_market_research_error', locale));
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
            <h4 className="font-bold text-indigo-800 dark:text-indigo-200">{t(MajorSection.MARKET_RESEARCH_TOOL, locale)}</h4>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">{t('blueprint_market_research_desc', locale)}</p>
            <div className="flex gap-2">
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('blueprint_market_research_placeholder', locale)}
                    className="flex-1 p-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-300"
                    disabled={isLoading}
                />
                <button
                    onClick={handleResearch}
                    disabled={isLoading || !query.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isLoading ? <Loader /> : t('blueprint_market_research_button', locale)}
                </button>
            </div>
            {isLoading && <p className="text-sm italic text-slate-500 mt-2">{t('blueprint_market_research_loading', locale)}</p>}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            {result && (
                <div className="mt-4">
                    <p className="whitespace-pre-wrap">{result.text}</p>
                     {result.sources && result.sources.length > 0 && (
                        <div className="mt-2 text-xs">
                            <span className="font-semibold">{t('blueprint_sources', locale)}</span>
                            <ul className="list-disc list-inside">
                                {result.sources.map((source, index) => (
                                    <li key={index} className="truncate">
                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">
                                            {source.title || source.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


export const BlueprintPreview: React.FC<BlueprintPreviewProps> = ({ startupData, locale }) => {

    const renderAudience = useCallback(() => {
        if (!startupData.coreConcept_initialTargetAudience) return null;
        try {
            const audienceData = JSON.parse(startupData.coreConcept_initialTargetAudience);
            if(Array.isArray(audienceData)) {
                return audienceData.map((persona: TargetAudiencePersona, index: number) => <PersonaCard key={index} persona={persona} />);
            }
            return <p>{startupData.coreConcept_initialTargetAudience}</p>;
        } catch {
            return <p>{startupData.coreConcept_initialTargetAudience}</p>;
        }
    }, [startupData.coreConcept_initialTargetAudience]);

    return (
        <div className="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-full overflow-y-auto shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-100">طرح کلی استارتاپ شما - نسخه ۱</h2>

            <MarketResearchTool startupData={startupData} locale={locale} />

            <div className="mt-6">
                {/* Core Concept Section */}
                <Section title={`${t(MajorSection.CORE_CONCEPT, locale)} ${locale === 'fa' ? '(فکر ابتدایی)' : '(Core Concept)'}`}>
                    <SubSection title={locale === 'fa' ? 'مشخصات ایده' : 'Idea Definition'}>
                        <DataDisplay label={t('CORE_CONCEPT_IDEA_TITLE', locale)} data={startupData.coreConcept_ideaTitle} />
                        <DataDisplay label={t('CORE_CONCEPT_IDEA_ABSTRACT', locale)} data={startupData.coreConcept_ideaAbstract} />
                        <DataDisplay label={t('CORE_CONCEPT_PROBLEM_STATEMENT', locale)} data={startupData.coreConcept_problemStatement} />
                        <div className="mb-3">
                            <h4 className="font-semibold text-slate-600 dark:text-slate-400">{t('CORE_CONCEPT_INITIAL_TARGET_AUDIENCE', locale)}</h4>
                            {renderAudience()}
                        </div>
                    </SubSection>
                    <SubSection title={locale === 'fa' ? 'راه‌حل و ارزش' : 'Solution & Value'}>
                        <DataDisplay label={t('CORE_CONCEPT_PROPOSED_SOLUTION', locale)} data={startupData.coreConcept_proposedSolution} />
                        <DataDisplay label={t('CORE_CONCEPT_VALUE_PROPOSITION', locale)} data={startupData.coreConcept_valueProposition} />
                        <DataDisplay label={t('CORE_CONCEPT_BUSINESS_GOALS', locale)} data={startupData.coreConcept_businessGoals} />
                    </SubSection>
                    {startupData.coreConceptSummary && (
                        <SubSection title={locale === 'fa' ? 'خلاصه' : 'Summary'}>
                            <DataDisplay label={t('CORE_CONCEPT_SUMMARY', locale)} data={startupData.coreConceptSummary} />
                        </SubSection>
                    )}
                </Section>

                {/* Market Analysis Section */}
                <Section title={`${t(MajorSection.MARKET_ANALYSIS, locale)} ${locale === 'fa' ? '(تحلیل بازار و رقبا)' : '(Market & Competitors)'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SubSection title={locale === 'fa' ? 'محیط بازار' : 'Market Environment'}>
                            <DataDisplay label={t('MARKET_ANALYSIS_SIZE', locale)} data={startupData.marketAnalysis_size} />
                            <DataDisplay label={t('MARKET_ANALYSIS_TRENDS', locale)} data={startupData.marketAnalysis_trends} />
                            <DataDisplay label={t('MARKET_ANALYSIS_OPP_THREATS', locale)} data={startupData.marketAnalysis_oppThreats} />
                        </SubSection>
                        <SubSection title={locale === 'fa' ? 'چشم‌انداز رقابتی' : 'Competitive Landscape'}>
                            <DataDisplay label={t('MARKET_ANALYSIS_COMPETITOR_IDENTIFICATION', locale)} data={startupData.marketAnalysis_competitor_list} />
                            <DataDisplay label={t('MARKET_ANALYSIS_COMPETITOR_ANALYSIS', locale)} data={startupData.marketAnalysis_competitors} />
                        </SubSection>
                        <SubSection title={locale === 'fa' ? 'موقعیت‌یابی استراتژیک' : 'Strategic Positioning'}>
                            <DataDisplay label={locale === 'fa' ? 'تحلیل SWOT' : 'SWOT Analysis'} data={startupData.marketAnalysis_swot} />
                        </SubSection>
                        <SubSection title={locale === 'fa' ? 'تحلیل ریسک' : 'Risk Analysis'}>
                            <DataDisplay label={t('blueprint_risk_analysis_title', locale)} data={startupData.marketAnalysis_risk_analysis} />
                            {startupData.marketAnalysisSummary && <DataDisplay label={t('MARKET_ANALYSIS_SUMMARY', locale)} data={startupData.marketAnalysisSummary} />}
                        </SubSection>
                    </div>
                </Section>

                {/* Business Modeling Section */}
                {Object.values(startupData).some(value => value) && (
                    <Section title={`${t(MajorSection.BUSINESS_MODELING, locale)} ${locale === 'fa' ? '(مدل کسب‌وکار - BMC)' : '(Business Model Canvas)'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SubSection title={locale === 'fa' ? 'ارزش‌ها' : 'Value Proposition'}>
                                <DataDisplay label={t('BMC_VALUE_PROPOSITIONS', locale)} data={startupData.bmc_valuePropositions} />
                                <DataDisplay label={t('BMC_CUSTOMER_RELATIONSHIPS', locale)} data={startupData.bmc_customerRelationships} />
                                <DataDisplay label={t('BMC_CHANNELS', locale)} data={startupData.bmc_channels} />
                            </SubSection>
                            <SubSection title={locale === 'fa' ? 'مشتریان و درآمد' : 'Customers & Revenue'}>
                                <DataDisplay label={t('BMC_CUSTOMER_SEGMENTS', locale)} data={startupData.bmc_customerSegments} />
                                <DataDisplay label={t('BMC_REVENUE_STREAMS', locale)} data={startupData.bmc_revenueStreams} />
                            </SubSection>
                            <SubSection title={locale === 'fa' ? 'فعالیت‌ها و منابع' : 'Activities & Resources'}>
                                <DataDisplay label={t('BMC_KEY_ACTIVITIES', locale)} data={startupData.bmc_keyActivities} />
                                <DataDisplay label={t('BMC_KEY_RESOURCES', locale)} data={startupData.bmc_keyResources} />
                                <DataDisplay label={t('BMC_KEY_PARTNERSHIPS', locale)} data={startupData.bmc_keyPartnerships} />
                            </SubSection>
                            <SubSection title={locale === 'fa' ? 'هزینه‌ها' : 'Costs'}>
                                <DataDisplay label={t('BMC_COST_STRUCTURE', locale)} data={startupData.bmc_costStructure} />
                            </SubSection>
                        </div>
                        {startupData.businessModelingSummary && (
                            <SubSection title={locale === 'fa' ? 'خلاصه' : 'Summary'}>
                                <DataDisplay label={t('BUSINESS_MODELING_SUMMARY', locale)} data={startupData.businessModelingSummary} />
                            </SubSection>
                        )}
                    </Section>
                )}

                {/* Branding Section */}
                {(startupData.branding_vision || startupData.branding_name || startupData.branding_guidelines) && (
                    <Section title={`${t(MajorSection.BRANDING, locale)} ${locale === 'fa' ? '(برندینگ و هویت)' : '(Branding & Identity)'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SubSection title={locale === 'fa' ? 'استراتژی برند' : 'Brand Strategy'}>
                                <DataDisplay label={t('BRANDING_VISION', locale)} data={startupData.branding_vision} />
                                <DataDisplay label={t('BRANDING_MISSION', locale)} data={startupData.branding_mission} />
                                <DataDisplay label={t('BRANDING_CORE_VALUES', locale)} data={startupData.branding_coreValues} />
                                <DataDisplay label={t('BRANDING_PERSONALITY', locale)} data={startupData.branding_personality} />
                                <DataDisplay label={t('BRANDING_POSITIONING', locale)} data={startupData.branding_positioning} />
                            </SubSection>
                            <SubSection title={locale === 'fa' ? 'هویت کلامی' : 'Verbal Identity'}>
                                <DataDisplay label={t('BRANDING_NAME', locale)} data={startupData.branding_name} />
                                <DataDisplay label={t('BRANDING_TAGLINE', locale)} data={startupData.branding_tagline} />
                                <DataDisplay label={t('BRANDING_TONE_OF_VOICE', locale)} data={startupData.branding_toneOfVoice} />
                                <DataDisplay label={t('BRANDING_KEY_MESSAGES', locale)} data={startupData.branding_keyMessages} />
                            </SubSection>
                            <SubSection title={locale === 'fa' ? 'هویت بصری' : 'Visual Identity'}>
                                <DataDisplay label={t('BRANDING_LOGO', locale)} data={startupData.branding_logo} />
                                <DataDisplay label={t('BRANDING_COLOR_PALETTE', locale)} data={startupData.branding_colorPalette} />
                                <DataDisplay label={t('BRANDING_TYPOGRAPHY', locale)} data={startupData.branding_typography} />
                                <DataDisplay label={t('BRANDING_VISUAL_STYLE', locale)} data={startupData.branding_visualStyle} />
                            </SubSection>
                        </div>
                        {startupData.branding_guidelines && (
                            <SubSection title={locale === 'fa' ? 'راهنمای برند' : 'Brand Guidelines'}>
                                <DataDisplay label={t('BRANDING_GUIDELINES', locale)} data={startupData.branding_guidelines} />
                            </SubSection>
                        )}
                    </Section>
                )}

                {/* Product Development Section */}
                {(startupData.productDev_coreFeatures || startupData.productDevSummary) && (
                    <Section title={`${t(MajorSection.PRODUCT_DEVELOPMENT, locale)} ${locale === 'fa' ? '(توسعه محصول - MVP)' : '(Product Dev - MVP)'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SubSection title={locale === 'fa' ? 'توضیحات محصول' : 'Product Description'}>
                                <DataDisplay label={t('PRODUCT_DEV_CORE_FEATURES', locale)} data={startupData.productDev_coreFeatures} />
                                <DataDisplay label={t('PRODUCT_DEV_USER_BENEFITS', locale)} data={startupData.productDev_userBenefits} />
                                <DataDisplay label={t('PRODUCT_DEV_DIFFERENTIATORS', locale)} data={startupData.productDev_differentiators} />
                            </SubSection>
                            <SubSection title={locale === 'fa' ? 'برنامه MVP' : 'MVP Plan'}>
                                <DataDisplay label={t('PRODUCT_DEV_MVP_DEFINITION', locale)} data={startupData.productDev_mvpDefinition} />
                                <DataDisplay label={t('PRODUCT_DEV_MVP_PHASES', locale)} data={startupData.productDev_mvpPhases} />
                                <DataDisplay label={t('PRODUCT_DEV_MVP_TECH_STACK', locale)} data={startupData.productDev_mvpTechStack} />
                                <DataDisplay label={t('PRODUCT_DEV_MVP_DATA_MODEL', locale)} data={startupData.productDev_mvpDataModel} />
                                <DataDisplay label={t('PRODUCT_DEV_MVP_USER_FLOW', locale)} data={startupData.productDev_mvpUserFlow} />
                                <DataDisplay label={t('PRODUCT_DEV_MVP_RESOURCES', locale)} data={startupData.productDev_mvpResources} />
                            </SubSection>
                        </div>
                        {startupData.productDevSummary && (
                            <SubSection title={locale === 'fa' ? 'خلاصه' : 'Summary'}>
                                <DataDisplay label={t('PRODUCT_DEV_SUMMARY', locale)} data={startupData.productDevSummary} />
                            </SubSection>
                        )}
                    </Section>
                )}

                {/* Marketing & Sales Section */}
                {(startupData.marketing_objectives || startupData.marketingSummary) && (
                    <Section title={`${t(MajorSection.MARKETING_SALES, locale)} ${locale === 'fa' ? '(بازاریابی و فروش)' : '(Marketing & Sales)'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SubSection title={locale === 'fa' ? 'استراتژی‌های بازاریابی' : 'Marketing Strategies'}>
                                <DataDisplay label={t('MARKETING_OBJECTIVES', locale)} data={startupData.marketing_objectives} />
                                <DataDisplay label={t('MARKETING_STRATEGY_CONTENT', locale)} data={startupData.marketing_strategy_content} />
                                <DataDisplay label={t('MARKETING_STRATEGY_SEO', locale)} data={startupData.marketing_strategy_seo} />
                                <DataDisplay label={t('MARKETING_STRATEGY_SMM', locale)} data={startupData.marketing_strategy_smm} />
                                <DataDisplay label={t('MARKETING_STRATEGY_PAID_ADS', locale)} data={startupData.marketing_strategy_paid_ads} />
                                <DataDisplay label={t('MARKETING_STRATEGY_EMAIL', locale)} data={startupData.marketing_strategy_email} />
                                <DataDisplay label={t('MARKETING_STRATEGY_PR', locale)} data={startupData.marketing_strategy_pr} />
                                <DataDisplay label={t('MARKETING_STRATEGY_INFLUENCER', locale)} data={startupData.marketing_strategy_influencer} />
                            </SubSection>
                            <SubSection title={locale === 'fa' ? 'استراتژی فروش' : 'Sales Strategy'}>
                                <DataDisplay label={t('SALES_STRATEGY_CHANNELS', locale)} data={startupData.sales_strategy_channels} />
                                <DataDisplay label={t('SALES_STRATEGY_PROCESS', locale)} data={startupData.sales_strategy_process} />
                                <DataDisplay label={t('INITIAL_CAMPAIGN_PLANNING', locale)} data={startupData.initial_campaigns} />
                            </SubSection>
                            <SubSection title={locale === 'fa' ? 'اندازه‌گیری و بهبود' : 'Measurement & Improvement'}>
                                <DataDisplay label={t('MARKETING_MEASUREMENT_KPIS', locale)} data={startupData.marketing_kpis} />
                                <DataDisplay label={t('MARKETING_MEASUREMENT_TOOLS', locale)} data={startupData.marketing_tools} />
                                <DataDisplay label={t('MARKETING_MEASUREMENT', locale)} data={startupData.marketing_measurement} />
                            </SubSection>
                        </div>
                        {startupData.marketingSummary && (
                            <SubSection title={locale === 'fa' ? 'خلاصه' : 'Summary'}>
                                <DataDisplay label={t('MARKETING_SUMMARY', locale)} data={startupData.marketingSummary} />
                            </SubSection>
                        )}
                    </Section>
                )}

                {/* Organization & Financials Section */}
                {(startupData.org_team || startupData.orgSummary) && (
                    <Section title={`${t(MajorSection.ORGANIZATION_FINANCIALS, locale)} ${locale === 'fa' ? '(سازمان و امور مالی)' : '(Organization & Financials)'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SubSection title={locale === 'fa' ? 'سازمان و حقوقی' : 'Organization & Legal'}>
                                <DataDisplay label={t('ORGANIZATION_LEGAL_TEAM', locale)} data={startupData.org_team} />
                                <DataDisplay label={t('ORGANIZATION_LEGAL_AGREEMENT', locale)} data={startupData.org_agreement} />
                                <DataDisplay label={t('ORGANIZATION_LEGAL_STRUCTURE', locale)} data={startupData.org_structure} />
                                <DataDisplay label={t('ORGANIZATION_LEGAL_IP', locale)} data={startupData.org_ip} />
                                <DataDisplay label={t('ORGANIZATION_LEGAL_TERMS', locale)} data={startupData.org_terms} />
                                <DataDisplay label={t('ORGANIZATION_LEGAL_COMPLIANCE', locale)} data={startupData.org_compliance} />
                                <DataDisplay label={t('ORGANIZATION_MANAGEMENT_LEGAL', locale)} data={startupData.org_managementLegal} />
                                <DataDisplay label={t('ORGANIZATION_COMPANY_SUMMARY', locale)} data={startupData.org_companyDescription} />
                            </SubSection>
                            <SubSection title={locale === 'fa' ? 'عملیاتی' : 'Operational'}>
                                <DataDisplay label={t('ORGANIZATION_OPERATIONS_DAILY_PROCESSES', locale)} data={startupData.org_ops_dailyProcesses} />
                                <DataDisplay label={t('ORGANIZATION_OPERATIONS_PRODUCT_ROADMAP', locale)} data={startupData.org_ops_productRoadmap} />
                                <DataDisplay label={t('ORGANIZATION_OPERATIONAL_PLAN', locale)} data={startupData.org_operationalPlan} />
                            </SubSection>
                            <SubSection title={locale === 'fa' ? 'پیش‌بینی‌های مالی' : 'Financial Projections'}>
                                <DataDisplay label={t('ORGANIZATION_FINANCIALS_ASSUMPTIONS', locale)} data={startupData.org_financials_assumptions} />
                                <DataDisplay label={t('ORGANIZATION_FINANCIALS_SALES_FORECAST', locale)} data={startupData.org_financials_sales_forecast} />
                                <DataDisplay label={t('ORGANIZATION_FINANCIALS_PNL', locale)} data={startupData.org_financials_pnl} />
                                <DataDisplay label={t('ORGANIZATION_FINANCIALS_CASH_FLOW', locale)} data={startupData.org_financials_cash_flow} />
                                <DataDisplay label={t('ORGANIZATION_FINANCIALS_BREAK_EVEN', locale)} data={startupData.org_financials_break_even} />
                                <DataDisplay label={t('ORGANIZATION_FINANCIALS_FUNDING_NEEDS', locale)} data={startupData.org_financials_funding_needs} />
                                <DataDisplay label={t('ORGANIZATION_FINANCIAL_PROJECTIONS', locale)} data={startupData.org_financialProjections} />
                            </SubSection>
                        </div>
                        {startupData.orgSummary && (
                            <SubSection title={locale === 'fa' ? 'خلاصه' : 'Summary'}>
                                <DataDisplay label={t('ORGANIZATION_SUMMARY', locale)} data={startupData.orgSummary} />
                            </SubSection>
                        )}
                    </Section>
                )}

                {/* Final Outputs Section */}
                {(startupData.final_fundingRequest || startupData.final_businessPlan) && (
                    <Section title={`${t(MajorSection.FINAL_OUTPUTS, locale)} ${locale === 'fa' ? '(خروجی‌های نهایی)' : '(Final Outputs)'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SubSection title={locale === 'fa' ? 'طرح‌ها' : 'Plans'}>
                                <DataDisplay label={t('COMPREHENSIVE_BUSINESS_PLAN', locale)} data={startupData.final_businessPlan} />
                                <DataDisplay label={t('INVESTOR_PITCH_DECK', locale)} data={startupData.final_pitchDeck} />
                            </SubSection>
                            <SubSection title={locale === 'fa' ? 'درخواست تأمین مالی' : 'Funding Request'}>
                                <DataDisplay label={t('FUNDING_REQUEST', locale)} data={startupData.final_fundingRequest} />
                                <DataDisplay label={t('APPENDICES', locale)} data={startupData.final_appendices} />
                            </SubSection>
                        </div>
                        {startupData.finalOutputsSummary && (
                            <SubSection title={locale === 'fa' ? 'خلاصه' : 'Summary'}>
                                <DataDisplay label={t('FINAL_OUTPUTS_SUMMARY', locale)} data={startupData.finalOutputsSummary} />
                            </SubSection>
                        )}
                    </Section>
                )}
            </div>
        </div>
    );
};
