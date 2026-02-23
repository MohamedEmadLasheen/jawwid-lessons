import React from 'react';

export const IslamicPattern: React.FC<{ className?: string; opacity?: number }> = ({ 
  className = '', 
  opacity = 0.05 
}) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    style={{ opacity }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="islamic-geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M40 0 L80 40 L40 80 L0 40Z" fill="none" stroke="#d4a853" strokeWidth="0.5" />
        <circle cx="40" cy="40" r="15" fill="none" stroke="#d4a853" strokeWidth="0.3" />
        <path d="M20 20 L60 20 L60 60 L20 60Z" fill="none" stroke="#d4a853" strokeWidth="0.3" />
        <circle cx="40" cy="40" r="5" fill="none" stroke="#d4a853" strokeWidth="0.5" />
        <path d="M40 25 L55 40 L40 55 L25 40Z" fill="none" stroke="#d4a853" strokeWidth="0.3" />
      </pattern>
      <pattern id="islamic-stars" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <polygon points="60,10 70,45 105,45 77,65 87,100 60,78 33,100 43,65 15,45 50,45" fill="none" stroke="#d4a853" strokeWidth="0.4" />
        <circle cx="60" cy="60" r="25" fill="none" stroke="#2d8a6e" strokeWidth="0.3" />
        <circle cx="60" cy="60" r="35" fill="none" stroke="#d4a853" strokeWidth="0.2" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic-geo)" />
    <rect width="100%" height="100%" fill="url(#islamic-stars)" opacity="0.5" />
  </svg>
);

export const Bismillah: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`text-center ${className}`}>
    <p className="font-amiri text-2xl md:text-3xl text-gold leading-relaxed">
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </p>
  </div>
);

export const SectionTitle: React.FC<{ title: string; subtitle?: string; icon?: string }> = ({ 
  title, subtitle, icon 
}) => (
  <div className="text-center mb-8 md:mb-12">
    {icon && <span className="text-4xl mb-3 block">{icon}</span>}
    <h2 className="font-tajawal text-2xl md:text-4xl font-bold text-white mb-2">
      {title}
    </h2>
    {subtitle && (
      <p className="font-tajawal text-base md:text-lg text-blue-200/70">{subtitle}</p>
    )}
    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
  </div>
);

export const GlowCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
}> = ({ children, className = '', glowColor = 'gold' }) => {
  const glowClasses = {
    gold: 'hover:shadow-gold/20',
    green: 'hover:shadow-green-500/20',
    teal: 'hover:shadow-teal-500/20',
  };
  return (
    <div className={`bg-card-dark border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:border-gold/30 hover:shadow-xl ${glowClasses[glowColor as keyof typeof glowClasses] || glowClasses.gold} ${className}`}>
      {children}
    </div>
  );
};

export default IslamicPattern;