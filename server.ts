import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Hardcoded initial datasets for clean standalone operation
const INITIAL_JUNCTIONS = [
  {
    id: 'JUNCTION_NODE_01',
    name: 'Broadway & 14th Ave',
    coords: { x: 200, y: 100 },
    lat: 40.7128,
    long: -74.006,
    status: 'normal',
    flowRate: 42,
    queueLength: { N: 3, S: 2, E: 4, W: 1 },
    waitTime: 24,
    hasCctv: true,
    isEmergencyCorridor: false,
    lights: [
      { direction: 'N-S', state: 'green', timeLeft: 18, autoCycle: true },
      { direction: 'E-W', state: 'red', timeLeft: 18, autoCycle: true }
    ]
  },
  {
    id: 'JUNCTION_NODE_02',
    name: 'Lexington & 14th Ave',
    coords: { x: 500, y: 100 },
    lat: 40.7155,
    long: -74.0012,
    status: 'dense',
    flowRate: 74,
    queueLength: { N: 8, S: 9, E: 5, W: 7 },
    waitTime: 56,
    hasCctv: true,
    isEmergencyCorridor: false,
    lights: [
      { direction: 'N-S', state: 'red', timeLeft: 8, autoCycle: true },
      { direction: 'E-W', state: 'green', timeLeft: 8, autoCycle: true }
    ]
  },
  {
    id: 'JUNCTION_NODE_03',
    name: 'Madison & 14th Ave',
    coords: { x: 800, y: 100 },
    lat: 40.7182,
    long: -73.9964,
    status: 'critical',
    flowRate: 91,
    queueLength: { N: 16, S: 14, E: 12, W: 11 },
    waitTime: 118,
    hasCctv: true,
    isEmergencyCorridor: false,
    lights: [
      { direction: 'N-S', state: 'green', timeLeft: 4, autoCycle: true },
      { direction: 'E-W', state: 'red', timeLeft: 4, autoCycle: true }
    ]
  },
  {
    id: 'JUNCTION_NODE_04',
    name: 'Broadway & 34th St',
    coords: { x: 200, y: 300 },
    lat: 40.7212,
    long: -74.0035,
    status: 'normal',
    flowRate: 35,
    queueLength: { N: 2, S: 1, E: 2, W: 3 },
    waitTime: 15,
    hasCctv: false,
    isEmergencyCorridor: false,
    lights: [
      { direction: 'N-S', state: 'green', timeLeft: 35, autoCycle: true },
      { direction: 'E-W', state: 'red', timeLeft: 35, autoCycle: true }
    ]
  },
  {
    id: 'JUNCTION_NODE_07',
    name: 'Lexington & 34th St',
    coords: { x: 500, y: 300 },
    lat: 40.7239,
    long: -73.9987,
    status: 'critical',
    flowRate: 89,
    queueLength: { N: 14, S: 18, E: 15, W: 12 },
    waitTime: 142,
    hasCctv: true,
    isEmergencyCorridor: false,
    lights: [
      { direction: 'N-S', state: 'red', timeLeft: 21, autoCycle: true },
      { direction: 'E-W', state: 'green', timeLeft: 21, autoCycle: true }
    ]
  },
  {
    id: 'JUNCTION_NODE_05',
    name: 'Madison & 34th St',
    coords: { x: 800, y: 300 },
    lat: 40.7266,
    long: -73.9939,
    status: 'normal',
    flowRate: 48,
    queueLength: { N: 4, S: 3, E: 5, W: 4 },
    waitTime: 28,
    hasCctv: true,
    isEmergencyCorridor: false,
    lights: [
      { direction: 'N-S', state: 'green', timeLeft: 12, autoCycle: true },
      { direction: 'E-W', state: 'red', timeLeft: 12, autoCycle: true }
    ]
  },
  {
    id: 'JUNCTION_NODE_06',
    name: 'Broadway & 42nd St',
    coords: { x: 200, y: 500 },
    lat: 40.7296,
    long: -74.001,
    status: 'dense',
    flowRate: 68,
    queueLength: { N: 9, S: 7, E: 8, W: 6 },
    waitTime: 48,
    hasCctv: true,
    isEmergencyCorridor: false,
    lights: [
      { direction: 'N-S', state: 'red', timeLeft: 15, autoCycle: true },
      { direction: 'E-W', state: 'green', timeLeft: 15, autoCycle: true }
    ]
  },
  {
    id: 'JUNCTION_NODE_08',
    name: 'Lexington & 42nd St',
    coords: { x: 500, y: 500 },
    lat: 40.7323,
    long: -73.9962,
    status: 'normal',
    flowRate: 51,
    queueLength: { N: 4, S: 5, E: 3, W: 4 },
    waitTime: 30,
    hasCctv: false,
    isEmergencyCorridor: false,
    lights: [
      { direction: 'N-S', state: 'green', timeLeft: 24, autoCycle: true },
      { direction: 'E-W', state: 'red', timeLeft: 24, autoCycle: true }
    ]
  },
  {
    id: 'JUNCTION_NODE_09',
    name: 'Madison & 42nd St',
    coords: { x: 800, y: 500 },
    lat: 40.735,
    long: -73.9914,
    status: 'normal',
    flowRate: 29,
    queueLength: { N: 2, S: 2, E: 3, W: 1 },
    waitTime: 12,
    hasCctv: true,
    isEmergencyCorridor: false,
    lights: [
      { direction: 'N-S', state: 'green', timeLeft: 10, autoCycle: true },
      { direction: 'E-W', state: 'red', timeLeft: 10, autoCycle: true }
    ]
  }
];

