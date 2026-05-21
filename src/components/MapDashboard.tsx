import React, { useState, useEffect } from 'react';
import { JunctionNode, LogEntry, SystemMetrics } from '../types';
import { Radio, AlertTriangle, Layers, Video, Zap, Activity, Info, Camera, Compass } from 'lucide-react';

interface MapDashboardProps {
  junctions: JunctionNode[];
  setJunctions: React.Dispatch<React.SetStateAction<JunctionNode[]>>;
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  metrics: SystemMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<SystemMetrics>>;
  searchQuery: string;
  onFocusNode: (nodeId: string) => void;
  aiEngineActive: boolean;
}

export default function MapDashboard({
  junctions,
  setJunctions,
  logs,
  setLogs,
  metrics,
  setMetrics,
  searchQuery,
  onFocusNode,
  aiEngineActive
}: MapDashboardProps) {
  // Map interactive overlays
  const [showCctvLayer, setShowCctvLayer] = useState(true);
  const [showAiPriorityLayer, setShowAiPriorityLayer] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  // Selected node tooltip focus
  const [selectedNodeId, setSelectedNodeId] = useState<string>('JUNCTION_NODE_07');
  const [showCctvModal, setShowCctvModal] = useState<string | null>(null);

  // Filter junctions based on search query
  const filteredJunctions = junctions.filter(
    (j) =>
      j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If search query exactly matches a node, make it selected
  useEffect(() => {
    if (searchQuery) {
      const match = junctions.find(
        (j) =>
          j.id.toLowerCase() === searchQuery.toLowerCase() ||
          j.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        setSelectedNodeId(match.id);
      }
    }
  }, [searchQuery, junctions]);

  const activeNode = junctions.find((j) => j.id === selectedNodeId) || junctions[4]; // Default to Node 07

  // Tick the countdown timers fluids local-only, backed by server polls
  useEffect(() => {
    const interval = setInterval(() => {
      setJunctions((prevJunctions) =>
        prevJunctions.map((j) => {
          return {
            ...j,
            lights: j.lights.map((l) => {
              return { ...l, timeLeft: Math.max(0, l.timeLeft - 1) };
            })
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [setJunctions]);

  const handleManualLightTrigger = async (nodeId: string) => {
    try {
      const res = await fetch(`/api/junctions/${nodeId}/toggle-light`, {
        method: 'POST'
      });
      if (res.ok) {
        // Optimistically trigger state poll
        const stateRes = await fetch('/api/state');
        if (stateRes.ok) {
          const data = await stateRes.json();
          setJunctions(data.junctions);
          setLogs(data.logs);
        }
      }
    } catch (e) {
      console.error('[LIGHT CHANGER ERROR] Failed to signal backend:', e);
    }
  };

  const activeCctvNode = junctions.find((j) => j.id === showCctvModal);

  return (
    <div className="h-full relative flex">
      {/* MAP OVERLAY HUD SYSTEM */}
      <div className="flex-1 relative h-full">
        
        {/* Technical Coordinate Overlay */}
        <div className="absolute top-8 left-8 z-10 pointer-events-none flex flex-col gap-2 font-mono">
          <div className="glass-panel border-l-2 border-l-primary-fixed-dim px-4 py-2 text-xs text-primary-fixed-dim flex items-center gap-3">
            <span className="heartbeat text-emerald-400">●</span>
            <span>SYSTEM UPTIME: {metrics.systemUptime}</span>
          </div>
          <div className="glass-panel px-4 py-2 text-xs text-on-surface-variant/80 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Compass className="w-3.5 h-3.5 text-primary-fixed-dim" />
              <span>GEOLOCATION STATUS // SATELLITE_LOCK: ACTIVE</span>
            </div>
            <div className="text-on-surface mt-1">
              <span>LAT: {activeNode.lat.toFixed(4)}° N</span>
              <br />
              <span>LONG: {Math.abs(activeNode.long).toFixed(4)}° W</span>
            </div>
          </div>
        </div>

        {/* Dynamic Map Canvas Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#070a0f]">
          {/* Neon grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: 'radial-gradient(#00dbe7 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          <div className="absolute inset-0 scanline pointer-events-none opacity-20" />

          {/* Map Vector Grid */}
          <svg className="absolute inset-0 w-full h-full p-20" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            
            {/* Roads Base layout lines */}
            <g opacity="0.95">
              {/* Row Roads */}
              <line x1="100" y1="100" x2="900" y2="100" stroke="#101824" strokeWidth="24" strokeLinecap="round" />
              <line x1="100" y1="300" x2="900" y2="300" stroke="#101824" strokeWidth="24" strokeLinecap="round" />
              <line x1="100" y1="500" x2="900" y2="500" stroke="#101824" strokeWidth="24" strokeLinecap="round" />
              
              {/* Column Roads */}
              <line x1="200" y1="50" x2="200" y2="550" stroke="#101824" strokeWidth="24" strokeLinecap="round" />
              <line x1="500" y1="50" x2="500" y2="550" stroke="#101824" strokeWidth="24" strokeLinecap="round" />
              <line x1="800" y1="50" x2="800" y2="550" stroke="#101824" strokeWidth="24" strokeLinecap="round" />

              {/* Lane dashed separator lines */}
              <line x1="110" y1="100" x2="890" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="6,8" />
              <line x1="110" y1="300" x2="890" y2="300" stroke="#1e293b" strokeWidth="1" strokeDasharray="6,8" />
              <line x1="110" y1="500" x2="890" y2="500" stroke="#1e293b" strokeWidth="1" strokeDasharray="6,8" />
              
              <line x1="200" y1="60" x2="200" y2="540" stroke="#1e293b" strokeWidth="1" strokeDasharray="6,8" />
              <line x1="500" y1="60" x2="500" y2="540" stroke="#1e293b" strokeWidth="1" strokeDasharray="6,8" />
              <line x1="800" y1="60" x2="800" y2="540" stroke="#1e293b" strokeWidth="1" strokeDasharray="6,8" />
            </g>

            {/* Heat congestion glows */}
            <g className="map-glow" opacity={showHeatmap ? "0.95" : "0.5"}>
              {/* Row 1 glows */}
              <path d="M100,100 L400,100" stroke={showHeatmap ? "#f43f5e" : "#22c55e"} strokeWidth="5" strokeLinecap="round" />
              <path d="M400,100 L600,100" stroke="#eab308" strokeWidth="5" />
              <path d="M600,100 L900,100" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />

              {/* Column 2 glows (the busy Lex corridor) */}
              <path d="M500,50 L500,250" stroke="#ef4444" strokeWidth="5" />
              <path d="M500,250 L500,550" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />

              {/* Road glows around busy junctions */}
              <circle cx="800" cy="100" r="45" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,4" fill="none" className="animate-spin opacity-45" style={{ transformOrigin: '800px 100px', animationDuration: '24s' }} />
              <circle cx="500" cy="300" r="45" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" fill="none" className="animate-spin opacity-45" style={{ transformOrigin: '500px 300px', animationDuration: '18s' }} />
            </g>

            {/* Intelligent Vehicle Dots */}
            <g>
              {/* Vehicles on Row 1 (Broadway -> East) */}
              <circle r="4.5" fill="#00dbe7" className="heartbeat">
                <animateMotion path="M100,100 L900,100" dur="9s" repeatCount="indefinite" />
              </circle>
              {/* Slow congested vehicles near Node 03 (y=100, x=800) */}
              <circle r="4" fill="#fc1a1a">
                <animateMotion path="M760,100 L840,100" dur="20s" repeatCount="indefinite" />
              </circle>
              <circle r="4" fill="#fc1a1a">
                <animateMotion path="M780,100 L820,100" dur="14s" repeatCount="indefinite" />
              </circle>

              <circle r="4.5" fill="#00dbe7" className="heartbeat">
                <animateMotion path="M900,300 L100,300" dur="14s" repeatCount="indefinite" />
              </circle>
              
              <circle r="4.5" fill="#38bdf8">
                <animateMotion path="M500,50 L500,550" dur="7s" repeatCount="indefinite" />
              </circle>
              
              <circle r="4.5" fill="#38bdf8">
                <animateMotion path="M800,550 L800,50" dur="11s" repeatCount="indefinite" />
              </circle>

              <circle r="4" fill="#e2f1ec" className="heartbeat">
                <animateMotion path="M200,520 L200,80" dur="16s" repeatCount="indefinite" />
              </circle>

              {/* Fast vehicle on Bottom road (y=500) */}
              <circle r="5" fill="#10b981">
                <animateMotion path="M100,500 L900,500" dur="5s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Junction Nodes Markers */}
            <g>
              {filteredJunctions.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const statusColor =
                  node.status === 'critical'
                    ? '#ef4444'
                    : node.status === 'dense'
                    ? '#f59e0b'
                    : '#10b981';

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    {/* Ring Outer pulse if selected */}
                    {isSelected && (
                      <circle
                        cx={node.coords.x}
                        cy={node.coords.y}
                        r="24"
                        stroke="#00dbe7"
                        strokeWidth="1.5"
                        className="animate-ping opacity-35"
                      />
                    )}

                    {/* AI Ring priority indicator */}
                    {showAiPriorityLayer && aiEngineActive && (
                      <circle
                        cx={node.coords.x}
                        cy={node.coords.y}
                        r="18"
                        stroke="#00dbe7"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                        className="animate-spin opacity-50"
                        style={{ transformOrigin: `${node.coords.x}px ${node.coords.y}px`, animationDuration: '6s' }}
                      />
                    )}

                    {/* Node Core anchor */}
                    <circle
                      cx={node.coords.x}
                      cy={node.coords.y}
                      r="10"
                      fill="#070f16"
                      stroke={statusColor}
                      strokeWidth="3.5"
                      className="transition-all duration-300 hover:scale-125"
                    />

                    {/* Mini light state pill indicator at the corners */}
                    <circle
                      cx={node.coords.x - 14}
                      cy={node.coords.y - 14}
                      r="4.5"
                      fill={node.lights[0].state === 'green' ? '#10b981' : node.lights[0].state === 'yellow' ? '#f59e0b' : '#ef4444'}
                    />
                    <circle
                      cx={node.coords.x + 14}
                      cy={node.coords.y + 14}
                      r="4.5"
                      fill={node.lights[1].state === 'green' ? '#10b981' : node.lights[1].state === 'yellow' ? '#f59e0b' : '#ef4444'}
                    />

                    {/* CCTV indicators */}
                    {showCctvLayer && node.hasCctv && (
                      <foreignObject
                        x={node.coords.x - 7}
                        y={node.coords.y - 30}
                        width="14"
                        height="14"
                      >
                        <div className="bg-surface-dim border border-primary-fixed-dim/40 rounded p-0.5 text-primary-fixed-dim hover:text-white opacity-85 hover:scale-110 transition-all flex items-center justify-center">
                          <Camera className="w-2.5 h-2.5" />
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Interactive Floating Action Tooltip pointing to the active node */}
          <div
            style={{
              position: 'absolute',
              top: `${(activeNode.coords.y / 600) * 100}%`,
              left: `${(activeNode.coords.x / 1000) * 100}%`,
              transform: 'translate(-50%, -125%)'
            }}
            className="z-10 glass-panel bloom-border p-3 rounded-lg min-w-[210px] transform transition-all duration-300 select-none shadow-[0_4px_24px_rgba(0,219,231,0.15)] pointer-events-auto"
          >
            <div className="flex flex-col gap-1 text-left">
              <div className="flex justify-between items-center gap-4">
                <span className="font-mono font-bold text-[10px] text-primary-fixed-dim tracking-wider uppercase">
                  {activeNode.id}
                </span>
                <span
                  className={`px-1.5 py-0.5 font-sans font-extrabold text-[9px] rounded uppercase ${
                    activeNode.status === 'critical'
                      ? 'bg-red-500/10 text-red-400'
                      : activeNode.status === 'dense'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {activeNode.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-on-surface truncate pr-2 mt-0.5">
                {activeNode.name}
              </p>

              <div className="h-[1px] w-full bg-outline-variant/30 my-1" />

              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] text-on-surface font-medium">
                  FLOW RATE: {activeNode.flowRate}%
                </span>
                <span
                  className={`flex items-center text-xs ${
                    activeNode.flowRate >= 80 ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  {activeNode.flowRate >= 80 ? 'HIGH' : 'STABLE'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>WAIT TIME: {activeNode.waitTime}s</span>
                <span className="text-[10px] font-mono select-all">
                  LAT: {activeNode.lat.toFixed(2)}
                </span>
              </div>

              {/* Action buttons inside tooltip */}
              <div className="flex items-center gap-2 mt-2 pt-1 border-t border-outline-variant/20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualLightTrigger(activeNode.id);
                  }}
                  className="flex-1 bg-primary-fixed-dim/10 hover:bg-primary-fixed-dim/20 border border-primary-fixed-dim/20 hover:border-primary-fixed-dim/50 text-[10px] font-bold text-primary-fixed-dim py-1 px-1.5 rounded transition-all active:scale-95"
                >
                  Switch Light State
                </button>
                {activeNode.hasCctv && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCctvModal(activeNode.id);
                    }}
                    className="bg-surface-variant hover:bg-surface-bright border border-outline-variant/30 text-on-surface hover:text-primary-fixed-dim p-1 rounded transition-all"
                    title="Open CCTV Camera Stream"
                  >
                    <Video className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Tooltip Pointer */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0d151c] rotate-45 border-r border-b border-primary-fixed-dim/2d"></div>
          </div>
        </div>

        {/* Floating Action Map Control Center at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`glass-panel bloom-border px-4 py-2.5 rounded-md flex items-center gap-2 hover:bg-surface-variant/50 transition-all font-semibold uppercase text-[10px] tracking-wider text-left border ${
              showHeatmap ? 'bg-primary-fixed-dim/15 border-primary-fixed-dim text-white' : 'border-outline-variant/20 text-on-surface-variant'
            }`}
          >
            <Layers className="w-4 h-4 text-primary-fixed-dim" />
            <span>Map Congestion Heat</span>
          </button>

          <button
            onClick={() => setShowCctvLayer(!showCctvLayer)}
            className={`glass-panel bloom-border px-4 py-2.5 rounded-md flex items-center gap-2 hover:bg-surface-variant/50 transition-all font-semibold uppercase text-[10px] tracking-wider text-left border ${
              showCctvLayer ? 'bg-primary-fixed-dim/15 border-primary-fixed-dim text-white' : 'border-outline-variant/20 text-on-surface-variant'
            }`}
          >
            <Video className="w-4 h-4 text-primary-fixed-dim" />
            <span>CCTV camera Nodes</span>
          </button>

          <button
            onClick={() => setShowAiPriorityLayer(!showAiPriorityLayer)}
            className={`glass-panel bloom-border px-4 py-2.5 rounded-md flex items-center gap-2 hover:bg-surface-variant/50 transition-all font-semibold uppercase text-[10px] tracking-wider text-left border ${
              showAiPriorityLayer ? 'bg-primary-fixed-dim/15 border-primary-fixed-dim text-white' : 'border-outline-variant/20 text-on-surface-variant'
            }`}
          >
            <Zap className="w-4 h-4 text-primary-fixed-dim" />
            <span>AI priority rings</span>
          </button>
        </div>
      </div>

      {/* RIGHT TELEMETRY BAR: LIVE STATE DETAILS & LOG FEED */}
      <div className="w-80 flex flex-col gap-6 p-8 border-l border-outline-variant/20 bg-surface-container-lowest/40 backdrop-blur-md overflow-y-auto scrollbar-hide shrink-0">
        
        {/* Live Network Stats Box */}
        <div className="glass-panel bloom-border p-5 rounded-lg select-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-[10px] font-bold text-primary-fixed-dim uppercase tracking-wider">
              Live Network Statistics
            </h3>
            <Radio className="w-4 h-4 text-primary-fixed-dim heartbeat" />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider">
                Total Vehicles Tracked
              </span>
              <span className="text-2xl font-bold font-mono text-primary mt-0.5">
                {metrics.totalVehicles.toLocaleString()}
              </span>
              <div className="w-full h-1 bg-surface-variant/30 mt-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary-fixed-dim h-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(20, (metrics.totalVehicles / 60000) * 100))}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider">
                Avg. Corridor Flow Speed
              </span>
              <span className="text-2xl font-bold font-mono text-primary mt-0.5">
                {metrics.avgFlowSpeed}{' '}
                <span className="text-xs font-sans text-on-surface-variant/50">km/h</span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider">
                Active Constricted Bottlenecks
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-red-400">
                  {metrics.activeBottlenecks}
                </span>
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Ticker Feed */}
        <div className="glass-panel rounded-lg overflow-hidden flex flex-col flex-1 min-h-[350px]">
          <div className="p-4 bg-surface-variant/20 border-b border-outline-variant/10 flex items-center justify-between">
            <h3 className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-wider">
              Real-Time Event Feed
            </h3>
            <div className="flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim/35" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim/35" />
            </div>
          </div>

          <div className="p-4 space-y-3.5 overflow-y-auto scrollbar-hide flex-1 font-sans text-left">
            {logs.map((log) => {
              const borderStyle =
                log.category === 'INCIDENT'
                  ? 'border-red-500/40'
                  : log.category === 'OPTIMIZER'
                  ? 'border-primary-fixed-dim/40'
                  : 'border-on-surface-variant/25';
                  
              const labelColor =
                log.category === 'INCIDENT'
                  ? 'text-red-400'
                  : log.category === 'OPTIMIZER'
                  ? 'text-primary-fixed-dim'
                  : 'text-on-surface-variant/80';

              return (
                <div
                  key={log.id}
                  className={`border-l-2 ${borderStyle} pl-3 py-0.5 transition-all hover:bg-surface-bright/20 rounded-r cursor-help`}
                  onClick={() => {
                    // Quick highlight trick
                    if (log.message.includes('Junction_07')) onFocusNode('JUNCTION_NODE_07');
                    if (log.message.includes('Broadway')) onFocusNode('JUNCTION_NODE_01');
                  }}
                  title="Click to locate on Map"
                >
                  <p className="font-mono font-bold text-[9px] uppercase tracking-wider flex justify-between">
                    <span className={labelColor}>
                      {log.timestamp} - {log.category}
                    </span>
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-normal">
                    {log.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CCTV Camera Modal Simulation overlay */}
      {showCctvModal && activeCctvNode && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-lg overflow-hidden border border-primary-fixed-dim shadow-[0_0_50px_rgba(0,219,231,0.25)] flex flex-col">
            <div className="p-4 bg-surface-variant/40 border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-red-500 heartbeat" />
                <span className="font-bold uppercase text-[11px] text-primary-fixed-dim">
                  CCTV_STREAM_FEED::{activeCctvNode.id}
                </span>
              </div>
              <button
                onClick={() => setShowCctvModal(null)}
                className="text-xs font-mono text-on-surface-variant/60 hover:text-white bg-surface rounded px-2 py-0.5 transition-all"
              >
                DISCONNECT
              </button>
            </div>
            {/* Beautiful Animated Simulated Camera Output screen block */}
            <div className="bg-black aspect-video relative overflow-hidden flex items-center justify-center p-4 select-none">
              <div className="absolute top-4 left-4 text-[10px] font-mono text-emerald-400 font-bold bg-black/60 px-1.5 py-0.5 rounded flex items-center gap-1.5">
                <span>REC</span>
                <span className="heartbeat">●</span>
                <span>UTC {new Date().toISOString().replace('T', ' ').slice(0, 19)}</span>
              </div>

              {/* Dynamic Overlay HUD inside camera */}
              <div className="absolute inset-0 border border-emerald-500/20 pointer-events-none" />
              <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-emerald-500/10 pointer-events-none" />
              <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-emerald-500/10 pointer-events-none" />

              {/* Vector Simulated Busy Traffic Node */}
              <svg className="w-48 h-32 opacity-35" viewBox="0 0 200 120" fill="none" opacity="0.45">
                <path d="M20,60 L180,60 M100,10 L100,110" stroke="#00ffdf" strokeWidth="6" strokeDasharray="3,3" />
                {/* Simulated Cars in CCTV */}
                <rect x="70" y="56" width="10" height="6" fill="#ef4444" className="animate-pulse" />
                <rect x="120" y="58" width="8" height="5" fill="#f59e0b" />
                <rect x="97" y="30" width="6" height="12" fill="#10b981" />
              </svg>

              <div className="text-center z-10">
                <p className="text-sm font-semibold tracking-wider text-primary">
                  {activeCctvNode.name}
                </p>
                <p className="text-xs text-on-surface-variant/80 mt-1">
                  CORRIDOR SPEED: {Math.floor(metrics.avgFlowSpeed * 0.9 + Math.random() * 8)} km/h
                </p>
              </div>

              {/* Scanline camera overlay details */}
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-on-surface-variant bg-black/60 px-1 rounded">
                ZOOM: 2.5X // FLIR_IR: OFF
              </div>
            </div>
            <div className="p-4 bg-surface-container flex items-center justify-between">
              <div className="text-[10px] text-on-surface-variant font-mono">
                AI DETECTING: 42 VEHICLES // SENSOR_OK
              </div>
              <button
                onClick={() => {
                  handleManualLightTrigger(activeCctvNode.id);
                  setShowCctvModal(null);
                }}
                className="bg-primary-fixed-dim hover:bg-primary-fixed text-primary text-[11px] font-bold py-1 px-3 rounded shadow transition-all uppercase"
              >
                FORCE GREEN MODE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
