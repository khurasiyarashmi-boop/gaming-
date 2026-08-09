import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

interface NoticeCardProps {
  title?: string;
  content?: string;
  restrictedStates?: string[];
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  title = 'IMPORTANT LEGAL NOTICE & RESPONSIBLE GAMING WARNING',
  content,
  restrictedStates = ['Assam', 'Odisha', 'Telangana', 'Nagaland', 'Sikkim', 'Andhra Pradesh']
}) => {
  return (
    <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 my-5 shadow-xs relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start gap-3.5">
        <div className="p-2.5 bg-rose-600 text-white rounded-xl shrink-0 shadow-sm mt-0.5">
          <AlertTriangle className="w-6 h-6 animate-bounce" />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-extrabold text-rose-900 text-sm sm:text-base tracking-tight">
              {title}
            </h3>
            <span className="bg-rose-600 text-white font-black text-[11px] px-2 py-0.5 rounded-md uppercase tracking-wider">
              18+ ONLY
            </span>
          </div>

          <p className="text-xs sm:text-sm text-rose-800 leading-relaxed font-medium">
            {content ||
              'Real money gaming involves financial risk and may be addictive. Play responsibly and at your own risk. This platform lists verified APKs for skill-based gaming applications only.'}
          </p>

          {restrictedStates.length > 0 && (
            <div className="pt-1.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-rose-950">
              <span className="text-rose-700 font-bold">Restricted States:</span>
              {restrictedStates.map((state, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-rose-200 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-2xs"
                >
                  {state}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
