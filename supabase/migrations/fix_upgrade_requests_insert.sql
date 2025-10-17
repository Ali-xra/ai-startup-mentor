-- Fix upgrade_requests table to allow INSERT operations
-- This fixes the 500 Internal Server Error

-- 1. First, let's make sure the table exists and has the correct structure
-- Check if we need to add any missing columns
DO $$
BEGIN
    -- Make sure requested_plan has a default value
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'upgrade_requests'
        AND column_name = 'requested_plan'
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE upgrade_requests
        ALTER COLUMN requested_plan SET DEFAULT 'pro';
    END IF;

    -- Make sure status has a default value
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'upgrade_requests'
        AND column_name = 'status'
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE upgrade_requests
        ALTER COLUMN status SET DEFAULT 'pending';
    END IF;
END $$;

-- 2. Drop and recreate the INSERT policy to fix any issues
DROP POLICY IF EXISTS "Users can create upgrade requests" ON upgrade_requests;

-- Simplified INSERT policy - just check that the user is authenticated
-- and the user_id matches auth.uid()
CREATE POLICY "Users can create upgrade requests"
    ON upgrade_requests FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
    );

-- 3. Make sure users can still SELECT their own requests (for checking pending)
DROP POLICY IF EXISTS "Users can view their own upgrade requests" ON upgrade_requests;

CREATE POLICY "Users can view their own upgrade requests"
    ON upgrade_requests FOR SELECT
    USING (auth.uid() = user_id);

-- 4. Admin policies (keep existing)
DROP POLICY IF EXISTS "Admins can view all upgrade requests" ON upgrade_requests;

CREATE POLICY "Admins can view all upgrade requests"
    ON upgrade_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
            AND is_active = true
        )
    );

DROP POLICY IF EXISTS "Admins can update upgrade requests" ON upgrade_requests;

CREATE POLICY "Admins can update upgrade requests"
    ON upgrade_requests FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
            AND is_active = true
        )
    );

-- 5. Make sure RLS is enabled
ALTER TABLE upgrade_requests ENABLE ROW LEVEL SECURITY;

-- 6. Grant necessary permissions
GRANT SELECT, INSERT ON upgrade_requests TO authenticated;
GRANT ALL ON upgrade_requests TO service_role;

COMMENT ON POLICY "Users can create upgrade requests" ON upgrade_requests IS
'Simplified policy: Users can create upgrade requests for themselves. Duplicate checking is done in application layer.';
