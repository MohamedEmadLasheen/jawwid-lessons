import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      dir="rtl" 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1B4D3E 0%, #2D7A5E 50%, #1B4D3E 100%)"
      }}
    >
      {/* Animated Islamic Patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Floating Stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          >
            <span 
              className="text-[#D4AF37]" 
              style={{ 
                fontSize: `${12 + Math.random() * 16}px`,
                opacity: 0.6 + Math.random() * 0.4 
              }}
            >
              {["✦", "✧", "⭐", "🌟", "✨"][Math.floor(Math.random() * 5)]}
            </span>
          </div>
        ))}
        
        {/* Crescent Moons */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`moon-${i}`}
            className="absolute animate-pulse-slow"
            style={{
              top: `${10 + Math.random() * 30}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <span className="text-[#D4AF37] text-3xl opacity-40">🌙</span>
          </div>
        ))}

        {/* Geometric Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        {/* Logo Section */}
        <div className="mb-6 animate-fade-in">
          <div 
            className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-[#D4AF37] transform hover:scale-105 transition-transform duration-300"
            style={{
              boxShadow: "0 0 40px rgba(212, 175, 55, 0.5), 0 20px 60px rgba(0, 0, 0, 0.3)"
            }}
          >
            <img
              src="/assets/jawwid-logo.jpg"
              alt="أكاديمية جَوِّد"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Academy Name */}
        <div className="text-center mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h1 
            className="text-5xl md:text-6xl font-bold mb-2"
            style={{ 
              color: "#FFFFFF",
              textShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(212, 175, 55, 0.3)"
            }}
          >
            أكاديمية جَوِّد
          </h1>
          <p 
            className="text-xl font-medium"
            style={{ color: "#D4AF37" }}
          >
            Jawwid Academy
          </p>
        </div>

        {/* Slogan */}
        <div 
          className="mb-8 px-8 py-3 rounded-full animate-fade-in"
          style={{ 
            background: "linear-gradient(135deg, #D4AF37, #F4D03F)",
            boxShadow: "0 10px 30px rgba(212, 175, 55, 0.4)",
            animationDelay: "0.4s"
          }}
        >
          <p className="text-xl font-bold" style={{ color: "#1B4D3E" }}>
            ✨ عِلمٌ يُنتَفَعُ بِه ✨
          </p>
        </div>

        {/* Welcome Card */}
        <Card 
          className="max-w-2xl mx-auto p-6 mb-8 text-center animate-fade-in"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "3px solid #D4AF37",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(212, 175, 55, 0.2)",
            animationDelay: "0.6s"
          }}
        >
          <h2 className="text-2xl font-bold text-[#1B4D3E] mb-3">
            🌟 مرحباً بك يا بطل! 🌟
          </h2>
          <p className="text-lg text-[#5D6D7E] leading-relaxed mb-3">
            هيا نبدأ رحلة ممتعة مع القرآن الكريم!
            <br />
            سنتعلم معاً، نلعب، ونحفظ كلام الله
          </p>
          <div className="flex justify-center gap-2 text-3xl">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>📖</span>
            <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>🌙</span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>🕌</span>
          </div>
        </Card>

        {/* Surah Selection */}
        <div className="w-full max-w-md animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <h3 className="text-xl font-bold text-white text-center mb-4 drop-shadow-lg">
            📚 اختر السورة للبدء
          </h3>
          
          <Card
            className="p-5 cursor-pointer transform transition-all duration-300"
            style={{
              background: isHovered 
                ? "linear-gradient(135deg, #D4AF37, #F4D03F)" 
                : "rgba(255, 255, 255, 0.95)",
              border: "3px solid #D4AF37",
              borderRadius: "20px",
              boxShadow: isHovered 
                ? "0 20px 50px rgba(212, 175, 55, 0.5)" 
                : "0 10px 30px rgba(0, 0, 0, 0.2)",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate("surah/fatiha")}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300"
                style={{
                  background: isHovered ? "#1B4D3E" : "linear-gradient(135deg, #D4AF37, #F4D03F)",
                  color: isHovered ? "#D4AF37" : "#1B4D3E",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                }}
              >
                ١
              </div>
              <div className="flex-1">
                <h4 
                  className="text-2xl font-bold mb-1 transition-colors duration-300"
                  style={{ color: "#1B4D3E" }}
                >
                  سورة الفاتحة
                </h4>
                <p 
                  className="text-sm transition-colors duration-300"
                  style={{ color: isHovered ? "#1B4D3E" : "#5D6D7E" }}
                >
                  أم الكتاب • ٧ آيات • مكية
                </p>
              </div>
              <div 
                className="text-3xl transform transition-transform duration-300"
                style={{ transform: isHovered ? "translateX(-10px) scale(1.2)" : "translateX(0)" }}
              >
                {isHovered ? "🚀" : "📖"}
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Quote */}
        <div 
          className="mt-10 text-center animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          <div 
            className="inline-block px-6 py-3 rounded-2xl"
            style={{ 
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)"
            }}
          >
            <p className="text-white text-lg italic mb-1">
              "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
            </p>
            <p className="text-[#D4AF37] text-sm">
              حديث شريف
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;