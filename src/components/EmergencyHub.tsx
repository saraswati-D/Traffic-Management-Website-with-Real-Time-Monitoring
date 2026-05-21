import React, { useState } from 'react';
import { JunctionNode, EmergencyDispatch, LogEntry } from '../types';
import { ShieldAlert, Send, Flame, Truck, Eye, CheckCircle2, Siren, Star } from 'lucide-react';

interface EmergencyHubProps {
  junctions: JunctionNode[];
  setJunctions: React.Dispatch<React.SetStateAction<JunctionNode[]>>;
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

export default function EmergencyHub({ junctions, setJunctions, logs, setLogs }: EmergencyHubProps) {
  const [dispatches, setDispatches] = useState<EmergencyDispatch[]>([
    {
      id: 'DISP-704',
      type: 'ambulance',
      source: 'Mercy Hospital East',
      destination: 'Lexington & 34th St (Junction_07)',
      eta: '2m 14s',
      status: 'en-route',
      priorityLevel: 'CRITICAL'
    },
    {
      id: 'DISP-612',
      type: 'fire',
      source: 'Station 14 Midtown',
      destination: 'Madison & 14th Ave (Junction_03)',
      eta: 'Completed',
      status: 'completed',
      priorityLevel: 'HIGH'
    }
  ]);

  // Form states for dispatching a new route
  const [dispatchType, setDispatchType] = useState<'ambulance' | 'fire' | 'police'>('ambulance');
  const [targetJunctionId, setTargetJunctionId] = useState<string>('JUNCTION_NODE_07');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  const [routeActiveNode, setRouteActiveNode] = useState<string | null>(null);

  const activeCorridors = junctions.filter((j) => j.isEmergencyCorridor);

  const handleDispatchNewVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const targeted = junctions.find((j) => j.id === targetJunctionId);
    if (!targeted) return;

    // Create dispatch item
    const newDispatch: EmergencyDispatch = {
      id: `DISP-${Math.floor(Math.random() * 900) + 100}`,
      type: dispatchType,
      source: dispatchType === 'ambulance' ? 'St. Jude Medical' : dispatchType === 'fire' ? 'Midtown Fire District 2' : 'Metropolitan Police Precinct 4',
      destination: `${targeted.name} (${targeted.id})`,
      eta: '3m 45s',
      status: 'en-route',
      priorityLevel: priority
    };

    setDispatches([newDispatch, ...dispatches]);

    // Prepare updated Node
    const updatedNode = {
      ...targeted,
      isEmergencyCorridor: true,
      status: 'normal' as const,
      flowRate: 98,
      waitTime: 0,
      lights: targeted.lights.map((l) => {
        return {
          ...l,
          state: l.direction === 'N-S' ? ('green' as const) : ('red' as const),
          timeLeft: 90, // green corridor held for 90 seconds
          autoCycle: false
        };
      })
    };

    // Client optimistic update
    setJunctions((prev) =>
      prev.map((j) => (j.id === targetJunctionId ? updatedNode : j))
    );

    // Prepare log trace
    const logNote = {
      category: 'INCIDENT',
      message: `Emergency wave dispatched for ${newDispatch.type.toUpperCase()} [ID: ${newDispatch.id}]. Clearing corridor Node ${targetJunctionId}.`
    };

    try {
      await fetch(`/api/junctions/${targetJunctionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNode)
      });

      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logNote)
      });
    } catch (err) {
      console.error('[EMERGENCY HUB ERROR] Failed to dispatcher emergency node wave:', err);
    }

    // Show quick feedback banner
    setRouteActiveNode(targetJunctionId);
    setTimeout(() => {
      setRouteActiveNode(null);
    }, 4000);
  };

  const handleClearCorridor = async (junctionId: string) => {
    const node = junctions.find((j) => j.id === junctionId);
    if (!node) return;

    const updatedNode = {
      ...node,
      isEmergencyCorridor: false,
      lights: node.lights.map((l) => ({ ...l, autoCycle: true, timeLeft: 15 }))
    };

    // Client optimistic update
    setJunctions((prev) =>
      prev.map((j) => (j.id === junctionId ? updatedNode : j))
    );

    const logNote = {
      category: 'SYSTEM',
      message: `Emergency wave corridor deactivated. Returning Node ${junctionId} to standard AI scheduling.`
    };

    try {
      await fetch(`/api/junctions/${junctionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNode)
      });

      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logNote)
      });
    } catch (err) {
      console.error('[EMERGENCY HUB ERROR] Failed to release emergency node corridor:', err);
    }
  };

  return (
    <div className="p-8 h-full bg-surface-container-lowest/20 overflow-y-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-primary-fixed-dim">
            EMERGENCY DECK HUB
          </h2>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Dispatch preemptive sirens, clear visual pathways, and align priority traffic lanes for response teams.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: New Dispatch form */}
        <div className="glass-panel bloom-border p-6 rounded-lg text-left border border-outline-variant/20">
          <h3 className="font-mono text-xs font-bold text-primary-fixed-dim uppercase tracking-wider mb-4 flex items-center gap-2">
            <Siren className="w-4 h-4 text-red-400 animate-bounce" />
            Initialize Emergency corridor
          </h3>

          {routeActiveNode && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-200 text-xs p-3 rounded mb-4 font-semibold">
              SIRENS ECHOING: CORRIDOR HELD FOR GREEN WAVE FLUIDITY!
            </div>
          )}

          <form onSubmit={handleDispatchNewVehicle} className="space-y-4 text-xs font-semibold">
            {/* Vehicle selection */}
            <div>
              <label className="block text-on-surface-variant/80 uppercase tracking-wide text-[10px] mb-1.5 font-mono">
                Responder Unit Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'ambulance', label: 'Ambulance' },
                  { value: 'fire', label: 'Fire Service' },
                  { value: 'police', label: 'Police intercept' }
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setDispatchType(t.value as any)}
                    className={`p-2.5 rounded border text-center transition-all cursor-pointer font-bold ${
                      dispatchType === t.value
                        ? 'border-primary-fixed-dim bg-primary-fixed-dim/20 text-white'
                        : 'border-outline-variant/20 hover:border-outline-variant/50 text-on-surface-variant'
                    }`}
                  >
                    <span className="block mt-0.5 text-[11px] capitalize">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target nodes selection */}
            <div>
              <label className="block text-on-surface-variant/80 uppercase tracking-wide text-[10px] mb-1.5 font-mono">
                Target Node Sector
              </label>
              <select
                value={targetJunctionId}
                onChange={(e) => setTargetJunctionId(e.target.value)}
                className="w-full bg-surface-bright/70 border border-outline-variant/20 text-on-surface px-3 py-2 rounded focus:ring-1 focus:ring-primary-fixed-dim outline-none text-xs font-medium"
              >
                {junctions.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.id} - {j.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Threat Weight Priority */}
            <div>
              <label className="block text-on-surface-variant/80 uppercase tracking-wide text-[10px] mb-1.5 font-mono">
                Preemption Priority Code
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['CRITICAL', 'HIGH', 'MEDIUM'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level as any)}
                    className={`p-2 rounded border font-mono text-[10px] uppercase font-bold text-center select-none cursor-pointer ${
                      priority === level
                        ? level === 'CRITICAL'
                          ? 'border-red-500 bg-red-500/10 text-red-300'
                          : 'border-amber-400 bg-amber-400/10 text-amber-200'
                        : 'border-outline-variant/20 hover:border-outline-variant/50 text-on-surface-variant'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-bold uppercase tracking-wider transition-all select-none cursor-pointer flex items-center justify-center gap-2 text-xs shadow-[0_4px_16px_rgba(239,68,68,0.25)]"
            >
              <Send className="w-4 h-4" />
              Force corridor & Dispatch Sirens
            </button>
          </form>
        </div>

        {/* Center/Right columns: dispatches list */}
        <div className="lg:col-span-2 space-y-6 flex flex-col text-left">
          
          {/* Active wave corridors stats */}
          <div className="glass-panel p-5 rounded-lg border border-outline-variant/15 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider block">
                Active Green-Wave Corridors
              </span>
              <p className="text-sm font-semibold text-on-surface mt-1">
                {activeCorridors.length === 0
                  ? 'All junctions currently on normal coordinated scheduling.'
                  : `${activeCorridors.length} sectors preempted for emergency vehicle flow.`}
              </p>
            </div>

            <div className="flex gap-2">
              {activeCorridors.map((ac) => (
                <div
                  key={ac.id}
                  className="flex items-center gap-2 bg-red-500/15 border border-red-500/40 px-3 py-1.5 rounded-md font-mono text-xs text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                >
                  <Siren className="w-3.5 h-3.5 animate-spin" />
                  <span>{ac.id}</span>
                  <button
                    onClick={() => handleClearCorridor(ac.id)}
                    className="hover:text-white bg-red-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded ml-2"
                  >
                    DISMISS
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Table index */}
          <div className="glass-panel rounded-lg overflow-hidden border border-outline-variant/20 flex-1 flex flex-col">
            <div className="p-4 bg-surface-variant/20 border-b border-outline-variant/15 font-mono text-xs font-bold text-on-surface uppercase tracking-wider">
              En-Route Dispatch Registry
            </div>

            <div className="divide-y divide-outline-variant/10 overflow-y-auto max-h-[350px] scrollbar-hide flex-1">
              {dispatches.map((disp) => {
                const isCritical = disp.priorityLevel === 'CRITICAL';
                return (
                  <div key={disp.id} className="p-4 flex items-center justify-between gap-4 font-sans hover:bg-surface-variant/10 transition-all">
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-full ${isCritical ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        <Truck className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-primary-fixed-dim">
                            {disp.id}
                          </span>
                          <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1 rounded ${
                            isCritical ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {disp.priorityLevel}
                          </span>
                          <span className="text-xs text-on-surface-variant/80 font-medium capitalize">
                            ({disp.type})
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-on-surface mt-1 truncate max-w-sm">
                          Source : {disp.source}
                        </p>
                        <p className="text-xs text-on-surface-variant/75 mt-0.5 truncate max-w-sm">
                          Destination : {disp.destination}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-on-surface-variant/50 font-mono font-medium">ETA WINDOW</p>
                      <p className="text-sm font-black text-primary font-mono">{disp.eta}</p>
                      
                      <span className={`inline-block mt-1 font-mono text-[9px] uppercase font-bold py-0.5 px-1.5 rounded ${
                        disp.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400 heartbeat'
                      }`}>
                        {disp.status}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
