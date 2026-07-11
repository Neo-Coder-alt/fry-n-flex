import { useEffect, useMemo, useState } from 'react';
import { Star, PenLine, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, type Review } from '../lib/supabase';
import { Reveal } from '../lib/hooks';

const colorMap: Record<string, string> = {
  amber: 'from-gold-400 to-gold-600 text-ink-950',
  rose: 'from-rose-400 to-rose-600 text-white',
  sky: 'from-sky-400 to-sky-600 text-white',
  emerald: 'from-emerald-400 to-emerald-600 text-white',
  violet: 'from-violet-400 to-violet-600 text-white',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days >= 60) return `${Math.floor(days / 30)} months ago`;
  if (days >= 30) return '1 month ago';
  if (days >= 1) return `${days} days ago`;
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs >= 1) return `${hrs} hours ago`;
  return 'Just now';
}

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= rating ? 'fill-gold-400 text-gold-400' : 'fill-white/10 text-white/20'}
        />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) {
        setError('Database not configured.');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) setError(error.message);
      else setReviews(data as Review[]);
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, []);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  const distribution = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0];
    reviews.forEach((r) => { buckets[5 - r.rating] += 1; });
    return buckets;
  }, [reviews]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !name.trim() || !comment.trim()) return;
    setSubmitting(true);
    setSubmitState('idle');
    const colors = ['amber', 'rose', 'sky', 'emerald', 'violet'];
    const avatar_color = colors[Math.floor(Math.random() * colors.length)];
    const { data, error } = await supabase
      .from('reviews')
      .insert({ name: name.trim(), rating, comment: comment.trim(), avatar_color })
      .select()
      .single();
    setSubmitting(false);
    if (error) {
      setSubmitState('error');
      return;
    }
    setReviews((prev) => [data as Review, ...prev]);
    setName('');
    setComment('');
    setRating(5);
    setSubmitState('success');
    setTimeout(() => setSubmitState('idle'), 3500);
  }

  return (
    <section id="reviews" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest">Reviews</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl leading-tight">
              What guests are <span className="text-gradient-gold">saying</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Summary + form */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <Reveal delay={100}>
            <div className="rounded-3xl bg-ink-900 border border-white/10 p-7 card-glow shine-on-hover">
              <div className="flex items-end gap-4">
                <span className="font-display text-6xl text-gold-300 leading-none">{avg.toFixed(1)}</span>
                <div className="pb-1">
                  <Stars rating={Math.round(avg)} size={18} />
                  <p className="text-sm text-white/50 mt-1">{reviews.length} reviews</p>
                </div>
              </div>

              {/* Distribution */}
              <div className="mt-6 space-y-2">
                {distribution.map((count, i) => {
                  const star = 5 - i;
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs text-white/50 w-3">{star}</span>
                      <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                      <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full bg-gold-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-white/40 w-6 text-right tabular-nums">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            </Reveal>

            {/* Write a review form */}
            <Reveal delay={200}>
            <form onSubmit={handleSubmit} className="rounded-3xl bg-ink-900 border border-white/10 p-7">
              <div className="flex items-center gap-2 mb-5">
                <PenLine className="w-5 h-5 text-gold-400" />
                <h3 className="font-display text-xl">Write a review</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Your name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={60}
                    placeholder="e.g. Ali Raza"
                    className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white placeholder:text-white/30 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Rating</label>
                  <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setRating(i)}
                        className="p-1 transition-transform hover:scale-110"
                        aria-label={`Rate ${i} stars`}
                      >
                        <Star
                          className="w-7 h-7 transition-colors"
                          style={{ color: i <= rating ? '#ffc700' : 'rgba(255,255,255,0.18)' }}
                          fill={i <= rating ? '#ffc700' : 'rgba(255,255,255,0.08)'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Your review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    maxLength={500}
                    rows={4}
                    placeholder="Tell others about your experience…"
                    className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white placeholder:text-white/30 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-400 text-ink-950 font-bold hover:bg-gold-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Posting…</>
                  ) : (
                    <>Post review</>
                  )}
                </button>

                {submitState === 'success' && (
                  <p className="flex items-center gap-2 text-sm text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" /> Thanks! Your review is live.
                  </p>
                )}
                {submitState === 'error' && (
                  <p className="flex items-start gap-2 text-sm text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Couldn't post your review. Please check your connection and try again.</span>
                  </p>
                )}
              </div>
            </form>
            </Reveal>
          </div>

          {/* Review list */}
          <div className="lg:col-span-7 space-y-5">
            {loading && (
              <div className="grid place-items-center py-20 text-white/40">
                <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
              </div>
            )}
            {error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-400/30 p-5 text-red-200 text-sm">
                Couldn't load reviews: {error}
              </div>
            )}
            {!loading && !error && reviews.length === 0 && (
              <p className="text-white/50 text-center py-20">No reviews yet — be the first!</p>
            )}
            {!loading && reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 80} threshold={0.1}>
              <article
                className="rounded-3xl bg-ink-900 border border-white/10 p-6 card-glow hover:border-gold-400/20 hover:-translate-y-1 transition-all duration-300 shine-on-hover"
              >
                <div className="flex items-start gap-4">
                  <span className={`grid place-items-center w-12 h-12 rounded-full bg-gradient-to-br ${colorMap[r.avatar_color] ?? colorMap.amber} font-display text-lg shrink-0`}>
                    {initials(r.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold truncate">{r.name}</p>
                      <span className="text-xs text-white/40">{timeAgo(r.created_at)}</span>
                    </div>
                    <div className="mt-1.5">
                      <Stars rating={r.rating} size={15} />
                    </div>
                    <p className="mt-3 text-white/75 leading-relaxed">{r.comment}</p>
                  </div>
                </div>
              </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
