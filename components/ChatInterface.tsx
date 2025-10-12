import React, { useState, useEffect } from 'react';
import { ChatMessage, Stage, StartupData } from '../types';
import { Loader } from './Loader';
import { SuggestionModal } from './SuggestionModal';
import { STAGE_TO_DATA_KEY } from '../hooks/useStartupJourney';
import { Locale, t } from '../i18n';
import { getStageById } from '../config/stages';

// Simple Chat Input Component
interface SimpleChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  suggestionModalOpen: boolean;
  locale: Locale;
}

const SimpleChatInput: React.FC<SimpleChatInputProps> = ({
  input,
  setInput,
  onSend,
  onKeyDown,
  isLoading,
  suggestionModalOpen,
  locale
}) => {
  return (
    <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-start gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={suggestionModalOpen ? t('chat_placeholder_awaiting_suggestion', locale) : t('chat_placeholder_default', locale)}
          rows={2}
          className="flex-1 p-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 resize-none text-slate-800 dark:text-slate-200"
          disabled={isLoading || suggestionModalOpen}
        />
        <div className="flex flex-col gap-2">
          <button
            onClick={onSend}
            disabled={!input.trim() || isLoading || suggestionModalOpen}
            className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title={t('chat_send_button_tooltip', locale)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
          <button
            onClick={() => {
              // Call the suggestion handler from parent component
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('requestSuggestion'));
              }
            }}
            disabled={isLoading || suggestionModalOpen}
            className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title={t('chat_suggest_button_tooltip', locale)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311V21m0 0a2.25 2.25 0 0 1-2.25 2.25H8.25a2.25 2.25 0 0 1-2.25-2.25V18.5m3.75 2.311A6.01 6.01 0 0 0 12 18.5m0 0a6.01 6.01 0 0 1-1.875.311m2.25-2.622c.58.097 1.125.225 1.625.397m-1.625-.397a6.01 6.01 0 0 1-3.25 0m3.25 0V6.75A2.25 2.25 0 0 0 9.75 4.5h-1.5A2.25 2.25 0 0 0 6 6.75v3.75m1.5-3.75h3.75" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// DirectEditor Component for inline editing
interface DirectEditorProps {
  stage: Stage;
  initialValue: string;
  onSave: (stage: Stage, newValue: string) => void;
  onCancel: () => void;
  onRefine: (stage: Stage, instruction: string) => void;
  isLoading: boolean;
  locale: Locale;
}

const DirectEditor: React.FC<DirectEditorProps> = ({ stage, initialValue, onSave, onCancel, onRefine, isLoading, locale }) => {
  const [text, setText] = useState(initialValue);
  const [instruction, setInstruction] = useState('');
  const stageLabel = t(stage, locale);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const handleRefineClick = () => {
    if (instruction.trim()) {
      onRefine(stage, instruction);
      setInstruction('');
    }
  };

  return (
    <div className="p-4 bg-slate-200 dark:bg-slate-800 rounded-lg border-2 border-purple-400 dark:border-purple-500 shadow-lg">
      <h3 className="text-purple-700 dark:text-purple-300 font-semibold mb-2 text-base">
        {t('direct_editor_title', locale)} «{stageLabel}»
      </h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none text-slate-800 dark:text-slate-200"
        disabled={isLoading}
      />
      <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">{t('direct_editor_refine_title', locale)}</p>
        <div className="flex items-center gap-2">
            <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder={t('direct_editor_refine_placeholder', locale)}
                className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm text-slate-800 dark:text-slate-200"
                disabled={isLoading}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && instruction.trim()) {
                        handleRefineClick();
                    }
                }}
            />
            <button
                onClick={handleRefineClick}
                disabled={isLoading || !instruction.trim()}
                className="px-4 py-2 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all disabled:opacity-50 flex items-center justify-center"
            >
                {isLoading ? <Loader/> : t('direct_editor_refine_button', locale)}
            </button>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button 
            onClick={onCancel} 
            disabled={isLoading} 
            className="px-4 py-2 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 disabled:opacity-50 transition-colors"
        >
            {t('direct_editor_cancel_button', locale)}
        </button>
        <button 
            onClick={() => onSave(stage, text)} 
            disabled={isLoading} 
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center transition-colors"
        >
            {isLoading ? <Loader/> : t('direct_editor_save_button', locale)}
        </button>
      </div>
    </div>
  );
};


interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isComplete: boolean;
  editingStage: Stage | null;
  startupData: Partial<StartupData>;
  isReadyForNextSection: boolean;
  suggestionModalOpen: boolean;
  currentSuggestion: string;
  selectedStageForPreview?: string | null;
  locale: Locale;
  onSendMessage: (message: string) => void;
  onSuggestionModalAccept: (acceptedAnswer: string) => void;
  onRefineSuggestion: (originalSuggestion: string, instruction: string) => void;
  onSuggestionModalClose: () => void;
  onProceedToNextSection: () => void;
  onUpdateStageData: (stage: Stage, newValue: string) => void;
  onCancelDirectEdit: () => void;
  onRefineEditedStage: (stage: Stage, instruction: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    isLoading,
    isComplete,
    editingStage,
    startupData,
    isReadyForNextSection,
    suggestionModalOpen,
    currentSuggestion,
    selectedStageForPreview,
    locale,
    onSendMessage,
    onSuggestionModalAccept,
    onRefineSuggestion,
    onSuggestionModalClose,
    onProceedToNextSection,
    onUpdateStageData,
    onCancelDirectEdit,
    onRefineEditedStage
}) => {
  const [input, setInput] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentGuidance, setCurrentGuidance] = useState<string>('');

  const handleSend = () => {
    if (input.trim() && !isLoading && !isComplete && !suggestionModalOpen) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };



  // Get current stage information for display
  const getCurrentStageInfo = () => {
    if (editingStage) {
      return {
        prompt: '',
        question: '',
        guidance: ''
      };
    }

    // Find the latest AI message as question and look for guidance before it
    const aiMessages = messages.filter(m => m.sender === 'ai');
    const latestAiMessage = aiMessages[aiMessages.length - 1];

    if (latestAiMessage) {
      // The latest AI message is the question
      const question = latestAiMessage.text;

      // Look for the previous AI message as potential guidance
      const previousAiMessages = aiMessages.slice(0, -1);
      const guidance = previousAiMessages.length > 0 ? previousAiMessages[previousAiMessages.length - 1].text : '';

      return {
        prompt: '',
        question: question,
        guidance: guidance
      };
    }

    return {
      prompt: '',
      question: '',
      guidance: ''
    };
  };

  useEffect(() => {
    // اگر stage انتخاب شده برای preview وجود داره، از اون استفاده کن
    if (selectedStageForPreview) {
      const stageConfig = getStageById(selectedStageForPreview);
      if (stageConfig) {
        const guidance = locale === 'fa' ? (stageConfig.guidance_fa || '') : (stageConfig.guidance_en || '');
        const question = locale === 'fa' ? stageConfig.question_fa : stageConfig.question_en;
        setCurrentGuidance(guidance);
        setCurrentQuestion(question);
        setCurrentPrompt('');
        return;
      }
    }

    // وگرنه از messages استفاده کن (حالت عادی)
    const stageInfo = getCurrentStageInfo();
    setCurrentPrompt(stageInfo.prompt);
    setCurrentQuestion(stageInfo.question);
    setCurrentGuidance(stageInfo.guidance);
  }, [messages, editingStage, locale, selectedStageForPreview]);

  return (
    <>
      <SuggestionModal
        isOpen={suggestionModalOpen}
        suggestion={currentSuggestion}
        isLoading={isLoading}
        locale={locale}
        onAccept={onSuggestionModalAccept}
        onRefine={onRefineSuggestion}
        onClose={onSuggestionModalClose}
      />

      <div className="flex flex-col bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-full overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/20 transition-colors duration-300">
        {/* Current Prompt/Question Display */}
        {(currentPrompt || currentQuestion || currentGuidance) && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-700">
            <div className="space-y-3">
              {currentGuidance && (
                <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                  <strong className="text-slate-700 dark:text-slate-300">راهنمایی:</strong> {currentGuidance}
                </div>
              )}
              {currentPrompt && (
                <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                  {currentPrompt}
                </div>
              )}
              {currentQuestion && (
                <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                  {currentQuestion}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Simple Chat Input */}
        <SimpleChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
          suggestionModalOpen={suggestionModalOpen}
          locale={locale}
        />

        {/* Status Messages */}
        {isComplete && (
          <div className="p-4 bg-green-100 dark:bg-green-900/50 border-t border-green-200 dark:border-green-800">
            <div className="text-center text-green-600 dark:text-green-400 font-semibold">
              {t('chat_complete_title', locale)}
            </div>
          </div>
        )}

        {editingStage && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <DirectEditor
              stage={editingStage}
              initialValue={startupData[STAGE_TO_DATA_KEY[editingStage]!] || ''}
              onSave={onUpdateStageData}
              onCancel={onCancelDirectEdit}
              onRefine={onRefineEditedStage}
              isLoading={isLoading}
              locale={locale}
            />
          </div>
        )}

        {isReadyForNextSection && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-center">
              <button
                onClick={onProceedToNextSection}
                disabled={isLoading}
                className="w-full max-w-sm px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? <Loader/> : t('chat_continue_to_next_section', locale)}
                {!isLoading && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
