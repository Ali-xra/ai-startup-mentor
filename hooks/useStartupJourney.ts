import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabaseClient';
import * as geminiService from '../services/geminiService';
import { ChatMessage, Stage, StartupData, Locale, MajorSection } from '../types';
import { t } from '../i18n';

const ALL_STAGES: Stage[] = Object.values(Stage);

export const STAGE_TO_DATA_KEY: Record<Stage, keyof StartupData | null> = {
    [Stage.INITIAL]: null,

    // Phase 1: Core Concept & Validation (NEW)
    [Stage.IDEA_TITLE]: 'idea_title',
    [Stage.ELEVATOR_PITCH]: 'elevator_pitch',
    [Stage.EXECUTIVE_SUMMARY]: 'executive_summary',
    [Stage.PROBLEM_DESCRIPTION]: 'problem_description',
    [Stage.PROBLEM_MAGNITUDE]: 'problem_magnitude',
    [Stage.CURRENT_SOLUTIONS]: 'current_solutions',
    [Stage.CUSTOMER_SEGMENTS]: 'customer_segments',
    [Stage.EARLY_ADOPTER_PERSONA]: 'early_adopter_persona',
    [Stage.PRODUCT_DESCRIPTION]: 'product_description',
    [Stage.HOW_IT_WORKS]: 'core_features',
    [Stage.UVP_STATEMENT]: 'uvp_statement',
    [Stage.UNFAIR_ADVANTAGE]: 'unfair_advantage',
    [Stage.VALIDATION_SUMMARY]: 'validation_summary',
    [Stage.BUSINESS_GOALS_TIMELINE]: 'business_goals',
    [Stage.MARKET_ANALYSIS_SIZE]: 'marketAnalysis_size',
    [Stage.MARKET_ANALYSIS_TRENDS]: 'marketAnalysis_trends',
    [Stage.MARKET_ANALYSIS_OPP_THREATS]: 'marketAnalysis_oppThreats',
    [Stage.MARKET_ANALYSIS_COMPETITOR_IDENTIFICATION]: 'marketAnalysis_competitor_list',
    [Stage.MARKET_ANALYSIS_COMPETITOR_ANALYSIS]: 'marketAnalysis_competitors',
    [Stage.MARKET_ANALYSIS_SWOT_STRENGTHS]: 'marketAnalysis_swot',
    [Stage.MARKET_ANALYSIS_SWOT_WEAKNESSES]: 'marketAnalysis_swot',
    [Stage.MARKET_ANALYSIS_SWOT_OPPORTUNITIES]: 'marketAnalysis_swot',
    [Stage.MARKET_ANALYSIS_SWOT_THREATS]: 'marketAnalysis_swot',
    [Stage.MARKET_ANALYSIS_RISK_IDENTIFICATION]: 'marketAnalysis_identified_risks',
    [Stage.MARKET_ANALYSIS_RISK_MITIGATION]: 'marketAnalysis_risk_analysis',
    [Stage.MARKET_ANALYSIS_SUMMARY]: 'marketAnalysisSummary',
    [Stage.BMC_CUSTOMER_SEGMENTS]: 'bmc_customerSegments',
    [Stage.BMC_VALUE_PROPOSITIONS]: 'bmc_valuePropositions',
    [Stage.BMC_CHANNELS]: 'bmc_channels',
    [Stage.BMC_CUSTOMER_RELATIONSHIPS]: 'bmc_customerRelationships',
    [Stage.BMC_REVENUE_STREAMS]: 'bmc_revenueStreams',
    [Stage.BMC_KEY_ACTIVITIES]: 'bmc_keyActivities',
    [Stage.BMC_KEY_RESOURCES]: 'bmc_keyResources',
    [Stage.BMC_KEY_PARTNERSHIPS]: 'bmc_keyPartnerships',
    [Stage.BMC_COST_STRUCTURE]: 'bmc_costStructure',
    [Stage.BUSINESS_MODELING_SUMMARY]: 'businessModelingSummary',
    [Stage.BRANDING_VISION]: 'branding_vision',
    [Stage.BRANDING_MISSION]: 'branding_mission',
    [Stage.BRANDING_CORE_VALUES]: 'branding_coreValues',
    [Stage.BRANDING_PERSONALITY]: 'branding_personality',
    [Stage.BRANDING_POSITIONING]: 'branding_positioning',
    [Stage.BRANDING_NAME]: 'branding_name',
    [Stage.BRANDING_TAGLINE]: 'branding_tagline',
    [Stage.BRANDING_TONE_OF_VOICE]: 'branding_toneOfVoice',
    [Stage.BRANDING_KEY_MESSAGES]: 'branding_keyMessages',
    [Stage.BRANDING_LOGO]: 'branding_logo',
    [Stage.BRANDING_COLOR_PALETTE]: 'branding_colorPalette',
    [Stage.BRANDING_TYPOGRAPHY]: 'branding_typography',
    [Stage.BRANDING_VISUAL_STYLE]: 'branding_visualStyle',
    [Stage.BRANDING_GUIDELINES]: 'branding_guidelines',
    [Stage.PRODUCT_DEV_CORE_FEATURES]: 'productDev_coreFeatures',
    [Stage.PRODUCT_DEV_USER_BENEFITS]: 'productDev_userBenefits',
    [Stage.PRODUCT_DEV_DIFFERENTIATORS]: 'productDev_differentiators',
    [Stage.PRODUCT_DEV_MVP_DEFINITION]: 'productDev_mvpDefinition',
    [Stage.PRODUCT_DEV_MVP_PHASES]: 'productDev_mvpPhases',
    [Stage.PRODUCT_DEV_MVP_TECH_STACK]: 'productDev_mvpTechStack',
    [Stage.PRODUCT_DEV_MVP_DATA_MODEL]: 'productDev_mvpDataModel',
    [Stage.PRODUCT_DEV_MVP_USER_FLOW]: 'productDev_mvpUserFlow',
    [Stage.PRODUCT_DEV_MVP_RESOURCES]: 'productDev_mvpResources',
    [Stage.PRODUCT_DEV_SUMMARY]: 'productDevSummary',
    [Stage.MARKETING_OBJECTIVES]: 'marketing_objectives',
    [Stage.MARKETING_STRATEGY_CONTENT]: 'marketing_strategy_content',
    [Stage.MARKETING_STRATEGY_SEO]: 'marketing_strategy_seo',
    [Stage.MARKETING_STRATEGY_SMM]: 'marketing_strategy_smm',
    [Stage.MARKETING_STRATEGY_PAID_ADS]: 'marketing_strategy_paid_ads',
    [Stage.MARKETING_STRATEGY_EMAIL]: 'marketing_strategy_email',
    [Stage.MARKETING_STRATEGY_PR]: 'marketing_strategy_pr',
    [Stage.MARKETING_STRATEGY_INFLUENCER]: 'marketing_strategy_influencer',
    [Stage.SALES_STRATEGY_CHANNELS]: 'sales_strategy_channels',
    [Stage.SALES_STRATEGY_PROCESS]: 'sales_strategy_process',
    [Stage.INITIAL_CAMPAIGN_PLANNING]: 'initial_campaigns',
    [Stage.MARKETING_MEASUREMENT_KPIS]: 'marketing_kpis',
    [Stage.MARKETING_MEASUREMENT_TOOLS]: 'marketing_tools',
    [Stage.MARKETING_MEASUREMENT]: 'marketing_measurement',
    [Stage.MARKETING_SUMMARY]: 'marketingSummary',
    [Stage.ORGANIZATION_LEGAL_TEAM]: 'org_team',
    [Stage.ORGANIZATION_LEGAL_AGREEMENT]: 'org_agreement',
    [Stage.ORGANIZATION_LEGAL_STRUCTURE]: 'org_structure',
    [Stage.ORGANIZATION_LEGAL_IP]: 'org_ip',
    [Stage.ORGANIZATION_LEGAL_TERMS]: 'org_terms',
    [Stage.ORGANIZATION_LEGAL_COMPLIANCE]: 'org_compliance',
    [Stage.ORGANIZATION_MANAGEMENT_LEGAL]: 'org_managementLegal',
    [Stage.ORGANIZATION_COMPANY_SUMMARY]: 'org_companyDescription',
    [Stage.ORGANIZATION_OPERATIONS_DAILY_PROCESSES]: 'org_ops_dailyProcesses',
    [Stage.ORGANIZATION_OPERATIONS_PRODUCT_ROADMAP]: 'org_ops_productRoadmap',
    [Stage.ORGANIZATION_OPERATIONAL_PLAN]: 'org_operationalPlan',
    [Stage.ORGANIZATION_FINANCIALS_ASSUMPTIONS]: 'org_financials_assumptions',
    [Stage.ORGANIZATION_FINANCIALS_SALES_FORECAST]: 'org_financials_sales_forecast',
    [Stage.ORGANIZATION_FINANCIALS_PNL]: 'org_financials_pnl',
    [Stage.ORGANIZATION_FINANCIALS_CASH_FLOW]: 'org_financials_cash_flow',
    [Stage.ORGANIZATION_FINANCIALS_BREAK_EVEN]: 'org_financials_break_even',
    [Stage.ORGANIZATION_FINANCIALS_FUNDING_NEEDS]: 'org_financials_funding_needs',
    [Stage.ORGANIZATION_FINANCIAL_PROJECTIONS]: 'org_financialProjections',
    [Stage.ORGANIZATION_SUMMARY]: 'orgSummary',
    [Stage.FUNDING_REQUEST]: 'final_fundingRequest',
    [Stage.COMPREHENSIVE_BUSINESS_PLAN]: 'final_businessPlan',
    [Stage.INVESTOR_PITCH_DECK]: 'final_pitchDeck',
    [Stage.APPENDICES]: 'final_appendices',
    [Stage.FINAL_OUTPUTS_SUMMARY]: 'finalOutputsSummary',
    [Stage.COMPLETE]: null,
};

