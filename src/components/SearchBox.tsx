import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchResult {
  key: string;
  value: string;
  section: string;
  stage: string;
}

interface SearchBoxProps {
  startupData: any;
  onNavigate?: (section: string) => void;
  onHighlight?: (searchTerm: string) => void;
  onSearch?: (term: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  startupData,
  onNavigate,
  onHighlight,
  onSearch,
}) => {
  const { t, i18n } = useTranslation('common');
  const isRTL = i18n.language === 'fa';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // جستجو در داده‌ها
  const searchInData = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim() || !startupData) return [];

    const found: SearchResult[] = [];
    const searchTerm = searchQuery.toLowerCase();

    Object.entries(startupData).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        const valueStr = value.toString().toLowerCase();
        if (valueStr.includes(searchTerm)) {
          found.push({
            key,
            value: value.toString(),
            section: key.replace(/_/g, ' ').toUpperCase(),
            stage: key,
          });
        }
      }
    });

    return found.slice(0, 8); // حداکثر ۸ نتیجه
  };

  // هندل کردن جستجو
  useEffect(() => {
    if (query.length > 0) {
      const searchResults = searchInData(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);

      // ارسال عبارت جستجو برای هایلایت
      if (onHighlight) {
        onHighlight(query);
      }

      // ارسال عبارت جستجو به والد
      if (onSearch) {
        onSearch(query);
      }
    } else {
      setResults([]);
      setIsOpen(false);
      if (onHighlight) {
        onHighlight('');
      }
      if (onSearch) {
        onSearch('');
      }
    }
  }, [query, startupData, onHighlight, onSearch]);

  // هندل کردن کلیدها
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // کلیک روی نتیجه
  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(result.stage);
    }
    if (onHighlight) {
      onHighlight('');
    }
  };

  // هایلایت متن جستجو شده
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(results.length > 0)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder={t('search_placeholder')}
          className={`w-full px-3 py-2 pl-10 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isRTL ? 'text-right' : 'text-left'}`}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* نتایج جستجو */}
      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className={`absolute mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50 ${isRTL ? 'right-0' : 'left-0'}`}
        >
          {results.map((result, index) => (
            <button
              key={`${result.key}-${index}`}
              onClick={() => handleResultClick(result)}
              className={`w-full text-left px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${selectedIndex === index ? 'bg-purple-50 dark:bg-purple-900/20' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                {result.section}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {highlightText(result.value.substring(0, 100), query)}
                {result.value.length > 100 && '...'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
