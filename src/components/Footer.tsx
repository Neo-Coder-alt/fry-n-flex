import { Flame, MapPin, Clock, ArrowUp, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-ink-950 border-t border-gold-400/15 pt-16 pb-8 overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-gold-500/8 blur-[120px] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-5">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-gold-400 text-ink-950 shadow-lg shadow-gold-500/30">
                <Flame className="w-6 h-6" strokeWidth={2.5} />
              </span>
              <span className="font-display text-xl tracking-wide">
                FRY<span className="text-gold-400"> N </span>FLEX
              </span>
            </a>
            <p className="mt-4 text-white/55 max-w-sm leading-relaxed">
              Smoky burgers, golden broast & loaded fries fired up fresh in Nazimabad,
              Karachi. Dine-in and takeout available.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-gold-300 hover:border-gold-400/30 hover:bg-gold-400/5 transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              {['Overview', 'Menu', 'Reviews', 'About', 'Location'].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="text-white/70 hover:text-gold-300 transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40">Visit us</h4>
            <ul className="mt-4 space-y-3.5">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <span>2B-1, Master Plaza, Block 2 Nazimabad, Karachi, 74600, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Clock className="w-5 h-5 text-gold-400 shrink-0" />
                <span>Closed · Opens 5 PM</span>
              </li>
            </ul>
            <a
              href="https://www.foodpanda.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center px-5 py-2.5 rounded-full bg-gold-400 text-ink-950 font-semibold text-sm hover:bg-gold-300 transition-colors"
            >
              Order on foodpanda
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Fry N Flex. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#/admin" className="text-sm text-white/30 hover:text-gold-300 transition-colors">
              Admin
            </a>
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-gold-300 transition-colors"
            >
              Back to top <ArrowUp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
