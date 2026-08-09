import express from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { Game, Category, SiteSettings, ContactMessage, MediaItem, AppStatus } from './src/types';
import { db as sqlDb } from './src/db/index.ts';
import * as sqlSchema from './src/db/schema.ts';
import { eq } from 'drizzle-orm';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'jaiho_company_jwt_super_secret_key_2026';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded static files if any
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Local Data Persistence Setup
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  games: Game[];
  categories: Category[];
  settings: SiteSettings;
  contactMessages: ContactMessage[];
  downloadStats: { [gameId: string]: number };
  mediaItems: MediaItem[];
}

const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Rummy', slug: 'rummy', icon: 'Spade', description: 'Popular cash rummy games with instant bank withdrawals.', gameCount: 4 },
  { id: 'cat-2', name: 'Teen Patti', slug: 'teen-patti', icon: 'Coins', description: 'Classic 3-card poker games with high daily sign up bonuses.', gameCount: 3 },
  { id: 'cat-3', name: 'Slots', slug: 'slots', icon: 'Dices', description: 'Vegas style slot machines with huge progressive jackpots.', gameCount: 2 },
  { id: 'cat-4', name: 'Aviator', slug: 'aviator', icon: 'Plane', description: 'High multiplier crash games with real-time payout tracking.', gameCount: 2 },
  { id: 'cat-5', name: 'Casino', slug: 'casino', icon: 'Crown', description: 'Live dealer roulette, blackjack, and baccarat tables.', gameCount: 2 },
  { id: 'cat-6', name: 'Fantasy Sports', slug: 'fantasy-sports', icon: 'Trophy', description: 'Cricket & football fantasy leagues with big mega contests.', gameCount: 2 },
  { id: 'cat-7', name: 'Arcade', slug: 'arcade', icon: 'Gamepad2', description: 'Ludo, Carrom, Snake, and quick casual skill gaming apps.', gameCount: 2 },
  { id: 'cat-8', name: 'Fishing', slug: 'fishing', icon: 'Fish', description: 'Ocean shooting & deep sea fish hunting games.', gameCount: 1 },
  { id: 'cat-9', name: 'Mines', slug: 'mines', icon: 'Bomb', description: 'Strategic grid minefield cash games with customizable risk.', gameCount: 1 },
  { id: 'cat-10', name: 'Poker', slug: 'poker', icon: 'Flame', description: 'Texas Holdem and Omaha high-stakes tournament tables.', gameCount: 1 },
  { id: 'cat-11', name: 'Color Prediction', slug: 'color-prediction', icon: 'Palette', description: 'Fast 1-minute color guess & win apps with instant payouts.', gameCount: 1 },
  { id: 'cat-12', name: 'Bingo', slug: 'bingo', icon: 'Sparkles', description: 'Fun multiplayer bingo rooms with daily free cards.', gameCount: 1 }
];

const initialGames: Game[] = [];

const initialSettings: SiteSettings = {
  siteName: 'ALL JAIHO COMPANY',
  siteTagline: 'India\'s #1 Real Cash Gaming Directory & Verified APK Downloads',
  telegramLink: 'https://t.me/Soumy_6263',
  noticeTitle: 'IMPORTANT LEGAL NOTICE & RESPONSIBLE GAMING WARNING',
  noticeContent: 'Real money gaming involves financial risk and may be addictive. Play responsibly and at your own risk. This platform lists verified APKs for skill-based gaming applications. Online real money gaming is strictly restricted for users under 18 years of age and residents of Assam, Odisha, Telangana, Nagaland, Sikkim, and Andhra Pradesh.',
  restrictedStates: ['Assam', 'Odisha', 'Telangana', 'Nagaland', 'Sikkim', 'Andhra Pradesh'],
  maintenanceMode: false,
  contactEmail: 'support@alljaihocompany.com',
  contactPhone: '+91 98765 43210',
  whatsappLink: 'https://wa.me/919876543210',
  heroNotice: '⚡ 100% Verified APKs • Instant ₹51-₹500 Sign Up Bonuses • Fast Downloads',
  metaTitle: 'ALL JAIHO COMPANY - Download Real Cash Rummy, Teen Patti & Casino Games APK',
  metaDescription: 'Download 100% safe & verified gaming APKs. Best Real Cash Rummy, Teen Patti, Aviator, Slots, and Fantasy Sports apps with highest sign up bonuses & instant bank withdrawals.'
};

