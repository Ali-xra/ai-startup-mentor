-- ==========================================
-- Table: upgrade_requests
-- Purpose: Store user requests for plan upgrades during beta
-- ==========================================

CREATE TABLE IF NOT EXISTS upgrade_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requested_plan TEXT NOT NULL DEFAULT 'pro', -- 'pro' or 'enterprise'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    admin_notes TEXT,
    expires_at TIMESTAMP WITH TIME ZONE, -- When the granted plan expires (e.g., 1 month from approval)

    -- Audit fields
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected')),
    CONSTRAINT valid_plan CHECK (requested_plan IN ('pro', 'enterprise'))
);

-- Indexes for performance
CREATE INDEX idx_upgrade_requests_user_id ON upgrade_requests(user_id);
CREATE INDEX idx_upgrade_requests_status ON upgrade_requests(status);
CREATE INDEX idx_upgrade_requests_requested_at ON upgrade_requests(requested_at DESC);

-- RLS Policies
ALTER TABLE upgrade_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own upgrade requests"
    ON upgrade_requests FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own requests (only if no pending request exists)
CREATE POLICY "Users can create upgrade requests"
    ON upgrade_requests FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND NOT EXISTS (
            SELECT 1 FROM upgrade_requests
            WHERE user_id = auth.uid()
            AND status = 'pending'
        )
    );

-- Admins can view all requests
CREATE POLICY "Admins can view all upgrade requests"
    ON upgrade_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
            AND is_active = true
        )
    );

-- Admins can update requests
CREATE POLICY "Admins can update upgrade requests"
    ON upgrade_requests FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
            AND is_active = true
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_upgrade_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_upgrade_requests_timestamp
    BEFORE UPDATE ON upgrade_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_upgrade_requests_updated_at();

-- Function to check for expired plans and revert to free
CREATE OR REPLACE FUNCTION check_expired_upgrade_requests()
RETURNS void AS $$
BEGIN
    -- Find all approved requests that have expired
    UPDATE upgrade_requests
    SET
        status = 'expired',
        admin_notes = COALESCE(admin_notes, '') || ' [Auto-expired on ' || NOW()::text || ']'
    WHERE
        status = 'approved'
        AND expires_at IS NOT NULL
        AND expires_at < NOW();

    -- Revoke all features for users with expired requests
    -- (They will automatically fall back to free plan)
    DELETE FROM user_features
    WHERE user_id IN (
        SELECT user_id
        FROM upgrade_requests
        WHERE status = 'expired'
    );
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT ON upgrade_requests TO authenticated;
GRANT ALL ON upgrade_requests TO service_role;

COMMENT ON TABLE upgrade_requests IS 'Stores user requests for plan upgrades during beta period';
COMMENT ON COLUMN upgrade_requests.status IS 'pending: awaiting review, approved: granted access, rejected: denied access, expired: access period ended';
COMMENT ON COLUMN upgrade_requests.expires_at IS 'Date when the granted plan expires (typically 1 month from approval)';
