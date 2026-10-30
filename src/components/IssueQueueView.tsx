import React, { useState, useMemo } from 'react';
import { useOrchestrator } from '../context/OrchestratorContext.tsx';
import { Issue, IssueSeverity, IssueStatus, UserRole } from '../types/index.ts';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  User,
  ArrowUpDown,
  PlusCircle,
  Info,
  Clock,
  Layers,
} from 'lucide-react';

export const IssueQueueView: React.FC = () => {
  const {
    issues,
    currentUser,
    setSelectedIssueId,
    acknowledgeIssue,
    updateIssueStatus,
    setIsManualIssueModalOpen,
  } = useOrchestrator();

  const [roleFilter, setRoleFilter] = useState<string>('MY_ROLE');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE_ONLY');
  const [machineFilter, setMachineFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Role filter
      if (roleFilter === 'MY_ROLE') {
        const isMyPrimary = issue.primaryRole === currentUser.role;
        const isMySecondary = issue.secondaryRoles.includes(currentUser.role);
        if (!isMyPrimary && !isMySecondary) return false;
      } else if (roleFilter !== 'ALL') {
        if (issue.primaryRole !== roleFilter && !issue.secondaryRoles.includes(roleFilter as UserRole)) {
          return false;
        }
      }

      // Severity filter
      if (severityFilter !== 'ALL' && issue.severity !== severityFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'ACTIVE_ONLY') {
        if (issue.status === 'RESOLVED') return false;
      } else if (statusFilter !== 'ALL' && issue.status !== statusFilter) {
        return false;
      }

      // Machine filter
      if (machineFilter !== 'ALL' && issue.machineId !== machineFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = issue.title.toLowerCase().includes(query);
        const matchesDesc = issue.description.toLowerCase().includes(query);
        const matchesMachine = issue.machineName.toLowerCase().includes(query) || issue.machineId.toLowerCase().includes(query);
        const matchesRoot = issue.aiDiagnosis.suggestedRootCause.toLowerCase().includes(query);
        const matchesUser = issue.assignedUser?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesMachine && !matchesRoot && !matchesUser) {
          return false;
        }
      }

      return true;
    });
  }, [issues, roleFilter, severityFilter, statusFilter, machineFilter, searchQuery, currentUser.role]);

  const getSeverityBadge = (severity: IssueSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="text-[11px] font-semibold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20">
            LOW
          </span>
        );
    }
  };

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="text-[11px] font-medium text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">
            Open Alert
          </span>
        );
      case 'ACKNOWLEDGED':
        return (
          <span className="text-[11px] font-medium text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
            Acknowledged
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="text-[11px] font-medium text-sky-300 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
            In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="text-[11px] font-medium text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            Resolved
          </span>
        );
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header and Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Prioritized Issue Queue</h2>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              ({filteredIssues.length} issue{filteredIssues.length === 1 ? '' : 's'})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic priority ranking based on downtime risk, order urgency, recurrence, and AI anomaly detection.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsManualIssueModalOpen(true)}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Log Floor Issue</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by machine, root cause, symptoms, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick role toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-lg border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setRoleFilter('MY_ROLE')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                roleFilter === 'MY_ROLE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Role ({currentUser.role.toLowerCase()})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('ALL')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                roleFilter === 'ALL'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Roles
            </button>
          </div>
        </div>

        {/* Secondary Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/40 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ACTIVE_ONLY">Active Issues (Open, Ack, Progress)</option>
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open Only</option>
            <option value="ACKNOWLEDGED">Acknowledged Only</option>
            <option value="IN_PROGRESS">In Progress Only</option>
            <option value="RESOLVED">Resolved Only</option>
          </select>

          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
            <option value="LOW">Low Only</option>
          </select>

          {/* Machine filter */}
          <select
            value={machineFilter}
            onChange={(e) => setMachineFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Machines</option>
            <option value="M1">M1 · Stamping Press Alpha</option>
            <option value="M2">M2 · CNC Milling 04</option>
            <option value="M3">M3 · Robotic Arc Welder</option>
            <option value="M4">M4 · Thermal Oven #2</option>
            <option value="M5">M5 · Automated Sorter</option>
            <option value="M6">M6 · Injection Mold #2</option>
          </select>

          {(roleFilter !== 'MY_ROLE' || severityFilter !== 'ALL' || statusFilter !== 'ACTIVE_ONLY' || machineFilter !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setRoleFilter('MY_ROLE');
                setSeverityFilter('ALL');
                setStatusFilter('ACTIVE_ONLY');
                setMachineFilter('ALL');
                setSearchQuery('');
              }}
              className="text-slate-400 hover:text-slate-200 underline text-xs ml-auto"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-12 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-80" />
          <h3 className="text-base font-semibold text-white">No Issues Match Filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Either no active alerts exist for this criteria or all matching incidents have been resolved.
          </p>
          <button
            type="button"
            onClick={() => {
              setRoleFilter('ALL');
              setStatusFilter('ALL');
              setSeverityFilter('ALL');
              setMachineFilter('ALL');
            }}
            className="mt-4 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md text-xs font-medium transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => {
            const isAssignedToMe = issue.assignedUser === currentUser.name;
            const canAcknowledge = issue.status === 'OPEN';
            const canStartWork = issue.status === 'ACKNOWLEDGED';
            const canResolve = issue.status === 'IN_PROGRESS';

            return (
              <div
                key={issue.id}
                onClick={() => setSelectedIssueId(issue.id)}
                className={`bg-slate-800/90 hover:bg-slate-800 border rounded-xl p-4 sm:p-5 transition-all cursor-pointer group ${
                  issue.severity === 'CRITICAL' && issue.status !== 'RESOLVED'
                    ? 'border-rose-500/40 shadow-md shadow-rose-950/20'
                    : issue.severity === 'HIGH' && issue.status !== 'RESOLVED'
                    ? 'border-amber-500/30'
                    : 'border-slate-700/60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Priority Badge + Content */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Priority Score Shield */}
                    <div
                      title={`Priority Score: ${issue.priorityScore}/100\nFactors:\n- Downtime Risk: ${issue.priorityFactors.downtimeRisk} pts\n- Order Urgency: ${issue.priorityFactors.orderUrgency} pts\n- AI Anomaly Score: ${issue.priorityFactors.anomalyScore} pts\n- Recurrence: ${issue.priorityFactors.recurrenceScore} pts`}
                      className={`shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center border font-mono tabular-nums ${
                        issue.priorityScore >= 75
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : issue.priorityScore >= 50
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-slate-700/50 border-slate-600 text-slate-300'
                      }`}
                    >
                      <span className="text-sm font-bold leading-none">{issue.priorityScore}</span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">Rank</span>
                    </div>

                    {/* Main Issue Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                          {issue.machineId}
                        </span>
                        <span className="text-xs text-slate-400 font-medium truncate">
                          {issue.machineName}
                        </span>
                        <span className="text-slate-600">·</span>
                        {getSeverityBadge(issue.severity)}
                        {getStatusBadge(issue.status)}
                        <span className="text-[11px] text-slate-500 ml-auto font-mono tabular-nums flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(issue.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {issue.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {issue.description}
                      </p>

                      {/* AI Diagnostic Snippet */}
                      <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-300 bg-slate-900/60 rounded-md p-2 border border-slate-800">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-[11px] leading-relaxed">
                          <strong className="text-amber-300 font-medium">AI Suggests:</strong>{' '}
                          {issue.aiDiagnosis.suggestedRootCause}
                        </div>
                      </div>

                      {/* Meta stats bar */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                        <span>
                          Primary Role: <strong className="text-slate-300">{issue.primaryRole}</strong>
                        </span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">
                          Est. Downtime: <strong className="text-slate-300">~{issue.estimatedDowntimeMinutes}m</strong>{' '}
                          <span className="text-[9px] text-slate-500">(simulated)</span>
                        </span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">
                          Impact: <strong className="text-amber-300">${issue.estimatedCost.toLocaleString()}</strong>{' '}
                          <span className="text-[9px] text-slate-500">(simulated)</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {issue.assignedUser ? (
                            <span className="text-emerald-300 font-medium">{issue.assignedUser}</span>
                          ) : (
                            <span className="text-slate-500 italic">Unassigned</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Fast 1-Click Action Buttons for Operators & Technicians */}
                  <div
                    className="flex sm:flex-row lg:flex-col items-center lg:items-end justify-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-700/50"
                    onClick={(e) => e.stopPropagation()} // Prevent card modal open on action click
                  >
                    {canAcknowledge && (
                      <button
                        type="button"
                        onClick={() => acknowledgeIssue(issue.id)}
                        className="w-full sm:w-auto px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    {canStartWork && (
                      <button
                        type="button"
                        onClick={() => updateIssueStatus(issue.id, 'IN_PROGRESS')}
                        className="w-full sm:w-auto px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Work</span>
                      </button>
                    )}

                    {canResolve && (
                      <button
                        type="button"
                        onClick={() => updateIssueStatus(issue.id, 'RESOLVED')}
                        className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Resolve Alert</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedIssueId(issue.id)}
                      className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