const getQuestionKeyForStage = (stage: Stage) => `question_${stage}`;

const isSummaryStage = (stage: Stage) => stage.endsWith('_SUMMARY') || stage === Stage.COMPLETE;
const isAutoGeneratedStage = (stage: Stage) => {
    const autoGeneratedStages = [
        Stage.MARKET_ANALYSIS_OPP_THREATS,
        Stage.MARKET_ANALYSIS_COMPETITOR_ANALYSIS,
        Stage.MARKET_ANALYSIS_RISK_MITIGATION,
        Stage.BMC_VALUE_PROPOSITIONS,
        Stage.BMC_KEY_ACTIVITIES,
        Stage.BMC_KEY_RESOURCES,
        Stage.BMC_COST_STRUCTURE,
        Stage.INITIAL_CAMPAIGN_PLANNING,
        Stage.MARKETING_MEASUREMENT,
        Stage.ORGANIZATION_MANAGEMENT_LEGAL,
        Stage.ORGANIZATION_COMPANY_SUMMARY,
        Stage.ORGANIZATION_OPERATIONAL_PLAN,
        Stage.ORGANIZATION_FINANCIAL_PROJECTIONS,
        Stage.FUNDING_REQUEST,
        Stage.COMPREHENSIVE_BUSINESS_PLAN,
        Stage.INVESTOR_PITCH_DECK,
    ];
    return autoGeneratedStages.includes(stage) || isSummaryStage(stage);
}


