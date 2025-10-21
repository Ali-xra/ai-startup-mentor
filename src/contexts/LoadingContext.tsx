import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface LoadingState {
  isLoading: boolean;
  message?: string;
}

interface LoadingContextType {
  isLoading: boolean;
  message?: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

/**
 * Loading Context Provider
 *
 * مدیریت global loading state
 *
 * @example
 * <LoadingProvider>
 *   <App />
 * </LoadingProvider>
 */
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: undefined,
  });

  const showLoading = useCallback((message?: string) => {
    setLoadingState({ isLoading: true, message });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState({ isLoading: false, message: undefined });
  }, []);

  /**
   * Wrapper برای promise که به طور خودکار loading را نمایش می‌دهد
   */
  const withLoading = useCallback(
    async <T,>(promise: Promise<T>, message?: string): Promise<T> => {
      showLoading(message);
      try {
        const result = await promise;
        return result;
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const value: LoadingContextType = useMemo(
    () => ({
      isLoading: loadingState.isLoading,
      message: loadingState.message,
      showLoading,
      hideLoading,
      withLoading,
    }),
    [loadingState.isLoading, loadingState.message, showLoading, hideLoading, withLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {loadingState.isLoading && (
        <LoadingSpinner fullScreen size="xl" variant="primary" text={loadingState.message} />
      )}
    </LoadingContext.Provider>
  );
};

/**
 * Hook برای استفاده از Loading Context
 *
 * @example
 * const { showLoading, hideLoading, withLoading } = useLoadingContext();
 *
 * // روش 1: دستی
 * showLoading('در حال بارگذاری...');
 * await fetchData();
 * hideLoading();
 *
 * // روش 2: خودکار با withLoading
 * await withLoading(fetchData(), 'در حال بارگذاری...');
 */
export const useLoadingContext = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingContext must be used within LoadingProvider');
  }
  return context;
};