let db: DatabaseSchema = {
  games: initialGames,
  categories: initialCategories,
  settings: initialSettings,
  contactMessages: [
    {
      id: 'msg-1',
      name: 'Rohan Sharma',
      email: 'rohan@example.com',
      phone: '+91 9812345678',
      subject: 'APK Download Issue',
      message: 'Can you please add the latest version of Aviator Pro?',
      date: '2026-08-05 14:22',
      read: false
    }
  ],
  downloadStats: {},
  mediaItems: [
    {
      id: 'media-1',
      name: 'Rummy Circle Logo',
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop&q=80',
      type: 'logo',
      size: '24 KB',
      uploadedAt: '2026-08-01'
    },
    {
      id: 'media-2',
      name: 'Teen Patti Banner',
      url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&h=400&fit=crop&q=80',
      type: 'banner',
      size: '120 KB',
      uploadedAt: '2026-08-03'
    }
  ]
};

async function syncWithCloudSql() {
  if (!process.env.SQL_HOST) return;
  try {
    // Load categories from Cloud SQL
    const sqlCats = await sqlDb.select().from(sqlSchema.categories);
    if (sqlCats && sqlCats.length > 0) {
      db.categories = sqlCats.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        description: c.description,
        gameCount: c.gameCount || 0
      }));
    } else if (db.categories && db.categories.length > 0) {
      // Seed categories to Cloud SQL
      for (const cat of db.categories) {
        await sqlDb.insert(sqlSchema.categories).values({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          description: cat.description,
          gameCount: cat.gameCount || 0
        }).onConflictDoNothing();
      }
    }

    // Load games from Cloud SQL
    const sqlGames = await sqlDb.select().from(sqlSchema.games);
    if (sqlGames && sqlGames.length > 0) {
      db.games = sqlGames.map(g => ({
        id: g.id,
        ranking: g.ranking || 0,
        name: g.name,
        slug: g.slug,
        logo: g.logo,
        poster: g.poster || undefined,
        banner: g.banner || undefined,
        screenshots: (g.screenshots as string[]) || [],
        shortDescription: g.shortDescription || '',
        description: g.description,
        category: g.category,
        bonus: g.bonus || 0,
        bonusLabel: g.bonusLabel || undefined,
        minWithdrawal: g.minWithdrawal || 100,
        rating: g.rating || 4.5,
        version: g.version || 'v1.0.0',
        apkSize: g.apkSize || '35 MB',
        packageName: g.packageName || undefined,
        developerName: g.developerName || undefined,
        downloadCount: g.downloadCount || 0,
        clickCount: g.clickCount || 0,
        lastUpdated: g.lastUpdated || '',
        createdAt: g.createdAt || undefined,
        updatedAt: g.updatedAt || undefined,
        downloadType: (g.downloadType as any) || 'GOOGLE_PLAY',
        downloadUrl: g.downloadUrl,
        googlePlayUrl: g.googlePlayUrl || undefined,
        officialWebsiteUrl: g.officialWebsiteUrl || undefined,
        directDownloadUrl: g.directDownloadUrl || undefined,
        externalStoreUrl: g.externalStoreUrl || undefined,
        telegramGroup: g.telegramGroup || undefined,
        officialWebsite: g.officialWebsite || undefined,
        isFeatured: g.isFeatured || false,
        isTrending: g.isTrending || false,
        isNew: g.isNew || false,
        status: (g.status as any) || 'published',
        features: (g.features as string[]) || [],
        withdrawalRules: (g.withdrawalRules as string[]) || [],
        registrationGuide: (g.registrationGuide as string[]) || [],
        faqs: (g.faqs as any) || [],
        reviews: (g.reviews as any) || []
      }));
    } else if (db.games && db.games.length > 0) {
      // Seed games to Cloud SQL
      for (const game of db.games) {
        await sqlDb.insert(sqlSchema.games).values({
          id: game.id,
          ranking: game.ranking,
          name: game.name,
          slug: game.slug || game.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          logo: game.logo,
          poster: game.poster,
          banner: game.banner,
          screenshots: game.screenshots,
          shortDescription: game.shortDescription,
          description: game.description,
          category: game.category,
          bonus: game.bonus,
          bonusLabel: game.bonusLabel,
          minWithdrawal: game.minWithdrawal,
          rating: game.rating,
          version: game.version,
          apkSize: game.apkSize,
          packageName: game.packageName,
          developerName: game.developerName,
          downloadCount: game.downloadCount,
          clickCount: game.clickCount || 0,
          lastUpdated: game.lastUpdated,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt,
          downloadType: game.downloadType || 'GOOGLE_PLAY',
          downloadUrl: game.downloadUrl,
          googlePlayUrl: game.googlePlayUrl,
          officialWebsiteUrl: game.officialWebsiteUrl,
          directDownloadUrl: game.directDownloadUrl,
          externalStoreUrl: game.externalStoreUrl,
          telegramGroup: game.telegramGroup,
          officialWebsite: game.officialWebsite,
          isFeatured: game.isFeatured || false,
          isTrending: game.isTrending || false,
          isNew: game.isNew || false,
          status: game.status || 'published',
          features: game.features || [],
          withdrawalRules: game.withdrawalRules || [],
          registrationGuide: game.registrationGuide || [],
          faqs: game.faqs || [],
          reviews: game.reviews || []
        }).onConflictDoNothing();
      }
    }
  } catch (err) {
    console.error('Cloud SQL sync failed, using file db:', err);
  }
}

function loadDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed) {
        db = {
          ...db,
          ...parsed,
          games: Array.isArray(parsed.games) ? parsed.games : []
        };
        db.games = db.games.map(g => ({
          ...g,
          slug: g.slug || (g.name ? g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : g.id),
          status: g.status || 'published',
          shortDescription: g.shortDescription || g.description || '',
          packageName: g.packageName || `com.jaiho.${g.id}`,
          developerName: g.developerName || 'ALL JAIHO COMPANY'
        }));
        db.settings = db.settings || initialSettings;
        db.settings.siteName = db.settings.siteName || 'ALL JAIHO COMPANY';
        db.settings.telegramLink = db.settings.telegramLink || 'https://t.me/Soumy_6263';
        db.mediaItems = db.mediaItems || [];
      }
    } else {
      saveDatabase();
    }
    syncWithCloudSql().catch(err => console.error('Cloud SQL initial sync error:', err));
  } catch (err) {
    console.error('Failed to load database, using defaults:', err);
  }
}

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database:', err);
  }
}

loadDatabase();

// Firebase Auth user sync route for Cloud SQL
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { uid, email, name, picture } = req.user;
    if (process.env.SQL_HOST) {
      await sqlDb.insert(sqlSchema.users)
        .values({
          uid,
          email: email || '',
          displayName: name || '',
          photoURL: picture || ''
        })
        .onConflictDoUpdate({
          target: sqlSchema.users.uid,
          set: {
            email: email || '',
            displayName: name || '',
            photoURL: picture || '',
            updatedAt: new Date()
          }
        });
    }
    res.json({ success: true, user: { uid, email, name } });
  } catch (err: any) {
    console.error('User sync error:', err);
    res.status(500).json({ error: err.message || 'Failed to sync user' });
  }
});