export const useStartupJourney = (projectId: string | null, locale: Locale) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [stage, setStage] = useState<Stage>(Stage.INITIAL);
    const [startupData, setStartupData] = useState<Partial<StartupData>>({});
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [editingStage, setEditingStage] = useState<Stage | null>(null);
    const [isReadyForNextSection, setIsReadyForNextSection] = useState(false);
    const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
    const [currentSuggestion, setCurrentSuggestion] = useState('');

    const journeyStateRef = useRef({ stage, startupData, messages, locale });

    useEffect(() => {
        journeyStateRef.current = { stage, startupData, messages, locale };
    }, [stage, startupData, messages, locale]);


    const addMessage = (message: Omit<ChatMessage, 'id'>) => {
        setMessages(prev => [...prev, { ...message, id: uuidv4() }]);
    };
    
    const saveProjectToDb = useCallback(async (updatedStage: Stage, updatedData: Partial<StartupData>, updatedMessages: ChatMessage[]) => {
        if (!projectId) return;
        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    stage: updatedStage,
                    startup_data: updatedData,
                    messages: updatedMessages,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', projectId);
            if (error) throw error;
        } catch (error) {
            console.error("Error saving project:", error);
        }
    }, [projectId]);

    const loadProject = useCallback(async () => {
        if (!projectId) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('stage, startup_data, messages')
                .eq('id', projectId)
                .single();

            if (error) throw error;

            if (data) {
                setStage(data.stage as Stage);
                setStartupData(data.startup_data as Partial<StartupData>);
                setMessages(data.messages as ChatMessage[]);
                if (!data.messages || data.messages.length === 0) {
                     addMessage({ text: `${t('system_start_journey', journeyStateRef.current.locale)} "${data.startup_data.projectName}"`, sender: 'system' });
                     addMessage({ text: t(getQuestionKeyForStage(data.stage), journeyStateRef.current.locale), sender: 'ai' });
                }
            }
        } catch (error) {
            console.error("Error loading project:", error);
            alert("Failed to load project.");
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            // Reset all state when projectId changes
            setIsInitialized(false);
            setIsLoading(false);
            setStage(Stage.INITIAL);
            setStartupData({});
            setMessages([]);
            setEditingStage(null);
            setIsReadyForNextSection(false);
            setSuggestionModalOpen(false);
            setCurrentSuggestion('');

            // Then load the new project
            loadProject();
        }
    }, [projectId, loadProject]);
    
    const advanceStage = async (currentStage: Stage, currentData: Partial<StartupData>, currentMessages: ChatMessage[]) => {
        const currentIndex = ALL_STAGES.indexOf(currentStage);
        const nextStage = ALL_STAGES[currentIndex + 1];

        // حذف تمام پیام‌های suggestion قبل از رفتن به مرحله بعد
        const cleanedMessages = currentMessages.filter(m => !m.isSuggestion);

        // به‌روزرسانی state برای حذف پیام‌های suggestion
        setMessages(cleanedMessages);

        if (!nextStage) {
            setStage(Stage.COMPLETE);
            await saveProjectToDb(Stage.COMPLETE, currentData, cleanedMessages);
            return;
        }

        setStage(nextStage);

        if (isSummaryStage(nextStage)) {
            setIsReadyForNextSection(true);
             await saveProjectToDb(nextStage, currentData, cleanedMessages);
        } else if (isAutoGeneratedStage(nextStage)) {
            const question = t(getQuestionKeyForStage(nextStage), journeyStateRef.current.locale)
                .replace('{competitor_list}', currentData.marketAnalysis_competitor_list || 'your competitors');

            addMessage({ text: question, sender: 'ai' });
            await handleAutoGeneration(nextStage, currentData, [...cleanedMessages, { id: uuidv4(), text: question, sender: 'ai' }]);
        } else {
             const newAiMessage = { text: t(getQuestionKeyForStage(nextStage), journeyStateRef.current.locale), sender: 'ai' as const, id: uuidv4() };
             const updatedMessages = [...cleanedMessages, newAiMessage];
             setMessages(updatedMessages);
             await saveProjectToDb(nextStage, currentData, updatedMessages);
        }
    };
    
    const handleAutoGeneration = async (autoStage: Stage, currentData: Partial<StartupData>, currentMessages: ChatMessage[]) => {
        setIsLoading(true);
        try {
            const result = await geminiService.generateResponseForStage(autoStage, currentData, locale);
            
            const dataKey = STAGE_TO_DATA_KEY[autoStage];
            let updatedData = { ...currentData };
            if (dataKey) {
                updatedData = { ...updatedData, [dataKey]: result.text };
            }
            setStartupData(updatedData);

            const newAiMessage = { text: result.text, sender: 'ai' as const, id: uuidv4(), sources: result.sources };
            const updatedMessages = [...currentMessages, newAiMessage];
            setMessages(updatedMessages);

            await advanceStage(autoStage, updatedData, updatedMessages);
        } catch (error) {
            console.error("Error during auto-generation:", error);
            addMessage({ text: "Sorry, an error occurred. Please try again.", sender: 'system' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const proceedToNextSection = async () => {
        setIsReadyForNextSection(false);
        setIsLoading(true);
        const { stage: currentStage, startupData: currentData, messages: currentMessages } = journeyStateRef.current;
        
        try {
            const summaryStage = currentStage;
            const summaryKey = STAGE_TO_DATA_KEY[summaryStage];
            
            if (summaryKey) {
                const systemMsg = `${t('system_generating_summary', locale)} ${summaryStage.split('_')[0]}...`;
                addMessage({ text: systemMsg, sender: 'system' });

                const summary = await geminiService.generateSectionSummary(summaryStage, currentData, locale);
                const updatedData = { ...currentData, [summaryKey]: summary };
                setStartupData(updatedData);
                
                const successMsg = `${summaryStage.split('_')[0]} ${t('system_summary_complete', locale)}`;
                addMessage({ text: successMsg, sender: 'system' });
                
                await advanceStage(summaryStage, updatedData, [...currentMessages, {id: uuidv4(), text: systemMsg, sender: 'system'}, {id: uuidv4(), text: successMsg, sender: 'system'}]);
            }

        } catch (error) {
             addMessage({ text: t('system_summary_error', locale), sender: 'system' });
        } finally {
             setIsLoading(false);
        }
    };

    const handleSendMessage = async (messageText: string) => {
        if (isLoading) return;

        setIsLoading(true);
        const userMessage: ChatMessage = { id: uuidv4(), text: messageText, sender: 'user' };
        const currentMessages = [...journeyStateRef.current.messages, userMessage];
        setMessages(currentMessages);
        
        const { stage: currentStage, startupData: currentData } = journeyStateRef.current;
        const dataKey = STAGE_TO_DATA_KEY[currentStage];

        try {
            let updatedData = { ...currentData };

            if (currentStage === Stage.BRANDING_LOGO || currentStage === Stage.BRANDING_VISUAL_STYLE) {
                 const result = await geminiService.generateImageIdeas(currentStage, messageText, currentData, locale);
                 if(dataKey) updatedData = { ...updatedData, [dataKey]: result.jsonData };
                 addMessage({ text: result.text, sender: 'ai', images: result.images });
            } else {
                if (dataKey) {
                    updatedData = { ...currentData, [dataKey]: messageText };
                }
            }

            setStartupData(updatedData);
            await advanceStage(currentStage, updatedData, currentMessages);

        } catch (error) {
            console.error("Error processing message:", error);
            addMessage({ text: "Sorry, an error occurred while processing your message.", sender: 'system' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestSuggestion = async () => {
        // خالی کردن suggestion قبلی قبل از باز کردن modal
        setCurrentSuggestion('');
        setIsLoading(true);
        setSuggestionModalOpen(true);
        try {
            const { stage: currentStage, startupData: currentData } = journeyStateRef.current;
            const suggestion = await geminiService.generateSuggestion(currentStage, currentData, locale);
            setCurrentSuggestion(suggestion);
        } catch(e) {
            console.error(e);
            addMessage({ text: "Sorry, I couldn't generate a suggestion right now.", sender: 'system' });
            setSuggestionModalOpen(false);
            setCurrentSuggestion('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefineSuggestion = async (originalSuggestion: string, instruction: string) => {
        setIsLoading(true);
        try {
            const refinedText = await geminiService.refineText(originalSuggestion, instruction, journeyStateRef.current.startupData, locale);
            setCurrentSuggestion(refinedText);
        } catch (error) {
            console.error("Error refining suggestion:", error);
            addMessage({ text: "Sorry, an error occurred while refining.", sender: 'system' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionModalAccept = async (acceptedAnswer: string) => {
        setSuggestionModalOpen(false);
        setCurrentSuggestion('');
        setIsLoading(true);

        const userMessage: ChatMessage = { id: uuidv4(), text: acceptedAnswer, sender: 'user' };
        const currentMessages = [...journeyStateRef.current.messages, userMessage];
        setMessages(currentMessages);

        const { stage: currentStage, startupData: currentData } = journeyStateRef.current;
        const dataKey = STAGE_TO_DATA_KEY[currentStage];

        try {
            let updatedData = { ...currentData };
            if (dataKey) {
                updatedData = { ...currentData, [dataKey]: acceptedAnswer };
            }

            setStartupData(updatedData);
            await advanceStage(currentStage, updatedData, currentMessages);
        } catch (error) {
            console.error("Error processing accepted suggestion:", error);
            addMessage({ text: "Sorry, an error occurred.", sender: 'system' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionModalClose = () => {
        setSuggestionModalOpen(false);
        setCurrentSuggestion('');
    };

    const editStage = (stageToEdit: Stage) => setEditingStage(stageToEdit);
    const cancelDirectEdit = () => setEditingStage(null);

    const jumpToStage = (selectedStage: Stage) => {
        const currentIndex = ALL_STAGES.indexOf(stage);
        const selectedIndex = ALL_STAGES.indexOf(selectedStage);
        if (selectedIndex < currentIndex) {
            setStage(selectedStage);
            addMessage({ text: t(getQuestionKeyForStage(selectedStage), journeyStateRef.current.locale), sender: 'ai' });
        }
    };
    
    const handleUpdateStageData = async (stageToUpdate: Stage, newValue: string) => {
        setIsLoading(true);
        setEditingStage(null);
        addMessage({text: `${t('system_saving_changes', locale)} ${t(stageToUpdate, locale)}...`, sender: 'system'});
        
        try {
            const dataKey = STAGE_TO_DATA_KEY[stageToUpdate];
            if (dataKey) {
                const updatedData = { ...startupData, [dataKey]: newValue };
                setStartupData(updatedData);
                await saveProjectToDb(stage, updatedData, messages);
                 addMessage({ text: t('system_update_save_success', locale), sender: 'system' });
            }
        } catch (error) {
             console.error("Failed to save stage data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const reloadLocale = () => {
        // A bit of a hack to force a re-render with new locale strings
        setMessages(prev => [...prev]);
    };
    
    const restartJourney = async () => {
        if (!projectId || !startupData.initialIdea) return;
        setIsLoading(true);
        
        const initialData = {
            projectName: startupData.projectName,
            initialIdea: startupData.initialIdea,
        };
        const newStage = Stage.CORE_CONCEPT_IDEA_TITLE;
        // FIX: Add `as const` to sender properties to match the ChatMessage type.
        const startMessage = { id: uuidv4(), text: `${t('system_restarting_project', locale)} ${startupData.initialIdea}`, sender: 'system' as const };
        // FIX: Add `as const` to sender properties to match the ChatMessage type.
        const firstQuestion = { id: uuidv4(), text: t(getQuestionKeyForStage(newStage), locale), sender: 'ai' as const };
        const newMessages = [startMessage, firstQuestion];
        
        setStartupData(initialData);
        setStage(newStage);
        setMessages(newMessages);
        setEditingStage(null);
        setIsReadyForNextSection(false);
        
        await saveProjectToDb(newStage, initialData, newMessages);
        setIsLoading(false);
    };

    const exportProject = () => {
        try {
            const projectData = {
                version: "1.0",
                stage: journeyStateRef.current.stage,
                data: journeyStateRef.current.startupData,
                messages: journeyStateRef.current.messages,
            };
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(projectData, null, 2))}`;
            const link = document.createElement("a");
            link.href = jsonString;
            const projectName = journeyStateRef.current.startupData.projectName || "unnamed-project";
            link.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-export.json`;
            link.click();
        } catch(e) {
            console.error(e);
            alert(t('export_error', locale));
        }
    };
    
    const handleRefineEditedStage = async (stageToRefine: Stage, instruction: string) => {
        setIsLoading(true);
        addMessage({text: `${t('system_refining_edited_stage', locale)} "${t(stageToRefine, locale)}" ${t('system_refine_edited_stage_based_on_command', locale)}`, sender: 'system'});
        try {
            const dataKey = STAGE_TO_DATA_KEY[stageToRefine];
            if (!dataKey) {
                throw new Error(t('system_refine_edited_stage_data_key_error', locale));
            }
            const originalText = startupData[dataKey] as string || '';
            const refinedText = await geminiService.refineText(originalText, instruction, startupData, locale);

            const updatedData = { ...startupData, [dataKey]: refinedText };
            setStartupData(updatedData);
            await saveProjectToDb(stage, updatedData, messages);
            
            addMessage({ text: t('system_refine_edited_stage_success', locale), sender: 'system' });
        } catch (error) {
            console.error("Error refining edited stage:", error);
            addMessage({ text: t('system_refine_edited_stage_error', locale), sender: 'system' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSummary = async (section: MajorSection) => {
        // This is a placeholder for potential manual summary regeneration
        console.log("Generating summary for", section);
    };

    return {
        isInitialized,
        isLoading,
        isComplete: stage === Stage.COMPLETE,
        stage,
        stages: ALL_STAGES,
        startupData,
        messages,
        progress: (ALL_STAGES.indexOf(stage) / (ALL_STAGES.length - 1)) * 100,
        editingStage,
        isReadyForNextSection,
        suggestionModalOpen,
        currentSuggestion,

        handleSendMessage,
        handleRequestSuggestion,
        handleRefineSuggestion,
        handleSuggestionModalAccept,
        handleSuggestionModalClose,
        proceedToNextSection,
        editStage,
        jumpToStage,
        cancelDirectEdit,
        handleUpdateStageData,
        reloadLocale,
        restartJourney,
        exportProject,
        handleRefineEditedStage,
        handleGenerateSummary
    };
};