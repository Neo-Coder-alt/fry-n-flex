import { useEffect, useState } from 'react';
import { Star, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { supabase, type Review } from '../../lib/supabase';

const colorMap: Record<string, string> = {
  amber: 'from-gold-400 to-gold-600 text-ink-950',
  rose: 'from-rose-400 to-rose-600 text-white',
  sky: 'from-sky-400 to-sky-600 text-white',
  emerald: 'from-emerald-400 to-emerald-600 text-white',
  violet: 'from-violet-400 to-violet-600 text-white',
};

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

export default function ReviewsPanel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!supabase) return;
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    setReviews((data as Review[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!supabase) return;
    if (!confirm('Delete this review? This cannot be undone.')) return;
    await supabase.from('reviews').delete().eq('id', id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-gold-400" />
        <h2 className="font-display text-2xl">Reviews</h2>
        <span className="px-2.5 py-0.5 rounded-full bg-white/8 text-white/60 text-sm font-medium">{reviews.length}</span>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5 ml-2">
            <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
            <span className="font-semibold text-sm">{avg.toFixed(1)}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-start gap-4 rounded-2xl bg-ink-900 border border-white/10 p-4">
              <span className={`grid place-items-center w-11 h-11 rounded-full bg-gradient-to-br ${colorMap[r.avatar_color] ?? colorMap.amber} font-display text-base shrink-0`}>
                {initials(r.name)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold truncate">{r.name}</p>
                  <span className="text-xs text-white/40 shrink-0">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'fill-gold-400 text-gold-400' : 'fill-white/10 text-white/20'}`} />
                  ))}
                </div>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{r.comment}</p>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/15 text-white/50 hover:text-red-400 transition-colors shrink-0"
                title="Delete review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
