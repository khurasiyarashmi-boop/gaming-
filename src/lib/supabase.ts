import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ctcxqxttwhhxvhctsqlo.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_c8WCzFfgE65enL4ySXlcnw_f6xETloy';

function getValidUrl(urlCandidate?: string): string {
  if (!urlCandidate || typeof urlCandidate !== 'string') return DEFAULT_SUPABASE_URL;
  const trimmed = urlCandidate.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      new URL(trimmed);
      return trimmed;
    } catch {
      return DEFAULT_SUPABASE_URL;
    }
  }
  return DEFAULT_SUPABASE_URL;
}

function getValidKey(keyCandidate?: string): string {
  if (!keyCandidate || typeof keyCandidate !== 'string') return DEFAULT_SUPABASE_KEY;
  const trimmed = keyCandidate.trim();
  return trimmed || DEFAULT_SUPABASE_KEY;
}

let envUrl: string | undefined;
let envKey: string | undefined;

try {
  if (typeof process !== 'undefined' && process && process.env) {
    envUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    envKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  }
} catch {
  // process not defined
}

try {
  const metaEnv = (import.meta as Record<string, any>).env;
  if (!envUrl && metaEnv) {
    envUrl = metaEnv.VITE_SUPABASE_URL as string;
    envKey = metaEnv.VITE_SUPABASE_ANON_KEY as string;
  }
} catch {
  // import.meta not defined
}

export const supabaseUrl = getValidUrl(envUrl);
export const supabaseKey = getValidKey(envKey);

export const supabase = createClient(supabaseUrl, supabaseKey);

