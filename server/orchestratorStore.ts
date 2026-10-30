import { Machine, Issue, IssueSeverity, UserRole, AnalyticsSummary, SimulationState, MachineTelemetry } from '../src/types/index.ts';

// Initial predefined machines representing a real-world multi-stage manufacturing line
const INITIAL_MACHINES: Machine[] = [
  {
    id: 'M1',
    name: 'Stamping Press Alpha',
    type: 'Heavy Mechanical Press (800T)',
    line: 'Line 1 - Stamping & Blanking',
    status: 'OK',
    costPerDowntimeMinute: 75,
    currentOrder: {
      id: 'ORD-9842',
      client: 'Apex Automotive Systems',
      priority: 'CRITICAL',
      partsTarget: 3000,
      partsDone: 2140,
    },
    nominal: {
      temperature: { nominal: 62, min: 40, max: 78, critical: 88, unit: '°C' },
      vibration: { nominal: 1.4, min: 0.4, max: 3.5, critical: 5.5, unit: 'mm/s' },
      throughput: { nominal: 110, min: 70, max: 130, critical: 45, unit: 'pcs/min' },
      pressure: { nominal: 160, min: 120, max: 195, critical: 220, unit: 'bar' },
    },
    lastTelemetry: {
      timestamp: new Date().toISOString(),
      temperature: 63.2,
      vibration: 1.45,
      throughput: 112,
      pressure: 161.4,
      errorCode: null,
      isSimulated: true,
    },
    telemetryHistory: [],
    aiRiskLevel: 'LOW',
    aiRiskScore: 18,
    lastMaintained: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    activeIssuesCount: 0,
  },
  {
    id: 'M2',
    name: 'CNC 5-Axis Milling 04',
    type: 'High-Precision Machining Center',
    line: 'Line 2 - Precision Machining',
    status: 'WARNING',
    costPerDowntimeMinute: 65,
    currentOrder: {
      id: 'ORD-9845',
      client: 'AeroDynamics Defense Group',
      priority: 'HIGH',
      partsTarget: 450,
      partsDone: 310,
    },
    nominal: {
      temperature: { nominal: 54, min: 35, max: 70, critical: 80, unit: '°C' },
      vibration: { nominal: 1.2, min: 0.3, max: 2.8, critical: 4.5, unit: 'mm/s' },
      throughput: { nominal: 35, min: 20, max: 45, critical: 15, unit: 'pcs/min' },
      pressure: { nominal: 90, min: 65, max: 115, critical: 130, unit: 'bar' },
    },
    lastTelemetry: {
      timestamp: new Date().toISOString(),
      temperature: 73.8,
      vibration: 3.2,
      throughput: 28,
      pressure: 88.5,
      errorCode: 'WARN_VIB_TREND',
      isSimulated: true,
    },
    telemetryHistory: [],
    aiRiskLevel: 'HIGH',
    aiRiskScore: 78,
    lastMaintained: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
    activeIssuesCount: 1,
  },
  {
    id: 'M3',
    name: 'Robotic Arc Welder Beta',
    type: 'Dual-Arm 6-Axis Arc Cell',
    line: 'Line 3 - Chassis Joining',
    status: 'OK',
    costPerDowntimeMinute: 55,
    currentOrder: {
      id: 'ORD-9848',
      client: 'Nordic EV Mobility',
      priority: 'STANDARD',
      partsTarget: 1200,
      partsDone: 890,
    },
    nominal: {
      temperature: { nominal: 48, min: 30, max: 65, critical: 75, unit: '°C' },
      vibration: { nominal: 0.9, min: 0.2, max: 2.2, critical: 3.8, unit: 'mm/s' },
      throughput: { nominal: 60, min: 40, max: 75, critical: 25, unit: 'pcs/min' },
      pressure: { nominal: 45, min: 30, max: 60, critical: 72, unit: 'bar' },
    },
    lastTelemetry: {
      timestamp: new Date().toISOString(),
      temperature: 49.1,
      vibration: 0.95,
      throughput: 59,
      pressure: 44.8,
      errorCode: null,
      isSimulated: true,
    },
    telemetryHistory: [],
    aiRiskLevel: 'LOW',
    aiRiskScore: 12,
    lastMaintained: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    activeIssuesCount: 0,
  },
  {
    id: 'M4',
    name: 'Thermal Curing Oven #2',
    type: 'Multi-Zone Infrared Curing Line',
    line: 'Line 4 - Coating & Finishing',
    status: 'OK',
    costPerDowntimeMinute: 50,
    currentOrder: {
      id: 'ORD-9850',
      client: 'Siemens Industrial Infrastructure',
      priority: 'HIGH',
      partsTarget: 5000,
      partsDone: 3950,
    },
    nominal: {
      temperature: { nominal: 185, min: 160, max: 205, critical: 225, unit: '°C' },
      vibration: { nominal: 0.6, min: 0.1, max: 1.8, critical: 3.0, unit: 'mm/s' },
      throughput: { nominal: 150, min: 100, max: 180, critical: 70, unit: 'pcs/min' },
      pressure: { nominal: 30, min: 20, max: 40, critical: 50, unit: 'bar' },
    },
    lastTelemetry: {
      timestamp: new Date().toISOString(),
      temperature: 186.4,
      vibration: 0.62,
      throughput: 148,
      pressure: 29.8,
      errorCode: null,
      isSimulated: true,
    },
    telemetryHistory: [],
    aiRiskLevel: 'MEDIUM',
    aiRiskScore: 42,
    lastMaintained: new Date(Date.now() - 19 * 24 * 3600 * 1000).toISOString(),
    activeIssuesCount: 0,
  },
  {
    id: 'M5',
    name: 'Automated Sorter & Conveyor',
    type: 'High-Speed Cross-Belt Diverter',
    line: 'Line 5 - Logistics & Outfeed',
    status: 'OK',
    costPerDowntimeMinute: 40,
    currentOrder: {
      id: 'ORD-9852',
      client: 'Apex Logistics Distribution',
      priority: 'STANDARD',
      partsTarget: 10000,
      partsDone: 7200,
    },
    nominal: {
      temperature: { nominal: 42, min: 25, max: 58, critical: 68, unit: '°C' },
      vibration: { nominal: 1.6, min: 0.5, max: 3.2, critical: 4.8, unit: 'mm/s' },
      throughput: { nominal: 220, min: 150, max: 260, critical: 90, unit: 'pcs/min' },
      pressure: { nominal: 55, min: 40, max: 70, critical: 85, unit: 'bar' },
    },
    lastTelemetry: {
      timestamp: new Date().toISOString(),
      temperature: 43.1,
      vibration: 1.68,
      throughput: 218,
      pressure: 54.6,
      errorCode: null,
      isSimulated: true,
    },
    telemetryHistory: [],
    aiRiskLevel: 'LOW',
    aiRiskScore: 15,
    lastMaintained: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    activeIssuesCount: 0,
  },
  {
    id: 'M6',
    name: 'Hydraulic Injection Mold #2',
    type: 'Dual-Platen Polymer Injection (450T)',
    line: 'Line 6 - Subassembly Molding',
    status: 'OK',
    costPerDowntimeMinute: 60,
    currentOrder: {
      id: 'ORD-9855',
      client: 'Vanguard Medical Devices',
      priority: 'CRITICAL',
      partsTarget: 4000,
      partsDone: 1400,
    },
    nominal: {
      temperature: { nominal: 140, min: 110, max: 165, critical: 185, unit: '°C' },
      vibration: { nominal: 1.1, min: 0.3, max: 2.6, critical: 4.2, unit: 'mm/s' },
      throughput: { nominal: 48, min: 30, max: 60, critical: 20, unit: 'pcs/min' },
      pressure: { nominal: 180, min: 135, max: 210, critical: 240, unit: 'bar' },
    },
    lastTelemetry: {
      timestamp: new Date().toISOString(),
      temperature: 142.3,
      vibration: 1.15,
      throughput: 47,
      pressure: 182.1,
      errorCode: null,
      isSimulated: true,
    },
    telemetryHistory: [],
    aiRiskLevel: 'LOW',
    aiRiskScore: 24,
    lastMaintained: new Date(Date.now() - 11 * 24 * 3600 * 1000).toISOString(),
    activeIssuesCount: 0,
  },
];

