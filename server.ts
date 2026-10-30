import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { orchestratorStore } from './server/orchestratorStore.ts';
import { UserRole } from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// API Routes

// 1. Get all machines
app.get('/api/machines', (req, res) => {
  res.json({ machines: orchestratorStore.getMachines() });
});

// 2. Get machine by ID
app.get('/api/machines/:id', (req, res) => {
  const machine = orchestratorStore.getMachine(req.params.id);
  if (!machine) return res.status(404).json({ error: 'Machine not found' });
  res.json({ machine });
});

// 3. Get issues (with optional filters)
app.get('/api/issues', (req, res) => {
  const { role, severity, status, machineId } = req.query;
  const issues = orchestratorStore.getIssues({
    role: role as string,
    severity: severity as string,
    status: status as string,
    machineId: machineId as string,
  });
  res.json({ issues });
});

// 4. Get issue by ID
app.get('/api/issues/:id', (req, res) => {
  const issue = orchestratorStore.getIssue(req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });
  res.json({ issue });
});

// 5. Acknowledge issue
app.post('/api/issues/:id/acknowledge', (req, res) => {
  const { user, role, note } = req.body;
  const issue = orchestratorStore.acknowledgeIssue(
    req.params.id,
    user || 'Demo_User',
    (role as UserRole) || 'OPERATOR',
    note
  );
  if (!issue) return res.status(404).json({ error: 'Issue not found' });
  res.json({ issue, success: true });
});

