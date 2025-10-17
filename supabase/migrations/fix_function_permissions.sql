-- ==========================================
-- FIX: Grant permissions for get_public_projects function
-- ==========================================

-- حذف function قبلی
DROP FUNCTION IF EXISTS get_public_projects(TEXT, INTEGER, INTEGER);

-- ساخت مجدد با SECURITY DEFINER
CREATE OR REPLACE FUNCTION get_public_projects(
    p_filter TEXT DEFAULT 'all',
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    project_id UUID,
    title TEXT,
    description TEXT,
    phase_completed INTEGER,
    total_phases INTEGER,
    thumbnail_url TEXT,
    tags TEXT[],
    likes_count INTEGER,
    comments_count INTEGER,
    created_at TIMESTAMPTZ,
    owner_name TEXT,
    owner_avatar TEXT
)
SECURITY DEFINER  -- این خط مهمه - اجازه دسترسی به auth.users را می‌دهد
SET search_path = public, auth
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pp.id,
        pp.user_id,
        pp.project_id,
        pp.title,
        pp.description,
        pp.phase_completed,
        pp.total_phases,
        pp.thumbnail_url,
        pp.tags,
        pp.likes_count,
        pp.comments_count,
        pp.created_at,
        COALESCE(
            (u.raw_user_meta_data->>'full_name')::TEXT,
            SPLIT_PART(u.email, '@', 1),
            'Anonymous'
        ) as owner_name,
        (u.raw_user_meta_data->>'avatar_url')::TEXT as owner_avatar
    FROM public.public_projects pp
    LEFT JOIN auth.users u ON pp.user_id = u.id
    WHERE pp.is_published = true
        AND CASE
            WHEN p_filter = 'trending' THEN pp.likes_count >= 5
            WHEN p_filter = 'completed' THEN pp.phase_completed = pp.total_phases
            WHEN p_filter = 'recent' THEN pp.created_at >= NOW() - INTERVAL '7 days'
            ELSE true
        END
    ORDER BY
        CASE
            WHEN p_filter = 'trending' THEN pp.likes_count
            WHEN p_filter = 'recent' THEN EXTRACT(EPOCH FROM pp.created_at)::INTEGER
            ELSE pp.likes_count
        END DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- اعطای دسترسی
GRANT EXECUTE ON FUNCTION get_public_projects(TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_public_projects(TEXT, INTEGER, INTEGER) TO anon;

-- ==========================================
-- DONE!
-- ==========================================
