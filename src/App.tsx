import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import MenuHighlights from './components/MenuHighlights';
import Reviews from './components/Reviews';
import Location from './components/Location';
import Footer from './components/Footer';

export default function App() {
  return (
    <div id="overview" className="min-h-screen bg-ink-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <MenuHighlights />
        <Reviews />
        <Location />
      </main>
      <Footer />
    </div>
  );
}
