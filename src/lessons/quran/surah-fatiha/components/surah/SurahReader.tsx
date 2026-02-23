import { useState, useRef, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface Verse {
  id: number;
  text: string;
  audio: string;
  tafsir: string;
}

interface SurahReaderProps {
  verses: Verse[];
  onComplete: () => void;
}

const SurahReader = ({ verses, onComplete }: SurahReaderProps) => {
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingAllRef = useRef(false);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, []);

  const handleVerseClick = (verse: Verse) => {
    setSelectedVerse(selectedVerse?.id === verse.id ? null : verse);
    setAudioError(null);
  };

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentPlayingId(null);
    setIsPlayingAll(false);
    isPlayingAllRef.current = false;
  };

  const playAudio = (verse: Verse, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAudioError(null);
    
    // If same verse is playing, stop it
    if (currentPlayingId === verse.id && isPlaying) {
      stopCurrentAudio();
      return;
    }

    // Stop any currently playing audio first
    stopCurrentAudio();

    // Create new audio element
    const audio = new Audio(verse.audio);
    audioRef.current = audio;
    
    // Set state before playing
    setCurrentPlayingId(verse.id);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentPlayingId(null);
    };

    audio.onerror = () => {
      setAudioError("تعذر تحميل الصوت. يرجى التحقق من اتصال الإنترنت.");
      setIsPlaying(false);
      setCurrentPlayingId(null);
    };

    // Play the audio
    audio.play().catch((err) => {
      console.error("Play error:", err);
      setAudioError("تعذر تشغيل الصوت. يرجى المحاولة مرة أخرى.");
      setIsPlaying(false);
      setCurrentPlayingId(null);
    });
  };

  const playAllVerses = async () => {
    if (isPlayingAll) {
      stopCurrentAudio();
      return;
    }

    setIsPlayingAll(true);
    isPlayingAllRef.current = true;
    setAudioError(null);

    for (let i = 0; i < verses.length; i++) {
      // Check if stopped
      if (!isPlayingAllRef.current) break;
      
      const verse = verses[i];
      setCurrentPlayingId(verse.id);
      setIsPlaying(true);
      
      try {
        await new Promise<void>((resolve, reject) => {
          // Check again before creating audio
          if (!isPlayingAllRef.current) {
            reject(new Error("Stopped"));
            return;
          }

          const audio = new Audio(verse.audio);
          audioRef.current = audio;
          
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error("Audio load failed"));
          
          audio.play().catch(reject);
        });
      } catch (err) {
        console.error("Error playing verse:", verse.id, err);
        if (!isPlayingAllRef.current) break;
        // Continue to next verse even if one fails
      }
    }
    
    setIsPlaying(false);
    setCurrentPlayingId(null);
    setIsPlayingAll(false);
    isPlayingAllRef.current = false;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <Card 
        className="p-6"
        style={{
          background: "white",
          borderRadius: "20px",
          border: "3px solid #D4AF37"
        }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#1B4D3E] mb-2">
            📖 سورة الفاتحة كاملة
          </h2>
          <p className="text-[#5D6D7E]">
            اضغط على أي آية لقراءة تفسيرها وسماعها بصوت الشيخ الحصري
          </p>
        </div>

        {/* Error Message */}
        {audioError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center text-sm">
            ⚠️ {audioError}
          </div>
        )}

        {/* Play All Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={playAllVerses}
            className="px-6 py-3 text-lg font-bold rounded-full transition-all duration-300"
            style={{
              background: isPlayingAll 
                ? "linear-gradient(135deg, #E74C3C, #C0392B)" 
                : "linear-gradient(135deg, #1B4D3E, #2D7A5E)",
            }}
          >
            {isPlayingAll ? (
              <>
                <span className="ml-2">⏹️</span>
                إيقاف التشغيل
              </>
            ) : (
              <>
                <span className="ml-2">▶️</span>
                استمع للسورة كاملة
              </>
            )}
          </Button>
        </div>

        {/* Verses List */}
        <div className="space-y-3">
          {verses.map((verse) => (
            <div key={verse.id}>
              {/* Verse Card */}
              <div
                onClick={() => handleVerseClick(verse)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedVerse?.id === verse.id 
                    ? "ring-2 ring-[#D4AF37]" 
                    : "hover:bg-[#E8F5E9]"
                }`}
                style={{
                  background: selectedVerse?.id === verse.id 
                    ? "linear-gradient(135deg, #E8F5E9, #F8F6F0)" 
                    : currentPlayingId === verse.id 
                    ? "#FFF8E7"
                    : "white",
                  border: `2px solid ${selectedVerse?.id === verse.id ? "#D4AF37" : "#E8F5E9"}`,
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Verse Number */}
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 ${
                      currentPlayingId === verse.id && isPlaying ? "animate-pulse" : ""
                    }`}
                    style={{
                      background: currentPlayingId === verse.id 
                        ? "#D4AF37" 
                        : "linear-gradient(135deg, #1B4D3E, #2D7A5E)",
                      color: "white",
                    }}
                  >
                    {verse.id}
                  </div>

                  {/* Verse Text */}
                  <p 
                    className="flex-1 text-xl leading-loose"
                    style={{ 
                      color: "#1B4D3E",
                      fontFamily: "'Amiri', serif"
                    }}
                  >
                    {verse.text}
                  </p>

                  {/* Audio Button */}
                  <button
                    onClick={(e) => playAudio(verse, e)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentPlayingId === verse.id && isPlaying
                        ? "bg-[#D4AF37] animate-pulse scale-110"
                        : "bg-[#E8F5E9] hover:bg-[#D4AF37] hover:scale-105"
                    }`}
                    title="استمع للآية"
                  >
                    <span className="text-xl">
                      {currentPlayingId === verse.id && isPlaying ? "🔊" : "🔈"}
                    </span>
                  </button>
                </div>

                {/* Expand Indicator */}
                <div className="flex justify-center mt-2">
                  <span 
                    className={`text-[#5D6D7E] text-xs transition-transform duration-300 ${
                      selectedVerse?.id === verse.id ? "rotate-180" : ""
                    }`}
                  >
                    {selectedVerse?.id === verse.id ? "▲ إخفاء التفسير" : "▼ عرض التفسير"}
                  </span>
                </div>
              </div>

              {/* Tafsir Panel */}
              {selectedVerse?.id === verse.id && (
                <div 
                  className="mt-2 p-5 rounded-xl animate-fade-in"
                  style={{
                    background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)",
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">📜</span>
                    <h3 className="text-lg font-bold text-white">تفسير الآية</h3>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed pr-9">
                    {verse.tafsir}
                  </p>
                  
                  {/* Audio Controls */}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <Button
                      onClick={(e) => playAudio(verse, e)}
                      variant="outline"
                      className={`w-full border-white/30 text-white transition-all duration-300 ${
                        currentPlayingId === verse.id && isPlaying 
                          ? "bg-[#D4AF37] border-[#D4AF37]" 
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {currentPlayingId === verse.id && isPlaying ? (
                        <>
                          <span className="animate-pulse ml-2">🔊</span>
                          جاري التشغيل... (اضغط للإيقاف)
                        </>
                      ) : (
                        <>
                          <span className="ml-2">🎧</span>
                          استمع بصوت الشيخ الحصري
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reciter Info */}
        <div 
          className="mt-6 p-4 rounded-xl text-center"
          style={{ background: "#FFF8E7" }}
        >
          <p className="text-[#856404] text-sm">
            🎙️ التلاوة بصوت الشيخ <span className="font-bold">محمود خليل الحصري</span> رحمه الله
          </p>
        </div>

        {/* Continue Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={onComplete}
            className="px-8 py-4 text-lg font-bold rounded-full"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #F4D03F)",
              color: "#1B4D3E"
            }}
          >
            انتقل لألعاب الحفظ ←
          </Button>
        </div>
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

export default SurahReader;