// Google Drive Backup History Endpoint (stored in Cloud SQL / Local)
app.get('/api/drive/backups', optionalAuth, async (req: AuthRequest, res) => {
  try {
    if (process.env.SQL_HOST && req.user) {
      const userRecord = await sqlDb.select().from(sqlSchema.users).where(eq(sqlSchema.users.uid, req.user.uid));
      if (userRecord.length > 0) {
        const backups = await sqlDb.select().from(sqlSchema.driveBackups).where(eq(sqlSchema.driveBackups.userId, userRecord[0].id));
        return res.json(backups);
      }
    }
    res.json([]);
  } catch (err) {
    console.error('Get drive backups error:', err);
    res.json([]);
  }
});

app.post('/api/drive/backups', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { fileId, fileName, webViewLink, size, description } = req.body;
    if (!fileId || !fileName) {
      return res.status(400).json({ error: 'fileId and fileName are required' });
    }
    if (process.env.SQL_HOST && req.user) {
      let userRecord = await sqlDb.select().from(sqlSchema.users).where(eq(sqlSchema.users.uid, req.user.uid));
      let userId: number | null = null;
      if (userRecord.length === 0) {
        const inserted = await sqlDb.insert(sqlSchema.users).values({
          uid: req.user.uid,
          email: req.user.email || '',
          displayName: req.user.name || '',
          photoURL: req.user.picture || ''
        }).returning();
        userId = inserted[0]?.id || null;
      } else {
        userId = userRecord[0].id;
      }

      const backup = await sqlDb.insert(sqlSchema.driveBackups).values({
        userId,
        fileId,
        fileName,
        webViewLink,
        size: size || '10 KB',
        description: description || 'ALL JAIHO COMPANY Backup'
      }).returning();

      return res.json({ success: true, backup: backup[0] });
    }
    res.json({ success: true, backup: { fileId, fileName, webViewLink } });
  } catch (err: any) {
    console.error('Save drive backup record error:', err);
    res.status(500).json({ error: err.message || 'Failed to record backup' });
  }
});


// API ROUTES

// Public: Get all games with search, filter, sorting, pagination
app.get('/api/games', (req, res) => {
  let list = [...db.games];
  const { category, search, filter, sort, featured, trending, isNew, limit, skip, includeDrafts } = req.query;

  // Filter published apps only for public visitors
  if (includeDrafts !== 'true') {
    list = list.filter(g => g.status === 'published' || !g.status);
  }

  if (category && category !== 'all') {
    if (category === 'new') {
      list = list.filter(g => g.isNew);
    } else if (category === 'other') {
      list = list.filter(g => !['Rummy', 'Teen Patti'].includes(g.category));
    } else {
      list = list.filter(g => g.category.toLowerCase() === (category as string).toLowerCase());
    }
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    list = list.filter(g => 
      g.name.toLowerCase().includes(q) ||
      (g.slug && g.slug.toLowerCase().includes(q)) ||
      g.category.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      (g.shortDescription && g.shortDescription.toLowerCase().includes(q)) ||
      (g.developerName && g.developerName.toLowerCase().includes(q)) ||
      (g.bonusLabel && g.bonusLabel.toLowerCase().includes(q))
    );
  }

  if (featured === 'true') {
    list = list.filter(g => g.isFeatured);
  }
  if (trending === 'true') {
    list = list.filter(g => g.isTrending);
  }
  if (isNew === 'true') {
    list = list.filter(g => g.isNew);
  }

  if (filter) {
    if (filter === 'newest') list = list.filter(g => g.isNew || new Date(g.lastUpdated) > new Date('2026-07-25'));
    else if (filter === 'popular') list.sort((a, b) => b.downloadCount - a.downloadCount);
    else if (filter === 'highest_bonus') list.sort((a, b) => b.bonus - a.bonus);
    else if (filter === 'lowest_withdrawal') list.sort((a, b) => a.minWithdrawal - b.minWithdrawal);
    else if (filter === 'alphabetical') list.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort) {
    if (sort === 'bonus_high') list.sort((a, b) => b.bonus - a.bonus);
    else if (sort === 'withdrawal_low') list.sort((a, b) => a.minWithdrawal - b.minWithdrawal);
    else if (sort === 'alpha') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'trending') list.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    else if (sort === 'latest') list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  } else {
    // Default sort by ranking ascending
    list.sort((a, b) => a.ranking - b.ranking);
  }

  const offset = skip ? parseInt(skip as string, 10) : 0;
  const max = limit ? parseInt(limit as string, 10) : 100;
  const paginated = list.slice(offset, offset + max);

  res.json({
    total: list.length,
    games: paginated
  });
});

