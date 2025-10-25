import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as geminiService from '../services/geminiService';
import { Stage, StartupData, ChatMessage, Locale } from '../types';
import i18n from '../i18n/config';
import { getStageById } from '../config/stages';

/**
 * useStageManager Hook
 *
 * Handles all stage-related logic:
 * - Stage progression (advancing to next stage)
 * - Stage navigation (jumping to specific stages)
 * - Auto-generation of stage content
 * - Summary generation
 * - Finding uncompleted stages
 *
 * Extracted from useStartupJourney to follow Single Responsibility Principle
 */

// All stages from all 8 phases
// NOTE: INITIAL is not included as it's just a placeholder with no config
export const ALL_STAGES: Stage[] = [
  // Phase 1: Core Concept & Validation
  Stage.IDEA_TITLE,
  Stage.ELEVATOR_PITCH,
  Stage.EXECUTIVE_SUMMARY,
  Stage.PROBLEM_DESCRIPTION,
  Stage.PROBLEM_MAGNITUDE,
  Stage.CURRENT_SOLUTIONS,
  Stage.CUSTOMER_SEGMENTS,
  Stage.EARLY_ADOPTER_PERSONA,
  Stage.PRODUCT_DESCRIPTION,
  Stage.HOW_IT_WORKS,
  Stage.UVP_STATEMENT,
  Stage.UNFAIR_ADVANTAGE,
  Stage.VALIDATION_SUMMARY,
  Stage.BUSINESS_GOALS_TIMELINE,
  // Phase 2: Market, Competition & Risk Analysis
  Stage.PESTEL_ANALYSIS,
  Stage.TAM_ANALYSIS,
  Stage.SAM_ANALYSIS,
  Stage.SOM_ANALYSIS,
  Stage.COMPETITOR_IDENTIFICATION,
  Stage.COMPETITOR_ANALYSIS,
  Stage.SWOT_ANALYSIS,
  Stage.RISK_ANALYSIS,
  // Phase 3: Business Modeling
  Stage.BMC_CUSTOMER_SEGMENTS,
  Stage.BMC_VALUE_PROPOSITIONS,
  Stage.BMC_CHANNELS,
  Stage.BMC_CUSTOMER_RELATIONSHIPS,
  Stage.BMC_REVENUE_STREAMS,
  Stage.BMC_KEY_RESOURCES,
  Stage.BMC_KEY_ACTIVITIES,
  Stage.BMC_KEY_PARTNERSHIPS,
  Stage.BMC_COST_STRUCTURE,
  // Phase 4: Branding & Identity
  Stage.BRAND_VISION,
  Stage.BRAND_MISSION,
  Stage.CORE_VALUES,
  Stage.BRAND_PERSONALITY,
  Stage.BRAND_NAME,
  Stage.TAGLINE,
  Stage.TONE_OF_VOICE,
  Stage.LOGO_DESIGN_CONCEPTS,
  Stage.COLOR_PALETTE,
  Stage.TYPOGRAPHY,
  // Phase 5: Requirements Engineering & MVP Construction
  Stage.PLATFORM_VISION,
  Stage.USER_ROLES,
  Stage.USER_PROFILE_NEEDS,
  Stage.MULTI_TENANCY,
  Stage.FILE_UPLOADS,
  Stage.DATABASE_AND_AUTH,
  Stage.PUBLIC_PAGES,
  Stage.USER_PANEL_STRUCTURE,
  Stage.CORE_FEATURES_IMPLEMENTATION,
  // Phase 6: Marketing & Sales Strategy
  Stage.MARKETING_OBJECTIVES,
  Stage.KPIS,
  Stage.CONTENT_MARKETING,
  Stage.SOCIAL_MEDIA_MARKETING,
  Stage.PAID_ADVERTISING,
  Stage.SALES_PROCESS,
  Stage.PRICING_STRATEGY,
  Stage.LAUNCH_CAMPAIGN,
  // Phase 7: Organization, Operations & Financials
  Stage.FOUNDING_TEAM,
  Stage.HIRING_PLAN,
  Stage.LEGAL_STRUCTURE,
  Stage.IP_STRATEGY,
  Stage.KEY_MILESTONES,
  Stage.STARTUP_COSTS,
  Stage.BURN_RATE,
  Stage.REVENUE_FORECAST,
  // Phase 8: Final Outputs & Fundraising
  Stage.FUNDRAISING_ASK,
  Stage.USE_OF_FUNDS,
  Stage.PITCH_DECK_OUTLINE,
  Stage.ONE_PAGER,
  Stage.EXIT_STRATEGY,
  Stage.COMPLETE,
];

