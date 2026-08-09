import React from 'react';
import { Send } from 'lucide-react';

interface FloatingTelegramButtonProps {
  telegramLink: string;
}

export const FloatingTelegramButton: React.FC<FloatingTelegramButtonProps> = ({ telegramLink }) => {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <a
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#229ED9] hover:bg-[#1d8cb0] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20"
        aria-label="Join Telegram"
        title="Join Telegram"
      >
        <Send className="w-6 h-6 text-white -translate-x-0.5 translate-y-0.5" />
      </a>
    </div>
  );
};

