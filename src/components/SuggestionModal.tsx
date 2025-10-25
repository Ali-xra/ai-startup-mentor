import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from './Loader';

interface SuggestionModalProps {
  isOpen: boolean;
  suggestion: string;
  isLoading: boolean;
  onAccept: (editedSuggestion: string) => void;
  onRefine: (editedSuggestion: string, instruction: string) => void;
  onClose: () => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({
  isOpen,
  suggestion,
  isLoading,
  onAccept,
  onRefine,
  onClose,
}) => {
  const { t } = useTranslation('common');
  const [editedText, setEditedText] = useState(suggestion);
  const [refineInstruction, setRefineInstruction] = useState('');

  useEffect(() => {
    setEditedText(suggestion);
  }, [suggestion]);

  if (!isOpen) return null;

  const handleRefine = () => {
    if (refineInstruction.trim()) {
      onRefine(editedText, refineInstruction);
      setRefineInstruction('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300">
            {t('chat_bubble_suggestion_title')}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading && !editedText ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <Loader />
              <span className="text-slate-600 dark:text-slate-400">
                {t('chat_thinking')}
              </span>
            </div>
          ) : (
            <>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={10}
                className="w-full p-3 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none text-slate-800 dark:text-slate-200"
                disabled={isLoading}
              />

              {/* Refine Section */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
                  {t('chat_bubble_refine_title')}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={refineInstruction}
                    onChange={(e) => setRefineInstruction(e.target.value)}
                    placeholder={t('chat_bubble_refine_placeholder')}
                    className="flex-1 p-3 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none text-sm text-slate-800 dark:text-slate-200"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && refineInstruction.trim()) {
                        handleRefine();
                      }
                    }}
                  />
                  <button
                    onClick={handleRefine}
                    disabled={isLoading || !refineInstruction.trim()}
                    className="px-4 py-3 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                  >
                    {isLoading ? <Loader /> : t('chat_bubble_refine_button')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {t('direct_editor_cancel_button')}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={() => onAccept(editedText)}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader /> : t('chat_bubble_accept_button')}
            {!isLoading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