export const STAGE_TO_DATA_KEY: Record<Stage, keyof StartupData | null> = {
  [Stage.INITIAL]: null,

  // Phase 1: Core Concept & Validation
  [Stage.IDEA_TITLE]: 'idea_title',
  [Stage.ELEVATOR_PITCH]: 'elevator_pitch',
  [Stage.EXECUTIVE_SUMMARY]: 'executive_summary',
  [Stage.PROBLEM_DESCRIPTION]: 'problem_description',
  [Stage.PROBLEM_MAGNITUDE]: 'problem_magnitude',
  [Stage.CURRENT_SOLUTIONS]: 'current_solutions',
  [Stage.CUSTOMER_SEGMENTS]: 'customer_segments',
  [Stage.EARLY_ADOPTER_PERSONA]: 'early_adopter_persona',
  [Stage.PRODUCT_DESCRIPTION]: 'product_description',
  [Stage.HOW_IT_WORKS]: 'how_it_works',
  [Stage.UVP_STATEMENT]: 'uvp_statement',
  [Stage.UNFAIR_ADVANTAGE]: 'unfair_advantage',
  [Stage.VALIDATION_SUMMARY]: 'validation_summary',
  [Stage.BUSINESS_GOALS_TIMELINE]: 'business_goals_timeline',

  // Phase 2: Market, Competition & Risk Analysis
  [Stage.PESTEL_ANALYSIS]: 'pestel_analysis',
  [Stage.TAM_ANALYSIS]: 'tam_analysis',
  [Stage.SAM_ANALYSIS]: 'sam_analysis',
  [Stage.SOM_ANALYSIS]: 'som_analysis',
  [Stage.COMPETITOR_IDENTIFICATION]: 'competitor_identification',
  [Stage.COMPETITOR_ANALYSIS]: 'competitor_analysis',
  [Stage.SWOT_ANALYSIS]: 'swot_analysis',
  [Stage.RISK_ANALYSIS]: 'risk_analysis',

  // Phase 3: Business Modeling
  [Stage.BMC_CUSTOMER_SEGMENTS]: 'bmc_customer_segments',
  [Stage.BMC_VALUE_PROPOSITIONS]: 'bmc_value_propositions',
  [Stage.BMC_CHANNELS]: 'bmc_channels',
  [Stage.BMC_CUSTOMER_RELATIONSHIPS]: 'bmc_customer_relationships',
  [Stage.BMC_REVENUE_STREAMS]: 'bmc_revenue_streams',
  [Stage.BMC_KEY_RESOURCES]: 'bmc_key_resources',
  [Stage.BMC_KEY_ACTIVITIES]: 'bmc_key_activities',
  [Stage.BMC_KEY_PARTNERSHIPS]: 'bmc_key_partnerships',
  [Stage.BMC_COST_STRUCTURE]: 'bmc_cost_structure',

  // Phase 4: Branding & Identity
  [Stage.BRAND_VISION]: 'brand_vision',
  [Stage.BRAND_MISSION]: 'brand_mission',
  [Stage.CORE_VALUES]: 'core_values',
  [Stage.BRAND_PERSONALITY]: 'brand_personality',
  [Stage.BRAND_NAME]: 'brand_name',
  [Stage.TAGLINE]: 'tagline',
  [Stage.TONE_OF_VOICE]: 'tone_of_voice',
  [Stage.LOGO_DESIGN_CONCEPTS]: 'logo_design_concepts',
  [Stage.COLOR_PALETTE]: 'color_palette',
  [Stage.TYPOGRAPHY]: 'typography',

  // Phase 5: Requirements Engineering & MVP Construction
  [Stage.PLATFORM_VISION]: 'platform_vision',
  [Stage.USER_ROLES]: 'user_roles',
  [Stage.USER_PROFILE_NEEDS]: 'user_profile_needs',
  [Stage.MULTI_TENANCY]: 'multi_tenancy',
  [Stage.FILE_UPLOADS]: 'file_uploads',
  [Stage.DATABASE_AND_AUTH]: 'database_and_auth',
  [Stage.PUBLIC_PAGES]: 'public_pages',
  [Stage.USER_PANEL_STRUCTURE]: 'user_panel_structure',
  [Stage.CORE_FEATURES_IMPLEMENTATION]: 'core_features_implementation',

  // Phase 6: Marketing & Sales Strategy
  [Stage.MARKETING_OBJECTIVES]: 'marketing_objectives',
  [Stage.KPIS]: 'kpis',
  [Stage.CONTENT_MARKETING]: 'content_marketing',
  [Stage.SOCIAL_MEDIA_MARKETING]: 'social_media_marketing',
  [Stage.PAID_ADVERTISING]: 'paid_advertising',
  [Stage.SALES_PROCESS]: 'sales_process',
  [Stage.PRICING_STRATEGY]: 'pricing_strategy',
  [Stage.LAUNCH_CAMPAIGN]: 'launch_campaign',

  // Phase 7: Organization, Operations & Financials
  [Stage.FOUNDING_TEAM]: 'founding_team',
  [Stage.HIRING_PLAN]: 'hiring_plan',
  [Stage.LEGAL_STRUCTURE]: 'legal_structure',
  [Stage.IP_STRATEGY]: 'ip_strategy',
  [Stage.KEY_MILESTONES]: 'key_milestones',
  [Stage.STARTUP_COSTS]: 'startup_costs',
  [Stage.BURN_RATE]: 'burn_rate',
  [Stage.REVENUE_FORECAST]: 'revenue_forecast',

  // Phase 8: Final Outputs & Fundraising
  [Stage.FUNDRAISING_ASK]: 'fundraising_ask',
  [Stage.USE_OF_FUNDS]: 'use_of_funds',
  [Stage.PITCH_DECK_OUTLINE]: 'pitch_deck_outline',
  [Stage.ONE_PAGER]: 'one_pager',
  [Stage.EXIT_STRATEGY]: 'exit_strategy',

  [Stage.COMPLETE]: null,
};

