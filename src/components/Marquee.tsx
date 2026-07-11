import { Flame } from 'lucide-react';

const items = [
  'SMOKY BURGERS',
  'GOLDEN BROAST',
  'LOADED FRIES',
  'ARABIC CHICKEN',
  'INJECTED BROAST',
  'FRESH DAILY',
  'DINE-IN',
  'TAKEOUT',
  'NAZIMABAD',
  'KARACHI',
];

export default function Marquee() {
  return (
    <div className="relative bg-gold-400 text-ink-950 py-4 overflow-hidden border-y border-gold-300/40">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6">
            <span className="font-display text-lg font-bold tracking-wide">{item}</span>
            <Flame className="w-5 h-5 shrink-0" strokeWidth={2.5} />
          </span>
        ))}
      </div>
    </div>
  );
}
