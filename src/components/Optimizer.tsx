import React, { useState } from 'react';
import { OptimizerPolicy, LogEntry } from '../types';
import { INITIAL_POLICIES } from '../data';
import { Cpu, Sliders, ToggleLeft, ToggleRight, Sparkles, Terminal, Play, CircleDot } from 'lucide-react';

interface OptimizerProps {
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

export default function Optimizer({ logs, setLogs }: OptimizerProps) {
  const [policies, setPolicies] = useState<OptimizerPolicy[]>(INITIAL_POLICIES);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('policy_01');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activePolicy = policies.find((p) => p.id === selectedPolicyId) || policies[0];

  const handleWeightChange = (key: keyof OptimizerPolicy['weights'], val: number) => {
    setPolicies((prev) =>
      prev.map((p) => {
        if (p.id === selectedPolicyId) {
          return {
            ...p,
            weights: {
              ...p.weights,
              [key]: val
            }
          };
        }
        return p;
      })
    );
  };

  const handleActivatePolicy = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((p) => ({
        ...p,
        isActive: p.id === policyId
      }))
    );

    // Logs trace entry
    const chosen = policies.find((p) => p.id === policyId);
    if (!chosen) return;
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs((l) => [
      {
        id: String(Date.now()),
        timestamp: time,
        category: 'OPTIMIZER',
        message: `Active AI Traffic Policy switched to '${chosen.name}'. Recalculating signal offsets.`
      },
      ...l
    ]);
  };

  const handleSaveWeights = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);

    // Log trace
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs((l) => [
      {
        id: String(Date.now()),
        timestamp: time,
        category: 'OPTIMIZER',
        message: `Updated neural weight coefficients for policy: ${activePolicy.name}.`
      },
      ...l
    ]);
  };

  const handleTriggerSim = () => {
    setIsSimulating(true);
    setSimLogs(['[SYSTEM] Initializing AI Co-variance matrix training...']);

    const steps = [
      '[-] Loaded 14,290 historical hourly flow coordinate vectors.',
      '[-] Running SGD pipeline on batch size 128 (epochs = 15).',
      '[*] Epoch 01/15 // Train Loss: 0.942 -> Val Loss: 0.956',
      '[*] Epoch 04/15 // Train Loss: 0.612 -> Val Loss: 0.630',
      '[*] Epoch 08/15 // Train Loss: 0.354 -> Val Loss: 0.380',
      '[*] Epoch 12/15 // Train Loss: 0.182 -> Val Loss: 0.201',
      '[+] Epoch 15/15 // Training complete. Gradient convergence achieved.',
      '[SUCCESS] System weights aligned. Predicted congestion delay has been minimized by 18%'
    ];

    steps.forEach((line, index) => {
      setTimeout(() => {
        setSimLogs((prev) => [...prev, line]);
        if (index === steps.length - 1) {
          setIsSimulating(false);
          // Append log
          const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
          setLogs((l) => [
            {
              id: String(Date.now()),
              timestamp: time,
              category: 'OPTIMIZER',
              message: `AI Policy '${activePolicy.name}' calibrated. Average throughput latency down 18%.`
            },
            ...l
          ]);
        }
      }, (index + 1) * 600);
    });
  };

  return (
    <div className="p-8 h-full bg-surface-container-lowest/20 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/10 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-primary-fixed-dim">
            INTELLIGENT OPTIMIZER ENGINE
          </h2>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Update neural weight priorities, simulate signal offset coordination, and toggle learning policies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Policies list selector */}
        <div className="glass-panel p-6 rounded-lg text-left border border-outline-variant/20 flex flex-col gap-4">
          <p className="font-mono text-[10px] font-bold text-primary-fixed-dim uppercase tracking-wider">
            Available Optimizers
          </p>

          <div className="space-y-4">
            {policies.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPolicyId(p.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  p.id === selectedPolicyId
                    ? 'border-primary-fixed-dim bg-primary-container/5'
                    : 'border-outline-variant/20 hover:border-outline-variant/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-on-surface">{p.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivatePolicy(p.id);
                    }}
                    className={`p-1 transition-all ${
                      p.isActive ? 'text-primary-fixed-dim' : 'text-on-surface-variant/40'
                    }`}
                  >
                    {p.isActive ? (
                      <span className="text-xs font-mono font-bold bg-primary-fixed-dim/15 text-primary-fixed-dim py-0.5 px-2 rounded uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold hover:bg-surface-bright py-0.5 px-2 rounded uppercase border border-outline-variant/20">
                        Deploy
                      </span>
                    )}
                  </button>
                </div>
                <p className="text-xs text-on-surface-variant/85 mt-2 leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Center column: Active weights sliders */}
        <div className="glass-panel bloom-border p-6 rounded-lg text-left border border-outline-variant/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/15 pb-2">
              <span className="font-mono text-[10px] font-bold text-primary-fixed-dim uppercase tracking-wider block">
                Coefficients : {activePolicy.name}
              </span>
              <Sliders className="w-4 h-4 text-primary-fixed-dim" />
            </div>

            {saveSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 text-xs p-3 rounded mb-4 font-semibold font-sans">
                Neural policy coefficient weights saved successfully in local memory!
              </div>
            )}

            <div className="space-y-5 font-mono text-[11px] font-bold">
              {[
                { key: 'pedestrianSafety', label: 'Pedestrian Crosswalk Priority weight' },
                { key: 'crossTrafficThru', label: 'Cross-Traffic Thruput throughput weight' },
                { key: 'emergencyPriority', label: 'Sirens & response overrides weight' },
                { key: 'waitingTimeWeight', label: 'Red-Light waiting timeout threshold weight' }
              ].map((item) => {
                const currentVal = activePolicy.weights[item.key as keyof typeof activePolicy.weights];
                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex justify-between text-on-surface-variant">
                      <span className="uppercase text-[9px] tracking-wide font-bold">{item.label}</span>
                      <span className="text-primary-fixed-dim">{currentVal} / 100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentVal}
                      onChange={(e) => handleWeightChange(item.key as any, parseInt(e.target.value))}
                      className="w-full accent-primary-fixed-dim h-1 bg-surface-bright rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSaveWeights}
            className="w-full mt-6 bg-primary-fixed-dim hover:bg-primary-fixed text-black py-2.5 rounded font-black text-xs uppercase tracking-wider transition-all select-none cursor-pointer text-center block"
          >
            Apply & Save Policy Weights
          </button>
        </div>

        {/* Right column: SGD Simulation engine terminal */}
        <div className="glass-panel p-6 rounded-lg text-left border border-outline-variant/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] font-bold text-primary-fixed-dim uppercase tracking-wider block">
                Local Policy Simulator Engine
              </span>
              <Terminal className="w-4 h-4 text-primary-fixed-dim" />
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Run localized simulations on active coefficients to guarantee gradient convergence before pushing scripts to hardware drivers.
            </p>

            {/* Simulated interactive Terminal Output */}
            <div className="bg-black/95 text-emerald-400 p-4 rounded-md font-mono text-[10px] space-y-1 mt-4 overflow-y-auto max-h-[180px] scrollbar-hide text-left border border-outline-variant/15">
              {simLogs.length === 0 ? (
                <span className="text-on-surface-variant/40 block italic">Sim execution idle. Click below to boot training...</span>
              ) : (
                simLogs.map((line, idx) => {
                  let textCol = 'text-emerald-400';
                  if (line.startsWith('[SUCCESS]')) textCol = 'text-primary-fixed-dim font-bold';
                  else if (line.startsWith('[SYSTEM]')) textCol = 'text-white font-bold';
                  return (
                    <p key={idx} className={textCol}>
                      {line}
                    </p>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={handleTriggerSim}
            disabled={isSimulating}
            className={`w-full mt-6 border border-primary-fixed-dim/40 hover:border-primary-fixed-dim text-primary hover:bg-primary-fixed-dim/15 py-2.5 rounded font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 select-none cursor-pointer ${
              isSimulating ? 'opacity-50 animate-pulse cursor-wait' : ''
            }`}
          >
            <Play className="w-4 h-4" />
            {isSimulating ? 'Training Neural Net ...' : 'Execute Policy Simulation'}
          </button>
        </div>

      </div>
    </div>
  );
}
