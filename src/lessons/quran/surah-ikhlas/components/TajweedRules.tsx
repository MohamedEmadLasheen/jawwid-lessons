import React, { useState } from 'react';
import { GlowCard } from './IslamicPattern';
import { BookOpen, Star, Heart } from 'lucide-react';

interface TajweedRule {
  name: string;
  description: string;
  example: string;
  color: string;
  bgColor: string;
  location: string;
}

const tajweedRules: TajweedRule[] = [
  {
    name: 'إدغام بغنة',
    description: 'عندما تأتي النون الساكنة أو التنوين قبل حروف (يرملون)، ندمج الحرفين معاً مع صوت جميل من الأنف',
    example: 'أَحَدٌ ۝ اللَّهُ',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/30',
    location: 'بين الآية 1 والآية 2',
  },
  {
    name: 'لام شمسية',
    description: 'عندما تأتي "ال" قبل حرف شمسي مثل الصاد، لا ننطق اللام بل ندغمها',
    example: 'الصَّمَدُ',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
    location: 'الآية 2',
  },
  {
    name: 'مد طبيعي',
    description: 'نمد الحرف مدة حركتين (مثل عدّ 1-2) عندما يأتي بعد حرف المد حرف متحرك',
    example: 'هُوَ',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
    location: 'الآية 1',
  },
  {
    name: 'إظهار حلقي',
    description: 'ننطق النون الساكنة أو التنوين بوضوح عندما يأتي بعدها حرف من حروف الحلق',
    example: 'كُفُوًا أَحَدٌ',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/30',
    location: 'الآية 4',
  },
  {
    name: 'إدغام بغير غنة',
    description: 'ندمج النون الساكنة مع حرف اللام أو الراء بدون صوت الأنف',
    example: 'يَكُن لَّهُ',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/30',
    location: 'الآية 4',
  },
];

