import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabaseClient';
import * as geminiService from '../services/geminiService';
import { ChatMessage, Stage, StartupData, Locale, MajorSection } from '../types';
import { t } from '../i18n';
import { getStageById } from '../config/stages';

// All stages from all 8 phases
const ALL_STAGES: Stage[] = [
    Stage.INITIAL,
    // Phase 1: Core Concept & Validation
    Stage.IDEA_TITLE,
    Stage.ELEVATOR_PITCH,
    Stage.EXECUTIVE_SUMMARY,
    Stage.PROBLEM_DESCRIPTION,
    Stage.PROBLEM_MAGNITUDE,
    Stage.CURRENT_SOLUTIONS,
    Stage.CUSTOMER_SEGMENTS,
    Stage.EARLY_ADOPTER_PERSONA,
    Stage.PRODUCT_DESCRIPTION,
    Stage.HOW_IT_WORKS,
    Stage.UVP_STATEMENT,
    Stage.UNFAIR_ADVANTAGE,
    Stage.VALIDATION_SUMMARY,
    Stage.BUSINESS_GOALS_TIMELINE,
    // Phase 2: Market, Competition & Risk Analysis
    Stage.PESTEL_ANALYSIS,
    Stage.TAM_ANALYSIS,
    Stage.SAM_ANALYSIS,
    Stage.SOM_ANALYSIS,
    Stage.COMPETITOR_IDENTIFICATION,
    Stage.COMPETITOR_ANALYSIS,
    Stage.SWOT_ANALYSIS,
    Stage.RISK_ANALYSIS,
    // Phase 3: Business Modeling
    Stage.BMC_CUSTOMER_SEGMENTS,
    Stage.BMC_VALUE_PROPOSITIONS,
    Stage.BMC_CHANNELS,
    Stage.BMC_CUSTOMER_RELATIONSHIPS,
    Stage.BMC_REVENUE_STREAMS,
    Stage.BMC_KEY_RESOURCES,
    Stage.BMC_KEY_ACTIVITIES,
    Stage.BMC_KEY_PARTNERSHIPS,
    Stage.BMC_COST_STRUCTURE,
    // Phase 4: Branding & Identity
    Stage.BRAND_VISION,
    Stage.BRAND_MISSION,
    Stage.CORE_VALUES,
    Stage.BRAND_PERSONALITY,
    Stage.BRAND_NAME,
    Stage.TAGLINE,
    Stage.TONE_OF_VOICE,
    Stage.LOGO_DESIGN_CONCEPTS,
    Stage.COLOR_PALETTE,
    Stage.TYPOGRAPHY,
    // Phase 5: Product Development
    Stage.FULL_PRODUCT_DESCRIPTION,
    Stage.FEATURE_PRIORITIZATION,
    Stage.PRODUCT_ROADMAP,
    Stage.MVP_SCOPE,
    Stage.MVP_USER_FLOW,
    Stage.TECH_STACK,
    Stage.QA_PLAN,
    // Phase 6: Marketing & Sales Strategy
    Stage.MARKETING_OBJECTIVES,
    Stage.KPIS,
    Stage.CONTENT_MARKETING,
    Stage.SOCIAL_MEDIA_MARKETING,
    Stage.PAID_ADVERTISING,
    Stage.SALES_PROCESS,
    Stage.PRICING_STRATEGY,
    Stage.LAUNCH_CAMPAIGN,
    // Phase 7: Organization, Operations & Financials
    Stage.FOUNDING_TEAM,
    Stage.HIRING_PLAN,
    Stage.LEGAL_STRUCTURE,
    Stage.IP_STRATEGY,
    Stage.KEY_MILESTONES,
    Stage.STARTUP_COSTS,
    Stage.BURN_RATE,
    Stage.REVENUE_FORECAST,
    // Phase 8: Final Outputs & Fundraising
    Stage.FUNDRAISING_ASK,
    Stage.USE_OF_FUNDS,
    Stage.PITCH_DECK_OUTLINE,
    Stage.ONE_PAGER,
    Stage.EXIT_STRATEGY,
    Stage.COMPLETE
];

