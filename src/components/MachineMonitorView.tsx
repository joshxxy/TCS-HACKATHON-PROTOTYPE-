import React from 'react';
import { useOrchestrator } from '../context/OrchestratorContext.tsx';
import { Sparkline } from './Sparkline.tsx';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Cpu,
  Clock,
  ExternalLink,
  PlusCircle,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { MachineStatus } from '../types/index.ts';

export const MachineMonitorView: React.FC = () => {
  const {
    machines,
    issues,
    setSelectedMachineId,
    setSelectedIssueId,
    setActiveTab,
    setIsManualIssueModalOpen,
  } = useOrchestrator();

  const okCount = machines.filter((m) => m.status === 'OK').length;
  const warningCount = machines.filter((m) => m.status === 'WARNING').length;
  const criticalCount = machines.filter((m) => m.status === 'CRITICAL').length;
  const totalThroughput = machines.reduce((acc, m) => acc + m.lastTelemetry.throughput, 0);
  const activeIssues = issues.filter((i) => i.status !== 'RESOLVED');
  const totalSimulatedCostExposure = activeIssues.reduce((acc, i) => acc + i.estimatedCost, 0);

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case 'OK':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Nominal
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Warning
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Critical Alert
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            Standby
          </span>
        );
    }
  };

  const getAiRiskBadge = (level: 'LOW' | 'MEDIUM' | 'HIGH', score: number) => {
    let colorClass = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (level === 'HIGH') colorClass = 'text-rose-400 border-rose-500/20 bg-rose-500/5';
    else if (level === 'MEDIUM') colorClass = 'text-amber-400 border-amber-500/20 bg-amber-500/5';

    return (
      <span
        title="Simulated AI predictive risk score based on multi-variate sensor drift, thermal variance, and time-in-service."
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono tabular-nums rounded border ${colorClass}`}
      >
        <Cpu className="w-3 h-3" />
        <span>Risk: {level} ({score}%)</span>
        <span className="text-[9px] opacity-75">simulated</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Disclaimer */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white font-medium">Demonstration Mode:</strong> All sensor telemetry, AI anomaly assessments, and downtime costs are{' '}
            <span className="text-emerald-300 underline underline-offset-2">simulated in real-time</span> to orchestrate operator, supervisor, and maintenance teams.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsManualIssueModalOpen(true)}
          className="self-start sm:self-auto px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Report Floor Observation</span>
        </button>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Line Machine Health</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tabular-nums font-mono">{okCount}/{machines.length}</span>
            <span className="text-xs text-emerald-400 font-medium">Nominal</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
            {warningCount > 0 && <span className="text-amber-400 font-mono tabular-nums">{warningCount} Warning</span>}
            {criticalCount > 0 && <span className="text-rose-400 font-mono tabular-nums">{criticalCount} Critical</span>}
            {warningCount === 0 && criticalCount === 0 && <span className="text-slate-400">Zero active faults</span>}
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Total Line Output</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tabular-nums font-mono">{totalThroughput}</span>
            <span className="text-xs text-slate-400 font-mono">pcs/min</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-mono tabular-nums">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>94.8% of Target Velocity</span>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Open Issues Queue</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tabular-nums font-mono">{activeIssues.length}</span>
            <span className="text-xs text-slate-400">active alerts</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-2 transition-colors font-medium"
          >
            <span>Review Priority Queue</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Simulated Downtime Exposure</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-amber-300 tabular-nums font-mono">
              ${totalSimulatedCostExposure.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Based on active alert duration & machine rates
          </div>
        </div>
      </div>

      {/* Machines Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => {
          const tempHistory = machine.telemetryHistory.map((t) => t.temperature);
          const vibHistory = machine.telemetryHistory.map((t) => t.vibration);
          const machineIssues = issues.filter(
            (i) => i.machineId === machine.id && (i.status === 'OPEN' || i.status === 'IN_PROGRESS' || i.status === 'ACKNOWLEDGED')
          );
          const progressPercent = Math.min(
            100,
            Math.round((machine.currentOrder.partsDone / machine.currentOrder.partsTarget) * 100)
          );

          const isOverTemp = machine.lastTelemetry.temperature >= machine.nominal.temperature.max;
          const isOverVib = machine.lastTelemetry.vibration >= machine.nominal.vibration.max;

          return (
            <div
              key={machine.id}
              className={`bg-slate-800/90 border rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-600 ${
                machine.status === 'CRITICAL'
                  ? 'border-rose-500/50 shadow-lg shadow-rose-950/20'
                  : machine.status === 'WARNING'
                  ? 'border-amber-500/40 shadow-lg shadow-amber-950/10'
                  : 'border-slate-700/60'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-700/50 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                      {machine.id}
                    </span>
                    <h3 className="text-sm font-semibold text-white truncate max-w-[160px] sm:max-w-[200px]">
                      {machine.name}
                    </h3>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    {machine.type} · {machine.line.split(' - ')[0]}
                  </div>
                </div>
                <div className="shrink-0">{getStatusBadge(machine.status)}</div>
              </div>

              {/* Real-time Telemetry Metrics */}
              <div className="p-4 space-y-4">
                {/* Temperature Metric */}
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>Core Temperature</span>
                      {isOverTemp && <Flame className="w-3 h-3 text-rose-400" />}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-lg font-bold font-mono tabular-nums ${
                          isOverTemp ? 'text-rose-400' : 'text-slate-100'
                        }`}
                      >
                        {machine.lastTelemetry.temperature}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">°C</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1">
                        (nom {machine.nominal.temperature.nominal}°)
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Sparkline
                      data={tempHistory}
                      nominal={machine.nominal.temperature.nominal}
                      critical={machine.nominal.temperature.critical}
                      color="#38BDF8"
                      width={100}
                      height={32}
                    />
                  </div>
                </div>

                {/* Vibration Metric */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/40">
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>Radial Vibration</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-lg font-bold font-mono tabular-nums ${
                          isOverVib ? 'text-amber-400' : 'text-slate-100'
                        }`}
                      >
                        {machine.lastTelemetry.vibration}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">mm/s</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1">
                        (nom {machine.nominal.vibration.nominal})
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Sparkline
                      data={vibHistory}
                      nominal={machine.nominal.vibration.nominal}
                      critical={machine.nominal.vibration.critical}
                      color="#A78BFA"
                      width={100}
                      height={32}
                    />
                  </div>
                </div>

                {/* Secondary Metrics: Throughput & Pressure */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/40 text-xs">
                  <div className="bg-slate-900/40 rounded p-2 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Throughput</div>
                    <div className="text-sm font-semibold font-mono tabular-nums text-slate-200 mt-0.5">
                      {machine.lastTelemetry.throughput} <span className="text-[10px] text-slate-400">pcs/min</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 rounded p-2 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Line Pressure</div>
                    <div className="text-sm font-semibold font-mono tabular-nums text-slate-200 mt-0.5">
                      {machine.lastTelemetry.pressure} <span className="text-[10px] text-slate-400">bar</span>
                    </div>
                  </div>
                </div>

                {/* Order Progress */}
                <div className="pt-2 border-t border-slate-700/40">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="truncate max-w-[170px]">
                      Job: <strong className="text-slate-200">{machine.currentOrder.id}</strong> ({machine.currentOrder.client.split(' ')[0]})
                    </span>
                    <span className="font-mono tabular-nums text-slate-300">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        machine.currentOrder.priority === 'CRITICAL' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* AI Risk & Active Alerts info */}
                <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between gap-2">
                  <div>{getAiRiskBadge(machine.aiRiskLevel, machine.aiRiskScore)}</div>

                  {machineIssues.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIssueId(machineIssues[0].id);
                      }}
                      className="text-[11px] font-medium text-rose-300 hover:text-rose-200 underline decoration-rose-500/50 flex items-center gap-1 font-mono tabular-nums"
                    >
                      <span>{machineIssues.length} active issue{machineIssues.length > 1 ? 's' : ''}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Zero open alarms
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  ${machine.costPerDowntimeMinute}/min downtime rate
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMachineId(machine.id)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors flex items-center gap-1"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
