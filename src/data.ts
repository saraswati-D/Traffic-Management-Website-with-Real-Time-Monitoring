import { JunctionNode, LogEntry, EmergencyDispatch, OptimizerPolicy } from './types';

export const INITIAL_JUNCTIONS: JunctionNode[] = [
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
    id: 'JUNCTION_NODE_07', // Match the mockup image labeling
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

export const INITIAL_LOGS: LogEntry[] = [
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

export const INITIAL_DISPATCHES: EmergencyDispatch[] = [
  {
    id: 'DISP-432',
    type: 'ambulance',
    source: 'Mercy Hospital East',
    destination: 'Lexington & 34th St (Junction_07)',
    eta: '2m 14s',
    status: 'en-route',
    priorityLevel: 'CRITICAL'
  },
  {
    id: 'DISP-431',
    type: 'fire',
    source: 'Station 14 Midtown',
    destination: 'Madison & 14th Ave (Junction_03)',
    eta: 'Completed',
    status: 'completed',
    priorityLevel: 'HIGH'
  }
];

export const INITIAL_POLICIES: OptimizerPolicy[] = [
  {
    id: 'policy_01',
    name: 'Dynamic Transit Priority',
    description: 'Prioritizes mass transit vehicles and high-occupancy lanes dynamically based on real-time cameras.',
    isActive: true,
    weights: {
      pedestrianSafety: 70,
      crossTrafficThru: 60,
      emergencyPriority: 100,
      waitingTimeWeight: 80
    }
  },
  {
    id: 'policy_02',
    name: 'Pedestrian Safe Haven',
    description: 'Increases crosswalk times and coordinates light sequences to guarantee zero vehicle encroachments.',
    isActive: false,
    weights: {
      pedestrianSafety: 100,
      crossTrafficThru: 40,
      emergencyPriority: 80,
      waitingTimeWeight: 50
    }
  },
  {
    id: 'policy_03',
    name: 'Green Corridor Flow',
    description: 'Optimized strictly for arterial vehicles crossing along main boulevards to decrease emissions.',
    isActive: false,
    weights: {
      pedestrianSafety: 40,
      crossTrafficThru: 90,
      emergencyPriority: 90,
      waitingTimeWeight: 70
    }
  }
];
