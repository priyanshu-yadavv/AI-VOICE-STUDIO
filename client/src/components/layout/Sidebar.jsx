import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  Library,
  PlusCircle,
  Copy,
  History,
  Settings,
  Sparkles,
  X,
  Volume2
} from 'lucide-react';
import { MOCK_STATS } from '../../data/mockStats';
import Badge from '../common/Badge';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/text-to-voice', label: 'Text to Voice', icon: Volume2 },
  { to: '/voice-library', label: 'Voice Library', icon: Library },
  { to: '/add-custom-voice', label: 'Add Custom Voice', icon: PlusCircle },
  { to: '/voice-cloning', label: 'Voice Cloning', icon: Copy, badge: 'Phase 1' },
  { to: '/audio-history', label: 'Audio History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1F1D1A]/30 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#FAF8F5] border-r border-[#E2DDD3] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-float' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#EAE6DE]">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C27847] text-white flex items-center justify-center shadow-sm">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-[#1F1D1A] block">
                  AI VOICE STUDIO
                </span>
                <span className="text-[10px] font-medium tracking-wider text-[#C27847] uppercase block">
                  Studio Edition
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#68645D] hover:bg-[#F4F1EA] md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-[#C27847] shadow-subtle border border-[#E2DDD3]'
                        : 'text-[#68645D] hover:bg-[#F4F1EA] hover:text-[#1F1D1A]'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="accent" size="xs">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Usage Stats Widget */}
        <div className="p-4 border-t border-[#EAE6DE]">
          <div className="bg-white rounded-xl p-3.5 border border-[#E2DDD3] shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#1F1D1A]">Character Quota</span>
              <Badge variant="accent" size="xs">Studio Pro</Badge>
            </div>
            
            <div className="w-full bg-[#F4F1EA] rounded-full h-1.5 overflow-hidden mb-2">
              <div
                className="bg-[#C27847] h-full rounded-full transition-all"
                style={{ width: `${MOCK_STATS.characterQuota.percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#68645D]">
              <span>84.2k / 100k chars</span>
              <span>12d left</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
