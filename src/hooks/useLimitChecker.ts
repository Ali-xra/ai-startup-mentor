import { useState, useCallback } from 'react';
import { useFeatureFlags } from './useFeatureFlags';

type LimitType = 'projects' | 'ai_messages' | 'phase' | 'team_members' | 'export';

interface LimitCheckResult {
    allowed: boolean;
    limitType?: LimitType;
    currentValue?: number;
    maxValue?: number;
}

export const useLimitChecker = () => {
    const { maxProjects, aiCredits, maxPhase, maxTeamMembers, canExport } = useFeatureFlags();
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [limitInfo, setLimitInfo] = useState<{
        limitType: LimitType;
        currentValue?: number;
        maxValue?: number;
    } | null>(null);

    /**
     * چک کردن محدودیت تعداد پروژه
     */
    const checkProjectLimit = useCallback((currentProjectsCount: number): LimitCheckResult => {
        if (currentProjectsCount >= maxProjects) {
            return {
                allowed: false,
                limitType: 'projects',
                currentValue: currentProjectsCount,
                maxValue: maxProjects
            };
        }
        return { allowed: true };
    }, [maxProjects]);

    /**
     * چک کردن محدودیت AI messages
     */
    const checkAIMessageLimit = useCallback((currentAIMessagesUsed: number): LimitCheckResult => {
        if (currentAIMessagesUsed >= aiCredits) {
            return {
                allowed: false,
                limitType: 'ai_messages',
                currentValue: currentAIMessagesUsed,
                maxValue: aiCredits
            };
        }
        return { allowed: true };
    }, [aiCredits]);

    /**
     * چک کردن محدودیت فاز
     */
    const checkPhaseLimit = useCallback((requestedPhase: number): LimitCheckResult => {
        if (requestedPhase > maxPhase) {
            return {
                allowed: false,
                limitType: 'phase',
                maxValue: maxPhase
            };
        }
        return { allowed: true };
    }, [maxPhase]);

    /**
     * چک کردن محدودیت اعضای تیم
     */
    const checkTeamMemberLimit = useCallback((currentTeamMembersCount: number): LimitCheckResult => {
        if (currentTeamMembersCount >= maxTeamMembers) {
            return {
                allowed: false,
                limitType: 'team_members',
                currentValue: currentTeamMembersCount,
                maxValue: maxTeamMembers
            };
        }
        return { allowed: true };
    }, [maxTeamMembers]);

    /**
     * چک کردن محدودیت Export
     */
    const checkExportLimit = useCallback((): LimitCheckResult => {
        if (canExport === 'none') {
            return {
                allowed: false,
                limitType: 'export'
            };
        }
        return { allowed: true };
    }, [canExport]);

    /**
     * نمایش مودال محدودیت
     */
    const showLimitReachedModal = useCallback((
        limitType: LimitType,
        currentValue?: number,
        maxValue?: number
    ) => {
        setLimitInfo({ limitType, currentValue, maxValue });
        setShowLimitModal(true);
    }, []);

    /**
     * بستن مودال
     */
    const closeLimitModal = useCallback(() => {
        setShowLimitModal(false);
        setLimitInfo(null);
    }, []);

    /**
     * هلپر: چک و نمایش مودال در صورت محدودیت
     */
    const checkAndShowLimit = useCallback((result: LimitCheckResult) => {
        if (!result.allowed && result.limitType) {
            showLimitReachedModal(result.limitType, result.currentValue, result.maxValue);
        }
        return result.allowed;
    }, [showLimitReachedModal]);

    return {
        // Checker functions
        checkProjectLimit,
        checkAIMessageLimit,
        checkPhaseLimit,
        checkTeamMemberLimit,
        checkExportLimit,

        // Helper
        checkAndShowLimit,

        // Modal state
        showLimitModal,
        limitInfo,
        showLimitReachedModal,
        closeLimitModal,

        // Feature values
        maxProjects,
        aiCredits,
        maxPhase,
        maxTeamMembers,
        canExport
    };
};
