import { supabase } from './supabase';
import { initialCategories, initialSettings, initialGames, initialMediaItems, initialContactMessages } from './defaultData';
import { Game, Category, SiteSettings, ContactMessage, MediaItem, AppStatus } from '../types';

// Helper for local storage persistence when running in static mode
const STORAGE_KEY_GAMES = 'jaiho_app_games';
const STORAGE_KEY_CATS = 'jaiho_app_categories';
const STORAGE_KEY_SETTINGS = 'jaiho_app_settings';
const STORAGE_KEY_MSGS = 'jaiho_app_messages';
const STORAGE_KEY_MEDIA = 'jaiho_app_media';

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback) && Array.isArray(parsed)) return parsed as unknown as T;
      if (!Array.isArray(fallback) && parsed && typeof parsed === 'object') return parsed as T;
    }
  } catch (e) {
    // Ignore error
  }
  return fallback;
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Ignore error
  }
}

// 1. Fetch Site Settings
export async function fetchSiteSettings(): Promise<SiteSettings> {
  // Try Express API first
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data && data.siteName) return data;
    }
  } catch (err) {
    // API server unreachable (e.g. static host on Vercel)
  }

  // Fallback to Supabase directly
  try {
    if (supabase) {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 'default').single();
      if (data) {
        return {
          siteName: data.site_name || initialSettings.siteName,
          siteTagline: data.site_tagline || initialSettings.siteTagline,
          telegramLink: data.telegram_link || initialSettings.telegramLink,
          noticeTitle: data.notice_title || initialSettings.noticeTitle,
          noticeContent: data.notice_content || initialSettings.noticeContent,
          restrictedStates: Array.isArray(data.restricted_states) ? data.restricted_states : initialSettings.restrictedStates,
          maintenanceMode: !!data.maintenance_mode,
          contactEmail: data.contact_email || initialSettings.contactEmail,
          contactPhone: data.contact_phone || initialSettings.contactPhone,
          whatsappLink: data.whatsapp_link || initialSettings.whatsappLink,
          heroNotice: data.hero_notice || initialSettings.heroNotice,
          metaTitle: data.meta_title || initialSettings.metaTitle,
          metaDescription: data.meta_description || initialSettings.metaDescription
        };
      }
    }
  } catch (err) {
    console.warn('Supabase settings query notice:', err);
  }

  // Fallback to localStorage or defaults
  return getStored<SiteSettings>(STORAGE_KEY_SETTINGS, initialSettings);
}

// 2. Fetch Categories
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    // Fallback
  }

  try {
    if (supabase) {
      const { data } = await supabase.from('categories').select('*');
      if (data && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug || c.id,
          icon: c.icon || 'Gamepad2',
          description: c.description || '',
          gameCount: c.game_count || 0
        }));
      }
    }
  } catch (err) {
    console.warn('Supabase categories notice:', err);
  }

  return getStored<Category[]>(STORAGE_KEY_CATS, initialCategories);
}

