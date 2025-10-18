import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Stage, StartupData, Locale, MajorSection } from '../types';
import { t } from '../i18n';

// Import our new modular hooks
import { useProjectManager } from './useProjectManager';
import { useStageManager, ALL_STAGES, STAGE_TO_DATA_KEY, getQuestionForStage, getGuidanceForStage } from './useStageManager';
import { useChatManager } from './useChatManager';
import { useExportManager } from './useExportManager';

/**
 * useStartupJourney Hook - REFACTORED
 *
 * Main orchestrator hook that combines:
 * - useProjectManager: Project CRUD operations
 * - useStageManager: Stage navigation and progression
 * - useChatManager: Chat and messaging
 * - useExportManager: Export functionality
 *
 * This hook now follows Single Responsibility Principle by delegating
 * specific concerns to specialized hooks.
 *
 * Previous version: 831 lines
 * Current version: ~350 lines (58% reduction)
 */

export const useStartupJourney = (projectId: string | null, locale: Locale) => {
    // ============================================
    // Local State
    // ============================================
    const [isInitialized, setIsInitialized] = useState(false);
    const [startupData, setStartupData] = useState<Partial<StartupData>>({});
    const [editingStage, setEditingStage] = useState<Stage | null>(null);
    const [isReadyForNextSection, setIsReadyForNextSection] = useState(false);

    // ============================================
    // Initialize Modular Hooks
    // ============================================
    const projectManager = useProjectManager({ projectId });
    const chatManager = useChatManager({ locale });
    const exportManager = useExportManager({ locale });

    // StageManager needs callbacks, so we'll set it up after defining them
    const stageManagerCallbacks = {
        onSaveProject: projectManager.saveProject,
        onAddMessage: chatManager.addMessage,
    };

    const stageManager = useStageManager({
        locale,
        ...stageManagerCallbacks,
    });

    // Ref to track current state for callbacks
    const journeyStateRef = useRef({
        stage: stageManager.stage,
        startupData,
        messages: chatManager.messages,
        locale,
    });

    useEffect(() => {
        journeyStateRef.current = {
            stage: stageManager.stage,
            startupData,
            messages: chatManager.messages,
            locale,
        };
    }, [stageManager.stage, startupData, chatManager.messages, locale]);

    // ============================================
    // Project Loading
    // ============================================
    const loadProject = useCallback(async () => {
        const projectData = await projectManager.loadProject();

        if (projectData) {
            stageManager.setStage(projectData.stage);
            setStartupData(projectData.startupData);
            chatManager.setMessages(projectData.messages);

            // If no messages, show initial messages
            if (!projectData.messages || projectData.messages.length === 0) {
                chatManager.addMessage({
                    text: `${t('system_start_journey', locale)} "${projectData.startupData.projectName}"`,
                    sender: 'system',
                });

                // Show guidance if available
                const guidance = getGuidanceForStage(projectData.stage, locale);
                if (guidance) {
                    chatManager.addMessage({ text: guidance, sender: 'ai' });
                }

                chatManager.addMessage({
                    text: getQuestionForStage(projectData.stage, locale),
                    sender: 'ai',
                });
            }
        }

        setIsInitialized(true);
    }, [projectId, locale]);

    // Load project when projectId changes
    useEffect(() => {
        if (projectId) {
            // Reset all state when projectId changes
            setIsInitialized(false);
            stageManager.setStage(Stage.INITIAL);
            setStartupData({});
            chatManager.setMessages([]);
            setEditingStage(null);
            setIsReadyForNextSection(false);
            chatManager.closeSuggestionModal();

            // Then load the new project
            loadProject();
        }
    }, [projectId, loadProject]);

    // ============================================
    // Message Handling
    // ============================================
    const handleSendMessage = async (messageText: string) => {
        if (isLoading) return;

        const userMessage: ChatMessage = {
            id: uuidv4(),
            text: messageText,
            sender: 'user',
        };

        chatManager.addMessage(userMessage);
        const currentMessages = [...journeyStateRef.current.messages, userMessage];

        const { stage: currentStage, startupData: currentData } = journeyStateRef.current;
        const dataKey = STAGE_TO_DATA_KEY[currentStage];

        try {
            let updatedData = { ...currentData };

            if (dataKey) {
                updatedData = { ...currentData, [dataKey]: messageText };
            }

            setStartupData(updatedData);
            await stageManager.advanceStage(currentStage, updatedData, currentMessages);
        } catch (error) {
            console.error('[useStartupJourney] Error processing message:', error);
            chatManager.addMessage({
                text: 'Sorry, an error occurred while processing your message.',
                sender: 'system',
            });
        }
    };

    // ============================================
    // Suggestion Handling
    // ============================================
    const handleRequestSuggestion = async () => {
        const { stage: currentStage, startupData: currentData, messages } = journeyStateRef.current;
        await chatManager.requestSuggestion(currentStage, currentData, messages);
    };

    const handleRefineSuggestion = async (originalSuggestion: string, instruction: string) => {
        const { startupData: currentData } = journeyStateRef.current;
        await chatManager.refineSuggestion(originalSuggestion, instruction, currentData);
    };

    const handleSuggestionModalAccept = async (acceptedAnswer: string) => {
        chatManager.acceptSuggestion(acceptedAnswer);

        const userMessage: ChatMessage = {
            id: uuidv4(),
            text: acceptedAnswer,
            sender: 'user',
        };

        chatManager.addMessage(userMessage);
        const currentMessages = [...journeyStateRef.current.messages, userMessage];

        const { stage: currentStage, startupData: currentData } = journeyStateRef.current;
        const dataKey = STAGE_TO_DATA_KEY[currentStage];

        try {
            let updatedData = { ...currentData };
            if (dataKey) {
                updatedData = { ...currentData, [dataKey]: acceptedAnswer };
            }

            setStartupData(updatedData);
            await stageManager.advanceStage(currentStage, updatedData, currentMessages);
        } catch (error) {
            console.error('[useStartupJourney] Error processing accepted suggestion:', error);
            chatManager.addMessage({
                text: 'Sorry, an error occurred.',
                sender: 'system',
            });
        }
    };

    // ============================================
    // Stage Navigation
    // ============================================
    const jumpToStage = (selectedStage: Stage) => {
        stageManager.jumpToStage(selectedStage, stageManager.stage);
    };

    const editStage = (stageToEdit: Stage) => setEditingStage(stageToEdit);
    const cancelDirectEdit = () => setEditingStage(null);

    const handleUpdateStageData = async (stageToUpdate: Stage, newValue: string) => {
        setEditingStage(null);
        chatManager.addMessage({
            text: `${t('system_saving_changes', locale)} ${t(stageToUpdate, locale)}...`,
            sender: 'system',
        });

        try {
            const dataKey = STAGE_TO_DATA_KEY[stageToUpdate];
            if (dataKey) {
                const updatedData = { ...startupData, [dataKey]: newValue };
                setStartupData(updatedData);
                await projectManager.saveProject(stageManager.stage, updatedData, chatManager.messages);
                chatManager.addMessage({
                    text: t('system_update_save_success', locale),
                    sender: 'system',
                });
            }
        } catch (error) {
            console.error('[useStartupJourney] Failed to save stage data:', error);
        }
    };

    const handleRefineEditedStage = async (stageToRefine: Stage, instruction: string) => {
        try {
            const dataKey = STAGE_TO_DATA_KEY[stageToRefine];
            if (!dataKey) {
                throw new Error(t('system_refine_edited_stage_data_key_error', locale));
            }

            const refinedText = await chatManager.refineEditedStage(
                stageToRefine,
                instruction,
                startupData,
                dataKey
            );

            const updatedData = { ...startupData, [dataKey]: refinedText };
            setStartupData(updatedData);
            await projectManager.saveProject(stageManager.stage, updatedData, chatManager.messages);
        } catch (error) {
            console.error('[useStartupJourney] Error refining edited stage:', error);
        }
    };

    // ============================================
    // Section Progression
    // ============================================
    const proceedToNextSection = async () => {
        setIsReadyForNextSection(false);
        const { stage: currentStage, startupData: currentData, messages: currentMessages } = journeyStateRef.current;

        try {
            const summaryStage = currentStage;
            const summaryKey = STAGE_TO_DATA_KEY[summaryStage];

            if (summaryKey) {
                const systemMsg = `${t('system_generating_summary', locale)} ${summaryStage.split('_')[0]}...`;
                chatManager.addMessage({ text: systemMsg, sender: 'system' });

                const summary = await stageManager.generateSectionSummary(summaryStage, currentData);
                const updatedData = { ...currentData, [summaryKey]: summary };
                setStartupData(updatedData);

                const successMsg = `${summaryStage.split('_')[0]} ${t('system_summary_complete', locale)}`;
                chatManager.addMessage({ text: successMsg, sender: 'system' });

                await stageManager.advanceStage(summaryStage, updatedData, [
                    ...currentMessages,
                    { id: uuidv4(), text: systemMsg, sender: 'system' },
                    { id: uuidv4(), text: successMsg, sender: 'system' },
                ]);
            }
        } catch (error) {
            chatManager.addMessage({
                text: t('system_summary_error', locale),
                sender: 'system',
            });
        }
    };

    // ============================================
    // Project Actions
    // ============================================
    const restartJourney = async () => {
        if (!projectId || !startupData.initialIdea) return;

        const newStage = Stage.IDEA_TITLE;
        const startMessage: ChatMessage = {
            id: uuidv4(),
            text: `${t('system_restarting_project', locale)} ${startupData.initialIdea}`,
            sender: 'system',
        };

        // Show guidance if available
        const newMessages: ChatMessage[] = [startMessage];
        const guidance = getGuidanceForStage(newStage, locale);
        if (guidance) {
            newMessages.push({ id: uuidv4(), text: guidance, sender: 'ai' });
        }

        const firstQuestion: ChatMessage = {
            id: uuidv4(),
            text: getQuestionForStage(newStage, locale),
            sender: 'ai',
        };
        newMessages.push(firstQuestion);

        await projectManager.restartProject(
            startupData.initialIdea,
            startupData.projectName || '',
            newStage,
            newMessages
        );

        setStartupData({
            projectName: startupData.projectName,
            initialIdea: startupData.initialIdea,
        });
        stageManager.setStage(newStage);
        chatManager.setMessages(newMessages);
        setEditingStage(null);
        setIsReadyForNextSection(false);
    };

    const reloadLocale = () => {
        // Force re-render with new locale strings
        chatManager.setMessages([...chatManager.messages]);
    };

    const handleGenerateSummary = async (section: MajorSection) => {
        // Placeholder for potential manual summary regeneration
        console.log('[useStartupJourney] Generating summary for', section);
    };

    // ============================================
    // Export
    // ============================================
    const exportProject = (format?: 'json' | 'pdf' | 'word' | 'csv' | 'excel') => {
        exportManager.exportProject(
            stageManager.stage,
            startupData,
            chatManager.messages,
            format
        );
    };

    // ============================================
    // Combined Loading State
    // ============================================
    const isLoading =
        projectManager.isLoading ||
        stageManager.isLoading ||
        chatManager.isLoading;

    // ============================================
    // Return API
    // ============================================
    return {
        isInitialized,
        isLoading,
        isComplete: stageManager.stage === Stage.COMPLETE,
        stage: stageManager.stage,
        stages: ALL_STAGES,
        startupData,
        messages: chatManager.messages,
        progress: stageManager.calculateProgress(stageManager.stage),
        editingStage,
        isReadyForNextSection,
        suggestionModalOpen: chatManager.suggestionModalOpen,
        currentSuggestion: chatManager.currentSuggestion,

        handleSendMessage,
        handleRequestSuggestion,
        handleRefineSuggestion,
        handleSuggestionModalAccept,
        handleSuggestionModalClose: chatManager.closeSuggestionModal,
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
        getFirstUncompletedStage: () =>
            stageManager.getFirstUncompletedStage(stageManager.stage, startupData),
    };
};

// Re-export types and utilities for convenience
export { ALL_STAGES, STAGE_TO_DATA_KEY };
