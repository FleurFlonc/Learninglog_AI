-- ============================================================
-- 001_fix_privacy.sql
-- Doel: is_public-kolom toevoegen aan sessions en de RLS-policy
-- aanpassen zodat privé-sessies niet zichtbaar zijn voor anderen.
-- Voer dit script uit in de Supabase SQL Editor.
-- ============================================================

-- Stap 1: Kolom toevoegen als die nog niet bestaat.
-- DEFAULT true zorgt dat bestaande sessies standaard gedeeld blijven.
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;

-- Stap 2: Bestaande rijen vullen waar de waarde nog NULL is.
-- Dit kan voorkomen als de kolom al bestond maar nog niet overal was ingevuld.
UPDATE sessions
  SET is_public = true
  WHERE is_public IS NULL;

-- Stap 3: Oude SELECT-policy verwijderen die alle sessies zichtbaar maakte.
-- Deze policy gebruikte USING (true), waardoor privé-sessies gewoon opvraagbaar waren.
DROP POLICY IF EXISTS "Teamleden kunnen alle sessies lezen" ON sessions;
DROP POLICY IF EXISTS "Users can view sessions" ON sessions;

-- Stap 4: Nieuwe SELECT-policy aanmaken.
-- Regel: een sessie is zichtbaar als is_public = true OF als het je eigen sessie is.
CREATE POLICY "Teamleden kunnen publieke en eigen sessies lezen"
  ON sessions FOR SELECT
  TO authenticated
  USING (is_public = true OR auth.uid() = user_id);

-- ============================================================
-- Prompts-tabel: hier is geen privacy-kolom nodig.
-- Prompts in de bibliotheek zijn altijd gedeeld met het team.
-- De bestaande policy "Teamleden kunnen alle prompts lezen" blijft intact.
-- ============================================================
