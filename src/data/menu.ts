export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  tag?: string;
  image: string;
  badge?: 'spicy' | 'new' | 'popular';
};

// Prices in PKR — representative, themed around the Nazimabad fast-food spot.
export const menuItems: MenuItem[] = [
  {
    id: 'smoke-crisp',
    name: 'Smoke N Crisp Burger',
    description: 'Smoky flame-grilled patty, crispy onion rings, melted cheese & house sauce on a toasted brioche bun.',
    price: 690,
    tag: 'Signature',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'popular',
  },
  {
    id: 'arabic-chicken',
    name: 'Arabic Chicken',
    description: 'Slow-marinated chicken with Arabic spices, garlic sauce and warm flatbread — a guest favourite.',
    price: 750,
    tag: 'Must Try',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'popular',
  },
  {
    id: 'injected-broast',
    name: 'Injected Broast',
    description: 'Juicy broasted chicken injected with house marinade, golden crunchy crust and creamy dip.',
    price: 520,
    image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'new',
  },
  {
    id: 'bbq-cheese-fries',
    name: 'BBQ Cheese Fries',
    description: 'Crispy fries loaded with smoky BBQ sauce, molten cheese and crunchy toppings.',
    price: 390,
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'loaded-fries',
    name: 'Loaded Flex Fries',
    description: 'Double-fried fries, cheese sauce, jalapeños, grilled chicken bits and a drizzle of flex sauce.',
    price: 450,
    tag: 'House Special',
    image: 'https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'spicy',
  },
  {
    id: 'crispy-fries',
    name: 'Classic Crispy Fries',
    description: 'Golden, perfectly salted fries — light, fluffy inside and crunch outside.',
    price: 220,
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];
