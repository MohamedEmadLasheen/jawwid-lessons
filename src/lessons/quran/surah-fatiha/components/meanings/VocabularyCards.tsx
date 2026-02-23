import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface VocabularyItem {
  id: number;
  word: string;
  meaning: string;
  explanation: string;
  example: string;
  verseId: number;
}

interface VocabularyCardsProps {
  vocabulary: VocabularyItem[];
  onComplete: () => void;
}

const VocabularyCards = ({ vocabulary, onComplete }: VocabularyCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedWords, setLearnedWords] = useState<number[]>([]);

  const currentWord = vocabulary[currentIndex];
  const progress = ((currentIndex + 1) / vocabulary.length) * 100;

  const handleNext = () => {
    if (!learnedWords.includes(currentWord.id)) {
      setLearnedWords([...learnedWords, currentWord.id]);
    }
    
    if (currentIndex + 1 < vocabulary.length) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const isComplete = learnedWords.length >= vocabulary.length * 0.9;

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
            📚 تعلم معاني الكلمات
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[#5D6D7E]">الكلمة</span>
            <span 
              className="px-3 py-1 rounded-full text-white font-bold"
              style={{ background: "#1B4D3E" }}
            >
              {currentIndex + 1}/{vocabulary.length}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-[#E8F5E9] rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${progress}%`,
              background: "linear-gradient(90deg, #1B4D3E, #2D7A5E)"
            }}
          />
        </div>

        {/* Flip Card */}
        <div 
          className="relative h-[350px] cursor-pointer perspective-1000 mb-6"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div 
            className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front - Word */}
            <div 
              className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden"
              style={{
                background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)",
                backfaceVisibility: "hidden",
              }}
            >
              <p className="text-white/70 text-sm mb-4">اضغط لرؤية المعنى</p>
              <p className="text-5xl font-bold text-white mb-4">{currentWord.word}</p>
              <div className="mt-4 flex items-center gap-2 text-white/80">
                <span>📖</span>
                <span>الآية {currentWord.verseId}</span>
              </div>
              <div className="absolute bottom-4 text-white/50 text-sm">
                👆 اضغط للقلب
              </div>
            </div>

            {/* Back - Meaning */}
            <div 
              className="absolute inset-0 rounded-2xl p-6 flex flex-col backface-hidden"
              style={{
                background: "white",
                border: "3px solid #D4AF37",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-[#1B4D3E]">{currentWord.word}</span>
                <span className="mx-2 text-[#D4AF37]">=</span>
                <span className="text-2xl font-bold text-[#2D7A5E]">{currentWord.meaning}</span>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="bg-[#E8F5E9] rounded-xl p-4">
                  <p className="text-sm text-[#5D6D7E] mb-1">📝 الشرح:</p>
                  <p className="text-[#2C3E50]">{currentWord.explanation}</p>
                </div>
                
                <div className="bg-[#FFF8E7] rounded-xl p-4">
                  <p className="text-sm text-[#856404] mb-1">💡 مثال:</p>
                  <p className="text-[#2C3E50]">{currentWord.example}</p>
                </div>
              </div>

              <div className="text-center text-[#5D6D7E] text-sm mt-2">
                👆 اضغط للعودة
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            variant="outline"
            className="border-[#1B4D3E] text-[#1B4D3E] disabled:opacity-50"
          >
            ← السابق
          </Button>
          
          <div className="flex gap-1">
            {vocabulary.slice(Math.max(0, currentIndex - 2), Math.min(vocabulary.length, currentIndex + 3)).map((_, i) => {
              const actualIndex = Math.max(0, currentIndex - 2) + i;
              return (
                <div
                  key={actualIndex}
                  className={`w-2 h-2 rounded-full transition-all ${
                    actualIndex === currentIndex 
                      ? "bg-[#1B4D3E] w-4" 
                      : learnedWords.includes(vocabulary[actualIndex].id)
                      ? "bg-[#27AE60]"
                      : "bg-[#E8F5E9]"
                  }`}
                />
              );
            })}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === vocabulary.length - 1}
            className="bg-[#1B4D3E] hover:bg-[#2D7A5E] text-white disabled:opacity-50"
          >
            التالي →
          </Button>
        </div>

        {/* Learned Counter */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F5E9]">
            <span className="text-[#27AE60]">✓</span>
            <span className="text-[#1B4D3E] font-bold">
              تعلمت {learnedWords.length} من {vocabulary.length} كلمة
            </span>
          </div>
        </div>

        {/* Complete Button */}
        {isComplete && (
          <div className="mt-6 text-center">
            <Button
              onClick={onComplete}
              className="px-8 py-4 text-lg font-bold"
              style={{ background: "linear-gradient(135deg, #D4AF37, #F4D03F)", color: "#1B4D3E" }}
            >
              🎉 أحسنت! انتقل للألعاب ←
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VocabularyCards;