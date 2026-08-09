export type AppStatus = 'published' | 'draft' | 'archived';

export interface Game {
  id: string;
  ranking: number;
  name: string;
  slug?: string;
  logo: string;
  poster?: string;
  banner?: string;
  screenshots: string[];
  shortDescription?: string;
  description: string;
  category: string; // e.g. 'Rummy', 'Teen Patti', 'Slots', 'Aviator', etc.
  bonus: number; // e.g. 51, 100, 500
  bonusLabel?: string; // e.g. "₹51 Free Sign Up"
  minWithdrawal: number; // e.g. 100
  rating: number; // e.g. 4.8
  version: string; // e.g. "v2.5.1"
  apkSize: string; // e.g. "45 MB"
  packageName?: string; // e.g. "com.jaiho.rummycircle"
  developerName?: string; // e.g. "Jaiho Games Studio"
  downloadCount: number;
  clickCount?: number;
  lastUpdated: string; // e.g. "2026-08-01"
  createdAt?: string;
  updatedAt?: string;
  downloadType?: 'GOOGLE_PLAY' | 'OFFICIAL_WEBSITE' | 'DIRECT_DOWNLOAD';
  downloadUrl: string;
  googlePlayUrl?: string;
  officialWebsiteUrl?: string;
  directDownloadUrl?: string;
  externalStoreUrl?: string;
  telegramGroup?: string;
  officialWebsite?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  status?: AppStatus;
  features: string[];
  withdrawalRules?: string[];
  registrationGuide?: string[];
  faqs?: { question: string; answer: string }[];
  reviews?: { user: string; rating: number; date: string; comment: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  gameCount?: number;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'logo' | 'poster' | 'banner' | 'screenshot' | 'other';
  size?: string;
  uploadedAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  telegramLink: string;
  noticeTitle: string;
  noticeContent: string;
  restrictedStates: string[];
  maintenanceMode: boolean;
  contactEmail: string;
  contactPhone: string;
  whatsappLink: string;
  heroNotice: string;
  metaTitle: string;
  metaDescription: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AnalyticsData {
  totalGames: number;
  publishedGames: number;
  draftGames: number;
  featuredGames: number;
  totalDownloads: number;
  totalCategories: number;
  totalMessages: number;
  recentDownloads: { date: string; count: number }[];
  topGames: { name: string; downloads: number; logo: string }[];
}

export type SortOption = 'latest' | 'trending' | 'bonus_high' | 'withdrawal_low' | 'alpha' | 'rating';
export type FilterCategory = 'all' | 'new' | 'other' | string;

