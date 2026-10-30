import React, { useState } from 'react';
import { useOrchestrator } from '../context/OrchestratorContext.tsx';
import {
  Clock,
  TrendingDown,
  DollarSign,
  Cpu,
  BarChart2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { analytics, machines } = useOrchestrator();
  const [timeRange, setTimeRange] = useState<'SHIFT' | 'DAY' | 'WEEK'>('SHIFT');

  if (!analytics) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading analytics engine metrics...
      </div>
    );
  }

  // Multiplier for demo time-compression
  const multiplier = timeRange === 'WEEK' ? 5.2 : timeRange === 'DAY' ? 2.4 : 1;
  const displayTotalIssues = Math.round(analytics.totalIssues * multiplier);
  const displayDowntimeMin = Math.round(analytics.totalDowntimeMinutes * multiplier);
  const displayCost = Math.round(analytics.totalEstimatedCost * multiplier);

  const maxMachineCount = Math.max(...analytics.issuesByMachine.map((m) => m.count), 1);

  return (
    <div className="space-y-6">
      {/* Analytics Page Title & Time Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Plant Reliability & Incident Analytics</h2>
          <p className="text-xs text-slate-400 mt-1">
            Tracking Mean Time To Acknowledge (MTTA), Mean Time To Resolve (MTTR), and simulated downtime loss.
          </p>
        </div>

        {/* Time Filter Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700/80 shrink-0">
          <button
            type="button"
            onClick={() => setTimeRange('SHIFT')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              timeRange === 'SHIFT' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Current Shift
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('DAY')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              timeRange === 'DAY' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Last 24 Hours
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('WEEK')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              timeRange === 'WEEK' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7-Day History
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MTTA */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>MTTA (Mean Time to Ack)</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {analytics.mttaMinutes}
            </span>
            <span className="text-xs text-slate-400 font-mono">min</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 font-mono tabular-nums">
            ↓ 42% vs baseline (target: &lt; 5m)
          </div>
        </div>

        {/* MTTR */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>MTTR (Mean Time to Resolve)</span>
            <TrendingDown className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {analytics.mttrMinutes}
            </span>
            <span className="text-xs text-slate-400 font-mono">min</span>
          </div>
          <div className="text-[11px] text-sky-400 mt-2 font-mono tabular-nums">
            Fastest: 14m · Longest: 45m
          </div>
        </div>

        {/* Total Downtime */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Simulated Downtime</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
              {displayDowntimeMin}
            </span>
            <span className="text-xs text-slate-400 font-mono">min</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Across {displayTotalIssues} recorded line incidents
          </div>
        </div>

        {/* Financial Impact */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Simulated Cost Exposure</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              ${displayCost.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Estimated loss from idle machine cycle rates
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Issues by Machine */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Issues by Machine Station</h3>
              <p className="text-[11px] text-slate-400">Total incident alerts flagged per cell</p>
            </div>
            <BarChart2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 pt-2">
            {analytics.issuesByMachine.map((item) => {
              const count = Math.round(item.count * multiplier);
              const percent = Math.min(100, Math.round((count / (maxMachineCount * multiplier || 1)) * 100));

              return (
                <div key={item.machineId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">
                      {item.machineId} · {item.machineName.split(' ')[0]} {item.machineName.split(' ')[1] || ''}
                    </span>
                    <span className="font-mono tabular-nums text-slate-400">
                      {count} {count === 1 ? 'issue' : 'issues'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.criticalCount > 0 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Issues by Severity & Role */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Incident Severity Distribution</h3>
              <p className="text-[11px] text-slate-400">Classification of active & resolved events</p>
            </div>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {analytics.issuesBySeverity.map((item) => {
              const count = Math.round(item.count * multiplier);
              let color = 'border-slate-700 text-slate-200';
              if (item.severity === 'CRITICAL') color = 'border-rose-500/30 text-rose-300 bg-rose-500/10';
              else if (item.severity === 'HIGH') color = 'border-amber-500/30 text-amber-300 bg-amber-500/10';
              else if (item.severity === 'MEDIUM') color = 'border-yellow-500/30 text-yellow-300 bg-yellow-500/10';

              return (
                <div key={item.severity} className={`p-3 rounded-lg border ${color}`}>
                  <div className="text-[11px] font-semibold tracking-wider uppercase">{item.severity}</div>
                  <div className="text-xl font-bold font-mono tabular-nums mt-1">{count}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">
                    {displayTotalIssues > 0 ? Math.round((count / displayTotalIssues) * 100) : 0}% of total
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-700/50">
            <div className="text-xs font-medium text-slate-300 mb-2">Primary Role Routing Distribution:</div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {analytics.issuesByRole.map((r) => (
                <div key={r.role} className="bg-slate-900/60 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">{r.role.slice(0, 4)}</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
                    {Math.round(r.count * multiplier)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Incident Timeline */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Shift Incident vs Resolution Cadence</h3>
            <p className="text-[11px] text-slate-400">Events logged vs successfully resolved by floor personnel</p>
          </div>
          <Calendar className="w-4 h-4 text-slate-400" />
        </div>

        <div className="h-40 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-700/60">
          {analytics.hourlyTimeline.map((slot) => {
            const heightCreated = Math.min(100, slot.count * 24);
            const heightResolved = Math.min(100, slot.resolved * 24);

            return (
              <div key={slot.hour} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="flex items-end gap-1.5 w-full justify-center max-w-[48px]">
                  {/* Created Bar */}
                  <div
                    style={{ height: `${Math.max(10, heightCreated)}%` }}
                    className="w-1/2 bg-amber-500/80 rounded-t transition-all hover:bg-amber-400"
                    title={`${slot.hour}: ${slot.count} incidents raised`}
                  />
                  {/* Resolved Bar */}
                  <div
                    style={{ height: `${Math.max(10, heightResolved)}%` }}
                    className="w-1/2 bg-emerald-500/80 rounded-t transition-all hover:bg-emerald-400"
                    title={`${slot.hour}: ${slot.resolved} resolved`}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1">{slot.hour}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-amber-500/80 rounded" />
            <span>Incidents Flagged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-emerald-500/80 rounded" />
            <span>Incidents Resolved</span>
          </div>
        </div>
      </div>

      {/* AI Accuracy & Impact Audit Box */}
      <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">
              AI Predictive Reliability Impact (Simulated)
            </div>
            <div className="text-slate-300 mt-0.5">
              High-risk model flags correlated with mechanical degradation at{' '}
              <strong className="text-emerald-300 font-mono">
                {analytics.aiAccuracyInsight.highRiskCorrelationPercent}% accuracy
              </strong>
              , saving an estimated{' '}
              <strong className="text-emerald-300 font-mono">
                {analytics.aiAccuracyInsight.preventedDowntimeEstimateHours} hours
              </strong>{' '}
              of catastrophic shutdown.
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 sm:text-right shrink-0">
          Disclaimer: Predictive metrics for hackathon demonstration.
        </div>
      </div>
    </div>
  );
};
