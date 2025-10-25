import React, { useState, useEffect } from 'react';
import { Stage, StartupData, ChatMessage } from '../types';
import { Loader } from './Loader';
import { SuggestionModal } from './SuggestionModal';
import { STAGE_TO_DATA_KEY } from '../hooks/useStartupJourney';
import { useTranslation } from 'react-i18next';
import { Locale } from '../i18n';
import { getStageById } from '../config/stages';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isComplete: boolean;
  editingStage: Stage | null;
  currentStage: Stage;
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
  currentStage,
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
  // onRefineEditedStage is unused but kept for future use
}) => {
  const { t } = useTranslation('common');
  const [input, setInput] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentGuidance, setCurrentGuidance] = useState<string>('');

  // Handle suggestion accept differently based on editing mode
  const handleSuggestionAccept = (acceptedText: string) => {
    if (editingStage) {
      // در حالت ویرایش، فقط متن را در input قرار بده
      setInput(acceptedText);
      onSuggestionModalClose();
    } else {
      // در حالت عادی، مستقیماً ارسال کن
      onSuggestionModalAccept(acceptedText);
    }
  };

  // Set input to the stage data when editing
  useEffect(() => {
    if (editingStage) {
      const dataKey = STAGE_TO_DATA_KEY[editingStage];
      if (dataKey) {
        setInput((startupData[dataKey] as string) || '');
      }
    } else {
      setInput('');
    }
  }, [editingStage, startupData]);

  const handleSend = () => {
    if (editingStage) {
      // در حالت ویرایش، ذخیره کن
      if (input.trim()) {
        onUpdateStageData(editingStage, input);
        setInput('');
      }
    } else {
      // در حالت عادی، پیام بفرست
      if (input.trim() && !isLoading && !isComplete && !suggestionModalOpen) {
        onSendMessage(input);
        setInput('');
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    // اگر در حال ویرایش هستیم، راهنمایی و سوال stage مورد نظر را نمایش بده
    if (editingStage) {
      const stageConfig = getStageById(editingStage);
      if (stageConfig) {
        const guidance =
          locale === 'fa' ? stageConfig.guidance_fa || '' : stageConfig.guidance_en || '';
        const question = locale === 'fa' ? stageConfig.question_fa || '' : stageConfig.question_en || '';
        setCurrentGuidance(guidance);
        setCurrentQuestion(question);
        setCurrentPrompt('');
        return;
      }
    }

    // تعیین stage ای که باید نمایش داده شود
    // اولویت 1: اگر stage انتخاب شده برای پیش‌نمایش وجود دارد، از آن استفاده کن
    // اولویت 2: در غیر این صورت از stage فعلی استفاده کن
    const stageToDisplay = selectedStageForPreview || currentStage;

    // برای stage مورد نظر، راهنمایی و سوال را از config بگیر
    if (stageToDisplay) {
      const stageConfig = getStageById(stageToDisplay);
      if (stageConfig) {
        const guidance =
          locale === 'fa' ? stageConfig.guidance_fa || '' : stageConfig.guidance_en || '';
        const question = locale === 'fa' ? stageConfig.question_fa || '' : stageConfig.question_en || '';
        setCurrentGuidance(guidance);
        setCurrentQuestion(question);
        setCurrentPrompt('');
        return;
      } else {
        // اگر config برای این stage وجود ندارد (مثل INITIAL)، خالی نشان بده
        setCurrentPrompt('');
        setCurrentQuestion('');
        setCurrentGuidance('');
        return;
      }
    }

    // اگر پروژه کامل شده و هیچ stage انتخابی نداریم، پیام تکمیل نمایش بده
    if (isComplete && !selectedStageForPreview) {
      setCurrentPrompt('');
      setCurrentQuestion(t('chat_complete_message'));
      setCurrentGuidance('');
      return;
    }

    // اگر هیچ‌کدام، همه چیز خالی
    setCurrentPrompt('');
    setCurrentQuestion('');
    setCurrentGuidance('');
  }, [editingStage, locale, selectedStageForPreview, currentStage, isComplete]);

  return (
    <>
      <SuggestionModal
        isOpen={suggestionModalOpen}
        suggestion={currentSuggestion}
        isLoading={isLoading}
        locale={locale}
        onAccept={handleSuggestionAccept}
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
                  <strong className="text-slate-700 dark:text-slate-300">
                    {t('chat_guidance_label')}
                  </strong>{' '}
                  {currentGuidance}
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

        {/* Input Area */}
        <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                editingStage
                  ? t('chat_edit_placeholder')
                  : suggestionModalOpen
                    ? t('chat_placeholder_awaiting_suggestion')
                    : t('chat_placeholder_default')
              }
              rows={editingStage ? 8 : 2}
              className="flex-1 p-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 resize-none text-slate-800 dark:text-slate-200"
              disabled={isLoading || (suggestionModalOpen && !editingStage)}
            />
            <div className="flex flex-col gap-2">
              {editingStage ? (
                <>
                  {/* دکمه لغو */}
                  <button
                    onClick={() => {
                      onCancelDirectEdit();
                      setInput('');
                    }}
                    disabled={isLoading}
                    className="p-3 bg-slate-400 dark:bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title={t('chat_cancel_button')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {/* دکمه ذخیره */}
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title={t('chat_save_button')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                  {/* دکمه کمک/AI Suggestion */}
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('requestSuggestion'));
                      }
                    }}
                    disabled={isLoading || suggestionModalOpen}
                    className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title={t('chat_ai_help_button')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  {/* دکمه ارسال */}
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading || suggestionModalOpen}
                    className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title={t('chat_send_button_tooltip')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </button>
                  {/* دکمه کمک */}
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('requestSuggestion'));
                      }
                    }}
                    disabled={isLoading || suggestionModalOpen}
                    className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title={t('chat_suggest_button_tooltip')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {isComplete && !editingStage && (
          <div className="p-4 bg-green-100 dark:bg-green-900/50 border-t border-green-200 dark:border-green-800">
            <div className="text-center text-green-600 dark:text-green-400 font-semibold">
              {t('chat_complete_title')}
            </div>
          </div>
        )}

        {isReadyForNextSection && !editingStage && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-center">
              <button
                onClick={onProceedToNextSection}
                disabled={isLoading}
                className="w-full max-w-sm px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? <Loader /> : t('chat_continue_to_next_section')}
                {!isLoading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
