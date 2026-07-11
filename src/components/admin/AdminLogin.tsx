import { useState } from 'react';
import { Flame, Lock, Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth';

export default function AdminLogin() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    if (error) setError(error);
    setLoading(false);
  }

  return (
    <div className="min-h-screen grid place-items-center bg-ink-950 px-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-gold-500/15 blur-[140px]" />

      <div className="relative w-full max-w-md">
        <a
          href="#top"
          className="inline-flex items-center gap-2 text-white/50 hover:text-gold-300 transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to site
        </a>

        <div className="rounded-3xl bg-ink-900 border border-white/10 p-8 card-glow">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-gold-400 text-ink-950 shadow-lg shadow-gold-500/30 mb-4">
              <Flame className="w-7 h-7" strokeWidth={2.5} />
            </span>
            <h1 className="font-display text-3xl">
              FRY<span className="text-gold-400"> N </span>FLEX
            </h1>
            <p className="text-white/50 text-sm mt-1.5">Admin Dashboard</p>
          </div>

          <div className="flex rounded-xl bg-ink-800 p-1 mb-6">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                mode === 'signin' ? 'bg-gold-400 text-ink-950' : 'text-white/60 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                mode === 'signup' ? 'bg-gold-400 text-ink-950' : 'text-white/60 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@frynflex.pk"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white placeholder:text-white/30 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-white placeholder:text-white/30 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 outline-none transition"
                />
              </div>
            </div>

            {error && (
              <p className="flex items-start gap-2 text-sm text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-400 text-ink-950 font-bold hover:bg-gold-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Please wait…</>
              ) : (
                mode === 'signin' ? 'Sign in' : 'Create account'
              )}
            </button>
          </form>

          <p className="mt-5 text-xs text-white/40 text-center">
            {mode === 'signin'
              ? 'Use the email and password you registered with.'
              : 'Create an admin account to manage orders, menu, and reviews.'}
          </p>
        </div>
      </div>
    </div>
  );
}
