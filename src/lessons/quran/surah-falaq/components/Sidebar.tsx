import React from 'react';

interface SidebarProps {
  activeSection: string;
  completedSections: string[];
  onSectionClick: (section: string) => void;
  progress: number;
}

const sections = [
  { id: 'intro', emoji: '✅', label: 'المقدمة' },
  { id: 'surah', emoji: '📖', label: 'السورة' },
  { id: 'order', emoji: '📝', label: 'ترتيب الآيات' },
  { id: 'choose', emoji: '🎯', label: 'اختر الكلمة' },
  { id: 'fix', emoji: '🔧', label: 'صحح الخطأ' },
  { id: 'meanings', emoji: '📚', label: 'المعاني' },
  { id: 'games', emoji: '🎮', label: 'ألعاب المعاني' },
  { id: 'deep', emoji: '💡', label: 'الفهم العميق' },
  { id: 'virtue', emoji: '✨', label: 'فضل السورة' },
  { id: 'achievement', emoji: '🏆', label: 'الإنجاز' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, completedSections, onSectionClick, progress }) => {
  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] border-l border-white/10 z-50 overflow-y-auto flex flex-col" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* Logo & Title */}
      <div className="p-4 text-center border-b border-white/10">
        <img src="/assets/jawwid-logo-official.jpg" alt="أكاديمية جوّد" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
        <h2 className="text-white font-bold text-lg">أكاديمية جوّد</h2>
        <p className="text-amber-400 text-sm font-semibold">سورة الفلق</p>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex justify-between text-sm text-white/70 mb-1">
          <span>التقدم</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-green-400 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const isCompleted = completedSections.includes(section.id);
          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 text-white shadow-lg'
                  : isCompleted
                  ? 'bg-white/5 text-green-300 hover:bg-white/10'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg">{isCompleted ? '✅' : section.emoji}</span>
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 text-center border-t border-white/10">
        <p className="text-white/40 text-xs">علمٌ ينتفع به ✨</p>
      </div>
    </aside>
  );
};

export default Sidebar;