const TajweedSection: React.FC = () => {
  const [activeRule, setActiveRule] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {tajweedRules.map((rule, index) => (
        <div
          key={index}
          onClick={() => setActiveRule(activeRule === index ? null : index)}
          className={`rounded-2xl p-5 cursor-pointer transition-all duration-500 border ${
            activeRule === index ? rule.bgColor + ' scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/8'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${rule.bgColor}`}>
              <span className={rule.color}>{index + 1}</span>
            </div>
            <div className="flex-1">
              <h4 className={`font-tajawal font-bold text-lg ${rule.color}`}>{rule.name}</h4>
              <p className="text-white/50 text-sm font-tajawal">{rule.location}</p>
            </div>
            <div className={`font-amiri text-xl ${rule.color}`}>{rule.example}</div>
          </div>

          {activeRule === index && (
            <div className="mt-4 pr-16 animate-in fade-in slide-in-from-top-2 duration-500">
              <p className="text-blue-200/70 font-tajawal leading-relaxed text-sm">
                {rule.description}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-lg ${rule.bgColor}`}>
                  <span className={`font-amiri text-lg ${rule.color}`}>{rule.example}</span>
                </div>
                <span className="text-white/40 text-xs font-tajawal">← اضغط للاستماع</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const StorySection: React.FC = () => (
  <div className="space-y-6">
    <GlowCard>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-gold" />
        </div>
        <div>
          <h4 className="text-gold font-tajawal font-bold text-lg mb-3">📜 سبب نزول السورة</h4>
          <div className="space-y-3 text-blue-200/80 font-tajawal leading-relaxed text-sm">
            <p>
              جاء المشركون إلى النبي محمد ﷺ وسألوه: <span className="text-gold">"صِف لنا ربك يا محمد، من أي شيء هو؟"</span>
            </p>
            <p>
              كانوا يريدون أن يعرفوا عن الله، فأنزل الله هذه السورة العظيمة ليُعلّم الناس جميعاً من هو الله.
            </p>
            <p>
              فكانت هذه السورة هي الجواب الكامل والواضح: <span className="text-teal-300">الله واحد أحد، لا يشبهه أحد!</span>
            </p>
          </div>
        </div>
      </div>
    </GlowCard>

    <GlowCard>
      <h4 className="text-teal-300 font-tajawal font-bold text-lg mb-4">🎯 الموضوعات الرئيسية</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: '☝️', title: 'التوحيد', desc: 'الله واحد لا شريك له' },
          { icon: '💪', title: 'الصمدية', desc: 'الله يحتاج إليه كل شيء' },
          { icon: '🌟', title: 'التنزيه', desc: 'الله ليس كمثله شيء' },
          { icon: '👑', title: 'الكمال', desc: 'الله كامل في كل صفاته' },
        ].map((topic, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">{topic.icon}</span>
            <div>
              <h5 className="text-white font-tajawal font-bold text-sm">{topic.title}</h5>
              <p className="text-blue-200/60 text-xs font-tajawal">{topic.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </GlowCard>

    <GlowCard>
      <h4 className="text-amber-300 font-tajawal font-bold text-lg mb-4">💡 دروس حياتية للطفل</h4>
      <div className="space-y-3">
        {[
          'الله وحده هو من نلجأ إليه في كل أمورنا',
          'لا نعبد إلا الله ولا نطلب العون إلا منه',
          'الله مختلف عن كل المخلوقات، لا نشبهه بأحد',
          'نحب الله لأنه يرعانا ويحفظنا دائماً',
        ].map((lesson, i) => (
          <div key={i} className="flex items-center gap-3 bg-amber-500/5 rounded-xl p-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 text-sm font-bold">
              {i + 1}
            </div>
            <p className="text-blue-200/80 font-tajawal text-sm">{lesson}</p>
          </div>
        ))}
      </div>
    </GlowCard>
  </div>
);

const VirtuesSection: React.FC = () => (
  <div className="space-y-6">
    <GlowCard glowColor="gold">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
          <Star className="w-6 h-6 text-gold" />
        </div>
        <div>
          <h4 className="text-gold font-tajawal font-bold text-lg mb-3">تعدل ثلث القرآن</h4>
          <p className="text-blue-200/80 font-tajawal text-sm leading-relaxed">
            قال رسول الله ﷺ: <span className="text-gold">"قُلْ هُوَ اللَّهُ أَحَدٌ تَعْدِلُ ثُلُثَ الْقُرْآنِ"</span>
          </p>
          <p className="text-blue-200/60 font-tajawal text-xs mt-2">(رواه مسلم)</p>
        </div>
      </div>
    </GlowCard>

    <GlowCard glowColor="green">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <Heart className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h4 className="text-green-400 font-tajawal font-bold text-lg mb-3">حب الله لمن يقرأها</h4>
          <p className="text-blue-200/80 font-tajawal text-sm leading-relaxed">
            أن رجلاً كان يقرأ سورة الإخلاص في كل ركعة، فقال النبي ﷺ: <span className="text-green-300">"سَلُوهُ لِمَ يَصْنَعُ ذَلِكَ؟"</span> فقال: لأنها صفة الرحمن وأنا أحب أن أقرأ بها. فقال النبي ﷺ: <span className="text-green-300">"أَخْبِرُوهُ أَنَّ اللَّهَ يُحِبُّهُ"</span>
          </p>
          <p className="text-blue-200/60 font-tajawal text-xs mt-2">(رواه البخاري ومسلم)</p>
        </div>
      </div>
    </GlowCard>

    <GlowCard glowColor="teal">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🛡️</span>
        </div>
        <div>
          <h4 className="text-teal-300 font-tajawal font-bold text-lg mb-3">من أذكار الصباح والمساء</h4>
          <p className="text-blue-200/80 font-tajawal text-sm leading-relaxed">
            كان النبي ﷺ يقرأ سورة الإخلاص مع المعوذتين <span className="text-teal-300">ثلاث مرات صباحاً ومساءً</span>، فتكفيه من كل شيء.
          </p>
          <p className="text-blue-200/60 font-tajawal text-xs mt-2">(رواه أبو داود والترمذي)</p>
        </div>
      </div>
    </GlowCard>

    <div className="text-center p-6 bg-gradient-to-r from-gold/10 via-amber-500/10 to-gold/10 rounded-2xl border border-gold/20">
      <p className="text-gold font-tajawal text-lg font-bold mb-2">✨ هل تعلم؟</p>
      <p className="text-white font-tajawal">
        إذا قرأت سورة الإخلاص 3 مرات فكأنك قرأت القرآن كاملاً!
      </p>
      <p className="text-blue-200/60 font-tajawal text-sm mt-1">فاحرص على قراءتها كل يوم 💛</p>
    </div>
  </div>
);

const TajweedRules: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tajweed' | 'story' | 'virtues'>('tajweed');

  const tabs = [
    { id: 'tajweed' as const, label: '🎨 أحكام التجويد', icon: '🎨' },
    { id: 'story' as const, label: '📖 القصة والسياق', icon: '📖' },
    { id: 'virtues' as const, label: '⭐ فضل السورة', icon: '⭐' },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-xl font-tajawal font-bold text-sm transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gold text-primary-bg shadow-lg shadow-gold/20'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'tajweed' && <TajweedSection />}
      {activeTab === 'story' && <StorySection />}
      {activeTab === 'virtues' && <VirtuesSection />}
    </div>
  );
};

export default TajweedRules;