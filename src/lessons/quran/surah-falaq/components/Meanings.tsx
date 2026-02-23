import React, { useState } from 'react';

/* ==================== المعاني ==================== */
const versesData = [
  {
    number: 1,
    arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
    words: [
      { arabic: 'قُلْ', transliteration: 'Qul', meaning: 'قل يا محمد' },
      { arabic: 'أَعُوذُ', transliteration: "A'udhu", meaning: 'ألجأ وأحتمي وأعتصم' },
      { arabic: 'بِرَبِّ', transliteration: 'Bi-Rabbi', meaning: 'بمالك ومدبر' },
      { arabic: 'ٱلْفَلَقِ', transliteration: 'Al-Falaq', meaning: 'الصبح والفجر الذي يشق الظلام' },
    ],
  },
  {
    number: 2,
    arabic: 'مِن شَرِّ مَا خَلَقَ',
    words: [
      { arabic: 'مِن', transliteration: 'Min', meaning: 'من' },
      { arabic: 'شَرِّ', transliteration: 'Sharri', meaning: 'أذى وضرر' },
      { arabic: 'مَا', transliteration: 'Ma', meaning: 'الذي / جميع' },
      { arabic: 'خَلَقَ', transliteration: 'Khalaq', meaning: 'أوجد وصنع من العدم' },
    ],
  },
  {
    number: 3,
    arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
    words: [
      { arabic: 'وَمِن', transliteration: 'Wa min', meaning: 'ومن' },
      { arabic: 'شَرِّ', transliteration: 'Sharri', meaning: 'أذى وضرر' },
      { arabic: 'غَاسِقٍ', transliteration: 'Ghasiq', meaning: 'الليل المظلم' },
      { arabic: 'إِذَا', transliteration: 'Idha', meaning: 'عندما / حين' },
      { arabic: 'وَقَبَ', transliteration: 'Waqab', meaning: 'أظلم واشتد ظلامه' },
    ],
  },
  {
    number: 4,
    arabic: 'وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ',
    words: [
      { arabic: 'وَمِن', transliteration: 'Wa min', meaning: 'ومن' },
      { arabic: 'شَرِّ', transliteration: 'Sharri', meaning: 'أذى وضرر' },
      { arabic: 'ٱلنَّفَّـٰثَـٰتِ', transliteration: 'An-Naffathat', meaning: 'الساحرات اللاتي ينفثن (ينفخن بريق)' },
      { arabic: 'فِى', transliteration: 'Fi', meaning: 'في' },
      { arabic: 'ٱلْعُقَدِ', transliteration: "Al-'Uqad", meaning: 'عُقَد الخيوط التي يُسحر بها' },
    ],
  },
  {
    number: 5,
    arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    words: [
      { arabic: 'وَمِن', transliteration: 'Wa min', meaning: 'ومن' },
      { arabic: 'شَرِّ', transliteration: 'Sharri', meaning: 'أذى وضرر' },
      { arabic: 'حَاسِدٍ', transliteration: 'Hasid', meaning: 'من يتمنى زوال النعمة عن غيره' },
      { arabic: 'إِذَا', transliteration: 'Idha', meaning: 'عندما / حين' },
      { arabic: 'حَسَدَ', transliteration: 'Hasad', meaning: 'تمنى زوال النعمة وسعى في ذلك' },
    ],
  },
];

