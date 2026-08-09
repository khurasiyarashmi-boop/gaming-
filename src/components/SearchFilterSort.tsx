import React from 'react';
import { Search, Filter, ArrowUpDown, X, SlidersHorizontal } from 'lucide-react';
import { SortOption } from '../types';

interface SearchFilterSortProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  totalResults: number;
}

export const SearchFilterSort: React.FC<SearchFilterSortProps> = ({
  searchQuery,
  onSearchChange,
  selectedSort,
  onSortChange,
  selectedFilter,
  onFilterChange,
  totalResults
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 my-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Bar Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search game name or category (e.g. Rummy, Aviator)..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters and Sorting dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Quick Filter */}
          <div className="relative flex-1 md:w-44">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedFilter}
              onChange={e => onFilterChange(e.target.value)}
              className="w-full pl-9 pr-7 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-600 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Filters</option>
              <option value="popular">🔥 Most Popular</option>
              <option value="lowest_withdrawal">🏦 Lowest Withdrawal</option>
              <option value="newest">✨ Newest Games</option>
              <option value="alphabetical">🔤 A-Z Alphabetical</option>
            </select>
          </div>

          {/* Sort Option */}
          <div className="relative flex-1 md:w-44">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedSort}
              onChange={e => onSortChange(e.target.value as SortOption)}
              className="w-full pl-9 pr-7 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-600 transition-all appearance-none cursor-pointer"
            >
              <option value="latest">Sort: Latest</option>
              <option value="trending">Sort: Trending</option>
              <option value="withdrawal_low">Sort: Min Withdrawal</option>
              <option value="rating">Sort: User Rating</option>
              <option value="alpha">Sort: Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results status indicator */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1 border-t border-slate-100">
        <span>
          Showing <strong className="text-slate-900 font-extrabold">{totalResults}</strong> verified games
        </span>
        {(searchQuery || selectedFilter !== 'all' || selectedSort !== 'latest') && (
          <button
            onClick={() => {
              onSearchChange('');
              onFilterChange('all');
              onSortChange('latest');
            }}
            className="text-blue-600 hover:underline text-xs font-bold"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
