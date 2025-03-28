-- Add role column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Create an index on role for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Update existing profiles with a default role if they don't have one
UPDATE profiles 
SET role = 'user' 
WHERE role IS NULL;

-- Add a check constraint to ensure role is one of the allowed values
ALTER TABLE profiles 
ADD CONSTRAINT valid_role 
CHECK (role IN ('admin', 'user', 'moderator')); 