import React, { useState, useRef, useCallback } from 'react';

const verses = [
  {
    number: 1,
    arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
    tafseer: 'قل يا محمد: ألجأ وأحتمي برب الفجر والصبح',
    // Surah 113 (Al-Falaq), Ayah 1 => Global ayah number: 6226
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6226.mp3',
  },
  {
    number: 2,
    arabic: 'مِن شَرِّ مَا خَلَقَ',
    tafseer: 'من شر جميع المخلوقات',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3',
  },
  {
    number: 3,
    arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
    tafseer: 'ومن شر الليل إذا أظلم واشتد',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6228.mp3',
  },
  {
    number: 4,
    arabic: 'وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ',
    tafseer: 'ومن شر الساحرات اللاتي ينفثن في عُقَد الخيوط',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6229.mp3',
  },
  {
    number: 5,
    arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    tafseer: 'ومن شر كل حاسد إذا حسد',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6230.mp3',
  },
];

const SurahSection: React.FC = () => {
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const fullAudioRef = useRef<HTMLAudioElement | null>(null);
  const verseAudioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any currently playing audio
  const stopAll = useCallback(() => {
    if (fullAudioRef.current) {
      fullAudioRef.current.pause();
      fullAudioRef.current.currentTime = 0;
    }
    if (verseAudioRef.current) {
      verseAudioRef.current.pause();
      verseAudioRef.current.currentTime = 0;
    }
    setIsPlayingFull(false);
    setPlayingVerse(null);
  }, []);

  // Play full surah
  const handlePlaySurah = () => {
    if (isPlayingFull) {
      stopAll();
      return;
    }
    // Stop verse audio if playing
    if (verseAudioRef.current) {
      verseAudioRef.current.pause();
      verseAudioRef.current.currentTime = 0;
      setPlayingVerse(null);
    }

    if (!fullAudioRef.current) {
      fullAudioRef.current = new Audio('https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3');
      fullAudioRef.current.onended = () => {
        setIsPlayingFull(false);
      };
    }
    fullAudioRef.current.currentTime = 0;
    fullAudioRef.current.play();
    setIsPlayingFull(true);
  };

  // Play individual verse
  const handlePlayVerse = (e: React.MouseEvent, verseNumber: number, audioUrl: string) => {
    e.stopPropagation(); // Prevent card click from toggling

    // If same verse is playing, stop it
    if (playingVerse === verseNumber) {
      if (verseAudioRef.current) {
        verseAudioRef.current.pause();
        verseAudioRef.current.currentTime = 0;
      }
      setPlayingVerse(null);
      return;
    }

    // Stop full surah if playing
    if (fullAudioRef.current && isPlayingFull) {
      fullAudioRef.current.pause();
      fullAudioRef.current.currentTime = 0;
      setIsPlayingFull(false);
    }

    // Stop previous verse audio
    if (verseAudioRef.current) {
      verseAudioRef.current.pause();
      verseAudioRef.current.currentTime = 0;
    }

    // Create and play new verse audio
    verseAudioRef.current = new Audio(audioUrl);
    verseAudioRef.current.onended = () => {
      setPlayingVerse(null);
    };
    verseAudioRef.current.onerror = () => {
      setPlayingVerse(null);
    };
    verseAudioRef.current.play();
    setPlayingVerse(verseNumber);
    setActiveVerse(verseNumber);
  };

  return (
    <section id="surah" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
            <span className="text-2xl">📖</span>
            <span className="text-white font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>السورة</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>السورة</h2>
          <p className="text-white/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
            استمع وردد سورة الفلق كاملة أو اضغط على 🔊 لسماع كل آية على حدة
          </p>
        </div>

        {/* Play Full Surah Button */}
        <button
          onClick={handlePlaySurah}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg mb-8 transition-all duration-300 ${
            isPlayingFull
              ? 'bg-gradient-to-l from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
              : 'bg-gradient-to-l from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:scale-[1.02]'
          }`}
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          <span className="text-2xl">🔊</span>
          {isPlayingFull ? 'إيقاف ⏸️' : 'تشغيل السورة كاملة 🔊'}
        </button>

        {/* Bismillah */}
        <div className="text-center mb-8">
          <p className="text-2xl text-amber-300 font-bold" style={{ fontFamily: 'Amiri, serif' }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
        </div>

        {/* Verses */}
        <div className="space-y-4">
          {verses.map((verse) => {
            const isVerseActive = playingVerse === verse.number;
            return (
              <div
                key={verse.number}
                onClick={() => setActiveVerse(activeVerse === verse.number ? null : verse.number)}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/15 border border-white/5 ${
                  activeVerse === verse.number ? 'ring-2 ring-amber-400/50 bg-white/15' : ''
                } ${isVerseActive ? 'ring-2 ring-green-400/50 bg-green-500/5' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {verse.number}
                  </div>
                  <div className="flex-1">
                    <p className="text-xl md:text-2xl text-white font-bold mb-2 leading-loose" style={{ fontFamily: 'Amiri, serif' }}>
                      {verse.arabic}
                    </p>
                    <p className="text-white/60 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {verse.tafseer}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handlePlayVerse(e, verse.number, verse.audioUrl)}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                      isVerseActive
                        ? 'bg-green-500/30 text-green-300 animate-pulse'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                    title={isVerseActive ? 'إيقاف' : `تشغيل الآية ${verse.number}`}
                  >
                    <span className="text-lg">{isVerseActive ? '⏸️' : '🔊'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SurahSection;