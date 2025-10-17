-- ==========================================
-- Complete Auth & Role System Fix
-- Run this in Supabase Dashboard → SQL Editor
-- ==========================================

-- Step 1: Add 'role' column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'entrepreneur'
CHECK (role IN ('entrepreneur', 'investor'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Step 2: Update existing profiles (if any) to have default role
UPDATE profiles
SET role = 'entrepreneur'
WHERE role IS NULL;

-- Step 3: Drop existing RLS policies (to recreate them properly)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

DROP POLICY IF EXISTS "Investors can view their own profile" ON investor_profiles;
DROP POLICY IF EXISTS "Investors can insert their own profile" ON investor_profiles;
DROP POLICY IF EXISTS "Investors can update their own profile" ON investor_profiles;

-- Step 4: Create proper RLS policies for profiles table
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 5: Create proper RLS policies for investor_profiles table
CREATE POLICY "Investors can view their own profile"
ON investor_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Investors can insert their own profile"
ON investor_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Investors can update their own profile"
ON investor_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 6: Ensure RLS is enabled on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON investor_profiles TO authenticated;

-- Verification queries (optional - to check everything is set up correctly)
-- Uncomment these to verify:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';
-- SELECT policyname, tablename FROM pg_policies WHERE tablename IN ('profiles', 'investor_profiles');