export const MeaningsSection: React.FC = () => {
  const [activeVerse, setActiveVerse] = useState(0);
  const [selectedWord, setSelectedWord] = useState<{ arabic: string; transliteration: string; meaning: string } | null>(null);

  return (
    <section id="meanings" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
            <span className="text-2xl">📚</span>
            <span className="text-white font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>المعاني</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>المعاني</h2>
          <p className="text-white/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
            اضغط على أي كلمة لتعرف معناها! تعلّم معاني كل كلمة
          </p>
        </div>

        {/* Verse Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {versesData.map((v, i) => (
            <button
              key={i}
              onClick={() => { setActiveVerse(i); setSelectedWord(null); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeVerse === i
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              آية {v.number}
            </button>
          ))}
        </div>

        {/* Verse Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4 text-center border border-white/5">
          <p className="text-xl text-amber-300 font-bold mb-4" style={{ fontFamily: 'Amiri, serif' }}>
            {versesData[activeVerse].arabic}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {versesData[activeVerse].words.map((word, i) => (
              <button
                key={i}
                onClick={() => setSelectedWord(word)}
                className={`px-4 py-3 rounded-xl transition-all hover:scale-105 ${
                  selectedWord?.arabic === word.arabic
                    ? 'bg-amber-500/30 border-2 border-amber-400'
                    : 'bg-white/10 border border-white/10 hover:bg-white/20'
                }`}
              >
                <span className="block text-lg text-white font-bold" style={{ fontFamily: 'Amiri, serif' }}>{word.arabic}</span>
                <span className="block text-xs text-white/50">{word.transliteration}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedWord ? (
          <div className="bg-gradient-to-l from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-amber-400/30 animate-in fade-in duration-300">
            <p className="text-2xl text-amber-300 font-bold mb-2" style={{ fontFamily: 'Amiri, serif' }}>{selectedWord.arabic}</p>
            <p className="text-white font-bold text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>{selectedWord.meaning}</p>
          </div>
        ) : (
          <p className="text-center text-white/40" style={{ fontFamily: 'Cairo, sans-serif' }}>👆 اضغط على أي كلمة لمعرفة معناها</p>
        )}
      </div>
    </section>
  );
};

/* ==================== الفهم العميق ==================== */
const deepQuestions = [
  {
    emoji: '🌅',
    question: 'لماذا خصّ الله الفلق (الصبح) بالذكر في الاستعاذة؟',
    answer: 'لأن الفلق هو انشقاق الظلام عن النور، وفيه دلالة على قدرة الله في إزالة الظلمات والشرور. كما أن الصبح يأتي بعد أشد أوقات الليل ظلمة، فمن فلق الظلام بالنور قادر على حمايتك من كل شر.',
  },
  {
    emoji: '🌑',
    question: 'لماذا استعاذ من الليل إذا أظلم (غاسق إذا وقب)؟',
    answer: 'لأن الليل وقت انتشار الشرور والمخاطر، حيث تنتشر فيه الحشرات الضارة والحيوانات المفترسة، ويكثر فيه السرقة والأذى. كما أن الشياطين تنتشر عند غروب الشمس وإقبال الظلام.',
  },
  {
    emoji: '🛡️',
    question: 'ما الحكمة من الاستعاذة من الحسد في آخر السورة؟',
    answer: 'الحسد من أخطر الشرور لأنه يصدر من النفس البشرية، وقد يؤدي إلى العين والأذى. ختم الله السورة بالحسد لأنه شر خفي يصعب الاحتراز منه، فجعل العلاج في اللجوء إلى الله والاستعاذة به.',
  },
];

export const DeepUnderstandingSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="deep" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
            <span className="text-2xl">💡</span>
            <span className="text-white font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>الفهم العميق</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>الفهم العميق</h2>
          <p className="text-white/60" style={{ fontFamily: 'Cairo, sans-serif' }}>تعمّق في فهم معاني سورة الفلق</p>
        </div>

        <div className="space-y-4">
          {deepQuestions.map((q, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center gap-3 p-5 text-right hover:bg-white/5 transition-all"
              >
                <span className="text-2xl">{q.emoji}</span>
                <span className="flex-1 text-white font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{q.question}</span>
                <span className={`text-white/40 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-white/80 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>{q.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ==================== فضل السورة ==================== */
export const VirtueSection: React.FC = () => {
  const benefits = [
    'حماية من الله من كل شر وحسد',
    'سنة النبي ﷺ قبل النوم كل ليلة',
    'من أذكار الصباح والمساء',
    'تُقرأ بعد كل صلاة',
    'شفاء من السحر والعين بإذن الله',
  ];

  return (
    <section id="virtue" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
            <span className="text-2xl">✨</span>
            <span className="text-white font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>فضل السورة</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>فضل السورة</h2>
          <p className="text-white/60" style={{ fontFamily: 'Cairo, sans-serif' }}>تعرّف على فضل وأهمية سورة الفلق</p>
        </div>

        {/* Hadith */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/5">
          <div className="text-center mb-4">
            <span className="text-3xl">📜</span>
            <h3 className="text-amber-300 font-bold text-lg mt-2" style={{ fontFamily: 'Cairo, sans-serif' }}>حديث شريف</h3>
          </div>
          <p className="text-white/90 leading-relaxed text-center" style={{ fontFamily: 'Amiri, serif', fontSize: '1.1rem' }}>
            عن عائشة رضي الله عنها: «أنَّ النبيَّ ﷺ كان إذا أوى إلى فراشِه كلَّ ليلةٍ جمع كفَّيه ثمَّ نفث فيهما فقرأ فيهما: قُلْ هُوَ اللَّهُ أَحَدٌ، وقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، وقُلْ أَعُوذُ بِرَبِّ النَّاسِ، ثمَّ يمسحُ بهما ما استطاع من جسدِه، يبدأُ بهما على رأسِه ووجهِه وما أقبل من جسدِه، يفعلُ ذلك ثلاثَ مرَّاتٍ»
          </p>
          <p className="text-amber-400/70 text-center text-sm mt-3" style={{ fontFamily: 'Cairo, sans-serif' }}>رواه البخاري</p>
        </div>

        {/* Benefits */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <div className="text-center mb-4">
            <span className="text-3xl">🌟</span>
            <h3 className="text-amber-300 font-bold text-lg mt-2" style={{ fontFamily: 'Cairo, sans-serif' }}>لماذا نحفظ سورة الفلق؟</h3>
          </div>
          <div className="space-y-3">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                <span className="text-green-400">✅</span>
                <span className="text-white/80" style={{ fontFamily: 'Cairo, sans-serif' }}>{benefit}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-amber-300/80 mt-6 text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
            🤲 احفظ سورة الفلق واقرأها كل يوم لتكون في حفظ الله!
          </p>
        </div>
      </div>
    </section>
  );
};

/* ==================== الإنجاز ==================== */
interface AchievementProps {
  completedSections: string[];
  progress: number;
}

export const AchievementSection: React.FC<AchievementProps> = ({ completedSections, progress }) => {
  return (
    <section id="achievement" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
            <span className="text-2xl">🏆</span>
            <span className="text-white font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>الإنجاز</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>الإنجاز</h2>
          <p className="text-white/60" style={{ fontFamily: 'Cairo, sans-serif' }}>تابع تقدمك في تعلّم سورة الفلق</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/5">
          {/* Trophy */}
          <div className="text-6xl mb-4">🏆</div>

          {/* Progress Circle */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="url(#progressGradient)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.83} ${283 - progress * 2.83}`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{progress}%</span>
              <span className="text-xs text-white/60" style={{ fontFamily: 'Cairo, sans-serif' }}>مكتمل</span>
            </div>
          </div>

          <p className="text-white/70 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            أكملت {completedSections.length} من 10 أقسام
          </p>
          <p className="text-white/50 text-sm mb-8" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {progress === 100
              ? '🎉 مبارك! أكملت جميع الأقسام!'
              : 'استمر في التعلّم لإكمال جميع الأقسام والحصول على الإنجاز الكامل!'}
          </p>

          {/* Message */}
          <div className="bg-gradient-to-l from-pink-500/20 to-purple-500/20 rounded-2xl p-6 border border-pink-400/20">
            <p className="text-pink-300 font-bold text-lg mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              💝 رسالة من أكاديمية جوّد
            </p>
            <p className="text-white/70 mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
              نحن فخورون بك! كل خطوة في رحلة تعلّم القرآن هي استثمار في الدنيا والآخرة.
            </p>
            <p className="text-amber-300 font-bold" style={{ fontFamily: 'Amiri, serif' }}>
              «خيركم من تعلّم القرآن وعلّمه» ﷺ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};