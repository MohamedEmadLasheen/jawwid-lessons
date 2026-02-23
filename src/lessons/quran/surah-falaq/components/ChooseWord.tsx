import React, { useState } from 'react';
import { playCorrectSound, playWrongSound, playSuccessSound } from '../lib/sounds';

/* ==================== اختر الكلمة ==================== */
const wordQuestions = [
  {
    word: 'أَعُوذُ',
    correct: 'ألجأ وأحتمي',
    options: ['أحب', 'ألجأ وأحتمي', 'أذهب', 'أنام'],
  },
  {
    word: 'ٱلْفَلَقِ',
    correct: 'الصبح والفجر',
    options: ['الليل', 'الصبح والفجر', 'النجوم', 'القمر'],
  },
  {
    word: 'غَاسِقٍ',
    correct: 'الليل المظلم',
    options: ['النهار', 'الشمس', 'الليل المظلم', 'المطر'],
  },
  {
    word: 'ٱلنَّفَّـٰثَـٰتِ',
    correct: 'الساحرات اللاتي ينفثن',
    options: ['الساحرات اللاتي ينفثن', 'الملائكة', 'الطيور', 'الرياح'],
  },
  {
    word: 'حَاسِدٍ',
    correct: 'من يتمنى زوال النعمة',
    options: ['من يحب الخير', 'من يتمنى زوال النعمة', 'من يصلي', 'من يقرأ'],
  },
];

interface ChooseWordProps {
  onComplete: () => void;
}

