-- ==========================================
-- Recreate ALL RPC Functions
-- Fix: Functions missing or not accessible
-- ==========================================

-- Drop all existing functions
DROP FUNCTION IF EXISTS get_public_projects(TEXT, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS has_user_liked_project(UUID, UUID);
DROP FUNCTION IF EXISTS get_project_comments(UUID);
DROP FUNCTION IF EXISTS add_project_comment(UUID, TEXT);
DROP FUNCTION IF EXISTS delete_project_comment(UUID);

-- ==========================================
-- 1. Function: get_public_projects
-- ==========================================
CREATE OR REPLACE FUNCTION get_public_projects(
    p_filter TEXT DEFAULT 'all',
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    project_id BIGINT,
    title TEXT,
    description TEXT,
    phase_completed INTEGER,
    total_phases INTEGER,
    thumbnail_url TEXT,
    tags TEXT[],
    likes_count INTEGER,
    comments_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    owner_name TEXT,
    owner_avatar TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
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
        COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as owner_name,
        u.raw_user_meta_data->>'avatar_url' as owner_avatar
    FROM public_projects pp
    JOIN auth.users u ON pp.user_id = u.id
    WHERE pp.is_published = true
    AND CASE
        WHEN p_filter = 'trending' THEN pp.likes_count >= 10
        WHEN p_filter = 'completed' THEN pp.phase_completed = pp.total_phases
        WHEN p_filter = 'recent' THEN pp.created_at >= NOW() - INTERVAL '7 days'
        ELSE true
    END
    ORDER BY
        CASE
            WHEN p_filter = 'trending' THEN pp.likes_count
            WHEN p_filter = 'recent' THEN EXTRACT(EPOCH FROM pp.created_at)
            ELSE EXTRACT(EPOCH FROM pp.created_at)
        END DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- ==========================================
-- 2. Function: has_user_liked_project
-- ==========================================
CREATE OR REPLACE FUNCTION has_user_liked_project(
    p_project_id UUID,
    p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM project_likes
        WHERE project_id = p_project_id
        AND user_id = p_user_id
    );
END;
$$;

-- ==========================================
-- 3. Function: get_project_comments
-- ==========================================
CREATE OR REPLACE FUNCTION get_project_comments(p_project_id UUID)
RETURNS TABLE (
    id UUID,
    project_id UUID,
    user_id UUID,
    comment_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_name TEXT,
    user_avatar TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pc.id,
        pc.project_id,
        pc.user_id,
        pc.comment_text,
        pc.created_at,
        pc.updated_at,
        COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as user_name,
        u.raw_user_meta_data->>'avatar_url' as user_avatar
    FROM project_comments pc
    JOIN auth.users u ON pc.user_id = u.id
    WHERE pc.project_id = p_project_id
    ORDER BY pc.created_at ASC;
END;
$$;

-- ==========================================
-- 4. Function: add_project_comment
-- ==========================================
CREATE OR REPLACE FUNCTION add_project_comment(
    p_project_id UUID,
    p_comment_text TEXT
)
RETURNS TABLE (
    id UUID,
    project_id UUID,
    user_id UUID,
    comment_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_name TEXT,
    user_avatar TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_comment_id UUID;
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    INSERT INTO project_comments (project_id, user_id, comment_text)
    VALUES (p_project_id, v_user_id, p_comment_text)
    RETURNING project_comments.id INTO v_comment_id;

    RETURN QUERY
    SELECT
        pc.id,
        pc.project_id,
        pc.user_id,
        pc.comment_text,
        pc.created_at,
        pc.updated_at,
        COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as user_name,
        u.raw_user_meta_data->>'avatar_url' as user_avatar
    FROM project_comments pc
    JOIN auth.users u ON pc.user_id = u.id
    WHERE pc.id = v_comment_id;
END;
$$;

-- ==========================================
-- 5. Function: delete_project_comment
-- ==========================================
CREATE OR REPLACE FUNCTION delete_project_comment(p_comment_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_project_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT project_id INTO v_project_id
    FROM project_comments
    WHERE id = p_comment_id AND user_id = v_user_id;

    IF v_project_id IS NULL THEN
        RAISE EXCEPTION 'Comment not found or unauthorized';
    END IF;

    DELETE FROM project_comments
    WHERE id = p_comment_id AND user_id = v_user_id;

    RETURN TRUE;
END;
$$;

-- ==========================================
-- Grant Permissions
-- ==========================================
GRANT EXECUTE ON FUNCTION get_public_projects(TEXT, INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION has_user_liked_project(UUID, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_project_comments(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION add_project_comment(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_project_comment(UUID) TO authenticated;
