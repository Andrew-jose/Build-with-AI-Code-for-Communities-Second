import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../shared/RiskBadge';
import {
  Search,
  Bot,
  Bell,
  Clock,
  Keyboard,
  CheckCircle2,
  User,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    cyclone,
    unacknowledgedAlertsCount,
    setActivePage,
    setIsSearchOpen,
    setIsAnalystOpen,
    setIsShortcutsOpen,
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const utc = now.toUTCString().slice(17, 22) + ' UTC';
      const istHours = (now.getUTCHours() + 5) % 24;
      const istMins = (now.getUTCMinutes() + 30) % 60;
      const ist = `${String(istHours).padStart(2, '0')}:${String(istMins).padStart(2, '0')} IST`;
      setCurrentTime(`${utc} · ${ist}`);
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-[#FFFFFF] border-b border-[#D9DEE5] px-4 flex items-center justify-between gap-3 shrink-0 select-none z-30">
      {/* Left: Cyclone event information */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#17202A] tracking-tight">
                {cyclone?.name || 'CYCLONE VARUNA'}
              </span>
              <RiskBadge level={cyclone?.threatLevel || 'EXTREME'} size="sm" />
            </div>
            <div className="text-[11px] text-[#5E6B78] flex items-center gap-1.5 font-normal">
              <span>{cyclone?.classification || 'Severe Cyclonic Storm'}</span>
              <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
              <span className="text-[#9E2635] font-semibold">14h 32m to projected landfall</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Search */}
      <div className="hidden md:flex items-center gap-2.5">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] text-xs text-[#5E6B78] hover:text-[#17202A] hover:bg-[#FFFFFF] hover:border-[#CBD5E1] transition-colors w-60 justify-between focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#123B5D]"
          aria-label="Search"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-[#7B8794] shrink-0" />
            <span className="text-[#7B8794] truncate">Search assets, sectors, roads...</span>
          </span>
          <kbd className="font-mono text-[10px] bg-[#EAEFF5] px-1 py-0.5 rounded text-[#5E6B78] shrink-0 border border-[#D9DEE5]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Data freshness, System status, User profile */}
      <div className="flex items-center gap-3">
        {/* Data Freshness */}
        <div className="hidden lg:flex flex-col text-right">
          <span className="text-[9px] uppercase tracking-wider text-[#7B8794] font-semibold">DATA UPDATED</span>
          <span className="text-[11px] font-mono font-medium text-[#17202A]">5 min ago</span>
        </div>

        <div className="hidden lg:block h-6 w-px bg-[#D9DEE5]" />

        {/* System Status */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[9px] uppercase tracking-wider text-[#7B8794] font-semibold">SYSTEM</span>
          <span className="text-[11px] font-medium text-[#2E7D5B] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B]" />
            Operational
          </span>
        </div>

        <div className="hidden sm:block h-6 w-px bg-[#D9DEE5]" />

        {/* Dual Clocks */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-[#F0F2F5] border border-[#D9DEE5] text-[11px] font-mono text-[#5E6B78]">
          <Clock className="w-3 h-3 text-[#7B8794]" />
          <span className="tabular-nums">{currentTime || '17:25 UTC · 22:55 IST'}</span>
        </div>

        {/* Incident Alerts */}
        <button
          onClick={() => setActivePage('ALERTS')}
          className="relative p-2 rounded bg-[#FFFFFF] border border-[#D9DEE5] text-[#5E6B78] hover:text-[#17202A] hover:bg-[#F0F2F5] transition-colors"
          title="Active Incident Alerts"
          aria-label="Active Incident Alerts"
        >
          <Bell className="w-4 h-4" />
          {unacknowledgedAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C63C3C] text-white font-mono text-[10px] font-bold flex items-center justify-center">
              {unacknowledgedAlertsCount}
            </span>
          )}
        </button>

        {/* Shortcuts */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="p-2 rounded bg-[#FFFFFF] border border-[#D9DEE5] text-[#5E6B78] hover:text-[#17202A] hover:bg-[#F0F2F5] transition-colors hidden sm:flex"
          title="Keyboard Shortcuts (?)"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Risk Analyst Launcher */}
        <button
          onClick={() => setIsAnalystOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-xs font-medium transition-colors shadow-xs"
          aria-label="Open Risk Analyst"
        >
          <Bot className="w-3.5 h-3.5 text-[#93C5FD]" />
          <span>Risk Analyst</span>
        </button>

        {/* User Profile */}
        <div className="hidden md:flex items-center gap-2 pl-1 border-l border-[#D9DEE5]">
          <div className="w-7 h-7 rounded bg-[#F0F2F5] border border-[#D9DEE5] flex items-center justify-center text-[#5E6B78]">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-[#17202A] leading-tight">Cmdr. V. R. Rao</span>
            <span className="text-[10px] text-[#7B8794]">Ops Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
};
