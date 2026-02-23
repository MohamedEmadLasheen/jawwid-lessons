import React, { useState } from 'react';
import { GlowCard } from './IslamicPattern';
import { Volume2 } from 'lucide-react';

interface WordMeaning {
  word: string;
  meaning: string;
  detail: string;
  verseNum: number;
}

const wordMeanings: WordMeaning[] = [
  { word: 'قُلْ', meaning: 'قُل (أمر)', detail: 'أمر من الله لنبيه محمد ﷺ أن يقول ويُبلّغ', verseNum: 1 },
  { word: 'هُوَ', meaning: 'هو (ضمير)', detail: 'يعود على الله سبحانه وتعالى', verseNum: 1 },
  { word: 'اللَّهُ', meaning: 'الله', detail: 'اسم الله الأعظم، الإله المعبود بحق', verseNum: 1 },
  { word: 'أَحَدٌ', meaning: 'واحد', detail: 'الواحد الذي لا شريك له ولا مثيل', verseNum: 1 },
  { word: 'الصَّمَدُ', meaning: 'المقصود', detail: 'الذي يحتاج إليه كل المخلوقات وهو لا يحتاج إلى أحد', verseNum: 2 },
  { word: 'لَمْ يَلِدْ', meaning: 'لم يكن له ولد', detail: 'ليس لله ولد أو ابن، سبحانه وتعالى', verseNum: 3 },
  { word: 'وَلَمْ يُولَدْ', meaning: 'لم يولد', detail: 'ليس لله أب أو أم، فهو الأول الذي ليس قبله شيء', verseNum: 3 },
  { word: 'كُفُوًا', meaning: 'مثيلاً أو شبيهاً', detail: 'لا يوجد أحد يشبه الله أو يماثله في صفاته', verseNum: 4 },
];

const WordMeanings: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set());

  const handleWordClick = (index: number) => {
    setSelectedWord(selectedWord === index ? null : index);
    setRevealedWords(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  const progress = (revealedWords.size / wordMeanings.length) * 100;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-blue-200/60 font-tajawal">تقدمك في اكتشاف المعاني</span>
          <span className="text-sm text-gold font-tajawal font-bold">{revealedWords.size}/{wordMeanings.length}</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold to-amber-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {wordMeanings.map((item, index) => (
          <div
            key={index}
            onClick={() => handleWordClick(index)}
            className={`relative cursor-pointer transition-all duration-500 rounded-2xl p-5 text-center border ${
              selectedWord === index
                ? 'bg-gold/15 border-gold/50 shadow-lg shadow-gold/10 scale-105 z-10'
                : revealedWords.has(index)
                ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-gold/30'
            }`}
          >
            <div className="mb-3">
              <p className={`font-amiri text-2xl md:text-3xl transition-colors duration-300 ${
                selectedWord === index ? 'text-gold' : 'text-white'
              }`}>
                {item.word}
              </p>
            </div>

            <div className={`flex justify-center mb-2 transition-all duration-300 ${
              selectedWord === index ? 'opacity-100' : 'opacity-50'
            }`}>
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-gold" />
              </div>
            </div>

            {(selectedWord === index || revealedWords.has(index)) && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-teal-300 font-tajawal font-bold text-sm mb-1">
                  {item.meaning}
                </p>
                {selectedWord === index && (
                  <p className="text-blue-200/60 font-tajawal text-xs mt-2 leading-relaxed">
                    {item.detail}
                  </p>
                )}
              </div>
            )}

            {!revealedWords.has(index) && selectedWord !== index && (
              <p className="text-white/30 text-xs font-tajawal">اضغط لاكتشاف المعنى</p>
            )}

            <div className="absolute top-2 left-2">
              <span className="text-[10px] text-white/30 font-tajawal">آية {item.verseNum}</span>
            </div>

            {revealedWords.has(index) && selectedWord !== index && (
              <div className="absolute top-2 right-2">
                <span className="text-green-400 text-sm">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {revealedWords.size === wordMeanings.length && (
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <GlowCard className="inline-block">
            <p className="text-gold text-2xl mb-2">🌟 أحسنت!</p>
            <p className="text-white font-tajawal">لقد اكتشفت جميع معاني كلمات سورة الإخلاص!</p>
          </GlowCard>
        </div>
      )}
    </div>
  );
};

export default WordMeanings;