// Seed initial historical issues
const INITIAL_ISSUES: Issue[] = [
  {
    id: 'ISS-1042',
    machineId: 'M2',
    machineName: 'CNC 5-Axis Milling 04',
    line: 'Line 2 - Precision Machining',
    title: 'Spindle Harmonic Vibration Creep & Bearing Thermal Drift',
    description: 'Vibration reached 3.2 mm/s (warning threshold 2.8 mm/s) accompanied by a 14°C spindle core temperature elevation over 15 minutes during high-feed milling.',
    type: 'MECHANICAL',
    severity: 'HIGH',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    priorityScore: 84,
    primaryRole: 'MAINTENANCE',
    secondaryRoles: ['OPERATOR', 'SUPERVISOR'],
    assignedRole: 'MAINTENANCE',
    assignedUser: null,
    estimatedDowntimeMinutes: 35,
    estimatedCost: 2275,
    isSimulated: true,
    isAiEstimated: true,
    priorityFactors: {
      downtimeRisk: 30,
      orderUrgency: 25,
      recurrenceScore: 15,
      anomalyScore: 14,
    },
    aiDiagnosis: {
      riskLevel: 'HIGH',
      suggestedRootCause: 'Premature lubricant breakdown or micro-spalling on spindle front roller bearings under continuous axial load.',
      confidence: 89,
      recommendedActions: [
        'Inspect automatic lubrication reservoir line for air pockets or pressure drop',
        'Run vibration spectrum analyzer to check for 1X/2X rotational frequency harmonics',
        'Reduce spindle feed rate override to 80% if acoustic rattle is detected',
        'Verify tool holder runout with dial test indicator (< 0.005mm)',
      ],
      isDeepAnalysis: false,
    },
    activityTimeline: [
      {
        id: 'ACT-1',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        user: 'System Sensor Probe',
        role: 'MAINTENANCE',
        action: 'Anomaly Detected',
        note: 'Continuous harmonic vibration spike beyond 3.0 mm/s limit.',
      },
    ],
  },
  {
    id: 'ISS-1039',
    machineId: 'M1',
    machineName: 'Stamping Press Alpha',
    line: 'Line 1 - Stamping & Blanking',
    title: 'Die Lubricant Flow Fluctuation & Pressure Dips',
    description: 'Secondary hydraulic valve pressure dropped intermittently between strokes, causing momentary throughput dips.',
    type: 'THERMAL',
    severity: 'MEDIUM',
    status: 'ACKNOWLEDGED',
    createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    acknowledgedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    priorityScore: 62,
    primaryRole: 'OPERATOR',
    secondaryRoles: ['SUPERVISOR', 'MAINTENANCE'],
    assignedRole: 'OPERATOR',
    assignedUser: 'Op_Ana',
    estimatedDowntimeMinutes: 18,
    estimatedCost: 1350,
    isSimulated: true,
    isAiEstimated: true,
    priorityFactors: {
      downtimeRisk: 20,
      orderUrgency: 25,
      recurrenceScore: 10,
      anomalyScore: 7,
    },
    aiDiagnosis: {
      riskLevel: 'MEDIUM',
      suggestedRootCause: 'Hydraulic return filter element partially clogged or solenoid response delay.',
      confidence: 82,
      recommendedActions: [
        'Check differential pressure indicator on main pump return manifold',
        'Perform visual check for external hydraulic fitting misting',
        'Top up ISO VG 46 hydraulic fluid if tank sight gauge is below midline',
      ],
      isDeepAnalysis: false,
    },
    activityTimeline: [
      {
        id: 'ACT-10',
        timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
        user: 'System Sensor Probe',
        role: 'OPERATOR',
        action: 'Anomaly Detected',
        note: 'Hydraulic return pressure dipped below 135 bar.',
      },
      {
        id: 'ACT-11',
        timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
        user: 'Op_Ana',
        role: 'OPERATOR',
        action: 'Acknowledged Issue',
        note: 'Inspecting secondary line pressure gauges.',
      },
    ],
  },
  {
    id: 'ISS-1035',
    machineId: 'M4',
    machineName: 'Thermal Curing Oven #2',
    line: 'Line 4 - Coating & Finishing',
    title: 'Zone 3 Thermocouple Micro-Drift',
    description: 'Infrared heating element duty cycle oscillated ±7°C during shift changeover.',
    type: 'ELECTRICAL',
    severity: 'LOW',
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    acknowledgedAt: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    priorityScore: 38,
    primaryRole: 'MAINTENANCE',
    secondaryRoles: ['SUPERVISOR'],
    assignedRole: 'MAINTENANCE',
    assignedUser: 'Tech_Ravi',
    estimatedDowntimeMinutes: 10,
    estimatedCost: 500,
    isSimulated: true,
    isAiEstimated: true,
    priorityFactors: {
      downtimeRisk: 10,
      orderUrgency: 15,
      recurrenceScore: 5,
      anomalyScore: 8,
    },
    aiDiagnosis: {
      riskLevel: 'LOW',
      suggestedRootCause: 'PID controller autotune drift or dirty thermocouple lens.',
      confidence: 94,
      recommendedActions: [
        'Clean infrared sensor optical window with lint-free solvent wipe',
        'Re-calibrate zone 3 thermocouple offset',
      ],
      isDeepAnalysis: false,
    },
    activityTimeline: [
      {
        id: 'ACT-20',
        timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
        user: 'System Sensor Probe',
        role: 'MAINTENANCE',
        action: 'Anomaly Detected',
      },
      {
        id: 'ACT-21',
        timestamp: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
        user: 'Tech_Ravi',
        role: 'MAINTENANCE',
        action: 'Acknowledged Issue',
        note: 'Checking optical lens condition on zone 3.',
      },
      {
        id: 'ACT-22',
        timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
        user: 'Tech_Ravi',
        role: 'MAINTENANCE',
        action: 'Resolved Issue',
        note: 'Cleaned sensor glass and recalibrated. Temperature stabilized at 185°C.',
      },
    ],
  },
];

