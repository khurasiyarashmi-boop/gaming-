import React from 'react';
import { Search, Download, Smartphone, UserPlus, PlayCircle, ChevronRight } from 'lucide-react';

export const GettingStartedFlow: React.FC = () => {
  const steps = [
    { step: '1', name: 'Browse', desc: 'Find top games and compare features', icon: Search, color: 'bg-blue-600' },
    { step: '2', name: 'Download', desc: 'Tap Download APK for secure mirror link', icon: Download, color: 'bg-indigo-600' },
    { step: '3', name: 'Install', desc: 'Allow unknown sources & install APK', icon: Smartphone, color: 'bg-sky-600' },
    { step: '4', name: 'Register', desc: 'Enter mobile number & complete OTP login', icon: UserPlus, color: 'bg-emerald-600' },
    { step: '5', name: 'Play & Win', desc: 'Enjoy cash games & withdraw earnings instantly', icon: PlayCircle, color: 'bg-amber-600' }
  ];

  return (
    <section className="my-8 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-700/50">
          Quick Start Guide
        </span>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-white">
          Getting Started in 5 Easy Steps
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
          Start playing real cash games in under 2 minutes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center space-y-2 backdrop-blur-xs hover:bg-white/10 transition-colors flex flex-col justify-between">
              <div>
                <div className={`w-10 h-10 mx-auto ${s.color} text-white rounded-xl flex items-center justify-center font-bold shadow-md mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold text-blue-300 uppercase tracking-wider">Step 0{s.step}</span>
                <h3 className="font-extrabold text-white text-base mt-0.5">{s.name}</h3>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
