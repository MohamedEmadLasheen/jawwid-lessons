import React, { useState } from 'react';
import { GlowCard } from './IslamicPattern';
import { CheckCircle2, Circle, RotateCcw, Heart } from 'lucide-react';

interface DayPlan {
  day: number;
  title: string;
  task: string;
  verses: string;
  repeats: number;
}

const plan: DayPlan[] = [
  { day: 1, title: 'اليوم الأول', task: 'استمع للسورة كاملة 5 مرات مع التركيز', verses: 'السورة كاملة', repeats: 5 },
  { day: 2, title: 'اليوم الثاني', task: 'احفظ الآية الأولى مع التكرار', verses: 'قُلْ هُوَ اللَّهُ أَحَدٌ', repeats: 20 },
  { day: 3, title: 'اليوم الثالث', task: 'احفظ الآية الثانية وراجع الأولى', verses: 'اللَّهُ الصَّمَدُ', repeats: 20 },
  { day: 4, title: 'اليوم الرابع', task: 'احفظ الآية الثالثة وراجع ما سبق', verses: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', repeats: 20 },
  { day: 5, title: 'اليوم الخامس', task: 'احفظ الآية الرابعة وراجع ما سبق', verses: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', repeats: 20 },
  { day: 6, title: 'اليوم السادس', task: 'اقرأ السورة كاملة من حفظك 10 مرات', verses: 'السورة كاملة', repeats: 10 },
  { day: 7, title: 'اليوم السابع', task: 'مراجعة نهائية وتسميع للوالدين', verses: 'السورة كاملة', repeats: 5 },
];

const MemorizationPlan: React.FC = () => {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [dailyRepeats, setDailyRepeats] = useState<Record<number, number>>({});

  const toggleDay = (day: number) => {
    setCompletedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  const addRepeat = (day: number, max: number) => {
    setDailyRepeats(prev => {
      const current = prev[day] || 0;
      if (current >= max) return prev;
      return { ...prev, [day]: current + 1 };
    });
  };

  const resetRepeats = (day: number) => {
    setDailyRepeats(prev => ({ ...prev, [day]: 0 }));
  };

  const progress = (completedDays.size / plan.length) * 100;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-blue-200/60 font-tajawal">تقدم الحفظ</span>
          <span className="text-sm text-gold font-tajawal font-bold">{completedDays.size}/{plan.length} أيام</span>
        </div>
        <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {progress > 10 && (
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                {Math.round(progress)}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {plan.map((dayPlan) => {
          const isCompleted = completedDays.has(dayPlan.day);
          const repeats = dailyRepeats[dayPlan.day] || 0;
          const repeatProgress = (repeats / dayPlan.repeats) * 100;

          return (
            <div
              key={dayPlan.day}
              className={`rounded-2xl p-5 border transition-all duration-500 ${
                isCompleted
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-white/5 border-white/10 hover:border-gold/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleDay(dayPlan.day)}
                  className="mt-1 flex-shrink-0 transition-all duration-300"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7 text-green-400" />
                  ) : (
                    <Circle className="w-7 h-7 text-white/30 hover:text-gold" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold font-tajawal ${
                      isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-gold/20 text-gold'
                    }`}>
                      {dayPlan.title}
                    </span>
                    {isCompleted && <span className="text-green-400 text-sm">✓ مكتمل</span>}
                  </div>

                  <p className="text-white font-tajawal font-bold mb-1">{dayPlan.task}</p>
                  <p className="font-amiri text-gold/70 text-lg mb-3">{dayPlan.verses}</p>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${repeatProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/50 font-tajawal min-w-[60px] text-left">
                      {repeats}/{dayPlan.repeats}
                    </span>
                    <button
                      onClick={() => addRepeat(dayPlan.day, dayPlan.repeats)}
                      className="px-3 py-1.5 rounded-lg bg-gold/20 text-gold text-xs font-tajawal hover:bg-gold/30 transition-all"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => resetRepeats(dayPlan.day)}
                      className="p-1.5 rounded-lg bg-white/10 text-white/50 hover:bg-white/20 transition-all"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {completedDays.size === plan.length && (
        <div className="mb-10 text-center p-8 bg-gradient-to-r from-gold/10 via-amber-500/10 to-gold/10 rounded-2xl border border-gold/30 animate-in fade-in zoom-in duration-700">
          <p className="text-5xl mb-4">🎓</p>
          <p className="text-gold font-tajawal font-bold text-2xl mb-2">تهانينا! 🎉</p>
          <p className="text-white font-tajawal text-lg">لقد أكملت خطة حفظ سورة الإخلاص!</p>
          <p className="text-blue-200/60 font-tajawal text-sm mt-2">بارك الله فيك وثبّت حفظك</p>
        </div>
      )}

      {/* Parent Summary Section */}
      <div className="border-t border-white/10 pt-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-5 py-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="text-rose-300 font-tajawal font-bold text-sm">ملخص لولي الأمر</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlowCard>
            <h4 className="text-gold font-tajawal font-bold text-lg mb-4">📚 ماذا تعلّم طفلك؟</h4>
            <ul className="space-y-3">
              {[
                'حفظ سورة الإخلاص كاملة (4 آيات)',
                'معاني كلمات السورة بشكل مبسط',
                'أحكام التجويد الأساسية في السورة',
                'سبب نزول السورة وفضلها',
                'مفهوم التوحيد بطريقة مناسبة لعمره',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-blue-200/80 font-tajawal text-sm">
                  <span className="text-green-400 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </GlowCard>

          <GlowCard>
            <h4 className="text-teal-300 font-tajawal font-bold text-lg mb-4">💡 نصائح للتدريب المنزلي</h4>
            <ul className="space-y-3">
              {[
                'شجّع طفلك على قراءة السورة في الصلاة يومياً',
                'اجعل وقت المراجعة ممتعاً وليس إجبارياً',
                'كافئ طفلك عند إتمام كل مرحلة',
                'اقرأ السورة معه قبل النوم كروتين يومي',
                'ذكّره بفضل السورة لتحفيزه على الاستمرار',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-blue-200/80 font-tajawal text-sm">
                  <span className="text-teal-300 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </GlowCard>
        </div>

        <GlowCard className="mt-6">
          <div className="text-center">
            <p className="text-gold font-tajawal font-bold text-lg mb-3">💛 رسالة من أكاديمية جوّد</p>
            <p className="text-blue-200/80 font-tajawal leading-relaxed">
              نشكركم على ثقتكم بأكاديمية جوّد في رحلة تعليم أطفالكم القرآن الكريم.
              إن حفظ سورة الإخلاص هو خطوة عظيمة في بناء إيمان طفلكم وتعلقه بكتاب الله.
              نسأل الله أن يبارك في أبنائكم ويجعلهم من حفظة القرآن الكريم.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <img src="/assets/jawwid-logo.jpg" alt="أكاديمية جوّد" className="w-10 h-10 rounded-lg object-cover" />
              <div className="text-right">
                <p className="text-gold font-tajawal font-bold text-sm">أكاديمية جوّد</p>
                <p className="text-white/40 font-tajawal text-xs">علمٌ ينتفع به</p>
              </div>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
};

export default MemorizationPlan;