export const STAGE_TO_DATA_KEY: Record<Stage, keyof StartupData | null> = {
    [Stage.INITIAL]: null,

    // ========================================
    // Phase 1: Core Concept & Validation
    // ========================================
    [Stage.IDEA_TITLE]: 'idea_title',
    [Stage.ELEVATOR_PITCH]: 'elevator_pitch',
    [Stage.EXECUTIVE_SUMMARY]: 'executive_summary',
    [Stage.PROBLEM_DESCRIPTION]: 'problem_description',
    [Stage.PROBLEM_MAGNITUDE]: 'problem_magnitude',
    [Stage.CURRENT_SOLUTIONS]: 'current_solutions',
    [Stage.CUSTOMER_SEGMENTS]: 'customer_segments',
    [Stage.EARLY_ADOPTER_PERSONA]: 'early_adopter_persona',
    [Stage.PRODUCT_DESCRIPTION]: 'product_description',
    [Stage.HOW_IT_WORKS]: 'how_it_works',
    [Stage.UVP_STATEMENT]: 'uvp_statement',
    [Stage.UNFAIR_ADVANTAGE]: 'unfair_advantage',
    [Stage.VALIDATION_SUMMARY]: 'validation_summary',
    [Stage.BUSINESS_GOALS_TIMELINE]: 'business_goals_timeline',

    // ========================================
    // Phase 2: Market, Competition & Risk Analysis
    // ========================================
    [Stage.PESTEL_ANALYSIS]: 'pestel_analysis',
    [Stage.TAM_ANALYSIS]: 'tam_analysis',
    [Stage.SAM_ANALYSIS]: 'sam_analysis',
    [Stage.SOM_ANALYSIS]: 'som_analysis',
    [Stage.COMPETITOR_IDENTIFICATION]: 'competitor_identification',
    [Stage.COMPETITOR_ANALYSIS]: 'competitor_analysis',
    [Stage.SWOT_ANALYSIS]: 'swot_analysis',
    [Stage.RISK_ANALYSIS]: 'risk_analysis',

    // ========================================
    // Phase 3: Business Modeling
    // ========================================
    [Stage.BMC_CUSTOMER_SEGMENTS]: 'bmc_customer_segments',
    [Stage.BMC_VALUE_PROPOSITIONS]: 'bmc_value_propositions',
    [Stage.BMC_CHANNELS]: 'bmc_channels',
    [Stage.BMC_CUSTOMER_RELATIONSHIPS]: 'bmc_customer_relationships',
    [Stage.BMC_REVENUE_STREAMS]: 'bmc_revenue_streams',
    [Stage.BMC_KEY_RESOURCES]: 'bmc_key_resources',
    [Stage.BMC_KEY_ACTIVITIES]: 'bmc_key_activities',
    [Stage.BMC_KEY_PARTNERSHIPS]: 'bmc_key_partnerships',
    [Stage.BMC_COST_STRUCTURE]: 'bmc_cost_structure',

    // ========================================
    // Phase 4: Branding & Identity
    // ========================================
    [Stage.BRAND_VISION]: 'brand_vision',
    [Stage.BRAND_MISSION]: 'brand_mission',
    [Stage.CORE_VALUES]: 'core_values',
    [Stage.BRAND_PERSONALITY]: 'brand_personality',
    [Stage.BRAND_NAME]: 'brand_name',
    [Stage.TAGLINE]: 'tagline',
    [Stage.TONE_OF_VOICE]: 'tone_of_voice',
    [Stage.LOGO_DESIGN_CONCEPTS]: 'logo_design_concepts',
    [Stage.COLOR_PALETTE]: 'color_palette',
    [Stage.TYPOGRAPHY]: 'typography',

    // ========================================
    // Phase 5: Product Development
    // ========================================
    [Stage.FULL_PRODUCT_DESCRIPTION]: 'full_product_description',
    [Stage.FEATURE_PRIORITIZATION]: 'feature_prioritization',
    [Stage.PRODUCT_ROADMAP]: 'product_roadmap',
    [Stage.MVP_SCOPE]: 'mvp_scope',
    [Stage.MVP_USER_FLOW]: 'mvp_user_flow',
    [Stage.TECH_STACK]: 'tech_stack',
    [Stage.QA_PLAN]: 'qa_plan',

    // ========================================
    // Phase 6: Marketing & Sales Strategy
    // ========================================
    [Stage.MARKETING_OBJECTIVES]: 'marketing_objectives',
    [Stage.KPIS]: 'kpis',
    [Stage.CONTENT_MARKETING]: 'content_marketing',
    [Stage.SOCIAL_MEDIA_MARKETING]: 'social_media_marketing',
    [Stage.PAID_ADVERTISING]: 'paid_advertising',
    [Stage.SALES_PROCESS]: 'sales_process',
    [Stage.PRICING_STRATEGY]: 'pricing_strategy',
    [Stage.LAUNCH_CAMPAIGN]: 'launch_campaign',

    // ========================================
    // Phase 7: Organization, Operations & Financials
    // ========================================
    [Stage.FOUNDING_TEAM]: 'founding_team',
    [Stage.HIRING_PLAN]: 'hiring_plan',
    [Stage.LEGAL_STRUCTURE]: 'legal_structure',
    [Stage.IP_STRATEGY]: 'ip_strategy',
    [Stage.KEY_MILESTONES]: 'key_milestones',
    [Stage.STARTUP_COSTS]: 'startup_costs',
    [Stage.BURN_RATE]: 'burn_rate',
    [Stage.REVENUE_FORECAST]: 'revenue_forecast',

    // ========================================
    // Phase 8: Final Outputs & Fundraising
    // ========================================
    [Stage.FUNDRAISING_ASK]: 'fundraising_ask',
    [Stage.USE_OF_FUNDS]: 'use_of_funds',
    [Stage.PITCH_DECK_OUTLINE]: 'pitch_deck_outline',
    [Stage.ONE_PAGER]: 'one_pager',
    [Stage.EXIT_STRATEGY]: 'exit_strategy',

    [Stage.COMPLETE]: null,
};

