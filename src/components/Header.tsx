import React, { useState } from 'react';
import { Search, Bell, Settings, Radio, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onTriggerEmergencyOverride: () => void;
  isOverrideActive: boolean;
  userEmail: string;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  onTriggerEmergencyOverride,
  isOverrideActive,
  userEmail,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Parse user email for display name
  const displayName = userEmail
    ? userEmail.split('@')[0].replace('.', ' ').toUpperCase()
    : 'CHIEF CONTROLLER';

  const mockNotifications = [
    { id: 1, type: 'incident', time: 'Just now', msg: 'Emergency vehicle dispatch to Lexington & 34th St corridor.' },
    { id: 2, type: 'warning', time: '12m ago', msg: 'Madison & 14th Ave flow capacity reached 91% (CRITICAL).' },
    { id: 3, type: 'system', time: '1h ago', msg: 'Neural Net successfully optimized signal offsets.' }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20">
      {/* Brand & Dynamic search */}
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-black tracking-tighter text-primary-fixed-dim select-none">
          TRAFFIC COMMAND AI
        </h1>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-surface-variant/40 rounded px-4 py-1.5 gap-3 border border-outline-variant/10 focus-within:border-primary-fixed-dim/50 focus-within:ring-1 focus-within:ring-primary-fixed-dim/20 transition-all">
          <Search className="w-[18px] h-[18px] text-primary-fixed-dim" />
          <input
            className="bg-transparent border-none outline-none text-sm w-72 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
            placeholder="Search Node, Street (e.g. Broadway, Node_07)..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-on-surface-variant/60 hover:text-on-surface font-mono"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick Action controls */}
      <div className="flex items-center gap-6">
        {/* Emergency Override Button */}
        <button
          onClick={onTriggerEmergencyOverride}
          className={`relative px-4 py-2 border font-mono text-xs font-bold rounded uppercase tracking-wider transition-all cursor-pointer ${
            isOverrideActive
              ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
              : 'border-primary-fixed-dim/40 text-primary-fixed-dim hover:bg-primary-fixed-dim/10 shadow-[0_0_10px_rgba(0,219,231,0.1)]'
          }`}
        >
          <span className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            {isOverrideActive ? 'OVERRIDE ON // SYSTEM MANUAL' : 'Emergency Override'}
          </span>
        </button>

        {/* Notifications & Settings Trigger buttons */}
        <div className="flex items-center gap-4 relative">
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSettings(false);
              }}
              className={`p-1 rounded-full text-on-surface-variant hover:text-primary transition-all cursor-pointer relative ${
                showNotifications ? 'text-primary-fixed-dim bg-surface-bright/30' : ''
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full heartbeat" />
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 glass-panel rounded-lg shadow-2xl p-4 border border-outline-variant/30 text-xs z-50">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2 mb-2 font-mono">
                  <span className="font-bold text-primary-fixed-dim uppercase">Active Alert Matrix</span>
                  <span className="text-[10px] text-on-surface-variant/65">3 Messages</span>
                </div>
                <div className="space-y-3">
                  {mockNotifications.map((notif) => (
                    <div key={notif.id} className="border-l-2 border-primary-fixed-dim/40 pl-2 py-0.5">
                      <div className="flex justify-between text-[10px] text-on-surface-variant mb-0.5">
                        <span className="uppercase font-semibold tracking-wider text-primary-fixed-dim/80">{notif.type}</span>
                        <span>{notif.time}</span>
                      </div>
                      <p className="text-on-surface leading-tight font-medium">{notif.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowNotifications(false);
              }}
              className={`p-1 rounded-full text-on-surface-variant hover:text-primary transition-all cursor-pointer ${
                showSettings ? 'text-primary-fixed-dim bg-surface-bright/30' : ''
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Quick setting dropdown */}
            {showSettings && (
              <div className="absolute right-0 mt-3 w-64 glass-panel rounded-lg shadow-2xl p-4 border border-outline-variant/30 text-xs z-50">
                <p className="font-mono font-bold text-primary-fixed-dim border-b border-outline-variant/20 pb-2 mb-2 uppercase">
                  Telemetry Preferences
                </p>
                <div className="space-y-3 font-medium">
                  <div className="flex items-center justify-between">
                    <span>Haptic Audio Feeds</span>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-fixed-dim" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>CCTV Multi-Streaming</span>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-fixed-dim" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Render Heatmaps</span>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-fixed-dim" />
                    </label>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/10 text-center">
                    <span className="text-[10px] text-on-surface-variant">System: SECURE // CERT-SSL</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Card & Avatar */}
          <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/20 select-none group relative">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-bold text-on-surface tracking-wide group-hover:text-primary-fixed-dim transition-all">
                {displayName}
              </span>
              <span className="text-[10px] font-mono text-on-surface-variant/60 tracking-wider">
                CHIEF OF PROTOCOLS
              </span>
            </div>
            
            <div className="h-8 w-8 rounded-full overflow-hidden border border-primary-fixed-dim/30 ring-1 ring-primary-fixed-dim/10 hover:ring-primary-fixed-dim/40 transition-all cursor-pointer">
              <img
                alt="Chief Controller Profile"
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAMmQugtdc3zmZ7l12ZPVFTCdLPw_Anli60wb1H7SSb03U-SKWWR3HhnPccf5o0evNlKaCVdBg8J46RAbz0FyiDqb_UJy5-abeYmVZdb2mpd_PU0Dm0EbH_S8rJfAyiwI8aSGCeWGmNUH5DPJBXHCyqZzJ984cTjd_CxBDBY1dpNjkBuInC6awH40Qb93t4APT_tx4oCd-WIQ7HSIgAMxVSGesXMwijKeQGB1y_1qfC5EE6FPazDRK8fTcp53u18vtxUiemZAc3g8"
              />
            </div>

            {/* Profile Detail Popover on hover */}
            <div className="absolute right-0 top-10 w-60 glass-panel rounded p-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-[11px] font-mono shadow-xl z-50">
              <p className="font-bold text-primary-fixed-dim mb-1">{displayName}</p>
              <p className="text-[10px] text-on-surface-variant/80 mb-2">{userEmail || 'operator@tc-ai.nodes'}</p>
              <div className="space-y-1 text-on-surface">
                <div className="flex justify-between">
                  <span>Shift Sector:</span>
                  <span className="text-primary-fixed-dim">Nodes 01-09</span>
                </div>
                <div className="flex justify-between">
                  <span>Authorization:</span>
                  <span className="text-emerald-400">Class A (L5)</span>
                </div>
                <div className="flex justify-between">
                  <span>Duty Commenced:</span>
                  <span className="text-on-surface-variant">16:11:48</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
