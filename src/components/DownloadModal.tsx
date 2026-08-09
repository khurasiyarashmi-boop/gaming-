import React, { useState, useEffect } from 'react';
import { Game } from '../types';
import { X, ShieldCheck, Download, Send, CheckCircle2, Copy, Check, ExternalLink, AlertTriangle, Smartphone, Globe } from 'lucide-react';

interface DownloadModalProps {
  game: Game | null;
  onClose: () => void;
  telegramLink: string;
  onCopyLink: (url: string) => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  game,
  onClose,
  telegramLink,
  onCopyLink
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isReady, setIsReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!game) return;
    setCountdown(5);
    setIsReady(false);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [game]);

  if (!game) return null;

  const isGooglePlay = game.downloadType === 'GOOGLE_PLAY';
  const isOfficialWeb = game.downloadType === 'OFFICIAL_WEBSITE';

  const getDestinationUrl = () => {
    if (isGooglePlay) {
      return game.googlePlayUrl || game.downloadUrl || game.externalStoreUrl;
    }
    if (isOfficialWeb) {
      return game.officialWebsiteUrl || game.downloadUrl || game.externalStoreUrl;
    }
    return game.directDownloadUrl || game.downloadUrl || game.externalStoreUrl;
  };

  const handleDownloadNow = () => {
    const destination = getDestinationUrl();
    if (destination) {
      window.open(destination, '_blank');
    } else {
      alert('Download link currently unavailable for this app. Please set a destination URL in the Admin Panel.');
    }
  };

  const handleCopy = () => {
    onCopyLink(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
          <img
            src={game.logo}
            alt={game.name}
            className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{game.name}</h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                Verified APK
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {game.category} • Fast Instant Payout
            </p>
          </div>
        </div>

        {/* Security & Timer Status Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3 mb-5">
          {!isReady ? (
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-black text-xl animate-pulse">
                {countdown}
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Generating Secure Download Mirror...
              </h4>
              <p className="text-xs text-slate-500">
                Verifying SSL signature & virus scan parameters. Please wait...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-emerald-900 text-base">
                  Your High-Speed APK Link is Ready!
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  100% Malware Free • Certified Play Protect Safe
                </p>
              </div>

              {/* Big Download Button */}
              <button
                onClick={handleDownloadNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-xl text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
              >
                {isGooglePlay ? (
                  <>
                    <ExternalLink className="w-5 h-5" />
                    <span>Get on Google Play Store</span>
                  </>
                ) : isOfficialWeb ? (
                  <>
                    <Globe className="w-5 h-5" />
                    <span>Visit Official Website Download</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 animate-bounce" />
                    <span>Start Direct APK Download</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Instant Withdrawal Guarantee Box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Verified App</span>
            <p className="font-extrabold text-emerald-900 text-xs sm:text-sm">
              Supports Instant UPI & Bank Withdrawals (Min ₹{game.minWithdrawal})
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 bg-emerald-200/80 hover:bg-emerald-300 text-emerald-900 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Telegram Promo */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl p-4 mb-5 flex items-center justify-between shadow-xs">
          <div>
            <h5 className="font-extrabold text-xs sm:text-sm">Need Daily Payment Proofs?</h5>
            <p className="text-[11px] text-sky-100">Join our Telegram channel for working game tricks!</p>
          </div>
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-700 hover:bg-sky-50 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Join</span>
          </a>
        </div>

        {/* Dynamic Step-by-Step Installation Instructions */}
        <div className="space-y-2 border-t border-slate-100 pt-4">
          <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-blue-600" />
            {isGooglePlay
              ? 'How to Install via Google Play Store'
              : isOfficialWeb
              ? 'How to Download from Official Website'
              : 'How to Install APK on Android'}
          </h5>

          {isGooglePlay ? (
            <ol className="text-xs text-slate-600 space-y-1.5 pl-4 list-decimal font-medium">
              <li>Tap <strong>"Get on Google Play Store"</strong> button above.</li>
              <li>You will be securely redirected to the official Google Play listing for <strong>{game.name}</strong>.</li>
              <li>Tap <strong>"Install"</strong> on the Play Store page and wait for download to finish.</li>
              <li>Open the app, register with your mobile number, and receive your welcome bonus!</li>
            </ol>
          ) : isOfficialWeb ? (
            <ol className="text-xs text-slate-600 space-y-1.5 pl-4 list-decimal font-medium">
              <li>Tap <strong>"Visit Official Website Download"</strong> button above.</li>
              <li>You will be redirected to the verified official web portal of <strong>{game.name}</strong>.</li>
              <li>Tap the official <strong>"Download APK"</strong> or <strong>"Download App"</strong> button on their website.</li>
              <li>Allow "Install Unknown Apps" in your browser if prompted, then open the downloaded file and tap Install.</li>
            </ol>
          ) : (
            <ol className="text-xs text-slate-600 space-y-1.5 pl-4 list-decimal font-medium">
              <li>Tap <strong>"Start Direct APK Download"</strong> and save the <strong>{game.name}.apk</strong> file.</li>
              <li>Go to Android Settings → Security → Enable <strong>"Install Unknown Apps"</strong>.</li>
              <li>Open your phone's File Manager / Downloads folder and tap the APK file.</li>
              <li>Tap <strong>Install</strong>, open the app, and enter your mobile number for OTP login.</li>
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};
