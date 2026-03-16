-- 1. Add is_premium to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false;

-- 2. Create characters table
CREATE TABLE characters (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  class       text NOT NULL,
  level       integer NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 20),
  subclass    text NOT NULL DEFAULT '',
  ability_mod integer NOT NULL DEFAULT 3 CHECK (ability_mod >= 0 AND ability_mod <= 10),
  avatar      text NOT NULL DEFAULT 'default',

  prepared_spell_ids  jsonb NOT NULL DEFAULT '[]'::jsonb,
  current_slots       jsonb NOT NULL DEFAULT '[0,0,0,0,0,0,0,0,0]'::jsonb,
  sorcery_points      integer DEFAULT NULL,
  channel_divinity_uses integer DEFAULT NULL,

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_characters_user_id ON characters(user_id);

-- 3. RLS
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own characters"
  ON characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own characters"
  ON characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
  ON characters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters"
  ON characters FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Character limit trigger
CREATE OR REPLACE FUNCTION check_character_limit()
RETURNS TRIGGER AS $$
DECLARE
  char_count integer;
  user_premium boolean;
  max_chars integer;
BEGIN
  SELECT count(*) INTO char_count
    FROM characters WHERE user_id = NEW.user_id;

  SELECT COALESCE(is_premium, false) INTO user_premium
    FROM profiles WHERE id = NEW.user_id;

  max_chars := CASE WHEN user_premium THEN 10 ELSE 4 END;

  IF char_count >= max_chars THEN
    RAISE EXCEPTION 'Character limit reached (% / %)', char_count, max_chars;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_character_limit
  BEFORE INSERT ON characters
  FOR EACH ROW
  EXECUTE FUNCTION check_character_limit();

-- 5. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
