import { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Loader2, ArrowLeft, MessageCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../lib/cart';
import { supabase } from '../lib/supabase';

const DELIVERY_FEE = 150;
const WHATSAPP_NUMBER = '923302258300';

type CompletedOrder = {
  orderId: string;
  whatsappUrl: string;
  customerName: string;
  total: number;
};

export default function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal, count, clear } = useCart();
  const [stage, setStage] = useState<'cart' | 'checkout' | 'done'>('cart');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<CompletedOrder | null>(null);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setStage('cart'), 300);
      return () => clearTimeout(t);
    }
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0);

  function buildWhatsAppMessage(): string {
    const orderLines = items.map((i) => `${i.name} x${i.qty} — PKR ${i.price * i.qty}`).join('\n');

    const message =
      '🍔 New Order\n' +
      'Customer Name:\n' +
      `${name}\n` +
      'Phone:\n' +
      `${phone}\n` +
      'Address:\n' +
      `${address}\n` +
      'Order:\n' +
      `${orderLines}\n` +
      'Total:\n' +
      `PKR ${total}\n` +
      'Special Instructions:\n' +
      `${notes || 'None'}`;

    return message;
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;
    setSubmitting(true);
    setOrderError(null);

    const orderItems = items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty }));

    let orderId = '';

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_address: address.trim(),
          items: orderItems,
          subtotal,
          delivery_fee: DELIVERY_FEE,
          total,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('[CartDrawer] Order insert failed:', error.message, error);
        setOrderError(error.message || 'Could not save your order. Please try again.');
        setSubmitting(false);
        return;
      }
      orderId = (data as { id: string }).id;
    } else {
      orderId = `local-${Date.now()}`;
    }

    const message = encodeURIComponent(buildWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setCompleted({ orderId, whatsappUrl, customerName: name.trim(), total });
    setSubmitting(false);
    setStage('done');
    clear();
  }

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-[60] bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-ink-900 border-l border-gold-400/20 shadow-2xl shadow-black/60 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            {stage === 'checkout' && (
              <button
                onClick={() => setStage('cart')}
                className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Back to cart"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-gold-400" />
            <h2 className="font-display text-xl">
              {stage === 'cart' && 'Your Order'}
              {stage === 'checkout' && 'Checkout'}
              {stage === 'done' && 'Order Placed'}
            </h2>
            {stage === 'cart' && count > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-gold-400/15 text-gold-300 text-xs font-semibold">{count}</span>
            )}
          </div>
          <button
            onClick={close}
            className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hidden">
          {stage === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-3">
                  <div className="grid place-items-center w-20 h-20 rounded-2xl bg-gold-400/10 text-gold-400/60">
                    <ShoppingBag className="w-9 h-9" />
                  </div>
                  <p className="font-display text-xl">Your cart is empty</p>
                  <p className="text-white/50 text-sm">Add some fries, burgers or broast to get started.</p>
                  <button
                    onClick={close}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-400 text-ink-950 font-semibold text-sm hover:bg-gold-300 transition-colors"
                  >
                    Browse menu
                  </button>
                </div>
              ) : (
                <ul className="px-4 py-4 space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 rounded-2xl bg-ink-800 border border-white/8 p-3">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover object-center shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-sm leading-tight pr-1">{item.name}</h3>
                          <button
                            onClick={() => remove(item.id)}
                            className="text-white/30 hover:text-red-400 transition-colors shrink-0"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gold-300 font-display text-base mt-1">PKR {item.price * item.qty}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center rounded-lg bg-ink-900 border border-white/10">
                            <button
                              onClick={() => setQty(item.id, item.qty - 1)}
                              className="grid place-items-center w-8 h-8 text-white/70 hover:text-gold-300 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                            <button
                              onClick={() => setQty(item.id, item.qty + 1)}
                              className="grid place-items-center w-8 h-8 text-white/70 hover:text-gold-300 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-xs text-white/40">PKR {item.price} each</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {stage === 'checkout' && (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="px-5 py-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Full name</label>
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
                <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Phone number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  type="tel"
                  maxLength={20}
                  placeholder="03XX-XXXXXXX"
                  className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white placeholder:text-white/30 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Delivery address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  maxLength={200}
                  rows={3}
                  placeholder="House #, street, area, Karachi"
                  className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white placeholder:text-white/30 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition resize-none"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Special instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={300}
                  rows={2}
                  placeholder="e.g. extra spicy, no onions, call on arrival"
                  className="mt-1.5 w-full px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white placeholder:text-white/30 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition resize-none"
                />
              </div>
              <div className="rounded-2xl bg-ink-800 border border-white/8 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span><span className="tabular-nums">PKR {subtotal}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Delivery fee</span><span className="tabular-nums">PKR {DELIVERY_FEE}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-white/10">
                  <span>Total</span><span className="text-gold-300 tabular-nums">PKR {total}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-emerald-500/10 border border-emerald-400/20 p-3">
                <MessageCircle className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200/90">
                  Placing your order opens WhatsApp with your order details pre-filled. Just hit send to confirm. Cash on delivery.
                </p>
              </div>
              {orderError && (
                <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-400/20 p-3">
                  <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{orderError}</p>
                </div>
              )}
            </form>
          )}

          {stage === 'done' && completed && (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-4">
              <div className="grid place-items-center w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-display text-2xl">Order placed!</h3>
              <p className="text-white/60 text-sm max-w-xs">
                WhatsApp opened in a new tab with your order details. Just hit send to confirm with the restaurant.
              </p>
              <p className="text-white/50 text-sm max-w-xs">
                Order reference: <span className="text-gold-300 font-mono">#{completed.orderId.slice(0, 8).toUpperCase()}</span> · PKR {completed.total}
              </p>
              <a
                href={completed.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/25"
              >
                <MessageCircle className="w-5 h-5" /> Re-open WhatsApp
              </a>
              <button
                onClick={close}
                className="mt-1 text-sm text-white/50 hover:text-gold-300 transition-colors"
              >
                Back to menu
              </button>
            </div>
          )}
        </div>

        {stage === 'cart' && items.length > 0 && (
          <div className="shrink-0 border-t border-white/10 p-5 space-y-3 bg-ink-900">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Subtotal</span>
              <span className="font-semibold tabular-nums">PKR {subtotal}</span>
            </div>
            <button
              onClick={() => setStage('checkout')}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-400 text-ink-950 font-bold hover:bg-gold-300 transition-colors"
            >
              Checkout <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {stage === 'checkout' && (
          <div className="shrink-0 border-t border-white/10 p-5 bg-ink-900">
            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-400 text-ink-950 font-bold hover:bg-gold-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Placing order…</>
              ) : (
                <><MessageCircle className="w-5 h-5" /> Place order on WhatsApp</>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
