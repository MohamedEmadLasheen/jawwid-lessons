import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { encouragements } from "../../data/fatihaData";

interface Verse {
  id: number;
  text: string;
}

interface FixErrorsProps {
  verses: Verse[];
  onComplete: () => void;
}

interface ErrorQuestion {
  originalVerse: Verse;
  errorVerse: string;
  errorWord: string;
  correctWord: string;
  errorIndex: number;
}

const FixErrors = ({ verses, onComplete }: FixErrorsProps) => {
  const [questions, setQuestions] = useState<ErrorQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" | "" }>({ message: "", type: "" });
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);

  const alternativeWords: { [key: string]: string[] } = {
    "بِسْمِ": ["باسم", "بإسم"],
    "اللَّهِ": ["الإله", "ربي"],
    "الرَّحْمَٰنِ": ["الرحيم", "الكريم"],
    "الرَّحِيمِ": ["الرحمن", "الغفور"],
    "الْحَمْدُ": ["الشكر", "المدح"],
    "لِلَّهِ": ["إلى الله", "من الله"],
    "رَبِّ": ["إله", "مالك"],
    "الْعَالَمِينَ": ["الناس", "المخلوقات"],
    "مَالِكِ": ["صاحب", "حاكم"],
    "يَوْمِ": ["وقت", "زمن"],
    "الدِّينِ": ["الحساب", "القيامة"],
    "إِيَّاكَ": ["لك", "أنت"],
    "نَعْبُدُ": ["نطيع", "نسجد"],
    "نَسْتَعِينُ": ["نطلب", "نرجو"],
    "اهْدِنَا": ["أرشدنا", "دلنا"],
    "الصِّرَاطَ": ["الطريق", "السبيل"],
    "الْمُسْتَقِيمَ": ["الصحيح", "المستوي"],
  };

  useEffect(() => {
    generateQuestions();
  }, [verses]);

  const generateQuestions = () => {
    const generatedQuestions: ErrorQuestion[] = verses.slice(0, 5).map((verse) => {
      const words = verse.text.split(" ");
      const eligibleIndices = words
        .map((word, index) => ({ word, index }))
        .filter(({ word }) => alternativeWords[word]);
      
      if (eligibleIndices.length === 0) {
        const randomIndex = Math.floor(Math.random() * words.length);
        return {
          originalVerse: verse,
          errorVerse: verse.text,
          errorWord: words[randomIndex],
          correctWord: words[randomIndex],
          errorIndex: randomIndex,
        };
      }

      const randomEligible = eligibleIndices[Math.floor(Math.random() * eligibleIndices.length)];
      const alternatives = alternativeWords[randomEligible.word];
      const errorWord = alternatives[Math.floor(Math.random() * alternatives.length)];
      
      const errorWords = [...words];
      errorWords[randomEligible.index] = errorWord;

      return {
        originalVerse: verse,
        errorVerse: errorWords.join(" "),
        errorWord: errorWord,
        correctWord: randomEligible.word,
        errorIndex: randomEligible.index,
      };
    });

    setQuestions(generatedQuestions);
  };

  const getRandomMessage = (type: "correct" | "wrong") => {
    const messages = encouragements[type];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleWordClick = (word: string, index: number) => {
    if (selectedWord || showCorrection) return;
    
    const currentQuestion = questions[currentIndex];
    setSelectedWord(word);
    
    if (index === currentQuestion.errorIndex) {
      setScore(score + 1);
      setFeedback({ message: getRandomMessage("correct"), type: "success" });
    } else {
      setFeedback({ message: getRandomMessage("wrong"), type: "error" });
    }
    setShowCorrection(true);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedWord(null);
      setFeedback({ message: "", type: "" });
      setShowCorrection(false);
    } else {
      setIsComplete(true);
    }
  };

  const resetGame = () => {
    generateQuestions();
    setCurrentIndex(0);
    setSelectedWord(null);
    setFeedback({ message: "", type: "" });
    setScore(0);
    setIsComplete(false);
    setShowCorrection(false);
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const words = currentQuestion.errorVerse.split(" ");

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <Card 
        className="p-6"
        style={{
          background: "white",
          borderRadius: "20px",
          border: "2px solid #E8F5E9"
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#1B4D3E]">
            🔧 اكتشف الخطأ وصححه
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[#5D6D7E]">السؤال</span>
            <span 
              className="px-3 py-1 rounded-full text-white font-bold"
              style={{ background: "#1B4D3E" }}
            >
              {currentIndex + 1}/{questions.length}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-[#E8F5E9] rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              background: "linear-gradient(90deg, #1B4D3E, #2D7A5E)"
            }}
          />
        </div>

        {!isComplete ? (
          <>
            {/* Instructions */}
            <div className="bg-[#FFF3CD] p-4 rounded-xl mb-6 text-center">
              <p className="text-[#856404]">
                ⚠️ هناك كلمة خاطئة في الآية التالية، اضغط عليها لتصحيحها
              </p>
            </div>

            {/* Verse with Error */}
            <div 
              className="p-6 rounded-xl mb-6"
              style={{ background: "#E8F5E9" }}
            >
              <p className="text-sm text-[#5D6D7E] mb-3 text-center">الآية {currentQuestion.originalVerse.id}:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {words.map((word, index) => {
                  const isError = index === currentQuestion.errorIndex;
                  const isSelected = selectedWord === word && index === currentQuestion.errorIndex;
                  
                  let bgColor = "white";
                  let borderColor = "#1B4D3E";
                  let textColor = "#1B4D3E";
                  
                  if (showCorrection && isError) {
                    bgColor = "#E74C3C";
                    borderColor = "#E74C3C";
                    textColor = "white";
                  } else if (selectedWord && !isError && selectedWord === word) {
                    bgColor = "#FFF3CD";
                    borderColor = "#856404";
                    textColor = "#856404";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleWordClick(word, index)}
                      disabled={!!selectedWord}
                      className="px-4 py-2 rounded-xl text-xl font-bold transition-all duration-300 border-2 hover:scale-105"
                      style={{
                        background: bgColor,
                        borderColor: borderColor,
                        color: textColor,
                      }}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback */}
            {feedback.message && (
              <div 
                className={`p-4 rounded-xl mb-6 text-center text-lg font-bold ${
                  feedback.type === "success" 
                    ? "bg-[#27AE60]/20 text-[#27AE60]" 
                    : "bg-[#E74C3C]/20 text-[#E74C3C]"
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Correction Display */}
            {showCorrection && (
              <div 
                className="p-4 rounded-xl mb-6"
                style={{ background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)" }}
              >
                <p className="text-white text-center mb-2">✅ الآية الصحيحة:</p>
                <p className="text-white text-xl text-center font-bold">
                  {currentQuestion.originalVerse.text}
                </p>
                <div className="mt-3 flex justify-center gap-4 text-sm">
                  <span className="bg-[#E74C3C] text-white px-3 py-1 rounded-full">
                    ❌ {currentQuestion.errorWord}
                  </span>
                  <span className="text-white">→</span>
                  <span className="bg-[#27AE60] text-white px-3 py-1 rounded-full">
                    ✓ {currentQuestion.correctWord}
                  </span>
                </div>
              </div>
            )}

            {/* Next Button */}
            {showCorrection && (
              <Button
                onClick={nextQuestion}
                className="w-full py-4 text-lg font-bold"
                style={{ background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)" }}
              >
                {currentIndex + 1 < questions.length ? "السؤال التالي ←" : "عرض النتيجة"}
              </Button>
            )}
          </>
        ) : (
          /* Complete State */
          <div className="text-center space-y-6">
            <div className="text-6xl">
              {score >= questions.length * 0.8 ? "🏆" : score >= questions.length * 0.5 ? "⭐" : "💪"}
            </div>
            <h3 className="text-2xl font-bold text-[#1B4D3E]">
              أحسنت! أكملت اللعبة
            </h3>
            <div 
              className="inline-block px-8 py-4 rounded-2xl"
              style={{ background: "#E8F5E9" }}
            >
              <p className="text-[#5D6D7E]">نتيجتك</p>
              <p className="text-4xl font-bold text-[#1B4D3E]">
                {score}/{questions.length}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetGame}
                variant="outline"
                className="border-[#1B4D3E] text-[#1B4D3E]"
              >
                🔄 أعد اللعب
              </Button>
              <Button
                onClick={onComplete}
                className="bg-[#1B4D3E] hover:bg-[#2D7A5E] text-white"
              >
                التالي ←
              </Button>
            </div>
          </div>
        )}

        {/* Score Display */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/20">
            <span className="text-[#D4AF37]">⭐</span>
            <span className="font-bold text-[#1B4D3E]">{score} نقطة</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FixErrors;