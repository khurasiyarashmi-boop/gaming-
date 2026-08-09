import React, { useState } from 'react';
import {
  X,
  Info,
  Mail,
  ShieldAlert,
  FileText,
  HelpCircle,
  Send,
  Phone,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Flag,
  Globe,
  Award
} from 'lucide-react';

interface PagesModalProps {
  view: string | null;
  onClose: () => void;
  telegramLink: string;
  contactEmail: string;
  contactPhone: string;
  whatsappLink: string;
  siteName?: string;
}

export const PagesModal: React.FC<PagesModalProps> = ({
  view,
  onClose,
  telegramLink,
  contactEmail,
  contactPhone,
  whatsappLink,
  siteName
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Query',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!view || view === 'home') return null;

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'General Query', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl relative border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
              G
            </div>
            <h2 className="font-extrabold text-base sm:text-lg">
              {view === 'about' && 'About GameHub APK'}
              {view === 'contact' && 'Contact Us & Support'}
              {view === 'disclaimer' && 'Platform Disclaimer'}
              {view === 'privacy' && 'Privacy Policy'}
              {view === 'terms' && 'Terms & Conditions'}
              {view === 'responsible-gaming' && 'Responsible Gaming Policy'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm leading-relaxed font-medium">
          {/* ABOUT US PAGE */}
          {view === 'about' && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5">
                <h3 className="text-base font-black text-blue-950 mb-2">Welcome to GameHub APK</h3>
                <p className="text-blue-900">
                  GameHub APK is India's leading independent gaming directory and verified APK distribution platform. We specialize in curating top real cash gaming apps, including Rummy, Teen Patti, Aviator, Slots, Fantasy Sports, and Casino apps.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-slate-50">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-blue-600" />
                    Our Mission
                  </h4>
                  <p className="text-slate-600 text-xs">
                    To provide 100% verified, virus-free, high-speed APK download links and accurate bonus information to gamers across India.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-slate-50">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Our Vision
                  </h4>
                  <p className="text-slate-600 text-xs">
                    To build India's most trusted skill gaming community with transparent reviews and instant payment proof sharing.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                  Why 10 Million+ Players Choose {siteName || 'ALL JAIHO COMPANY'}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    100% Virus & Malware Free APKs
                  </li>
                  <li className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Daily Updated Sign-up Bonuses
                  </li>
                  <li className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Fast CDN Cloud Mirrors
                  </li>
                  <li className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Dedicated 24x7 Telegram Support
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* CONTACT US PAGE */}
          {view === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                  <Mail className="w-5 h-5 text-blue-600 mx-auto" />
                  <span className="text-[10px] uppercase font-bold text-slate-400">Email Support</span>
                  <p className="font-bold text-xs text-slate-900 truncate">{contactEmail}</p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                  <Phone className="w-5 h-5 text-emerald-600 mx-auto" />
                  <span className="text-[10px] uppercase font-bold text-slate-400">Phone Helpline</span>
                  <p className="font-bold text-xs text-slate-900">{contactPhone}</p>
                </div>

                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-sky-50 border border-sky-200 hover:bg-sky-100 rounded-2xl text-center space-y-1 transition-colors block"
                >
                  <Send className="w-5 h-5 text-sky-600 mx-auto" />
                  <span className="text-[10px] uppercase font-bold text-sky-700">Official Telegram</span>
                  <p className="font-bold text-xs text-sky-900">Join Community</p>
                </a>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmitContact} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                  Send Us A Message
                </h3>

                {submitted && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Thank you! Your message has been received. We will respond via email shortly.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Game listing query"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your feedback, questions or game removal requests here..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          )}

          {/* DISCLAIMER PAGE */}
          {view === 'disclaimer' && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-900 space-y-2">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Independent Directory Notice
                </h3>
                <p className="text-xs leading-relaxed">
                  GameHub APK is an independent informational and promotional directory for mobile applications. We do NOT host or own any proprietary game servers, nor do we directly process real money deposits or gambling transactions.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <h4 className="font-extrabold text-slate-900 text-sm">Financial Risk & Skill Gaming</h4>
                <p>
                  Real money gaming carries inherent financial risks. Outcomes in skill games depend on player knowledge and practice. Players are strongly urged to play responsibly within personal financial limits.
                </p>

                <h4 className="font-extrabold text-slate-900 text-sm">State & Geographic Restrictions</h4>
                <p>
                  Online real cash gaming is strictly prohibited for residents of Assam, Odisha, Telangana, Nagaland, Sikkim, and Andhra Pradesh in accordance with local state legislation.
                </p>

                <h4 className="font-extrabold text-slate-900 text-sm">Copyright & Trademark Disclaimer</h4>
                <p>
                  All game logos, brand names, and trademarks belong exclusively to their respective developers and copyright owners.
                </p>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY PAGE */}
          {view === 'privacy' && (
            <div className="space-y-4 text-xs text-slate-700">
              <h3 className="font-extrabold text-slate-900 text-sm">Privacy & Data Security Policy</h3>
              <p>
                At GameHub APK, accessible from gamehubapk.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by GameHub APK and how we use it.
              </p>

              <h4 className="font-extrabold text-slate-900">Information We Collect</h4>
              <p>
                When you visit our website, we may collect anonymous aggregate analytical usage metrics (such as page visits, download counts, and device screen sizes) to optimize download speeds. We do NOT store personal banking details or passwords.
              </p>

              <h4 className="font-extrabold text-slate-900">Cookies and Web Beacons</h4>
              <p>
                Like any other website, GameHub APK uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited.
              </p>
            </div>
          )}

          {/* TERMS & CONDITIONS PAGE */}
          {view === 'terms' && (
            <div className="space-y-4 text-xs text-slate-700">
              <h3 className="font-extrabold text-slate-900 text-sm">Terms and Conditions</h3>
              <p>
                By accessing this website, you accept these terms and conditions in full. Do not continue to use GameHub APK if you do not accept all of the terms and conditions stated on this page.
              </p>

              <h4 className="font-extrabold text-slate-900">User Eligibility (18+)</h4>
              <p>
                You must be at least 18 years of age to access or download gaming applications listed on this directory.
              </p>

              <h4 className="font-extrabold text-slate-900">Application Usage Rights</h4>
              <p>
                Users are solely responsible for ensuring compliance with local laws and regulations prior to downloading any APK files.
              </p>
            </div>
          )}

          {/* RESPONSIBLE GAMING PAGE */}
          {view === 'responsible-gaming' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 space-y-2">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  Responsible Gaming Commitment
                </h3>
                <p className="text-xs">
                  Gaming should remain an enjoyable pastime. Always maintain control over your time and budget.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <h4 className="font-extrabold text-slate-900 text-sm">Top 5 Rules for Safe Gaming</h4>
                <ol className="list-decimal pl-5 space-y-1 font-medium">
                  <li>Treat gaming as entertainment, not as a primary job.</li>
                  <li>Set strict daily time and spending limits before launching an app.</li>
                  <li>Never play under emotional stress or financial strain.</li>
                  <li>Never borrow money or take loans to participate in cash games.</li>
                  <li>Take mandatory breaks every 45 minutes.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
