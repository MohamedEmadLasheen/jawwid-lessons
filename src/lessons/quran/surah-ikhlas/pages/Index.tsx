import React, { useState, useEffect, useRef } from 'react';
import { IslamicPattern, SectionTitle } from '../components/IslamicPattern';
import SurahDisplay from '../components/SurahDisplay';
import WordMeanings from '../components/WordMeanings';
import TajweedRules from '../components/TajweedRules';
import InteractiveGames from '../components/InteractiveGames';
import MemorizationPlan from '../components/MemorizationPlan';
import { Play, ChevronDown, Menu, X } from 'lucide-react';

const sections = [
  { id: 'hero', label: 'الرئيسية' },
  { id: 'surah', label: 'السورة' },
  { id: 'meanings', label: 'المعاني' },
  { id: 'tajweed', label: 'التجويد' },
  { id: 'games', label: 'الألعاب' },
  { id: 'memorize', label: 'الحفظ' },
];

const FloatingNav: React.FC<{ activeSection: string }> = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-1 bg-primary-bg/80 backdrop-blur-xl border border-white/10 rounded-2xl px-2 py-2 shadow-2xl">
        
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`px-4 py-2 rounded-xl font-tajawal text-sm font-bold transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-gold text-primary-bg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-primary-bg/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl"
        >
          {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          <img src="https://mgx-backend-cdn.metadl.com/generate/images/936477/2026-02-16/e952ce5a-17ea-4183-9ae1-5a6eab8d7698.png" alt="جوّد" className="w-6 h-6 rounded-lg object-cover" />
        </button>
        {isOpen && (
          <div className="absolute top-full mt-2 right-0 bg-primary-bg/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-300">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`w-full text-right px-4 py-2.5 rounded-xl font-tajawal text-sm font-bold transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-gold text-primary-bg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

const HeroSection: React.FC = () => {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <IslamicPattern opacity={0.06} />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Logo */}
        <div className={`mb-8 transition-all duration-1000 ${showIntro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gold/20 rounded-3xl blur-xl" />
            
          </div>
          <p className="font-tajawal tracking-wider mt-[16px] mr-[0px] mb-[0px] ml-[0px] pt-[0px] pr-[0px] pb-[0px] pl-[0px] rounded-none text-[14px] font-normal text-center text-[#D4A853B3] bg-[#00000000] opacity-100">علمٌ ينتفع به</p>
        </div>

        {/* Surah Name */}
        <div className={`transition-all duration-1000 delay-300 ${showIntro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-amiri text-5xl md:text-7xl lg:text-8xl text-white mb-4 leading-tight">
            سورة الإخلاص
          </h1>
          <p className="text-gold/80 font-tajawal text-lg md:text-xl mb-2">Surah Al-Ikhlas</p>
          <p className="text-blue-200/50 font-tajawal text-sm">سورة مكية • 4 آيات • الجزء الثلاثون</p>
        </div>

        {/* Intro text */}
        <div className={`mt-8 transition-all duration-1000 delay-500 ${showIntro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-blue-200/70 font-tajawal text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            هيا نتعلم معاً سورة الإخلاص! 🌟
            <br />
            هذه السورة العظيمة تعلمنا عن الله الواحد الأحد، وهي تعدل ثلث القرآن الكريم!
          </p>
        </div>

        {/* Play button */}
        <div className={`mt-10 transition-all duration-1000 delay-700 ${showIntro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => document.getElementById('surah')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold to-amber-500 text-primary-bg rounded-2xl font-tajawal font-bold text-lg hover:shadow-2xl hover:shadow-gold/30 transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <Play className="relative w-6 h-6" />
            <span className="relative">ابدأ التعلّم</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className={`mt-16 transition-all duration-1000 delay-1000 ${showIntro ? 'opacity-100' : 'opacity-0'}`}>
          <ChevronDown className="w-6 h-6 text-white/30 mx-auto animate-bounce" />
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-gold/10 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-gold/10 rounded-bl-3xl" />
    </section>
  );
};

const SectionWrapper: React.FC<{
  id: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className = '' }) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-16 md:py-24 px-4 md:px-8 ${className}`}
    >
      <IslamicPattern opacity={0.03} />
      <div className={`relative z-10 max-w-4xl mx-auto transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        {children}
      </div>
    </section>
  );
};

export default function SurahAlIkhlasPage() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-primary-bg text-white font-tajawal" dir="rtl">
      <FloatingNav activeSection={activeSection} />

      <HeroSection />

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <SectionWrapper id="surah">
        <SectionTitle
          title="سورة الإخلاص"
          subtitle="استمع واقرأ السورة الكريمة"
          icon="📖"
        />
        <SurahDisplay />
      </SectionWrapper>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <SectionWrapper id="meanings">
        <SectionTitle
          title="معاني الكلمات"
          subtitle="اكتشف معنى كل كلمة في السورة"
          icon="💡"
        />
        <WordMeanings />
      </SectionWrapper>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <SectionWrapper id="tajweed">
        <SectionTitle
          title="اكتشف وتعلّم"
          subtitle="أحكام التجويد والقصة والفضل"
          icon="🎨"
        />
        <TajweedRules />
      </SectionWrapper>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <SectionWrapper id="games">
        <SectionTitle
          title="ألعاب تفاعلية"
          subtitle="تعلّم وأنت تلعب!"
          icon="🎮"
        />
        <InteractiveGames />
      </SectionWrapper>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <SectionWrapper id="memorize">
        <SectionTitle
          title="خطة الحفظ"
          subtitle="خطة 7 أيام لحفظ السورة"
          icon="📅"
        />
        <MemorizationPlan />
      </SectionWrapper>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-white/10">
        <IslamicPattern opacity={0.03} />
        <div className="relative z-10 text-center">
          
          <h3 className="text-gold font-tajawal font-bold text-xl mb-1">أكاديمية جوّد</h3>
          <p className="text-gold/60 font-tajawal text-sm mb-1">Jawwid Academy</p>
          <p className="text-white/40 font-tajawal text-xs">علمٌ ينتفع به</p>
          <div className="mt-6 w-16 h-0.5 bg-gold/20 mx-auto" />
          <p className="mt-4 text-white/20 font-tajawal text-xs">
            © {new Date().getFullYear()} أكاديمية جوّد - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}