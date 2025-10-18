import React, { useState, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Loader } from './Loader';
import { Locale, t } from '../i18n';

interface ChatBubbleProps {
  message: ChatMessage;
  onSuggestionAccept: (messageId: string, acceptedAnswer: string) => void;
  onRefineSuggestion: (messageId: string, originalSuggestion: string, instruction: string) => void;
  isLoading: boolean;
  locale: Locale;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onSuggestionAccept, onRefineSuggestion, isLoading, locale }) => {
  const [editedText, setEditedText] = useState(message.text);
  const [refineInstruction, setRefineInstruction] = useState('');
  
  useEffect(() => {
    setEditedText(message.text);
  }, [message.text]);

  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  if (isSystem) {
    return (
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 italic my-2">
        {message.text}
      </div>
    );
  }

  if (message.isSuggestion) {
    return (
        <div className="flex justify-start">
             <div className="p-4 rounded-2xl max-w-lg w-full bg-slate-200 dark:bg-slate-700 rounded-bl-none border-2 border-purple-400 dark:border-purple-500 shadow-lg">
                <p className="text-purple-700 dark:text-purple-300 font-semibold mb-2">{t('chat_bubble_suggestion_title', locale)}</p>
                <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={8}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none text-slate-800 dark:text-slate-200"
                    disabled={isLoading}
                />
                
                <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">{t('chat_bubble_refine_title', locale)}</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={refineInstruction}
                            onChange={(e) => setRefineInstruction(e.target.value)}
                            placeholder={t('chat_bubble_refine_placeholder', locale)}
                            className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm text-slate-800 dark:text-slate-200"
                            disabled={isLoading}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && refineInstruction.trim()) {
                                    onRefineSuggestion(message.id, editedText, refineInstruction);
                                    setRefineInstruction('');
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                onRefineSuggestion(message.id, editedText, refineInstruction);
                                setRefineInstruction('');
                            }}
                            disabled={isLoading || !refineInstruction.trim()}
                            className="px-4 py-2 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all disabled:opacity-50 flex items-center justify-center"
                        >
                            {isLoading ? <Loader/> : t('chat_bubble_refine_button', locale)}
                        </button>
                    </div>
                </div>
                
                <button
                    onClick={() => onSuggestionAccept(message.id, editedText)}
                    disabled={isLoading}
                    className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                    {t('chat_bubble_accept_button', locale)}
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`px-4 py-3 rounded-2xl max-w-lg whitespace-pre-wrap
          ${isUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}
      >
        {message.text}
        {message.images && message.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {message.images.map((imgSrc, index) => (
              <a key={index} href={`data:image/jpeg;base64,${imgSrc}`} target="_blank" rel="noopener noreferrer">
                <img
                  src={`data:image/jpeg;base64,${imgSrc}`}
                  alt={`Mood board suggestion ${index + 1}`}
                  className="rounded-lg w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-200"
                />
              </a>
            ))}
          </div>
        )}
      </div>
      {message.sources && message.sources.length > 0 && (
          <div className="mt-2 text-xs max-w-lg">
              <span className="font-semibold text-slate-600 dark:text-slate-400">{t('blueprint_sources', locale)}</span>
              <ul className="list-disc list-inside">
                  {message.sources.map((source, index) => (
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
  );
};
