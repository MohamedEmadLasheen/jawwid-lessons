import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// ─── ADD NEW LESSONS HERE ──────────────────────────────────────────────────
//  1. Copy new lesson's src/ folder into src/lessons/<category>/<slug>/
//  2. lazy-import its main page component below
//  3. Add a <Route> and a card in the home page array
//  4. Add any new npm packages to package.json  — that's it!
// ──────────────────────────────────────────────────────────────────────────

const SurahFatiha = lazy(() => import("./lessons/quran/surah-fatiha/LessonApp"));
const SurahNas    = lazy(() => import("./lessons/quran/surah-nas/pages/Index"));
const SurahFalaq  = lazy(() => import("./lessons/quran/surah-falaq/pages/Index"));
const SurahIkhlas = lazy(() => import("./lessons/quran/surah-ikhlas/pages/Index"));

// Home-page lesson cards — add one object per lesson
const lessons = [
  { slug: "quran/surah-fatiha",  number: "١", name: "سورة الفاتحة",  sub: "أم الكتاب • ٧ آيات",         accent: "#D4AF37", bg: "#1B4D3E" },
  { slug: "quran/surah-nas",     number: "٢", name: "سورة الناس",    sub: "المعوذتان • ٦ آيات",          accent: "#D4A843", bg: "#1B4965" },
  { slug: "quran/surah-falaq",   number: "٣", name: "سورة الفلق",    sub: "المعوذتان • ٥ آيات",          accent: "#D4A843", bg: "#1a1a2e" },
  { slug: "quran/surah-ikhlas",  number: "٤", name: "سورة الإخلاص",  sub: "تعدل ثلث القرآن • ٤ آيات",   accent: "#d4a853", bg: "#0a1628" },
];

// ──────────────────────────────────────────────────────────────────────────


function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1B4D3E]">
      <div className="text-center text-white" style={{ fontFamily: "Cairo,sans-serif" }}>
        <div className="text-5xl mb-4 animate-bounce">📖</div>
        <p className="text-xl font-bold">جارٍ التحميل…</p>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div dir="rtl" className="min-h-screen" style={{ background: "linear-gradient(135deg,#1B4D3E 0%,#2D7A5E 50%,#1B4D3E 100%)", fontFamily: "Cairo,sans-serif" }}>
      <div className="pt-12 pb-6 text-center px-4">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#D4AF37] mx-auto mb-5 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
          <img src="/assets/jawwid-logo.jpg" alt="أكاديمية جوّد" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">أكاديمية جَوِّد</h1>
        <p className="font-bold text-[#D4AF37] mb-3">Jawwid Academy</p>
        <span className="inline-block px-6 py-2 rounded-full font-bold text-[#1B4D3E]" style={{ background: "linear-gradient(135deg,#D4AF37,#F4D03F)" }}>
          ✨ عِلمٌ يُنتَفَعُ بِه ✨
        </span>
      </div>

      <div className="max-w-xl mx-auto px-4 pb-16">
        <h2 className="text-center text-white text-xl font-bold mb-6">📚 اختر درسًا للبدء</h2>
        <div className="space-y-4">
          {lessons.map((l) => (
            <Link
              key={l.slug}
              to={`/lessons/${l.slug}`}
              className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              style={{ background: "rgba(255,255,255,0.95)", border: `2px solid ${l.accent}` }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0" style={{ background: l.accent, color: l.bg }}>
                {l.number}
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold" style={{ color: l.bg }}>{l.name}</p>
                <p className="text-sm text-gray-500">{l.sub}</p>
              </div>
              <span className="text-2xl">📖</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* quran lessons */}
        <Route path="/lessons/quran/surah-fatiha/*" element={<Suspense fallback={<Loading />}><SurahFatiha /></Suspense>} />
        <Route path="/lessons/quran/surah-nas"      element={<Suspense fallback={<Loading />}><SurahNas    /></Suspense>} />
        <Route path="/lessons/quran/surah-falaq"    element={<Suspense fallback={<Loading />}><SurahFalaq  /></Suspense>} />
        <Route path="/lessons/quran/surah-ikhlas"   element={<Suspense fallback={<Loading />}><SurahIkhlas /></Suspense>} />
      </Routes>
    </BrowserRouter>
  );
}
