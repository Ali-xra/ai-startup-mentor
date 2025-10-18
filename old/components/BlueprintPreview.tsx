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
            <h3 onClick={() => setIsOpen(!isOpen)} className="text-lg font-bold text-slate-700 dark:text-slate-200 cursor-pointer flex justify-between items-center">
                {title}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </h3>
            {isOpen && <div className="mt-4 prose prose-slate dark:prose-invert max-w-none prose-sm">{children}</div>}
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
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-100">{t('blueprint_title', locale)}</h2>

            <MarketResearchTool startupData={startupData} locale={locale} />
            
            <div className="mt-6">
                 <Section title={t(MajorSection.CORE_CONCEPT, locale)}>
                    <DataDisplay label={t('CORE_CONCEPT_IDEA_TITLE', locale)} data={startupData.coreConcept_ideaTitle} />
                    <DataDisplay label={t('CORE_CONCEPT_IDEA_ABSTRACT', locale)} data={startupData.coreConcept_ideaAbstract} />
                    <DataDisplay label={t('CORE_CONCEPT_PROBLEM_STATEMENT', locale)} data={startupData.coreConcept_problemStatement} />
                    <div className="mb-3">
                        <h4 className="font-semibold text-slate-600 dark:text-slate-400">{t('CORE_CONCEPT_INITIAL_TARGET_AUDIENCE', locale)}</h4>
                        {renderAudience()}
                    </div>
                    <DataDisplay label={t('CORE_CONCEPT_PROPOSED_SOLUTION', locale)} data={startupData.coreConcept_proposedSolution} />
                    <DataDisplay label={t('CORE_CONCEPT_VALUE_PROPOSITION', locale)} data={startupData.coreConcept_valueProposition} />
                    <DataDisplay label={t('CORE_CONCEPT_BUSINESS_GOALS', locale)} data={startupData.coreConcept_businessGoals} />
                    <DataDisplay label={t('CORE_CONCEPT_SUMMARY', locale)} data={startupData.coreConceptSummary} />
                </Section>

                <Section title={t(MajorSection.MARKET_ANALYSIS, locale)}>
                    <DataDisplay label={t('MARKET_ANALYSIS_SIZE', locale)} data={startupData.marketAnalysis_size} />
                    <DataDisplay label={t('MARKET_ANALYSIS_TRENDS', locale)} data={startupData.marketAnalysis_trends} />
                    <DataDisplay label={t('MARKET_ANALYSIS_OPP_THREATS', locale)} data={startupData.marketAnalysis_oppThreats} />
                    <DataDisplay label={t('MARKET_ANALYSIS_COMPETITOR_IDENTIFICATION', locale)} data={startupData.marketAnalysis_competitor_list} />
                    <DataDisplay label={t('MARKET_ANALYSIS_COMPETITOR_ANALYSIS', locale)} data={startupData.marketAnalysis_competitors} />
                    <DataDisplay label={'SWOT Analysis'} data={startupData.marketAnalysis_swot} />
                    <DataDisplay label={t('blueprint_risk_analysis_title', locale)} data={startupData.marketAnalysis_risk_analysis} />
                    <DataDisplay label={t('MARKET_ANALYSIS_SUMMARY', locale)} data={startupData.marketAnalysisSummary} />
                </Section>
                
                 {/* Add other sections here as they are completed */}
                 {startupData.businessModelingSummary && (
                    <Section title={t(MajorSection.BUSINESS_MODELING, locale)}>
                        <DataDisplay label={t(MajorSection.BUSINESS_MODELING, locale)} data={startupData.businessModelingSummary} />
                    </Section>
                 )}
                 {startupData.branding_guidelines && (
                    <Section title={t(MajorSection.BRANDING, locale)}>
                        <DataDisplay label={t(MajorSection.BRANDING, locale)} data={startupData.branding_guidelines} />
                    </Section>
                 )}
            </div>
        </div>
    );
};