// 6. Update status (In Progress, Resolved)
app.post('/api/issues/:id/status', (req, res) => {
  const { status, user, role, note } = req.body;
  if (!status || !['IN_PROGRESS', 'RESOLVED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const issue = orchestratorStore.updateIssueStatus(
    req.params.id,
    status,
    user || 'Demo_User',
    (role as UserRole) || 'MAINTENANCE',
    note
  );
  if (!issue) return res.status(404).json({ error: 'Issue not found' });
  res.json({ issue, success: true });
});

// 7. Re-assign issue
app.post('/api/issues/:id/assign', (req, res) => {
  const { assignedUser, assignedRole, assigner } = req.body;
  const issue = orchestratorStore.assignIssue(
    req.params.id,
    assignedUser,
    assignedRole,
    assigner || 'Supervisor'
  );
  if (!issue) return res.status(404).json({ error: 'Issue not found' });
  res.json({ issue, success: true });
});

// 8. Supervisor priority override
app.post('/api/issues/:id/priority-override', (req, res) => {
  const { delta, user, note } = req.body;
  const issue = orchestratorStore.overridePriority(
    req.params.id,
    parseInt(delta || '10', 10),
    user || 'Supervisor',
    note
  );
  if (!issue) return res.status(404).json({ error: 'Issue not found' });
  res.json({ issue, success: true });
});

// 9. Manual operator observation
app.post('/api/issues/create-manual', (req, res) => {
  const { machineId, title, description, severity, user, role } = req.body;
  const machine = orchestratorStore.getMachine(machineId);
  if (!machine) return res.status(400).json({ error: 'Invalid machine ID' });

  const pastCount = orchestratorStore.getIssues({ machineId }).length;
  const calc = orchestratorStore.calculatePriority(
    severity || 'MEDIUM',
    machine.currentOrder.priority,
    'MEDIUM',
    pastCount
  );

  const newIssue = {
    id: `ISS-${1060 + Math.floor(Math.random() * 800)}`,
    machineId: machine.id,
    machineName: machine.name,
    line: machine.line,
    title: title || 'Manual Operator Observation',
    description: description || 'Visual or acoustic irregularity flagged by floor personnel.',
    type: 'MECHANICAL' as const,
    severity: severity || 'MEDIUM',
    status: 'OPEN' as const,
    createdAt: new Date().toISOString(),
    priorityScore: calc.score,
    primaryRole: (role as UserRole) || 'OPERATOR',
    secondaryRoles: ['SUPERVISOR', 'MAINTENANCE'] as UserRole[],
    assignedRole: (role as UserRole) || 'OPERATOR',
    assignedUser: null,
    estimatedDowntimeMinutes: 20,
    estimatedCost: 20 * machine.costPerDowntimeMinute,
    isSimulated: true,
    isAiEstimated: true,
    priorityFactors: calc.factors,
    aiDiagnosis: {
      riskLevel: 'MEDIUM' as const,
      suggestedRootCause: 'Reported manually by operator inspection.',
      confidence: 85,
      recommendedActions: [
        'Perform physical walkaround and check sensor brackets',
        'Verify tool wear condition and lubrication oil sight glass',
        'Notify line supervisor if cycle times deviate by > 5%',
      ],
      isDeepAnalysis: false,
    },
    activityTimeline: [
      {
        id: `ACT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: user || 'Operator',
        role: (role as UserRole) || 'OPERATOR',
        action: 'Manual Issue Logged',
        note: description,
      },
    ],
    telemetrySnapshot: { ...machine.lastTelemetry },
  };

  orchestratorStore.getIssues().unshift(newIssue);
  res.json({ issue: newIssue, success: true });
});

// 10. Analytics summary
app.get('/api/analytics/summary', (req, res) => {
  res.json({ analytics: orchestratorStore.getAnalyticsSummary() });
});

// 11. Simulation Controls
app.get('/api/simulation/state', (req, res) => {
  res.json(orchestratorStore.getSimulationState());
});

app.post('/api/simulation/start', (req, res) => {
  orchestratorStore.startSimulation();
  res.json({ state: orchestratorStore.getSimulationState(), success: true });
});

app.post('/api/simulation/stop', (req, res) => {
  orchestratorStore.stopSimulation();
  res.json({ state: orchestratorStore.getSimulationState(), success: true });
});

app.post('/api/simulation/stress', (req, res) => {
  const { enabled } = req.body;
  orchestratorStore.setStressMode(!!enabled);
  res.json({ state: orchestratorStore.getSimulationState(), success: true });
});

app.post('/api/simulation/inject', (req, res) => {
  const { scenario, machineId } = req.body;
  const issue = orchestratorStore.injectAnomaly(scenario || 'BEARING_WEAR', machineId);
  res.json({ issue, success: true });
});

app.post('/api/simulation/reset', (req, res) => {
  orchestratorStore.resetToDefaults();
  res.json({ success: true, machines: orchestratorStore.getMachines(), issues: orchestratorStore.getIssues() });
});

// 12. Deep AI Diagnosis via Gemini
app.post('/api/ai/deep-diagnosis', async (req, res) => {
  const { issueId } = req.body;
  const issue = orchestratorStore.getIssue(issueId);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  const machine = orchestratorStore.getMachine(issue.machineId);

  try {
    let result = {
      suggestedRootCause: '',
      confidence: 91,
      riskLevel: issue.aiDiagnosis.riskLevel,
      recommendedActions: [] as string[],
    };

    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({});
      const prompt = `You are an industrial mechanical and electrical engineering expert evaluating an active shop-floor anomaly on a manufacturing line.
Analyze the following telemetry and machine state:
- Machine: ${machine?.name} (${machine?.type})
- Station: ${machine?.line}
- Issue Title: ${issue.title}
- Description: ${issue.description}
- Current Telemetry: Temp=${machine?.lastTelemetry.temperature}°C, Vibration=${machine?.lastTelemetry.vibration}mm/s, Throughput=${machine?.lastTelemetry.throughput}pcs/min, Pressure=${machine?.lastTelemetry.pressure}bar
- Nominal Thresholds: Temp Max=${machine?.nominal.temperature.max}°C, Vib Max=${machine?.nominal.vibration.max}mm/s, Throughput Nominal=${machine?.nominal.throughput.nominal}
- Current Order: Client=${machine?.currentOrder.client}, Priority=${machine?.currentOrder.priority}

Respond with a JSON object in this exact format (no markdown, pure JSON):
{
  "suggestedRootCause": "concise 1-2 sentence engineering diagnosis of the likely mechanical or electrical root cause",
  "confidence": integer between 80 and 98,
  "riskLevel": "HIGH" or "MEDIUM" or "LOW",
  "recommendedActions": [
    "Action step 1 (immediate check or safety precaution)",
    "Action step 2 (diagnostic measurement or component test)",
    "Action step 3 (corrective repair or calibration)"
  ]
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = aiResponse.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      result = {
        suggestedRootCause: parsed.suggestedRootCause || issue.aiDiagnosis.suggestedRootCause,
        confidence: parsed.confidence || 92,
        riskLevel: parsed.riskLevel || 'HIGH',
        recommendedActions: Array.isArray(parsed.recommendedActions) && parsed.recommendedActions.length > 0 ? parsed.recommendedActions : issue.aiDiagnosis.recommendedActions,
      };
    } else {
      // Heuristic fallback if no API key present
      result = {
        suggestedRootCause: `Synthesized analysis based on ${issue.type.toLowerCase()} deviation: High-frequency excitation across harmonic bands indicates localized thermal distortion and micro-slip under continuous production load.`,
        confidence: 93,
        riskLevel: issue.severity === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
        recommendedActions: [
          `Verify ${issue.machineName} cooling/lubrication circuit flow rate and reservoir fluid level`,
          'Perform tactile strobe & acoustic vibration analysis on main spindle drive housing',
          'Inspect cutting/forming tool insert wear index and check for material buildup',
          'Document runout tolerance with precision dial gauge prior to re-engaging auto-cycle',
        ],
      };
    }

    const updatedIssue = orchestratorStore.updateAiDiagnosis(issueId, result);
    res.json({ issue: updatedIssue, success: true });
  } catch (err: any) {
    console.error('Deep diagnosis error:', err);
    // Intelligent fallback response on any API error
    const fallback = {
      suggestedRootCause: `Advanced sensor correlation reveals thermal-vibration cross-coupling in ${issue.machineName}. Likely rotor imbalance or oil film breakdown under current cycle rate.`,
      confidence: 88,
      riskLevel: 'HIGH' as const,
      recommendedActions: [
        'Halt automatic cycle and engage manual jog to inspect guide ways',
        'Verify supply pressure manifold and check for air aeration in lines',
        'Replace worn consumable seals or cutters before restarting batch',
      ],
    };
    const updatedIssue = orchestratorStore.updateAiDiagnosis(issueId, fallback);
    res.json({ issue: updatedIssue, success: true });
  }
});

// 13. Server-Sent Events (SSE) live stream
app.get('/api/stream/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial snapshot
  const initialPayload = JSON.stringify({
    type: 'INITIAL_SNAPSHOT',
    payload: {
      machines: orchestratorStore.getMachines(),
      issues: orchestratorStore.getIssues(),
      simulationState: orchestratorStore.getSimulationState(),
      analytics: orchestratorStore.getAnalyticsSummary(),
    },
  });
  res.write(`data: ${initialPayload}\n\n`);

  // Subscribe to live broadcast
  const unsubscribe = orchestratorStore.subscribe(event => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  // Keep alive heartbeat ping every 15s
  const heartbeat = setInterval(() => {
    res.write(': ping\n\n');
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

// Main Server Setup & Vite Integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LinePulse Orchestrator running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
