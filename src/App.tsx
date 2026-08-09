import React, { useState, useEffect } from 'react';
import { Game, Category, SiteSettings, SortOption } from './types';

// Components
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { HeroSection } from './components/HeroSection';
import { NoticeCard } from './components/NoticeCard';
import { StepGuide } from './components/StepGuide';
import { CategoryBar } from './components/CategoryBar';
import { SearchFilterSort } from './components/SearchFilterSort';
import { GameCard } from './components/GameCard';
import { DownloadModal } from './components/DownloadModal';
import { GameDetailsModal } from './components/GameDetailsModal';
import { TrendingBar } from './components/TrendingBar';
import { WhyChooseUs } from './components/WhyChooseUs';
import { GettingStartedFlow } from './components/GettingStartedFlow';
import { ResponsibleGamingSection } from './components/ResponsibleGamingSection';
import { FloatingTelegramButton } from './components/FloatingTelegramButton';
import { Footer } from './components/Footer';
import { PagesModal } from './components/PagesModal';
import { AdminPanel } from './components/AdminPanel';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Gamepad2, Sparkles, AlertTriangle, RefreshCw, Plus } from 'lucide-react';

export default function App() {
  // Navigation & View States
  const [activeNavView, setActiveNavView] = useState<string>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('latest');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Modals & Active Selections
  const [selectedGameForDetails, setSelectedGameForDetails] = useState<Game | null>(null);
  const [selectedGameForDownload, setSelectedGameForDownload] = useState<Game | null>(null);

  // Data States
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'GameHub APK',
    siteTagline: "India's #1 Real Cash Gaming Directory & Verified APK Downloads",
    telegramLink: 'https://t.me/Soumy_6263',
    noticeTitle: 'IMPORTANT LEGAL NOTICE & RESPONSIBLE GAMING WARNING',
    noticeContent:
      'Real money gaming involves financial risk and may be addictive. Play responsibly and at your own risk. This platform lists verified APKs for skill-based gaming applications.',
    restrictedStates: ['Assam', 'Odisha', 'Telangana', 'Nagaland', 'Sikkim', 'Andhra Pradesh'],
    maintenanceMode: false,
    contactEmail: 'support@gamehubapk.com',
    contactPhone: '+91 98765 43210',
    whatsappLink: 'https://wa.me/919876543210',
    heroNotice: '⚡ 100% Verified APKs • Fast Downloads • Instant Withdrawals',
    metaTitle: 'GameHub APK - Download Real Cash Rummy, Teen Patti & Casino Games APK',
    metaDescription: 'Download 100% safe & verified gaming APKs. Best Real Cash Rummy, Teen Patti, Aviator, Slots.'
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gamehub_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Toggle Favorite
  const handleToggleFavorite = (gameId: string) => {
    const isFav = favorites.includes(gameId);
    const updated = isFav ? favorites.filter(id => id !== gameId) : [...favorites, gameId];
    setFavorites(updated);
    try {
      localStorage.setItem('gamehub_favorites', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (isFav) {
      addToast('Removed from saved favorites', 'info');
    } else {
      addToast('Added to saved favorites!', 'success');
    }
  };

  // Fetch initial API Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Settings
      const resSettings = await fetch('/api/settings');
      if (resSettings.ok) {
        const sData = await resSettings.json();
        setSiteSettings(sData);
      }

      // Categories
      const resCats = await fetch('/api/categories');
      if (resCats.ok) {
        setCategories(await resCats.json());
      }

      // Games
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (selectedFilter !== 'all') params.append('filter', selectedFilter);
      if (selectedSort) params.append('sort', selectedSort);

      const resGames = await fetch(`/api/games?${params.toString()}`);
      if (resGames.ok) {
        const gData = await resGames.json();
        setGames(gData.games || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery, selectedFilter, selectedSort]);

  // Sync document title and meta description dynamically with siteSettings
  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.metaTitle) {
        document.title = siteSettings.metaTitle;
      } else if (siteSettings.siteName) {
        document.title = `${siteSettings.siteName} - Official Real Cash Gaming Directory`;
      }

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && siteSettings.metaDescription) {
        metaDesc.setAttribute('content', siteSettings.metaDescription);
      }
    }
  }, [siteSettings]);

  // Handle Download Click
  const handleDownloadClick = async (game: Game) => {
    setSelectedGameForDownload(game);
    try {
      // track download count on server
      await fetch(`/api/games/${game.id}/download`, { method: 'POST' });
      // update local count
      setGames(prev =>
        prev.map(g => (g.id === game.id ? { ...g, downloadCount: g.downloadCount + 1 } : g))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Share link
  const handleShareGame = async (game: Game) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${game.name} - GameHub APK`,
          text: `Download ${game.name} APK for instant UPI and bank payouts!`,
          url: window.location.href
        });
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(window.location.href);
            addToast('Game link copied to clipboard!', 'success');
          } catch (e) {
            console.error(e);
          }
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        addToast('Game link copied to clipboard!', 'success');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Display Games Filtered by Favorites if toggled
  const displayedGames = showOnlyFavorites
    ? games.filter(g => favorites.includes(g.id))
    : games;

  // Handle view navigation
  const handleNavigate = (view: string) => {
    setActiveNavView(view);
    if (view === 'new-games') {
      setSelectedCategory('new');
      setShowOnlyFavorites(false);
    } else if (view === 'other-games') {
      setSelectedCategory('other');
      setShowOnlyFavorites(false);
    } else if (view === 'home') {
      setSelectedCategory('all');
      setShowOnlyFavorites(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Sticky Header */}
      <Header
        siteName={siteSettings.siteName}
        telegramLink={siteSettings.telegramLink}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSearch={() => {
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
        favoriteCount={favorites.length}
        onNavigate={handleNavigate}
        activeView={activeNavView}
      />

      {/* Navigation Drawer Menu */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
        activeView={activeNavView}
        telegramLink={siteSettings.telegramLink}
        siteName={siteSettings.siteName}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        {/* HERO SECTION */}
        <HeroSection
          siteName={siteSettings.siteName}
          heroNotice={siteSettings.heroNotice}
          onExploreClick={() => {
            const gamesElem = document.getElementById('game-directory');
            if (gamesElem) gamesElem.scrollIntoView({ behavior: 'smooth' });
          }}
          telegramLink={siteSettings.telegramLink}
        />

        {/* TRENDING GAMES BAR */}
        <TrendingBar
          onSearchTag={tag => {
            setSearchQuery(tag);
            setShowOnlyFavorites(false);
          }}
        />

        {/* RED LEGAL NOTICE CARD */}
        <NoticeCard
          title={siteSettings.noticeTitle}
          content={siteSettings.noticeContent}
          restrictedStates={siteSettings.restrictedStates}
        />

        {/* 4 STEP GUIDE */}
        <StepGuide />

        {/* CATEGORY BAR */}
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={cat => {
            setSelectedCategory(cat);
            setShowOnlyFavorites(false);
          }}
        />

        {/* SEARCH, FILTER & SORT BAR */}
        <SearchFilterSort
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          totalResults={displayedGames.length}
        />

        {/* FAVORITES HEADER BANNER */}
        {showOnlyFavorites && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 my-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-rose-900 text-sm">
                Showing {displayedGames.length} Saved Favorite Games
              </span>
            </div>
            <button
              onClick={() => setShowOnlyFavorites(false)}
              className="text-xs font-bold text-rose-700 hover:underline"
            >
              Show All Games
            </button>
          </div>
        )}

        {/* GAME DIRECTORY GRID */}
        <section id="game-directory" className="my-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-blue-600" />
              <span>Verified APK Downloads List</span>
            </h2>
          </div>

          {loading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
                  <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                      <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                    </div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : displayedGames.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 my-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {games.length === 0 ? 'No Apps Listed Yet' : 'No Matching Games Found'}
              </h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                {games.length === 0
                  ? 'There are currently no applications listed on the website. Use the Admin Panel to upload new apps.'
                  : 'Try searching with another keyword or reset active filters to explore all available apps.'}
              </p>
              {games.length > 0 ? (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSelectedFilter('all');
                    setSelectedSort('latest');
                    setShowOnlyFavorites(false);
                  }}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Open Admin Panel & Upload App</span>
                </button>
              )}
            </div>
          ) : (
            /* Responsive Game Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelectGame={g => setSelectedGameForDetails(g)}
                  onDownloadClick={handleDownloadClick}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onShare={handleShareGame}
                />
              ))}
            </div>
          )}
        </section>

        {/* WHY CHOOSE US SECTION */}
        <WhyChooseUs />

        {/* GETTING STARTED 5-STEP ROADMAP */}
        <GettingStartedFlow />

        {/* RESPONSIBLE GAMING GUIDELINES */}
        <ResponsibleGamingSection />
      </main>

      {/* FLOATING TELEGRAM BUTTON */}
      <FloatingTelegramButton telegramLink={siteSettings.telegramLink} />

      {/* FOOTER */}
      <Footer
        siteName={siteSettings.siteName}
        siteTagline={siteSettings.siteTagline}
        telegramLink={siteSettings.telegramLink}
        contactEmail={siteSettings.contactEmail}
        contactPhone={siteSettings.contactPhone}
        onNavigate={view => setActiveNavView(view)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* DOWNLOAD PROGRESS & INSTRUCTIONS MODAL */}
      <DownloadModal
        game={selectedGameForDownload}
        onClose={() => setSelectedGameForDownload(null)}
        telegramLink={siteSettings.telegramLink}
        onCopyLink={url => addToast('Link copied!', 'success')}
      />

      {/* GAME DETAILS FULL MODAL */}
      <GameDetailsModal
        game={selectedGameForDetails}
        onClose={() => setSelectedGameForDetails(null)}
        onDownloadClick={handleDownloadClick}
        telegramLink={siteSettings.telegramLink}
        allGames={games}
        onSelectGame={g => setSelectedGameForDetails(g)}
        isFavorite={selectedGameForDetails ? favorites.includes(selectedGameForDetails.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onShare={handleShareGame}
      />

      {/* PAGES & LEGAL MODAL (About, Contact, Disclaimer, Privacy, Terms) */}
      <PagesModal
        view={activeNavView}
        onClose={() => setActiveNavView('home')}
        telegramLink={siteSettings.telegramLink}
        contactEmail={siteSettings.contactEmail}
        contactPhone={siteSettings.contactPhone}
        whatsappLink={siteSettings.whatsappLink}
        siteName={siteSettings.siteName}
      />

      {/* ADMIN CONTROL PANEL CMS MODAL */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={fetchData}
        siteSettings={siteSettings}
      />
    </div>
  );
}
