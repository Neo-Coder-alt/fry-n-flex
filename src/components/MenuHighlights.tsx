import { Flame, Plus } from 'lucide-react';
import { menuItems, type MenuItem } from '../data/menu';

const badgeStyles: Record<NonNullable<MenuItem['badge']>, string> = {
  spicy: 'bg-red-500/15 text-red-300 border-red-400/30',
  new: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  popular: 'bg-gold-400/15 text-gold-300 border-gold-400/30',
};

const badgeLabel: Record<NonNullable<MenuItem['badge']>, string> = {
  spicy: 'Spicy',
  new: 'New',
  popular: 'Popular',
};

export default function MenuHighlights() {
  return (
    <section id="menu" className="relative py-24 sm:py-32 bg-ink-900/40">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest">Menu</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl leading-tight">
              Menu <span className="text-gradient-gold">highlights</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-md">
              A taste of what's firing on the grill. Tap any dish to build your order.
            </p>
          </div>
          <a
            href="#order"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gold-400/30 text-gold-300 font-semibold text-sm hover:bg-gold-400/10 transition-colors self-start"
          >
            See full menu <Flame className="w-4 h-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, i) => (
            <article
              key={item.id}
              className="group relative rounded-3xl bg-ink-900 border border-white/10 overflow-hidden card-glow transition-all duration-500 hover:-translate-y-1.5 animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
                {item.badge && (
                  <span className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${badgeStyles[item.badge]}`}>
                    {badgeLabel[item.badge]}
                  </span>
                )}
                {item.tag && (
                  <span className="absolute bottom-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-gold-400 text-ink-950 text-xs font-bold">
                    {item.tag}
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl leading-tight">{item.name}</h3>
                  <span className="shrink-0 font-display text-lg text-gold-300">PKR {item.price}</span>
                </div>
                <p className="mt-2.5 text-sm text-white/55 leading-relaxed">{item.description}</p>
                <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-200 transition-colors">
                  <Plus className="w-4 h-4" /> Add to order
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
