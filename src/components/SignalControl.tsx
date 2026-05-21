import React, { useEffect, useState } from 'react';
import { JunctionNode } from '../types';
import { CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, Sliders, ChevronRight } from 'lucide-react';

interface SignalControlProps {
  junctions: JunctionNode[];
  setJunctions: React.Dispatch<React.SetStateAction<JunctionNode[]>>;
}

export default function SignalControl({ junctions, setJunctions }: SignalControlProps) {
  const [selectedJunctionId, setSelectedJunctionId] = useState<string>('JUNCTION_NODE_07');
  const [optimizerCycles, setOptimizerCycles] = useState(0);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);

  const activeJunction = junctions.find((j) => j.id === selectedJunctionId) || junctions[0];

  // Tick the countdown timers in Signal View if active tab
  useEffect(() => {
    // Already tracked globally, but let's make sure things render nicely in this component
  }, []);

  const handleLightChange = async (junctionId: string, direction: 'N-S' | 'E-W', targetState: 'red' | 'yellow' | 'green') => {
    const node = junctions.find((j) => j.id === junctionId);
    if (!node) return;

    const updatedLights = node.lights.map((l) => {
      if (l.direction === direction) {
        return {
          ...l,
          state: targetState,
          timeLeft: targetState === 'yellow' ? 4 : targetState === 'green' ? 24 : 18,
          autoCycle: false
        };
      } else {
        // Automatically switch the complementary direction to prevent crash!
        let complementaryState: 'red' | 'yellow' | 'green' = 'red';
        if (targetState === 'red') complementaryState = 'green';
        else if (targetState === 'green') complementaryState = 'red';
        
        return {
          ...l,
          state: complementaryState,
          timeLeft: complementaryState === 'green' ? 24 : 18,
          autoCycle: false
        };
      }
    });

    const updatedNode = {
      ...node,
      lights: updatedLights,
      status: 'normal' as const,
      waitTime: Math.max(12, Math.floor(node.waitTime * 0.7))
    };

    // Fast client optimistic response
    setJunctions((prev) =>
      prev.map((j) => (j.id === junctionId ? updatedNode : j))
    );

    // Save to server
    try {
      await fetch(`/api/junctions/${junctionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNode)
      });
    } catch (e) {
      console.error('[SIGNAL CONTROL ERROR] Failed to sync node override:', e);
    }
  };

  const resetToAuto = async (junctionId: string) => {
    const node = junctions.find((j) => j.id === junctionId);
    if (!node) return;

    const updatedNode = {
      ...node,
      lights: node.lights.map((l) => ({ ...l, autoCycle: true, timeLeft: 15 })),
      waitTime: Math.floor(Math.random() * 40) + 20
    };

    // Fast client optimistic update
    setJunctions((prev) =>
      prev.map((j) => (j.id === junctionId ? updatedNode : j))
    );

    try {
      await fetch(`/api/junctions/${junctionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNode)
      });
    } catch (e) {
      console.error('[SIGNAL CONTROL ERROR] Failed to reset node to auto:', e);
    }
  };

  const triggerOptimizeAll = async () => {
    setIsAiOptimizing(true);
    
    // Simulate complex optimizer calculations instantly
    setTimeout(async () => {
      const resolvedJunctions = junctions.map((j) => {
        // Reduce queue lengths significantly under AI calibration
        const newN = Math.max(1, Math.floor(j.queueLength.N * 0.4));
        const newS = Math.max(1, Math.floor(j.queueLength.S * 0.4));
        const newE = Math.max(1, Math.floor(j.queueLength.E * 0.4));
        const newW = Math.max(1, Math.floor(j.queueLength.W * 0.4));
        return {
          ...j,
          queueLength: { N: newN, S: newS, E: newE, W: newW },
          waitTime: Math.max(8, Math.floor(j.waitTime * 0.45)),
          status: 'normal' as const
        };
      });

      // Update local state immediately
      setJunctions(resolvedJunctions);
      setOptimizerCycles((c) => c + 1);
      setIsAiOptimizing(false);

      // Save to server
      const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
      const logItem = {
        category: 'OPTIMIZER',
        message: 'Global AI Signal Optimization cycle executed. Recalibrated queue offsets city-wide.'
      };

      try {
        await fetch('/api/junctions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ list: resolvedJunctions })
        });

        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logItem)
        });
      } catch (e) {
        console.error('[SIGNAL CONTROL ERROR] Failed to dispatch global AI optimize:', e);
      }
    }, 1500);
  };

  return (
    <div className="p-8 h-full bg-surface-container-lowest/20 overflow-y-auto">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-outline-variant/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-primary-fixed-dim">
            INTELLIGENT SIGNAL MATRIX
          </h2>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Manual light overrides, signal cycle countdowns, and active lane queue lengths.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={triggerOptimizeAll}
            disabled={isAiOptimizing}
            className={`cursor-pointer bg-primary-fixed-dim/15 hover:bg-primary-fixed-dim text-primary hover:text-black border border-primary-fixed-dim/30 font-mono text-xs font-bold px-4 py-2 rounded flex items-center gap-2 uppercase tracking-wide transition-all ${
              isAiOptimizing ? 'animate-pulse opacity-50 cursor-wait' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isAiOptimizing ? 'animate-spin' : ''}`} />
            {isAiOptimizing ? 'Recalculating Cycles...' : 'Run Global AI Optimization'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left intersection selector table */}
        <div className="lg:col-span-2 glass-panel rounded-lg overflow-hidden flex flex-col border border-outline-variant/20">
          <div className="p-4 bg-surface-variant/20 border-b border-outline-variant/15 flex justify-between items-center">
            <span className="font-mono text-xs font-bold tracking-wider text-on-surface uppercase">
              Monitored Nodes List
            </span>
            <span className="text-[10px] bg-primary-fixed-dim/10 text-primary-fixed-dim font-bold px-2 py-0.5 rounded uppercase">
              {junctions.length} Total Nodes
            </span>
          </div>

          <div className="divide-y divide-outline-variant/10 overflow-y-auto max-h-[550px] scrollbar-hide text-left">
            {junctions.map((node) => {
              const totalQueues = node.queueLength.N + node.queueLength.S + node.queueLength.E + node.queueLength.W;
              const isSelected = node.id === selectedJunctionId;
              const autoActive = node.lights.every((l) => l.autoCycle);

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedJunctionId(node.id)}
                  className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    isSelected ? 'bg-primary-container/10 border-l-2 border-primary-fixed-dim shadow-[inset_0_0_15px_rgba(0,219,231,0.04)]' : 'hover:bg-surface-variant/20'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-primary-fixed-dim truncate">
                        {node.id}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          node.status === 'critical'
                            ? 'bg-red-500 animate-ping'
                            : node.status === 'dense'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                    </div>
                    <p className="text-sm font-semibold text-on-surface truncate mt-1">
                      {node.name}
                    </p>
                  </div>

                  {/* Queues & Light overview indicator */}
                  <div className="flex items-center gap-8 font-mono">
                    <div className="text-right">
                      <p className="text-[10px] text-on-surface-variant/50 uppercase font-semibold">
                        Queued Vehicles
                      </p>
                      <p className="text-xs font-bold font-mono text-on-surface">
                        {totalQueues} cars
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {node.lights.map((l) => {
                        const lightColor =
                          l.state === 'green'
                            ? 'bg-emerald-400'
                            : l.state === 'yellow'
                            ? 'bg-amber-400'
                            : 'bg-red-400';
                        return (
                          <div
                            key={l.direction}
                            className="flex items-center gap-1.5 px-2 py-0.5 bg-surface/80 rounded border border-outline-variant/20"
                            title={`${l.direction} Light`}
                          >
                            <span className={`w-2 h-2 rounded-full ${lightColor}`} />
                            <span className="text-[10px] font-bold text-on-surface-variant">
                              {l.direction} ({l.timeLeft}s)
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="w-16 text-right">
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${
                          autoActive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {autoActive ? 'AI_AUTO' : 'MAN_OVER'}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-on-surface-variant/45" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Single Node Detailed Override controls */}
        <div className="glass-panel bloom-border rounded-lg p-6 flex flex-col border border-outline-variant/20 text-left">
          <div className="border-b border-outline-variant/15 pb-4 mb-4">
            <span className="font-mono text-xs font-semibold text-primary-fixed-dim uppercase tracking-wider block">
              Node Override Deck
            </span>
            <h3 className="text-lg font-bold text-on-surface mt-1">{activeJunction.name}</h3>
            <p className="text-xs text-on-surface-variant/60 font-mono mt-0.5">
              LAT: {activeJunction.lat.toFixed(4)} // LONG: {activeJunction.long.toFixed(4)}
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Lane Queue Meters */}
            <div>
              <p className="text-[10px] font-bold text-on-surface uppercase tracking-wider mb-2 font-mono">
                LANE QUEUES CONGESTION MATRIX
              </p>
              
              <div className="space-y-3 font-mono">
                {[
                  { key: 'N', label: 'Northbound Entry' },
                  { key: 'S', label: 'Southbound Entry' },
                  { key: 'E', label: 'Eastbound Entry' },
                  { key: 'W', label: 'Westbound Entry' }
                ].map((entry) => {
                  const maxQueue = 24;
                  const queueCount = activeJunction.queueLength[entry.key as keyof typeof activeJunction.queueLength];
                  const barPercent = Math.min(100, (queueCount / maxQueue) * 100);
                  const colorClass =
                    queueCount > 12
                      ? 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                      : queueCount > 6
                      ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                      : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]';

                  return (
                    <div key={entry.key} className="text-xs">
                      <div className="flex justify-between items-center text-[11px] mb-1">
                        <span className="text-on-surface-variant/80">{entry.label}</span>
                        <span className="font-bold text-on-surface">{queueCount} waiting</span>
                      </div>
                      <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-outline-variant/10">
                        <div
                          className={`h-full transition-all duration-700 ${colorClass}`}
                          style={{ width: `${barPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Manual Stage Override Switches */}
            <div>
              <p className="text-[10px] font-bold text-on-surface uppercase tracking-wider mb-3 font-mono">
                SIGNAL CONTROLLERS FOR ALL STAGES
              </p>

              {activeJunction.lights.map((l) => {
                const autoActive = l.autoCycle;
                return (
                  <div
                    key={l.direction}
                    className="p-3 bg-surface rounded-md border border-outline-variant/15 mb-3 font-mono"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-primary-fixed-dim uppercase text-[11px]">
                        Corridor {l.direction}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] uppercase font-bold text-on-surface-variant/70">
                          AUTO PREEMPTIVE TIMER:
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            autoActive ? 'text-primary-fixed-dim' : 'text-amber-400'
                          }`}
                        >
                          {autoActive ? 'ACTIVE' : 'OFF'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-1">
                      {/* Lights indicators */}
                      <div className="flex items-center gap-3">
                        {['red', 'yellow', 'green'].map((state) => {
                          const lightBg =
                            state === 'green'
                              ? 'bg-emerald-500'
                              : state === 'yellow'
                              ? 'bg-amber-500'
                              : 'bg-red-500';
                          const isLit = l.state === state;
                          return (
                            <button
                              key={state}
                              onClick={() => handleLightChange(activeJunction.id, l.direction, state as any)}
                              className={`w-6 h-6 rounded-full cursor-pointer transition-all border outline-none ${
                                isLit
                                  ? `${lightBg} border-white scale-110 shadow-[0_0_12px_rgba(0,187,200,0.4)]`
                                  : 'bg-surface border-outline-variant/20 opacity-30 hover:opacity-65'
                              }`}
                              title={`Force ${state.toUpperCase()}`}
                            />
                          );
                        })}
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] text-on-surface-variant/50">STAGE COUNTDOWN</p>
                        <p className="text-base font-bold text-primary">{l.timeLeft}s</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Matrix resets */}
            <div className="pt-2 border-t border-outline-variant/15 flex gap-4">
              <button
                onClick={() => resetToAuto(activeJunction.id)}
                className="flex-1 bg-surface hover:bg-surface-bright border border-primary-fixed-dim/40 hover:border-primary-fixed-dim text-primary-fixed-dim text-xs font-mono font-bold py-2 rounded text-center transition-all cursor-pointer uppercase"
              >
                Reset to AI Auto
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
