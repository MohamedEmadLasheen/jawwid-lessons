import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { encouragements } from "../../data/fatihaData";

interface Verse {
  id: number;
  text: string;
}

interface ChooseWordProps {
  verses: Verse[];
  onComplete: () => void;
}

interface Question {
  verse: Verse;
  missingWord: string;
  missingIndex: number;
  options: string[];
  verseWithBlank: string;
}

const ChooseWord = ({ verses, onComplete }: ChooseWordProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" | "" }>({ message: "", type: "" });
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, [verses]);

  const generateQuestions = () => {
    const generatedQuestions: Question[] = verses.slice(1, 6).map((verse) => {
      const words = verse.text.split(" ");
      const randomIndex = Math.floor(Math.random() * words.length);
      const missingWord = words[randomIndex];
      
      const verseWithBlank = words
        .map((w, i) => (i === randomIndex ? "______" : w))
        .join(" ");

      const otherWords = verses
        .flatMap(v => v.text.split(" "))
        .filter(w => w !== missingWord && w.length > 2);
      
      const shuffledOthers = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...shuffledOthers, missingWord].sort(() => Math.random() - 0.5);

      return {
        verse,
        missingWord,
        missingIndex: randomIndex,
        options,
        verseWithBlank,
      };
    });

    setQuestions(generatedQuestions);
  };

  const getRandomMessage = (type: "correct" | "wrong") => {
    const messages = encouragements[type];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentIndex];
    
    if (answer === currentQuestion.missingWord) {
      setScore(score + 1);
      setFeedback({ message: getRandomMessage("correct"), type: "success" });
    } else {
      setFeedback({ message: getRandomMessage("wrong"), type: "error" });
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setFeedback({ message: "", type: "" });
    } else {
      setIsComplete(true);
    }
  };

  const resetGame = () => {
    generateQuestions();
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setFeedback({ message: "", type: "" });
    setScore(0);
    setIsComplete(false);
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

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
            🎯 اختر الكلمة الصحيحة
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
            {/* Question */}
            <div 
              className="p-6 rounded-xl mb-6 text-center"
              style={{ background: "#E8F5E9" }}
            >
              <p className="text-[#5D6D7E] text-sm mb-2">أكمل الآية:</p>
              <p className="text-2xl text-[#1B4D3E] font-bold leading-relaxed">
                {currentQuestion.verseWithBlank}
              </p>
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
                {feedback.type === "error" && (
                  <p className="text-sm mt-2">
                    الإجابة الصحيحة: <span className="font-bold">{currentQuestion.missingWord}</span>
                  </p>
                )}
              </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.missingWord;
                const isSelected = selectedAnswer === option;
                
                let bgColor = "white";
                let borderColor = "#1B4D3E";
                let textColor = "#1B4D3E";
                
                if (selectedAnswer) {
                  if (isCorrect) {
                    bgColor = "#27AE60";
                    borderColor = "#27AE60";
                    textColor = "white";
                  } else if (isSelected && !isCorrect) {
                    bgColor = "#E74C3C";
                    borderColor = "#E74C3C";
                    textColor = "white";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className="p-4 rounded-xl text-lg font-bold transition-all duration-300 border-2"
                    style={{
                      background: bgColor,
                      borderColor: borderColor,
                      color: textColor,
                      transform: isSelected ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {option}
                    {selectedAnswer && isCorrect && " ✓"}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {selectedAnswer && (
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

export default ChooseWord;