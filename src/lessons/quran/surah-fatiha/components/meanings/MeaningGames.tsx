import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { encouragements } from "../../data/fatihaData";

interface VocabularyItem {
  id: number;
  word: string;
  meaning: string;
  explanation: string;
  example: string;
  verseId: number;
}

interface MeaningGamesProps {
  vocabulary: VocabularyItem[];
  onComplete: () => void;
}

const MeaningGames = ({ vocabulary, onComplete }: MeaningGamesProps) => {
  const [activeGame, setActiveGame] = useState<"choose" | "match">("choose");
  const [chooseGameComplete, setChooseGameComplete] = useState(false);
  const [matchGameComplete, setMatchGameComplete] = useState(false);

  const allComplete = chooseGameComplete && matchGameComplete;

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
        <h2 className="text-2xl font-bold text-[#1B4D3E] mb-6 text-center">
          🎮 ألعاب المعاني
        </h2>

        <Tabs value={activeGame} onValueChange={(v) => setActiveGame(v as "choose" | "match")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="choose"
              className="data-[state=active]:bg-[#1B4D3E] data-[state=active]:text-white"
            >
              🎯 اختر المعنى {chooseGameComplete && "✓"}
            </TabsTrigger>
            <TabsTrigger 
              value="match"
              className="data-[state=active]:bg-[#1B4D3E] data-[state=active]:text-white"
            >
              🔗 طابق الكلمات {matchGameComplete && "✓"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="choose">
            <ChooseMeaningGame 
              vocabulary={vocabulary} 
              onComplete={() => setChooseGameComplete(true)} 
            />
          </TabsContent>

          <TabsContent value="match">
            <MatchWordsGame 
              vocabulary={vocabulary} 
              onComplete={() => setMatchGameComplete(true)} 
            />
          </TabsContent>
        </Tabs>

        {allComplete && (
          <div className="mt-6 text-center">
            <Button
              onClick={onComplete}
              className="px-8 py-4 text-lg font-bold"
              style={{ background: "linear-gradient(135deg, #D4AF37, #F4D03F)", color: "#1B4D3E" }}
            >
              🎉 أحسنت! انتقل للفهم العميق ←
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

// Choose Meaning Game Component
const ChooseMeaningGame = ({ 
  vocabulary, 
  onComplete 
}: { 
  vocabulary: VocabularyItem[]; 
  onComplete: () => void;
}) => {
  const [questions, setQuestions] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" | "" }>({ message: "", type: "" });
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(shuffled);
    if (shuffled.length > 0) {
      generateOptions(shuffled[0]);
    }
  }, [vocabulary]);

  const generateOptions = (currentWord: VocabularyItem) => {
    const otherMeanings = vocabulary
      .filter(v => v.id !== currentWord.id)
      .map(v => v.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [...otherMeanings, currentWord.meaning].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const getRandomMessage = (type: "correct" | "wrong") => {
    const messages = encouragements[type];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentIndex];
    
    if (answer === currentQuestion.meaning) {
      setScore(score + 1);
      setFeedback({ message: getRandomMessage("correct"), type: "success" });
    } else {
      setFeedback({ message: getRandomMessage("wrong"), type: "error" });
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setFeedback({ message: "", type: "" });
      generateOptions(questions[nextIndex]);
    } else {
      setIsComplete(true);
      onComplete();
    }
  };

  const resetGame = () => {
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setFeedback({ message: "", type: "" });
    setScore(0);
    setIsComplete(false);
    if (shuffled.length > 0) {
      generateOptions(shuffled[0]);
    }
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-4">
      {!isComplete ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#5D6D7E]">السؤال {currentIndex + 1}/{questions.length}</span>
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#1B4D3E] font-bold">
              ⭐ {score}
            </span>
          </div>

          <div 
            className="p-6 rounded-xl text-center"
            style={{ background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)" }}
          >
            <p className="text-white/70 text-sm mb-2">ما معنى:</p>
            <p className="text-3xl font-bold text-white">{currentQuestion.word}</p>
          </div>

          {feedback.message && (
            <div 
              className={`p-3 rounded-xl text-center font-bold ${
                feedback.type === "success" 
                  ? "bg-[#27AE60]/20 text-[#27AE60]" 
                  : "bg-[#E74C3C]/20 text-[#E74C3C]"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {options.map((option, index) => {
              const isCorrect = option === currentQuestion.meaning;
              const isSelected = selectedAnswer === option;
              
              let bgColor = "white";
              let borderColor = "#1B4D3E";
              let textColor = "#1B4D3E";
              
              if (selectedAnswer) {
                if (isCorrect) {
                  bgColor = "#27AE60";
                  borderColor = "#27AE60";
                  textColor = "white";
                } else if (isSelected) {
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
                  className="p-4 rounded-xl font-bold transition-all duration-300 border-2"
                  style={{ background: bgColor, borderColor, color: textColor }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <Button
              onClick={nextQuestion}
              className="w-full py-3"
              style={{ background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)" }}
            >
              {currentIndex + 1 < questions.length ? "التالي ←" : "عرض النتيجة"}
            </Button>
          )}
        </>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-bold text-[#1B4D3E]">أحسنت!</h3>
          <p className="text-[#5D6D7E]">نتيجتك: {score}/{questions.length}</p>
          <Button onClick={resetGame} variant="outline" className="border-[#1B4D3E] text-[#1B4D3E]">
            🔄 أعد اللعب
          </Button>
        </div>
      )}
    </div>
  );
};

// Match Words Game Component
const MatchWordsGame = ({ 
  vocabulary, 
  onComplete 
}: { 
  vocabulary: VocabularyItem[]; 
  onComplete: () => void;
}) => {
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [shuffledMeanings, setShuffledMeanings] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" | "" }>({ message: "", type: "" });

  useEffect(() => {
    const selected = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, 6);
    setWords(selected);
    setShuffledMeanings(selected.map(w => w.meaning).sort(() => Math.random() - 0.5));
  }, [vocabulary]);

  const getRandomMessage = (type: "correct" | "wrong") => {
    const messages = encouragements[type];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleWordClick = (word: VocabularyItem) => {
    if (matchedPairs.includes(word.id)) return;
    setSelectedWord(word);
    
    if (selectedMeaning) {
      checkMatch(word, selectedMeaning);
    }
  };

  const handleMeaningClick = (meaning: string) => {
    if (matchedPairs.some(id => words.find(w => w.id === id)?.meaning === meaning)) return;
    setSelectedMeaning(meaning);
    
    if (selectedWord) {
      checkMatch(selectedWord, meaning);
    }
  };

  const checkMatch = (word: VocabularyItem, meaning: string) => {
    if (word.meaning === meaning) {
      setMatchedPairs([...matchedPairs, word.id]);
      setFeedback({ message: getRandomMessage("correct"), type: "success" });
      
      if (matchedPairs.length + 1 === words.length) {
        setTimeout(() => onComplete(), 1000);
      }
    } else {
      setFeedback({ message: getRandomMessage("wrong"), type: "error" });
    }
    
    setSelectedWord(null);
    setSelectedMeaning(null);
    setTimeout(() => setFeedback({ message: "", type: "" }), 1500);
  };

  const resetGame = () => {
    const selected = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, 6);
    setWords(selected);
    setShuffledMeanings(selected.map(w => w.meaning).sort(() => Math.random() - 0.5));
    setMatchedPairs([]);
    setSelectedWord(null);
    setSelectedMeaning(null);
    setFeedback({ message: "", type: "" });
  };

  const isComplete = matchedPairs.length === words.length;

  return (
    <div className="space-y-4">
      <p className="text-center text-[#5D6D7E] mb-4">
        اختر الكلمة ثم اختر معناها المناسب
      </p>

      {feedback.message && (
        <div 
          className={`p-3 rounded-xl text-center font-bold ${
            feedback.type === "success" 
              ? "bg-[#27AE60]/20 text-[#27AE60]" 
              : "bg-[#E74C3C]/20 text-[#E74C3C]"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Words Column */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-[#1B4D3E] text-center mb-2">الكلمات</h4>
          {words.map((word) => {
            const isMatched = matchedPairs.includes(word.id);
            const isSelected = selectedWord?.id === word.id;
            
            return (
              <button
                key={word.id}
                onClick={() => handleWordClick(word)}
                disabled={isMatched}
                className={`w-full p-3 rounded-xl font-bold transition-all duration-300 border-2 ${
                  isMatched 
                    ? "bg-[#27AE60] border-[#27AE60] text-white" 
                    : isSelected
                    ? "bg-[#1B4D3E] border-[#1B4D3E] text-white"
                    : "bg-white border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#E8F5E9]"
                }`}
              >
                {word.word}
                {isMatched && " ✓"}
              </button>
            );
          })}
        </div>

        {/* Meanings Column */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-[#1B4D3E] text-center mb-2">المعاني</h4>
          {shuffledMeanings.map((meaning, index) => {
            const matchedWord = words.find(w => w.meaning === meaning && matchedPairs.includes(w.id));
            const isMatched = !!matchedWord;
            const isSelected = selectedMeaning === meaning;
            
            return (
              <button
                key={index}
                onClick={() => handleMeaningClick(meaning)}
                disabled={isMatched}
                className={`w-full p-3 rounded-xl font-bold transition-all duration-300 border-2 ${
                  isMatched 
                    ? "bg-[#27AE60] border-[#27AE60] text-white" 
                    : isSelected
                    ? "bg-[#D4AF37] border-[#D4AF37] text-white"
                    : "bg-white border-[#D4AF37] text-[#1B4D3E] hover:bg-[#FFF8E7]"
                }`}
              >
                {meaning}
                {isMatched && " ✓"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <span className="text-[#5D6D7E]">
          تم المطابقة: {matchedPairs.length}/{words.length}
        </span>
      </div>

      {isComplete && (
        <div className="text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-bold text-[#1B4D3E]">أحسنت! طابقت جميع الكلمات!</h3>
          <Button onClick={resetGame} variant="outline" className="border-[#1B4D3E] text-[#1B4D3E]">
            🔄 أعد اللعب
          </Button>
        </div>
      )}
    </div>
  );
};

export default MeaningGames;