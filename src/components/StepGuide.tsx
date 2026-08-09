import React from 'react';
import { MousePointerClick, Gamepad2, Download, Smartphone, ArrowDown, ChevronRight } from 'lucide-react';

export const StepGuide: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Open Website',
      desc: 'Visit GameHub APK for verified daily updated gaming apps.',
      icon: MousePointerClick,
      color: 'bg-blue-600'
    },
    {
      num: '2',
      title: 'Choose Game',
      desc: 'Browse categories or pick games with low withdrawal limits.',
      icon: Gamepad2,
      color: 'bg-indigo-600'
    },
    {
      num: '3',
      title: 'Tap Download',
      desc: 'Click blue Download button for direct secure high-speed mirror.',
      icon: Download,
      color: 'bg-sky-600'
    },
    {
      num: '4',
      title: 'Install APK',
      desc: 'Allow "Install Unknown Apps" in phone settings & start playing!',
      icon: Smartphone,
      color: 'bg-emerald-600'
    }
  ];

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 my-6 shadow-xs">
      <div className="text-center max-w-xl mx-auto mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          How To Download & Install Gaming APKs
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Follow these 4 quick steps to start playing real cash games in under 2 minutes
        </p>
      </div>

      {/* Visual Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative group">
              <div className="bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${step.color} text-white rounded-xl flex items-center justify-center font-bold shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                    0{step.num}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm mb-1">
                  Step {step.num}: {step.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed flex-1">
                  {step.desc}
                </p>
              </div>

              {/* Mobile Down Arrow / Desktop Right Arrow */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-slate-300">
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
