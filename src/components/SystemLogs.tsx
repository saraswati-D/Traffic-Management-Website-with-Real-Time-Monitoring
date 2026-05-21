import React, { useState } from 'react';
import { LogEntry } from '../types';
import { Terminal, Search, Trash2, Plus, Info } from 'lucide-react';

interface SystemsLogsProps {
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

export default function SystemsLogs({ logs, setLogs }: SystemsLogsProps) {
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [liveLoggingEnabled, setLiveLoggingEnabled] = useState(true);

  // Form states to inject a new system log
  const [newLogMsg, setNewLogMsg] = useState('');
  const [newLogCat, setNewLogCat] = useState<'INCIDENT' | 'OPTIMIZER' | 'SYSTEM' | 'LOG'>('SYSTEM');

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'ALL' || log.category === filter;
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) || log.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleInjectLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogMsg.trim()) return;

    const logItem = {
      category: newLogCat,
      message: newLogMsg
    };

    // Client-side quick optimistic update
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs((prev) => [
      {
        id: String(Date.now()),
        timestamp: time,
        category: newLogCat,
        message: newLogMsg
      },
      ...prev
    ]);
    setNewLogMsg('');

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logItem)
      });
    } catch (err) {
      console.error('[CONSOLE LOG INJECT ERROR] Failed to record on server:', err);
    }
  };

  const handleClearLogs = async () => {
    setLogs([]);
    try {
      await fetch('/api/logs', {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('[CONSOLE LOG FLUSH ERROR] Server buffer clear failed:', err);
    }
  };

  return (
    <div className="p-8 h-full bg-surface-container-lowest/20 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/10 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-primary-fixed-dim">
            CORE OS SYSTEM CONSOLE
          </h2>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Real-time stdout, trigger audits, inject alerts, and filter low-level sensor callbacks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Logs list & interactive search */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-lg text-left border border-outline-variant/20 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-outline-variant/10 pb-4">
            
            {/* Search */}
            <div className="flex items-center bg-surface w-full md:w-64 px-3 py-1.5 rounded border border-outline-variant/15 text-xs">
              <Search className="w-4 h-4 text-primary-fixed-dim mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search console feed..."
                className="bg-transparent border-none outline-none text-on-surface text-xs focus:ring-0 w-full"
              />
            </div>

            {/* Category toggle buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono leading-none">
              {['ALL', 'INCIDENT', 'OPTIMIZER', 'SYSTEM', 'LOG'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`cursor-pointer px-2.5 py-1.5 rounded font-bold uppercase transition-all select-none border ${
                    filter === cat ? 'border-primary-fixed-dim/40 bg-primary-fixed-dim/15 text-primary' : 'border-outline-variant/10 text-on-surface-variant'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Terminal Console Block */}
          <div className="bg-black/95 text-[#e5fbf4] p-5 rounded font-mono text-[11px] leading-relaxed select-text space-y-2 max-h-[420px] overflow-y-auto scrollbar-hide text-left border border-outline-variant/15">
            {filteredLogs.length === 0 ? (
              <p className="text-on-surface-variant/40 italic">Stdout index empty. No logs matched active filters.</p>
            ) : (
              filteredLogs.map((log) => {
                let colClass = 'text-gray-300';
                if (log.category === 'INCIDENT') colClass = 'text-red-400 font-semibold';
                else if (log.category === 'OPTIMIZER') colClass = 'text-[#00ffe1] font-semibold';
                else if (log.category === 'SYSTEM') colClass = 'text-amber-300';

                return (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-on-surface-variant/45">[{log.timestamp}]</span>
                    <span className={`uppercase font-bold ${colClass}`}>
                      [{log.category}]
                    </span>
                    <span className="text-on-surface/90 font-medium">
                      {log.message}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant/50 pt-2 border-t border-outline-variant/10">
            <span>SHOWING {filteredLogs.length} CONSOLE ENTRIES ILIGN_C07</span>
            <button
              onClick={handleClearLogs}
              className="flex items-center gap-1.5 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/30 px-3 py-1 rounded transition-all cursor-pointer uppercase font-bold"
            >
              <Trash2 className="w-3 h-3" />
              Flush buffer
            </button>
          </div>
        </div>

        {/* Right column: Log simulator injector form */}
        <div className="glass-panel bloom-border p-6 rounded-lg text-left border border-outline-variant/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/10 pb-2">
              <span className="font-mono text-[10px] font-bold text-primary-fixed-dim uppercase tracking-wider block">
                Stdout callback Simulator
              </span>
              <Terminal className="w-4 h-4 text-primary-fixed-dim" />
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              Inject custom simulated hardware logs, weather warnings, or sensor telemetry reports directly back into the live processing pipeline to test alert reactions.
            </p>

            <form onSubmit={handleInjectLog} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-on-surface-variant/80 uppercase tracking-wide text-[10px] mb-1 font-mono">
                  Log Category level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['SYSTEM', 'LOG', 'INCIDENT', 'OPTIMIZER'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewLogCat(cat as any)}
                      className={`p-1.5 rounded border text-[10px] text-center font-mono font-bold transition-all cursor-pointer ${
                        newLogCat === cat
                          ? 'border-primary-fixed-dim bg-primary-fixed-dim/15 text-white'
                          : 'border-outline-variant/20 hover:border-outline-variant/50 text-on-surface-variant'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-on-surface-variant/80 uppercase tracking-wide text-[10px] mb-1 font-mono">
                  Custom Log String msg
                </label>
                <textarea
                  value={newLogMsg}
                  onChange={(e) => setNewLogMsg(e.target.value)}
                  rows={3}
                  placeholder="e.g. Weather sensory network triggered wet-surface road safety limits..."
                  className="w-full bg-surface-bright/50 border border-outline-variant/20 text-on-surface px-3 py-2 rounded focus:ring-1 focus:ring-primary-fixed-dim outline-none text-xs text-left"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-fixed-dim hover:bg-primary-fixed text-black py-2.5 rounded-md font-bold uppercase tracking-wider transition-all select-none cursor-pointer text-center block flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Inject Log callback
              </button>
            </form>
          </div>

          <div className="mt-4 p-3 bg-surface/30 rounded border border-outline-variant/10 text-[10px] text-on-surface-variant/65 leading-normal font-sans">
            <span className="font-mono font-bold text-primary mr-1.5 uppercase">Audit Note:</span>
            All diagnostic logs injected in this terminal are stored in local storage buffer frames.
          </div>
        </div>

      </div>
    </div>
  );
}
