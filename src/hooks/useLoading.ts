import { useState, useCallback } from 'react';

interface UseLoadingOptions {
  initialLoading?: boolean;
  onLoadingChange?: (isLoading: boolean) => void;
}

interface UseLoadingReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
  toggleLoading: () => void;
}

/**
 * Hook برای مدیریت local loading state
 *
 * برای استفاده در کامپوننت‌های جداگانه که نیاز به loading state دارند
 *
 * @example
 * const { isLoading, withLoading } = useLoading();
 *
 * const fetchData = async () => {
 *   const data = await withLoading(api.getData());
 *   setData(data);
 * };
 */
export const useLoading = (options: UseLoadingOptions = {}): UseLoadingReturn => {
  const { initialLoading = false, onLoadingChange } = options;
  const [isLoading, setIsLoading] = useState(initialLoading);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    onLoadingChange?.(true);
  }, [onLoadingChange]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    onLoadingChange?.(false);
  }, [onLoadingChange]);

  const toggleLoading = useCallback(() => {
    setIsLoading((prev) => {
      const newValue = !prev;
      onLoadingChange?.(newValue);
      return newValue;
    });
  }, [onLoadingChange]);

  const withLoading = useCallback(
    async <T>(promise: Promise<T>): Promise<T> => {
      startLoading();
      try {
        const result = await promise;
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
    toggleLoading,
  };
};

/**
 * Hook برای مدیریت multiple loading states
 *
 * برای کامپوننت‌هایی که چند عملیات مختلف loading دارند
 *
 * @example
 * const loading = useMultipleLoading(['fetch', 'save', 'delete']);
 *
 * await loading.withLoading('fetch', fetchData());
 * await loading.withLoading('save', saveData());
 */
export const useMultipleLoading = (keys: string[]) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    keys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  const startLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }));
  }, []);

  const stopLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: false }));
  }, []);

  const withLoading = useCallback(
    async <T>(key: string, promise: Promise<T>): Promise<T> => {
      startLoading(key);
      try {
        const result = await promise;
        return result;
      } finally {
        stopLoading(key);
      }
    },
    [startLoading, stopLoading]
  );

  const isLoading = useCallback((key: string) => loadingStates[key] || false, [loadingStates]);

  const isAnyLoading = useCallback(
    () => Object.values(loadingStates).some(Boolean),
    [loadingStates]
  );

  return {
    loadingStates,
    startLoading,
    stopLoading,
    withLoading,
    isLoading,
    isAnyLoading,
  };
};

/**
 * Hook برای مدیریت progress state
 *
 * برای عملیات‌هایی که نیاز به نمایش progress دارند (مثل آپلود فایل)
 *
 * @example
 * const { progress, setProgress, isComplete, reset } = useProgress();
 *
 * // در حین آپلود
 * setProgress(50);
 */
export const useProgress = (initialProgress = 0) => {
  const [progress, setProgress] = useState(initialProgress);

  const isComplete = progress >= 100;

  const reset = useCallback(() => {
    setProgress(0);
  }, []);

  const increment = useCallback((amount: number) => {
    setProgress((prev) => Math.min(prev + amount, 100));
  }, []);

  return {
    progress,
    setProgress,
    isComplete,
    reset,
    increment,
  };
};

/**
 * Hook برای debounced loading
 *
 * Loading را با تاخیر نمایش می‌دهد (برای جلوگیری از فلش سریع loading)
 *
 * @example
 * const { isLoading, withLoading } = useDebouncedLoading(300);
 */
export const useDebouncedLoading = (delay = 200) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setShouldShow(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setShouldShow(false);
  }, []);

  const withLoading = useCallback(
    async <T>(promise: Promise<T>): Promise<T> => {
      const cleanup = startLoading();
      try {
        const result = await promise;
        return result;
      } finally {
        cleanup();
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading: shouldShow,
    actualLoading: isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};
