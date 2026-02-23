import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SectionTitle, GlowCard } from './IslamicPattern';
import { Play, Pause, RotateCcw, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Verse {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  audioUrl: string;
}

// Surah Al-Ikhlas = Surah 112, Ayahs 1-4
// Using EveryAyah CDN with Mishary Rashid Alafasy recitation
// Global ayah numbers for Surah 112: Bismillah area then verses 6221-6224
const RECITER_BASE = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy';
const SURAH_AUDIO_URL = 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3';

const verses: Verse[] = [
  {
    id: 1,
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    transliteration: 'Qul huwa Allahu ahad',
    translation: 'قل: هو الله الواحد الأحد',
    audioUrl: `${RECITER_BASE}/6222.mp3`,
  },
  {
    id: 2,
    arabic: 'اللَّهُ الصَّمَدُ',
    transliteration: 'Allahu as-samad',
    translation: 'الله الذي يحتاج إليه كل شيء ولا يحتاج إلى أحد',
    audioUrl: `${RECITER_BASE}/6223.mp3`,
  },
  {
    id: 3,
    arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    transliteration: 'Lam yalid wa lam yulad',
    translation: 'ليس له ولد وليس له أب أو أم',
    audioUrl: `${RECITER_BASE}/6224.mp3`,
  },
  {
    id: 4,
    arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    transliteration: 'Wa lam yakun lahu kufuwan ahad',
    translation: 'ولا يوجد أحد مثله أبداً',
    audioUrl: `${RECITER_BASE}/6225.mp3`,
  },
];

const BISMILLAH_AUDIO = `${RECITER_BASE}/6221.mp3`;

function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
        resolve();
      };
      audio.onerror = () => {
        setIsPlaying(false);
        reject(new Error('Audio failed to load'));
      };
      audio.play().catch((err) => {
        setIsPlaying(false);
        reject(err);
      });
    });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { play, stop, isPlaying };
}

