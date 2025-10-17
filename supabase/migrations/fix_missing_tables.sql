-- ==========================================
-- FIX: Create missing tables and functions
-- این فایل فقط جداول و functions گم شده را می‌سازد
-- ==========================================

-- ==========================================
-- 1. TABLE: public_projects
-- ==========================================
DROP TABLE IF EXISTS public_projects CASCADE;

CREATE TABLE public_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    phase_completed INTEGER DEFAULT 1,
    total_phases INTEGER DEFAULT 8,
    thumbnail_url TEXT,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, project_id)
);

CREATE INDEX idx_public_projects_user_id ON public_projects(user_id);
CREATE INDEX idx_public_projects_is_published ON public_projects(is_published);
CREATE INDEX idx_public_projects_created_at ON public_projects(created_at DESC);
CREATE INDEX idx_public_projects_likes_count ON public_projects(likes_count DESC);

-- ==========================================
-- 2. TABLE: project_likes
-- ==========================================
DROP TABLE IF EXISTS project_likes CASCADE;

CREATE TABLE project_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_likes_project_id ON project_likes(project_id);
CREATE INDEX idx_project_likes_user_id ON project_likes(user_id);

-- ==========================================
-- 3. TABLE: project_comments
-- ==========================================
DROP TABLE IF EXISTS project_comments CASCADE;

CREATE TABLE project_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_project_comments_project_id ON project_comments(project_id);
CREATE INDEX idx_project_comments_user_id ON project_comments(user_id);
CREATE INDEX idx_project_comments_created_at ON project_comments(created_at DESC);

-- ==========================================
-- 4. RLS POLICIES - public_projects
-- ==========================================
ALTER TABLE public_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published projects"
    ON public_projects FOR SELECT
    USING (is_published = true);

CREATE POLICY "Users can view their own projects"
    ON public_projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
    ON public_projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON public_projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON public_projects FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- 5. RLS POLICIES - project_likes
-- ==========================================
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
    ON project_likes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can like projects"
    ON project_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
    ON project_likes FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- 6. RLS POLICIES - project_comments
-- ==========================================
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
    ON project_comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can add comments"
    ON project_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
    ON project_comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON project_comments FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- 7. TRIGGERS - Auto-update timestamps
-- ==========================================

-- Trigger for public_projects
CREATE OR REPLACE FUNCTION update_public_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_public_projects_timestamp
    BEFORE UPDATE ON public_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_public_projects_updated_at();

-- Trigger for project_comments
CREATE OR REPLACE FUNCTION update_project_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_comments_timestamp
    BEFORE UPDATE ON project_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_project_comments_updated_at();

-- ==========================================
-- 8. TRIGGERS - Auto-update counters
-- ==========================================

-- Trigger to update likes_count
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public_projects
        SET likes_count = likes_count + 1
        WHERE id = NEW.project_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public_projects
        SET likes_count = GREATEST(likes_count - 1, 0)
        WHERE id = OLD.project_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_likes_count
    AFTER INSERT OR DELETE ON project_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_likes_count();

-- Trigger to update comments_count
CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public_projects
        SET comments_count = comments_count + 1
        WHERE id = NEW.project_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public_projects
        SET comments_count = GREATEST(comments_count - 1, 0)
        WHERE id = OLD.project_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comments_count
    AFTER INSERT OR DELETE ON project_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_comments_count();

-- ==========================================
-- 9. FUNCTION: Get public projects with filters
-- ==========================================
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
) AS $$
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
            SPLIT_PART(u.email, '@', 1)
        ) as owner_name,
        (u.raw_user_meta_data->>'avatar_url')::TEXT as owner_avatar
    FROM public_projects pp
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
$$ LANGUAGE plpgsql STABLE;

-- ==========================================
-- 10. FUNCTION: Check if user liked a project
-- ==========================================
CREATE OR REPLACE FUNCTION has_user_liked_project(
    p_project_id UUID,
    p_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM project_likes
        WHERE project_id = p_project_id
        AND user_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- ==========================================
-- 11. GRANT PERMISSIONS
-- ==========================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public_projects TO authenticated;
GRANT ALL ON public_projects TO service_role;

GRANT SELECT, INSERT, DELETE ON project_likes TO authenticated;
GRANT ALL ON project_likes TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON project_comments TO authenticated;
GRANT ALL ON project_comments TO service_role;

-- ==========================================
-- DONE!
-- ==========================================