// Get single game details by ID or Slug
app.get('/api/games/:slugOrId', (req, res) => {
  const param = req.params.slugOrId;
  const game = db.games.find(g => g.id === param || g.slug === param);
  if (!game) {
    return res.status(404).json({ error: 'App/Game not found' });
  }
  res.json(game);
});

// Track game download count & register click event
app.post('/api/games/:id/download', (req, res) => {
  const game = db.games.find(g => g.id === req.params.id || g.slug === req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'App not found' });
  }

  // Determine destination based on downloadType
  let destination = '';
  const dType = game.downloadType || (game.googlePlayUrl ? 'GOOGLE_PLAY' : 'DIRECT_DOWNLOAD');

  if (dType === 'GOOGLE_PLAY') {
    destination = game.googlePlayUrl || game.externalStoreUrl || game.downloadUrl;
  } else if (dType === 'OFFICIAL_WEBSITE') {
    destination = game.officialWebsiteUrl || game.officialWebsite || game.downloadUrl;
  } else if (dType === 'DIRECT_DOWNLOAD') {
    destination = game.directDownloadUrl || game.downloadUrl;
  } else {
    destination = game.googlePlayUrl || game.downloadUrl || game.externalStoreUrl || game.officialWebsiteUrl || game.directDownloadUrl;
  }

  if (!destination) {
    return res.status(400).json({ error: 'Store link or download destination currently unavailable for this app.' });
  }

  game.downloadCount = (game.downloadCount || 0) + 1;
  game.clickCount = (game.clickCount || 0) + 1;
  const today = new Date().toISOString().split('T')[0];
  db.downloadStats[today] = (db.downloadStats[today] || 0) + 1;
  saveDatabase();

  res.json({
    success: true,
    downloadCount: game.downloadCount,
    clickCount: game.clickCount,
    downloadUrl: destination,
    downloadType: dType
  });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  const categories = db.categories.map(c => {
    const count = db.games.filter(g => g.category.toLowerCase() === c.name.toLowerCase() && g.status === 'published').length;
    return { ...c, gameCount: count };
  });
  res.json(categories);
});

// Get site settings
app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

// Post contact message
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Query',
    message,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    read: false
  };
  db.contactMessages.unshift(newMessage);
  saveDatabase();
  res.json({ success: true, message: 'Your message has been sent successfully! Our team will respond shortly.' });
});

// Auth middleware for Admin
const authenticateAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Session expired' });
  }
};

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ role: 'admin', user: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, token, user: { username: 'admin', role: 'Super Admin' } });
  }
  res.status(401).json({ error: 'Invalid username or password' });
});

// ADMIN PROTECTED ROUTES

// Admin Analytics
app.get('/api/admin/analytics', authenticateAdmin, (req, res) => {
  const totalDownloads = db.games.reduce((acc, g) => acc + g.downloadCount, 0);
  const publishedGames = db.games.filter(g => g.status === 'published').length;
  const draftGames = db.games.filter(g => g.status === 'draft').length;
  const featuredGames = db.games.filter(g => g.isFeatured).length;

  const topGames = [...db.games]
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 5)
    .map(g => ({ name: g.name, downloads: g.downloadCount, logo: g.logo }));

  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const recentDownloads = dates.map(date => ({
    date,
    count: db.downloadStats[date] || 0
  }));

  res.json({
    totalGames: db.games.length,
    publishedGames,
    draftGames,
    featuredGames,
    totalDownloads,
    totalCategories: db.categories.length,
    totalMessages: db.contactMessages.length,
    recentDownloads,
    topGames
  });
});

