export type UserRole = 'OPERATOR' | 'SUPERVISOR' | 'MAINTENANCE' | 'MANAGER';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  stationOrLine?: string;
}

export type MachineStatus = 'OK' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE';

export interface MetricThreshold {
  nominal: number;
  min: number;
  max: number;
  critical: number;
  unit: string;
}

export interface MachineTelemetry {
  timestamp: string;
  temperature: number; // °C
  vibration: number; // mm/s
  throughput: number; // parts/min
  pressure: number; // psi
  errorCode: string | null;
  isSimulated: boolean;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  line: string;
  status: MachineStatus;
  costPerDowntimeMinute: number;
  currentOrder: {
    id: string;
    client: string;
    priority: 'HIGH' | 'CRITICAL' | 'STANDARD';
    partsTarget: number;
    partsDone: number;
  };
  nominal: {
    temperature: MetricThreshold;
    vibration: MetricThreshold;
    throughput: MetricThreshold;
    pressure: MetricThreshold;
  };
  lastTelemetry: MachineTelemetry;
  telemetryHistory: MachineTelemetry[];
  aiRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  aiRiskScore: number; // 0 - 100
  lastMaintained: string;
  activeIssuesCount: number;
}

export type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IssueStatus = 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';
export type IssueType = 'MECHANICAL' | 'THERMAL' | 'THROUGHPUT_DROP' | 'ELECTRICAL' | 'SENSOR_FAULT';

export interface IssueActivity {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  note?: string;
}

export interface Issue {
  id: string;
  machineId: string;
  machineName: string;
  line: string;
  title: string;
  description: string;
  type: IssueType;
  severity: IssueSeverity;
  status: IssueStatus;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  priorityScore: number; // 0 - 100
  primaryRole: UserRole;
  secondaryRoles: UserRole[];
  assignedRole: UserRole;
  assignedUser: string | null;
  estimatedDowntimeMinutes: number;
  estimatedCost: number;
  isSimulated: boolean;
  isAiEstimated: boolean;
  priorityFactors: {
    downtimeRisk: number;
    orderUrgency: number;
    recurrenceScore: number;
    anomalyScore: number;
    manualOverride?: number;
  };
  aiDiagnosis: {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    suggestedRootCause: string;
    confidence: number;
    recommendedActions: string[];
    isDeepAnalysis?: boolean;
    analyzedAt?: string;
  };
  activityTimeline: IssueActivity[];
  telemetrySnapshot?: MachineTelemetry;
}

export interface AnalyticsSummary {
  totalIssues: number;
  activeIssues: number;
  resolvedIssues: number;
  mttaMinutes: number; // Mean Time to Acknowledge
  mttrMinutes: number; // Mean Time to Resolve
  totalDowntimeMinutes: number;
  totalEstimatedCost: number;
  issuesByMachine: Array<{
    machineId: string;
    machineName: string;
    count: number;
    criticalCount: number;
  }>;
  issuesBySeverity: Array<{
    severity: IssueSeverity;
    count: number;
  }>;
  issuesByRole: Array<{
    role: UserRole;
    count: number;
  }>;
  hourlyTimeline: Array<{
    hour: string;
    count: number;
    resolved: number;
  }>;
  aiAccuracyInsight: {
    totalPredicted: number;
    highRiskCorrelationPercent: number;
    preventedDowntimeEstimateHours: number;
  };
}

export interface SimulationState {
  isRunning: boolean;
  speedMs: number;
  stressMode: boolean;
  lastTick: string;
  totalEventsEmitted: number;
}
