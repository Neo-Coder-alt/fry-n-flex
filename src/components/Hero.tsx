import { useEffect, useRef, useState } from 'react';
import { Star, MapPin, Clock, UtensilsCrossed, ShoppingBag, ArrowRight, ExternalLink } from 'lucide-react';
import { useCart } from '../lib/cart';

export default function Hero() {
  const { open: openCart, count } = useCart();
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const parallax = (factor: number) => `translateY(${scrollY * factor}px)`;

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-ink-950" />
      <div
        className="absolute inset-0 bg-grid opacity-60"
        style={{ transform: parallax(0.15) }}
      />
      <div
        className="absolute -top-40 -right-40 w-[42rem] h-[42rem] rounded-full bg-gold-500/20 blur-[140px]"
        style={{ transform: parallax(0.08) }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-gold-600/10 blur-[120px]"
        style={{ transform: parallax(0.12) }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/0 via-ink-950/40 to-ink-950" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left: content */}
        <div className="lg:col-span-7">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-300 text-xs font-semibold tracking-wide uppercase animate-fade-up"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-gold-400 animate-ping opacity-75" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-gold-400" />
            </span>
            Nazimabad · Karachi
          </span>

          <h1
            className="mt-6 font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.92] animate-fade-up"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            FRY <span className="text-gradient-gold">N</span> FLEX
          </h1>

          <p
            className="mt-5 text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.3s', opacity: 0 }}
          >
            Smoky burgers, golden broast & loaded fries fired up fresh in the heart
            of Nazimabad. Comfort food that flexes big flavour.
          </p>

          {/* Quick stats */}
          <div
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 animate-fade-up"
            style={{ animationDelay: '0.4s', opacity: 0 }}
          >
            <div className="flex items-center gap-1.5 group">
              <Star className="w-5 h-5 fill-gold-400 text-gold-400 transition-transform group-hover:rotate-72 group-hover:scale-110" />
              <span className="font-semibold text-lg">4.0</span>
              <span className="text-white/50 text-sm">· 3 reviews</span>
            </div>
            <span className="hidden sm:block w-px h-5 bg-white/15" />
            <span className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold-300 transition-colors cursor-default">
              <UtensilsCrossed className="w-4 h-4 text-gold-300" /> Dine-in
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold-300 transition-colors cursor-default">
              <ShoppingBag className="w-4 h-4 text-gold-300" /> Takeout
            </span>
          </div>

          {/* CTAs */}
          <div
            id="order"
            className="mt-9 flex flex-col sm:flex-row gap-3 animate-fade-up"
            style={{ animationDelay: '0.5s', opacity: 0 }}
          >
            <button
              onClick={openCart}
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gold-400 text-ink-950 font-bold hover:bg-gold-300 transition-all shadow-xl shadow-gold-500/30 hover:scale-[1.02] active:scale-95"
            >
              {count > 0 ? `View cart (${count})` : 'Place an order'}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
            </button>
            <a
              href="https://www.foodpanda.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/15 text-white font-semibold hover:border-gold-400/50 hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-95"
            >
              Order on foodpanda <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Hours strip */}
          <div
            className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-ink-900/70 border border-white/10 backdrop-blur-sm animate-fade-up"
            style={{ animationDelay: '0.6s', opacity: 0 }}
          >
            <Clock className="w-5 h-5 text-gold-400" />
            <span className="text-sm">
              <span className="text-white/50">Closed · </span>
              <span className="font-semibold text-gold-300">Opens 5 PM</span>
            </span>
            <span className="w-px h-4 bg-white/15" />
            <MapPin className="w-5 h-5 text-gold-400" />
            <span className="text-sm text-white/70">Master Plaza, Block 2</span>
          </div>
        </div>

        {/* Right: visual */}
        <div
          className="lg:col-span-5 relative animate-fade-up"
          style={{ animationDelay: '0.35s', opacity: 0 }}
        >
          <div
            className="relative aspect-[4/5] rounded-[2rem] overflow-hidden card-glow border border-gold-400/20 shine-on-hover group"
            style={{ transform: parallax(-0.04) }}
          >
            <img
              src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Fry N Flex signature burger"
              className="w-full h-full object-cover object-center transition-transform duration-[1.2s] group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6">
              <p className="text-xs uppercase tracking-widest text-gold-300 font-semibold">Signature</p>
              <p className="font-display text-3xl mt-1">SMOKE N CRISP</p>
            </div>
          </div>

          {/* Floating price tag */}
          <div
            className="absolute -top-5 -left-5 rounded-2xl bg-gold-400 text-ink-950 px-5 py-3 shadow-xl shadow-gold-500/40 animate-float"
            style={{ transform: parallax(-0.02) }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">From</p>
            <p className="font-display text-2xl leading-none">PKR 220</p>
          </div>

          {/* Floating rating chip */}
          <div
            className="absolute -bottom-5 -right-3 rounded-2xl bg-ink-800 border border-gold-400/30 px-5 py-3 shadow-xl animate-float-slow"
            style={{ animationDelay: '1.5s', transform: parallax(-0.06) }}
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
              ))}
              <Star className="w-4 h-4 fill-gold-400/30 text-gold-400/30" />
            </div>
            <p className="text-xs text-white/60 mt-1">Rated by guests</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s', opacity: 0 }}>
        <span className="text-xs text-white/30 uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/15 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-gold-400 animate-bounce" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-ink-950 to-transparent pointer-events-none" />
    </section>
  );
}
