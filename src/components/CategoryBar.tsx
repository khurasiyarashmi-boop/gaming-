import React from 'react';
import { Category } from '../types';
import { Sparkles, Gamepad2, Flame, Layers } from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="my-5 space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>Browse Gaming Categories</span>
        </h2>
        <span className="text-xs font-bold text-slate-500">
          {categories.length} Categories
        </span>
      </div>

      {/* Scrollable Category Pill Container */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
        {/* All Games Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`snap-start shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all border flex items-center gap-1.5 shadow-2xs ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>All Games</span>
        </button>

        {/* New Games Pill */}
        <button
          onClick={() => onSelectCategory('new')}
          className={`snap-start shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all border flex items-center gap-1.5 shadow-2xs ${
            selectedCategory === 'new'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-100" />
          <span>New Games</span>
        </button>

        {/* Other Games Pill */}
        <button
          onClick={() => onSelectCategory('other')}
          className={`snap-start shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all border flex items-center gap-1.5 shadow-2xs ${
            selectedCategory === 'other'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-emerald-600" />
          <span>Other Games</span>
        </button>

        {/* Dynamic Category List Pills */}
        {categories.map(cat => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`snap-start shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all border flex items-center gap-1.5 shadow-2xs ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span>{cat.name}</span>
              {cat.gameCount !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-200/80 text-emerald-900'
                  }`}
                >
                  {cat.gameCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
