import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;

export type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar_color: string;
  created_at: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag: string | null;
  badge: 'spicy' | 'new' | 'popular' | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
};
