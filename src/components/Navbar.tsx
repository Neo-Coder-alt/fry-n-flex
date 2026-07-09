import { useEffect, useState } from 'react';
import { Flame, Menu, X } from 'lucide-react';

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
          <span className="relative grid place-items-center w-10 h-10 rounded-xl bg-gold-400 text-ink-950 shadow-lg shadow-gold-500/30 transition-transform group-hover:scale-110">
            <Flame className="w-6 h-6" strokeWidth={2.5} />
            <span className="absolute inset-0 rounded-xl ring-2 ring-gold-300/40 animate-pulse-ring" />
          </span>
          <span className="font-display text-xl tracking-wide">
            FRY<span className="text-gold-400"> N </span>FLEX
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-gold-300 rounded-full hover:bg-white/5 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#order"
            className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-gold-400 text-ink-950 font-semibold text-sm hover:bg-gold-300 transition-colors shadow-lg shadow-gold-500/25"
          >
            Order Now
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden grid place-items-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 mt-3' : 'max-h-0'
        }`}
      >
        <ul className="px-5 pb-4 space-y-1">
          {links.map((l) => (
            <li key={l.href}>
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
            <a
              href="#order"
              onClick={() => setOpen(false)}
              className="block text-center mt-2 px-4 py-3 rounded-lg bg-gold-400 text-ink-950 font-semibold"
            >
              Order Now
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
