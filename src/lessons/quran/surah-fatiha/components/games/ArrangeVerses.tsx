import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { encouragements } from "../../data/fatihaData";

interface Verse {
  id: number;
  text: string;
}

interface ArrangeVersesProps {
  verses: Verse[];
  onComplete: () => void;
}

const ArrangeVerses = ({ verses, onComplete }: ArrangeVersesProps) => {
  const [shuffledVerses, setShuffledVerses] = useState<Verse[]>([]);
  const [arrangedVerses, setArrangedVerses] = useState<Verse[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" | "" }>({ message: "", type: "" });
  const [isComplete, setIsComplete] = useState(false);
  const [draggedVerse, setDraggedVerse] = useState<Verse | null>(null);

  useEffect(() => {
    const shuffled = [...verses].sort(() => Math.random() - 0.5);
    setShuffledVerses(shuffled);
  }, [verses]);

  const getRandomMessage = (type: "correct" | "wrong") => {
    const messages = encouragements[type];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleDragStart = (verse: Verse) => {
    setDraggedVerse(verse);
  };

  const handleDrop = () => {
    if (!draggedVerse) return;

    const expectedId = arrangedVerses.length + 1;
    
    if (draggedVerse.id === expectedId) {
      setArrangedVerses([...arrangedVerses, draggedVerse]);
      setShuffledVerses(shuffledVerses.filter(v => v.id !== draggedVerse.id));
      setFeedback({ message: getRandomMessage("correct"), type: "success" });
      
      if (arrangedVerses.length + 1 === verses.length) {
        setIsComplete(true);
        setTimeout(() => {
          setFeedback({ message: encouragements.complete[0], type: "success" });
        }, 500);
      }
    } else {
      setFeedback({ message: getRandomMessage("wrong"), type: "error" });
    }
    
    setDraggedVerse(null);
    setTimeout(() => setFeedback({ message: "", type: "" }), 2000);
  };

  const handleVerseClick = (verse: Verse) => {
    const expectedId = arrangedVerses.length + 1;
    
    if (verse.id === expectedId) {
      setArrangedVerses([...arrangedVerses, verse]);
      setShuffledVerses(shuffledVerses.filter(v => v.id !== verse.id));
      setFeedback({ message: getRandomMessage("correct"), type: "success" });
      
      if (arrangedVerses.length + 1 === verses.length) {
        setIsComplete(true);
        setTimeout(() => {
          setFeedback({ message: encouragements.complete[0], type: "success" });
        }, 500);
      }
    } else {
      setFeedback({ message: getRandomMessage("wrong"), type: "error" });
    }
    
    setTimeout(() => setFeedback({ message: "", type: "" }), 2000);
  };

  const resetGame = () => {
    const shuffled = [...verses].sort(() => Math.random() - 0.5);
    setShuffledVerses(shuffled);
    setArrangedVerses([]);
    setIsComplete(false);
    setFeedback({ message: "", type: "" });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <Card 
        className="p-6"
        style={{
          background: "white",
          borderRadius: "20px",
          border: "2px solid #E8F5E9"
        }}
      >
        <h2 className="text-2xl font-bold text-[#1B4D3E] mb-2 text-center">
          📝 رتّب الآيات بالترتيب الصحيح
        </h2>
        <p className="text-[#5D6D7E] text-center mb-6">
          اضغط على الآية التالية أو اسحبها إلى المكان الصحيح
        </p>

        {/* Feedback Message */}
        {feedback.message && (
          <div 
            className={`p-4 rounded-xl mb-6 text-center text-lg font-bold animate-bounce ${
              feedback.type === "success" 
                ? "bg-[#27AE60]/20 text-[#27AE60]" 
                : "bg-[#E74C3C]/20 text-[#E74C3C]"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Arranged Verses Area */}
        <div 
          className="min-h-[200px] p-4 rounded-xl mb-6 border-2 border-dashed border-[#1B4D3E]/30"
          style={{ background: "#E8F5E9" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <h3 className="text-sm font-bold text-[#1B4D3E] mb-3">
            ✅ الآيات المرتبة ({arrangedVerses.length}/{verses.length})
          </h3>
          <div className="space-y-2">
            {arrangedVerses.map((verse, index) => (
              <div
                key={verse.id}
                className="p-3 rounded-xl bg-white border-2 border-[#27AE60] flex items-center gap-3 animate-fade-in"
              >
                <span 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "#27AE60" }}
                >
                  {index + 1}
                </span>
                <p className="text-[#2C3E50] text-lg flex-1">{verse.text}</p>
                <span className="text-[#27AE60]">✓</span>
              </div>
            ))}
            {arrangedVerses.length === 0 && (
              <p className="text-[#5D6D7E] text-center py-8">
                اسحب الآيات هنا بالترتيب الصحيح 👆
              </p>
            )}
          </div>
        </div>

        {/* Shuffled Verses */}
        {!isComplete && (
          <div>
            <h3 className="text-sm font-bold text-[#1B4D3E] mb-3">
              📚 اختر الآية التالية:
            </h3>
            <div className="space-y-2">
              {shuffledVerses.map((verse) => (
                <div
                  key={verse.id}
                  draggable
                  onDragStart={() => handleDragStart(verse)}
                  onClick={() => handleVerseClick(verse)}
                  className="p-4 rounded-xl bg-white border-2 border-[#1B4D3E]/20 cursor-pointer hover:border-[#1B4D3E] hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  <p className="text-[#2C3E50] text-lg">{verse.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete State */}
        {isComplete && (
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h3 className="text-2xl font-bold text-[#27AE60]">
              أحسنت! رتبت جميع الآيات بشكل صحيح!
            </h3>
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
      </Card>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ArrangeVerses;