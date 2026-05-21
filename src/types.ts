export type ScreenTab =
  | 'dashboard'
  | 'signal-control'
  | 'emergency-hub'
  | 'analytics'
  | 'optimizer'
  | 'systems-logs'
  | 'support';

export interface LightState {
  direction: 'N-S' | 'E-W';
  state: 'red' | 'yellow' | 'green';
  timeLeft: number; // in seconds
  autoCycle: boolean;
}

export interface JunctionNode {
  id: string;
  name: string;
  coords: { x: number; y: number };
  lat: number;
  long: number;
  status: 'normal' | 'dense' | 'critical';
  flowRate: number; // percentage (0-100)
  queueLength: { N: number; S: number; E: number; W: number };
  waitTime: number; // seconds
  lights: LightState[];
  isEmergencyCorridor: boolean;
  cctvUrl?: string;
  hasCctv: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  category: 'INCIDENT' | 'OPTIMIZER' | 'SYSTEM' | 'LOG';
  message: string;
}

export interface SystemMetrics {
  totalVehicles: number;
  avgFlowSpeed: number; // km/h
  activeBottlenecks: number;
  systemUptime: string;
}

export interface EmergencyDispatch {
  id: string;
  type: 'ambulance' | 'fire' | 'police';
  source: string;
  destination: string;
  eta: string;
  status: 'en-route' | 'completed' | 'standby';
  priorityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface OptimizerPolicy {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  weights: {
    pedestrianSafety: number; // 0-100
    crossTrafficThru: number; // 0-100
    emergencyPriority: number; // 0-100
    waitingTimeWeight: number; // 0-100
  };
}
