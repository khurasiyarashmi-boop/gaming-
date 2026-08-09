import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, jsonb, real } from 'drizzle-orm/pg-core';

// Users table (maps Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoURL: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Games table
export const games = pgTable('games', {
  id: text('id').primaryKey(),
  ranking: integer('ranking').default(0),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  logo: text('logo').notNull(),
  poster: text('poster'),
  banner: text('banner'),
  screenshots: jsonb('screenshots').$type<string[]>().default([]),
  shortDescription: text('short_description'),
  description: text('description').notNull(),
  category: text('category').notNull(),
  bonus: integer('bonus').default(0),
  bonusLabel: text('bonus_label'),
  minWithdrawal: integer('min_withdrawal').default(100),
  rating: real('rating').default(4.5),
  version: text('version').default('v1.0.0'),
  apkSize: text('apk_size').default('35 MB'),
  packageName: text('package_name'),
  developerName: text('developer_name'),
  downloadCount: integer('download_count').default(0),
  clickCount: integer('click_count').default(0),
  lastUpdated: text('last_updated'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
  downloadType: text('download_type').default('GOOGLE_PLAY'),
  downloadUrl: text('download_url').notNull(),
  googlePlayUrl: text('google_play_url'),
  officialWebsiteUrl: text('official_website_url'),
  directDownloadUrl: text('direct_download_url'),
  externalStoreUrl: text('external_store_url'),
  telegramGroup: text('telegram_group'),
  officialWebsite: text('official_website'),
  isFeatured: boolean('is_featured').default(false),
  isTrending: boolean('is_trending').default(false),
  isNew: boolean('is_new').default(false),
  status: text('status').default('published'),
  features: jsonb('features').$type<string[]>().default([]),
  withdrawalRules: jsonb('withdrawal_rules').$type<string[]>().default([]),
  registrationGuide: jsonb('registration_guide').$type<string[]>().default([]),
  faqs: jsonb('faqs').$type<{ question: string; answer: string }[]>().default([]),
  reviews: jsonb('reviews').$type<{ user: string; rating: number; date: string; comment: string }[]>().default([]),
});

// Categories table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  icon: text('icon').notNull(),
  description: text('description').notNull(),
  gameCount: integer('game_count').default(0),
});

// Site Settings table
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  siteName: text('site_name').notNull().default('ALL JAIHO COMPANY'),
  siteTagline: text('site_tagline').default('India\'s #1 Real Cash Gaming Directory'),
  telegramLink: text('telegram_link').default('https://t.me/Soumy_6263'),
  noticeTitle: text('notice_title').default('IMPORTANT LEGAL NOTICE'),
  noticeContent: text('notice_content'),
  restrictedStates: jsonb('restricted_states').$type<string[]>().default([]),
  maintenanceMode: boolean('maintenance_mode').default(false),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  whatsappLink: text('whatsapp_link'),
  heroNotice: text('hero_notice'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Contact Messages table
export const contactMessages = pgTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  date: text('date').notNull(),
  read: boolean('read').default(false),
});

// Google Drive Sync Log / Backups table
export const driveBackups = pgTable('drive_backups', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  fileId: text('file_id').notNull(),
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type').default('application/json'),
  webViewLink: text('web_view_link'),
  size: text('size'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  driveBackups: many(driveBackups),
}));

export const driveBackupsRelations = relations(driveBackups, ({ one }) => ({
  user: one(users, {
    fields: [driveBackups.userId],
    references: [users.id],
  }),
}));
