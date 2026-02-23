import { useState, useEffect, useRef, useCallback } from "react";

// ============ SOUND EFFECTS ============
const AudioCtxRef = { ctx: null as AudioContext | null };

function getAudioCtx(): AudioContext {
  if (!AudioCtxRef.ctx) {
    AudioCtxRef.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return AudioCtxRef.ctx;
}

function playCorrectSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    // Happy ascending notes
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch { /* silent fail */ }
}

function playWrongSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    // Descending buzz
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.setValueAtTime(200, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch { /* silent fail */ }
}

function playSectionCompleteSound() {
  try {
    const ctx = getAudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      const startTime = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
      osc.frequency.setValueAtTime(freq, startTime);
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch { /* silent fail */ }
}

function playClickSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch { /* silent fail */ }
}

function playAchievementSound() {
  try {
    const ctx = getAudioCtx();
    const melody = [523.25, 659.25, 783.99, 659.25, 783.99, 1046.50]; // Fanfare
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      const startTime = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
      osc.frequency.setValueAtTime(freq, startTime);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  } catch { /* silent fail */ }
}

// ============ DATA ============
const VERSES = [
  { id: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", translation: "قل يا محمد: ألجأ وأحتمي برب الناس" },
  { id: 2, arabic: "مَلِكِ ٱلنَّاسِ", translation: "مالك الناس والمتصرف في شؤونهم" },
  { id: 3, arabic: "إِلَـٰهِ ٱلنَّاسِ", translation: "معبود الناس الحق الذي لا إله غيره" },
  { id: 4, arabic: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", translation: "من شر الشيطان الذي يوسوس ويختفي عند ذكر الله" },
  { id: 5, arabic: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ", translation: "الذي يلقي الأفكار السيئة في قلوب الناس" },
  { id: 6, arabic: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", translation: "سواء كان من الجن أو من الإنس" },
];

const WORD_MEANINGS: { verseId: number; words: { arabic: string; meaning: string; transliteration: string }[] }[] = [
  {
    verseId: 1,
    words: [
      { arabic: "قُلْ", meaning: "قُل يا محمد", transliteration: "Qul" },
      { arabic: "أَعُوذُ", meaning: "ألجأ وأحتمي", transliteration: "A'udhu" },
      { arabic: "بِرَبِّ", meaning: "بمالك ومُربّي", transliteration: "Bi-Rabbi" },
      { arabic: "ٱلنَّاسِ", meaning: "جميع البشر", transliteration: "An-Nas" },
    ],
  },
  {
    verseId: 2,
    words: [
      { arabic: "مَلِكِ", meaning: "المالك والحاكم", transliteration: "Maliki" },
      { arabic: "ٱلنَّاسِ", meaning: "جميع البشر", transliteration: "An-Nas" },
    ],
  },
  {
    verseId: 3,
    words: [
      { arabic: "إِلَـٰهِ", meaning: "المعبود بحق", transliteration: "Ilahi" },
      { arabic: "ٱلنَّاسِ", meaning: "جميع البشر", transliteration: "An-Nas" },
    ],
  },
  {
    verseId: 4,
    words: [
      { arabic: "مِن", meaning: "من", transliteration: "Min" },
      { arabic: "شَرِّ", meaning: "أذى وضرر", transliteration: "Sharri" },
      { arabic: "ٱلْوَسْوَاسِ", meaning: "الذي يوسوس", transliteration: "Al-Waswas" },
      { arabic: "ٱلْخَنَّاسِ", meaning: "الذي يختفي عند ذكر الله", transliteration: "Al-Khannas" },
    ],
  },
  {
    verseId: 5,
    words: [
      { arabic: "ٱلَّذِى", meaning: "الذي", transliteration: "Alladhi" },
      { arabic: "يُوَسْوِسُ", meaning: "يُلقي الأفكار السيئة", transliteration: "Yuwaswisu" },
      { arabic: "فِى", meaning: "في داخل", transliteration: "Fi" },
      { arabic: "صُدُورِ", meaning: "قلوب وصدور", transliteration: "Suduri" },
      { arabic: "ٱلنَّاسِ", meaning: "البشر", transliteration: "An-Nas" },
    ],
  },
  {
    verseId: 6,
    words: [
      { arabic: "مِنَ", meaning: "من بين", transliteration: "Mina" },
      { arabic: "ٱلْجِنَّةِ", meaning: "مخلوقات غير مرئية", transliteration: "Al-Jinnati" },
      { arabic: "وَ", meaning: "و", transliteration: "Wa" },
      { arabic: "ٱلنَّاسِ", meaning: "البشر", transliteration: "An-Nas" },
    ],
  },
];

const ERROR_CORRECTION_DATA = [
  { wrong: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاصِ", correct: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", errorWord: "ٱلنَّاصِ", correctWord: "ٱلنَّاسِ", hint: "الحرف الأخير خطأ" },
  { wrong: "مَلِكِ ٱلنَّارِ", correct: "مَلِكِ ٱلنَّاسِ", errorWord: "ٱلنَّارِ", correctWord: "ٱلنَّاسِ", hint: "الكلمة الأخيرة مختلفة" },
  { wrong: "مِن شَرِّ ٱلْوَسْوَاصِ ٱلْخَنَّاسِ", correct: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", errorWord: "ٱلْوَسْوَاصِ", correctWord: "ٱلْوَسْوَاسِ", hint: "حرف واحد مختلف في الكلمة الثالثة" },
  { wrong: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاصِ", correct: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ", errorWord: "ٱلنَّاصِ", correctWord: "ٱلنَّاسِ", hint: "الحرف الأخير في الكلمة الأخيرة" },
];

const MEANING_GAME_DATA = [
  { word: "أَعُوذُ", options: ["أحب", "ألجأ وأحتمي", "أذهب", "أنام"], correct: 1 },
  { word: "ٱلْوَسْوَاسِ", options: ["الملك", "الشيطان الموسوس", "الإنسان", "الحيوان"], correct: 1 },
  { word: "ٱلْخَنَّاسِ", options: ["القوي", "الكبير", "الذي يختفي عند ذكر الله", "الجميل"], correct: 2 },
  { word: "صُدُورِ", options: ["أيدي", "أرجل", "قلوب", "عيون"], correct: 2 },
  { word: "مَلِكِ", options: ["خادم", "حاكم ومالك", "صديق", "جار"], correct: 1 },
];

const DEEP_UNDERSTANDING_DATA = [
  {
    question: "لماذا وصف الله نفسه بثلاث صفات (رب، ملك، إله) في بداية السورة؟",
    answer: "لأن كل صفة تدل على نوع مختلف من الحماية: الرب يربّي ويرعى، والملك يحكم ويحمي، والإله يُعبد ويُلجأ إليه. فالله يحمينا بكل الطرق!",
    icon: "👑",
  },
  {
    question: "لماذا سُمّي الشيطان بالوسواس الخناس؟",
    answer: "الوسواس لأنه يوسوس ويهمس بالأفكار السيئة، والخناس لأنه يختفي ويتراجع فورًا عندما نذكر الله. فهو ضعيف جدًا أمام ذكر الله!",
    icon: "🛡️",
  },
  {
    question: "ما الفرق بين وسوسة الجن ووسوسة الإنس؟",
    answer: "الجن يوسوس بشكل خفي لا نراه، أما الإنس فيوسوس بالكلام والإغراء. لذلك نستعيذ بالله من الاثنين!",
    icon: "💡",
  },
];

const QUIZ_QUESTIONS = [
  { q: "ما معنى كلمة 'أعوذ'؟", options: ["أحب", "ألجأ وأحتمي", "أذهب", "أنام"], correct: 1 },
  { q: "كم عدد آيات سورة الناس؟", options: ["٤ آيات", "٥ آيات", "٦ آيات", "٧ آيات"], correct: 2 },
  { q: "ما معنى 'الخناس'؟", options: ["الكبير", "الذي يختفي عند ذكر الله", "الجميل", "القوي"], correct: 1 },
  { q: "سورة الناس سورة...", options: ["مدنية", "مكية", "لا أعرف", "كلاهما"], correct: 1 },
  { q: "أين يوسوس الشيطان؟", options: ["في الأيدي", "في الصدور", "في الأرجل", "في العيون"], correct: 1 },
];

// ============ SECTIONS CONFIG ============
const SECTIONS = [
  { id: "intro", label: "المقدمة", icon: "🌟", color: "#D4A843" },
  { id: "surah", label: "السورة", icon: "📖", color: "#1B4965" },
  { id: "order", label: "ترتيب الآيات", icon: "📝", color: "#5FA8D3" },
  { id: "choose", label: "اختر الكلمة", icon: "🎯", color: "#7E57C2" },
  { id: "fix", label: "صحح الخطأ", icon: "🔧", color: "#F44336" },
  { id: "meanings", label: "المعاني", icon: "📚", color: "#4CAF50" },
  { id: "meaning-games", label: "ألعاب المعاني", icon: "🎮", color: "#FF9800" },
  { id: "deep", label: "الفهم العميق", icon: "💡", color: "#009688" },
  { id: "virtue", label: "فضل السورة", icon: "✨", color: "#D4A843" },
  { id: "achievement", label: "الإنجاز", icon: "🏆", color: "#4CAF50" },
];

// ============ HELPER ============
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============ AUDIO HELPER ============
const AUDIO_BASE = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/";
// Surah An-Nas verses are ayahs 6231-6236 in the full Quran
const VERSE_AUDIO_IDS = [6231, 6232, 6233, 6234, 6235, 6236];

function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playQueueRef = useRef<number[]>([]);
  const isPlayingAllRef = useRef(false);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingVerse(null);
    setIsPlaying(false);
    isPlayingAllRef.current = false;
    playQueueRef.current = [];
  }, []);

  const playVerse = useCallback((verseIndex: number) => {
    stopAudio();
    const audio = new Audio(`${AUDIO_BASE}${VERSE_AUDIO_IDS[verseIndex]}.mp3`);
    audioRef.current = audio;
    setPlayingVerse(verseIndex);
    setIsPlaying(true);

    audio.play().catch(() => {
      setPlayingVerse(null);
      setIsPlaying(false);
    });

    audio.onended = () => {
      if (isPlayingAllRef.current && playQueueRef.current.length > 0) {
        const next = playQueueRef.current.shift()!;
        setTimeout(() => {
          const nextAudio = new Audio(`${AUDIO_BASE}${VERSE_AUDIO_IDS[next]}.mp3`);
          audioRef.current = nextAudio;
          setPlayingVerse(next);
          nextAudio.play().catch(() => {
            setPlayingVerse(null);
            setIsPlaying(false);
            isPlayingAllRef.current = false;
          });
          nextAudio.onended = audio.onended;
        }, 500);
      } else {
        setPlayingVerse(null);
        setIsPlaying(false);
        isPlayingAllRef.current = false;
      }
    };
  }, [stopAudio]);

  const playAll = useCallback(() => {
    if (isPlaying) {
      stopAudio();
      return;
    }
    isPlayingAllRef.current = true;
    playQueueRef.current = [1, 2, 3, 4, 5];
    playVerse(0);
  }, [isPlaying, playVerse, stopAudio]);

  return { playingVerse, isPlaying, playVerse, playAll, stopAudio };
}

// ============ MAIN COMPONENT ============
export default function Index() {
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [heroAnimated, setHeroAnimated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const audio = useAudioPlayer();

  useEffect(() => {
    setTimeout(() => setHeroAnimated(true), 300);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(i);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  const markComplete = (idx: number) => {
    setCompletedSections((prev) => new Set([...prev, idx]));
  };

  const progress = (completedSections.size / SECTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-['Noto_Sans_Arabic',sans-serif]" dir="rtl">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 right-4 z-[60] lg:hidden w-12 h-12 bg-[#1B4965] text-white rounded-xl shadow-lg flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col p-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-[#1B4965] rounded-2xl">
            <img
              src="/assets/jawwid-logo-official.jpg"
              alt="أكاديمية جوّد"
              className="w-12 h-12 rounded-xl object-cover border-2 border-[#D4A843]"
            />
            <div>
              <p className="text-white font-bold text-sm">أكاديمية جوّد</p>
              <p className="text-[#D4A843] text-xs">سورة الناس</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4 px-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#636E72]">التقدم</span>
              <span className="text-xs font-bold text-[#D4A843]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full bg-gradient-to-l from-[#D4A843] to-[#4CAF50] transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {SECTIONS.map((section, idx) => {
              const isActive = activeSection === idx;
              const isCompleted = completedSections.has(idx);
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(idx)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-[#1B4965] text-white shadow-md"
                      : isCompleted
                      ? "bg-[#4CAF50]/10 text-[#4CAF50]"
                      : "text-[#636E72] hover:bg-gray-50"
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${
                    isActive ? "bg-white/20" : isCompleted ? "bg-[#4CAF50]/10" : "bg-gray-100"
                  }`}>
                    {isCompleted ? "✅" : section.icon}
                  </span>
                  <span className="font-medium">{section.label}</span>
                  {isActive && (
                    <span className="mr-auto w-2 h-2 bg-[#D4A843] rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-[#636E72]">علمٌ ينتفع به ✨</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:mr-72">
        {/* Section 0: Introduction */}
        <div ref={(el) => { sectionRefs.current[0] = el; }}>
          <IntroSection heroAnimated={heroAnimated} onStart={() => scrollToSection(1)} onComplete={() => markComplete(0)} />
        </div>

        {/* Section 1: Surah Display */}
        <div ref={(el) => { sectionRefs.current[1] = el; }}>
          <SurahSection audio={audio} onComplete={() => markComplete(1)} />
        </div>

        {/* Section 2: Verse Ordering */}
        <div ref={(el) => { sectionRefs.current[2] = el; }}>
          <OrderSection onComplete={() => markComplete(2)} />
        </div>

        {/* Section 3: Choose Word */}
        <div ref={(el) => { sectionRefs.current[3] = el; }}>
          <ChooseWordSection onComplete={() => markComplete(3)} />
        </div>

        {/* Section 4: Fix Error */}
        <div ref={(el) => { sectionRefs.current[4] = el; }}>
          <FixErrorSection onComplete={() => markComplete(4)} />
        </div>

        {/* Section 5: Meanings */}
        <div ref={(el) => { sectionRefs.current[5] = el; }}>
          <MeaningsSection onComplete={() => markComplete(5)} />
        </div>

        {/* Section 6: Meaning Games */}
        <div ref={(el) => { sectionRefs.current[6] = el; }}>
          <MeaningGamesSection onComplete={() => markComplete(6)} />
        </div>

        {/* Section 7: Deep Understanding */}
        <div ref={(el) => { sectionRefs.current[7] = el; }}>
          <DeepUnderstandingSection onComplete={() => markComplete(7)} />
        </div>

        {/* Section 8: Virtue */}
        <div ref={(el) => { sectionRefs.current[8] = el; }}>
          <VirtueSection onComplete={() => markComplete(8)} />
        </div>

        {/* Section 9: Achievement */}
        <div ref={(el) => { sectionRefs.current[9] = el; }}>
          <AchievementSection completedSections={completedSections} totalSections={SECTIONS.length} />
        </div>

        {/* Footer */}
        <footer className="bg-[#1B4965] text-white py-8">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <img
              src="/assets/jawwid-logo-official.jpg"
              alt="أكاديمية جوّد"
              className="w-14 h-14 rounded-xl object-cover border-2 border-[#D4A843] mx-auto mb-4"
            />
            <p className="text-[#D4A843] font-bold text-lg mb-1">أكاديمية جوّد</p>
            <p className="text-white/60 text-sm mb-1">Jawwid Academy</p>
            <p className="text-white/40 text-xs">علمٌ ينتفع به ✨</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

// ============ SECTION COMPONENTS ============

function SectionWrapper({
  children,
  title,
  subtitle,
  icon,
  color,
  bgClass = "bg-white",
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgClass?: string;
}) {
  return (
    <section className={`min-h-screen py-16 sm:py-20 ${bgClass}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: color + "15", color }}
          >
            <span className="text-lg">{icon}</span>
            <span>{title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1B4965] mb-3">{title}</h2>
          <p className="text-[#636E72] max-w-lg mx-auto">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

// ---- INTRO SECTION ----
function IntroSection({ heroAnimated, onStart, onComplete }: { heroAnimated: boolean; onStart: () => void; onComplete: () => void }) {
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1B4965] via-[#1B4965] to-[#0D2E3F]">
      {/* Animated stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-white/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 16 + 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          >
            {["✨", "⭐", "✦", "🌟", "✧"][Math.floor(Math.random() * 5)]}
          </span>
        ))}
        {/* Crescent moons */}
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={`moon-${i}`}
            className="absolute text-[#D4A843]/20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: "24px",
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 3}s`,
            }}
          >
            🌙
          </span>
        ))}
      </div>

      <div
        className={`relative z-10 text-center px-6 max-w-3xl mx-auto transition-all duration-1000 ${
          heroAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#D4A843]/30 rounded-2xl blur-xl animate-pulse" />
            <img
              src="/assets/jawwid-logo-official.jpg"
              alt="أكاديمية جوّد - Jawwid Academy"
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-[#D4A843] shadow-2xl"
            />
          </div>
        </div>

        <h2 className="text-[#D4A843] text-lg sm:text-xl font-bold mb-1">أكاديمية جَوِّد</h2>
        <p className="text-white/60 text-sm mb-2">Jawwid Academy</p>
        <p className="text-[#D4A843]/80 text-xs mb-8">✨ عِلمٌ يُنتَفَعُ بِه ✨</p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          🌟 مرحباً بك يا بطل! 🌟
        </h1>
        <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-2">
          هيا نبدأ رحلة ممتعة مع القرآن الكريم!
        </p>
        <p className="text-white/60 text-sm mb-8">
          سنتعلّم معًا سورة الناس، نلعب، ونحفظ كلام الله
        </p>

        {/* Decorative icons */}
        <div className="flex items-center justify-center gap-6 mb-10 text-3xl">
          <span className="animate-bounce" style={{ animationDelay: "0s" }}>📖</span>
          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>🌙</span>
          <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>⭐</span>
          <span className="animate-bounce" style={{ animationDelay: "0.6s" }}>🕌</span>
        </div>

        <button
          onClick={onStart}
          className="group inline-flex items-center gap-3 bg-gradient-to-l from-[#D4A843] to-[#E8C36A] text-[#1B4965] font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:shadow-[#D4A843]/30 transition-all duration-300 hover:scale-105"
        >
          <span>ابدأ الرحلة</span>
          <svg className="w-5 h-5 transform rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

// ---- SURAH SECTION ----
function SurahSection({ audio, onComplete }: { audio: ReturnType<typeof useAudioPlayer>; onComplete: () => void }) {
  const [listened, setListened] = useState(false);

  useEffect(() => {
    if (listened) onComplete();
  }, [listened, onComplete]);

  return (
    <SectionWrapper title="السورة" subtitle="استمع وردد سورة الناس كاملة مع القارئ مشاري العفاسي" icon="📖" color="#1B4965">
      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => { audio.playAll(); setListened(true); }}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg ${
            audio.isPlaying
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gradient-to-l from-[#1B4965] to-[#5FA8D3] text-white hover:scale-105"
          }`}
        >
          {audio.isPlaying ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>إيقاف</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>تشغيل السورة كاملة 🔊</span>
            </>
          )}
        </button>
      </div>

      {/* Bismillah */}
      <div className="text-center mb-8">
        <p className="text-2xl sm:text-3xl text-[#1B4965]/50 font-['Amiri',serif]">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </p>
      </div>

      {/* Verses */}
      <div className="space-y-3">
        {VERSES.map((verse, idx) => (
          <div
            key={verse.id}
            onClick={() => { audio.playVerse(idx); setListened(true); }}
            className={`group relative p-5 sm:p-7 rounded-2xl cursor-pointer transition-all duration-500 border-2 ${
              audio.playingVerse === idx
                ? "bg-[#1B4965] border-[#D4A843] shadow-xl shadow-[#1B4965]/20 scale-[1.02]"
                : "bg-white border-transparent hover:border-[#5FA8D3]/30 shadow-sm hover:shadow-md"
            }`}
          >
            <div className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              audio.playingVerse === idx ? "bg-[#D4A843] text-[#1B4965]" : "bg-[#1B4965]/10 text-[#1B4965]"
            }`}>
              {verse.id}
            </div>

            <p className={`text-center font-['Amiri',serif] text-3xl sm:text-4xl md:text-5xl leading-[2] mb-3 transition-colors ${
              audio.playingVerse === idx ? "text-white" : "text-[#2D3436]"
            }`}>
              {verse.arabic}
            </p>

            <p className={`text-center text-sm transition-colors ${
              audio.playingVerse === idx ? "text-[#D4A843]" : "text-[#636E72]"
            }`}>
              {verse.translation}
            </p>

            {audio.playingVerse === idx && (
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <span className="w-1 h-3 bg-[#D4A843] rounded-full animate-pulse" />
                <span className="w-1 h-5 bg-[#D4A843] rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                <span className="w-1 h-3 bg-[#D4A843] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
              </div>
            )}

            {audio.playingVerse !== idx && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-[#5FA8D3]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ---- ORDER SECTION ----
function OrderSection({ onComplete }: { onComplete: () => void }) {
  const [items, setItems] = useState(() => shuffleArray(VERSES));
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleDrop = (targetIdx: number) => {
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    const newItems = [...items];
    const [removed] = newItems.splice(draggedIdx, 1);
    newItems.splice(targetIdx, 0, removed);
    setItems(newItems);
    setDraggedIdx(null);
    setChecked(false);
  };

  const checkOrder = () => {
    setChecked(true);
    const isCorrect = items.every((item, idx) => item.id === idx + 1);
    if (isCorrect) {
      setCompleted(true);
      playSectionCompleteSound();
      onComplete();
    } else {
      playWrongSound();
    }
  };

  const reset = () => {
    setItems(shuffleArray(VERSES));
    setCompleted(false);
    setChecked(false);
  };

  return (
    <SectionWrapper title="ترتيب الآيات" subtitle="رتّب آيات سورة الناس بالترتيب الصحيح بالسحب والإفلات" icon="📝" color="#5FA8D3" bgClass="bg-[#FAFBFC]">
      <div className="space-y-2 max-w-2xl mx-auto">
        {items.map((item, idx) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDraggedIdx(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            className={`flex items-center gap-3 p-4 rounded-xl cursor-grab active:cursor-grabbing transition-all border-2 ${
              checked && !completed
                ? item.id === idx + 1
                  ? "border-green-400 bg-green-50"
                  : "border-red-300 bg-red-50"
                : completed
                ? "border-green-400 bg-green-50"
                : "border-gray-100 bg-white hover:border-[#5FA8D3]/30 hover:shadow-sm"
            }`}
          >
            <div className="w-8 h-8 bg-[#1B4965]/10 rounded-full flex items-center justify-center text-sm font-bold text-[#1B4965]">
              {idx + 1}
            </div>
            <p className="font-['Amiri',serif] text-xl flex-1">{item.arabic}</p>
            <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-3 pt-6">
        <button onClick={checkOrder} className="px-8 py-3 bg-gradient-to-l from-[#1B4965] to-[#5FA8D3] text-white rounded-full font-bold text-sm hover:scale-105 transition-transform">
          تحقق ✓
        </button>
        <button onClick={reset} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors">
          إعادة 🔄
        </button>
      </div>
      {completed && (
        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200 mt-4 animate-in fade-in zoom-in duration-500">
          <p className="text-green-600 font-bold text-lg">🎉 أحسنت! الترتيب صحيح!</p>
        </div>
      )}
    </SectionWrapper>
  );
}

// ---- CHOOSE WORD SECTION ----
function ChooseWordSection({ onComplete }: { onComplete: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    setShowResult(true);
    if (optIdx === MEANING_GAME_DATA[currentQ].correct) {
      setScore((s) => s + 1);
      playCorrectSound();
    } else {
      playWrongSound();
    }
    setTimeout(() => {
      if (currentQ < MEANING_GAME_DATA.length - 1) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setFinished(true);
        playSectionCompleteSound();
        onComplete();
      }
    }, 1200);
  };

  const reset = () => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
  };

  if (finished) {
    return (
      <SectionWrapper title="اختر الكلمة" subtitle="اختر المعنى الصحيح لكل كلمة" icon="🎯" color="#7E57C2" bgClass="bg-white">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 max-w-md mx-auto">
          <div className="text-6xl mb-4">{score >= 4 ? "🏆" : score >= 3 ? "⭐" : "💪"}</div>
          <h3 className="text-2xl font-bold text-[#1B4965]">نتيجتك: {score} / {MEANING_GAME_DATA.length}</h3>
          <button onClick={reset} className="px-8 py-3 bg-gradient-to-l from-[#7E57C2] to-[#9575CD] text-white rounded-full font-bold hover:scale-105 transition-transform">
            حاول مرة أخرى 🔄
          </button>
        </div>
      </SectionWrapper>
    );
  }

  const q = MEANING_GAME_DATA[currentQ];

  return (
    <SectionWrapper title="اختر الكلمة" subtitle="اختر المعنى الصحيح لكل كلمة من سورة الناس" icon="🎯" color="#7E57C2" bgClass="bg-white">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#636E72]">السؤال {currentQ + 1} / {MEANING_GAME_DATA.length}</span>
          <span className="text-sm font-bold text-[#D4A843]">النقاط: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-l from-[#7E57C2] to-[#9575CD] transition-all duration-500" style={{ width: `${((currentQ + 1) / MEANING_GAME_DATA.length) * 100}%` }} />
        </div>

        <div className="bg-[#7E57C2] rounded-2xl p-6 text-center">
          <p className="text-white/70 text-sm mb-2">ما معنى كلمة:</p>
          <p className="text-white font-['Amiri',serif] text-4xl">{q.word}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selected !== null}
              className={`p-4 rounded-xl text-sm font-medium transition-all border-2 ${
                showResult
                  ? idx === q.correct
                    ? "bg-green-100 border-green-400 text-green-700"
                    : idx === selected
                    ? "bg-red-100 border-red-400 text-red-700"
                    : "bg-white border-gray-100 text-gray-400"
                  : "bg-white border-gray-100 hover:border-[#7E57C2] hover:shadow-sm text-[#2D3436]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ---- FIX ERROR SECTION ----
function FixErrorSection({ onComplete }: { onComplete: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [found, setFound] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const current = ERROR_CORRECTION_DATA[currentIdx];

  const handleFind = () => {
    setShowAnswer(true);
    playClickSound();
    if (!found.includes(currentIdx)) {
      const newFound = [...found, currentIdx];
      setFound(newFound);
      if (newFound.length === ERROR_CORRECTION_DATA.length) {
        playSectionCompleteSound();
        onComplete();
      }
    }
  };

  const next = () => {
    if (currentIdx < ERROR_CORRECTION_DATA.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowAnswer(false);
    }
  };

  const prev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setShowAnswer(false);
    }
  };

  return (
    <SectionWrapper title="صحح الخطأ" subtitle="اكتشف الخطأ في الآية وصححه" icon="🔧" color="#F44336" bgClass="bg-[#FAFBFC]">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#636E72]">{currentIdx + 1} / {ERROR_CORRECTION_DATA.length}</span>
          <span className="text-sm font-bold text-[#4CAF50]">وجدت: {found.length}</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-red-100 shadow-sm">
          <p className="text-xs text-red-400 mb-3 text-center">🔍 اكتشف الخطأ في هذه الآية:</p>
          <p className="font-['Amiri',serif] text-2xl sm:text-3xl text-center leading-[2] text-[#2D3436]">
            {current.wrong}
          </p>
          <p className="text-xs text-[#636E72] text-center mt-3">💡 تلميح: {current.hint}</p>
        </div>

        {showAnswer ? (
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200 animate-in fade-in duration-300">
            <p className="text-green-600 font-bold text-center mb-3">✅ الإجابة الصحيحة:</p>
            <div className="text-center space-y-2">
              <p className="text-sm">
                <span className="text-red-500 line-through">{current.errorWord}</span>
                {" → "}
                <span className="text-green-600 font-bold">{current.correctWord}</span>
              </p>
              <p className="font-['Amiri',serif] text-xl text-[#1B4965]">{current.correct}</p>
            </div>
          </div>
        ) : (
          <button onClick={handleFind} className="w-full py-3 bg-gradient-to-l from-[#F44336] to-[#EF5350] text-white rounded-xl font-bold hover:scale-[1.02] transition-transform">
            أظهر الإجابة 🔍
          </button>
        )}

        <div className="flex justify-between gap-3">
          <button onClick={prev} disabled={currentIdx === 0} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium disabled:opacity-30">
            ← السابق
          </button>
          <button onClick={next} disabled={currentIdx === ERROR_CORRECTION_DATA.length - 1} className="px-6 py-2.5 bg-[#1B4965] text-white rounded-full text-sm font-medium disabled:opacity-30">
            التالي →
          </button>
        </div>

        {found.length === ERROR_CORRECTION_DATA.length && (
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200 animate-in fade-in zoom-in duration-500">
            <p className="text-green-600 font-bold text-lg">🎉 أحسنت! صححت كل الأخطاء!</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

// ---- MEANINGS SECTION ----
function MeaningsSection({ onComplete }: { onComplete: () => void }) {
  const [activeVerse, setActiveVerse] = useState(0);
  const [activeWord, setActiveWord] = useState<number | null>(null);
  const [viewedAll, setViewedAll] = useState(false);
  const [viewedVerses, setViewedVerses] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (viewedVerses.size === WORD_MEANINGS.length && !viewedAll) {
      setViewedAll(true);
      playSectionCompleteSound();
      onComplete();
    }
  }, [viewedVerses, viewedAll, onComplete]);

  return (
    <SectionWrapper title="المعاني" subtitle="اضغط على أي كلمة لتعرف معناها! تعلّم معاني كل كلمة" icon="📚" color="#4CAF50">
      {/* Verse Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {WORD_MEANINGS.map((verse, idx) => (
          <button
            key={verse.verseId}
            onClick={() => { setActiveVerse(idx); setActiveWord(null); setViewedVerses((p) => new Set([...p, idx])); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeVerse === idx
                ? "bg-[#4CAF50] text-white shadow-md"
                : "bg-white text-[#636E72] hover:bg-[#4CAF50]/10 border border-gray-200"
            }`}
          >
            آية {verse.verseId}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden max-w-2xl mx-auto">
        <div className="bg-gradient-to-l from-[#4CAF50] to-[#66BB6A] p-5 text-center">
          <p className="font-['Amiri',serif] text-2xl sm:text-3xl text-white leading-[2]">
            {VERSES[activeVerse].arabic}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {WORD_MEANINGS[activeVerse].words.map((word, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveWord(activeWord === idx ? null : idx); playClickSound(); }}
                className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-300 min-w-[90px] ${
                  activeWord === idx
                    ? "bg-[#4CAF50] text-white shadow-lg scale-105"
                    : "bg-[#F1F8E9] hover:bg-[#4CAF50]/10 border-2 border-transparent hover:border-[#4CAF50]/20"
                }`}
              >
                <p className={`font-['Amiri',serif] text-2xl sm:text-3xl mb-1 ${activeWord === idx ? "text-white" : "text-[#2D3436]"}`}>
                  {word.arabic}
                </p>
                <p className={`text-xs ${activeWord === idx ? "text-white/80" : "text-[#636E72]"}`}>
                  {word.transliteration}
                </p>
                {activeWord === idx && (
                  <div className="mt-3 pt-3 border-t border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-white font-bold text-sm">{word.meaning}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
          {activeWord === null && (
            <p className="text-center text-[#636E72] text-sm mt-6 animate-pulse">
              👆 اضغط على أي كلمة لمعرفة معناها
            </p>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ---- MEANING GAMES SECTION ----
function MeaningGamesSection({ onComplete }: { onComplete: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    setShowResult(true);
    if (optIdx === QUIZ_QUESTIONS[currentQ].correct) {
      setScore((s) => s + 1);
      playCorrectSound();
    } else {
      playWrongSound();
    }
    setTimeout(() => {
      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setFinished(true);
        playSectionCompleteSound();
        onComplete();
      }
    }, 1200);
  };

  const reset = () => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
  };

  if (finished) {
    const pct = (score / QUIZ_QUESTIONS.length) * 100;
    return (
      <SectionWrapper title="ألعاب المعاني" subtitle="اختبر معلوماتك عن سورة الناس" icon="🎮" color="#FF9800" bgClass="bg-[#FAFBFC]">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 max-w-md mx-auto">
          <div className="text-6xl">{pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪"}</div>
          <h3 className="text-2xl font-bold text-[#1B4965]">نتيجتك: {score} / {QUIZ_QUESTIONS.length}</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 max-w-xs mx-auto">
            <div className="h-4 rounded-full bg-gradient-to-l from-[#D4A843] to-[#4CAF50] transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[#636E72]">
            {pct >= 80 ? "ما شاء الله! أنت نجم! ⭐" : pct >= 60 ? "أحسنت! حاول مرة أخرى" : "راجع السورة وحاول مرة أخرى 💪"}
          </p>
          <button onClick={reset} className="px-8 py-3 bg-gradient-to-l from-[#FF9800] to-[#FFB74D] text-white rounded-full font-bold hover:scale-105 transition-transform">
            حاول مرة أخرى 🔄
          </button>
        </div>
      </SectionWrapper>
    );
  }

  const q = QUIZ_QUESTIONS[currentQ];

  return (
    <SectionWrapper title="ألعاب المعاني" subtitle="اختبر معلوماتك عن سورة الناس بأسئلة ممتعة" icon="🎮" color="#FF9800" bgClass="bg-[#FAFBFC]">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#636E72]">السؤال {currentQ + 1} / {QUIZ_QUESTIONS.length}</span>
          <span className="text-sm font-bold text-[#D4A843]">النقاط: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-l from-[#FF9800] to-[#FFB74D] transition-all duration-500" style={{ width: `${((currentQ + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
        </div>

        <div className="bg-[#FF9800] rounded-2xl p-6 text-center">
          <p className="text-white font-bold text-lg">{q.q}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selected !== null}
              className={`p-4 rounded-xl text-sm font-medium transition-all border-2 ${
                showResult
                  ? idx === q.correct
                    ? "bg-green-100 border-green-400 text-green-700"
                    : idx === selected
                    ? "bg-red-100 border-red-400 text-red-700"
                    : "bg-white border-gray-100 text-gray-400"
                  : "bg-white border-gray-100 hover:border-[#FF9800] hover:shadow-sm text-[#2D3436]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ---- DEEP UNDERSTANDING SECTION ----
function DeepUnderstandingSection({ onComplete }: { onComplete: () => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [viewed, setViewed] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (viewed.size === DEEP_UNDERSTANDING_DATA.length) {
      playSectionCompleteSound();
      onComplete();
    }
  }, [viewed, onComplete]);

  const toggle = (idx: number) => {
    setExpanded(expanded === idx ? null : idx);
    setViewed((prev) => new Set([...prev, idx]));
    playClickSound();
  };

  return (
    <SectionWrapper title="الفهم العميق" subtitle="تعمّق في فهم معاني سورة الناس" icon="💡" color="#009688">
      <div className="max-w-2xl mx-auto space-y-4">
        {DEEP_UNDERSTANDING_DATA.map((item, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
              expanded === idx ? "border-[#009688] shadow-lg" : "border-gray-100 hover:border-[#009688]/30"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center gap-4 p-5 text-right"
            >
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <p className="flex-1 font-bold text-[#1B4965] text-sm sm:text-base">{item.question}</p>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${expanded === idx ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expanded === idx && (
              <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-[#E0F2F1] rounded-xl p-4">
                  <p className="text-[#00695C] text-sm leading-relaxed">{item.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ---- VIRTUE SECTION ----
function VirtueSection({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <SectionWrapper title="فضل السورة" subtitle="تعرّف على فضل وأهمية سورة الناس" icon="✨" color="#D4A843" bgClass="bg-[#FAFBFC]">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Hadith */}
        <div className="bg-gradient-to-l from-[#1B4965] to-[#2D6A8F] rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">📜</span>
            <div>
              <p className="font-bold mb-3 text-[#D4A843]">حديث شريف</p>
              <p className="text-white/90 leading-relaxed text-sm">
                عن عائشة رضي الله عنها: «أنَّ النبيَّ ﷺ كان إذا أوى إلى فراشِه كلَّ ليلةٍ
                جمع كفَّيه ثمَّ نفث فيهما فقرأ فيهما: قُلْ هُوَ اللَّهُ أَحَدٌ، وقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ،
                وقُلْ أَعُوذُ بِرَبِّ النَّاسِ، ثمَّ يمسحُ بهما ما استطاع من جسدِه، يبدأُ بهما على رأسِه ووجهِه
                وما أقبل من جسدِه، يفعلُ ذلك ثلاثَ مرَّاتٍ»
              </p>
              <p className="text-[#D4A843] text-xs mt-3">رواه البخاري</p>
            </div>
          </div>
        </div>

        {/* Why memorize */}
        <div className="bg-white rounded-2xl p-6 border border-[#D4A843]/20 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🌟</span>
            <div>
              <p className="font-bold text-[#1B4965] mb-3">لماذا نحفظ سورة الناس؟</p>
              <ul className="space-y-2.5 text-[#636E72] text-sm">
                {[
                  "حماية من الله من كل شر وحسد",
                  "سنة النبي ﷺ قبل النوم كل ليلة",
                  "من أذكار الصباح والمساء",
                  "تُقرأ بعد كل صلاة",
                  "شفاء من السحر والعين بإذن الله",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#D4A843] rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="text-center bg-gradient-to-l from-[#D4A843]/10 to-[#FFF8F0] rounded-2xl p-6 border border-[#D4A843]/20">
          <p className="text-[#1B4965] font-bold text-lg">
            🤲 احفظ سورة الناس واقرأها كل يوم لتكون في حفظ الله!
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ---- ACHIEVEMENT SECTION ----
function AchievementSection({ completedSections, totalSections }: { completedSections: Set<number>; totalSections: number }) {
  const pct = Math.round((completedSections.size / totalSections) * 100);
  const allDone = completedSections.size === totalSections;
  const playedRef = useRef(false);

  useEffect(() => {
    if (allDone && !playedRef.current) {
      playedRef.current = true;
      playAchievementSound();
    }
  }, [allDone]);

  return (
    <SectionWrapper title="الإنجاز" subtitle="تابع تقدمك في تعلّم سورة الناس" icon="🏆" color="#4CAF50">
      <div className="max-w-lg mx-auto text-center space-y-8">
        {/* Big progress circle */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={allDone ? "#4CAF50" : "#D4A843"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${pct * 2.83} ${283 - pct * 2.83}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-[#1B4965]">{pct}%</span>
            <span className="text-xs text-[#636E72]">مكتمل</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl font-bold text-[#1B4965] mb-2">
            {allDone ? "🎉 ما شاء الله! أكملت كل الأقسام!" : `أكملت ${completedSections.size} من ${totalSections} أقسام`}
          </p>
          <p className="text-[#636E72] text-sm">
            {allDone
              ? "أنت بطل حقيقي! استمر في مراجعة سورة الناس كل يوم"
              : "استمر في التعلّم لإكمال جميع الأقسام والحصول على الإنجاز الكامل!"}
          </p>
        </div>

        {allDone && (
          <div className="bg-gradient-to-l from-[#4CAF50] to-[#66BB6A] rounded-2xl p-6 text-white animate-in fade-in zoom-in duration-500">
            <span className="text-5xl block mb-3">🏆</span>
            <p className="font-bold text-lg mb-1">شهادة إتمام</p>
            <p className="text-white/80 text-sm mb-3">أكمل تعلّم سورة الناس بنجاح</p>
            <div className="flex items-center justify-center gap-3">
              <img
                src="/assets/jawwid-logo-official.jpg"
                alt="أكاديمية جوّد"
                className="w-10 h-10 rounded-lg object-cover border-2 border-white/30"
              />
              <div className="text-right">
                <p className="font-bold text-sm">أكاديمية جوّد</p>
                <p className="text-white/60 text-xs">Jawwid Academy</p>
              </div>
            </div>
          </div>
        )}

        {/* Encouraging message */}
        <div className="bg-gradient-to-l from-[#1B4965] to-[#2D6A8F] rounded-2xl p-6 text-white">
          <p className="text-[#D4A843] font-bold mb-2">💝 رسالة من أكاديمية جوّد</p>
          <p className="text-white/80 text-sm leading-relaxed">
            نحن فخورون بك! كل خطوة في رحلة تعلّم القرآن هي استثمار في الدنيا والآخرة.
          </p>
          <p className="text-[#D4A843] font-bold text-sm mt-3">
            «خيركم من تعلّم القرآن وعلّمه» ﷺ
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}