// Get question and guidance from config if available, otherwise fall back to i18n
export const getQuestionForStage = (stage: Stage, locale: Locale): string => {
  const stageConfig = getStageById(stage);
  if (stageConfig) {
    return locale === 'fa' ? stageConfig.question_fa || '' : stageConfig.question_en || '';
  }
  // Fallback to old i18n system
  return i18n.t(`question_${stage}`);
};

export const getGuidanceForStage = (stage: Stage, locale: Locale): string | null => {
  const stageConfig = getStageById(stage);
  if (stageConfig) {
    return locale === 'fa' ? stageConfig.guidance_fa || null : stageConfig.guidance_en || null;
  }
  return null;
};

export const isSummaryStage = (stage: Stage) =>
  stage.endsWith('_SUMMARY') || stage === Stage.COMPLETE;

export const isAutoGeneratedStage = (stage: Stage) => {
  const autoGeneratedStages = [
    // These stages were auto-generated in the old system
    Stage.BMC_VALUE_PROPOSITIONS,
    Stage.BMC_KEY_ACTIVITIES,
    Stage.BMC_KEY_RESOURCES,
    Stage.BMC_COST_STRUCTURE,
  ];
  return autoGeneratedStages.includes(stage) || isSummaryStage(stage);
};

interface UseStageManagerProps {
  locale: Locale;
  onSaveProject: (
    stage: Stage,
    data: Partial<StartupData>,
    messages: ChatMessage[]
  ) => Promise<void>;
  onAddMessage: (message: Omit<ChatMessage, 'id'>) => void;
}

interface UseStageManagerReturn {
  isLoading: boolean;
  stage: Stage;
  setStage: (stage: Stage) => void;
  advanceStage: (
    currentStage: Stage,
    currentData: Partial<StartupData>,
    currentMessages: ChatMessage[]
  ) => Promise<void>;
  jumpToStage: (selectedStage: Stage, currentStage: Stage) => Stage | null;
  getFirstUncompletedStage: (stage: Stage, startupData: Partial<StartupData>) => Stage | null;
  calculateProgress: (currentStage: Stage) => number;
  handleAutoGeneration: (
    autoStage: Stage,
    currentData: Partial<StartupData>,
    currentMessages: ChatMessage[]
  ) => Promise<{ updatedData: Partial<StartupData>; updatedMessages: ChatMessage[] }>;
  generateSectionSummary: (
    summaryStage: Stage,
    currentData: Partial<StartupData>
  ) => Promise<string>;
}

