import React, { useState, useEffect } from 'react';
import { Game, Category, SiteSettings, ContactMessage, AnalyticsData, MediaItem, AppStatus } from '../types';
import {
  X,
  Lock,
  BarChart3,
  Gamepad2,
  Layers,
  Settings,
  Mail,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  LogOut,
  Check,
  ShieldCheck,
  Zap,
  Download,
  Eye,
  Search,
  Sparkles,
  Image as ImageIcon,
  Link2,
  Upload,
  Copy,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  FileCode2,
  Filter,
  CopyPlus,
  ChevronRight
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  siteSettings: SiteSettings;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  siteSettings
}) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [loginCreds, setLoginCreds] = useState({ username: 'admin', password: 'admin123' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'games' | 'add_game' | 'categories' | 'media' | 'links' | 'settings' | 'messages'
  >('dashboard');

  // Data states
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [statusMsg, setStatusMsg] = useState('');

  // Apps Table Filtering
  const [tableSearch, setTableSearch] = useState('');
  const [tableStatusFilter, setTableStatusFilter] = useState<string>('all');
  const [tableLinkFilter, setTableLinkFilter] = useState<string>('all');

  // Edit / Add Game state
  const [formUrlError, setFormUrlError] = useState('');
  const [editingGame, setEditingGame] = useState<Partial<Game>>({
    name: '',
    category: 'Rummy',
    description: '',
    shortDescription: '',
    logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop&q=80',
    poster: '',
    banner: '',
    version: 'v1.0.0',
    apkSize: '35 MB',
    packageName: '',
    developerName: 'ALL JAIHO COMPANY',
    downloadType: 'GOOGLE_PLAY',
    googlePlayUrl: '',
    officialWebsiteUrl: '',
    directDownloadUrl: '',
    downloadUrl: '',
    externalStoreUrl: '',
    bonus: 50,
    bonusLabel: '₹50 Cash Bonus',
    minWithdrawal: 100,
    rating: 4.8,
    status: 'published',
    isFeatured: false,
    isTrending: false,
    features: ['100% Verified APK', 'Instant Bank Payouts']
  });

  // Category Edit state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Gamepad2');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Media Upload state
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadType, setUploadType] = useState<'logo' | 'poster' | 'banner' | 'screenshot' | 'other'>('logo');
  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);

  // Quick Download Link Edit Modal State
  const [quickLinkGame, setQuickLinkGame] = useState<Game | null>(null);
  const [quickDownloadUrl, setQuickDownloadUrl] = useState('');

  useEffect(() => {
    if (siteSettings) {
      setSettingsForm(siteSettings);
    }
  }, [siteSettings, isOpen]);

  useEffect(() => {
    if (token && isOpen) {
      fetchAdminData();
    }
  }, [token, isOpen, activeTab]);

  const fetchAdminData = async () => {
    if (!token) return;
    try {
      // Fetch analytics
      const resStats = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resStats.ok) {
        const statsData = await resStats.json();
        setAnalytics(statsData);
      } else if (resStats.status === 401) {
        handleLogout();
        return;
      }

      // Fetch all games (including drafts)
      const resGames = await fetch('/api/admin/games', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resGames.ok) {
        setGames(await resGames.json());
      }

      // Fetch categories
      const resCats = await fetch('/api/categories');
      if (resCats.ok) {
        setCategories(await resCats.json());
      }

      // Fetch messages
      const resMsgs = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resMsgs.ok) {
        setMessages(await resMsgs.json());
      }

      // Fetch media items
      const resMedia = await fetch('/api/admin/media', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resMedia.ok) {
        setMediaItems(await resMedia.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCreds)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('admin_token', data.token);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Server connection error');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('admin_token');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        setStatusMsg('Site settings & branding updated successfully!');
        onDataChanged();
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveGameWithStatus = async (e?: React.FormEvent | React.MouseEvent, targetStatus?: AppStatus) => {
    if (e && e.preventDefault) e.preventDefault();
    setFormUrlError('');

    if (!editingGame?.name || !editingGame.name.trim()) {
      const msg = 'App name is required.';
      setFormUrlError(msg);
      alert(msg);
      return;
    }

    const dType = editingGame.downloadType || (editingGame.googlePlayUrl ? 'GOOGLE_PLAY' : 'DIRECT_DOWNLOAD');

    let playUrl = (
      editingGame.googlePlayUrl ||
      (editingGame.externalStoreUrl?.includes('play.google.com') ? editingGame.externalStoreUrl : '') ||
      ''
    ).trim();

    let webUrl = (editingGame.officialWebsiteUrl || editingGame.officialWebsite || '').trim();
    let directUrl = (editingGame.directDownloadUrl || editingGame.downloadUrl || '').trim();

    if (dType === 'GOOGLE_PLAY') {
      if (playUrl && !playUrl.startsWith('http://') && !playUrl.startsWith('https://')) {
        playUrl = 'https://' + playUrl;
      }

      const isPlayValid =
        playUrl.length > 0 &&
        (playUrl.includes('play.google.com/store/apps/') ||
          playUrl.includes('play.google.com/store/apps/details') ||
          playUrl.startsWith('https://play.google.com/') ||
          playUrl.startsWith('http://play.google.com/'));

      if (!isPlayValid) {
        const msg = 'Please enter a valid Google Play Store URL.';
        setFormUrlError(msg);
        alert(msg);
        return;
      }
    } else if (dType === 'OFFICIAL_WEBSITE') {
      if (!webUrl) {
        const msg = 'Please enter a valid Official Website URL.';
        setFormUrlError(msg);
        alert(msg);
        return;
      }
      if (!webUrl.startsWith('http://') && !webUrl.startsWith('https://')) {
        webUrl = 'https://' + webUrl;
      }
    } else if (dType === 'DIRECT_DOWNLOAD') {
      if (!directUrl) {
        const msg = 'Please enter a valid Direct Download APK URL.';
        setFormUrlError(msg);
        alert(msg);
        return;
      }
      if (!directUrl.startsWith('http://') && !directUrl.startsWith('https://')) {
        directUrl = 'https://' + directUrl;
      }
    }

    const effectiveDownloadUrl =
      dType === 'GOOGLE_PLAY'
        ? playUrl
        : dType === 'OFFICIAL_WEBSITE'
        ? webUrl
        : directUrl;

    const payload = {
      ...editingGame,
      downloadType: dType,
      googlePlayUrl: playUrl,
      officialWebsiteUrl: webUrl,
      directDownloadUrl: directUrl,
      downloadUrl: effectiveDownloadUrl,
      externalStoreUrl: playUrl || editingGame.externalStoreUrl || '',
      officialWebsite: webUrl || editingGame.officialWebsite || '',
      status: targetStatus || editingGame.status || 'published'
    };

    try {
      const isEdit = !!editingGame.id;
      const url = isEdit ? `/api/admin/games/${editingGame.id}` : '/api/admin/games';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchAdminData();
        onDataChanged();
        setActiveTab('games');
        setStatusMsg(
          payload.status === 'published'
            ? isEdit
              ? 'App updated and published to live site!'
              : 'New App published to live site!'
            : 'App saved as draft.'
        );
        setTimeout(() => setStatusMsg(''), 4000);
      } else {
        const err = await res.json();
        const errorMsg = err.error || 'Failed to save app';
        if (errorMsg.includes('Google Play')) {
          setFormUrlError('Please enter a valid Google Play Store URL.');
          alert('Please enter a valid Google Play Store URL.');
        } else {
          alert(errorMsg);
        }
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the app.');
    }
  };

  const handleSaveGame = (e: React.FormEvent) => handleSaveGameWithStatus(e, editingGame.status || 'published');

  const handleToggleStatus = async (game: Game, newStatus: AppStatus) => {
    try {
      const res = await fetch(`/api/admin/games/${game.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAdminData();
        onDataChanged();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicateGame = async (game: Game) => {
    const copyGame: Partial<Game> = {
      ...game,
      id: undefined,
      name: `${game.name} (Copy)`,
      slug: `${game.slug || 'app'}-copy`,
      status: 'draft',
      downloadCount: 0
    };
    try {
      const res = await fetch('/api/admin/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(copyGame)
      });
      if (res.ok) {
        fetchAdminData();
        onDataChanged();
        setStatusMsg('App duplicated as Draft!');
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGame = async (id: string, appName?: string) => {
    if (!id) return;
    if (!confirm(`Are you sure you want to permanently delete "${appName || 'this application'}" from the database?`)) return;
    try {
      const res = await fetch(`/api/admin/games/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setStatusMsg('Application deleted successfully!');
        if (editingGame.id === id) {
          setEditingGame({
            name: '',
            category: 'Rummy',
            description: '',
            shortDescription: '',
            logo: '',
            poster: '',
            banner: '',
            version: 'v1.0.0',
            apkSize: '35 MB',
            packageName: '',
            developerName: 'ALL JAIHO COMPANY',
            downloadType: 'GOOGLE_PLAY',
            googlePlayUrl: '',
            officialWebsiteUrl: '',
            directDownloadUrl: '',
            downloadUrl: '',
            externalStoreUrl: '',
            bonus: 50,
            bonusLabel: '₹50 Cash Bonus',
            minWithdrawal: 100,
            rating: 4.8,
            status: 'published',
            isFeatured: false,
            isTrending: false,
            features: ['100% Verified APK', 'Instant Bank Payouts']
          });
          setActiveTab('games');
        }
        await fetchAdminData();
        onDataChanged();
        setTimeout(() => setStatusMsg(''), 3000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete app.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while deleting app.');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCatName, icon: newCatIcon, description: newCatDesc })
      });
      if (res.ok) {
        setNewCatName('');
        setNewCatDesc('');
        fetchAdminData();
        onDataChanged();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(editingCategory.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingCategory)
      });
      if (res.ok) {
        setEditingCategory(null);
        fetchAdminData();
        onDataChanged();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string, name?: string) => {
    if (!confirm(`Are you sure you want to delete category "${name || 'this category'}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setStatusMsg('Category deleted successfully!');
        await fetchAdminData();
        onDataChanged();
        setTimeout(() => setStatusMsg(''), 3000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete category.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while deleting category.');
    }
  };

  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl) return;

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: uploadName || 'Media File', type: uploadType, url: uploadUrl })
      });

      if (res.ok) {
        setUploadName('');
        setUploadUrl('');
        fetchAdminData();
        setStatusMsg('Media asset registered successfully!');
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: file.name,
            type: uploadType,
            base64Data
          })
        });
        if (res.ok) {
          fetchAdminData();
          setStatusMsg('File uploaded successfully!');
          setTimeout(() => setStatusMsg(''), 3000);
        }
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMedia = async (id: string, name?: string) => {
    if (!confirm(`Are you sure you want to delete media asset "${name || 'this item'}"?`)) return;
    try {
      const res = await fetch(`/api/admin/media/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setStatusMsg('Media asset deleted!');
        await fetchAdminData();
        setTimeout(() => setStatusMsg(''), 3000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete media asset.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while deleting media asset.');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setStatusMsg('Message deleted!');
        await fetchAdminData();
        setTimeout(() => setStatusMsg(''), 3000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete message.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while deleting message.');
    }
  };

  const handleCopyMediaUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedMediaId(id);
    setTimeout(() => setCopiedMediaId(null), 2000);
  };

  const handleSaveQuickLink = async () => {
    if (!quickLinkGame) return;
    try {
      const res = await fetch(`/api/admin/games/${quickLinkGame.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ downloadUrl: quickDownloadUrl })
      });
      if (res.ok) {
        setQuickLinkGame(null);
        fetchAdminData();
        onDataChanged();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetSeed = async () => {
    if (!confirm('Reset entire app catalog database to default seed data?')) return;
    try {
      const res = await fetch('/api/admin/seed-reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAdminData();
        onDataChanged();
        alert('Database seed restored!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Table filtering logic
  const filteredGames = games.filter(g => {
    const matchesSearch =
      g.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      g.category.toLowerCase().includes(tableSearch.toLowerCase()) ||
      (g.packageName && g.packageName.toLowerCase().includes(tableSearch.toLowerCase()));

    const matchesStatus =
      tableStatusFilter === 'all'
        ? true
        : tableStatusFilter === 'published'
        ? g.status === 'published' || !g.status
        : g.status === tableStatusFilter;

    const hasLink = !!(g.downloadUrl || g.externalStoreUrl);
    const matchesLink =
      tableLinkFilter === 'all' ? true : tableLinkFilter === 'configured' ? hasLink : !hasLink;

    return matchesSearch && matchesStatus && matchesLink;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-6xl w-full my-auto shadow-2xl relative border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-base shadow-sm">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">ALL JAIHO COMPANY - CMS Portal</h2>
              <p className="text-[11px] text-blue-300 font-medium">Database-Driven App Directory Control Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ADMIN LOGIN SCREEN */}
        {!token ? (
          <div className="p-6 sm:p-10 max-w-md mx-auto w-full my-auto space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900">Admin Portal Sign In</h3>
              <p className="text-xs text-slate-500 font-medium">Manage App Catalog, Download Links & Content</p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={loginCreds.username}
                  onChange={e => setLoginCreds({ ...loginCreds, username: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={loginCreds.password}
                  onChange={e => setLoginCreds({ ...loginCreds, password: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all"
              >
                Sign In To Dashboard
              </button>

              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 text-center font-semibold">
                🔑 Credentials: <strong>admin</strong> / <strong>admin123</strong>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD BODY */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs Navigation Bar */}
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors shrink-0 ${
                  activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('games')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors shrink-0 ${
                  activeTab === 'games' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Apps ({games.length})</span>
              </button>

              <button
                onClick={() => {
                  setEditingGame({
                    name: '',
                    category: 'Rummy',
                    description: '',
                    shortDescription: '',
                    logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop&q=80',
                    poster: '',
                    banner: '',
                    version: 'v1.0.0',
                    apkSize: '35 MB',
                    packageName: '',
                    developerName: 'ALL JAIHO COMPANY',
                    downloadUrl: '',
                    externalStoreUrl: '',
                    bonus: 50,
                    bonusLabel: '₹50 Cash Bonus',
                    minWithdrawal: 100,
                    rating: 4.8,
                    status: 'published',
                    isFeatured: false,
                    isTrending: false,
                    features: ['100% Verified APK', 'Instant Bank Payouts']
                  });
                  setActiveTab('add_game');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors shrink-0 ${
                  activeTab === 'add_game' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add New App</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors shrink-0 ${
                  activeTab === 'categories' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Categories</span>
              </button>

              <button
                onClick={() => setActiveTab('media')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors shrink-0 ${
                  activeTab === 'media' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Media ({mediaItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('links')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors shrink-0 ${
                  activeTab === 'links' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Link2 className="w-4 h-4" />
                <span>Download Links</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors shrink-0 ${
                  activeTab === 'settings' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors shrink-0 ${
                  activeTab === 'messages' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Messages ({messages.length})</span>
              </button>
            </div>

            {/* Status Feedback Toast Banner */}
            {statusMsg && (
              <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between shadow-inner">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {statusMsg}
                </span>
                <button onClick={() => setStatusMsg('')} className="hover:opacity-80">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* TAB CONTENT PANEL */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-6">
              {/* TAB 1: DASHBOARD ANALYTICS */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Top Analytics Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Apps</span>
                        <Gamepad2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">{analytics?.totalGames || games.length}</div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {analytics?.publishedGames || games.filter(g => g.status === 'published' || !g.status).length} Published • {analytics?.draftGames || games.filter(g => g.status === 'draft').length} Drafts
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Downloads</span>
                        <Download className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-black text-emerald-600">
                        {(analytics?.totalDownloads || 0).toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">Tracked click events</div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
                        <Layers className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">{analytics?.totalCategories || categories.length}</div>
                      <div className="text-[11px] text-slate-500 font-medium">Active catalog tags</div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Contact Messages</span>
                        <Mail className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">{analytics?.totalMessages || messages.length}</div>
                      <div className="text-[11px] text-slate-500 font-medium">Inquiries received</div>
                    </div>
                  </div>

                  {/* Most Downloaded Apps & Download Destinations Audit */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Downloaded Apps */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                        <span>🔥 Most Downloaded Applications</span>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </h4>
                      <div className="space-y-3">
                        {analytics?.topGames.map((g, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="font-black text-xs text-slate-400 w-4">#{idx + 1}</span>
                              <img src={g.logo} alt={g.name} className="w-8 h-8 rounded-lg object-cover" />
                              <span className="font-extrabold text-xs text-slate-900">{g.name}</span>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                              {g.downloads.toLocaleString()} Downloads
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Download Destination Config Health Audit */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                        <span>🔗 Download Destination Audit</span>
                        <Link2 className="w-4 h-4 text-blue-600" />
                      </h4>
                      <div className="space-y-2">
                        {games.slice(0, 5).map(game => {
                          const hasLink = !!(game.downloadUrl || game.externalStoreUrl);
                          return (
                            <div key={game.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                              <div className="flex items-center gap-2">
                                <img src={game.logo} alt={game.name} className="w-7 h-7 rounded-lg object-cover" />
                                <span className="font-bold text-slate-900 truncate max-w-[180px]">{game.name}</span>
                              </div>
                              {hasLink ? (
                                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Configured
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setQuickLinkGame(game);
                                    setQuickDownloadUrl('');
                                  }}
                                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1"
                                >
                                  <AlertCircle className="w-3 h-3 text-amber-600" />
                                  Missing Destination (Set)
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setActiveTab('links')}
                        className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 py-1"
                      >
                        View All Download Links Audit →
                      </button>
                    </div>
                  </div>

                  {/* Seed Database Reset Button */}
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-amber-900 text-xs">Restore Factory Default Database</h5>
                      <p className="text-[11px] text-amber-700">Resets games, categories, and settings to original defaults.</p>
                    </div>
                    <button
                      onClick={handleResetSeed}
                      className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Seed</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: APPS MANAGEMENT TABLE */}
              {activeTab === 'games' && (
                <div className="space-y-4">
                  {/* Table Controls Header */}
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search apps by name, category, or package..."
                        value={tableSearch}
                        onChange={e => setTableSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={tableStatusFilter}
                        onChange={e => setTableStatusFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-hidden"
                      >
                        <option value="all">All Statuses</option>
                        <option value="published">Published</option>
                        <option value="draft">Drafts</option>
                        <option value="archived">Archived</option>
                      </select>

                      <select
                        value={tableLinkFilter}
                        onChange={e => setTableLinkFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-hidden"
                      >
                        <option value="all">All Links</option>
                        <option value="configured">Destination Configured</option>
                        <option value="missing">Destination Missing</option>
                      </select>
                    </div>

                    {/* Add App Button */}
                    <button
                      onClick={() => {
                        setEditingGame({
                          name: '',
                          category: 'Rummy',
                          description: '',
                          shortDescription: '',
                          logo: '',
                          version: 'v1.0.0',
                          apkSize: '35 MB',
                          downloadType: 'GOOGLE_PLAY',
                          googlePlayUrl: '',
                          officialWebsiteUrl: '',
                          directDownloadUrl: '',
                          downloadUrl: '',
                          externalStoreUrl: '',
                          status: 'published',
                          bonus: 50,
                          minWithdrawal: 100,
                          rating: 4.8
                        });
                        setFormUrlError('');
                        setActiveTab('add_game');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add App</span>
                    </button>
                  </div>

                  {/* Apps Table */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-black uppercase text-slate-600 tracking-wider">
                            <th className="p-3.5">App</th>
                            <th className="p-3.5">Category</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5">Download Destination</th>
                            <th className="p-3.5">Downloads</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                          {filteredGames.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">
                                No apps matched your query or status filter.
                              </td>
                            </tr>
                          ) : (
                            filteredGames.map(game => {
                              const hasLink = !!(game.downloadUrl || game.externalStoreUrl);
                              const isPublished = game.status === 'published' || !game.status;

                              return (
                                <tr key={game.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="p-3.5">
                                    <div className="flex items-center gap-3">
                                      <img src={game.logo} alt={game.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                                      <div>
                                        <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                                          {game.name}
                                          {game.isFeatured && (
                                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                                              Featured
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                          {game.developerName || game.category}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="p-3.5">
                                    <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-lg">
                                      {game.category}
                                    </span>
                                  </td>

                                  <td className="p-3.5">
                                    <button
                                      onClick={() => handleToggleStatus(game, isPublished ? 'draft' : 'published')}
                                      className={`font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full cursor-pointer border transition-colors ${
                                        isPublished
                                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                          : game.status === 'archived'
                                          ? 'bg-slate-200 text-slate-700 border-slate-300'
                                          : 'bg-amber-100 text-amber-800 border-amber-300'
                                      }`}
                                      title="Click to toggle Published/Draft"
                                    >
                                      {game.status || 'published'}
                                    </button>
                                  </td>

                                  <td className="p-3.5">
                                    {hasLink ? (
                                      <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-md border border-emerald-200 text-[11px] flex items-center gap-1 inline-flex">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        Configured
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setQuickLinkGame(game);
                                          setQuickDownloadUrl('');
                                        }}
                                        className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-md border border-amber-200 text-[11px] flex items-center gap-1 inline-flex"
                                      >
                                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                        Missing Link
                                      </button>
                                    )}
                                  </td>

                                  <td className="p-3.5 font-bold text-slate-700">
                                    {game.downloadCount.toLocaleString()}
                                  </td>

                                  <td className="p-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        onClick={() => {
                                          const initialDownloadType =
                                            game.downloadType ||
                                            (game.googlePlayUrl || (game.externalStoreUrl && game.externalStoreUrl.includes('play.google.com'))
                                              ? 'GOOGLE_PLAY'
                                              : game.officialWebsiteUrl || game.officialWebsite
                                              ? 'OFFICIAL_WEBSITE'
                                              : 'DIRECT_DOWNLOAD');

                                          setEditingGame({
                                            ...game,
                                            downloadType: initialDownloadType,
                                            googlePlayUrl:
                                              game.googlePlayUrl ||
                                              (game.externalStoreUrl?.includes('play.google.com') ? game.externalStoreUrl : ''),
                                            officialWebsiteUrl: game.officialWebsiteUrl || game.officialWebsite || '',
                                            directDownloadUrl: game.directDownloadUrl || game.downloadUrl || ''
                                          });
                                          setFormUrlError('');
                                          setActiveTab('add_game');
                                        }}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit App Details"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>

                                      <button
                                        onClick={() => handleDuplicateGame(game)}
                                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="Duplicate App"
                                      >
                                        <CopyPlus className="w-4 h-4" />
                                      </button>

                                      <button
                                        onClick={() => handleDeleteGame(game.id, game.name)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                        title="Delete App"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ADD / EDIT APP FORM */}
              {activeTab === 'add_game' && (
                <form onSubmit={handleSaveGame} className="space-y-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-black text-slate-900 text-base">
                        {editingGame.id ? `Edit App: ${editingGame.name}` : 'Create New App Entry'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Fill out app metadata, Google Play Store link, images, and download destination.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('games')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                    >
                      ← Back to Apps List
                    </button>
                  </div>

                  {formUrlError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-extrabold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{formUrlError}</span>
                    </div>
                  )}

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* App Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">App Name *</label>
                      <input
                        type="text"
                        required
                        value={editingGame.name || ''}
                        onChange={e => setEditingGame({ ...editingGame, name: e.target.value })}
                        placeholder="e.g. Jaiho Rummy Gold"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug (Auto-generated if empty)</label>
                      <input
                        type="text"
                        value={editingGame.slug || ''}
                        onChange={e => setEditingGame({ ...editingGame, slug: e.target.value })}
                        placeholder="e.g. jaiho-rummy-gold"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    {/* Category Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                      <select
                        value={editingGame.category || 'Rummy'}
                        onChange={e => setEditingGame({ ...editingGame, category: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Publication Status */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Publication Status</label>
                      <select
                        value={editingGame.status || 'published'}
                        onChange={e => setEditingGame({ ...editingGame, status: e.target.value as AppStatus })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                      >
                        <option value="published">Published (Visible on public site)</option>
                        <option value="draft">Draft (Hidden from public site)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    {/* Download Destination Type Selector */}
                    <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                      <label className="block text-xs font-extrabold text-slate-900">Download Destination *</label>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                          <input
                            type="radio"
                            name="downloadType"
                            value="GOOGLE_PLAY"
                            checked={(editingGame.downloadType || 'GOOGLE_PLAY') === 'GOOGLE_PLAY'}
                            onChange={() =>
                              setEditingGame({
                                ...editingGame,
                                downloadType: 'GOOGLE_PLAY'
                              })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Google Play Store</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                          <input
                            type="radio"
                            name="downloadType"
                            value="OFFICIAL_WEBSITE"
                            checked={editingGame.downloadType === 'OFFICIAL_WEBSITE'}
                            onChange={() =>
                              setEditingGame({
                                ...editingGame,
                                downloadType: 'OFFICIAL_WEBSITE'
                              })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Official Website</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                          <input
                            type="radio"
                            name="downloadType"
                            value="DIRECT_DOWNLOAD"
                            checked={editingGame.downloadType === 'DIRECT_DOWNLOAD'}
                            onChange={() =>
                              setEditingGame({
                                ...editingGame,
                                downloadType: 'DIRECT_DOWNLOAD'
                              })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Direct Download</span>
                        </label>
                      </div>

                      {/* Dependent Field based on downloadType */}
                      {(editingGame.downloadType || 'GOOGLE_PLAY') === 'GOOGLE_PLAY' && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Official Google Play Store URL *
                          </label>
                          <input
                            type="url"
                            value={
                              editingGame.googlePlayUrl ||
                              (editingGame.externalStoreUrl?.includes('play.google.com') ? editingGame.externalStoreUrl : '')
                            }
                            onChange={e => {
                              setFormUrlError('');
                              setEditingGame({
                                ...editingGame,
                                googlePlayUrl: e.target.value,
                                externalStoreUrl: e.target.value,
                                downloadUrl: e.target.value
                              });
                            }}
                            placeholder="https://play.google.com/store/apps/details?id=com.example.app"
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">Must be a valid play.google.com URL</p>
                        </div>
                      )}

                      {editingGame.downloadType === 'OFFICIAL_WEBSITE' && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Website URL *</label>
                          <input
                            type="url"
                            value={editingGame.officialWebsiteUrl || editingGame.officialWebsite || ''}
                            onChange={e => {
                              setFormUrlError('');
                              setEditingGame({
                                ...editingGame,
                                officialWebsiteUrl: e.target.value,
                                officialWebsite: e.target.value,
                                downloadUrl: e.target.value
                              });
                            }}
                            placeholder="https://example.com"
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                          />
                        </div>
                      )}

                      {editingGame.downloadType === 'DIRECT_DOWNLOAD' && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Authorized Direct Download URL *</label>
                          <input
                            type="url"
                            value={editingGame.directDownloadUrl || editingGame.downloadUrl || ''}
                            onChange={e => {
                              setFormUrlError('');
                              setEditingGame({
                                ...editingGame,
                                directDownloadUrl: e.target.value,
                                downloadUrl: e.target.value
                              });
                            }}
                            placeholder="https://example.com/download.apk"
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                          />
                        </div>
                      )}
                    </div>

                    {/* Logo Image URL & Upload */}
                    <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                      <label className="block text-xs font-extrabold text-slate-800">App Logo Image</label>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Live Preview Box */}
                        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                          {editingGame.logo ? (
                            <img src={editingGame.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingGame.logo || ''}
                              onChange={e => setEditingGame({ ...editingGame, logo: e.target.value })}
                              placeholder="Paste Logo Image URL (https://...)"
                              className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                            />
                            <label className="px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs border border-blue-200 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                              <Upload className="w-4 h-4" />
                              <span>Upload File</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setEditingGame({ ...editingGame, logo: reader.result as string });
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                            </label>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Paste an image URL above or upload a PNG/JPG/WEBP logo file directly.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Developer Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Developer Studio Name</label>
                      <input
                        type="text"
                        value={editingGame.developerName || ''}
                        onChange={e => setEditingGame({ ...editingGame, developerName: e.target.value })}
                        placeholder="ALL JAIHO COMPANY"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    {/* Short Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary (Displayed on cards)</label>
                      <input
                        type="text"
                        value={editingGame.shortDescription || ''}
                        onChange={e => setEditingGame({ ...editingGame, shortDescription: e.target.value })}
                        placeholder="Play skill games with instant UPI bank payouts."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    {/* Full Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Description</label>
                      <textarea
                        rows={4}
                        value={editingGame.description || ''}
                        onChange={e => setEditingGame({ ...editingGame, description: e.target.value })}
                        placeholder="Detailed information about the game, mechanics, and cash features..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    {/* Featured & Trending Toggles */}
                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingGame.isFeatured}
                          onChange={e => setEditingGame({ ...editingGame, isFeatured: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded-md"
                        />
                        <span className="text-xs font-bold text-slate-800">Feature on Homepage Hero</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingGame.isTrending}
                          onChange={e => setEditingGame({ ...editingGame, isTrending: e.target.checked })}
                          className="w-4 h-4 text-amber-500 rounded-md"
                        />
                        <span className="text-xs font-bold text-slate-800">Mark as Hot Trending 🔥</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Action Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                    {editingGame.id ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteGame(editingGame.id!, editingGame.name)}
                        className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-rose-200 cursor-pointer"
                        title="Permanently remove this app from database"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                        <span>Delete Application</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('games')}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={e => handleSaveGameWithStatus(e, 'draft')}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Save Draft
                      </button>
                      <button
                        type="button"
                        onClick={e => handleSaveGameWithStatus(e, 'published')}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                      >
                        Publish App
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 4: CATEGORIES MANAGEMENT */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  {/* Add New Category */}
                  <form onSubmit={handleAddCategory} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-sm">Add New Category</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Category Name (e.g. Ludo)"
                        required
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={newCatDesc}
                        onChange={e => setNewCatDesc(e.target.value)}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs"
                      >
                        Create Category
                      </button>
                    </div>
                  </form>

                  {/* Category Edit Modal if active */}
                  {editingCategory && (
                    <form onSubmit={handleUpdateCategory} className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-blue-900 text-xs">Edit Category: {editingCategory.name}</h4>
                        <button type="button" onClick={() => setEditingCategory(null)} className="text-slate-400 hover:text-slate-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={editingCategory.description}
                          onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                          className="p-2 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                      </div>
                      <button type="submit" className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-xl text-xs">
                        Save Changes
                      </button>
                    </form>
                  )}

                  {/* Categories Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map(cat => (
                      <div key={cat.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between">
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                            {cat.name}
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {cat.gameCount || 0} Apps
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">{cat.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingCategory(cat)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: MEDIA MANAGEMENT */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* Upload Media Card */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Upload className="w-4 h-4 text-blue-600" />
                      Upload or Register Media Asset
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Local File Upload */}
                      <div className="border-2 border-dashed border-slate-200 p-4 rounded-2xl text-center space-y-2 bg-slate-50">
                        <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                        <div className="text-xs font-bold text-slate-700">Choose File From Computer</div>
                        <p className="text-[10px] text-slate-400">Supports PNG, JPG, WEBP up to 5MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="text-xs text-slate-500 mx-auto"
                        />
                      </div>

                      {/* URL Registration */}
                      <form onSubmit={handleUploadMedia} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-700">Or Paste Image URL</div>
                        <input
                          type="text"
                          placeholder="Asset Name (e.g. Rummy Logo)"
                          value={uploadName}
                          onChange={e => setUploadName(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                        <input
                          type="url"
                          placeholder="Image URL (https://...)"
                          required
                          value={uploadUrl}
                          onChange={e => setUploadUrl(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-xs">
                          Save URL to Library
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Media Library Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mediaItems.map(item => (
                      <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2 relative group">
                        <img src={item.url} alt={item.name} className="w-full h-28 rounded-xl object-cover border border-slate-100" />
                        <div className="font-bold text-xs text-slate-900 truncate">{item.name}</div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                          <span>{item.type}</span>
                          <button
                            onClick={() => handleCopyMediaUrl(item.url, item.id)}
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold"
                          >
                            <Copy className="w-3 h-3" />
                            {copiedMediaId === item.id ? 'Copied!' : 'Copy URL'}
                          </button>
                        </div>
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="absolute top-4 right-4 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: DOWNLOAD LINKS AUDIT */}
              {activeTab === 'links' && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                    <h4 className="font-extrabold text-slate-900 text-sm">Download Destination Link Health</h4>
                    <p className="text-xs text-slate-500 font-medium">Verify that every app has a valid APK download URL configured.</p>
                  </div>

                  <div className="space-y-2">
                    {games.map(game => {
                      const hasLink = !!(game.downloadUrl || game.externalStoreUrl);
                      return (
                        <div key={game.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={game.logo} alt={game.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                            <div>
                              <div className="font-extrabold text-slate-900 text-sm">{game.name}</div>
                              <p className="text-xs text-slate-500 font-mono truncate max-w-[300px]">
                                {game.downloadUrl || game.externalStoreUrl || 'NO LINK CONFIGURED'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {hasLink ? (
                              <a
                                href={game.downloadUrl || game.externalStoreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Test Destination
                              </a>
                            ) : (
                              <button
                                onClick={() => {
                                  setQuickLinkGame(game);
                                  setQuickDownloadUrl('');
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                Add Destination
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 7: SITE SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
                  <h4 className="font-extrabold text-slate-900 text-sm">Site Identity & Global Settings</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Site Title</label>
                      <input
                        type="text"
                        value={settingsForm.siteName}
                        onChange={e => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Site Tagline</label>
                      <input
                        type="text"
                        value={settingsForm.siteTagline}
                        onChange={e => setSettingsForm({ ...settingsForm, siteTagline: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Telegram Community Channel Link</label>
                      <input
                        type="url"
                        value={settingsForm.telegramLink}
                        onChange={e => setSettingsForm({ ...settingsForm, telegramLink: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={settingsForm.contactEmail}
                        onChange={e => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Responsible Gaming Warning</label>
                      <textarea
                        rows={3}
                        value={settingsForm.noticeContent}
                        onChange={e => setSettingsForm({ ...settingsForm, noticeContent: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <button type="submit" className="bg-blue-600 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md">
                    Save Branding & Settings
                  </button>
                </form>
              )}

              {/* TAB 8: CONTACT MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-3">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">User Inquiry Messages</h4>
                      <p className="text-xs text-slate-500 font-medium">Inquiries and support requests submitted by visitors.</p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full">
                      {messages.length} Messages
                    </span>
                  </div>

                  {messages.length === 0 ? (
                    <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-xs text-slate-400 font-medium">
                      No inquiry messages found.
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="font-bold text-slate-900 text-xs">
                            {msg.name} ({msg.email})
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-semibold">{msg.date}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="font-bold text-xs text-blue-600">{msg.subject}</div>
                        <p className="text-xs text-slate-600">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* QUICK LINK EDIT MODAL */}
        {quickLinkGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl">
              <h4 className="font-black text-slate-900 text-sm">
                Set Download Link for {quickLinkGame.name}
              </h4>
              <input
                type="url"
                placeholder="https://example.com/download.apk"
                value={quickDownloadUrl}
                onChange={e => setQuickDownloadUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setQuickLinkGame(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuickLink}
                  className="px-4 py-2 bg-blue-600 text-white font-extrabold rounded-xl text-xs"
                >
                  Save Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
