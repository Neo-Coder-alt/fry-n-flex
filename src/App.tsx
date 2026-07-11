import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import MenuHighlights from './components/MenuHighlights';
import Reviews from './components/Reviews';
import Location from './components/Location';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './lib/cart';
import { AuthProvider, useAuth } from './lib/auth';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

function AdminRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-ink-950">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
      </div>
    );
  }

  return session ? <AdminDashboard /> : <AdminLogin />;
}

export default function App() {
  const hash = useHashRoute();
  const isAdmin = hash.startsWith('#/admin');

  if (isAdmin) {
    return (
      <AuthProvider>
        <AdminRoute />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div id="overview" className="min-h-screen bg-ink-950 text-white">
          <Navbar />
          <main>
            <Hero />
            <Marquee />
            <About />
            <MenuHighlights />
            <Reviews />
            <Location />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
