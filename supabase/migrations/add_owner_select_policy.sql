-- ==========================================
-- Add policy for users to view their own projects
-- Fix: 406 error when checking existing project
-- ==========================================

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON public_projects;

-- Create two separate SELECT policies:

-- 1. Everyone can see published projects
CREATE POLICY "Published projects are viewable by everyone"
    ON public_projects FOR SELECT
    USING (is_published = true);

-- 2. Users can see their own projects (published or not)
CREATE POLICY "Users can view their own projects"
    ON public_projects FOR SELECT
    USING (auth.uid() = user_id);

-- این دو policy با OR ترکیب میشن، یعنی:
-- - اگر پروژه منتشر باشه، همه می‌تونن ببیننش
-- - اگر پروژه مال خود کاربر باشه، خودش می‌تونه ببینه (حتی اگه منتشر نباشه)
