import { supabase, type MenuItem } from '../lib/supabase';

// Fallback used if Supabase is unreachable so the storefront always renders.
const fallbackItems: MenuItem[] = [
  { id: 'smoke-crisp', name: 'Smoke N Crisp Burger', description: 'Smoky flame-grilled patty, crispy onion rings, melted cheese & house sauce on a toasted brioche bun.', price: 690, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800', tag: 'Signature', badge: 'popular', is_active: true, sort_order: 1, created_at: '', updated_at: '' },
  { id: 'arabic-chicken', name: 'Arabic Chicken', description: 'Slow-marinated chicken with Arabic spices, garlic sauce and warm flatbread — a guest favourite.', price: 750, image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800', tag: 'Must Try', badge: 'popular', is_active: true, sort_order: 2, created_at: '', updated_at: '' },
  { id: 'injected-broast', name: 'Injected Broast', description: 'Juicy broasted chicken injected with house marinade, golden crunchy crust and creamy dip.', price: 520, image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800', tag: null, badge: 'new', is_active: true, sort_order: 3, created_at: '', updated_at: '' },
  { id: 'bbq-cheese-fries', name: 'BBQ Cheese Fries', description: 'Crispy fries loaded with smoky BBQ sauce, molten cheese and crunchy toppings.', price: 390, image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800', tag: null, badge: null, is_active: true, sort_order: 4, created_at: '', updated_at: '' },
  { id: 'loaded-fries', name: 'Loaded Flex Fries', description: 'Double-fried fries, cheese sauce, jalapeños, grilled chicken bits and a drizzle of flex sauce.', price: 450, image: 'https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg?auto=compress&cs=tinysrgb&w=800', tag: 'House Special', badge: 'spicy', is_active: true, sort_order: 5, created_at: '', updated_at: '' },
  { id: 'crispy-fries', name: 'Classic Crispy Fries', description: 'Golden, perfectly salted fries — light, fluffy inside and crunch outside.', price: 220, image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800', tag: null, badge: null, is_active: true, sort_order: 6, created_at: '', updated_at: '' },
];

export type { MenuItem };

export async function fetchMenuItems(): Promise<MenuItem[]> {
  if (!supabase) return fallbackItems;
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return fallbackItems;
  return data as MenuItem[];
}
