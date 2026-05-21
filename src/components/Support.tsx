import React, { useState } from 'react';
import { HelpCircle, Star, Send, ShieldAlert, Cpu, Heart, AlertTriangle } from 'lucide-react';

export default function Support() {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketNode, setTicketNode] = useState('JUNCTION_NODE_07');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;

    setHasSubmitted(true);
    setTimeout(() => {
      setHasSubmitted(false);
      setTicketSubject('');
      setTicketMsg('');
    }, 3500);
  };

  return (
    <div className="p-8 h-full bg-surface-container-lowest/20 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/10 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-primary-fixed-dim">
            DIAGNOSTICS & OPERATIONS MANUAL
          </h2>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Browse hardware specifications, read operational guidelines, and submit telemetry override tickets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Operations Manual guidelines */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-lg text-left border border-outline-variant/20 space-y-6">
          
          {/* Quick guide card */}
          <div>
            <h3 className="font-mono text-xs font-bold text-primary-fixed-dim uppercase tracking-wider mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary-fixed-dim" />
              1.0 System Architecture Overview
            </h3>
            <p className="text-xs text-on-surface/90 leading-relaxed">
              <strong>TRAFFIC COMMAND AI</strong> compiles thousands of real-time camera frames and loop detectors into our predictive routing model. The active OS (NODE_01_OS) coordinates traffic light stages (Red, Yellow, Green cycles) to dynamically decrease vehicle queue delays and prevent downstream congestion.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs font-bold text-primary-fixed-dim uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              2.0 Emergency Override Protocol
            </h3>
            <div className="text-xs text-on-surface/90 space-y-2 leading-relaxed">
              <p>
                In the event of civil emergencies, extreme weather hazards, or high-priority responders calling, operational personnel are authorized to force manual state overrides:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
                <li>
                  <strong>Emergency Override:</strong> Located in the title bar, toggling this switches the entire city grid to manual fallback state, enabling individual signal switching.
                </li>
                <li>
                  <strong>Green Wave Corridor:</strong> Dispatched from the Emergency Hub, this aligns a consecutive green pathway for ambulance or fire squads, clearing congested intersections.
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs font-bold text-primary-fixed-dim uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              3.0 Operational Safety Parameters
            </h3>
            <p className="text-xs text-on-surface/90 leading-relaxed">
              Always monitor queue limits under the <strong>Signal Control</strong> view before applying manual switches. Forcing non-complementary directions green simultaneously is strictly barred by the hardware level lock to guarantee cross-walk pedestrian safety.
            </p>
          </div>

        </div>

        {/* Right column: Ticket desk form */}
        <div className="glass-panel bloom-border p-6 rounded-lg text-left border border-outline-variant/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/10 pb-2">
              <span className="font-mono text-[10px] font-bold text-primary-fixed-dim uppercase tracking-wider block">
                Submit Diagnostics Ticket
              </span>
              <HelpCircle className="w-4 h-4 text-primary-fixed-dim" />
            </div>

            {hasSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 text-xs p-3 rounded mb-4 font-semibold font-sans">
                TICKET DISPATCHED! METADATA RECEIVED BY NOC OPERATIONS.
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                Encountering camera failures, hardware offsets drift, or loop sensor errors? Submit a high-priority ticket directly to the Network Operations Center.
              </p>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-on-surface-variant/80 uppercase tracking-wide text-[10px] mb-1 font-mono">
                  Diagnostics Subject
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Node_07 Camera 2 offline..."
                  className="w-full bg-surface-bright/50 border border-outline-variant/20 text-on-surface px-3 py-2 rounded focus:ring-1 focus:ring-primary-fixed-dim outline-none text-xs text-left"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant/80 uppercase tracking-wide text-[10px] mb-1 font-mono">
                  Affected Intersection Node
                </label>
                <select
                  value={ticketNode}
                  onChange={(e) => setTicketNode(e.target.value)}
                  className="w-full bg-surface-bright/50 border border-outline-variant/20 text-on-surface px-3 py-2 rounded focus:ring-1 focus:ring-primary-fixed-dim outline-none text-xs font-semibold"
                >
                  <option value="JUNCTION_NODE_01">JUNCTION_NODE_01</option>
                  <option value="JUNCTION_NODE_02">JUNCTION_NODE_02</option>
                  <option value="JUNCTION_NODE_03">JUNCTION_NODE_03</option>
                  <option value="JUNCTION_NODE_04">JUNCTION_NODE_04</option>
                  <option value="JUNCTION_NODE_07">JUNCTION_NODE_07 (Lexington &amp; 34th)</option>
                  <option value="JUNCTION_NODE_08">JUNCTION_NODE_08</option>
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant/80 uppercase tracking-wide text-[10px] mb-1 font-mono">
                  Error Details / Logs transcript
                </label>
                <textarea
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  rows={3}
                  placeholder="e.g. Frame skipping observed since storm. Coordinates check: LAT 40.72."
                  className="w-full bg-surface-bright/50 border border-outline-variant/20 text-on-surface px-3 py-2 rounded focus:ring-1 focus:ring-primary-fixed-dim outline-none text-xs text-left"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-fixed-dim hover:bg-primary-fixed text-black py-2.5 rounded shadow font-bold uppercase tracking-wider transition-all select-none cursor-pointer text-center block flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit NOC Ticket
              </button>
            </form>
          </div>

          <div className="mt-4 p-3 bg-surface/30 rounded border border-outline-variant/10 text-[10px] text-on-surface-variant/65 leading-normal flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 shrink-0" />
            <span>Operational support desk is actively monitored. Shift supervisor is Saraswathi S.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
