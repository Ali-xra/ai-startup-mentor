import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { featureFlagsService } from '../services/featureFlagsService';
import { FeatureKey } from '../types';

export const useFeatureFlags = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load user features
  useEffect(() => {
    const loadFeatures = async () => {
      if (!user) {
        setFeatures({});
        setIsLoading(false);
        return;
      }

      try {
        const userFeatures = await featureFlagsService.getUserFeatures(user.id);
        setFeatures(userFeatures);
      } catch (error) {
        console.error('Error loading features:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeatures();
  }, [user]);

  // چک کردن یک فیچر خاص
  const hasFeature = useCallback(
    (featureKey: FeatureKey): boolean => {
      return features[featureKey] === true;
    },
    [features]
  );

  // گرفتن حداکثر تعداد پروژه
  const maxProjects = useCallback((): number => {
    if (hasFeature(FeatureKey.UNLIMITED_PROJECTS)) {
      return Infinity;
    }
    if (hasFeature(FeatureKey.MAX_PROJECTS_3)) {
      return 3;
    }
    return 1; // Free plan
  }, [features, hasFeature]);

  // گرفتن تعداد AI credits
  const aiCredits = useCallback((): number => {
    if (hasFeature(FeatureKey.UNLIMITED_AI)) {
      return Infinity;
    }
    if (hasFeature(FeatureKey.AI_CREDITS_2000)) {
      return 2000;
    }
    if (hasFeature(FeatureKey.AI_CREDITS_500)) {
      return 500;
    }
    return 50; // Free plan
  }, [features, hasFeature]);

  // گرفتن حداکثر تعداد اعضای تیم
  const maxTeamMembers = useCallback((): number => {
    if (hasFeature(FeatureKey.TEAM_SHARING_UNLIMITED)) {
      return Infinity;
    }
    if (hasFeature(FeatureKey.TEAM_SHARING_10)) {
      return 10;
    }
    if (hasFeature(FeatureKey.TEAM_SHARING_2)) {
      return 2;
    }
    return 0; // Free plan - no sharing
  }, [features, hasFeature]);

  // چک کردن دسترسی export
  const canExport = useCallback((): 'advanced' | 'basic' | 'none' => {
    if (hasFeature(FeatureKey.EXPORT_ADVANCED)) {
      return 'advanced';
    }
    if (hasFeature(FeatureKey.EXPORT_BASIC)) {
      return 'basic';
    }
    return 'none';
  }, [features, hasFeature]);

  // گرفتن حداکثر مرحله قابل دسترسی
  const maxPhase = useCallback((): number => {
    if (hasFeature(FeatureKey.ALL_PHASES)) {
      return 8;
    }
    if (hasFeature(FeatureKey.PHASE_5_LIMIT)) {
      return 5;
    }
    return 1; // Free plan - only Phase 1
  }, [features, hasFeature]);

  // گرفتن نام plan فعلی (برای نمایش در UI)
  const getPlanName = useCallback((): string => {
    if (hasFeature(FeatureKey.UNLIMITED_PROJECTS) && hasFeature(FeatureKey.UNLIMITED_AI)) {
      return 'Enterprise';
    }
    if (hasFeature(FeatureKey.UNLIMITED_PROJECTS)) {
      return 'Pro';
    }
    if (hasFeature(FeatureKey.MAX_PROJECTS_3)) {
      return 'Starter';
    }
    return 'Free';
  }, [features, hasFeature]);

  // رفرش کردن فیچرها (مثلاً بعد از خرید)
  const refreshFeatures = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userFeatures = await featureFlagsService.getUserFeatures(user.id);
      setFeatures(userFeatures);
    } catch (error) {
      console.error('Error refreshing features:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    features,
    isLoading,
    hasFeature,
    maxProjects: maxProjects(),
    aiCredits: aiCredits(),
    maxTeamMembers: maxTeamMembers(),
    canExport: canExport(),
    maxPhase: maxPhase(),
    planName: getPlanName(),
    refreshFeatures,
  };
};