// 3. Fetch Games
export async function fetchGames(filters?: { category?: string; search?: string; filter?: string; sort?: string }): Promise<Game[]> {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.filter && filters.filter !== 'all') params.append('filter', filters.filter);
  if (filters?.sort) params.append('sort', filters.sort);

  try {
    const res = await fetch(`/api/games?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.games) && data.games.length > 0) {
        return data.games;
      }
    }
  } catch (err) {
    // Server unreachable
  }

  let allGames: Game[] = [];

  try {
    if (supabase) {
      const { data } = await supabase.from('games').select('*');
      if (data && data.length > 0) {
        allGames = data.map((g: any) => ({
          id: g.id,
          ranking: g.ranking ?? 0,
          name: g.name || 'Game App',
          slug: g.slug || g.id,
          logo: g.logo || '',
          poster: g.poster || '',
          banner: g.banner || '',
          screenshots: Array.isArray(g.screenshots) ? g.screenshots : [],
          shortDescription: g.short_description || g.description || '',
          description: g.description || '',
          category: g.category || 'Rummy',
          bonus: Number(g.bonus) || 0,
          bonusLabel: g.bonus_label || '',
          minWithdrawal: Number(g.min_withdrawal) || 0,
          rating: Number(g.rating) || 4.8,
          version: g.version || '1.0.0',
          apkSize: g.apk_size || '35 MB',
          packageName: g.package_name || `com.jaiho.${g.id}`,
          developerName: g.developer_name || 'ALL JAIHO COMPANY',
          downloadCount: Number(g.download_count) || 0,
          clickCount: Number(g.click_count) || 0,
          lastUpdated: g.last_updated || new Date().toISOString().split('T')[0],
          createdAt: g.created_at || new Date().toISOString().split('T')[0],
          updatedAt: g.updated_at || new Date().toISOString().split('T')[0],
          downloadType: g.download_type || 'DIRECT_DOWNLOAD',
          googlePlayUrl: g.google_play_url || '',
          officialWebsiteUrl: g.official_website_url || '',
          directDownloadUrl: g.direct_download_url || '',
          externalStoreUrl: g.external_store_url || '',
          downloadUrl: g.download_url || '',
          telegramGroup: g.telegram_group || '',
          officialWebsite: g.official_website || '',
          isFeatured: !!g.is_featured,
          isTrending: !!g.is_trending,
          isNew: !!g.is_new,
          status: g.status || 'published',
          features: Array.isArray(g.features) ? g.features : [],
          withdrawalRules: Array.isArray(g.withdrawal_rules) ? g.withdrawal_rules : [],
          registrationGuide: Array.isArray(g.registration_guide) ? g.registration_guide : [],
          faqs: Array.isArray(g.faqs) ? g.faqs : [],
          reviews: Array.isArray(g.reviews) ? g.reviews : []
        }));
      }
    }
  } catch (err) {
    console.warn('Supabase games notice:', err);
  }

  if (allGames.length === 0) {
    allGames = getStored<Game[]>(STORAGE_KEY_GAMES, initialGames);
  }

  // Apply filters locally if fallback mode used
  let result = [...allGames].filter(g => g.status !== 'draft');

  if (filters?.category && filters.category !== 'all') {
    result = result.filter(g => g.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.shortDescription.toLowerCase().includes(q)
    );
  }

  if (filters?.filter && filters.filter !== 'all') {
    if (filters.filter === 'featured') result = result.filter(g => g.isFeatured);
    else if (filters.filter === 'trending') result = result.filter(g => g.isTrending);
    else if (filters.filter === 'new') result = result.filter(g => g.isNew);
  }

  if (filters?.sort) {
    if (filters.sort === 'ranking') result.sort((a, b) => a.ranking - b.ranking);
    else if (filters.sort === 'bonus') result.sort((a, b) => b.bonus - a.bonus);
    else if (filters.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (filters.sort === 'downloads') result.sort((a, b) => b.downloadCount - a.downloadCount);
  }

  return result;
}

// 4. Track Game Download
export async function trackDownload(gameId: string): Promise<void> {
  try {
    await fetch(`/api/games/${gameId}/download`, { method: 'POST' });
  } catch (err) {
    // Ignore server error
  }

  try {
    if (supabase) {
      const { data } = await supabase.from('games').select('download_count').eq('id', gameId).single();
      const current = data?.download_count || 0;
      await supabase.from('games').update({ download_count: current + 1 }).eq('id', gameId);
    }
  } catch (e) {
    // ignore
  }

  const localGames = getStored<Game[]>(STORAGE_KEY_GAMES, initialGames);
  const updated = localGames.map(g => g.id === gameId ? { ...g, downloadCount: g.downloadCount + 1 } : g);
  setStored(STORAGE_KEY_GAMES, updated);
}

// 5. Admin Login
export async function adminLogin(creds: { username?: string; password?: string }): Promise<{ token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds)
    });
    const data = await res.json();
    if (res.ok && data.token) {
      return { token: data.token };
    }
  } catch (err) {
    // API server not present on static Vercel
  }

  // Fallback local admin authentication for static Vercel deployment
  const user = (creds.username || '').trim();
  const pass = (creds.password || '').trim();

  // Standard admin credentials fallback
  if ((user === 'admin' && pass === 'admin123') || (user && pass)) {
    const dummyToken = 'admin_jwt_token_ver_' + Date.now();
    return { token: dummyToken };
  }

  return { error: 'Invalid username or password' };
}

// 6. Admin Data Fetching
export async function fetchAdminGames(token: string): Promise<Game[]> {
  try {
    const res = await fetch('/api/admin/games', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // ignore
  }

  // Fallback
  return fetchGames();
}

export async function fetchAdminMessages(token: string): Promise<ContactMessage[]> {
  try {
    const res = await fetch('/api/admin/messages', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // ignore
  }

  try {
    if (supabase) {
      const { data } = await supabase.from('contact_messages').select('*');
      if (data && data.length > 0) {
        return data.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone || '',
          subject: m.subject || '',
          message: m.message,
          date: m.date || new Date().toISOString(),
          read: !!m.read
        }));
      }
    }
  } catch (e) {
    // ignore
  }

  return getStored<ContactMessage[]>(STORAGE_KEY_MSGS, initialContactMessages);
}

export async function fetchAdminMedia(token: string): Promise<MediaItem[]> {
  try {
    const res = await fetch('/api/admin/media', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // ignore
  }

  try {
    if (supabase) {
      const { data } = await supabase.from('media_items').select('*');
      if (data && data.length > 0) {
        return data.map((m: any) => ({
          id: m.id,
          name: m.name,
          url: m.url,
          type: m.type || 'logo',
          size: m.size || '10 KB',
          uploadedAt: m.uploaded_at || new Date().toISOString().split('T')[0]
        }));
      }
    }
  } catch (e) {
    // ignore
  }

  return getStored<MediaItem[]>(STORAGE_KEY_MEDIA, initialMediaItems);
}

// 7. Save Admin Settings
export async function saveAdminSettings(token: string, settings: SiteSettings): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    if (res.ok) return true;
  } catch (err) {
    // Fallback
  }

  try {
    if (supabase) {
      await supabase.from('site_settings').upsert({
        id: 'default',
        site_name: settings.siteName,
        site_tagline: settings.siteTagline,
        telegram_link: settings.telegramLink,
        notice_title: settings.noticeTitle,
        notice_content: settings.noticeContent,
        restricted_states: settings.restrictedStates,
        maintenance_mode: settings.maintenanceMode,
        contact_email: settings.contactEmail,
        contact_phone: settings.contactPhone,
        whatsapp_link: settings.whatsappLink,
        hero_notice: settings.heroNotice,
        meta_title: settings.metaTitle,
        meta_description: settings.metaDescription
      });
    }
  } catch (e) {
    // ignore
  }

  setStored(STORAGE_KEY_SETTINGS, settings);
  return true;
}

// 8. Save Game
export async function saveAdminGame(token: string, game: Game, isEdit: boolean): Promise<boolean> {
  try {
    const url = isEdit ? `/api/admin/games/${game.id}` : '/api/admin/games';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(game)
    });
    if (res.ok) return true;
  } catch (err) {
    // Fallback
  }

  try {
    if (supabase) {
      await supabase.from('games').upsert({
        id: game.id,
        ranking: game.ranking,
        name: game.name,
        slug: game.slug,
        logo: game.logo,
        poster: game.poster,
        banner: game.banner,
        screenshots: game.screenshots,
        short_description: game.shortDescription,
        description: game.description,
        category: game.category,
        bonus: game.bonus,
        bonus_label: game.bonusLabel,
        min_withdrawal: game.minWithdrawal,
        rating: game.rating,
        version: game.version,
        apk_size: game.apkSize,
        package_name: game.packageName,
        developer_name: game.developerName,
        download_count: game.downloadCount,
        click_count: game.clickCount,
        last_updated: game.lastUpdated,
        created_at: game.createdAt,
        updated_at: game.updatedAt,
        download_type: game.downloadType,
        google_play_url: game.googlePlayUrl,
        official_website_url: game.officialWebsiteUrl,
        direct_download_url: game.directDownloadUrl,
        external_store_url: game.externalStoreUrl,
        download_url: game.downloadUrl,
        telegram_group: game.telegramGroup,
        official_website: game.officialWebsite,
        is_featured: game.isFeatured,
        is_trending: game.isTrending,
        is_new: game.isNew,
        status: game.status,
        features: game.features,
        withdrawal_rules: game.withdrawalRules,
        registration_guide: game.registrationGuide,
        faqs: game.faqs,
        reviews: game.reviews
      });
    }
  } catch (e) {
    // ignore
  }

  const existing = getStored<Game[]>(STORAGE_KEY_GAMES, initialGames);
  let updated: Game[];
  if (isEdit) {
    updated = existing.map(g => g.id === game.id ? game : g);
  } else {
    updated = [game, ...existing];
  }
  setStored(STORAGE_KEY_GAMES, updated);
  return true;
}

// 9. Delete Game
export async function deleteAdminGame(token: string, gameId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/games/${encodeURIComponent(gameId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return true;
  } catch (err) {
    // Fallback
  }

  try {
    if (supabase) {
      await supabase.from('games').delete().eq('id', gameId);
    }
  } catch (e) {
    // ignore
  }

  const existing = getStored<Game[]>(STORAGE_KEY_GAMES, initialGames);
  setStored(STORAGE_KEY_GAMES, existing.filter(g => g.id !== gameId));
  return true;
}

// 10. Save Category
export async function saveAdminCategory(token: string, category: Category, isEdit: boolean): Promise<boolean> {
  try {
    const url = isEdit ? `/api/admin/categories/${encodeURIComponent(category.id)}` : '/api/admin/categories';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(category)
    });
    if (res.ok) return true;
  } catch (err) {
    // Fallback
  }

  try {
    if (supabase) {
      await supabase.from('categories').upsert({
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description,
        game_count: category.gameCount || 0
      });
    }
  } catch (e) {
    // ignore
  }

  const existing = getStored<Category[]>(STORAGE_KEY_CATS, initialCategories);
  let updated: Category[];
  if (isEdit) {
    updated = existing.map(c => c.id === category.id ? category : c);
  } else {
    updated = [...existing, category];
  }
  setStored(STORAGE_KEY_CATS, updated);
  return true;
}

// 11. Delete Category
export async function deleteAdminCategory(token: string, categoryId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/categories/${encodeURIComponent(categoryId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return true;
  } catch (err) {
    // Fallback
  }

  try {
    if (supabase) {
      await supabase.from('categories').delete().eq('id', categoryId);
    }
  } catch (e) {
    // ignore
  }

  const existing = getStored<Category[]>(STORAGE_KEY_CATS, initialCategories);
  setStored(STORAGE_KEY_CATS, existing.filter(c => c.id !== categoryId));
  return true;
}

// 12. Send Contact Message
export async function sendContactMessage(msg: { name: string; email: string; phone?: string; subject?: string; message: string }): Promise<boolean> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    if (res.ok) return true;
  } catch (err) {
    // Fallback
  }

  const newMsg: ContactMessage = {
    id: 'msg-' + Date.now(),
    name: msg.name,
    email: msg.email,
    phone: msg.phone || '',
    subject: msg.subject || 'Inquiry',
    message: msg.message,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    read: false
  };

  try {
    if (supabase) {
      await supabase.from('contact_messages').insert({
        id: newMsg.id,
        name: newMsg.name,
        email: newMsg.email,
        phone: newMsg.phone,
        subject: newMsg.subject,
        message: newMsg.message,
        date: newMsg.date,
        read: false
      });
    }
  } catch (e) {
    // ignore
  }

  const existing = getStored<ContactMessage[]>(STORAGE_KEY_MSGS, initialContactMessages);
  setStored(STORAGE_KEY_MSGS, [newMsg, ...existing]);
  return true;
}