class OrchestratorStore {
  private machines: Machine[] = [];
  private issues: Issue[] = [];
  private subscribers: Array<(data: { type: string; payload: any }) => void> = [];
  private simTimer: NodeJS.Timeout | null = null;
  private simulationState: SimulationState = {
    isRunning: true,
    speedMs: 2000,
    stressMode: false,
    lastTick: new Date().toISOString(),
    totalEventsEmitted: 1420,
  };

  constructor() {
    this.resetToDefaults();
    this.startSimulation();
  }

  public resetToDefaults() {
    // Deep copy initial data
    this.machines = JSON.parse(JSON.stringify(INITIAL_MACHINES));
    this.issues = JSON.parse(JSON.stringify(INITIAL_ISSUES));

    // Populate initial 20 points of telemetry history for each machine
    const now = Date.now();
    this.machines.forEach(m => {
      m.telemetryHistory = [];
      for (let i = 20; i >= 0; i--) {
        const pointTime = new Date(now - i * 5000).toISOString();
        const noise = (Math.random() - 0.5) * 0.04;
        m.telemetryHistory.push({
          timestamp: pointTime,
          temperature: +(m.nominal.temperature.nominal * (1 + noise)).toFixed(1),
          vibration: +(m.nominal.vibration.nominal * (1 + noise * 1.5)).toFixed(2),
          throughput: Math.round(m.nominal.throughput.nominal * (1 + noise * 0.5)),
          pressure: +(m.nominal.pressure.nominal * (1 + noise)).toFixed(1),
          errorCode: null,
          isSimulated: true,
        });
      }
      m.lastTelemetry = m.telemetryHistory[m.telemetryHistory.length - 1];
    });

    this.recalculateActiveIssueCounts();
  }

