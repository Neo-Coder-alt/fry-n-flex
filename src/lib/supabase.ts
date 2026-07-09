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
