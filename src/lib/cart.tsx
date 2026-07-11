import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { MenuItem } from './supabase';

export type CartItem = MenuItem & { qty: number };

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  open: () => void;
  close: () => void;
  add: (item: MenuItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'frynflex-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  const add = (item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setIsOpen(true);
  };

  const remove = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

  const setQty = (id: string, qty: number) => {
    if (qty <= 0) return remove(id);
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qty * i.price, 0), [items]);

  const value: CartContextValue = {
    items,
    isOpen,
    count,
    subtotal,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    add,
    remove,
    setQty,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
