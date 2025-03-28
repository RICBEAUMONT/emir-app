-- Add completed_at column to cards table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'cards' 
    AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE cards ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cards_created_at ON cards(created_at);
CREATE INDEX IF NOT EXISTS idx_cards_completed_at ON cards(completed_at);
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen_at ON profiles(last_seen_at);

-- Add RLS policies for the new columns
ALTER POLICY "Users can view their own cards" ON cards
  USING (auth.uid() = user_id);

ALTER POLICY "Users can insert their own cards" ON cards
  WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Users can update their own cards" ON cards
  USING (auth.uid() = user_id);

-- Add function to update completed_at
CREATE OR REPLACE FUNCTION update_card_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic completed_at updates
DROP TRIGGER IF EXISTS update_card_completion_trigger ON cards;
CREATE TRIGGER update_card_completion_trigger
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_card_completion();

-- Add function to calculate card generation time
CREATE OR REPLACE FUNCTION calculate_card_generation_time(card_id UUID)
RETURNS INTERVAL AS $$
DECLARE
  start_time TIMESTAMP WITH TIME ZONE;
  end_time TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT created_at, completed_at INTO start_time, end_time
  FROM cards
  WHERE id = card_id;
  
  IF end_time IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN end_time - start_time;
END;
$$ LANGUAGE plpgsql;

-- Add view for card statistics
CREATE OR REPLACE VIEW card_statistics AS
SELECT
  COUNT(*) as total_cards,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') as cards_today,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as cards_this_week,
  AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/60) as avg_generation_time_minutes
FROM cards
WHERE completed_at IS NOT NULL;

-- Grant access to the view
GRANT SELECT ON card_statistics TO authenticated; 