const SurahFullDisplay: React.FC = () => {
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const { play, stop, isPlaying: isAudioPlaying } = useAudioPlayer();
  const cancelRef = useRef(false);

  const playVerse = useCallback(async (verseId: number) => {
    const verse = verses.find(v => v.id === verseId);
    if (!verse) return;
    setActiveVerse(verseId);
    try {
      await play(verse.audioUrl);
    } catch {
      // Audio failed, just continue
    }
  }, [play]);

  const playAllVerses = useCallback(async () => {
    if (isPlayingAll) {
      cancelRef.current = true;
      stop();
      setIsPlayingAll(false);
      setActiveVerse(null);
      return;
    }

    cancelRef.current = false;
    setIsPlayingAll(true);

    // Play Bismillah first
    setActiveVerse(0);
    try {
      await play(BISMILLAH_AUDIO);
    } catch {
      // Continue even if bismillah fails
    }

    if (cancelRef.current) return;

    // Play each verse
    for (const verse of verses) {
      if (cancelRef.current) break;
      setActiveVerse(verse.id);
      try {
        await play(verse.audioUrl);
      } catch {
        // Continue to next verse
      }
      // Small gap between verses
      if (!cancelRef.current) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    if (!cancelRef.current) {
      setActiveVerse(null);
      setIsPlayingAll(false);
    }
  }, [isPlayingAll, play, stop]);

  const handleVerseClick = useCallback((verseId: number) => {
    if (isPlayingAll) return;
    if (activeVerse === verseId && isAudioPlaying) {
      stop();
      setActiveVerse(null);
    } else {
      playVerse(verseId);
    }
  }, [isPlayingAll, activeVerse, isAudioPlaying, stop, playVerse]);

  return (
    <div>
      <div className="text-center mb-8">
        <p
          className={`font-amiri text-xl md:text-2xl cursor-pointer transition-all duration-500 ${
            activeVerse === 0 ? 'text-gold scale-105' : 'text-gold/80 hover:text-gold'
          }`}
          onClick={async () => {
            if (!isPlayingAll) {
              setActiveVerse(0);
              try { await play(BISMILLAH_AUDIO); } catch { /* ignore */ }
              setActiveVerse(null);
            }
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p className="text-white/30 text-xs font-tajawal mt-2">اضغط على أي آية للاستماع إليها</p>
      </div>

      <div className="space-y-4 mb-8">
        {verses.map((verse) => (
          <div
            key={verse.id}
            onClick={() => handleVerseClick(verse.id)}
            className={`relative p-6 md:p-8 rounded-2xl cursor-pointer transition-all duration-700 border ${
              activeVerse === verse.id
                ? 'bg-gold/10 border-gold/40 shadow-lg shadow-gold/10 scale-[1.02]'
                : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-gold/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                activeVerse === verse.id ? 'bg-gold text-primary-bg' : 'bg-white/10 text-gold'
              }`}>
                {activeVerse === verse.id && isAudioPlaying ? (
                  <Volume2 className="w-4 h-4 animate-pulse" />
                ) : (
                  verse.id
                )}
              </div>
              <div className="flex-1 text-center">
                <p className={`font-amiri text-3xl md:text-5xl leading-[2] transition-all duration-500 ${
                  activeVerse === verse.id ? 'text-gold' : 'text-white'
                }`}>
                  {verse.arabic}
                </p>
                {activeVerse === verse.id && (
                  <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <p className="text-teal-300 text-sm font-tajawal">{verse.transliteration}</p>
                    <p className="text-blue-200/70 text-base font-tajawal">{verse.translation}</p>
                  </div>
                )}
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeVerse === verse.id ? 'bg-gold/20' : 'bg-white/5'
              }`}>
                {activeVerse === verse.id && isAudioPlaying ? (
                  <Pause className="w-4 h-4 text-gold" />
                ) : (
                  <Play className="w-4 h-4 text-white/40" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={playAllVerses}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl font-tajawal font-bold text-lg transition-all duration-300 ${
            isPlayingAll
              ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-gradient-to-r from-gold to-amber-500 text-primary-bg hover:shadow-lg hover:shadow-gold/30 hover:scale-105'
          }`}
        >
          {isPlayingAll ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPlayingAll ? 'إيقاف' : 'تشغيل التلاوة كاملة'}
        </button>
      </div>
    </div>
  );
};

const ListenRepeatMode: React.FC = () => {
  const [currentVerse, setCurrentVerse] = useState(0);
  const [repeatCount, setRepeatCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showMouthGuide, setShowMouthGuide] = useState(false);
  const maxRepeats = 3;
  const { play, stop, isPlaying: isAudioPlaying } = useAudioPlayer();
  const cancelRef = useRef(false);

  const startListening = useCallback(async () => {
    if (isListening) {
      cancelRef.current = true;
      stop();
      setIsListening(false);
      return;
    }

    cancelRef.current = false;
    setIsListening(true);
    setRepeatCount(0);

    const verse = verses[currentVerse];
    for (let i = 0; i < maxRepeats; i++) {
      if (cancelRef.current) break;
      setRepeatCount(i + 1);
      try {
        await play(verse.audioUrl);
      } catch {
        // Continue even if audio fails
      }
      // Gap between repeats
      if (!cancelRef.current && i < maxRepeats - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    if (!cancelRef.current) {
      setIsListening(false);
    }
  }, [isListening, currentVerse, play, stop]);

  const playCurrentVerse = useCallback(async () => {
    const verse = verses[currentVerse];
    try {
      await play(verse.audioUrl);
    } catch {
      // ignore
    }
  }, [currentVerse, play]);

  const goNext = () => {
    if (currentVerse < verses.length - 1) {
      cancelRef.current = true;
      stop();
      setCurrentVerse(currentVerse + 1);
      setRepeatCount(0);
      setIsListening(false);
    }
  };

  const goPrev = () => {
    if (currentVerse > 0) {
      cancelRef.current = true;
      stop();
      setCurrentVerse(currentVerse - 1);
      setRepeatCount(0);
      setIsListening(false);
    }
  };

  const verse = verses[currentVerse];

  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center gap-2">
        {verses.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              i === currentVerse ? 'bg-gold scale-125' : 'bg-white/20 hover:bg-white/40'
            }`}
            onClick={() => {
              cancelRef.current = true;
              stop();
              setCurrentVerse(i);
              setRepeatCount(0);
              setIsListening(false);
            }}
          />
        ))}
      </div>

      <GlowCard className="mb-6 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r from-gold/5 to-teal-500/5 transition-opacity duration-1000 ${isListening ? 'opacity-100' : 'opacity-0'}`} />
        <div className="relative">
          <p className="font-amiri text-4xl md:text-6xl text-white leading-[2] mb-4">
            {verse.arabic}
          </p>
          <p className="text-teal-300 text-sm mb-2 font-tajawal">{verse.transliteration}</p>
          <p className="text-blue-200/60 font-tajawal">{verse.translation}</p>

          {/* Single verse play button */}
          <button
            onClick={(e) => { e.stopPropagation(); playCurrentVerse(); }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-gold text-sm font-tajawal hover:bg-white/15 transition-all"
          >
            <Volume2 className={`w-4 h-4 ${isAudioPlaying && !isListening ? 'animate-pulse' : ''}`} />
            استمع مرة واحدة
          </button>
        </div>

        {isListening && isAudioPlaying && (
          <div className="mt-6 flex justify-center gap-1 animate-in fade-in duration-300">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-gold rounded-full"
                style={{
                  height: `${20 + Math.random() * 30}px`,
                  animation: `pulse 0.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}
      </GlowCard>

      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-sm text-blue-200/60 font-tajawal">التكرار:</span>
        {[...Array(maxRepeats)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
              i < repeatCount
                ? 'bg-green-500 text-white scale-110'
                : 'bg-white/10 text-white/40'
            }`}
          >
            {i + 1}
          </div>
        ))}
        {repeatCount >= maxRepeats && (
          <span className="text-green-400 text-lg mr-2">⭐</span>
        )}
      </div>

      {showMouthGuide && (
        <GlowCard className="mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <h4 className="text-gold font-tajawal font-bold mb-3">🗣️ دليل النطق</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {verse.arabic.split(' ').map((word, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                <p className="font-amiri text-xl text-white mb-1">{word}</p>
                <div className="w-8 h-8 mx-auto bg-gold/20 rounded-full flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-gold" />
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      )}

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goPrev}
          disabled={currentVerse === 0}
          className="p-3 rounded-xl bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={startListening}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-tajawal font-bold transition-all duration-300 ${
            isListening
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-gradient-to-r from-gold to-amber-500 text-primary-bg hover:shadow-lg hover:shadow-gold/30'
          }`}
        >
          {isListening ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isListening ? 'إيقاف' : `استمع وكرّر (${maxRepeats}×)`}
        </button>

        <button
          onClick={() => {
            cancelRef.current = true;
            stop();
            setRepeatCount(0);
            setIsListening(false);
          }}
          className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={goNext}
          disabled={currentVerse === verses.length - 1}
          className="p-3 rounded-xl bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={() => setShowMouthGuide(!showMouthGuide)}
        className="mt-4 text-sm text-gold/70 hover:text-gold transition-colors font-tajawal underline underline-offset-4"
      >
        {showMouthGuide ? 'إخفاء دليل النطق' : '🗣️ عرض دليل النطق'}
      </button>
    </div>
  );
};

const SurahDisplay: React.FC = () => {
  const [mode, setMode] = useState<'display' | 'listen'>('display');

  return (
    <div>
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setMode('display')}
          className={`px-6 py-3 rounded-xl font-tajawal font-bold transition-all duration-300 ${
            mode === 'display'
              ? 'bg-gold text-primary-bg shadow-lg shadow-gold/20'
              : 'bg-white/10 text-white hover:bg-white/15'
          }`}
        >
          📖 عرض السورة
        </button>
        <button
          onClick={() => setMode('listen')}
          className={`px-6 py-3 rounded-xl font-tajawal font-bold transition-all duration-300 ${
            mode === 'listen'
              ? 'bg-gold text-primary-bg shadow-lg shadow-gold/20'
              : 'bg-white/10 text-white hover:bg-white/15'
          }`}
        >
          🎧 استمع وكرّر
        </button>
      </div>

      {mode === 'display' ? <SurahFullDisplay /> : <ListenRepeatMode />}
    </div>
  );
};

export default SurahDisplay;