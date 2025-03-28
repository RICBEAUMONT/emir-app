-- Add last_seen_at column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'last_seen_at'
    ) THEN
        ALTER TABLE profiles ADD COLUMN last_seen_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create an index on last_seen_at for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen_at ON profiles(last_seen_at);

-- Update existing profiles with a default last_seen_at value
UPDATE profiles 
SET last_seen_at = created_at 
WHERE last_seen_at IS NULL; 