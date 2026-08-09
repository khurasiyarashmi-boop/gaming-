import React, { useState } from 'react';
import { Game } from '../types';
import { Download, Star, ShieldCheck, Heart, Share2, Sparkles, ExternalLink, ArrowRight, Zap } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onSelectGame: (game: Game) => void;
  onDownloadClick: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
  onShare: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onSelectGame,
  onDownloadClick,
  isFavorite,
  onToggleFavorite,
  onShare
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format downloads e.g. 2.8M+
  const formattedDownloads =
    game.downloadCount >= 1000000
      ? `${(game.downloadCount / 1000000).toFixed(1)}M+`
      : game.downloadCount >= 1000
      ? `${(game.downloadCount / 1000).toFixed(0)}K+`
      : game.downloadCount;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between relative group"
    >
      {/* Top Header Row: Ranking Badge & Favorite / Share */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-1.5">
          {/* Ranking Badge */}
          <span className="bg-slate-900 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
            #{game.ranking}
          </span>

          {game.isNew && (
            <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" />
              NEW
            </span>
          )}

          {game.isTrending && (
            <span className="bg-amber-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
              🔥 HOT
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={e => {
              e.stopPropagation();
              onShare(game);
            }}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Share Game"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            className="p-1.5 rounded-lg transition-colors"
            title={isFavorite ? 'Remove Favorite' : 'Save Favorite'}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isFavorite ? 'text-rose-600 fill-rose-600' : 'text-slate-400 hover:text-rose-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Content: Logo + Info */}
      <div
        onClick={() => onSelectGame(game)}
        className="cursor-pointer flex items-start gap-3.5 mb-3 flex-1"
      >
        {/* Game Logo */}
        <div className="relative shrink-0">
          <img
            src={game.logo}
            alt={game.name}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover shadow-md border border-slate-100 group-hover:scale-105 transition-transform duration-300"
            onError={e => {
              // Fallback placeholder image
              (e.target as HTMLElement).setAttribute(
                'src',
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop&q=80'
              );
            }}
          />
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white">
            <ShieldCheck className="w-3 h-3" />
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              {game.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{game.rating}</span>
            </div>
          </div>

          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
            {game.name}
          </h3>

          <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-1">
            {game.description}
          </p>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mt-1.5">
            <span>{formattedDownloads} Downloads</span>
            <span>•</span>
            <span>Verified Payout</span>
          </div>
        </div>
      </div>

      {/* Withdrawal Highlight Box */}
      <div className="my-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Min Withdrawal</span>
        <span className="font-extrabold text-slate-800 text-sm">
          ₹{game.minWithdrawal} Instant
        </span>
      </div>

      {/* Action Buttons: Download + Details */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onDownloadClick(game)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn relative overflow-hidden active:scale-98"
        >
          <Download className="w-4 h-4 animate-bounce shrink-0" />
          <span>Download APK</span>
        </button>

        <button
          onClick={() => onSelectGame(game)}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors shrink-0"
          title="View Full Game Details"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
