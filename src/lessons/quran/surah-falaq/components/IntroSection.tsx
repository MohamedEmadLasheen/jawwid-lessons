import React from 'react';

interface IntroSectionProps {
  onStart: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onStart }) => {
  return (
    <section id="intro" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
      {/* Logo */}
      <div className="mb-6 animate-bounce-slow">
        <img
          src="/assets/jawwid-logo-official.jpg"
          alt="أكاديمية جوّد - Jawwid Academy"
          className="w-32 h-32 rounded-full mx-auto shadow-2xl border-4 border-amber-400/50 object-cover"
        />
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
        أكاديمية جَوِّد
      </h1>
      <p className="text-lg text-amber-300 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>Jawwid Academy</p>
      <p className="text-white/60 text-sm mb-8">✨ عِلمٌ يُنتَفَعُ بِه ✨</p>

      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
        🌟 مرحباً بك يا بطل! 🌟
      </h2>
      <p className="text-white/80 text-lg mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
        هيا نبدأ رحلة ممتعة مع القرآن الكريم!
      </p>
      <p className="text-white/60 mb-8" style={{ fontFamily: 'Cairo, sans-serif' }}>
        سنتعلّم معًا سورة الفلق، نلعب، ونحفظ كلام الله
      </p>

      {/* Icons */}
      <div className="flex gap-6 text-4xl mb-8">
        <span className="animate-pulse">📖</span>
        <span className="animate-pulse delay-100">🌙</span>
        <span className="animate-pulse delay-200">⭐</span>
        <span className="animate-pulse delay-300">🕌</span>
      </div>

      <button
        onClick={onStart}
        className="bg-gradient-to-l from-amber-500 to-orange-500 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300 hover:shadow-amber-500/30"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        ابدأ الرحلة
      </button>
    </section>
  );
};

export default IntroSection;