-- ==========================================
-- Add RPC functions for comments with user info
-- Fix: Cannot join auth.users directly from client
-- ==========================================

-- Function to get comments for a project with user info
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

-- Function to add a comment with user info returned
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
    -- Get current user
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Insert comment
    INSERT INTO project_comments (project_id, user_id, comment_text)
    VALUES (p_project_id, v_user_id, p_comment_text)
    RETURNING project_comments.id INTO v_comment_id;

    -- Update comments count
    UPDATE public_projects
    SET comments_count = comments_count + 1
    WHERE public_projects.id = p_project_id;

    -- Return comment with user info
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

-- Function to delete a comment
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

    -- Get project_id before deleting
    SELECT project_id INTO v_project_id
    FROM project_comments
    WHERE id = p_comment_id AND user_id = v_user_id;

    IF v_project_id IS NULL THEN
        RAISE EXCEPTION 'Comment not found or unauthorized';
    END IF;

    -- Delete comment
    DELETE FROM project_comments
    WHERE id = p_comment_id AND user_id = v_user_id;

    -- Update comments count
    UPDATE public_projects
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = v_project_id;

    RETURN TRUE;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_project_comments(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION add_project_comment(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_project_comment(UUID) TO authenticated;
