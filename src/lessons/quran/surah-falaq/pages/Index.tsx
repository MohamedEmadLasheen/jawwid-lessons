import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import IntroSection from '../components/IntroSection';
import SurahSection from '../components/SurahSection';
import OrderVerses from '../components/OrderVerses';
import { ChooseWordSection, FixErrorSection, MeaningGamesSection } from '../components/ChooseWord';
import { MeaningsSection, DeepUnderstandingSection, VirtueSection, AchievementSection } from '../components/Meanings';

const SECTION_IDS = ['intro', 'surah', 'order', 'choose', 'fix', 'meanings', 'games', 'deep', 'virtue', 'achievement'];

// Floating particles
const particles = [
  { char: '✦', top: '5%', right: '10%', delay: '0s', duration: '6s' },
  { char: '✧', top: '15%', right: '80%', delay: '1s', duration: '8s' },
  { char: '✨', top: '25%', right: '20%', delay: '2s', duration: '7s' },
  { char: '✨', top: '35%', right: '70%', delay: '0.5s', duration: '9s' },
  { char: '✨', top: '45%', right: '15%', delay: '3s', duration: '6s' },
  { char: '⭐', top: '55%', right: '85%', delay: '1.5s', duration: '8s' },
  { char: '✧', top: '65%', right: '25%', delay: '2.5s', duration: '7s' },
  { char: '✦', top: '10%', right: '50%', delay: '0s', duration: '10s' },
  { char: '✦', top: '75%', right: '60%', delay: '1s', duration: '6s' },
  { char: '⭐', top: '20%', right: '90%', delay: '3.5s', duration: '9s' },
  { char: '✧', top: '80%', right: '30%', delay: '2s', duration: '7s' },
  { char: '✦', top: '40%', right: '45%', delay: '0.5s', duration: '8s' },
  { char: '✧', top: '50%', right: '75%', delay: '1.5s', duration: '6s' },
  { char: '🌟', top: '60%', right: '5%', delay: '3s', duration: '10s' },
  { char: '⭐', top: '70%', right: '55%', delay: '2.5s', duration: '7s' },
  { char: '🌟', top: '85%', right: '40%', delay: '0s', duration: '9s' },
  { char: '✧', top: '90%', right: '70%', delay: '1s', duration: '8s' },
  { char: '✦', top: '30%', right: '35%', delay: '2s', duration: '6s' },
  { char: '✨', top: '8%', right: '65%', delay: '3s', duration: '7s' },
  { char: '⭐', top: '95%', right: '20%', delay: '0.5s', duration: '10s' },
  { char: '✦', top: '12%', right: '40%', delay: '1.5s', duration: '8s' },
  { char: '🌟', top: '48%', right: '90%', delay: '2.5s', duration: '6s' },
  { char: '🌟', top: '72%', right: '10%', delay: '0s', duration: '9s' },
  { char: '⭐', top: '88%', right: '50%', delay: '3.5s', duration: '7s' },
  { char: '⭐', top: '3%', right: '30%', delay: '1s', duration: '8s' },
  { char: '🌟', top: '58%', right: '65%', delay: '2s', duration: '10s' },
  { char: '🌟', top: '38%', right: '85%', delay: '0.5s', duration: '6s' },
];

const moons = [
  { top: '10%', right: '5%', delay: '0s' },
  { top: '30%', right: '92%', delay: '2s' },
  { top: '60%', right: '8%', delay: '4s' },
  { top: '80%', right: '88%', delay: '1s' },
  { top: '45%', right: '50%', delay: '3s' },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState('intro');
  const [completedSections, setCompletedSections] = useState<string[]>(['intro']);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const progress = Math.round((completedSections.length / SECTION_IDS.length) * 100);

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const markComplete = useCallback((id: string) => {
    setCompletedSections((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTION_IDS[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mark sections as visited
  useEffect(() => {
    if (!completedSections.includes(activeSection)) {
      const timer = setTimeout(() => {
        markComplete(activeSection);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeSection, completedSections, markComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes moonFloat {
          0%, 100% { transform: translateY(0px); opacity: 0.15; }
          50% { transform: translateY(-15px); opacity: 0.3; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float var(--duration, 6s) ease-in-out infinite; animation-delay: var(--delay, 0s); }
        .animate-moon { animation: moonFloat 8s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute text-white/30 animate-float"
            style={{
              top: p.top,
              right: p.right,
              '--delay': p.delay,
              '--duration': p.duration,
              fontSize: '0.8rem',
            } as React.CSSProperties}
          >
            {p.char}
          </span>
        ))}
        {moons.map((m, i) => (
          <span
            key={`moon-${i}`}
            className="absolute text-4xl animate-moon"
            style={{
              top: m.top,
              right: m.right,
              animationDelay: m.delay,
              opacity: 0.15,
            }}
          >
            🌙
          </span>
        ))}
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          activeSection={activeSection}
          completedSections={completedSections}
          onSectionClick={scrollToSection}
          progress={progress}
        />
      )}

      {/* Toggle Sidebar Button (mobile) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-[60] bg-white/10 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center md:hidden"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Main Content */}
      <main className={`relative z-10 transition-all duration-300 ${sidebarOpen ? 'mr-64' : ''}`}>
        <IntroSection onStart={() => scrollToSection('surah')} />
        <SurahSection />
        <OrderVerses onComplete={() => markComplete('order')} />
        <ChooseWordSection onComplete={() => markComplete('choose')} />
        <FixErrorSection onComplete={() => markComplete('fix')} />
        <MeaningsSection />
        <MeaningGamesSection onComplete={() => markComplete('games')} />
        <DeepUnderstandingSection />
        <VirtueSection />
        <AchievementSection completedSections={completedSections} progress={progress} />

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <img
              src="/assets/jawwid-logo-official.jpg"
              alt="أكاديمية جوّد"
              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
            />
            <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>أكاديمية جوّد</h3>
            <p className="text-amber-300 text-sm mb-1">Jawwid Academy</p>
            <p className="text-white/40 text-xs">علمٌ ينتفع به ✨</p>
          </div>
        </footer>
      </main>
    </div>
  );
}