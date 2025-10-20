/**
 * ========================================
 * Centralized Configuration Hub
 * ========================================
 *
 * This file serves as the single source of truth for all app-wide configurations.
 * Import from here to access stage data, phase configs, and utility functions.
 *
 * @module config
 */

// ========================================
// Stage Configuration Exports
// ========================================

export {
  // All phases combined
  ALL_PHASES,

  // Individual phase exports
  PHASE_1,
  PHASE_2,
  PHASE_3,
  PHASE_4,
  PHASE_5,
  PHASE_6,
  PHASE_7,
  PHASE_8,

  // Helper functions for phase/subsection/stage retrieval
  getPhaseById,
  getSubsectionById,
  getStageById,
  getAllStagesFlat,

  // Title retrieval helpers (localized)
  getStageTitle,
  getSubsectionTitle,
  getPhaseTitle,
} from './stages';

// ========================================
// Type Re-exports for Convenience
// ========================================

export type {
  // Stage configuration types
  StageConfig,
  SubsectionConfig,
  PhaseConfig,
  AllPhasesConfig,

  // Prompt configuration types
  PromptConfig,
  PromptConstraints,
  PromptExample,
  PromptTools,
  PromptValidation,
  AISettings,

  // Type aliases
  OutputType,
  ToneType,
  ComplexityType,
} from '../types/stage.types';

// ========================================
// Constants
// ========================================

/**
 * Total number of phases in the startup journey
 */
export const TOTAL_PHASES = 8;

/**
 * Supported locales
 */
export const SUPPORTED_LOCALES = ['en', 'fa'] as const;

/**
 * Default locale
 */
export const DEFAULT_LOCALE = 'fa';

// ========================================
// Application-wide Settings
// ========================================

/**
 * App configuration object
 */
export const APP_CONFIG = {
  /**
   * Name of the application
   */
  appName: 'AI Startup Mentor',

  /**
   * Version of the configuration schema
   */
  configVersion: '1.0.0',

  /**
   * Maximum number of projects per user (free tier)
   */
  maxProjectsPerUser: 1,

  /**
   * Auto-save interval in milliseconds
   */
  autoSaveInterval: 30000, // 30 seconds

  /**
   * Default AI model settings
   */
  defaultAISettings: {
    temperature: 0.7,
    maxOutputTokens: 2000,
  },

  /**
   * Features flags
   */
  features: {
    enableExport: true,
    enableCollaboration: false, // Coming soon
    enableAdvancedAnalytics: false, // Coming soon
  },
} as const;

// ========================================
// Utility Functions
// ========================================

/**
 * Get total number of stages across all phases
 * @returns Total stage count
 */
export const getTotalStageCount = async (): Promise<number> => {
  const stages = await import('./stages');
  return stages.getAllStagesFlat().length;
};

/**
 * Validate if a locale is supported
 * @param locale - Locale to validate
 * @returns True if locale is supported
 */
export const isSupportedLocale = (locale: string): locale is 'en' | 'fa' => {
  return SUPPORTED_LOCALES.includes(locale as 'en' | 'fa');
};

/**
 * Get safe locale (fallback to default if unsupported)
 * @param locale - Locale to check
 * @returns Valid locale
 */
export const getSafeLocale = (locale: string): 'en' | 'fa' => {
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
};