// Admin Get All Games (Drafts & Published)
app.get('/api/admin/games', authenticateAdmin, (req, res) => {
  res.json(db.games);
});

// Helper for Google Play URL validation
const isValidGooglePlayUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.includes('play.google.com/store/apps/') ||
    trimmed.includes('play.google.com/store/apps/details') ||
    (trimmed.startsWith('https://play.google.com/') || trimmed.startsWith('http://play.google.com/'))
  );
};

// Admin Add Game
app.post('/api/admin/games', authenticateAdmin, (req, res) => {
  const gameData = req.body;
  const name = gameData.name || 'New App';
  const slug = gameData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const downloadType = gameData.downloadType || (gameData.googlePlayUrl ? 'GOOGLE_PLAY' : 'DIRECT_DOWNLOAD');
  const googlePlayUrl = (gameData.googlePlayUrl || gameData.externalStoreUrl || '').trim();
  const officialWebsiteUrl = (gameData.officialWebsiteUrl || gameData.officialWebsite || '').trim();
  const directDownloadUrl = (gameData.directDownloadUrl || gameData.downloadUrl || '').trim();

  // Validate Google Play URL if type is GOOGLE_PLAY or if googlePlayUrl was entered
  if (downloadType === 'GOOGLE_PLAY' && googlePlayUrl) {
    if (!isValidGooglePlayUrl(googlePlayUrl)) {
      return res.status(400).json({ error: 'Please enter a valid Google Play Store URL (e.g. https://play.google.com/store/apps/details?id=...)' });
    }
  }

  const effectiveDownloadUrl =
    downloadType === 'GOOGLE_PLAY'
      ? googlePlayUrl
      : downloadType === 'OFFICIAL_WEBSITE'
      ? officialWebsiteUrl
      : directDownloadUrl || googlePlayUrl || officialWebsiteUrl;

  const newGame: Game = {
    id: `game-${Date.now()}`,
    ranking: Number(gameData.ranking) || db.games.length + 1,
    name,
    slug,
    logo: (gameData.logo && gameData.logo.trim()) ? gameData.logo.trim() : 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop&q=80',
    poster: gameData.poster || '',
    banner: gameData.banner || '',
    screenshots: gameData.screenshots || [],
    shortDescription: gameData.shortDescription || gameData.description || 'Verified mobile application.',
    description: gameData.description || 'Verified mobile application.',
    category: gameData.category || 'Rummy',
    bonus: Number(gameData.bonus) || 50,
    bonusLabel: gameData.bonusLabel || `₹${gameData.bonus || 50} Cash Bonus`,
    minWithdrawal: Number(gameData.minWithdrawal) || 100,
    rating: Number(gameData.rating) || 4.8,
    version: gameData.version || 'v1.0.0',
    apkSize: gameData.apkSize || '35 MB',
    packageName: gameData.packageName || `com.jaiho.${slug}`,
    developerName: gameData.developerName || 'ALL JAIHO COMPANY',
    downloadCount: Number(gameData.downloadCount) || 0,
    clickCount: Number(gameData.clickCount) || 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    downloadType,
    googlePlayUrl,
    officialWebsiteUrl,
    directDownloadUrl,
    downloadUrl: effectiveDownloadUrl,
    externalStoreUrl: googlePlayUrl,
    telegramGroup: gameData.telegramGroup || db.settings.telegramLink,
    officialWebsite: officialWebsiteUrl,
    isFeatured: !!gameData.isFeatured,
    isTrending: !!gameData.isTrending,
    isNew: true,
    status: (gameData.status as AppStatus) || 'published',
    features: gameData.features || ['100% Verified APK', 'High Speed Payouts'],
    withdrawalRules: gameData.withdrawalRules || ['Min withdrawal ₹100'],
    registrationGuide: gameData.registrationGuide || ['Install app and login with OTP']
  };

  db.games.unshift(newGame);
  saveDatabase();
  res.json({ success: true, game: newGame });
});

