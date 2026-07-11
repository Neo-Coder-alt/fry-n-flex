import { useEffect, useState } from 'react';
import { Flame, ClipboardList, UtensilsCrossed, MessageSquare, LogOut, ExternalLink, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import OrdersPanel from './OrdersPanel';
import MenuPanel from './MenuPanel';
import ReviewsPanel from './ReviewsPanel';

type Tab = 'orders' | 'menu' | 'reviews';

const tabs: Array<{ id: Tab; label: string; icon: typeof ClipboardList }> = [
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
];

export default function AdminDashboard() {
  const { signOut, session } = useAuth();
  const [tab, setTab] = useState<Tab>('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [tab]);

  return (
    <div className="min-h-screen bg-ink-950 flex">
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-ink-900 border-r border-white/10 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-gold-400 text-ink-950 shadow-lg shadow-gold-500/30">
            <Flame className="w-6 h-6" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg tracking-wide">
            FRY<span className="text-gold-400"> N </span>FLEX
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-gold-400/15 text-gold-300 border border-gold-400/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <t.icon className="w-5 h-5" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="#top"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-gold-300 hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View site
          </a>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
          {session?.user?.email && (
            <p className="px-4 text-xs text-white/30 truncate">{session.user.email}</p>
          )}
        </div>
      </aside>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-ink-950/60 lg:hidden" />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/10 bg-ink-900 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="grid place-items-center w-9 h-9 rounded-lg bg-white/5"
            aria-label="Open menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <span className="font-display text-lg">Admin</span>
          <span className="w-9" />
        </header>

        <main className="flex-1 p-5 sm:p-8 max-w-5xl w-full mx-auto">
          {tab === 'orders' && <OrdersPanel />}
          {tab === 'menu' && <MenuPanel />}
          {tab === 'reviews' && <ReviewsPanel />}
        </main>
      </div>
    </div>
  );
}
