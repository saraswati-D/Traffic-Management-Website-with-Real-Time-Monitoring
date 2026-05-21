/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenTab, JunctionNode, LogEntry, SystemMetrics } from './types';
import { INITIAL_JUNCTIONS, INITIAL_LOGS } from './data';

// Sub-components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapDashboard from './components/MapDashboard';
import SignalControl from './components/SignalControl';
import EmergencyHub from './components/EmergencyHub';
import Analytics from './components/Analytics';
import Optimizer from './components/Optimizer';
import SystemsLogs from './components/SystemLogs';
import Support from './components/Support';

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiEngineActive, setAiEngineActive] = useState<boolean>(true);
  const [isOverrideActive, setIsOverrideActive] = useState<boolean>(false);

  // Core telemetry state shared between views
  const [junctions, setJunctions] = useState<JunctionNode[]>(INITIAL_JUNCTIONS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalVehicles: 42891,
    avgFlowSpeed: 34.0,
    activeBottlenecks: 12,
    systemUptime: '1,429:12:44'
  });

  const loggedInUserEmail = 'saraswathis.24is@saividya.ac.in';

  // Synchronize document title and start real-time backend state polling
  useEffect(() => {
    document.title = 'TRAFFIC COMMAND AI | NODE_01_OS';
  }, []);

  useEffect(() => {
    const fetchMasterState = async () => {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const data = await res.json();
          setJunctions(data.junctions);
          setLogs(data.logs);
          setIsOverrideActive(data.isOverrideActive);
          setMetrics(data.metrics);
        }
      } catch (err) {
        console.warn('[TELEMETRY CONSOLE] Retrying backend connection...', err);
      }
    };

    fetchMasterState();
    const interval = setInterval(fetchMasterState, 1500);
    return () => clearInterval(interval);
  }, []);

  // Sync isOverrideActive via POST API to the Express backend
  const handleTriggerEmergencyOverride = async () => {
    const nextState = !isOverrideActive;
    
    // Fast optimistic client update
    setIsOverrideActive(nextState);

    try {
      const res = await fetch('/api/emergency/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: nextState })
      });
      if (res.ok) {
        const data = await res.json();
        setIsOverrideActive(data.isOverrideActive);
        setJunctions(data.junctions);
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('[CRITICAL OVERRIDE SYNC FAILURE] Server override failed:', err);
    }
  };

  const handleFocusNodeOnMap = (nodeId: string) => {
    setSearchQuery(nodeId);
    setActiveTab('dashboard');
  };

  // Render correct panel with beautiful content transition fades
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <MapDashboard
            junctions={junctions}
            setJunctions={setJunctions}
            logs={logs}
            setLogs={setLogs}
            metrics={metrics}
            setMetrics={setMetrics}
            searchQuery={searchQuery}
            onFocusNode={handleFocusNodeOnMap}
            aiEngineActive={aiEngineActive}
          />
        );
      case 'signal-control':
        return <SignalControl junctions={junctions} setJunctions={setJunctions} />;
      case 'emergency-hub':
        return (
          <EmergencyHub
            junctions={junctions}
            setJunctions={setJunctions}
            logs={logs}
            setLogs={setLogs}
          />
        );
      case 'analytics':
        return <Analytics />;
      case 'optimizer':
        return <Optimizer logs={logs} setLogs={setLogs} />;
      case 'systems-logs':
        return <SystemsLogs logs={logs} setLogs={setLogs} />;
      case 'support':
        return <Support />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <span className="text-on-surface-variant font-mono">NODE_OS SECTION NOT FOUND</span>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen bg-surface text-on-surface font-sans overflow-hidden select-none relative flex flex-col">
      
      {/* Dynamic Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onTriggerEmergencyOverride={handleTriggerEmergencyOverride}
        isOverrideActive={isOverrideActive}
        userEmail={loggedInUserEmail}
      />

      {/* Main Structural Layout */}
      <div className="flex-1 flex pt-16 relative">
        {/* Dynamic Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          aiEngineActive={aiEngineActive}
          setAiEngineActive={setAiEngineActive}
        />

        {/* Content canvas container */}
        <main className="ml-[280px] flex-1 relative h-full overflow-hidden bg-surface-container-lowest">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="absolute inset-0 h-full w-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
}