export const useStageManager = ({
  locale,
  onSaveProject,
  onAddMessage,
}: UseStageManagerProps): UseStageManagerReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<Stage>(Stage.INITIAL);

  /**
   * Advance to the next stage
   * Handles summary stages, auto-generated stages, and user input stages
   */
  const advanceStage = useCallback(
    async (
      currentStage: Stage,
      currentData: Partial<StartupData>,
      currentMessages: ChatMessage[]
    ) => {
      const currentIndex = ALL_STAGES.indexOf(currentStage);
      const nextStage = ALL_STAGES[currentIndex + 1];

      // Remove all suggestion messages before advancing
      const cleanedMessages = currentMessages.filter((m) => !m.isSuggestion);

      if (!nextStage) {
        setStage(Stage.COMPLETE);
        await onSaveProject(Stage.COMPLETE, currentData, cleanedMessages);
        return;
      }

      setStage(nextStage);

      if (isSummaryStage(nextStage)) {
        await onSaveProject(nextStage, currentData, cleanedMessages);
        // Auto-proceed to next section after a brief delay
        setTimeout(() => {
          // This will be handled by proceedToNextSection in the parent hook
        }, 1500);
      } else if (isAutoGeneratedStage(nextStage)) {
        const question = getQuestionForStage(nextStage, locale).replace(
          '{competitor_list}',
          currentData.marketAnalysis_competitor_list || 'your competitors'
        );

        onAddMessage({ text: question, sender: 'ai' });
        // Auto-generation will be handled by the parent hook
      } else {
        // Show guidance if available for user input stages
        const guidance = getGuidanceForStage(nextStage, locale);
        if (guidance) {
          onAddMessage({ text: guidance, sender: 'ai' });
        }
        const question = getQuestionForStage(nextStage, locale);
        onAddMessage({ text: question, sender: 'ai' });
      }
    },
    [locale, onSaveProject, onAddMessage]
  );

  /**
   * Handle auto-generation for specific stages
   * Returns updated data and messages
   */
  const handleAutoGeneration = useCallback(
    async (autoStage: Stage, currentData: Partial<StartupData>, currentMessages: ChatMessage[]) => {
      setIsLoading(true);
      try {
        const result = await geminiService.generateResponseForStage(autoStage, currentData, locale);

        const dataKey = STAGE_TO_DATA_KEY[autoStage];
        let updatedData = { ...currentData };
        if (dataKey) {
          updatedData = { ...updatedData, [dataKey]: result.text };
        }

        const newAiMessage: ChatMessage = {
          text: result.text,
          sender: 'ai',
          id: uuidv4(),
          sources: result.sources,
        };
        const updatedMessages = [...currentMessages, newAiMessage];

        return { updatedData, updatedMessages };
      } catch (error) {
        console.error('[useStageManager] Error during auto-generation:', error);
        onAddMessage({ text: 'Sorry, an error occurred. Please try again.', sender: 'system' });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [locale, onAddMessage]
  );

  /**
   * Jump to a specific stage (only backwards allowed)
   */
  const jumpToStage = useCallback(
    (selectedStage: Stage, currentStage: Stage): Stage | null => {
      const currentIndex = ALL_STAGES.indexOf(currentStage);
      const selectedIndex = ALL_STAGES.indexOf(selectedStage);

      if (selectedIndex < currentIndex) {
        setStage(selectedStage);

        // Show guidance if available
        const guidance = getGuidanceForStage(selectedStage, locale);
        if (guidance) {
          onAddMessage({ text: guidance, sender: 'ai' });
        }
        onAddMessage({ text: getQuestionForStage(selectedStage, locale), sender: 'ai' });

        return selectedStage;
      }

      return null;
    },
    [locale, onAddMessage]
  );

  /**
   * Find the first uncompleted stage
   */
  const getFirstUncompletedStage = useCallback(
    (currentStage: Stage, startupData: Partial<StartupData>): Stage | null => {
      if (currentStage === Stage.COMPLETE) return null;

      const currentStageIndex = ALL_STAGES.indexOf(currentStage);
      const stagesToCheck = ALL_STAGES.slice(0, currentStageIndex + 1);

      for (const stageToCheck of stagesToCheck) {
        const dataKey = STAGE_TO_DATA_KEY[stageToCheck];
        if (dataKey && !startupData[dataKey]) {
          return stageToCheck;
        }
      }

      return null;
    },
    []
  );

  /**
   * Calculate progress percentage based on current stage
   */
  const calculateProgress = useCallback((currentStage: Stage): number => {
    return (ALL_STAGES.indexOf(currentStage) / (ALL_STAGES.length - 1)) * 100;
  }, []);

  /**
   * Generate summary for a section
   */
  const generateSectionSummary = useCallback(
    async (summaryStage: Stage, currentData: Partial<StartupData>): Promise<string> => {
      setIsLoading(true);
      try {
        const summary = await geminiService.generateSectionSummary(
          summaryStage,
          currentData,
          locale
        );
        return summary;
      } catch (error) {
        console.error('[useStageManager] Error generating summary:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [locale]
  );

  return {
    isLoading,
    stage,
    setStage,
    advanceStage,
    jumpToStage,
    getFirstUncompletedStage,
    calculateProgress,
    handleAutoGeneration,
    generateSectionSummary,
  };
};

export default useStageManager;