export const ChooseWordSection: React.FC<ChooseWordProps> = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    setShowResult(true);

    const isCorrect = answer === wordQuestions[currentQ].correct;
    if (isCorrect) {
      playCorrectSound();
      setScore((s) => s + 1);
    } else {
      playWrongSound();
    }

    setTimeout(() => {
      if (currentQ < wordQuestions.length - 1) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setFinished(true);
        playSuccessSound();
        onComplete();
      }
    }, 1500);
  };

  const handleReset = () => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
  };

  const q = wordQuestions[currentQ];

  return (
    <section id="choose" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
            <span className="text-2xl">🎯</span>
            <span className="text-white font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>اختر الكلمة</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>اختر الكلمة</h2>
          <p className="text-white/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
            اختر المعنى الصحيح لكل كلمة من سورة الفلق
          </p>
        </div>

        {finished ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/5">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>أحسنت!</h3>
            <p className="text-white/70 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              حصلت على {score} من {wordQuestions.length} نقاط
            </p>
            <button
              onClick={handleReset}
              className="bg-gradient-to-l from-amber-500 to-orange-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              أعد المحاولة 🔄
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-white/70 text-sm mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              <span>السؤال {currentQ + 1} / {wordQuestions.length}</span>
              <span>النقاط: {score}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-6 border border-white/5">
              <p className="text-white/70 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>ما معنى كلمة:</p>
              <p className="text-3xl text-amber-300 font-bold" style={{ fontFamily: 'Amiri, serif' }}>{q.word}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {q.options.map((option) => {
                let btnClass = 'bg-white/10 text-white hover:bg-white/20 border border-white/5';
                if (showResult && selected === option) {
                  btnClass = option === q.correct
                    ? 'bg-green-500/30 text-green-300 border border-green-400/50 scale-105'
                    : 'bg-red-500/30 text-red-300 border border-red-400/50 shake-animation';
                } else if (showResult && option === q.correct) {
                  btnClass = 'bg-green-500/20 text-green-300 border border-green-400/30';
                }
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selected}
                    className={`${btnClass} backdrop-blur-sm rounded-xl p-4 font-bold transition-all duration-200 hover:scale-[1.02]`}
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className={`mt-4 text-center p-3 rounded-xl ${
                selected === q.correct ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                {selected === q.correct ? '🎉 أحسنت! إجابة صحيحة!' : `❌ الإجابة الصحيحة: ${q.correct}`}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

/* ==================== صحح الخطأ ==================== */
const errorVerses = [
  {
    wrong: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَكِ',
    correct: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
    hint: 'الحرف الأخير خطأ',
    errorWord: 'ٱلْفَلَكِ',
    correctWord: 'ٱلْفَلَقِ',
  },
  {
    wrong: 'مِن شَرِّ مَا خَلَكَ',
    correct: 'مِن شَرِّ مَا خَلَقَ',
    hint: 'الحرف الأخير في الكلمة الأخيرة خطأ',
    errorWord: 'خَلَكَ',
    correctWord: 'خَلَقَ',
  },
  {
    wrong: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَفَ',
    correct: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
    hint: 'الحرف الأخير خطأ',
    errorWord: 'وَقَفَ',
    correctWord: 'وَقَبَ',
  },
  {
    wrong: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَبَ',
    correct: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    hint: 'الحرف الأخير خطأ',
    errorWord: 'حَسَبَ',
    correctWord: 'حَسَدَ',
  },
];

interface FixErrorProps {
  onComplete: () => void;
}

export const FixErrorSection: React.FC<FixErrorProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [found, setFound] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const current = errorVerses[currentIndex];

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setFound((f) => f + 1);
    playCorrectSound();
    if (currentIndex === errorVerses.length - 1) {
      setAllDone(true);
      setTimeout(() => {
        playSuccessSound();
      }, 500);
      onComplete();
    }
  };

  const handleNext = () => {
    if (currentIndex < errorVerses.length - 1) {
      setCurrentIndex((i) => i + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setShowAnswer(false);
    }
  };

  return (
    <section id="fix" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
            <span className="text-2xl">🔧</span>
            <span className="text-white font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>صحح الخطأ</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>صحح الخطأ</h2>
          <p className="text-white/60" style={{ fontFamily: 'Cairo, sans-serif' }}>اكتشف الخطأ في الآية وصححه</p>
        </div>

        <div className="flex justify-between text-white/70 text-sm mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
          <span>{currentIndex + 1} / {errorVerses.length}</span>
          <span>وجدت: {found}</span>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-6 border border-white/5">
          <p className="text-white/70 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>🔍 اكتشف الخطأ في هذه الآية:</p>
          <p className="text-2xl text-white font-bold leading-loose mb-4" style={{ fontFamily: 'Amiri, serif' }}>
            {showAnswer ? (
              <>
                {current.correct.split(current.correctWord).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="text-green-400 underline decoration-2">{current.correctWord}</span>
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <>
                {current.wrong.split(current.errorWord).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="text-red-400 underline decoration-wavy decoration-2">{current.errorWord}</span>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </p>
          <p className="text-amber-300/70 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>💡 تلميح: {current.hint}</p>
          {showAnswer && (
            <div className="mt-4 p-3 bg-green-500/20 rounded-xl">
              <p className="text-green-300 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                ✅ الصواب: <span className="font-bold">{current.correctWord}</span> بدلاً من <span className="line-through text-red-300">{current.errorWord}</span>
              </p>
            </div>
          )}
        </div>

        {allDone && (
          <div className="text-center mb-4 p-4 rounded-2xl bg-green-500/20 text-green-300" style={{ fontFamily: 'Cairo, sans-serif' }}>
            🎉 أحسنت! وجدت جميع الأخطاء!
          </div>
        )}

        <div className="flex justify-center gap-4">
          {!showAnswer && (
            <button
              onClick={handleShowAnswer}
              className="bg-gradient-to-l from-amber-500 to-orange-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              أظهر الإجابة 🔍
            </button>
          )}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-all disabled:opacity-30"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            ← السابق
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === errorVerses.length - 1}
            className="bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-all disabled:opacity-30"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            التالي →
          </button>
        </div>
      </div>
    </section>
  );
};

/* ==================== ألعاب المعاني ==================== */
const meaningQuestions = [
  {
    question: "ما معنى كلمة 'الفلق'؟",
    correct: 'الصبح والفجر',
    options: ['الليل', 'الصبح والفجر', 'النجوم', 'السماء'],
  },
  {
    question: "ما معنى 'غاسق إذا وقب'؟",
    correct: 'الليل إذا أظلم',
    options: ['النهار إذا أشرق', 'الليل إذا أظلم', 'المطر إذا نزل', 'الريح إذا هبت'],
  },
  {
    question: "ما معنى 'النفاثات في العقد'؟",
    correct: 'الساحرات اللاتي ينفثن في عقد الخيوط',
    options: ['الساحرات اللاتي ينفثن في عقد الخيوط', 'النساء اللاتي يطبخن', 'الطيور التي تطير', 'الرياح القوية'],
  },
  {
    question: "لماذا نستعيذ بالله من شر ما خلق؟",
    correct: 'لأن الله وحده القادر على حمايتنا',
    options: ['لأننا نخاف', 'لأن الله وحده القادر على حمايتنا', 'لأننا ضعفاء', 'لأن الشر كثير'],
  },
  {
    question: "ما معنى 'حاسد إذا حسد'؟",
    correct: 'من يتمنى زوال النعمة عن غيره',
    options: ['من يحب الخير للناس', 'من يتمنى زوال النعمة عن غيره', 'من يعمل الخير', 'من يصلي كثيراً'],
  },
];

interface MeaningGamesProps {
  onComplete: () => void;
}

export const MeaningGamesSection: React.FC<MeaningGamesProps> = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    setShowResult(true);

    const isCorrect = answer === meaningQuestions[currentQ].correct;
    if (isCorrect) {
      playCorrectSound();
      setScore((s) => s + 1);
    } else {
      playWrongSound();
    }

    setTimeout(() => {
      if (currentQ < meaningQuestions.length - 1) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setFinished(true);
        playSuccessSound();
        onComplete();
      }
    }, 1500);
  };

  const handleReset = () => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
  };

  const q = meaningQuestions[currentQ];

  return (
    <section id="games" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
            <span className="text-2xl">🎮</span>
            <span className="text-white font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>ألعاب المعاني</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>ألعاب المعاني</h2>
          <p className="text-white/60" style={{ fontFamily: 'Cairo, sans-serif' }}>اختبر معلوماتك عن سورة الفلق بأسئلة ممتعة</p>
        </div>

        {finished ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/5">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>ممتاز!</h3>
            <p className="text-white/70 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              حصلت على {score} من {meaningQuestions.length} نقاط
            </p>
            <button
              onClick={handleReset}
              className="bg-gradient-to-l from-amber-500 to-orange-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              أعد المحاولة 🔄
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-white/70 text-sm mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              <span>السؤال {currentQ + 1} / {meaningQuestions.length}</span>
              <span>النقاط: {score}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-6 border border-white/5">
              <p className="text-xl text-white font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{q.question}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {q.options.map((option) => {
                let btnClass = 'bg-white/10 text-white hover:bg-white/20 border border-white/5';
                if (showResult && selected === option) {
                  btnClass = option === q.correct
                    ? 'bg-green-500/30 text-green-300 border border-green-400/50 scale-105'
                    : 'bg-red-500/30 text-red-300 border border-red-400/50';
                } else if (showResult && option === q.correct) {
                  btnClass = 'bg-green-500/20 text-green-300 border border-green-400/30';
                }
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selected}
                    className={`${btnClass} backdrop-blur-sm rounded-xl p-4 font-bold transition-all duration-200 hover:scale-[1.02]`}
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className={`mt-4 text-center p-3 rounded-xl ${
                selected === q.correct ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                {selected === q.correct ? '🎉 أحسنت! إجابة صحيحة!' : `❌ الإجابة الصحيحة: ${q.correct}`}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};