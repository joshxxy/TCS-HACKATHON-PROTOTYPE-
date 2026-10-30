import React from 'react';
import { useOrchestrator } from '../context/OrchestratorContext.tsx';
import { Sparkline } from './Sparkline.tsx';
import { X, CheckCircle2, AlertTriangle, Cpu, Wrench, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

export const MachineDetailModal: React.FC = () => {
  const {
    machines,
    issues,
    selectedMachineId,
    setSelectedMachineId,
    setSelectedIssueId,
    injectAnomaly,
  } = useOrchestrator();

  if (!selectedMachineId) return null;

  const machine = machines.find((m) => m.id === selectedMachineId);
  if (!machine) return null;

  const machineIssues = issues.filter((i) => i.machineId === machine.id);
  const tempHistory = machine.telemetryHistory.map((t) => t.temperature);
  const vibHistory = machine.telemetryHistory.map((t) => t.vibration);
  const tputHistory = machine.telemetryHistory.map((t) => t.throughput);
  const pressHistory = machine.telemetryHistory.map((t) => t.pressure);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {machine.id}
              </span>
              <span className="text-xs text-slate-400">{machine.line}</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{machine.name}</h2>
            <div className="text-xs text-slate-400 mt-0.5">{machine.type}</div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedMachineId(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
          {/* Machine Health & Order Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <div className="text-[11px] text-slate-400">Operating Status</div>
              <div className="text-base font-bold text-white mt-1 flex items-center gap-1.5">
                {machine.status === 'OK' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {machine.status !== 'OK' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                <span>{machine.status}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Downtime Rate: ${machine.costPerDowntimeMinute}/min
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">AI Predictive Risk</div>
              <div className="text-base font-bold text-white mt-1 font-mono tabular-nums">
                {machine.aiRiskLevel} ({machine.aiRiskScore}%)
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Last Maintained: {new Date(machine.lastMaintained).toLocaleDateString()}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Current Work Order</div>
              <div className="text-xs font-semibold text-white mt-1 truncate">
                {machine.currentOrder.id} · {machine.currentOrder.client}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono tabular-nums">
                Progress: {machine.currentOrder.partsDone} / {machine.currentOrder.partsTarget} pcs (
                {Math.round((machine.currentOrder.partsDone / machine.currentOrder.partsTarget) * 100)}%)
              </div>
            </div>
          </div>

          {/* Telemetry Charts Detailed Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Telemetry Trend History (Last 30 Pulses)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Temperature Chart */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Temperature</span>
                  <span className="text-sm font-bold font-mono text-white tabular-nums">
                    {machine.lastTelemetry.temperature} °C
                  </span>
                </div>
                <div className="pt-2 flex justify-center">
                  <Sparkline
                    data={tempHistory}
                    nominal={machine.nominal.temperature.nominal}
                    critical={machine.nominal.temperature.critical}
                    color="#38BDF8"
                    width={280}
                    height={48}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-700/40">
                  <span>Nominal: {machine.nominal.temperature.nominal}°C</span>
                  <span>Safety Max: {machine.nominal.temperature.max}°C</span>
                </div>
              </div>

              {/* Vibration Chart */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Radial Vibration</span>
                  <span className="text-sm font-bold font-mono text-white tabular-nums">
                    {machine.lastTelemetry.vibration} mm/s
                  </span>
                </div>
                <div className="pt-2 flex justify-center">
                  <Sparkline
                    data={vibHistory}
                    nominal={machine.nominal.vibration.nominal}
                    critical={machine.nominal.vibration.critical}
                    color="#A78BFA"
                    width={280}
                    height={48}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-700/40">
                  <span>Nominal: {machine.nominal.vibration.nominal} mm/s</span>
                  <span>Limit: {machine.nominal.vibration.max} mm/s</span>
                </div>
              </div>

              {/* Throughput */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Output Velocity</span>
                  <span className="text-sm font-bold font-mono text-white tabular-nums">
                    {machine.lastTelemetry.throughput} pcs/min
                  </span>
                </div>
                <div className="pt-2 flex justify-center">
                  <Sparkline
                    data={tputHistory}
                    nominal={machine.nominal.throughput.nominal}
                    critical={machine.nominal.throughput.critical}
                    color="#34D399"
                    width={280}
                    height={48}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-700/40">
                  <span>Target: {machine.nominal.throughput.nominal} pcs/min</span>
                  <span>Low Warning: {machine.nominal.throughput.critical} pcs/min</span>
                </div>
              </div>

              {/* Pressure */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Fluid / Pneumatic Pressure</span>
                  <span className="text-sm font-bold font-mono text-white tabular-nums">
                    {machine.lastTelemetry.pressure} bar
                  </span>
                </div>
                <div className="pt-2 flex justify-center">
                  <Sparkline
                    data={pressHistory}
                    nominal={machine.nominal.pressure.nominal}
                    critical={machine.nominal.pressure.critical}
                    color="#FBBF24"
                    width={280}
                    height={48}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-700/40">
                  <span>Nominal: {machine.nominal.pressure.nominal} bar</span>
                  <span>Max Safety: {machine.nominal.pressure.critical} bar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Associated Issues for this Machine */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Associated Issues for {machine.id} ({machineIssues.length})
            </h3>
            {machineIssues.length === 0 ? (
              <div className="p-4 bg-slate-800/40 border border-slate-700/40 rounded-xl text-center text-xs text-slate-400">
                No active or historical issues recorded for this machine.
              </div>
            ) : (
              <div className="space-y-2">
                {machineIssues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => {
                      setSelectedMachineId(null);
                      setSelectedIssueId(issue.id);
                    }}
                    className="p-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">{issue.id}</span>
                        <span className="text-xs font-medium text-slate-200">{issue.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Status: <strong className="text-slate-300">{issue.status}</strong> · Severity: {issue.severity}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-emerald-400 flex items-center gap-1 font-medium"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Demo Anomaly Injection for this Machine */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">
              Demo Sandbox: Trigger Test Anomaly on {machine.id}
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => injectAnomaly('OVERHEAT', machine.id)}
                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded"
              >
                Trigger Thermal Runaway
              </button>
              <button
                type="button"
                onClick={() => injectAnomaly('BEARING_WEAR', machine.id)}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded"
              >
                Trigger Spindle Vibration
              </button>
              <button
                type="button"
                onClick={() => injectAnomaly('PRESSURE_LEAK', machine.id)}
                className="px-2.5 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded"
              >
                Trigger Pressure Drop
              </button>
              <button
                type="button"
                onClick={() => injectAnomaly('THROUGHPUT_DROP', machine.id)}
                className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded"
              >
                Trigger Throughput Jam
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            type="button"
            onClick={() => setSelectedMachineId(null)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
