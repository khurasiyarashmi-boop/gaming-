import React from 'react';
import { AlertTriangle, Clock, ShieldAlert, HeartHandshake, CheckCircle } from 'lucide-react';

export const ResponsibleGamingSection: React.FC = () => {
  return (
    <section className="my-8 bg-amber-50/80 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col md:flex-row items-start gap-5">
        <div className="p-3 bg-amber-500 text-white rounded-2xl shrink-0 shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-black text-amber-950">
              Responsible Gaming & Self-Control Guidelines
            </h2>
            <span className="bg-amber-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full uppercase">
              18+ Strict Policy
            </span>
          </div>

          <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
            Real cash gaming should always be viewed as entertainment, not a source of income or financial solution. We encourage all players to adhere strictly to responsible gaming practices.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="bg-white border border-amber-200 rounded-xl p-3 text-xs space-y-1">
              <span className="font-extrabold text-amber-900 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Set Time Limits
              </span>
              <p className="text-amber-800 text-[11px] font-medium">Never play for extended continuous hours without taking regular breaks.</p>
            </div>

            <div className="bg-white border border-amber-200 rounded-xl p-3 text-xs space-y-1">
              <span className="font-extrabold text-amber-900 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Budget Money
              </span>
              <p className="text-amber-800 text-[11px] font-medium">Only spend surplus funds that you can comfortably afford to lose.</p>
            </div>

            <div className="bg-white border border-amber-200 rounded-xl p-3 text-xs space-y-1">
              <span className="font-extrabold text-amber-900 flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
                No Loss Chasing
              </span>
              <p className="text-amber-800 text-[11px] font-medium">Never increase stakes to recover previous losses. Accept outcomes calmly.</p>
            </div>

            <div className="bg-white border border-amber-200 rounded-xl p-3 text-xs space-y-1">
              <span className="font-extrabold text-amber-900 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                18+ Age Restriction
              </span>
              <p className="text-amber-800 text-[11px] font-medium">Strictly prohibited for minors under 18 years of age.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
