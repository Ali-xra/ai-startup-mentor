/**
 * ========================================
 * Stage Configuration Exports
 * ========================================
 *
 * This file exports all 8 phase configurations.
 * Import from here to access stage data throughout the app.
 */

import { PhaseConfig, AllPhasesConfig } from '../../types/stage.types';
import { PHASE_1 } from './phase1';
import { PHASE_2 } from './phase2';
import { PHASE_3 } from './phase3';
import { PHASE_4 } from './phase4';
import { PHASE_5 } from './phase5';
import { PHASE_6 } from './phase6';
import { PHASE_7 } from './phase7';
import { PHASE_8 } from './phase8';

/**
 * All phases combined
 */
export const ALL_PHASES: AllPhasesConfig = {
  phases: [PHASE_1, PHASE_2, PHASE_3, PHASE_4, PHASE_5, PHASE_6, PHASE_7, PHASE_8],
};

/**
 * Individual phase exports for direct access
 */
export { PHASE_1, PHASE_2, PHASE_3, PHASE_4, PHASE_5, PHASE_6, PHASE_7, PHASE_8 };

/**
 * Helper function to get a specific phase by ID
 */
export const getPhaseById = (phaseId: string): PhaseConfig | undefined => {
  return ALL_PHASES.phases.find((phase) => phase.id === phaseId);
};

/**
 * Helper function to get a specific subsection by ID
 */
export const getSubsectionById = (subsectionId: string) => {
  for (const phase of ALL_PHASES.phases) {
    const subsection = phase.subsections.find((sub) => sub.id === subsectionId);
    if (subsection) return subsection;
  }
  return undefined;
};

/**
 * Helper function to get a specific stage by ID
 */
export const getStageById = (stageId: string) => {
  for (const phase of ALL_PHASES.phases) {
    for (const subsection of phase.subsections) {
      const stage = subsection.stages.find((s) => s.id === stageId);
      if (stage) return stage;
    }
  }
  return undefined;
};

/**
 * Helper function to get all stages in order
 */
export const getAllStagesFlat = () => {
  const stages: any[] = [];
  for (const phase of ALL_PHASES.phases) {
    for (const subsection of phase.subsections) {
      stages.push(...subsection.stages);
    }
  }
  return stages;
};

// ========================================
// Helper Functions for Title Retrieval
// ========================================

/**
 * Get stage title from config based on locale
 * @param stageId - Stage ID (e.g., 'IDEA_TITLE')
 * @param locale - Language ('fa' | 'en')
 * @returns Stage title in the requested language
 */
export const getStageTitle = (stageId: string, locale: 'fa' | 'en'): string => {
  const stage = getStageById(stageId);
  if (stage) {
    return locale === 'fa' ? stage.title_fa : stage.title_en;
  }

  // Fallback to stage ID if not found
  console.warn(`Stage "${stageId}" not found in config, returning stage ID`);
  return stageId;
};

/**
 * Get subsection title from config based on locale
 * @param subsectionId - Subsection ID (e.g., 'IDEA_DEFINITION')
 * @param locale - Language ('fa' | 'en')
 * @returns Subsection title in the requested language
 */
export const getSubsectionTitle = (subsectionId: string, locale: 'fa' | 'en'): string => {
  const subsection = getSubsectionById(subsectionId);
  if (subsection) {
    return locale === 'fa' ? subsection.title_fa : subsection.title_en;
  }

  console.warn(`Subsection "${subsectionId}" not found in config`);
  return subsectionId;
};

/**
 * Get phase title from config based on locale
 * @param phaseId - Phase ID (e.g., 'CORE_CONCEPT_VALIDATION')
 * @param locale - Language ('fa' | 'en')
 * @returns Phase title in the requested language
 */
export const getPhaseTitle = (phaseId: string, locale: 'fa' | 'en'): string => {
  const phase = getPhaseById(phaseId);
  if (phase) {
    return locale === 'fa' ? phase.title_fa : phase.title_en;
  }

  console.warn(`Phase "${phaseId}" not found in config`);
  return phaseId;
};
