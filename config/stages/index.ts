/**
 * ========================================
 * Stage Configuration Exports
 * ========================================
 *
 * This file exports all phase configurations.
 * Import from here to access stage data throughout the app.
 */

import { PhaseConfig, AllPhasesConfig } from '../../types/stage.types';
import { PHASE_1 } from './phase1';

/**
 * All phases combined
 */
export const ALL_PHASES: AllPhasesConfig = {
  phases: [
    PHASE_1,
    // PHASE_2, // Will be added later
    // PHASE_3, // Will be added later
    // ... etc
  ],
};

/**
 * Individual phase exports for direct access
 */
export { PHASE_1 };

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
