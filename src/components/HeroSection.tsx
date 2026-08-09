import React from 'react';
import { ShieldCheck, Zap, RefreshCw, Trophy, Download, Sparkles, Send, Star, Gamepad2, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  siteName: string;
  heroNotice: string;
  onExploreClick: () => void;
  telegramLink: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  siteName,
  heroNotice,
  onExploreClick,
  telegramLink
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-blue-900/40 my-4">
      {/* Background Subtle Grid Pattern Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Text & Calls to Action */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-sky-200 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>DISCOVER • COMPARE • EXPLORE</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Discover Popular Gaming Apps in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-200">One Place</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-medium">
            Explore the latest real cash gaming apps, compare withdrawal limits, and download verified APKs with instant UPI payouts.
          </p>

          {/* Feature highlights pill row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-white/10 border border-white/15 rounded-xl p-2.5 text-center flex flex-col items-center justify-center gap-1 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-extrabold text-slate-100">100% Secure</span>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-xl p-2.5 text-center flex flex-col items-center justify-center gap-1 backdrop-blur-xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-extrabold text-slate-100">Fast Download</span>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-xl p-2.5 text-center flex flex-col items-center justify-center gap-1 backdrop-blur-xs">
              <RefreshCw className="w-4 h-4 text-sky-400" />
              <span className="text-[11px] font-extrabold text-slate-100">Daily Updated</span>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-xl p-2.5 text-center flex flex-col items-center justify-center gap-1 backdrop-blur-xs">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-[11px] font-extrabold text-slate-100">Real Cash Apps</span>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-7 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              <Download className="w-5 h-5 animate-bounce" />
              <span>Explore & Download Games</span>
            </button>

            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-2xl border border-white/20 transition-all text-sm backdrop-blur-xs"
            >
              <Send className="w-4 h-4 text-sky-300" />
              <span>Join Telegram Channel</span>
            </a>
          </div>
        </div>

        {/* Right Column: Floating App Discovery Cards composition */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative w-full aspect-square max-w-md mx-auto flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />

            {/* Main Floating Card 1 */}
            <div className="absolute top-4 left-2 w-72 bg-slate-900/90 border border-blue-400/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md transform -rotate-3 hover:rotate-0 transition-transform duration-300 z-20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-md shrink-0">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    #1 Rated App
                  </span>
                  <h3 className="font-extrabold text-white text-sm truncate mt-1">Rummy Circle Pro</h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.9 (2.8M Downloads)</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-black">Verified Instant Payout</span>
                <span className="text-slate-400 font-semibold">Min ₹100 Withdrawal</span>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute bottom-6 right-2 w-72 bg-slate-900/90 border border-emerald-400/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md transform rotate-3 hover:rotate-0 transition-transform duration-300 z-30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center font-black text-white text-lg shadow-md shrink-0">
                  🔥
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    Trending Crash Game
                  </span>
                  <h3 className="font-extrabold text-white text-sm truncate mt-1">Aviator Pro Cash</h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.9 (3.4M Downloads)</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-amber-400 font-black">100x Multiplier</span>
                <span className="bg-blue-600 text-white font-extrabold text-[10px] px-2 py-1 rounded-lg">
                  Verified APK
                </span>
              </div>
            </div>

            {/* Badge Pill floating in center */}
            <div className="absolute z-40 bg-blue-600/90 border border-blue-300/50 text-white px-4 py-2 rounded-full text-xs font-extrabold shadow-xl backdrop-blur-md flex items-center gap-2 animate-bounce">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>100% Virus Free Cloud Mirrors</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

