import React from 'react';
import { Menu, Search, ShieldCheck, Send, Lock, Sparkles, Heart, HardDrive } from 'lucide-react';

interface HeaderProps {
  siteName: string;
  telegramLink: string;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenFavorites: () => void;
  onOpenDrive?: () => void;
  favoriteCount: number;
  onNavigate?: (view: string) => void;
  activeView?: string;
}

export const Header: React.FC<HeaderProps> = ({
  siteName,
  telegramLink,
  onOpenMenu,
  onOpenSearch,
  onOpenAdmin,
  onOpenFavorites,
  onOpenDrive,
  favoriteCount,
  onNavigate,
  activeView = 'home'
}) => {
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'new-games', label: 'New Games' },
    { id: 'other-games', label: 'Other Games' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Hamburger & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className="p-2 -ml-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors focus:outline-hidden md:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('home');
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform shrink-0 border-2 border-white">
              {(siteName || 'ALL JAIHO COMPANY').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight uppercase">
                  {siteName || 'ALL JAIHO COMPANY'}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-300 uppercase tracking-wider flex items-center gap-0.5 hidden sm:flex">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Official Gaming APK Directory
              </p>
            </div>
          </a>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-2 py-1 rounded-2xl">
          {navLinks.map((link) => {
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate && onNavigate(link.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Search Games"
          >
            <Search className="w-5 h-5 text-slate-700" />
            <span className="hidden xl:inline">Search</span>
          </button>

          {/* Favorites Bookmark */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Saved Favorites"
          >
            <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {favoriteCount}
              </span>
            )}
            <span className="hidden xl:inline">Saved</span>
          </button>

          {/* Join Telegram Badge */}
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </a>

          {/* Google Drive & Cloud SQL Storage trigger */}
          {onOpenDrive && (
            <button
              onClick={onOpenDrive}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Google Drive Storage & Backups"
            >
              <HardDrive className="w-5 h-5 text-blue-600" />
              <span className="hidden lg:inline">Drive & Cloud SQL</span>
            </button>
          )}

          {/* Admin Login Portal trigger */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Admin Login"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

