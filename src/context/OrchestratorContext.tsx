import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Machine, Issue, UserRole, UserProfile, SimulationState, AnalyticsSummary, IssueSeverity } from '../types/index.ts';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  severity: IssueSeverity;
  timestamp: string;
  primaryRole: UserRole;
  machineId: string;
}

interface OrchestratorContextType {
  machines: Machine[];
  issues: Issue[];
  currentUser: UserProfile;
  simulationState: SimulationState;
  analytics: AnalyticsSummary | null;
  connectionStatus: 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';
  activeTab: 'overview' | 'queue' | 'analytics';
  selectedIssueId: string | null;
  selectedMachineId: string | null;
  notifications: NotificationItem[];
  isSimulatorModalOpen: boolean;
  isRoleModalOpen: boolean;
  isManualIssueModalOpen: boolean;
  unreadCountForUser: number;
  
  // Actions
  setActiveTab: (tab: 'overview' | 'queue' | 'analytics') => void;
  setSelectedIssueId: (id: string | null) => void;
  setSelectedMachineId: (id: string | null) => void;
  setIsSimulatorModalOpen: (open: boolean) => void;
  setIsRoleModalOpen: (open: boolean) => void;
  setIsManualIssueModalOpen: (open: boolean) => void;
  switchUserRole: (role: UserRole, name?: string) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Issue operations
  acknowledgeIssue: (issueId: string, note?: string) => Promise<boolean>;
  updateIssueStatus: (issueId: string, status: 'IN_PROGRESS' | 'RESOLVED', note?: string) => Promise<boolean>;
  assignIssue: (issueId: string, assignedUser: string, assignedRole: UserRole) => Promise<boolean>;
  overridePriority: (issueId: string, delta: number, note?: string) => Promise<boolean>;
  createManualIssue: (data: { machineId: string; title: string; description: string; severity: IssueSeverity }) => Promise<boolean>;
  runDeepAiDiagnosis: (issueId: string) => Promise<boolean>;

  // Simulation operations
  toggleSimulation: () => Promise<void>;
  toggleStressMode: () => Promise<void>;
  injectAnomaly: (scenario: 'OVERHEAT' | 'BEARING_WEAR' | 'PRESSURE_LEAK' | 'THROUGHPUT_DROP', machineId?: string) => Promise<void>;
  resetSimulation: () => Promise<void>;
}

const PRESET_USERS: Record<UserRole, UserProfile> = {
  OPERATOR: {
    id: 'user_ana',
    name: 'Ana Silva',
    role: 'OPERATOR',
    avatar: 'AS',
    stationOrLine: 'Line 1 & 2 Floor Cell',
  },
  SUPERVISOR: {
    id: 'user_marcus',
    name: 'Marcus Vance',
    role: 'SUPERVISOR',
    avatar: 'MV',
    stationOrLine: 'Plant Operations Hub',
  },
  MAINTENANCE: {
    id: 'user_ravi',
    name: 'Ravi Patel',
    role: 'MAINTENANCE',
    avatar: 'RP',
    stationOrLine: 'Predictive Reliability Unit',
  },
  MANAGER: {
    id: 'user_chen',
    name: 'Dr. Linda Chen',
    role: 'MANAGER',
    avatar: 'LC',
    stationOrLine: 'Operations Executive',
  },
};

const OrchestratorContext = createContext<OrchestratorContextType | null>(null);

