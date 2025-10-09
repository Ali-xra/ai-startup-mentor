import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Stage, StartupData } from '../types';
import { Loader } from './Loader';
import { ChatBubble } from './ChatBubble';
import { STAGE_TO_DATA_KEY } from '../hooks/useStartupJourney';
import { Locale, t } from '../i18n';

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
  locale: Locale;
  onSendMessage: (message: string) => void;
  onRequestSuggestion: () => void;
  onSuggestionAccept: (messageId: string, acceptedAnswer: string) => void;
  onRefineSuggestion: (messageId: string, originalSuggestion: string, instruction: string) => void;
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
    locale,
    onSendMessage, 
    onRequestSuggestion, 
    onSuggestionAccept,
    onRefineSuggestion,
    onProceedToNextSection,
    onUpdateStageData,
    onCancelDirectEdit,
    onRefineEditedStage
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAwaitingConfirmation = messages.some(m => m.isSuggestion);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (input.trim() && !isLoading && !isComplete && !isAwaitingConfirmation) {
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

  return (
    <div className="flex flex-col bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-full overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/20 transition-colors duration-300">
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id} 
            message={msg} 
            onSuggestionAccept={onSuggestionAccept}
            onRefineSuggestion={onRefineSuggestion}
            isLoading={isLoading} 
            locale={locale}
          />
        ))}
        {isLoading && !isAwaitingConfirmation && !editingStage && (
            <div className={`flex ${locale === 'fa' ? 'justify-start' : 'justify-start'}`}>
                 <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-3 max-w-lg flex items-center space-x-2">
                    <Loader />
                    <span className="text-slate-500 dark:text-slate-400 italic">{t('chat_thinking', locale)}</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
        {isComplete ? (
          <div className="text-center text-green-600 dark:text-green-400 font-semibold p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
            {t('chat_complete_title', locale)}
          </div>
        ) : editingStage ? (
            <DirectEditor 
                stage={editingStage}
                initialValue={startupData[STAGE_TO_DATA_KEY[editingStage]!] || ''}
                onSave={onUpdateStageData}
                onCancel={onCancelDirectEdit}
                onRefine={onRefineEditedStage}
                isLoading={isLoading}
                locale={locale}
            />
        ) : isReadyForNextSection ? (
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
        ) : (
            <div className="flex items-start gap-4">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isAwaitingConfirmation ? t('chat_placeholder_awaiting_suggestion', locale) : t('chat_placeholder_default', locale)}
                rows={2}
                className="flex-1 p-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 resize-none text-slate-800 dark:text-slate-200"
                disabled={isLoading || isAwaitingConfirmation}
            />
            <div className="flex flex-col gap-2">
                    <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading || isAwaitingConfirmation}
                    className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title={t('chat_send_button_tooltip', locale)}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
                    <button
                    onClick={onRequestSuggestion}
                    disabled={isLoading || isAwaitingConfirmation}
                    className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title={t('chat_suggest_button_tooltip', locale)}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311V21m0 0a2.25 2.25 0 0 1-2.25 2.25H8.25a2.25 2.25 0 0 1-2.25-2.25V18.5m3.75 2.311A6.01 6.01 0 0 0 12 18.5m0 0a6.01 6.01 0 0 1-1.875.311m2.25-2.622c.58.097 1.125.225 1.625.397m-1.625-.397a6.01 6.01 0 0 1-3.25 0m3.25 0V6.75A2.25 2.25 0 0 0 9.75 4.5h-1.5A2.25 2.25 0 0 0 6 6.75v3.75m1.5-3.75h3.75" />
                    </svg>
                </button>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};
