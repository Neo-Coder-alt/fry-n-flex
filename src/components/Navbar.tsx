import { useEffect, useState } from 'react';
import { Flame, Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../lib/cart';
import { useScrollProgress } from '../lib/hooks';

const links = [
  { label: 'Overview', href: '#overview' },
  { label: 'Menu', href: '#menu' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'About', href: '#about' },
  { label: 'Location', href: '#location' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, open: openCart } = useCart();
  const progress = useScrollProgress();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink-950/85 backdrop-blur-xl border-b border-gold-400/15 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="relative grid place-items-center w-10 h-10 rounded-xl bg-gold-400 text-ink-950 shadow-lg shadow-gold-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6">
            <Flame className="w-6 h-6" strokeWidth={2.5} />
            <span className="absolute inset-0 rounded-xl ring-2 ring-gold-300/40 animate-pulse-ring" />
          </span>
          <span className="font-display text-xl tracking-wide">
            FRY<span className="text-gold-400"> N </span>FLEX
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l, i) => (
            <li
              key={l.href}
              className="animate-fade-up"
              style={{ animationDelay: `${0.1 + i * 0.06}s`, opacity: 0 }}
            >
              <a
                href={l.href}
                className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-gold-300 rounded-full hover:bg-white/5 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            className="relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-gold-400 text-ink-950 font-semibold text-sm hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/25 hover:scale-105 active:scale-95"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span
                key={count}
                className="absolute -top-1.5 -right-1.5 grid place-items-center min-w-[20px] h-5 px-1 rounded-full bg-ink-950 text-gold-300 text-xs font-bold border border-gold-400/50 animate-bounce-in"
              >
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden grid place-items-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </span>
          </button>
        </div>
      </nav>

      {/* Scroll progress bar */}
      <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 transition-[width] duration-75 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 mt-3' : 'max-h-0'
        }`}
      >
        <ul className="px-5 pb-4 space-y-1">
          {links.map((l, i) => (
            <li
              key={l.href}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
            >
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-white/80 hover:bg-gold-400/10 hover:text-gold-300 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={() => { setOpen(false); openCart(); }}
              className="block w-full text-center mt-2 px-4 py-3 rounded-lg bg-gold-400 text-ink-950 font-semibold"
            >
              View Cart {count > 0 && `(${count})`}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
