-- ==========================================
-- Add trigger to auto-update likes_count
-- Fix: Like count doesn't increment when user likes
-- ==========================================

-- Function to update likes count when a like is added
CREATE OR REPLACE FUNCTION update_likes_count_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Increment likes_count
    UPDATE public_projects
    SET likes_count = likes_count + 1
    WHERE id = NEW.project_id;

    RETURN NEW;
END;
$$;

-- Function to update likes count when a like is removed
CREATE OR REPLACE FUNCTION update_likes_count_on_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Decrement likes_count
    UPDATE public_projects
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.project_id;

    RETURN OLD;
END;
$$;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_update_likes_count_insert ON project_likes;
DROP TRIGGER IF EXISTS trigger_update_likes_count_delete ON project_likes;

-- Create trigger for INSERT
CREATE TRIGGER trigger_update_likes_count_insert
    AFTER INSERT ON project_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_likes_count_on_insert();

-- Create trigger for DELETE
CREATE TRIGGER trigger_update_likes_count_delete
    AFTER DELETE ON project_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_likes_count_on_delete();

-- Fix existing counts (sync current state)
UPDATE public_projects pp
SET likes_count = (
    SELECT COUNT(*)
    FROM project_likes pl
    WHERE pl.project_id = pp.id
);
