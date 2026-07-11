import { useEffect, useState } from 'react';
import { UtensilsCrossed, Plus, Pencil, Trash2, X, Loader2, GripVertical, Eye, EyeOff, Save } from 'lucide-react';
import { supabase, type MenuItem } from '../../lib/supabase';

type EditingItem = Partial<MenuItem> & { id?: string };

const emptyItem: EditingItem = {
  name: '',
  description: '',
  price: 0,
  image: '',
  tag: '',
  badge: null,
  is_active: true,
  sort_order: 0,
};

const badgeOptions: Array<{ value: 'spicy' | 'new' | 'popular' | null; label: string }> = [
  { value: null, label: 'None' },
  { value: 'popular', label: 'Popular' },
  { value: 'new', label: 'New' },
  { value: 'spicy', label: 'Spicy' },
];

export default function MenuPanel() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!supabase) return;
    const { data } = await supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
    setItems((data as MenuItem[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing || !supabase) return;
    if (!editing.name || !editing.description || editing.price == null || !editing.image) {
      setError('Name, description, price, and image are required.');
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      name: editing.name,
      description: editing.description,
      price: editing.price,
      image: editing.image,
      tag: editing.tag || null,
      badge: editing.badge ?? null,
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order ?? 0,
      updated_at: new Date().toISOString(),
    };

    if (editing.id) {
      const { error } = await supabase.from('menu_items').update(payload).eq('id', editing.id);
      if (error) { setError(error.message); setSaving(false); return; }
      setItems((prev) => prev.map((i) => (i.id === editing.id ? { ...i, ...payload } as MenuItem : i)));
    } else {
      const { data, error } = await supabase.from('menu_items').insert(payload).select().single();
      if (error) { setError(error.message); setSaving(false); return; }
      setItems((prev) => [...prev, data as MenuItem]);
    }
    setSaving(false);
    setEditing(null);
  }

  async function toggleActive(item: MenuItem) {
    if (!supabase) return;
    const newVal = !item.is_active;
    await supabase.from('menu_items').update({ is_active: newVal, updated_at: new Date().toISOString() }).eq('id', item.id);
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_active: newVal } : i)));
  }

  async function handleDelete(id: string) {
    if (!supabase) return;
    if (!confirm('Delete this menu item? This cannot be undone.')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="w-6 h-6 text-gold-400" />
          <h2 className="font-display text-2xl">Menu Items</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-white/8 text-white/60 text-sm font-medium">{items.length}</span>
        </div>
        <button
          onClick={() => { setEditing({ ...emptyItem }); setError(null); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gold-400 text-ink-950 font-semibold text-sm hover:bg-gold-300 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-ink-900 border border-white/10 p-3.5">
              <GripVertical className="w-5 h-5 text-white/20 shrink-0" />
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{item.name}</p>
                  {item.tag && <span className="px-2 py-0.5 rounded-full bg-gold-400/15 text-gold-300 text-xs font-medium">{item.tag}</span>}
                  {item.badge && <span className="px-2 py-0.5 rounded-full bg-white/8 text-white/60 text-xs">{item.badge}</span>}
                </div>
                <p className="text-sm text-white/50 truncate mt-0.5">{item.description}</p>
                <p className="text-gold-300 font-display text-base mt-1">PKR {item.price}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => toggleActive(item)}
                  className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-gold-300 transition-colors"
                  title={item.is_active ? 'Visible — click to hide' : 'Hidden — click to show'}
                >
                  {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setEditing({ ...item }); setError(null); }}
                  className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-gold-300 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/15 text-white/60 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-5 bg-ink-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-ink-900 border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl">{editing.id ? 'Edit item' : 'New menu item'}</h3>
              <button onClick={() => setEditing(null)} className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Name</label>
                <input value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Description</label>
                <textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3}
                  className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Price (PKR)</label>
                  <input type="number" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: parseInt(e.target.value) || 0 })}
                    className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Sort order</label>
                  <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                    className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition" />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Image URL</label>
                <input value={editing.image ?? ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  placeholder="https://images.pexels.com/…"
                  className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white placeholder:text-white/30 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition" />
              </div>
              {editing.image && (
                <img src={editing.image} alt="Preview" className="w-full h-32 rounded-xl object-cover border border-white/10" />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Tag (optional)</label>
                  <input value={editing.tag ?? ''} onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                    placeholder="e.g. Signature"
                    className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white placeholder:text-white/30 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Badge</label>
                  <select value={editing.badge ?? ''} onChange={(e) => setEditing({ ...editing, badge: (e.target.value || null) as MenuItem['badge'] })}
                    className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition">
                    {badgeOptions.map((b) => (
                      <option key={b.label} value={b.value ?? ''}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  className="w-5 h-5 rounded accent-gold-400" />
                <span className="text-sm text-white/70">Visible on storefront</span>
              </label>

              {error && <p className="text-sm text-red-300">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditing(null)}
                  className="flex-1 px-5 py-3 rounded-xl border border-white/15 text-white/70 font-medium hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold-400 text-ink-950 font-bold hover:bg-gold-300 disabled:opacity-60 transition-colors">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editing.id ? 'Save changes' : 'Create item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
