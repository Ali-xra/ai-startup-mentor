-- ==========================================
-- Fix public_projects.project_id type from UUID to BIGINT
-- Issue: project_id in main projects table is BIGINT, not UUID
-- ==========================================

-- Drop existing foreign key constraints if any
ALTER TABLE IF EXISTS project_likes DROP CONSTRAINT IF EXISTS project_likes_project_id_fkey;
ALTER TABLE IF EXISTS project_comments DROP CONSTRAINT IF EXISTS project_comments_project_id_fkey;

-- Drop and recreate public_projects table with correct project_id type
DROP TABLE IF EXISTS public_projects CASCADE;

CREATE TABLE public_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id BIGINT NOT NULL,  -- Changed from UUID to BIGINT
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

-- Recreate indexes
CREATE INDEX idx_public_projects_user_id ON public_projects(user_id);
CREATE INDEX idx_public_projects_project_id ON public_projects(project_id);
CREATE INDEX idx_public_projects_is_published ON public_projects(is_published);
CREATE INDEX idx_public_projects_created_at ON public_projects(created_at DESC);
CREATE INDEX idx_public_projects_likes_count ON public_projects(likes_count DESC);

-- ==========================================
-- Recreate project_likes with correct foreign key
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
-- Recreate project_comments with correct foreign key
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
-- Row Level Security Policies
-- ==========================================

-- Enable RLS
ALTER TABLE public_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

-- public_projects policies
CREATE POLICY "Public projects are viewable by everyone"
    ON public_projects FOR SELECT
    USING (is_published = true);

CREATE POLICY "Users can insert their own projects"
    ON public_projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON public_projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON public_projects FOR DELETE
    USING (auth.uid() = user_id);

-- project_likes policies
CREATE POLICY "Likes are viewable by everyone"
    ON project_likes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can like"
    ON project_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
    ON project_likes FOR DELETE
    USING (auth.uid() = user_id);

-- project_comments policies
CREATE POLICY "Comments are viewable by everyone"
    ON project_comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can comment"
    ON project_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
    ON project_comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON project_comments FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- RPC Functions
-- ==========================================

-- Function to get public projects with filters
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
        COALESCE(u.raw_user_meta_data->>'full_name', u.email) as owner_name,
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

-- Function to check if user has liked a project
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
