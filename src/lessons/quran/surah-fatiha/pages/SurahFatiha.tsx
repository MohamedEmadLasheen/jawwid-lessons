import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useNavigate } from "react-router-dom";
import { surahInfo, verses, vocabulary, surahMessages, surahVirtues, encouragements, dailyLifeApplications } from "../data/fatihaData";
import SurahReader from "../components/surah/SurahReader";
import ArrangeVerses from "../components/games/ArrangeVerses";
import ChooseWord from "../components/games/ChooseWord";
import FixErrors from "../components/games/FixErrors";
import VocabularyCards from "../components/meanings/VocabularyCards";
import MeaningGames from "../components/meanings/MeaningGames";

type Section = 
  | "intro" 
  | "reader"
  | "arrange" 
  | "choose" 
  | "fix" 
  | "vocabulary" 
  | "meaningGames" 
  | "understanding" 
  | "virtues" 
  | "complete";

const SurahFatiha = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<Section>("intro");
  const [completedSections, setCompletedSections] = useState<Section[]>([]);

  const sections: { id: Section; title: string; icon: string }[] = [
    { id: "intro", title: "المقدمة", icon: "🌟" },
    { id: "reader", title: "السورة", icon: "📖" },
    { id: "arrange", title: "ترتيب الآيات", icon: "📝" },
    { id: "choose", title: "اختر الكلمة", icon: "🎯" },
    { id: "fix", title: "صحح الخطأ", icon: "🔧" },
    { id: "vocabulary", title: "المعاني", icon: "📚" },
    { id: "meaningGames", title: "ألعاب المعاني", icon: "🎮" },
    { id: "understanding", title: "الفهم العميق", icon: "💡" },
    { id: "virtues", title: "فضل السورة", icon: "✨" },
    { id: "complete", title: "الإنجاز", icon: "🏆" },
  ];

  const currentIndex = sections.findIndex(s => s.id === currentSection);
  const progress = ((currentIndex + 1) / sections.length) * 100;

  const completeSection = (section: Section) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
  };

  const goToNextSection = () => {
    completeSection(currentSection);
    const nextIndex = currentIndex + 1;
    if (nextIndex < sections.length) {
      setCurrentSection(sections[nextIndex].id);
    }
  };

  const goToPrevSection = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentSection(sections[prevIndex].id);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case "intro":
        return <IntroSection onNext={goToNextSection} />;
      case "reader":
        return <SurahReader verses={verses} onComplete={goToNextSection} />;
      case "arrange":
        return <ArrangeVerses verses={verses} onComplete={goToNextSection} />;
      case "choose":
        return <ChooseWord verses={verses} onComplete={goToNextSection} />;
      case "fix":
        return <FixErrors verses={verses} onComplete={goToNextSection} />;
      case "vocabulary":
        return <VocabularyCards vocabulary={vocabulary} onComplete={goToNextSection} />;
      case "meaningGames":
        return <MeaningGames vocabulary={vocabulary} onComplete={goToNextSection} />;
      case "understanding":
        return <UnderstandingSection onNext={goToNextSection} />;
      case "virtues":
        return <VirtuesSection onNext={goToNextSection} />;
      case "complete":
        return <CompleteSection />;
      default:
        return null;
    }
  };

  return (
    <div 
      dir="rtl" 
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #F8F6F0 0%, #E8F5E9 50%, #F8F6F0 100%)"
      }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 px-4 py-3"
        style={{
          background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)",
          boxShadow: "0 4px 20px rgba(27, 77, 62, 0.3)"
        }}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between mt-[0px] mr-[0px] mb-[12px] ml-[0px] pt-[0px] pr-[0px] pb-[0px] pl-[0px] rounded-none text-[16px] font-normal text-[#020817] bg-[#00000000] opacity-100">
            <div className="flex items-center gap-3">
              
              <div>
                <h1 className="text-white font-bold text-lg">سورة {surahInfo.name}</h1>
                <p className="text-white/70 text-xs">{sections[currentIndex].title}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              🏠 الرئيسية
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <Progress value={progress} className="h-3 flex-1 bg-white/20" />
            <span className="text-white text-sm font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
      </header>

      {/* Navigation Pills */}
      <div className="container mx-auto px-4 py-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                currentSection === section.id
                  ? "bg-[#1B4D3E] text-white shadow-lg"
                  : completedSections.includes(section.id)
                  ? "bg-[#27AE60] text-white"
                  : "bg-white text-[#5D6D7E] hover:bg-[#E8F5E9]"
              }`}
              style={{
                border: currentSection === section.id ? "2px solid #D4AF37" : "2px solid transparent"
              }}
            >
              <span>{section.icon}</span>
              <span className="hidden sm:inline">{section.title}</span>
              {completedSections.includes(section.id) && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderSection()}
      </main>

      {/* Navigation Buttons */}
      {currentSection !== "intro" && currentSection !== "complete" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-[#E8F5E9]">
          <div className="container mx-auto flex justify-between">
            <Button
              variant="outline"
              onClick={goToPrevSection}
              className="border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white"
            >
              ← السابق
            </Button>
            <Button
              onClick={goToNextSection}
              className="bg-[#1B4D3E] hover:bg-[#2D7A5E] text-white"
            >
              التالي →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Intro Section Component
const IntroSection = ({ onNext }: { onNext: () => void }) => {
  const randomEncouragement = encouragements.start[Math.floor(Math.random() * encouragements.start.length)];
  
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-20">
      <Card 
        className="p-8 text-center"
        style={{
          background: "white",
          borderRadius: "24px",
          border: "3px solid #D4AF37",
          boxShadow: "0 10px 40px rgba(27, 77, 62, 0.15)"
        }}
      >
        {/* Logo */}
        <div className="mb-6">
          
        </div>
        
        <h2 className="text-3xl font-bold text-[#1B4D3E] mb-4">
          🌟 {randomEncouragement}
        </h2>
        
        <div className="bg-[#E8F5E9] rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-[#1B4D3E] mb-3">سورة الفاتحة</h3>
          <p className="text-[#5D6D7E] mb-4">
            أعظم سورة في القرآن الكريم، نقرأها في كل صلاة
          </p>
          <div className="flex justify-center gap-4 text-sm text-[#2D7A5E]">
            <span className="bg-white px-3 py-1 rounded-full">📍 مكية</span>
            <span className="bg-white px-3 py-1 rounded-full">📖 ٧ آيات</span>
            <span className="bg-white px-3 py-1 rounded-full">🔢 السورة الأولى</span>
          </div>
        </div>

        <div className="space-y-3 text-right mb-6">
          <h4 className="font-bold text-[#1B4D3E]">🎯 ماذا سنتعلم اليوم؟</h4>
          <ul className="space-y-2 text-[#5D6D7E]">
            <li className="flex items-center gap-2">
              <span className="text-[#27AE60]">✓</span>
              قراءة السورة كاملة مع التفسير
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#27AE60]">✓</span>
              الاستماع بصوت الشيخ الحصري
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#27AE60]">✓</span>
              حفظ آيات السورة بطريقة ممتعة
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#27AE60]">✓</span>
              فهم معاني الكلمات
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#27AE60]">✓</span>
              تطبيق ما نتعلمه في حياتنا
            </li>
          </ul>
        </div>

        <Button
          onClick={onNext}
          className="w-full py-6 text-xl font-bold rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)",
          }}
        >
          🚀 هيا نبدأ!
        </Button>
      </Card>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Understanding Section Component
const UnderstandingSection = ({ onNext }: { onNext: () => void }) => {
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
          💡 ماذا نتعلم من سورة الفاتحة؟
        </h2>

        <div className="space-y-4">
          {surahMessages.map((message) => (
            <div
              key={message.id}
              className="p-4 rounded-xl bg-[#E8F5E9] border-2 border-[#2D7A5E]/20"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{message.icon}</span>
                <div>
                  <h3 className="font-bold text-[#1B4D3E] mb-1">{message.title}</h3>
                  <p className="text-[#5D6D7E] text-sm">{message.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card 
        className="p-6"
        style={{
          background: "white",
          borderRadius: "20px",
          border: "2px solid #E8F5E9"
        }}
      >
        <h2 className="text-2xl font-bold text-[#1B4D3E] mb-6 text-center">
          🌈 كيف نطبق ذلك في حياتنا؟
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {dailyLifeApplications.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-xl text-center"
              style={{
                background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)",
              }}
            >
              <span className="text-4xl block mb-2">{app.icon}</span>
              <h3 className="font-bold text-white mb-1">{app.title}</h3>
              <p className="text-white/80 text-xs">{app.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card 
        className="p-6"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #F4D03F)",
          borderRadius: "20px",
        }}
      >
        <h2 className="text-xl font-bold text-[#1B4D3E] mb-4 text-center">
          🤔 سؤال للتأمل
        </h2>
        <p className="text-[#1B4D3E] text-center text-lg">
          عندما تقول "الحمد لله رب العالمين"، ما هي النعم التي تشكر الله عليها؟
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["الصحة 💪", "العائلة 👨‍👩‍👧‍👦", "الطعام 🍎", "المدرسة 📚", "الأصدقاء 👫"].map((item) => (
            <span
              key={item}
              className="bg-white/50 px-3 py-1 rounded-full text-[#1B4D3E] text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Virtues Section Component
const VirtuesSection = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <Card 
        className="p-6"
        style={{
          background: "white",
          borderRadius: "20px",
          border: "3px solid #D4AF37"
        }}
      >
        <h2 className="text-2xl font-bold text-[#1B4D3E] mb-6 text-center">
          ✨ فضل سورة الفاتحة
        </h2>

        <div className="space-y-4">
          {surahVirtues.map((virtue, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-l from-[#E8F5E9] to-white"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)" }}
              >
                {index + 1}
              </div>
              <p className="text-[#2C3E50] flex-1">{virtue}</p>
              <span className="text-2xl">⭐</span>
            </div>
          ))}
        </div>
      </Card>

      <Card 
        className="p-6 text-center"
        style={{
          background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)",
          borderRadius: "20px",
        }}
      >
        <span className="text-5xl block mb-4">🌙</span>
        <h3 className="text-xl font-bold text-white mb-2">هل تعلم؟</h3>
        <p className="text-white/90">
          سورة الفاتحة تسمى "السبع المثاني" لأنها سبع آيات تُقرأ في كل ركعة!
        </p>
      </Card>
    </div>
  );
};

// Complete Section Component
const CompleteSection = () => {
  const navigate = useNavigate();
  const randomComplete = encouragements.complete[Math.floor(Math.random() * encouragements.complete.length)];

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6 pb-10">
      <Card 
        className="p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1B4D3E, #2D7A5E)",
          borderRadius: "24px",
          border: "4px solid #D4AF37"
        }}
      >
        {/* Confetti Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">{["⭐", "🌟", "✨", "💫", "🎉"][Math.floor(Math.random() * 5)]}</span>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-6">
            <div 
              className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-[#D4AF37]"
              style={{
                boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)"
              }}
            >
              <img
                src="https://mgx-backend-cdn.metadl.com/generate/images/936477/2026-02-10/e366ea4d-e63d-4a19-9dff-9c3833a68525.png"
                alt="أكاديمية جَوِّد"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mb-6">
            <span className="text-7xl block mb-4">🏆</span>
            <h2 className="text-3xl font-bold text-white mb-2">
              {randomComplete}
            </h2>
            <p className="text-white/80 text-lg">
              لقد أتممت تعلم سورة الفاتحة!
            </p>
          </div>

          {/* Achievement Badge */}
          <div 
            className="inline-block p-6 rounded-full mb-6"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #F4D03F)",
              boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)"
            }}
          >
            <div className="text-center">
              <span className="text-4xl block">🎖️</span>
              <p className="text-[#1B4D3E] font-bold mt-2">حافظ الفاتحة</p>
            </div>
          </div>

          {/* Dua */}
          <div className="bg-white/20 rounded-2xl p-4 mb-6">
            <p className="text-white text-lg italic">
              "اللهم اجعل القرآن ربيع قلوبنا ونور صدورنا"
            </p>
            <p className="text-white/70 text-sm mt-2">آمين 🤲</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="bg-white text-[#1B4D3E] hover:bg-white/90 border-0"
            >
              🏠 الرئيسية
            </Button>
            <Button
              className="bg-[#D4AF37] hover:bg-[#F4D03F] text-[#1B4D3E]"
              disabled
            >
              السورة التالية 🔜
            </Button>
          </div>
        </div>
      </Card>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SurahFatiha;