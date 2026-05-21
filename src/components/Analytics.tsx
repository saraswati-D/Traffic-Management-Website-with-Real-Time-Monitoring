import React, { useState } from 'react';
import { AreaChart, BarChart3, TrendingUp, AlertOctagon, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Analytics() {
  const [activeChart, setActiveChart] = useState<'volume' | 'offset'>('volume');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Time-of-day volumes data (simulated 24 hrs)
  const hourlyData = [
    { hour: '00:00', volume: 1200, speed: 55, wait: 12 },
    { hour: '02:00', volume: 800, speed: 58, wait: 10 },
    { hour: '04:00', volume: 600, speed: 60, wait: 8 },
    { hour: '06:00', volume: 2400, speed: 45, wait: 28 },
    { hour: '08:00', volume: 5500, speed: 28, wait: 98 },
    { hour: '10:00', volume: 4800, speed: 32, wait: 85 },
    { hour: '12:00', volume: 4600, speed: 34, wait: 78 },
    { hour: '14:00', volume: 4200, speed: 38, wait: 62 },
    { hour: '16:00', volume: 5900, speed: 24, wait: 114 },
    { hour: '18:00', volume: 6200, speed: 22, wait: 132 },
    { hour: '20:00', volume: 3800, speed: 40, wait: 45 },
    { hour: '22:00', volume: 2100, speed: 50, wait: 22 }
  ];

  const maxVolume = 7000;
  const maxSpeed = 80;

  return (
    <div className="p-8 h-full bg-surface-container-lowest/20 overflow-y-auto">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/10 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-primary-fixed-dim">
            ANALYTICS & PATTERNS
          </h2>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Historic vehicle volumes, diurnal velocity fluctuations, and AI timing efficiency logs.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveChart('volume')}
            className={`cursor-pointer px-4 py-1.5 rounded text-xs font-bold uppercase transition-all select-none font-mono ${
              activeChart === 'volume' ? 'border border-primary-fixed-dim/30 bg-primary-fixed-dim/15 text-primary' : 'text-on-surface-variant'
            }`}
          >
            Volume Trends
          </button>
          <button
            onClick={() => setActiveChart('offset')}
            className={`cursor-pointer px-4 py-1.5 rounded text-xs font-bold uppercase transition-all select-none font-mono ${
              activeChart === 'offset' ? 'border border-primary-fixed-dim/30 bg-primary-fixed-dim/15 text-primary' : 'text-on-surface-variant'
            }`}
          >
            Flow Speed Indices
          </button>
        </div>
      </div>

      <div className="space-y-6 text-left">
        
        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          
          <div className="glass-panel p-5 rounded-lg border border-outline-variant/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-on-surface-variant/65 uppercase tracking-wide font-semibold">
                TIMING COEFFICIENT DIFFERENCE (AI)
              </span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
                + 34.2% <span className="text-xs font-semibold text-on-surface-variant/70 font-sans">efficiency</span>
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1.5 leading-normal">
                Traffic flow speed coordinates have improved compared to fixed timer cycles.
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-emerald-500/20" />
          </div>

          <div className="glass-panel p-5 rounded-lg border border-outline-variant/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-on-surface-variant/65 uppercase tracking-wide font-semibold">
                ACCIDENT PROBABILITY DECREASE
              </span>
              <p className="text-2xl font-black text-primary-fixed-dim font-mono mt-1">
                - 19.8% <span className="text-xs font-semibold text-on-surface-variant/70 font-sans font-sans">incidents</span>
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1.5 leading-normal">
                Preemptive red-light corridors for speeding vehicles decreased blindspot collisions.
              </p>
            </div>
            <ShieldCheck className="w-10 h-10 text-primary-fixed-dim/20" />
          </div>

          <div className="glass-panel p-5 rounded-lg border border-outline-variant/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-on-surface-variant/65 uppercase tracking-wide font-semibold">
                CHRONIC BOTTLENECKS REPORTED
              </span>
              <p className="text-2xl font-black text-rose-400 font-mono mt-1">
                02 <span className="text-xs font-semibold text-on-surface-variant/70 font-sans">Zone A sectors</span>
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1.5 leading-normal">
                Lexington corridor continues to register density spikes during evening commute zones.
              </p>
            </div>
            <AlertOctagon className="w-10 h-10 text-rose-500/20" />
          </div>

        </div>

        {/* Beautiful high fidelity custom SVG line graph */}
        <div className="glass-panel p-6 rounded-lg border border-outline-variant/20 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary-fixed-dim">
              Diurnal Cycle Analysis Feed
            </h3>
            <span className="text-[10px] text-on-surface-variant font-mono">
              TIME RESOLUTION // 2 HOUR SLICES
            </span>
          </div>

          {/* Interactive Custom SVG Line chart */}
          <div className="relative aspect-[21/9] md:aspect-[25/9] w-full bg-surface-container-lowest/80 border border-outline-variant/10 rounded p-4 overflow-hidden">
            
            {/* Draw Y index lines */}
            <div className="absolute left-10 right-4 top-4 bottom-10 flex flex-col justify-between pointer-events-none select-none text-[10px] font-mono text-on-surface-variant/30">
              <div className="border-t border-dashed border-outline-variant/10 w-full pt-1">
                {activeChart === 'volume' ? '6,000 vehicles' : '75 km/h'}
              </div>
              <div className="border-t border-dashed border-outline-variant/10 w-full pt-1">
                {activeChart === 'volume' ? '4,000 vehicles' : '50 km/h'}
              </div>
              <div className="border-t border-dashed border-outline-variant/10 w-full pt-1">
                {activeChart === 'volume' ? '2,000 vehicles' : '25 km/h'}
              </div>
            </div>

            {/* Main Graph Drawing Canvas */}
            <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00dbe7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00dbe7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid vertical lines */}
              {hourlyData.map((d, index) => {
                const x = 50 + (index * 900) / (hourlyData.length - 1);
                return (
                  <line
                    key={index}
                    x1={x}
                    y1="20"
                    x2={x}
                    y2="245"
                    stroke="#1e293b"
                    strokeWidth="0.8"
                    strokeDasharray="4,4"
                  />
                );
              })}

              {/* Draw Data Wave */}
              {activeChart === 'volume' ? (
                <>
                  {/* Fill area */}
                  <path
                    d={`M50,245 ${hourlyData
                      .map((d, index) => {
                        const x = 50 + (index * 900) / (hourlyData.length - 1);
                        const y = 245 - (d.volume / maxVolume) * 200;
                        return `L${x},${y}`;
                      })
                      .join(' ')} L950,245 Z`}
                    fill="url(#chartGlow)"
                  />
                  {/* Main line stroke */}
                  <path
                    d={hourlyData
                      .map((d, index) => {
                        const x = 50 + (index * 900) / (hourlyData.length - 1);
                        const y = 245 - (d.volume / maxVolume) * 200;
                        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
                      })
                      .join(' ')}
                    stroke="#00dbe7"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                    className="map-glow"
                  />
                </>
              ) : (
                <>
                  {/* Flow Speed index vector */}
                  <path
                    d={hourlyData
                      .map((d, index) => {
                        const x = 50 + (index * 900) / (hourlyData.length - 1);
                        const y = 245 - (d.speed / maxSpeed) * 200;
                        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
                      })
                      .join(' ')}
                    stroke="#a855f7"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* Active hover trackers dots */}
              {hourlyData.map((d, index) => {
                const x = 50 + (index * 900) / (hourlyData.length - 1);
                const y =
                  activeChart === 'volume'
                    ? 245 - (d.volume / maxVolume) * 200
                    : 245 - (d.speed / maxSpeed) * 200;

                return (
                  <g
                    key={index}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r="7.5"
                      fill="#070f16"
                      stroke={activeChart === 'volume' ? '#00dbe7' : '#a855f7'}
                      strokeWidth="2.5"
                    />
                    {hoverIndex === index && (
                      <circle cx={x} cy={y} r="14" stroke="#ffffff" strokeWidth="1" strokeDasharray="2,2" fill="none" />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* X Axis Labels */}
            <div className="absolute bottom-1 left-12 right-2 flex justify-between font-mono text-[9px] text-on-surface-variant/50 border-t border-outline-variant/15 pt-1.5">
              {hourlyData.map((d) => (
                <span key={d.hour}>{d.hour}</span>
              ))}
            </div>

            {/* Tooltip Popup on hovered node */}
            {hoverIndex !== null && (
              <div
                className="absolute bg-surface-dim border border-primary-fixed-dim/40 rounded p-2.5 z-40 text-[10px] font-mono shadow-2xl space-y-0.5"
                style={{
                  left: `${(hoverIndex / (hourlyData.length - 1)) * 82 + 8}%`,
                  top: '15%'
                }}
              >
                <p className="font-bold text-primary-fixed-dim border-b border-outline-variant/10 pb-0.5 uppercase">
                  UTC WINDOW::{hourlyData[hoverIndex].hour}
                </p>
                <p className="text-on-surface">FLOW VOL: {hourlyData[hoverIndex].volume} VEHICLES</p>
                <p className="text-on-surface">AVG VEL: {hourlyData[hoverIndex].speed} KM/H</p>
                <p className="text-rose-400">WAIT TIMER: {hourlyData[hoverIndex].wait} SECONDS</p>
              </div>
            )}
          </div>
          
          <p className="text-[10px] font-mono text-on-surface-variant/60 text-right mt-2 uppercase">
            * Interactive tracker: Hover over circles on line charts to fetch details at specific times.
          </p>
        </div>

      </div>
    </div>
  );
}
