-- پاکسازی فیچرهای تکراری در دیتابیس
-- این اسکریپت فیچرهای اضافی را غیرفعال می‌کند تا فقط یک فیچر از هر category فعال باشد

-- 1. پاکسازی فیچرهای پروژه (فقط یکی باید فعال باشد)
-- برای هر user، فقط بالاترین سطح را فعال نگه می‌داریم
WITH project_features AS (
    SELECT
        user_id,
        feature_key,
        CASE
            WHEN feature_key = 'unlimited_projects' THEN 3
            WHEN feature_key = 'max_projects_3' THEN 2
            WHEN feature_key = 'max_projects_1' THEN 1
        END as priority,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY
            CASE
                WHEN feature_key = 'unlimited_projects' THEN 3
                WHEN feature_key = 'max_projects_3' THEN 2
                WHEN feature_key = 'max_projects_1' THEN 1
            END DESC
        ) as rn
    FROM user_features
    WHERE feature_key IN ('unlimited_projects', 'max_projects_3', 'max_projects_1')
    AND is_enabled = true
)
UPDATE user_features
SET is_enabled = false
WHERE feature_key IN ('unlimited_projects', 'max_projects_3', 'max_projects_1')
AND (user_id, feature_key) IN (
    SELECT user_id, feature_key
    FROM project_features
    WHERE rn > 1
);

-- 2. پاکسازی فیچرهای AI (فقط یکی باید فعال باشد)
WITH ai_features AS (
    SELECT
        user_id,
        feature_key,
        CASE
            WHEN feature_key = 'unlimited_ai' THEN 4
            WHEN feature_key = 'ai_credits_2000' THEN 3
            WHEN feature_key = 'ai_credits_500' THEN 2
            WHEN feature_key = 'ai_credits_50' THEN 1
        END as priority,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY
            CASE
                WHEN feature_key = 'unlimited_ai' THEN 4
                WHEN feature_key = 'ai_credits_2000' THEN 3
                WHEN feature_key = 'ai_credits_500' THEN 2
                WHEN feature_key = 'ai_credits_50' THEN 1
            END DESC
        ) as rn
    FROM user_features
    WHERE feature_key IN ('unlimited_ai', 'ai_credits_2000', 'ai_credits_500', 'ai_credits_50')
    AND is_enabled = true
)
UPDATE user_features
SET is_enabled = false
WHERE feature_key IN ('unlimited_ai', 'ai_credits_2000', 'ai_credits_500', 'ai_credits_50')
AND (user_id, feature_key) IN (
    SELECT user_id, feature_key
    FROM ai_features
    WHERE rn > 1
);

-- 3. پاکسازی فیچرهای Team (فقط یکی باید فعال باشد)
WITH team_features AS (
    SELECT
        user_id,
        feature_key,
        CASE
            WHEN feature_key = 'team_sharing_unlimited' THEN 4
            WHEN feature_key = 'team_sharing_10' THEN 3
            WHEN feature_key = 'team_sharing_2' THEN 2
            WHEN feature_key = 'team_sharing_disabled' THEN 1
        END as priority,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY
            CASE
                WHEN feature_key = 'team_sharing_unlimited' THEN 4
                WHEN feature_key = 'team_sharing_10' THEN 3
                WHEN feature_key = 'team_sharing_2' THEN 2
                WHEN feature_key = 'team_sharing_disabled' THEN 1
            END DESC
        ) as rn
    FROM user_features
    WHERE feature_key IN ('team_sharing_unlimited', 'team_sharing_10', 'team_sharing_2', 'team_sharing_disabled')
    AND is_enabled = true
)
UPDATE user_features
SET is_enabled = false
WHERE feature_key IN ('team_sharing_unlimited', 'team_sharing_10', 'team_sharing_2', 'team_sharing_disabled')
AND (user_id, feature_key) IN (
    SELECT user_id, feature_key
    FROM team_features
    WHERE rn > 1
);

-- 4. پاکسازی فیچرهای Export (فقط یکی باید فعال باشد)
WITH export_features AS (
    SELECT
        user_id,
        feature_key,
        CASE
            WHEN feature_key = 'export_advanced' THEN 3
            WHEN feature_key = 'export_basic' THEN 2
            WHEN feature_key = 'export_disabled' THEN 1
        END as priority,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY
            CASE
                WHEN feature_key = 'export_advanced' THEN 3
                WHEN feature_key = 'export_basic' THEN 2
                WHEN feature_key = 'export_disabled' THEN 1
            END DESC
        ) as rn
    FROM user_features
    WHERE feature_key IN ('export_advanced', 'export_basic', 'export_disabled')
    AND is_enabled = true
)
UPDATE user_features
SET is_enabled = false
WHERE feature_key IN ('export_advanced', 'export_basic', 'export_disabled')
AND (user_id, feature_key) IN (
    SELECT user_id, feature_key
    FROM export_features
    WHERE rn > 1
);

-- 5. پاکسازی فیچرهای Phases (فقط یکی باید فعال باشد)
WITH phase_features AS (
    SELECT
        user_id,
        feature_key,
        CASE
            WHEN feature_key = 'all_phases' THEN 3
            WHEN feature_key = 'phase_5_limit' THEN 2
            WHEN feature_key = 'phase_3_limit' THEN 1
        END as priority,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY
            CASE
                WHEN feature_key = 'all_phases' THEN 3
                WHEN feature_key = 'phase_5_limit' THEN 2
                WHEN feature_key = 'phase_3_limit' THEN 1
            END DESC
        ) as rn
    FROM user_features
    WHERE feature_key IN ('all_phases', 'phase_5_limit', 'phase_3_limit')
    AND is_enabled = true
)
UPDATE user_features
SET is_enabled = false
WHERE feature_key IN ('all_phases', 'phase_5_limit', 'phase_3_limit')
AND (user_id, feature_key) IN (
    SELECT user_id, feature_key
    FROM phase_features
    WHERE rn > 1
);

-- 6. پاکسازی فیچرهای Storage (فقط یکی باید فعال باشد)
WITH storage_features AS (
    SELECT
        user_id,
        feature_key,
        CASE
            WHEN feature_key = 'storage_unlimited' THEN 4
            WHEN feature_key = 'storage_5gb' THEN 3
            WHEN feature_key = 'storage_500mb' THEN 2
            WHEN feature_key = 'storage_50mb' THEN 1
        END as priority,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY
            CASE
                WHEN feature_key = 'storage_unlimited' THEN 4
                WHEN feature_key = 'storage_5gb' THEN 3
                WHEN feature_key = 'storage_500mb' THEN 2
                WHEN feature_key = 'storage_50mb' THEN 1
            END DESC
        ) as rn
    FROM user_features
    WHERE feature_key IN ('storage_unlimited', 'storage_5gb', 'storage_500mb', 'storage_50mb')
    AND is_enabled = true
)
UPDATE user_features
SET is_enabled = false
WHERE feature_key IN ('storage_unlimited', 'storage_5gb', 'storage_500mb', 'storage_50mb')
AND (user_id, feature_key) IN (
    SELECT user_id, feature_key
    FROM storage_features
    WHERE rn > 1
);

-- نمایش گزارش پاکسازی
SELECT
    'Cleanup completed!' as status,
    COUNT(*) as remaining_features,
    COUNT(DISTINCT user_id) as total_users
FROM user_features
WHERE is_enabled = true;
