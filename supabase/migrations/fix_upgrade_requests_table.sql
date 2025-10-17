-- ==========================================
-- FIX: upgrade_requests table
-- این فایل جدول upgrade_requests را از نو می‌سازد
-- ==========================================

-- حذف جدول قدیمی (اگر وجود داشته باشد)
DROP TABLE IF EXISTS upgrade_requests CASCADE;

-- ساخت جدول جدید
CREATE TABLE upgrade_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requested_plan TEXT NOT NULL DEFAULT 'pro',
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    expires_at TIMESTAMPTZ,

    requested_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    CONSTRAINT valid_plan CHECK (requested_plan IN ('pro', 'enterprise'))
);

-- Indexes
CREATE INDEX idx_upgrade_requests_user_id ON upgrade_requests(user_id);
CREATE INDEX idx_upgrade_requests_status ON upgrade_requests(status);
CREATE INDEX idx_upgrade_requests_requested_at ON upgrade_requests(requested_at DESC);

-- Enable RLS
ALTER TABLE upgrade_requests ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own requests
DROP POLICY IF EXISTS "Users can view own requests" ON upgrade_requests;
CREATE POLICY "Users can view own requests"
    ON upgrade_requests
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy 2: Users can create their own requests (only if no pending)
DROP POLICY IF EXISTS "Users can create requests" ON upgrade_requests;
CREATE POLICY "Users can create requests"
    ON upgrade_requests
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND NOT EXISTS (
            SELECT 1 FROM upgrade_requests
            WHERE user_id = auth.uid()
            AND status = 'pending'
        )
    );

-- Policy 3: Admins can view all requests
DROP POLICY IF EXISTS "Admins can view all" ON upgrade_requests;
CREATE POLICY "Admins can view all"
    ON upgrade_requests
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
            AND is_active = true
        )
    );

-- Policy 4: Admins can update requests
DROP POLICY IF EXISTS "Admins can update" ON upgrade_requests;
CREATE POLICY "Admins can update"
    ON upgrade_requests
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
            AND is_active = true
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_upgrade_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_upgrade_requests_timestamp ON upgrade_requests;
CREATE TRIGGER trigger_update_upgrade_requests_timestamp
    BEFORE UPDATE ON upgrade_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_upgrade_requests_updated_at();

-- Grant permissions
GRANT SELECT, INSERT ON upgrade_requests TO authenticated;
GRANT ALL ON upgrade_requests TO service_role;

-- Comment
COMMENT ON TABLE upgrade_requests IS 'درخواست‌های ارتقا پلن کاربران در دوره بتا';

-- ==========================================
-- DONE!
-- ==========================================
