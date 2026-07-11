/*
# Create menu_items and orders tables for Fry N Flex admin dashboard

1. New Tables
- `menu_items`
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `description` (text, not null)
  - `price` (int, not null) — price in PKR
  - `image` (text, not null) — image URL
  - `tag` (text, nullable) — e.g. "Signature", "Must Try"
  - `badge` (text, nullable) — one of: spicy, new, popular
  - `is_active` (bool, default true) — admin can toggle visibility without deleting
  - `sort_order` (int, default 0)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
- `orders`
  - `id` (uuid, primary key)
  - `customer_name` (text, not null)
  - `customer_phone` (text, not null)
  - `customer_address` (text, not null)
  - `items` (jsonb, not null) — array of {id, name, price, qty}
  - `subtotal` (int, not null)
  - `delivery_fee` (int, not null)
  - `total` (int, not null)
  - `status` (text, default 'pending') — pending, confirmed, preparing, delivered, cancelled
  - `notes` (text, nullable)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on both tables.
- menu_items: public read (anon + authenticated) so the storefront loads; only authenticated admins can write.
- orders: anyone can insert (placing an order); only authenticated admins can read/update/delete.
  This is intentional: customers submit orders without signing in, but only the admin dashboard can view/manage them.

3. Seed Data
- Inserts the 6 existing menu items from the storefront data file.
*/

-- menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price int NOT NULL CHECK (price >= 0),
  image text NOT NULL,
  tag text,
  badge text CHECK (badge IN ('spicy', 'new', 'popular')),
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Public read for menu_items
DROP POLICY IF EXISTS "anon_select_menu_items" ON menu_items;
CREATE POLICY "anon_select_menu_items"
ON menu_items FOR SELECT
TO anon, authenticated USING (true);

-- Admin write for menu_items
DROP POLICY IF EXISTS "admin_insert_menu_items" ON menu_items;
CREATE POLICY "admin_insert_menu_items"
ON menu_items FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_menu_items" ON menu_items;
CREATE POLICY "admin_update_menu_items"
ON menu_items FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_menu_items" ON menu_items;
CREATE POLICY "admin_delete_menu_items"
ON menu_items FOR DELETE
TO authenticated USING (true);

-- orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  items jsonb NOT NULL,
  subtotal int NOT NULL,
  delivery_fee int NOT NULL,
  total int NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivered', 'cancelled')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Anyone can insert orders (placing an order)
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders"
ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Only authenticated admins can read orders
DROP POLICY IF EXISTS "admin_select_orders" ON orders;
CREATE POLICY "admin_select_orders"
ON orders FOR SELECT
TO authenticated USING (true);

-- Only authenticated admins can update orders
DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders"
ON orders FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated admins can delete orders
DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders"
ON orders FOR DELETE
TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS menu_items_active_idx ON menu_items (is_active, sort_order);
CREATE INDEX IF NOT EXISTS orders_status_created_idx ON orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_created_idx ON orders (created_at DESC);

-- Seed menu items
INSERT INTO menu_items (name, description, price, image, tag, badge, is_active, sort_order) VALUES
  ('Smoke N Crisp Burger', 'Smoky flame-grilled patty, crispy onion rings, melted cheese & house sauce on a toasted brioche bun.', 690, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800', 'Signature', 'popular', true, 1),
  ('Arabic Chicken', 'Slow-marinated chicken with Arabic spices, garlic sauce and warm flatbread — a guest favourite.', 750, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800', 'Must Try', 'popular', true, 2),
  ('Injected Broast', 'Juicy broasted chicken injected with house marinade, golden crunchy crust and creamy dip.', 520, 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800', null, 'new', true, 3),
  ('BBQ Cheese Fries', 'Crispy fries loaded with smoky BBQ sauce, molten cheese and crunchy toppings.', 390, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800', null, null, true, 4),
  ('Loaded Flex Fries', 'Double-fried fries, cheese sauce, jalapeños, grilled chicken bits and a drizzle of flex sauce.', 450, 'https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg?auto=compress&cs=tinysrgb&w=800', 'House Special', 'spicy', true, 5),
  ('Classic Crispy Fries', 'Golden, perfectly salted fries — light, fluffy inside and crunch outside.', 220, 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800', null, null, true, 6)
ON CONFLICT DO NOTHING;