const INITIAL_LOGS = [
  {
    id: '1',
    timestamp: '16:09:42',
    category: 'INCIDENT',
    message: 'Minor collision at Node_14 (Broadway & 42nd). Traffic rerouting initialized.'
  },
  {
    id: '2',
    timestamp: '16:08:41',
    category: 'OPTIMIZER',
    message: 'Signal timing adjusted at Junction_07 to mitigate density spike.'
  },
  {
    id: '3',
    timestamp: '16:05:38',
    category: 'SYSTEM',
    message: 'Emergency vehicle detected at Perimeter_East. Green corridor active.'
  },
  {
    id: '4',
    timestamp: '16:01:10',
    category: 'LOG',
    message: 'Autonomous fleet sync complete for Sector 4-B.'
  }
];

// In-memory data store
let junctions = JSON.parse(JSON.stringify(INITIAL_JUNCTIONS));
let logs = JSON.parse(JSON.stringify(INITIAL_LOGS));
let isOverrideActive = false;
let systemMetrics = {
  totalVehicles: 42891,
  avgFlowSpeed: 34.0,
  activeBottlenecks: 12,
  systemUptime: '1,429:12:44'
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser middleware
  app.use(express.json());

  // ---------------------------------------------------------------------------
  // Background state simulation loop
  // ---------------------------------------------------------------------------

  // Handle ticking loops server-side to guarantee persistent shared simulation state
  setInterval(() => {
    // Stat fluctuations
    const deltaVehicles = Math.floor(Math.random() * 7) - 3;
    systemMetrics.totalVehicles = Math.max(1000, systemMetrics.totalVehicles + deltaVehicles);
    
    const newSpeed = Math.max(28, Math.min(48, systemMetrics.avgFlowSpeed + (Math.random() * 1.6 - 0.8)));
    systemMetrics.avgFlowSpeed = parseFloat(newSpeed.toFixed(1));

    // Age lights timers
    junctions = junctions.map((j: any) => {
      // Determine lights
      const updatedLights = j.lights.map((l: any) => {
        // Only tick down if autoCycle is enabled
        if (!l.autoCycle) return l;

        const nextTime = l.timeLeft - 1;
        if (nextTime <= 0) {
          let nextState: 'red' | 'yellow' | 'green' = 'green';
          if (l.state === 'green') {
            nextState = 'yellow';
          } else if (l.state === 'yellow') {
            nextState = 'red';
          } else {
            nextState = 'green';
          }

          return {
            ...l,
            state: nextState,
            timeLeft: nextState === 'yellow' ? 4 : 20
          };
        }
        return { ...l, timeLeft: nextTime };
      });

      return {
        ...j,
        lights: updatedLights
      };
    });
  }, 1000);

  // Periodic simulated events on server
  const eventTypes = ['SYSTEM', 'OPTIMIZER', 'LOG', 'INCIDENT'];
  const simulatedMessages = [
    'Dynamic offset updated for Corridor Alpha.',
    'Anomalous vehicle deceleration detected near Broadway.',
    'Stationary hazard bypass successfully integrated.',
    'Pedestrian call key initialized at Madison Ave crossing.',
    'Flow density recalibrated based on CCTV sensor inputs.',
    'AI predicted queue cleared on Node_04 in 14s.'
  ];

  setInterval(() => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const cat = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const msg = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];

    const newLog = {
      id: String(Date.now()),
      timestamp: time,
      category: cat,
      message: msg
    };

    logs.unshift(newLog);
    if (logs.length > 50) {
      logs = logs.slice(0, 50);
    }
  }, 15000);

  // ---------------------------------------------------------------------------
  // API Core ENDPOINTS
  // ---------------------------------------------------------------------------

  // GET global system state
  app.get('/api/state', (req, res) => {
    res.json({
      junctions,
      logs,
      isOverrideActive,
      metrics: systemMetrics
    });
  });

  // GET current junctions
  app.get('/api/junctions', (req, res) => {
    res.json(junctions);
  });

  // POST update manual light switch
  app.post('/api/junctions/:id/toggle-light', (req, res) => {
    const { id } = req.params;
    const junctionIndex = junctions.findIndex((j: any) => j.id === id);

    if (junctionIndex === -1) {
      return res.status(404).json({ error: 'Junction not found' });
    }

    const junction = junctions[junctionIndex];
    const updatedLights = junction.lights.map((l: any) => {
      // Flip Red/Green
      const nextState: 'red' | 'green' = l.state === 'green' ? 'red' : 'green';
      return {
        ...l,
        state: nextState,
        timeLeft: 15,
        autoCycle: false // Stop auto-cycling
      };
    });

    junctions[junctionIndex] = {
      ...junction,
      status: 'normal',
      waitTime: Math.max(10, Math.floor(junction.waitTime / 2)),
      lights: updatedLights
    };

    // Append log
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const newLog = {
      id: String(Date.now()),
      timestamp: time,
      category: 'SYSTEM',
      message: `Manual signal override triggered on ${junction.name} (${junction.id}).`
    };
    logs.unshift(newLog);

    res.json({
      success: true,
      junction: junctions[junctionIndex],
      log: newLog
    });
  });

  // PUT batch updates of a junction
  app.put('/api/junctions/:id', (req, res) => {
    const { id } = req.params;
    const updateBody = req.body;
    const junctionIndex = junctions.findIndex((j: any) => j.id === id);

    if (junctionIndex === -1) {
      return res.status(404).json({ error: 'Junction not found' });
    }

    junctions[junctionIndex] = {
      ...junctions[junctionIndex],
      ...updateBody
    };

    res.json({ success: true, junction: junctions[junctionIndex] });
  });

  // PUT updates bulk junctions
  app.put('/api/junctions', (req, res) => {
    const { list } = req.body;
    if (Array.isArray(list)) {
      junctions = list;
    }
    res.json({ success: true, count: junctions.length });
  });

  // POST triggering emergency override from header
  app.post('/api/emergency/override', (req, res) => {
    const { active } = req.body;
    isOverrideActive = active;

    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const overrideLog = {
      id: String(Date.now()),
      timestamp: time,
      category: 'SYSTEM',
      message: isOverrideActive
        ? 'EMERGENCY OVERRIDE ACTIVATED ENTIRE CITY GRID FORUM. ALL SIGNALS UNLOCKED FOR MANUAL DECK CONTROL.'
        : 'Emergency override dismissed. AI Engine scheduling lock re-established.'
    };
    logs.unshift(overrideLog);

    // Apply autoCycle tags based on override active
    junctions = junctions.map((j: any) => ({
      ...j,
      status: isOverrideActive ? 'normal' : j.status,
      lights: j.lights.map((l: any) => ({
        ...l,
        autoCycle: !isOverrideActive
      }))
    }));

    res.json({
      success: true,
      isOverrideActive,
      log: overrideLog,
      junctions
    });
  });

  // GET system metrics
  app.get('/api/metrics', (req, res) => {
    res.json(systemMetrics);
  });

  // PUT updates global system metrics
  app.put('/api/metrics', (req, res) => {
    systemMetrics = {
      ...systemMetrics,
      ...req.body
    };
    res.json({ success: true, metrics: systemMetrics });
  });

  // GET event logs
  app.get('/api/logs', (req, res) => {
    res.json(logs);
  });

  // POST inject custom log
  app.post('/api/logs', (req, res) => {
    const { category, message } = req.body;
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    
    const newLog = {
      id: String(Date.now()),
      timestamp: time,
      category: category || 'LOG',
      message: message || 'Custom log trigger entry.'
    };

    logs.unshift(newLog);
    res.status(201).json(newLog);
  });

  // DELETE clears logs buffered frames
  app.delete('/api/logs', (req, res) => {
    logs = [];
    res.json({ success: true });
  });

  // ---------------------------------------------------------------------------
  // Vite Middleware Handling assets (dev vs. prod)
  // ---------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SYSTEM CONSOLE] Server booted successfully running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('[CRITICAL FAILURE] Database Server failed to launch:', error);
});
