-- Drop the broken FOR ALL policy
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;

-- Recreate as explicit INSERT-only policy for anon + authenticated
CREATE POLICY "anon_insert_orders" ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
