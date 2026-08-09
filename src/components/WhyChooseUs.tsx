import React from 'react';
import { ShieldCheck, Zap, Flag, RefreshCw, Smartphone, Award, Lock, Sparkles } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      title: 'Tailored For India',
      desc: 'Native UPI, GPay, PhonePe & Paytm instant withdrawal integration.',
      icon: Flag,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Fast CDN Downloads',
      desc: 'High-speed cloud mirrors ensuring full APK downloads in seconds.',
      icon: Zap,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: '100% Verified APKs',
      desc: 'All APK files pass multi-engine anti-virus and SSL security audits.',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'Trusted Platform',
      desc: 'Over 10 Million satisfied gamers across India trust our directory.',
      icon: Award,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      title: '100% Secure',
      desc: 'No malware, zero intrusive ads, certified Play Protect safe downloads.',
      icon: Lock,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Easy Navigation',
      desc: 'Clean mobile-first layout with instant filters for payouts.',
      icon: Smartphone,
      color: 'text-sky-600 bg-sky-50'
    },
    {
      title: 'Updated Daily',
      desc: 'Fresh game updates, new patch releases, and working gift codes.',
      icon: RefreshCw,
      color: 'text-rose-600 bg-rose-50'
    }
  ];

  return (
    <section className="my-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-200 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why GameHub APK?</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          India's Most Trusted Gaming Directory
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          We curate verified gaming APKs with instant UPI and bank payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reasons.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-300 hover:bg-white transition-all shadow-2xs hover:shadow-md flex items-start gap-3.5"
            >
              <div className={`p-3 rounded-xl shrink-0 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
