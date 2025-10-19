import { useState, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Stage, StartupData, ChatMessage } from '../types';

/**
 * useProjectManager Hook
 *
 * Handles all project-level CRUD operations:
 * - Loading projects from database
 * - Saving project state to database
 * - Creating new projects
 * - Deleting projects
 * - Restarting projects
 *
 * Extracted from useStartupJourney to follow Single Responsibility Principle
 */

interface UseProjectManagerProps {
  projectId: string | null;
}

interface UseProjectManagerReturn {
  isLoading: boolean;
  saveProject: (stage: Stage, data: Partial<StartupData>, messages: ChatMessage[]) => Promise<void>;
  loadProject: () => Promise<{
    stage: Stage;
    startupData: Partial<StartupData>;
    messages: ChatMessage[];
  } | null>;
  restartProject: (
    initialIdea: string,
    projectName: string,
    newStage: Stage,
    newMessages: ChatMessage[]
  ) => Promise<void>;
}

export const useProjectManager = ({
  projectId,
}: UseProjectManagerProps): UseProjectManagerReturn => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Save project to database
   * Updates stage, startup_data, messages, and updated_at timestamp
   */
  const saveProject = useCallback(
    async (
      updatedStage: Stage,
      updatedData: Partial<StartupData>,
      updatedMessages: ChatMessage[]
    ) => {
      if (!projectId) {
        console.warn('[useProjectManager] No projectId provided, skipping save');
        return;
      }

      try {
        const { error } = await supabase
          .from('projects')
          .update({
            stage: updatedStage,
            startup_data: updatedData,
            messages: updatedMessages,
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId);

        if (error) throw error;

        console.log('[useProjectManager] Project saved successfully:', {
          projectId,
          stage: updatedStage,
          messagesCount: updatedMessages.length,
        });
      } catch (error) {
        console.error('[useProjectManager] Error saving project:', error);
        throw error; // Re-throw to allow caller to handle
      }
    },
    [projectId]
  );

  /**
   * Load project from database
   * Returns project data or null if not found
   */
  const loadProject = useCallback(async () => {
    if (!projectId) {
      console.warn('[useProjectManager] No projectId provided, skipping load');
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('stage, startup_data, messages')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      if (!data) {
        console.warn('[useProjectManager] No project found with id:', projectId);
        return null;
      }

      console.log('[useProjectManager] Project loaded successfully:', {
        projectId,
        stage: data.stage,
        messagesCount: data.messages?.length || 0,
      });

      return {
        stage: data.stage as Stage,
        startupData: (data.startup_data as Partial<StartupData>) || {},
        messages: (data.messages as ChatMessage[]) || [],
      };
    } catch (error) {
      console.error('[useProjectManager] Error loading project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  /**
   * Restart project from the beginning
   * Keeps only initial idea and project name, resets everything else
   */
  const restartProject = useCallback(
    async (
      initialIdea: string,
      projectName: string,
      newStage: Stage,
      newMessages: ChatMessage[]
    ) => {
      if (!projectId) {
        console.warn('[useProjectManager] No projectId provided, cannot restart');
        return;
      }

      setIsLoading(true);
      try {
        const initialData: Partial<StartupData> = {
          projectName,
          initialIdea,
        };

        await saveProject(newStage, initialData, newMessages);

        console.log('[useProjectManager] Project restarted successfully:', {
          projectId,
          newStage,
          projectName,
        });
      } catch (error) {
        console.error('[useProjectManager] Error restarting project:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [projectId, saveProject]
  );

  return {
    isLoading,
    saveProject,
    loadProject,
    restartProject,
  };
};

export default useProjectManager;
