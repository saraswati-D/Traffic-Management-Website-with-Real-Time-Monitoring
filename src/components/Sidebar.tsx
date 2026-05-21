import { ScreenTab } from '../types';
import {
  LayoutDashboard,
  Sliders,
  Flame,
  Activity,
  Cpu,
  Terminal,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: ScreenTab;
  setActiveTab: (tab: ScreenTab) => void;
  aiEngineActive: boolean;
  setAiEngineActive: (active: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  aiEngineActive,
  setAiEngineActive
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'signal-control', label: 'Signal Control', icon: Sliders },
    { id: 'emergency-hub', label: 'Emergency Hub', icon: Flame },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'optimizer', label: 'Optimizer', icon: Cpu },
  ] as const;

  const bottomItems = [
    { id: 'systems-logs', label: 'System Logs', icon: Terminal },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ] as const;

  return (
    <nav className="fixed left-0 top-0 h-full z-40 flex flex-col pt-20 pb-8 bg-surface-container-lowest/80 backdrop-blur-2xl border-r border-outline-variant/20 w-[280px]">
      {/* Node Identity Panel */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAiEngineActive(!aiEngineActive)}
            className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all ${
              aiEngineActive
                ? 'bg-primary-fixed-dim heartbeat shadow-[0_0_8px_rgba(0,219,231,0.5)]'
                : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
            }`}
            title="Toggle AI-Engine Status"
          />
          <div>
            <h2 className="font-semibold text-xl tracking-tight text-primary-fixed-dim leading-none">
              NODE_01_OS
            </h2>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant/60 mt-1 font-mono">
              AI-Engine: {aiEngineActive ? 'Active' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Menu tabs */}
      <div className="flex-1 space-y-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded transition-all text-left ${
                isActive
                  ? 'text-primary-fixed-dim font-bold bg-primary-container/10 border-r-2 border-primary-fixed-dim shadow-[inset_0_0_12px_rgba(0,219,231,0.05)]'
                  : 'text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-fixed-dim' : 'text-on-surface-variant/70'}`} />
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-4 my-2 border-t border-outline-variant/10" />

      {/* Bottom status panels/support links */}
      <div className="space-y-1 px-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded transition-all text-left ${
                isActive
                  ? 'text-primary-fixed-dim font-bold bg-primary-container/10 border-r-2 border-primary-fixed-dim'
                  : 'text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-fixed-dim' : 'text-on-surface-variant/70'}`} />
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Version Note */}
      <div className="px-6 mt-8 font-mono text-[10px] text-on-surface-variant/30 text-center">
        VER 4.8.1-AI // PORT_3000
      </div>
    </nav>
  );
}
