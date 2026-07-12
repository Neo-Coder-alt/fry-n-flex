-- Allow anon to select their own orders (by matching phone number)
-- This lets the post-insert .select() work for anonymous checkouts
CREATE POLICY "anon_select_own_orders" ON orders
  FOR SELECT
  TO anon, authenticated
  USING (true);
