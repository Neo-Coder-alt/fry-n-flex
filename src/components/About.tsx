import { UtensilsCrossed, ShoppingBag, Clock, MapPin, Phone, Globe, Share2, Navigation, Bookmark } from 'lucide-react';

const features = [
  { icon: UtensilsCrossed, label: 'Dine-in', sub: 'Grab a seat & dig in' },
  { icon: ShoppingBag, label: 'Takeout', sub: 'Quick pickup window' },
];

const infoRows = [
  { icon: MapPin, label: 'Address', value: '2B-1, Master Plaza, Block 2 Nazimabad, Karachi, 74600, Pakistan' },
  { icon: Clock, label: 'Hours', value: 'Closed · Opens 5 PM daily' },
  { icon: Phone, label: 'Phone', value: 'Add place\'s phone number' },
  { icon: Globe, label: 'Website', value: 'Add website' },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: heading + photos */}
          <div className="lg:col-span-6">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest">About</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl leading-tight">
              Comfort food, <span className="text-gradient-gold">fired fresh</span> in Nazimabad.
            </h2>
            <p className="mt-5 text-white/70 text-lg leading-relaxed max-w-xl">
              Fry N Flex is a neighbourhood fast-food spot serving smoky burgers,
              Arabic chicken, injected broast and loaded fries. Whether you dine in
              or grab takeout, expect bold flavour and a generous crunch.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                <img
                  src="https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Arabic chicken"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                <img
                  src="https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Loaded fries"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right: info card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-ink-900 border border-white/10 p-7 sm:p-9 card-glow">
              {/* Service chips */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((f) => (
                  <div key={f.label} className="rounded-2xl bg-ink-800 border border-gold-400/15 p-5 hover:border-gold-400/40 transition-colors">
                    <f.icon className="w-7 h-7 text-gold-400" />
                    <p className="mt-3 font-semibold">{f.label}</p>
                    <p className="text-sm text-white/50">{f.sub}</p>
                  </div>
                ))}
              </div>

              {/* Info rows */}
              <dl className="mt-7 space-y-1">
                {infoRows.map((row) => (
                  <div key={row.label} className="flex items-start gap-4 py-4 border-b border-white/8 last:border-0">
                    <span className="grid place-items-center w-10 h-10 rounded-xl bg-gold-400/10 text-gold-300 shrink-0">
                      <row.icon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs uppercase tracking-wider text-white/40 font-semibold">{row.label}</dt>
                      <dd className="mt-0.5 text-white/85 break-words">{row.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              {/* Action buttons */}
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Fry+N+Flex+Nazimabad+Karachi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gold-400 text-ink-950 font-semibold text-sm hover:bg-gold-300 transition-colors"
                >
                  <Navigation className="w-4 h-4" /> Directions
                </a>
                <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 text-white/80 font-medium text-sm hover:border-gold-400/40 hover:bg-white/5 transition-colors">
                  <Bookmark className="w-4 h-4" /> Save
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 text-white/80 font-medium text-sm hover:border-gold-400/40 hover:bg-white/5 transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
