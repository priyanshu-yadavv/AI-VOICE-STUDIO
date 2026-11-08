import React from 'react';
import { Menu, Plus, Sparkles, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function Navbar({ onOpenMobileMenu, title, subtitle }) {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#FAF8F5]/80 backdrop-blur-md border-b border-[#E2DDD3] sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-[#68645D] hover:bg-[#F4F1EA] hover:text-[#1F1D1A] md:hidden transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold text-[#1F1D1A] leading-tight">
            {title || 'AI Voice Studio'}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#68645D] hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Phase 1 Studio Status Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#FAF3EC] border border-[#F0DFD1] text-[11px] text-[#A25F35]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C27847] animate-pulse"></span>
          <span className="font-medium">Phase 1 UI Foundation</span>
        </div>

        {/* Quick TTS Button */}
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/text-to-voice')}
        >
          <span className="hidden sm:inline">New Voice Generation</span>
          <span className="sm:hidden">Generate</span>
        </Button>

        {/* User Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#E2DDD3]">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Studio User"
            className="w-8 h-8 rounded-full object-cover border border-[#E2DDD3] shadow-subtle"
          />
        </div>
      </div>
    </header>
  );
}