  public subscribe(cb: (data: { type: string; payload: any }) => void) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== cb);
    };
  }

  private broadcast(type: string, payload: any) {
    this.subscribers.forEach(cb => {
      try {
        cb({ type, payload });
      } catch (err) {
        console.error('SSE broadcast error:', err);
      }
    });
  }

  public startSimulation() {
    if (this.simTimer) clearInterval(this.simTimer);
    this.simulationState.isRunning = true;
    this.simTimer = setInterval(() => this.tick(), this.simulationState.speedMs);
    this.broadcast('SIMULATION_STATE', this.simulationState);
  }

  public stopSimulation() {
    if (this.simTimer) clearInterval(this.simTimer);
    this.simTimer = null;
    this.simulationState.isRunning = false;
    this.broadcast('SIMULATION_STATE', this.simulationState);
  }

  public setStressMode(enabled: boolean) {
    this.simulationState.stressMode = enabled;
    this.broadcast('SIMULATION_STATE', this.simulationState);
  }

  public getSimulationState(): SimulationState {
    return { ...this.simulationState };
  }

  public getMachines(): Machine[] {
    return this.machines;
  }

  public getMachine(id: string): Machine | undefined {
    return this.machines.find(m => m.id === id);
  }

  public getIssues(filters?: { role?: string; severity?: string; status?: string; machineId?: string }): Issue[] {
    let list = [...this.issues];
    if (filters?.role && filters.role !== 'ALL') {
      list = list.filter(i => i.primaryRole === filters.role || i.secondaryRoles.includes(filters.role as UserRole));
    }
    if (filters?.severity && filters.severity !== 'ALL') {
      list = list.filter(i => i.severity === filters.severity);
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(i => i.status === filters.status);
    }
    if (filters?.machineId && filters.machineId !== 'ALL') {
      list = list.filter(i => i.machineId === filters.machineId);
    }
    // Highest priority score first
    return list.sort((a, b) => b.priorityScore - a.priorityScore);
  }

  public getIssue(id: string): Issue | undefined {
    return this.issues.find(i => i.id === id);
  }

  // Priority scoring function (Downtime risk + Order urgency + AI anomaly score + Recurrence)
  public calculatePriority(
    severity: IssueSeverity,
    orderPriority: 'STANDARD' | 'HIGH' | 'CRITICAL',
    aiRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
    pastIssuesCount: number,
    manualBoost: number = 0
  ): { score: number; factors: Issue['priorityFactors'] } {
    let downtimeRisk = 10;
    if (severity === 'CRITICAL') downtimeRisk = 40;
    else if (severity === 'HIGH') downtimeRisk = 28;
    else if (severity === 'MEDIUM') downtimeRisk = 18;

    let orderUrgency = 10;
    if (orderPriority === 'CRITICAL') orderUrgency = 25;
    else if (orderPriority === 'HIGH') orderUrgency = 18;

    let anomalyScore = 8;
    if (aiRiskLevel === 'HIGH') anomalyScore = 20;
    else if (aiRiskLevel === 'MEDIUM') anomalyScore = 14;

    const recurrenceScore = Math.min(15, pastIssuesCount * 5);

    const total = Math.min(100, Math.max(5, downtimeRisk + orderUrgency + anomalyScore + recurrenceScore + manualBoost));

    return {
      score: total,
      factors: {
        downtimeRisk,
        orderUrgency,
        recurrenceScore,
        anomalyScore,
        manualOverride: manualBoost,
      },
    };
  }

  // Issue acknowledgment
  public acknowledgeIssue(issueId: string, user: string, role: UserRole, note?: string): Issue | null {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return null;

    if (issue.status === 'OPEN') {
      issue.status = 'ACKNOWLEDGED';
      issue.acknowledgedAt = new Date().toISOString();
      issue.assignedUser = user;
      issue.assignedRole = role;

      issue.activityTimeline.unshift({
        id: `ACT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user,
        role,
        action: 'Acknowledged Issue',
        note: note || 'Acknowledged and taking initial telemetry review.',
      });

      this.recalculateActiveIssueCounts();
      this.broadcast('ISSUE_UPDATED', issue);
    }
    return issue;
  }

  // Issue status update
  public updateIssueStatus(issueId: string, status: 'IN_PROGRESS' | 'RESOLVED', user: string, role: UserRole, note?: string): Issue | null {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return null;

    issue.status = status;
    if (status === 'RESOLVED') {
      issue.resolvedAt = new Date().toISOString();
      // Lower machine risk if all critical issues resolved
      const machine = this.machines.find(m => m.id === issue.machineId);
      if (machine) {
        machine.status = 'OK';
        machine.aiRiskLevel = 'LOW';
        machine.aiRiskScore = Math.max(10, machine.aiRiskScore - 30);
      }
    }

    issue.activityTimeline.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user,
      role,
      action: status === 'IN_PROGRESS' ? 'Started Work' : 'Resolved Issue',
      note: note || (status === 'IN_PROGRESS' ? 'Investigation and diagnostic work started on-site.' : 'Issue cleared, machine returned to nominal specifications.'),
    });

    this.recalculateActiveIssueCounts();
    this.broadcast('ISSUE_UPDATED', issue);
    return issue;
  }

  // Assign issue
  public assignIssue(issueId: string, assignedUser: string, assignedRole: UserRole, assigner: string): Issue | null {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return null;

    issue.assignedUser = assignedUser;
    issue.assignedRole = assignedRole;

    issue.activityTimeline.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: assigner,
      role: 'SUPERVISOR',
      action: 'Reassigned Issue',
      note: `Assigned to ${assignedUser} (${assignedRole})`,
    });

    this.broadcast('ISSUE_UPDATED', issue);
    return issue;
  }

  // Supervisor manual priority override
  public overridePriority(issueId: string, manualDelta: number, supervisorName: string, note?: string): Issue | null {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return null;

    const machine = this.machines.find(m => m.id === issue.machineId);
    const pastCount = this.issues.filter(i => i.machineId === issue.machineId && i.id !== issue.id).length;

    const calc = this.calculatePriority(
      issue.severity,
      machine ? machine.currentOrder.priority : 'STANDARD',
      issue.aiDiagnosis.riskLevel,
      pastCount,
      manualDelta
    );

    issue.priorityScore = calc.score;
    issue.priorityFactors = calc.factors;

    issue.activityTimeline.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: supervisorName,
      role: 'SUPERVISOR',
      action: 'Priority Overridden',
      note: note || `Priority adjusted by supervisor (Score: ${calc.score}).`,
    });

    this.broadcast('ISSUE_UPDATED', issue);
    return issue;
  }

  // Update AI Diagnosis (from Gemini API or deep analysis)
  public updateAiDiagnosis(issueId: string, diagnosis: Partial<Issue['aiDiagnosis']>): Issue | null {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return null;

    issue.aiDiagnosis = {
      ...issue.aiDiagnosis,
      ...diagnosis,
      isDeepAnalysis: true,
      analyzedAt: new Date().toISOString(),
    };

    issue.activityTimeline.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Gemini Industrial Intelligence',
      role: 'MAINTENANCE',
      action: 'Deep AI Diagnosis Completed',
      note: `Analyzed root cause with ${diagnosis.confidence || 92}% confidence.`,
    });

    this.broadcast('ISSUE_UPDATED', issue);
    return issue;
  }

  // Inject specific anomaly scenario (for hackathon demos)
  public injectAnomaly(scenario: 'OVERHEAT' | 'BEARING_WEAR' | 'PRESSURE_LEAK' | 'THROUGHPUT_DROP', machineId?: string): Issue {
    const targetMachine = machineId ? this.machines.find(m => m.id === machineId) || this.machines[0] : this.machines[Math.floor(Math.random() * this.machines.length)];
    const id = `ISS-${1050 + this.issues.length}`;
    const timestamp = new Date().toISOString();

    let title = '';
    let description = '';
    let type: Issue['type'] = 'MECHANICAL';
    let severity: IssueSeverity = 'HIGH';
    let primaryRole: UserRole = 'MAINTENANCE';
    let secondaryRoles: UserRole[] = ['OPERATOR', 'SUPERVISOR'];
    let estMinutes = 30;
    let rootCause = '';
    let actions: string[] = [];

    switch (scenario) {
      case 'OVERHEAT':
        title = `Critical Thermal Exceedance & Coolant Flow Loss`;
        description = `Core temperature spiked to ${+(targetMachine.nominal.temperature.critical * 1.05).toFixed(1)}°C, exceeding safety limits. High risk of thermal distortion.`;
        type = 'THERMAL';
        severity = 'CRITICAL';
        primaryRole = 'MAINTENANCE';
        secondaryRoles = ['OPERATOR', 'SUPERVISOR', 'MANAGER'];
        estMinutes = 45;
        rootCause = 'Coolant heat exchanger circulation pump trip or secondary thermal relief valve seized.';
        actions = [
          'Immediate safety cycle halt or lower load override to 50%',
          'Check coolant fluid flow meter and strainer for debris',
          'Inspect auxiliary radiator heat sink fans for blown fuse',
          'Allow controlled cooling to prevent thermal shock warping',
        ];
        targetMachine.status = 'CRITICAL';
        targetMachine.lastTelemetry.temperature = +(targetMachine.nominal.temperature.critical * 1.06).toFixed(1);
        targetMachine.aiRiskLevel = 'HIGH';
        targetMachine.aiRiskScore = 92;
        break;

      case 'BEARING_WEAR':
        title = `Abnormal Harmonic Vibration & High-Frequency Noise`;
        description = `Vibration transducer registered ${+(targetMachine.nominal.vibration.critical * 1.1).toFixed(2)} mm/s. AI model flags bearing race degradation.`;
        type = 'MECHANICAL';
        severity = 'HIGH';
        primaryRole = 'MAINTENANCE';
        secondaryRoles = ['OPERATOR', 'SUPERVISOR'];
        estMinutes = 35;
        rootCause = 'Bearing cage micro-fracture or contamination in high-speed spindle assembly.';
        actions = [
          'Perform tactile and acoustic stethoscope inspection on drive bearing housings',
          'Inspect lubrication pump discharge pressure and grease delivery tubing',
          'Schedule spindle runout check during next shift break',
        ];
        targetMachine.status = 'WARNING';
        targetMachine.lastTelemetry.vibration = +(targetMachine.nominal.vibration.critical * 1.1).toFixed(2);
        targetMachine.aiRiskLevel = 'HIGH';
        targetMachine.aiRiskScore = 85;
        break;

      case 'PRESSURE_LEAK':
        title = `Hydraulic System Pressure Loss & Valve Cavitation`;
        description = `Main pressure accumulator dropped to ${+(targetMachine.nominal.pressure.min * 0.8).toFixed(1)} bar. Pressure regulation unstable.`;
        type = 'MECHANICAL';
        severity = 'HIGH';
        primaryRole = 'MAINTENANCE';
        secondaryRoles = ['OPERATOR', 'SUPERVISOR'];
        estMinutes = 25;
        rootCause = 'Proportional relief valve seal degradation or nitrogen pre-charge loss in accumulator.';
        actions = [
          'Check hydraulic power pack oil level and filter bypass warning lamp',
          'Inspect main hose manifolds for weeping or pinhole leaks',
          'Verify nitrogen charge pressure on accumulator bladder',
        ];
        targetMachine.status = 'WARNING';
        targetMachine.lastTelemetry.pressure = +(targetMachine.nominal.pressure.min * 0.8).toFixed(1);
        targetMachine.aiRiskLevel = 'MEDIUM';
        targetMachine.aiRiskScore = 65;
        break;

      case 'THROUGHPUT_DROP':
        title = `Severe Feed Rate Choke & Part Starvation Bottleneck`;
        description = `Throughput collapsed from ${targetMachine.nominal.throughput.nominal} pcs/min down to ${Math.round(targetMachine.nominal.throughput.critical * 0.7)} pcs/min. Downstream lines idling.`;
        type = 'THROUGHPUT_DROP';
        severity = 'HIGH';
        primaryRole = 'OPERATOR';
        secondaryRoles = ['SUPERVISOR'];
        estMinutes = 20;
        rootCause = 'Infeed chute photocell optical obstruction or feeder magazine jam.';
        actions = [
          'Inspect infeed conveyor belt for jammed blanks or misaligned stock',
          'Clean optical presence sensors with dry compressed air',
          'Verify raw material pallet stack height and hopper feed switch',
        ];
        targetMachine.status = 'WARNING';
        targetMachine.lastTelemetry.throughput = Math.round(targetMachine.nominal.throughput.critical * 0.7);
        targetMachine.aiRiskLevel = 'MEDIUM';
        targetMachine.aiRiskScore = 60;
        break;
    }

    const pastCount = this.issues.filter(i => i.machineId === targetMachine.id).length;
    const priorityCalc = this.calculatePriority(severity, targetMachine.currentOrder.priority, targetMachine.aiRiskLevel, pastCount);

    const newIssue: Issue = {
      id,
      machineId: targetMachine.id,
      machineName: targetMachine.name,
      line: targetMachine.line,
      title,
      description,
      type,
      severity,
      status: 'OPEN',
      createdAt: timestamp,
      priorityScore: priorityCalc.score,
      primaryRole,
      secondaryRoles,
      assignedRole: primaryRole,
      assignedUser: null,
      estimatedDowntimeMinutes: estMinutes,
      estimatedCost: estMinutes * targetMachine.costPerDowntimeMinute,
      isSimulated: true,
      isAiEstimated: true,
      priorityFactors: priorityCalc.factors,
      aiDiagnosis: {
        riskLevel: targetMachine.aiRiskLevel,
        suggestedRootCause: rootCause,
        confidence: 88,
        recommendedActions: actions,
        isDeepAnalysis: false,
      },
      activityTimeline: [
        {
          id: `ACT-${Date.now()}`,
          timestamp,
          user: 'System Event Stream',
          role: primaryRole,
          action: 'Issue Triggered',
          note: `Auto-generated from telemetry deviation on ${targetMachine.id}.`,
        },
      ],
      telemetrySnapshot: { ...targetMachine.lastTelemetry },
    };

    this.issues.unshift(newIssue);
    this.recalculateActiveIssueCounts();

    this.broadcast('NEW_ISSUE', newIssue);
    this.broadcast('MACHINE_UPDATED', targetMachine);

    return newIssue;
  }

  // Simulation tick logic (every 2s)
  private tick() {
    this.simulationState.totalEventsEmitted += this.machines.length;
    this.simulationState.lastTick = new Date().toISOString();
    const nowIso = new Date().toISOString();

    const stressProbability = this.simulationState.stressMode ? 0.35 : 0.04;

    this.machines.forEach(machine => {
      // Nominal jitter
      const tempDelta = (Math.random() - 0.5) * 0.8;
      const vibDelta = (Math.random() - 0.5) * 0.08;
      const tputDelta = Math.round((Math.random() - 0.5) * 2);
      const pressDelta = (Math.random() - 0.5) * 0.9;

      let newTemp = +(machine.lastTelemetry.temperature + tempDelta).toFixed(1);
      let newVib = +(machine.lastTelemetry.vibration + vibDelta).toFixed(2);
      let newTput = machine.lastTelemetry.throughput + tputDelta;
      let newPress = +(machine.lastTelemetry.pressure + pressDelta).toFixed(1);

      // Keep within realistic bounds unless an issue is active
      const hasActiveCritical = this.issues.some(i => i.machineId === machine.id && (i.status === 'OPEN' || i.status === 'IN_PROGRESS') && i.severity === 'CRITICAL');
      const hasActiveHigh = this.issues.some(i => i.machineId === machine.id && (i.status === 'OPEN' || i.status === 'IN_PROGRESS') && i.severity === 'HIGH');

      if (!hasActiveCritical && !hasActiveHigh) {
        // Soft pull towards nominal
        newTemp = +(newTemp * 0.95 + machine.nominal.temperature.nominal * 0.05).toFixed(1);
        newVib = +(newVib * 0.95 + machine.nominal.vibration.nominal * 0.05).toFixed(2);
        newTput = Math.round(newTput * 0.95 + machine.nominal.throughput.nominal * 0.05);
        newPress = +(newPress * 0.95 + machine.nominal.pressure.nominal * 0.05).toFixed(1);
        machine.status = 'OK';
        machine.aiRiskLevel = 'LOW';
      }

      // Random natural anomaly injection if stressMode or lucky roll
      if (Math.random() < stressProbability && !hasActiveCritical) {
        const scenarios: Array<'OVERHEAT' | 'BEARING_WEAR' | 'PRESSURE_LEAK' | 'THROUGHPUT_DROP'> = [
          'OVERHEAT',
          'BEARING_WEAR',
          'PRESSURE_LEAK',
          'THROUGHPUT_DROP',
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        this.injectAnomaly(scenario, machine.id);
      }

      const telemetryPoint: MachineTelemetry = {
        timestamp: nowIso,
        temperature: newTemp,
        vibration: Math.max(0.1, newVib),
        throughput: Math.max(0, newTput),
        pressure: Math.max(0, newPress),
        errorCode: machine.status === 'CRITICAL' ? 'ERR_SYS_HALT' : machine.status === 'WARNING' ? 'WARN_EXCEED' : null,
        isSimulated: true,
      };

      machine.lastTelemetry = telemetryPoint;
      machine.telemetryHistory.push(telemetryPoint);
      if (machine.telemetryHistory.length > 30) {
        machine.telemetryHistory.shift();
      }

      // Slowly increment partsDone for realism
      if (machine.status !== 'CRITICAL') {
        machine.currentOrder.partsDone = Math.min(
          machine.currentOrder.partsTarget,
          machine.currentOrder.partsDone + Math.round(newTput / 30)
        );
      }
    });

    this.recalculateActiveIssueCounts();

    this.broadcast('TELEMETRY_PACKET', {
      timestamp: nowIso,
      machines: this.machines.map(m => ({
        id: m.id,
        name: m.name,
        status: m.status,
        lastTelemetry: m.lastTelemetry,
        aiRiskLevel: m.aiRiskLevel,
        aiRiskScore: m.aiRiskScore,
        currentOrder: m.currentOrder,
      })),
    });
  }

  private recalculateActiveIssueCounts() {
    this.machines.forEach(m => {
      m.activeIssuesCount = this.issues.filter(i => i.machineId === m.id && (i.status === 'OPEN' || i.status === 'ACKNOWLEDGED' || i.status === 'IN_PROGRESS')).length;
      if (m.activeIssuesCount > 0) {
        const highestActive = this.issues.find(i => i.machineId === m.id && (i.status === 'OPEN' || i.status === 'IN_PROGRESS'));
        if (highestActive) {
          m.status = highestActive.severity === 'CRITICAL' ? 'CRITICAL' : 'WARNING';
        }
      } else {
        m.status = 'OK';
      }
    });
  }

  // Analytics computation
  public getAnalyticsSummary(): AnalyticsSummary {
    const totalIssues = this.issues.length;
    const activeIssues = this.issues.filter(i => i.status !== 'RESOLVED').length;
    const resolvedIssues = this.issues.filter(i => i.status === 'RESOLVED').length;

    // MTTA calculation
    const acked = this.issues.filter(i => i.acknowledgedAt);
    let totalAckMinutes = 0;
    acked.forEach(i => {
      const diffMs = new Date(i.acknowledgedAt!).getTime() - new Date(i.createdAt).getTime();
      totalAckMinutes += Math.max(0.5, diffMs / (1000 * 60));
    });
    const mttaMinutes = acked.length > 0 ? +(totalAckMinutes / acked.length).toFixed(1) : 4.2;

    // MTTR calculation
    const resolved = this.issues.filter(i => i.resolvedAt);
    let totalResolveMinutes = 0;
    resolved.forEach(i => {
      const diffMs = new Date(i.resolvedAt!).getTime() - new Date(i.createdAt).getTime();
      totalResolveMinutes += Math.max(2, diffMs / (1000 * 60));
    });
    const mttrMinutes = resolved.length > 0 ? +(totalResolveMinutes / resolved.length).toFixed(1) : 28.5;

    // Total downtime and cost
    let totalDowntimeMinutes = 0;
    let totalEstimatedCost = 0;
    this.issues.forEach(i => {
      totalDowntimeMinutes += i.estimatedDowntimeMinutes;
      totalEstimatedCost += i.estimatedCost;
    });

    // Breakdown by machine
    const issuesByMachine = this.machines.map(m => {
      const mIssues = this.issues.filter(i => i.machineId === m.id);
      return {
        machineId: m.id,
        machineName: m.name,
        count: mIssues.length,
        criticalCount: mIssues.filter(i => i.severity === 'CRITICAL').length,
      };
    });

    // Breakdown by severity
    const severities: IssueSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const issuesBySeverity = severities.map(s => ({
      severity: s,
      count: this.issues.filter(i => i.severity === s).length,
    }));

    // Breakdown by role
    const roles: UserRole[] = ['OPERATOR', 'SUPERVISOR', 'MAINTENANCE', 'MANAGER'];
    const issuesByRole = roles.map(r => ({
      role: r,
      count: this.issues.filter(i => i.primaryRole === r).length,
    }));

    // Hourly timeline for last 6 hours
    const hourlyTimeline = [
      { hour: '18:00', count: 1, resolved: 1 },
      { hour: '19:00', count: 2, resolved: 2 },
      { hour: '20:00', count: 1, resolved: 1 },
      { hour: '21:00', count: 3, resolved: 2 },
      { hour: '22:00', count: 2, resolved: 1 },
      { hour: 'Live', count: activeIssues, resolved: resolvedIssues },
    ];

    return {
      totalIssues,
      activeIssues,
      resolvedIssues,
      mttaMinutes,
      mttrMinutes,
      totalDowntimeMinutes,
      totalEstimatedCost,
      issuesByMachine,
      issuesBySeverity,
      issuesByRole,
      hourlyTimeline,
      aiAccuracyInsight: {
        totalPredicted: this.issues.filter(i => i.isAiEstimated).length,
        highRiskCorrelationPercent: 87.4,
        preventedDowntimeEstimateHours: +(totalDowntimeMinutes * 0.35 / 60).toFixed(1),
      },
    };
  }
}

export const orchestratorStore = new OrchestratorStore();
