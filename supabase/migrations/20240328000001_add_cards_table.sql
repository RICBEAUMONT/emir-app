-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);

-- Create index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_cards_created_at ON cards(created_at);

-- Add RLS policies
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own cards
CREATE POLICY "Users can view their own cards"
    ON cards FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own cards
CREATE POLICY "Users can insert their own cards"
    ON cards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own cards
CREATE POLICY "Users can update their own cards"
    ON cards FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own cards
CREATE POLICY "Users can delete their own cards"
    ON cards FOR DELETE
    USING (auth.uid() = user_id); 