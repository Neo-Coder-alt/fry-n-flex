-- Drop and recreate the insert policy to explicitly allow anon role
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;

CREATE POLICY "anon_insert_orders" ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
