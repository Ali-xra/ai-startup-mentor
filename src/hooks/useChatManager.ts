import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import i18n from '../i18n/config';
import * as geminiService from '../services/geminiService';
import { ChatMessage, Stage, StartupData, Locale } from '../types';

/**
 * useChatManager Hook
 *
 * Handles all chat and messaging functionality:
 * - Managing chat messages
 * - Sending user messages
 * - Requesting AI suggestions
 * - Refining suggestions
 * - Handling suggestion modal
 * - Refining edited stage content
 *
 * Extracted from useStartupJourney to follow Single Responsibility Principle
 */

interface UseChatManagerProps {
  locale: Locale;
}

interface UseChatManagerReturn {
  isLoading: boolean;
  messages: ChatMessage[];
  suggestionModalOpen: boolean;
  currentSuggestion: string;
  addMessage: (message: Omit<ChatMessage, 'id'>) => void;
  setMessages: (messages: ChatMessage[]) => void;
  requestSuggestion: (
    currentStage: Stage,
    currentData: Partial<StartupData>,
    currentMessages: ChatMessage[]
  ) => Promise<void>;
  refineSuggestion: (
    originalSuggestion: string,
    instruction: string,
    currentData: Partial<StartupData>
  ) => Promise<void>;
  acceptSuggestion: (acceptedText: string) => string;
  closeSuggestionModal: () => void;
  refineEditedStage: (
    stageToRefine: Stage,
    instruction: string,
    currentData: Partial<StartupData>,
    dataKey: keyof StartupData
  ) => Promise<string>;
}

export const useChatManager = ({ locale }: UseChatManagerProps): UseChatManagerReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState('');

  /**
   * Add a new message to the chat
   */
  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: uuidv4(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  /**
   * Request AI suggestion for current stage
   */
  const requestSuggestion = async (
    currentStage: Stage,
    currentData: Partial<StartupData>,
    currentMessages: ChatMessage[]
  ) => {
    // Clear previous suggestion before opening modal
    setCurrentSuggestion('');
    setIsLoading(true);
    setSuggestionModalOpen(true);

    try {
      // Get last user message as userInput for context
      const lastUserMessage = currentMessages.filter((m) => m.sender === 'user').pop();
      const userInput = lastUserMessage?.text || '';

      const suggestion = await geminiService.generateSuggestion(
        currentStage,
        currentData,
        locale,
        userInput
      );
      setCurrentSuggestion(suggestion);

      console.log('[useChatManager] Suggestion generated successfully');
    } catch (error) {
      console.error('[useChatManager] Error generating suggestion:', error);
      addMessage({
        text: "Sorry, I couldn't generate a suggestion right now.",
        sender: 'system',
      });
      setSuggestionModalOpen(false);
      setCurrentSuggestion('');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refine an existing suggestion based on user instruction
   */
  const refineSuggestion = async (
    originalSuggestion: string,
    instruction: string,
    currentData: Partial<StartupData>
  ) => {
    setIsLoading(true);
    try {
      const refinedText = await geminiService.refineText(
        originalSuggestion,
        instruction,
        currentData,
        locale
      );
      setCurrentSuggestion(refinedText);

      console.log('[useChatManager] Suggestion refined successfully');
    } catch (error) {
      console.error('[useChatManager] Error refining suggestion:', error);
      addMessage({
        text: 'Sorry, an error occurred while refining.',
        sender: 'system',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Accept the current suggestion
   * Returns the accepted text for the parent to handle
   */
  const acceptSuggestion = (acceptedText: string): string => {
    setSuggestionModalOpen(false);
    setCurrentSuggestion('');

    console.log('[useChatManager] Suggestion accepted');
    return acceptedText;
  };

  /**
   * Close the suggestion modal without accepting
   */
  const closeSuggestionModal = () => {
    setSuggestionModalOpen(false);
    setCurrentSuggestion('');

    console.log('[useChatManager] Suggestion modal closed');
  };

  /**
   * Refine an edited stage based on user instruction
   */
  const refineEditedStage = async (
    stageToRefine: Stage,
    instruction: string,
    currentData: Partial<StartupData>,
    dataKey: keyof StartupData
  ): Promise<string> => {
    setIsLoading(true);
    addMessage({
      text: `${i18n.t('system_refining_edited_stage')} "${i18n.t(stageToRefine)}" ${i18n.t('system_refine_edited_stage_based_on_command')}`,
      sender: 'system',
    });

    try {
      const originalText = (currentData[dataKey] as string) || '';
      const refinedText = await geminiService.refineText(
        originalText,
        instruction,
        currentData,
        locale
      );

      addMessage({
        text: i18n.t('system_refine_edited_stage_success'),
        sender: 'system',
      });

      console.log('[useChatManager] Edited stage refined successfully:', stageToRefine);
      return refinedText;
    } catch (error) {
      console.error('[useChatManager] Error refining edited stage:', error);
      addMessage({
        text: i18n.t('system_refine_edited_stage_error'),
        sender: 'system',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    messages,
    suggestionModalOpen,
    currentSuggestion,
    addMessage,
    setMessages,
    requestSuggestion,
    refineSuggestion,
    acceptSuggestion,
    closeSuggestionModal,
    refineEditedStage,
  };
};

export default useChatManager;
