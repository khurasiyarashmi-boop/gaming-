import React, { useState } from 'react';
import { Game } from '../types';
import {
  X,
  Star,
  ShieldCheck,
  Download,
  Send,
  Zap,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Smartphone,
  Share2,
  Heart,
  Globe,
  Award
} from 'lucide-react';

interface GameDetailsModalProps {
  game: Game | null;
  onClose: () => void;
  onDownloadClick: (game: Game) => void;
  telegramLink: string;
  allGames: Game[];
  onSelectGame: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
  onShare: (game: Game) => void;
}

export const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  game,
  onClose,
  onDownloadClick,
  telegramLink,
  allGames,
  onSelectGame,
  isFavorite,
  onToggleFavorite,
  onShare
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [reviewsList, setReviewsList] = useState(game?.reviews || []);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!game) return null;

  const relatedGames = allGames
    .filter(g => g.id !== game.id && g.category.toLowerCase() === game.category.toLowerCase())
    .slice(0, 3);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userReview.trim()) return;

    const newRev = {
      user: 'You (Verified Player)',
      rating: userRating,
      date: new Date().toISOString().split('T')[0],
      comment: userReview
    };

    setReviewsList([newRev, ...reviewsList]);
    setUserReview('');
    setReviewSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl relative border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Modal Top Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg">
              #{game.ranking}
            </span>
            <span className="text-xs font-extrabold uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              {game.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShare(game)}
              className="p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onToggleFavorite(game.id)}
              className="p-2 text-slate-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'text-rose-600 fill-rose-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Game Hero Block */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <img
              src={game.logo}
              alt={game.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md border border-slate-200 shrink-0"
            />

            <div className="flex-1 min-w-0 space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {game.name}
              </h2>

              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 flex-wrap">
                <span className="flex items-center gap-1 text-amber-500 font-extrabold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {game.rating} / 5.0
                </span>
                <span>•</span>
                <span>{game.downloadCount.toLocaleString()} Downloads</span>
                <span>•</span>
                <span>Updated {game.lastUpdated}</span>
              </div>

              {/* Withdrawal badging */}
              <div className="flex items-center gap-2 pt-1">
                <span className="bg-slate-100 text-slate-800 border border-slate-200 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                  Min ₹{game.minWithdrawal} Withdrawal
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onDownloadClick(game)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 px-5 rounded-2xl text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5 animate-bounce" />
              <span>Download APK</span>
            </button>

            <a
              href={game.telegramGroup || telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3.5 px-5 rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>Join Official Telegram</span>
            </a>
          </div>

          {/* Screenshots Gallery if available */}
          {game.screenshots && game.screenshots.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                App Screenshots & Gameplay
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {game.screenshots.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${game.name} screenshot ${i + 1}`}
                    className="w-64 h-36 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Detailed Description */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              About {game.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {game.description}
            </p>
          </div>

          {/* Key Features List */}
          {game.features && game.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Key Highlights & Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {game.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Withdrawal Rules */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
            <h4 className="font-extrabold text-blue-900 text-xs uppercase tracking-wider">
              🏦 Withdrawal Conditions
            </h4>
            <ul className="text-xs text-blue-800 space-y-1 list-disc pl-4 font-medium">
              <li>Minimum withdrawal threshold: ₹{game.minWithdrawal}.</li>
              <li>Direct Bank Transfer / UPI options available.</li>
              <li>24x7 instant processing within 2 minutes.</li>
            </ul>
          </div>

          {/* FAQs Accordion */}
          {game.faqs && game.faqs.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                {game.faqs.map((faq, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-extrabold text-xs sm:text-sm text-slate-900"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform ${
                          openFaq === i ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="p-3 bg-white text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Player Reviews & Submit Form */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Verified Player Reviews
            </h3>

            {/* Submit Review Box */}
            <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-800">Write Your Review & Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= userRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">{userRating} / 5</span>
              </div>

              <textarea
                value={userReview}
                onChange={e => setUserReview(e.target.value)}
                placeholder="Share your experience regarding withdrawal speed, gameplay, and bonus payouts..."
                rows={2}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
              />

              <div className="flex items-center justify-between">
                {reviewSubmitted && (
                  <span className="text-xs font-bold text-emerald-600">Review posted successfully!</span>
                )}
                <button
                  type="submit"
                  className="ml-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors"
                >
                  Post Review
                </button>
              </div>
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-2">
              {reviewsList.map((rev, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.user}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Games Suggestions */}
          {relatedGames.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                More {game.category} Games You Might Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedGames.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectGame(rel)}
                    className="p-3 bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all flex items-center gap-3"
                  >
                    <img
                      src={rel.logo}
                      alt={rel.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{rel.name}</h4>
                      <p className="text-[10px] text-slate-500 font-extrabold">Min ₹{rel.minWithdrawal} Withdrawal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
