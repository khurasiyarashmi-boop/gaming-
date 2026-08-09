import React from 'react';
import {
  X,
  Home,
  Sparkles,
  Gamepad2,
  Info,
  Mail,
  ShieldAlert,
  FileText,
  Lock,
  Send,
  Shield,
  HelpCircle,
  ExternalLink,
  PhoneCall
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
  telegramLink: string;
  siteName?: string;
  onOpenAdmin: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  activeView,
  telegramLink,
  siteName,
  onOpenAdmin
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'new-games', label: 'New Games 2026', icon: Sparkles, badge: 'HOT' },
    { id: 'other-games', label: 'Other Real Cash Games', icon: Gamepad2 },
    { id: 'categories', label: 'All Categories', icon: Gamepad2 },
    { id: 'why-us', label: 'Why Choose Us', icon: Shield },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact & Support', icon: Mail },
    { id: 'disclaimer', label: 'Disclaimer', icon: ShieldAlert },
    { id: 'privacy', label: 'Privacy Policy', icon: FileText },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'responsible-gaming', label: 'Responsible Gaming (18+)', icon: HelpCircle }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl shadow-md text-white">
              {(siteName || 'ALL JAIHO COMPANY').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight text-white">{siteName || 'ALL JAIHO COMPANY'}</h3>
              <p className="text-xs text-blue-300 font-medium">Official Directory</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Promo Banner in Drawer */}
        <div className="m-4 p-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Send className="w-4 h-4 text-sky-200" />
            <span className="font-bold text-xs uppercase tracking-wider">Join Official Telegram</span>
          </div>
          <p className="text-xs text-blue-100 mb-2.5 leading-relaxed">
            Get instant updates on new daily payment proof, working tricks & VIP bonus codes!
          </p>
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 bg-white text-blue-700 hover:bg-blue-50 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            <span>Join 45,000+ Members</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Menu Items */}
        <div className="px-3 py-2 flex-1 space-y-1">
          <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation
          </p>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Admin & Legal Link */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 text-slate-200 hover:bg-slate-900 hover:text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin Control Panel</span>
          </button>
          
          <p className="text-[10px] text-center text-slate-400 leading-tight">
            © 2026 GameHub APK • 100% Verified Skill Gaming Platform
          </p>
        </div>
      </div>
    </div>
  );
};
