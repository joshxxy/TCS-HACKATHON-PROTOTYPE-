import React, { useState } from 'react';
import { useOrchestrator } from '../context/OrchestratorContext.tsx';
import { UserRole } from '../types/index.ts';
import {
  X,
  Sparkles,
  AlertTriangle,
  Clock,
  DollarSign,
  User,
  CheckCircle2,
  Play,
  RotateCcw,
  MessageSquare,
  ShieldAlert,
  Sliders,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export const IssueDetailModal: React.FC = () => {
  const {
    issues,
    machines,
    selectedIssueId,
    setSelectedIssueId,
    setSelectedMachineId,
    currentUser,
    acknowledgeIssue,
    updateIssueStatus,
    assignIssue,
    overridePriority,
    runDeepAiDiagnosis,
  } = useOrchestrator();

  const [technicianNote, setTechnicianNote] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [priorityDelta, setPriorityDelta] = useState<number>(10);
  const [isOverrideOpen, setIsOverrideOpen] = useState<boolean>(false);
  const [assigneeUser, setAssigneeUser] = useState<string>('Tech_Ravi');
  const [assigneeRole, setAssigneeRole] = useState<UserRole>('MAINTENANCE');

  if (!selectedIssueId) return null;

  const issue = issues.find((i) => i.id === selectedIssueId);
  if (!issue) return null;

  const machine = machines.find((m) => m.id === issue.machineId);

  const handleAcknowledge = async () => {
    await acknowledgeIssue(issue.id, technicianNote || undefined);
    setTechnicianNote('');
  };

  const handleStartWork = async () => {
    await updateIssueStatus(issue.id, 'IN_PROGRESS', technicianNote || undefined);
    setTechnicianNote('');
  };

  const handleResolve = async () => {
    await updateIssueStatus(issue.id, 'RESOLVED', technicianNote || undefined);
    setTechnicianNote('');
  };

  const handleAssign = async () => {
    await assignIssue(issue.id, assigneeUser, assigneeRole);
  };

  const handleOverridePriority = async () => {
    await overridePriority(issue.id, priorityDelta, `Adjusted by ${currentUser.name}`);
    setIsOverrideOpen(false);
  };

  const handleRunDeepAi = async () => {
    setIsAiLoading(true);
    await runDeepAiDiagnosis(issue.id);
    setIsAiLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {issue.id}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedMachineId(issue.machineId);
                  setSelectedIssueId(null);
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline decoration-emerald-500/40 flex items-center gap-1"
              >
                <span>{issue.machineName} ({issue.machineId})</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">{issue.line}</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{issue.title}</h2>
          </div>

          <button
            type="button"
            onClick={() => setSelectedIssueId(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
          {/* Priority & Status Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <div className="text-[11px] text-slate-400">Calculated Priority Score</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {issue.priorityScore}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    issue.severity === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      : issue.severity === 'HIGH'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {issue.severity}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Risk:{issue.priorityFactors.downtimeRisk} | Order:{issue.priorityFactors.orderUrgency} | AI:{issue.priorityFactors.anomalyScore}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Current Status & Assignee</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-white">{issue.status}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-emerald-300 font-medium font-mono">
                  {issue.assignedUser || 'Unassigned'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Primary Assigned Role: <strong className="text-slate-300">{issue.primaryRole}</strong>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Simulated Downtime Impact</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-amber-300 font-mono tabular-nums">
                  ${issue.estimatedCost.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-mono">~{issue.estimatedDowntimeMinutes}m</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Rate: ${machine?.costPerDowntimeMinute || 60}/min (simulated estimate)
              </div>
            </div>
          </div>

          {/* Description & Symptoms */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Incident Description & Sensor Symptoms
            </h4>
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3.5 text-slate-300 text-xs leading-relaxed">
              {issue.description}
            </div>
          </div>

          {/* Machine Telemetry at Alert Snapshot */}
          {machine && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Live Sensor Telemetry
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-[10px] text-slate-400">Temperature</div>
                  <div className="text-base font-bold font-mono text-white tabular-nums mt-0.5">
                    {machine.lastTelemetry.temperature}°C
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Limit: {machine.nominal.temperature.max}°C
                  </div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-[10px] text-slate-400">Radial Vibration</div>
                  <div className="text-base font-bold font-mono text-white tabular-nums mt-0.5">
                    {machine.lastTelemetry.vibration} mm/s
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Limit: {machine.nominal.vibration.max} mm/s
                  </div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-[10px] text-slate-400">Throughput</div>
                  <div className="text-base font-bold font-mono text-white tabular-nums mt-0.5">
                    {machine.lastTelemetry.throughput} pcs/min
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Nominal: {machine.nominal.throughput.nominal} pcs/min
                  </div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-[10px] text-slate-400">Pressure</div>
                  <div className="text-base font-bold font-mono text-white tabular-nums mt-0.5">
                    {machine.lastTelemetry.pressure} bar
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Nominal: {machine.nominal.pressure.nominal} bar
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Root-Cause and Remediation Section */}
          <div className="bg-slate-800/80 border border-amber-500/30 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    AI Predictive Diagnosis & Root Cause
                  </h4>
                  <span className="text-[10px] text-amber-300/80">
                    Confidence: {issue.aiDiagnosis.confidence}% · Simulated AI assessment
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isAiLoading}
                onClick={handleRunDeepAi}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Telemetry...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Deep AI Diagnosis</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-slate-200 bg-slate-900/70 p-3 rounded-lg border border-slate-700/50 leading-relaxed">
              <strong className="text-amber-300">Diagnosis:</strong> {issue.aiDiagnosis.suggestedRootCause}
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-300 mb-2">Recommended Technician Action Checklist:</div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {issue.aiDiagnosis.recommendedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-900/40 p-2 rounded border border-slate-800">
                    <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5">{idx + 1}.</span>
                    <span className="leading-snug">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[10px] text-slate-400 pt-1">
              Note: This recommendation is generated from demo heuristic and generative models for operator triage demonstration.
            </div>
          </div>

          {/* Supervisor Controls: Priority Override & Assignment */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Assignment & Priority Management</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsOverrideOpen(!isOverrideOpen)}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline"
              >
                {isOverrideOpen ? 'Cancel Adjustment' : 'Adjust Priority'}
              </button>
            </div>

            {isOverrideOpen && (
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 space-y-2">
                <div className="text-xs text-slate-300">
                  Supervisor Manual Priority Boost / Adjustment:
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    step="5"
                    value={priorityDelta}
                    onChange={(e) => setPriorityDelta(parseInt(e.target.value, 10))}
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="font-mono font-bold text-xs tabular-nums text-white w-12 text-right">
                    {priorityDelta > 0 ? `+${priorityDelta}` : priorityDelta} pts
                  </span>
                  <button
                    type="button"
                    onClick={handleOverridePriority}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                  >
                    Apply Override
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400">Reassign Personnel:</span>
              <select
                value={assigneeUser}
                onChange={(e) => setAssigneeUser(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="Op_Ana">Op_Ana (Operator)</option>
                <option value="Tech_Ravi">Tech_Ravi (Reliability Tech)</option>
                <option value="Tech_Elena">Tech_Elena (Hydraulics Specialist)</option>
                <option value="Sup_Marcus">Sup_Marcus (Line Supervisor)</option>
              </select>

              <select
                value={assigneeRole}
                onChange={(e) => setAssigneeRole(e.target.value as UserRole)}
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="OPERATOR">Role: Operator</option>
                <option value="MAINTENANCE">Role: Maintenance</option>
                <option value="SUPERVISOR">Role: Supervisor</option>
                <option value="MANAGER">Role: Manager</option>
              </select>

              <button
                type="button"
                onClick={handleAssign}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded text-xs font-medium"
              >
                Assign
              </button>
            </div>
          </div>

          {/* Action Response Bar: Operator / Technician 1-click status transitions */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Take Floor Action ({currentUser.name} as {currentUser.role})
            </h4>

            {/* Note text field */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add technician note (e.g. 'Inspected fluid level, zero leaks found')..."
                value={technicianNote}
                onChange={(e) => setTechnicianNote(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {issue.status === 'OPEN' && (
                <button
                  type="button"
                  onClick={handleAcknowledge}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Acknowledge Issue</span>
                </button>
              )}

              {(issue.status === 'OPEN' || issue.status === 'ACKNOWLEDGED') && (
                <button
                  type="button"
                  onClick={handleStartWork}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Play className="w-4 h-4" />
                  <span>Mark In Progress</span>
                </button>
              )}

              {issue.status !== 'RESOLVED' && (
                <button
                  type="button"
                  onClick={handleResolve}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Resolved</span>
                </button>
              )}

              {issue.status === 'RESOLVED' && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 border border-emerald-800/40 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  Issue successfully resolved and verified.
                </span>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Activity & Response Audit Trail
            </h4>
            <div className="space-y-3">
              {issue.activityTimeline.map((item) => (
                <div key={item.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50 flex-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-slate-200">
                        {item.user} ({item.role})
                      </span>
                      <span className="font-mono tabular-nums text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-slate-300 font-medium">{item.action}</div>
                    {item.note && <div className="text-slate-400 mt-1 text-[11px]">{item.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-mono">
            LinePulse Orchestrator · Event Trace #{issue.id}
          </div>
          <button
            type="button"
            onClick={() => setSelectedIssueId(null)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
