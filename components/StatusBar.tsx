
import React from 'react';

interface StatusBarProps {
  sanity: number;
  inventory: string[];
  onOpenGallery?: () => void;
  showGalleryButton?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ sanity, inventory, onOpenGallery, showGalleryButton }) => {
  // Determine color based on sanity
  let sanityColor = 'bg-emerald-600';
  if (sanity < 60) sanityColor = 'bg-amber-600';
  if (sanity < 30) sanityColor = 'bg-red-600';

  return (
    <div className="w-full bg-stone-950/30 rounded-lg border border-stone-800/50 p-4">
      <div className="flex flex-col gap-4">
        {/* Top Row: Sanity & Tools */}
        <div className="flex items-center w-full justify-between gap-4">
          <div className="flex items-center flex-grow">
            <span className="text-stone-400 font-serif-sc mr-2 md:mr-3 text-sm tracking-widest">
              理智
            </span>
            <div className="h-4 md:h-5 flex-grow bg-stone-900 border border-stone-700 relative overflow-hidden rounded-sm max-w-[200px]">
              <div 
                className={`h-full transition-all duration-500 ${sanityColor} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
                style={{ width: `${sanity}%` }}
              ></div>
              {/* Glitch effect overlay on bar */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse opacity-30"></div>
            </div>
            <span className={`ml-3 font-mono font-bold text-base w-10 text-right ${sanity < 30 ? 'text-red-500 animate-pulse' : 'text-stone-300'}`}>
              {sanity}
            </span>
          </div>

          {showGalleryButton && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if(onOpenGallery) onOpenGallery();
              }}
              className="px-3 py-1 bg-stone-800 border border-stone-600 text-stone-400 text-xs hover:text-stone-200 font-serif-sc rounded hover:bg-stone-700 active:bg-stone-600 transition-colors whitespace-nowrap"
            >
              结局图鉴
            </button>
          )}
        </div>

        {/* Bottom Row: Inventory */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-stone-500 font-serif-sc text-sm mr-1">行囊:</span>
          {inventory.length === 0 ? (
            <span className="text-stone-700 text-sm italic">（空）</span>
          ) : (
            inventory.map((item, idx) => (
              <span key={idx} className="px-2 py-0.5 text-xs border border-stone-600 text-stone-300 bg-stone-900 rounded font-serif-sc tracking-wide opacity-80">
                {item}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