// Get question and guidance from config if available, otherwise fall back to i18n
const getQuestionForStage = (stage: Stage, locale: Locale): string => {
    const stageConfig = getStageById(stage);
    if (stageConfig) {
        return locale === 'fa' ? stageConfig.question_fa : stageConfig.question_en;
    }
    // Fallback to old i18n system
    return t(`question_${stage}`, locale);
};

const getGuidanceForStage = (stage: Stage, locale: Locale): string | null => {
    const stageConfig = getStageById(stage);
    if (stageConfig) {
        return locale === 'fa' ? (stageConfig.guidance_fa || null) : (stageConfig.guidance_en || null);
    }
    return null;
};

const isSummaryStage = (stage: Stage) => stage.endsWith('_SUMMARY') || stage === Stage.COMPLETE;
const isAutoGeneratedStage = (stage: Stage) => {
    const autoGeneratedStages = [
        // These stages were auto-generated in the old system
        // Now most stages require user input based on the new phase configs
        Stage.BMC_VALUE_PROPOSITIONS,
        Stage.BMC_KEY_ACTIVITIES,
        Stage.BMC_KEY_RESOURCES,
        Stage.BMC_COST_STRUCTURE,
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
                     // Show guidance if available
                     const guidance = getGuidanceForStage(data.stage, journeyStateRef.current.locale);
                     if (guidance) {
                         addMessage({ text: guidance, sender: 'ai' });
                     }
                     addMessage({ text: getQuestionForStage(data.stage, journeyStateRef.current.locale), sender: 'ai' });
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
            await saveProjectToDb(nextStage, currentData, cleanedMessages);
            // Auto-proceed to next section after a brief delay
            setTimeout(() => {
                proceedToNextSection();
            }, 1500); // 1.5 second delay
        } else if (isAutoGeneratedStage(nextStage)) {
            const question = getQuestionForStage(nextStage, journeyStateRef.current.locale)
                .replace('{competitor_list}', currentData.marketAnalysis_competitor_list || 'your competitors');

            addMessage({ text: question, sender: 'ai' });
            await handleAutoGeneration(nextStage, currentData, [...cleanedMessages, { id: uuidv4(), text: question, sender: 'ai' }]);
        } else {
            // Show guidance if available for user input stages
            let messagesWithGuidance = cleanedMessages;
            const guidance = getGuidanceForStage(nextStage, journeyStateRef.current.locale);
            if (guidance) {
                const guidanceMessage = { text: guidance, sender: 'ai' as const, id: uuidv4() };
                addMessage(guidanceMessage);
                messagesWithGuidance = [...messagesWithGuidance, guidanceMessage];
            }
            const newAiMessage = { text: getQuestionForStage(nextStage, journeyStateRef.current.locale), sender: 'ai' as const, id: uuidv4() };
            const updatedMessages = [...messagesWithGuidance, newAiMessage];
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

            // No special image generation stages in the new system
            // All stages now use standard text input
            if (dataKey) {
                updatedData = { ...currentData, [dataKey]: messageText };
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
            const { stage: currentStage, startupData: currentData, messages } = journeyStateRef.current;

            // Get last user message as userInput for context
            const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
            const userInput = lastUserMessage?.text || '';

            const suggestion = await geminiService.generateSuggestion(currentStage, currentData, locale, userInput);
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
            // Show guidance if available
            const guidance = getGuidanceForStage(selectedStage, journeyStateRef.current.locale);
            if (guidance) {
                addMessage({ text: guidance, sender: 'ai' });
            }
            addMessage({ text: getQuestionForStage(selectedStage, journeyStateRef.current.locale), sender: 'ai' });
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
        const newStage = Stage.IDEA_TITLE;
        // FIX: Add `as const` to sender properties to match the ChatMessage type.
        const startMessage = { id: uuidv4(), text: `${t('system_restarting_project', locale)} ${startupData.initialIdea}`, sender: 'system' as const };

        // Show guidance if available
        const newMessages: ChatMessage[] = [startMessage];
        const guidance = getGuidanceForStage(newStage, locale);
        if (guidance) {
            newMessages.push({ id: uuidv4(), text: guidance, sender: 'ai' as const });
        }

        // FIX: Add `as const` to sender properties to match the ChatMessage type.
        const firstQuestion = { id: uuidv4(), text: getQuestionForStage(newStage, locale), sender: 'ai' as const };
        newMessages.push(firstQuestion);
        
        setStartupData(initialData);
        setStage(newStage);
        setMessages(newMessages);
        setEditingStage(null);
        setIsReadyForNextSection(false);
        
        await saveProjectToDb(newStage, initialData, newMessages);
        setIsLoading(false);
    };

    const exportProject = (format?: 'json' | 'pdf' | 'word' | 'csv' | 'excel') => {
        try {
            const projectData = {
                version: "1.0",
                stage: journeyStateRef.current.stage,
                data: journeyStateRef.current.startupData,
                messages: journeyStateRef.current.messages,
            };

            const projectName = journeyStateRef.current.startupData.projectName || "unnamed-project";
            const safeProjectName = projectName.toLowerCase().replace(/\s+/g, '-');

            if (format === 'pdf') {
                // For PDF export, we'll create a simple HTML that can be printed as PDF
                const htmlContent = generatePDFContent(projectData);
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${safeProjectName}-export.html`;
                link.click();
                URL.revokeObjectURL(url);
            } else if (format === 'word') {
                // For Word export, create a simple HTML document
                const htmlContent = generateWordContent(projectData);
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${safeProjectName}-export.html`;
                link.click();
                URL.revokeObjectURL(url);
            } else if (format === 'csv') {
                // For CSV export, create a CSV with project data
                const csvContent = generateCSVContent(projectData);
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${safeProjectName}-export.csv`;
                link.click();
                URL.revokeObjectURL(url);
            } else if (format === 'excel') {
                // For Excel export, create a CSV format that Excel can open
                const csvContent = generateExcelContent(projectData);
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${safeProjectName}-export.csv`;
                link.click();
                URL.revokeObjectURL(url);
            } else {
                // Default JSON export
                const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(projectData, null, 2))}`;
                const link = document.createElement("a");
                link.href = jsonString;
                link.download = `${safeProjectName}-export.json`;
                link.click();
            }
        } catch(e) {
            console.error(e);
            alert(t('export_error', locale));
        }
    };

    const generatePDFContent = (data: any) => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${data.data.projectName || 'Startup Project'} - Export</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1, h2, h3 { color: #333; }
                .section { margin-bottom: 30px; }
                .field { margin-bottom: 15px; }
                .field-label { font-weight: bold; color: #666; }
                .field-value { margin-top: 5px; }
            </style>
        </head>
        <body>
            <h1>${data.data.projectName || 'Startup Project'}</h1>
            <p><strong>Stage:</strong> ${data.stage}</p>
            <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>

            ${Object.entries(data.data).map(([key, value]) => `
                <div class="section">
                    <h2>${key.replace(/_/g, ' ').toUpperCase()}</h2>
                    <div class="field-value">${value || 'Not completed'}</div>
                </div>
            `).join('')}
        </body>
        </html>`;
    };

    const generateWordContent = (data: any) => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${data.data.projectName || 'Startup Project'} - Word Export</title>
            <style>
                body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.6; }
                h1, h2, h3 { color: #000; }
                .section { margin-bottom: 30px; page-break-inside: avoid; }
                .field { margin-bottom: 15px; }
                .field-label { font-weight: bold; color: #333; }
                .field-value { margin-top: 5px; text-align: justify; }
            </style>
        </head>
        <body>
            <h1>${data.data.projectName || 'Startup Project'}</h1>
            <p><strong>Stage:</strong> ${data.stage}</p>
            <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>

            ${Object.entries(data.data).map(([key, value]) => `
                <div class="section">
                    <h2>${key.replace(/_/g, ' ').toUpperCase()}</h2>
                    <div class="field-value">${value || 'Not completed'}</div>
                </div>
            `).join('')}
        </body>
        </html>`;
    };

    const generateCSVContent = (data: any) => {
        const rows = [
            ['Field', 'Value'],
            ['Project Name', data.data.projectName || ''],
            ['Stage', data.stage],
            ['Export Date', new Date().toLocaleDateString()],
            ...Object.entries(data.data).map(([key, value]) => [key.replace(/_/g, ' '), value || ''])
        ];
        return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    };

    const generateExcelContent = (data: any) => {
        // Create a more structured format for Excel
        const sections = [
            ['Project Information'],
            ['Field', 'Value'],
            ['Project Name', data.data.projectName || ''],
            ['Stage', data.stage],
            ['Export Date', new Date().toLocaleDateString()],
            [''],
            ['Project Data'],
            ['Section', 'Content'],
            ...Object.entries(data.data).map(([key, value]) => [key.replace(/_/g, ' '), value || ''])
        ];
        return sections.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
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

    // Find the first uncompleted stage
    const getFirstUncompletedStage = useCallback((): Stage | null => {
        if (stage === Stage.COMPLETE) return null;

        const currentStageIndex = ALL_STAGES.indexOf(stage);
        const stagesToCheck = ALL_STAGES.slice(0, currentStageIndex + 1);

        for (const stageToCheck of stagesToCheck) {
            const dataKey = STAGE_TO_DATA_KEY[stageToCheck];
            if (dataKey && !startupData[dataKey]) {
                return stageToCheck;
            }
        }

        return null;
    }, [stage, startupData]);

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
        handleGenerateSummary,
        getFirstUncompletedStage
    };
};
