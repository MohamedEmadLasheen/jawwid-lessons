import React, { useState, useCallback } from 'react';
import { GlowCard } from './IslamicPattern';
import { RotateCcw, CheckCircle2, XCircle, Trophy, ArrowRight } from 'lucide-react';

type GameType = 'order' | 'match' | 'tajweed' | 'quiz';

const OrderGame: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const correctOrder = [
    'قُلْ هُوَ اللَّهُ أَحَدٌ',
    'اللَّهُ الصَّمَدُ',
    'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
  ];

  const [shuffled, setShuffled] = useState(() => {
    const arr = [...correctOrder];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (verse: string) => {
    if (selected.includes(verse) || isComplete) return;
    const newSelected = [...selected, verse];
    setSelected(newSelected);

    if (newSelected.length === correctOrder.length) {
      const correct = newSelected.every((v, i) => v === correctOrder[i]);
      setIsCorrect(correct);
      setIsComplete(true);
      onComplete(correct ? 100 : 25);
    }
  };

  const reset = () => {
    const arr = [...correctOrder];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
    setSelected([]);
    setIsComplete(false);
    setIsCorrect(false);
  };

  return (
    <div>
      <p className="text-blue-200/70 font-tajawal text-center mb-6">
        اضغط على الآيات بالترتيب الصحيح من البداية إلى النهاية
      </p>

      {selected.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs text-white/40 font-tajawal mb-2">ترتيبك:</p>
          {selected.map((verse, i) => {
            const isRight = verse === correctOrder[i];
            return (
              <div
                key={i}
                className={`p-3 rounded-xl border flex items-center gap-3 ${
                  isComplete
                    ? isRight
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                    : 'bg-gold/10 border-gold/30'
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  isComplete
                    ? isRight ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    : 'bg-gold text-primary-bg'
                }`}>
                  {i + 1}
                </span>
                <span className="font-amiri text-lg text-white">{verse}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-3 mb-6">
        {shuffled.filter(v => !selected.includes(v)).map((verse, i) => (
          <button
            key={i}
            onClick={() => handleSelect(verse)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all duration-300 text-center"
          >
            <span className="font-amiri text-xl text-white">{verse}</span>
          </button>
        ))}
      </div>

      {isComplete && (
        <div className={`text-center p-6 rounded-2xl animate-in fade-in zoom-in duration-500 ${
          isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
        }`}>
          <p className="text-3xl mb-2">{isCorrect ? '🎉' : '😊'}</p>
          <p className={`font-tajawal font-bold text-lg ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'ممتاز! ترتيب صحيح!' : 'حاول مرة أخرى!'}
          </p>
          <button onClick={reset} className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all font-tajawal text-sm">
            <RotateCcw className="w-4 h-4" /> إعادة المحاولة
          </button>
        </div>
      )}
    </div>
  );
};

interface MatchItem {
  word: string;
  meaning: string;
}

const MatchGame: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const items: MatchItem[] = [
    { word: 'أَحَدٌ', meaning: 'واحد لا شريك له' },
    { word: 'الصَّمَدُ', meaning: 'الذي يحتاج إليه الجميع' },
    { word: 'لَمْ يَلِدْ', meaning: 'ليس له ولد' },
    { word: 'كُفُوًا', meaning: 'مثيلاً أو شبيهاً' },
  ];

  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [matches, setMatches] = useState<Map<number, number>>(new Map());
  const [wrongPair, setWrongPair] = useState<[number, number] | null>(null);
  const [shuffledMeanings] = useState(() => {
    const indices = items.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });

  const handleWordClick = (index: number) => {
    if (matches.has(index)) return;
    setSelectedWord(index);
    setWrongPair(null);
  };

  const handleMeaningClick = (meaningOrigIndex: number) => {
    if (selectedWord === null) return;
    if ([...matches.values()].includes(meaningOrigIndex)) return;

    if (selectedWord === meaningOrigIndex) {
      const newMatches = new Map(matches);
      newMatches.set(selectedWord, meaningOrigIndex);
      setMatches(newMatches);
      setSelectedWord(null);
      if (newMatches.size === items.length) {
        onComplete(100);
      }
    } else {
      setWrongPair([selectedWord, meaningOrigIndex]);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedWord(null);
      }, 800);
    }
  };

  const reset = () => {
    setSelectedWord(null);
    setMatches(new Map());
    setWrongPair(null);
  };

  const isGameComplete = matches.size === items.length;

  return (
    <div>
      <p className="text-blue-200/70 font-tajawal text-center mb-6">
        اختر الكلمة ثم اضغط على معناها الصحيح
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-xs text-gold font-tajawal text-center mb-2">الكلمات</p>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => handleWordClick(i)}
              disabled={matches.has(i)}
              className={`w-full p-4 rounded-xl border text-center transition-all duration-300 ${
                matches.has(i)
                  ? 'bg-green-500/10 border-green-500/30 opacity-60'
                  : selectedWord === i
                  ? 'bg-gold/20 border-gold/50 scale-105'
                  : wrongPair && wrongPair[0] === i
                  ? 'bg-red-500/20 border-red-500/50 animate-shake'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="font-amiri text-xl text-white">{item.word}</span>
              {matches.has(i) && <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto mt-1" />}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-xs text-teal-300 font-tajawal text-center mb-2">المعاني</p>
          {shuffledMeanings.map((origIndex) => (
            <button
              key={origIndex}
              onClick={() => handleMeaningClick(origIndex)}
              disabled={[...matches.values()].includes(origIndex)}
              className={`w-full p-4 rounded-xl border text-center transition-all duration-300 ${
                [...matches.values()].includes(origIndex)
                  ? 'bg-green-500/10 border-green-500/30 opacity-60'
                  : wrongPair && wrongPair[1] === origIndex
                  ? 'bg-red-500/20 border-red-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-teal-500/10 hover:border-teal-500/30'
              }`}
            >
              <span className="font-tajawal text-sm text-white">{items[origIndex].meaning}</span>
              {[...matches.values()].includes(origIndex) && <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto mt-1" />}
            </button>
          ))}
        </div>
      </div>

      {isGameComplete && (
        <div className="mt-6 text-center p-6 rounded-2xl bg-green-500/10 border border-green-500/30 animate-in fade-in zoom-in duration-500">
          <p className="text-3xl mb-2">🌟</p>
          <p className="text-green-400 font-tajawal font-bold text-lg">أحسنت! طابقت جميع الكلمات!</p>
          <button onClick={reset} className="mt-3 flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all font-tajawal text-sm">
            <RotateCcw className="w-4 h-4" /> لعب مرة أخرى
          </button>
        </div>
      )}
    </div>
  );
};

const TajweedGame: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const questions = [
    {
      text: 'أَحَدٌ ۝ اللَّهُ',
      question: 'ما الحكم التجويدي بين نهاية الآية الأولى وبداية الثانية؟',
      options: ['إدغام بغنة', 'إظهار حلقي', 'إخفاء', 'قلقلة'],
      correct: 0,
    },
    {
      text: 'الصَّمَدُ',
      question: 'ما نوع اللام في كلمة "الصمد"؟',
      options: ['لام قمرية', 'لام شمسية', 'لام ساكنة', 'لام مشددة'],
      correct: 1,
    },
    {
      text: 'كُفُوًا أَحَدٌ',
      question: 'ما حكم التنوين في "كُفُوًا" مع الهمزة بعدها؟',
      options: ['إدغام', 'إخفاء', 'إظهار حلقي', 'إقلاب'],
      correct: 2,
    },
    {
      text: 'يَكُن لَّهُ',
      question: 'ما حكم النون الساكنة في "يكن" مع اللام بعدها؟',
      options: ['إظهار', 'إخفاء', 'إقلاب', 'إدغام بغير غنة'],
      correct: 3,
    },
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === questions[currentQ].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
      onComplete(Math.round(((score + (selectedAnswer === questions[currentQ].correct ? 1 : 0)) / questions.length) * 100));
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
  };

  if (gameComplete) {
    const finalScore = score;
    return (
      <div className="text-center p-8 animate-in fade-in zoom-in duration-500">
        <p className="text-5xl mb-4">{finalScore >= 3 ? '🏆' : finalScore >= 2 ? '⭐' : '💪'}</p>
        <p className="text-gold font-tajawal font-bold text-2xl mb-2">
          {finalScore >= 3 ? 'ممتاز!' : finalScore >= 2 ? 'جيد جداً!' : 'حاول مرة أخرى!'}
        </p>
        <p className="text-white font-tajawal text-lg mb-6">{finalScore} من {questions.length}</p>
        <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-gold text-primary-bg font-tajawal font-bold hover:shadow-lg hover:shadow-gold/30 transition-all">
          <RotateCcw className="w-5 h-5" /> إعادة المحاولة
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-blue-200/60 font-tajawal">السؤال {currentQ + 1} من {questions.length}</span>
        <span className="text-sm text-gold font-tajawal">النقاط: {score}</span>
      </div>

      <GlowCard className="mb-6 text-center">
        <p className="font-amiri text-3xl text-gold mb-4">{q.text}</p>
        <p className="text-white font-tajawal font-bold">{q.question}</p>
      </GlowCard>

      <div className="space-y-3 mb-6">
        {q.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={selectedAnswer !== null}
            className={`w-full p-4 rounded-xl border text-right transition-all duration-300 flex items-center gap-3 ${
              showResult
                ? i === q.correct
                  ? 'bg-green-500/15 border-green-500/40'
                  : selectedAnswer === i
                  ? 'bg-red-500/15 border-red-500/40'
                  : 'bg-white/5 border-white/10 opacity-50'
                : selectedAnswer === i
                ? 'bg-gold/15 border-gold/40'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              showResult
                ? i === q.correct ? 'bg-green-500 text-white' : selectedAnswer === i ? 'bg-red-500 text-white' : 'bg-white/10 text-white/40'
                : 'bg-white/10 text-white'
            }`}>
              {showResult ? (i === q.correct ? <CheckCircle2 className="w-4 h-4" /> : selectedAnswer === i ? <XCircle className="w-4 h-4" /> : String.fromCharCode(1571 + i)) : String.fromCharCode(1571 + i)}
            </span>
            <span className="font-tajawal text-white">{option}</span>
          </button>
        ))}
      </div>

      {showResult && (
        <div className="text-center">
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-gold text-primary-bg font-tajawal font-bold hover:shadow-lg hover:shadow-gold/30 transition-all"
          >
            {currentQ < questions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
};

const QuizGame: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const questions = [
    {
      question: 'كم عدد آيات سورة الإخلاص؟',
      options: ['3 آيات', '4 آيات', '5 آيات', '6 آيات'],
      correct: 1,
    },
    {
      question: 'سورة الإخلاص تعدل كم من القرآن؟',
      options: ['الربع', 'الثلث', 'النصف', 'الكل'],
      correct: 1,
    },
    {
      question: 'ما معنى "الصمد"؟',
      options: ['القوي', 'الذي يحتاج إليه كل شيء', 'الرحيم', 'العظيم'],
      correct: 1,
    },
    {
      question: 'ما الموضوع الرئيسي لسورة الإخلاص؟',
      options: ['قصص الأنبياء', 'التوحيد', 'أحكام الصلاة', 'يوم القيامة'],
      correct: 1,
    },
    {
      question: 'في أي وقت يُستحب قراءة سورة الإخلاص؟',
      options: ['فقط في الصلاة', 'فقط قبل النوم', 'في الصباح والمساء', 'فقط يوم الجمعة'],
      correct: 2,
    },
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === questions[currentQ].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
      onComplete(Math.round(((score + (selectedAnswer === questions[currentQ].correct ? 1 : 0)) / questions.length) * 100));
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
  };

  if (gameComplete) {
    const finalScore = score;
    return (
      <div className="text-center p-8 animate-in fade-in zoom-in duration-500">
        <p className="text-5xl mb-4">{finalScore >= 4 ? '🏆' : finalScore >= 3 ? '⭐' : '💪'}</p>
        <p className="text-gold font-tajawal font-bold text-2xl mb-2">
          {finalScore >= 4 ? 'رائع! أنت نجم!' : finalScore >= 3 ? 'جيد جداً!' : 'واصل المحاولة!'}
        </p>
        <p className="text-white font-tajawal text-lg mb-6">{finalScore} من {questions.length}</p>
        <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-gold text-primary-bg font-tajawal font-bold hover:shadow-lg hover:shadow-gold/30 transition-all">
          <RotateCcw className="w-5 h-5" /> إعادة المحاولة
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-blue-200/60 font-tajawal">السؤال {currentQ + 1} من {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i < currentQ ? 'bg-green-400' : i === currentQ ? 'bg-gold' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      <GlowCard className="mb-6 text-center">
        <p className="text-white font-tajawal font-bold text-lg">{q.question}</p>
      </GlowCard>

      <div className="space-y-3 mb-6">
        {q.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={selectedAnswer !== null}
            className={`w-full p-4 rounded-xl border text-right transition-all duration-300 flex items-center gap-3 ${
              showResult
                ? i === q.correct
                  ? 'bg-green-500/15 border-green-500/40'
                  : selectedAnswer === i
                  ? 'bg-red-500/15 border-red-500/40'
                  : 'bg-white/5 border-white/10 opacity-50'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              showResult
                ? i === q.correct ? 'bg-green-500 text-white' : selectedAnswer === i ? 'bg-red-500 text-white' : 'bg-white/10 text-white/40'
                : 'bg-white/10 text-white'
            }`}>
              {showResult ? (i === q.correct ? '✓' : selectedAnswer === i ? '✗' : i + 1) : i + 1}
            </span>
            <span className="font-tajawal text-white">{option}</span>
          </button>
        ))}
      </div>

      {showResult && (
        <div className="text-center">
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-gold text-primary-bg font-tajawal font-bold hover:shadow-lg hover:shadow-gold/30 transition-all"
          >
            {currentQ < questions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
};

const InteractiveGames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('order');
  const [scores, setScores] = useState<Record<GameType, number | null>>({
    order: null, match: null, tajweed: null, quiz: null,
  });

  const handleComplete = useCallback((game: GameType, score: number) => {
    setScores(prev => ({ ...prev, [game]: score }));
  }, []);

  const games: { id: GameType; label: string; icon: string }[] = [
    { id: 'order', label: 'ترتيب الآيات', icon: '📝' },
    { id: 'match', label: 'مطابقة المعاني', icon: '🔗' },
    { id: 'tajweed', label: 'أحكام التجويد', icon: '🎨' },
    { id: 'quiz', label: 'اختبار سريع', icon: '❓' },
  ];

  const totalScore = Object.values(scores).filter(s => s !== null);
  const avgScore = totalScore.length > 0
    ? Math.round(totalScore.reduce((a, b) => a! + b!, 0)! / totalScore.length)
    : 0;

  return (
    <div>
      {totalScore.length > 0 && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-gold/10 border border-gold/20 rounded-2xl px-6 py-3">
            <Trophy className="w-5 h-5 text-gold" />
            <span className="text-gold font-tajawal font-bold">المعدل العام: {avgScore}%</span>
            <span className="text-white/40 font-tajawal text-sm">({totalScore.length}/{games.length} ألعاب)</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`relative p-4 rounded-xl font-tajawal font-bold text-sm transition-all duration-300 ${
              activeGame === game.id
                ? 'bg-gold text-primary-bg shadow-lg shadow-gold/20 scale-105'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <span className="text-xl block mb-1">{game.icon}</span>
            {game.label}
            {scores[game.id] !== null && (
              <span className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                scores[game.id]! >= 75 ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {scores[game.id]! >= 75 ? '✓' : '!'}
              </span>
            )}
          </button>
        ))}
      </div>

      <GlowCard>
        {activeGame === 'order' && <OrderGame onComplete={(s) => handleComplete('order', s)} />}
        {activeGame === 'match' && <MatchGame onComplete={(s) => handleComplete('match', s)} />}
        {activeGame === 'tajweed' && <TajweedGame onComplete={(s) => handleComplete('tajweed', s)} />}
        {activeGame === 'quiz' && <QuizGame onComplete={(s) => handleComplete('quiz', s)} />}
      </GlowCard>
    </div>
  );
};

export default InteractiveGames;