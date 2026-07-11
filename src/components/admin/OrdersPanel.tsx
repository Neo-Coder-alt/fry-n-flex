import { useEffect, useState } from 'react';
import { ClipboardList, Clock, MapPin, Phone, User, Loader2, ChevronDown, Filter } from 'lucide-react';
import { supabase, type Order, type OrderStatus } from '../../lib/supabase';

const statusConfig: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  pending: { label: 'Pending', color: 'bg-gold-400/15 text-gold-300 border-gold-400/30', dot: 'bg-gold-400' },
  confirmed: { label: 'Confirmed', color: 'bg-sky-500/15 text-sky-300 border-sky-400/30', dot: 'bg-sky-400' },
  preparing: { label: 'Preparing', color: 'bg-violet-500/15 text-violet-300 border-violet-400/30', dot: 'bg-violet-400' },
  delivered: { label: 'Delivered', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30', dot: 'bg-emerald-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/15 text-red-300 border-red-400/30', dot: 'bg-red-400' },
};

const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    if (!supabase) return;
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdating(id);
    if (supabase) {
      await supabase.from('orders').update({ status }).eq('id', id);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
    setUpdating(null);
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-6 h-6 text-gold-400" />
        <h2 className="font-display text-2xl">Orders</h2>
        <span className="px-2.5 py-0.5 rounded-full bg-white/8 text-white/60 text-sm font-medium">{orders.length}</span>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hidden pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'all' ? 'bg-gold-400 text-ink-950' : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          All ({orders.length})
        </button>
        {statusOrder.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === s ? 'bg-gold-400 text-ink-950' : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {statusConfig[s].label} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          <Filter className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No orders {filter !== 'all' ? `with status "${statusConfig[filter as OrderStatus].label}"` : 'yet'}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className="rounded-2xl bg-ink-900 border border-white/10 overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/3 transition-colors"
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusConfig[order.status].dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{order.customer_name}</p>
                      <span className="text-xs text-white/40">#{order.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-white/50 mt-0.5">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} · PKR {order.total} · {timeAgo(order.created_at)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${statusConfig[order.status].color}`}>
                    {statusConfig[order.status].label}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-white/30 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="border-t border-white/8 p-4 space-y-4 animate-fade-up">
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-white/70">
                        <User className="w-4 h-4 text-gold-400/60" /> {order.customer_name}
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <Phone className="w-4 h-4 text-gold-400/60" /> {order.customer_phone}
                      </div>
                      <div className="flex items-start gap-2 text-white/70 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-gold-400/60 shrink-0 mt-0.5" /> {order.customer_address}
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <Clock className="w-4 h-4 text-gold-400/60" /> {new Date(order.created_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="rounded-xl bg-ink-800 p-3 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-white/80">{item.name} <span className="text-white/40">x{item.qty}</span></span>
                          <span className="text-white/60 tabular-nums">PKR {item.price * item.qty}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                        <span className="text-white/50">Delivery</span>
                        <span className="text-white/50 tabular-nums">PKR {order.delivery_fee}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-1">
                        <span>Total</span>
                        <span className="text-gold-300 tabular-nums">PKR {order.total}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-2">Update status</p>
                      <div className="flex flex-wrap gap-2">
                        {statusOrder.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id, s)}
                            disabled={updating === order.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              order.status === s
                                ? statusConfig[s].color + ' scale-105'
                                : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
                            }`}
                          >
                            {updating === order.id ? '…' : statusConfig[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
