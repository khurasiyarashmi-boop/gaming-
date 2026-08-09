import React from 'react';
import { Flame, Sparkles, TrendingUp } from 'lucide-react';

interface TrendingBarProps {
  onSearchTag: (tag: string) => void;
}

export const TrendingBar: React.FC<TrendingBarProps> = ({ onSearchTag }) => {
  const tags = [
    'Rummy Circle Pro',
    'Teen Patti Master',
    'Aviator Predictor 100x',
    'Yono Rummy Club',
    'Slots Winner 777',
    'Mines Gold 3D',
    'Color Prediction 1Min',
    'Instant UPI Withdrawal',
    'WinZO All Games',
    'Dream XI Fantasy'
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-3 my-4 flex items-center gap-3 overflow-hidden shadow-xs border border-slate-800">
      <div className="flex items-center gap-1.5 shrink-0 bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider">
        <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span>Trending</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
        {tags.map((tag, idx) => (
          <button
            key={idx}
            onClick={() => onSearchTag(tag.split(' ')[0])}
            className="shrink-0 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
          >
            <TrendingUp className="w-3 h-3 text-sky-400" />
            <span>{tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
