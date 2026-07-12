-- Drop all existing insert-related policies
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;

-- Create with explicit INSERT command
CREATE POLICY "orders_insert_policy" ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
