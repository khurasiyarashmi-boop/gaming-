import React from 'react';
import { Send, ShieldCheck, Mail, Phone, ExternalLink, Heart, Lock } from 'lucide-react';

interface FooterProps {
  siteName: string;
  siteTagline: string;
  telegramLink: string;
  contactEmail: string;
  contactPhone: string;
  onNavigate: (view: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  siteName,
  siteTagline,
  telegramLink,
  contactEmail,
  contactPhone,
  onNavigate,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Top Section: Brand + About */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                {(siteName || 'ALL JAIHO COMPANY').charAt(0).toUpperCase()}
              </div>
              <span className="font-extrabold text-white text-xl tracking-tight">{siteName}</span>
            </div>

            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {siteTagline}
            </p>

            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Join Official Telegram</span>
            </a>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors">
                  Home Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('new-games')} className="hover:text-blue-400 transition-colors">
                  New Games 2026
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('other-games')} className="hover:text-blue-400 transition-colors">
                  Other Real Cash Games
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-blue-400 transition-colors">
                  All Game Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('why-us')} className="hover:text-blue-400 transition-colors">
                  Why Choose Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Information */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition-colors">
                  About GameHub APK
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors">
                  Contact Us & Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('disclaimer')} className="hover:text-blue-400 transition-colors">
                  Disclaimer Notice
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-blue-400 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('responsible-gaming')} className="hover:text-blue-400 transition-colors">
                  Responsible Gaming (18+)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Popular Categories & Contact */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Popular Categories</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">Rummy</span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">Teen Patti</span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">Aviator</span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">Slots</span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">Casino</span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">Fantasy</span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">Color Predict</span>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{contactEmail}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{contactPhone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Text Box */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-500 space-y-1">
          <p className="font-extrabold text-slate-400 uppercase tracking-wider">18+ Strict Age Limit Notice</p>
          <p className="leading-relaxed">
            Real cash gaming involves financial risk and may be addictive. Please play responsibly. Online real money games are restricted for residents of Assam, Odisha, Telangana, Nagaland, Sikkim, and Andhra Pradesh in compliance with regional state laws.
          </p>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <p>© 2026 {siteName}. All Rights Reserved. 100% Verified APK Directory.</p>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin Login</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
