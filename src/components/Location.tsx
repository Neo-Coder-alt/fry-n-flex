import { MapPin, Navigation, Clock, Share2, Plus, ExternalLink } from 'lucide-react';
import { Reveal } from '../lib/hooks';

export default function Location() {
  const mapsQuery = 'Fry+N+Flex+Master+Plaza+Nazimabad+Karachi';
  const embedSrc = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <section id="location" className="relative py-24 sm:py-32 bg-ink-900/40">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          {/* Info panel */}
          <div className="lg:col-span-5 flex flex-col">
            <Reveal>
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest">Location</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl leading-tight">
              Find us in <span className="text-gradient-gold">Nazimabad</span>
            </h2>
            <p className="mt-4 text-white/65 leading-relaxed">
              We're located at Master Plaza in Block 2, Nazimabad — easy to reach for
              dine-in or a quick takeout pickup.
            </p>
            </Reveal>

            <div className="mt-7 space-y-4">
              <Reveal delay={100}>
              <div className="flex items-start gap-4">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-gold-400/10 text-gold-300 shrink-0">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40 font-semibold">Address</p>
                  <p className="mt-0.5 text-white/85">2B-1, Master Plaza, Block 2 Nazimabad, Karachi, 74600, Pakistan</p>
                  <p className="mt-1 text-sm text-white/45">Plus Code: W25M+4V Nazimabad, Karachi</p>
                </div>
              </div>
              </Reveal>

              <Reveal delay={200}>
              <div className="flex items-start gap-4">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-gold-400/10 text-gold-300 shrink-0">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40 font-semibold">Hours</p>
                  <p className="mt-0.5 text-white/85">Closed · <span className="text-gold-300 font-semibold">Opens 5 PM</span></p>
                </div>
              </div>
              </Reveal>
            </div>

            <Reveal delay={300}>
            <div className="mt-auto pt-8 flex flex-wrap gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold-400 text-ink-950 font-bold hover:bg-gold-300 transition-colors shadow-lg shadow-gold-500/25"
              >
                <Navigation className="w-5 h-5" /> Get directions
              </a>
              <button className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/15 text-white/80 font-medium hover:border-gold-400/40 hover:bg-white/5 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/15 text-white/80 font-medium hover:border-gold-400/40 hover:bg-white/5 transition-colors">
                <Plus className="w-4 h-4" /> Add a label
              </button>
            </div>
            </Reveal>
          </div>

          {/* Map */}
          <div className="lg:col-span-7">
            <Reveal delay={150}>
            <div className="relative h-full min-h-[340px] rounded-3xl overflow-hidden border border-gold-400/20 card-glow group shine-on-hover">
              <iframe
                title="Fry N Flex location map"
                src={embedSrc}
                className="w-full h-full grayscale invert-[0.92] hue-rotate-180 contrast-[0.95] brightness-[0.95] transition-all duration-500 group-hover:grayscale-0 group-hover:invert-0 group-hover:hue-rotate-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, minHeight: '340px' }}
                allowFullScreen
              />
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-ink-950/80 backdrop-blur-md border border-gold-400/30 text-gold-300 text-sm font-medium hover:bg-ink-900 transition-colors"
              >
                Open in Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
