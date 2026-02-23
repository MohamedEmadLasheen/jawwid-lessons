import React, { useState, useCallback } from 'react';
import { playCorrectSound, playWrongSound } from '../lib/sounds';

const correctOrder = [
  'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
  'مِن شَرِّ مَا خَلَقَ',
  'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
  'وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ',
  'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface OrderVersesProps {
  onComplete: () => void;
}

const OrderVerses: React.FC<OrderVersesProps> = ({ onComplete }) => {
  const [verses, setVerses] = useState<string[]>(() => shuffleArray(correctOrder));
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newVerses = [...verses];
    const draggedItem = newVerses[draggedIndex];
    newVerses.splice(draggedIndex, 1);
    newVerses.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setVerses(newVerses);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleCheck = useCallback(() => {
    const isCorrect = verses.every((v, i) => v === correctOrder[i]);
    setResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      playCorrectSound();
      onComplete();
    } else {
      playWrongSound();
    }
  }, [verses, onComplete]);

  const handleReset = () => {
    setVerses(shuffleArray(correctOrder));
    setResult(null);
  };

  return (
    <section id="order" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
            <span className="text-2xl">📝</span>
            <span className="text-white font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>ترتيب الآيات</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>ترتيب الآيات</h2>
          <p className="text-white/60" style={{ fontFamily: 'Cairo, sans-serif' }}>
            رتّب آيات سورة الفلق بالترتيب الصحيح بالسحب والإفلات
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {verses.map((verse, index) => (
            <div
              key={verse}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 cursor-grab active:cursor-grabbing transition-all duration-200 border border-white/5 hover:bg-white/15 ${
                draggedIndex === index ? 'opacity-50 scale-95' : ''
              } ${
                result === 'correct' ? 'border-green-400/50 bg-green-500/10' : ''
              } ${
                result === 'wrong' ? 'border-red-400/50 bg-red-500/10' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-lg text-white font-bold flex-1" style={{ fontFamily: 'Amiri, serif' }}>
                {verse}
              </p>
              <span className="text-white/40">☰</span>
            </div>
          ))}
        </div>

        {result && (
          <div className={`text-center mb-4 p-4 rounded-2xl ${
            result === 'correct' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
            {result === 'correct' ? '🎉 أحسنت! الترتيب صحيح!' : '❌ حاول مرة أخرى!'}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleCheck}
            className="bg-gradient-to-l from-green-500 to-emerald-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            تحقق ✓
          </button>
          <button
            onClick={handleReset}
            className="bg-white/10 text-white font-bold px-8 py-3 rounded-xl hover:bg-white/20 transition-all"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            إعادة 🔄
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderVerses;