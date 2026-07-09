/*
# Create reviews table for Fry N Flex (single-tenant, no auth)

1. New Tables
- `reviews`
  - `id` (uuid, primary key)
  - `name` (text, not null) — reviewer display name
  - `rating` (int, not null, 1-5) — star rating
  - `comment` (text, not null) — review body
  - `avatar_color` (text, not null) — accent color for avatar badge
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `reviews`.
- Allow anon + authenticated CRUD because reviews are intentionally public/shared (no sign-in screen).
3. Seed Data
- Inserts the 3 existing Google reviews (Hamna Junaid, Malahim Khan, tayyab qazi) with ratings that average to 4.0.
4. Indexes
- Index on created_at desc for listing newest first.
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  avatar_color text NOT NULL DEFAULT 'amber',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reviews" ON reviews;
CREATE POLICY "anon_select_reviews"
ON reviews FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reviews" ON reviews;
CREATE POLICY "anon_insert_reviews"
ON reviews FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_reviews" ON reviews;
CREATE POLICY "anon_update_reviews"
ON reviews FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_reviews" ON reviews;
CREATE POLICY "anon_delete_reviews"
ON reviews FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews (created_at DESC);

INSERT INTO reviews (name, rating, comment, avatar_color, created_at) VALUES
  ('Hamna Junaid', 3, 'Tried smoke n crisp burger and bbq cheese fries with injected broast. Burger was good. Fries need a good amount of improvement — the ketchup ruined the flavour and made them very soggy. Didn''t find any cheese in there. You should work on the fries.', 'rose', now() - interval '2 months'),
  ('Malahim Khan', 5, 'Please start delivery service in the nearby areas. Or launch this restaurant on Foodpanda. Thank you.', 'sky', now() - interval '3 months'),
  ('tayyab qazi', 4, 'Arabic chicken is really good. Order type: Dine in.', 'emerald', now() - interval '3 months')
ON CONFLICT DO NOTHING;