// Admin Update Game
app.put('/api/admin/games/:id', authenticateAdmin, (req, res) => {
  const index = db.games.findIndex(g => g.id === req.params.id || g.slug === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const existing = db.games[index];
  const body = req.body;
  const name = body.name || existing.name;
  const slug = body.slug || existing.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const downloadType = body.downloadType || existing.downloadType || 'GOOGLE_PLAY';
  const googlePlayUrl = body.googlePlayUrl !== undefined ? body.googlePlayUrl.trim() : existing.googlePlayUrl || '';
  const officialWebsiteUrl = body.officialWebsiteUrl !== undefined ? body.officialWebsiteUrl.trim() : existing.officialWebsiteUrl || '';
  const directDownloadUrl = body.directDownloadUrl !== undefined ? body.directDownloadUrl.trim() : existing.directDownloadUrl || '';

  if (downloadType === 'GOOGLE_PLAY' && googlePlayUrl) {
    if (!isValidGooglePlayUrl(googlePlayUrl)) {
      return res.status(400).json({ error: 'Please enter a valid Google Play Store URL (e.g. https://play.google.com/store/apps/details?id=...)' });
    }
  }

  const effectiveDownloadUrl =
    downloadType === 'GOOGLE_PLAY'
      ? googlePlayUrl || body.downloadUrl || existing.downloadUrl
      : downloadType === 'OFFICIAL_WEBSITE'
      ? officialWebsiteUrl || body.downloadUrl || existing.downloadUrl
      : directDownloadUrl || body.downloadUrl || existing.downloadUrl;

  const updatedLogo = (body.logo !== undefined && body.logo !== '') ? body.logo : existing.logo;

  db.games[index] = {
    ...existing,
    ...body,
    id: existing.id,
    name,
    slug,
    logo: updatedLogo,
    downloadType,
    googlePlayUrl,
    officialWebsiteUrl,
    directDownloadUrl,
    downloadUrl: effectiveDownloadUrl,
    externalStoreUrl: googlePlayUrl || existing.externalStoreUrl,
    officialWebsite: officialWebsiteUrl || existing.officialWebsite,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  saveDatabase();
  res.json({ success: true, game: db.games[index] });
});

// Admin Delete Game
app.delete('/api/admin/games/:id', authenticateAdmin, (req, res) => {
  const targetId = req.params.id;
  const decodedTargetId = decodeURIComponent(targetId);
  const initialLen = db.games.length;
  db.games = db.games.filter(g => 
    String(g.id) !== String(targetId) && 
    String(g.id) !== decodedTargetId &&
    String(g.slug) !== String(targetId) &&
    String(g.slug) !== decodedTargetId
  );
  if (db.games.length === initialLen) {
    return res.status(404).json({ error: 'App record not found' });
  }
  saveDatabase();
  res.json({ success: true, remaining: db.games.length });
});

// Admin Update Settings
app.put('/api/admin/settings', authenticateAdmin, (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDatabase();
  res.json({ success: true, settings: db.settings });
});

// Admin Add Category
app.post('/api/admin/categories', authenticateAdmin, (req, res) => {
  const { name, icon, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name required' });
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    icon: icon || 'Gamepad2',
    description: description || 'Gaming category'
  };
  db.categories.push(newCat);
  saveDatabase();
  res.json({ success: true, category: newCat });
});

// Admin Edit Category
app.put('/api/admin/categories/:id', authenticateAdmin, (req, res) => {
  const index = db.categories.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  const { name, icon, description } = req.body;
  db.categories[index] = {
    ...db.categories[index],
    name: name || db.categories[index].name,
    slug: name ? name.toLowerCase().replace(/\s+/g, '-') : db.categories[index].slug,
    icon: icon || db.categories[index].icon,
    description: description || db.categories[index].description
  };
  saveDatabase();
  res.json({ success: true, category: db.categories[index] });
});

// Admin Delete Category
app.delete('/api/admin/categories/:id', authenticateAdmin, (req, res) => {
  const targetId = req.params.id;
  const decodedTargetId = decodeURIComponent(targetId);
  const initialLen = db.categories.length;
  db.categories = db.categories.filter(c => 
    String(c.id) !== String(targetId) && 
    String(c.id) !== decodedTargetId &&
    String(c.slug) !== String(targetId) &&
    String(c.slug) !== decodedTargetId
  );
  if (db.categories.length === initialLen) {
    return res.status(404).json({ error: 'Category not found' });
  }
  saveDatabase();
  res.json({ success: true, remaining: db.categories.length });
});

// Admin Get Media Items
app.get('/api/admin/media', authenticateAdmin, (req, res) => {
  res.json(db.mediaItems || []);
});

// Admin Upload Media Item
app.post('/api/admin/upload', authenticateAdmin, (req, res) => {
  try {
    const { name, type, url, base64Data } = req.body;
    let finalUrl = url;

    if (base64Data) {
      const filename = `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.png`;
      const filePath = path.join(UPLOADS_DIR, filename);
      const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'));
      finalUrl = `/uploads/${filename}`;
    }

    if (!finalUrl) {
      return res.status(400).json({ error: 'Image URL or base64 file data is required' });
    }

    const newMedia: MediaItem = {
      id: `media-${Date.now()}`,
      name: name || 'Uploaded Asset',
      url: finalUrl,
      type: type || 'logo',
      size: '250 KB',
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    db.mediaItems = db.mediaItems || [];
    db.mediaItems.unshift(newMedia);
    saveDatabase();

    res.json({ success: true, media: newMedia });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload media file' });
  }
});

// Admin Delete Media Item
app.delete('/api/admin/media/:id', authenticateAdmin, (req, res) => {
  const targetId = req.params.id;
  const decodedTargetId = decodeURIComponent(targetId);
  const initialLen = (db.mediaItems || []).length;
  db.mediaItems = (db.mediaItems || []).filter(m => 
    String(m.id) !== String(targetId) &&
    String(m.id) !== decodedTargetId
  );
  if (db.mediaItems.length === initialLen) {
    return res.status(404).json({ error: 'Media item not found' });
  }
  saveDatabase();
  res.json({ success: true, remaining: db.mediaItems.length });
});

// Admin Get Contact Messages
app.get('/api/admin/messages', authenticateAdmin, (req, res) => {
  res.json(db.contactMessages || []);
});

// Admin Mark Message Read
app.put('/api/admin/messages/:id/read', authenticateAdmin, (req, res) => {
  const msg = (db.contactMessages || []).find(m => String(m.id) === String(req.params.id));
  if (msg) {
    msg.read = true;
    saveDatabase();
  }
  res.json({ success: true });
});

// Admin Delete Contact Message
app.delete('/api/admin/messages/:id', authenticateAdmin, (req, res) => {
  const targetId = req.params.id;
  const decodedTargetId = decodeURIComponent(targetId);
  const initialLen = (db.contactMessages || []).length;
  db.contactMessages = (db.contactMessages || []).filter(m => 
    String(m.id) !== String(targetId) &&
    String(m.id) !== decodedTargetId
  );
  if (db.contactMessages.length === initialLen) {
    return res.status(404).json({ error: 'Message not found' });
  }
  saveDatabase();
  res.json({ success: true, remaining: db.contactMessages.length });
});

// Admin Reset Database Seed
app.post('/api/admin/seed-reset', authenticateAdmin, (req, res) => {
  db.games = initialGames;
  db.categories = initialCategories;
  db.settings = initialSettings;
  saveDatabase();
  res.json({ success: true, message: 'Database reset to default seeds.' });
});

// VITE MIDDLEWARE SETUP FOR DEV / STATIC SERVING FOR PRODUCTION
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 ALL JAIHO COMPANY Server running on http://localhost:${PORT}`);
  });
}

startServer();