export const OrchestratorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'CONNECTING' | 'DISCONNECTED'>('CONNECTING');
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'analytics'>('overview');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isManualIssueModalOpen, setIsManualIssueModalOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: true,
    speedMs: 2000,
    stressMode: false,
    lastTick: new Date().toISOString(),
    totalEventsEmitted: 0,
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('linepulse_user_role');
      if (saved && PRESET_USERS[saved as UserRole]) {
        return PRESET_USERS[saved as UserRole];
      }
    } catch (e) {}
    return PRESET_USERS.OPERATOR;
  });

  const switchUserRole = useCallback((role: UserRole, customName?: string) => {
    const base = PRESET_USERS[role];
    const newUser: UserProfile = {
      ...base,
      name: customName || base.name,
    };
    setCurrentUser(newUser);
    try {
      localStorage.setItem('linepulse_user_role', role);
    } catch (e) {}
  }, []);

  // Fetch initial REST data as fallback
  const fetchInitialData = useCallback(async () => {
    try {
      const [mRes, iRes, aRes, sRes] = await Promise.all([
        fetch('/api/machines'),
        fetch('/api/issues'),
        fetch('/api/analytics/summary'),
        fetch('/api/simulation/state'),
      ]);
      if (mRes.ok) {
        const data = await mRes.json();
        setMachines(data.machines || []);
      }
      if (iRes.ok) {
        const data = await iRes.json();
        setIssues(data.issues || []);
      }
      if (aRes.ok) {
        const data = await aRes.json();
        setAnalytics(data.analytics || null);
      }
      if (sRes.ok) {
        const data = await sRes.json();
        setSimulationState(data);
      }
    } catch (err) {
      console.warn('Initial REST load error:', err);
    }
  }, []);

  // SSE connection
  useEffect(() => {
    fetchInitialData();

    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connectSSE = () => {
      setConnectionStatus('CONNECTING');
      eventSource = new EventSource('/api/stream/events');

      eventSource.onopen = () => {
        setConnectionStatus('CONNECTED');
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const { type, payload } = parsed;

          if (type === 'INITIAL_SNAPSHOT') {
            setMachines(payload.machines || []);
            setIssues(payload.issues || []);
            setSimulationState(payload.simulationState);
            setAnalytics(payload.analytics);
          } else if (type === 'TELEMETRY_PACKET') {
            // Update machine telemetry in real-time
            setMachines(prev => prev.map(m => {
              const updated = payload.machines.find((pm: any) => pm.id === m.id);
              if (!updated) return m;
              const newHistory = [...m.telemetryHistory, updated.lastTelemetry].slice(-30);
              return {
                ...m,
                status: updated.status,
                lastTelemetry: updated.lastTelemetry,
                aiRiskLevel: updated.aiRiskLevel,
                aiRiskScore: updated.aiRiskScore,
                currentOrder: updated.currentOrder,
                telemetryHistory: newHistory,
              };
            }));
          } else if (type === 'NEW_ISSUE') {
            setIssues(prev => [payload, ...prev.filter(i => i.id !== payload.id)]);
            // Add notification
            setNotifications(prev => [
              {
                id: `notif-${Date.now()}-${Math.random()}`,
                title: `Alert on ${payload.machineId} (${payload.severity})`,
                message: payload.title,
                severity: payload.severity,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                primaryRole: payload.primaryRole,
                machineId: payload.machineId,
              },
              ...prev.slice(0, 9),
            ]);
            // Refresh analytics
            fetch('/api/analytics/summary').then(r => r.json()).then(d => setAnalytics(d.analytics));
          } else if (type === 'ISSUE_UPDATED') {
            setIssues(prev => prev.map(i => i.id === payload.id ? payload : i));
            fetch('/api/analytics/summary').then(r => r.json()).then(d => setAnalytics(d.analytics));
          } else if (type === 'MACHINE_UPDATED') {
            setMachines(prev => prev.map(m => m.id === payload.id ? payload : m));
          } else if (type === 'SIMULATION_STATE') {
            setSimulationState(payload);
          }
        } catch (e) {
          // ignore heartbeat comments
        }
      };

      eventSource.onerror = () => {
        setConnectionStatus('DISCONNECTED');
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        reconnectTimeout = setTimeout(connectSSE, 3000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [fetchInitialData]);

  // Actions
  const acknowledgeIssue = useCallback(async (issueId: string, note?: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: currentUser.name,
          role: currentUser.role,
          note,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(prev => prev.map(i => i.id === issueId ? data.issue : i));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }, [currentUser]);

  const updateIssueStatus = useCallback(async (issueId: string, status: 'IN_PROGRESS' | 'RESOLVED', note?: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          user: currentUser.name,
          role: currentUser.role,
          note,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(prev => prev.map(i => i.id === issueId ? data.issue : i));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }, [currentUser]);

  const assignIssue = useCallback(async (issueId: string, assignedUser: string, assignedRole: UserRole) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedUser,
          assignedRole,
          assigner: currentUser.name,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(prev => prev.map(i => i.id === issueId ? data.issue : i));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }, [currentUser]);

  const overridePriority = useCallback(async (issueId: string, delta: number, note?: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/priority-override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delta,
          user: currentUser.name,
          note,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(prev => prev.map(i => i.id === issueId ? data.issue : i));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }, [currentUser]);

  const createManualIssue = useCallback(async (data: { machineId: string; title: string; description: string; severity: IssueSeverity }) => {
    try {
      const res = await fetch('/api/issues/create-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          user: currentUser.name,
          role: currentUser.role,
        }),
      });
      if (res.ok) {
        const resData = await res.json();
        setIssues(prev => [resData.issue, ...prev]);
        setIsManualIssueModalOpen(false);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }, [currentUser]);

  const runDeepAiDiagnosis = useCallback(async (issueId: string) => {
    try {
      const res = await fetch('/api/ai/deep-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId }),
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(prev => prev.map(i => i.id === issueId ? data.issue : i));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }, []);

  const toggleSimulation = useCallback(async () => {
    const endpoint = simulationState.isRunning ? '/api/simulation/stop' : '/api/simulation/start';
    const res = await fetch(endpoint, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setSimulationState(data.state);
    }
  }, [simulationState.isRunning]);

  const toggleStressMode = useCallback(async () => {
    const res = await fetch('/api/simulation/stress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !simulationState.stressMode }),
    });
    if (res.ok) {
      const data = await res.json();
      setSimulationState(data.state);
    }
  }, [simulationState.stressMode]);

  const injectAnomaly = useCallback(async (scenario: 'OVERHEAT' | 'BEARING_WEAR' | 'PRESSURE_LEAK' | 'THROUGHPUT_DROP', machineId?: string) => {
    const res = await fetch('/api/simulation/inject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario, machineId }),
    });
    if (res.ok) {
      const data = await res.json();
      setIssues(prev => [data.issue, ...prev.filter(i => i.id !== data.issue.id)]);
      setSelectedIssueId(data.issue.id);
    }
  }, []);

  const resetSimulation = useCallback(async () => {
    const res = await fetch('/api/simulation/reset', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setMachines(data.machines);
      setIssues(data.issues);
      setNotifications([]);
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Compute unread/relevant issues for user's role
  const unreadCountForUser = issues.filter(
    i => (i.status === 'OPEN' || i.status === 'ACKNOWLEDGED') &&
         (i.primaryRole === currentUser.role || i.secondaryRoles.includes(currentUser.role))
  ).length;

  return (
    <OrchestratorContext.Provider
      value={{
        machines,
        issues,
        currentUser,
        simulationState,
        analytics,
        connectionStatus,
        activeTab,
        selectedIssueId,
        selectedMachineId,
        notifications,
        isSimulatorModalOpen,
        isRoleModalOpen,
        isManualIssueModalOpen,
        unreadCountForUser,
        setActiveTab,
        setSelectedIssueId,
        setSelectedMachineId,
        setIsSimulatorModalOpen,
        setIsRoleModalOpen,
        setIsManualIssueModalOpen,
        switchUserRole,
        dismissNotification,
        clearAllNotifications,
        acknowledgeIssue,
        updateIssueStatus,
        assignIssue,
        overridePriority,
        createManualIssue,
        runDeepAiDiagnosis,
        toggleSimulation,
        toggleStressMode,
        injectAnomaly,
        resetSimulation,
      }}
    >
      {children}
    </OrchestratorContext.Provider>
  );
};

export const useOrchestrator = () => {
  const context = useContext(OrchestratorContext);
  if (!context) {
    throw new Error('useOrchestrator must be used within OrchestratorProvider');
  }
  return context;
};
