import React from 'react';
import { useOrchestrator } from '../context/OrchestratorContext.tsx';
import { Activity, Sliders, ShieldAlert, BarChart3, UserCheck, Play, Pause, Flame } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    connectionStatus,
    currentUser,
    setIsRoleModalOpen,
    setIsSimulatorModalOpen,
    unreadCountForUser,
    simulationState,
    toggleSimulation,
    toggleStressMode,
  } = useOrchestrator();

  const roleLabels: Record<string, string> = {
    OPERATOR: 'Operator',
    SUPERVISOR: 'Supervisor',
    MAINTENANCE: 'Maintenance',
    MANAGER: 'Manager',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('overview');
              }}
              className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap"
            >
              LinePulse Orchestrator
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Live Monitor</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 relative ${
                activeTab === 'queue'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Priority Queue</span>
              {unreadCountForUser > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-semibold bg-rose-500 text-white rounded-full">
                  {unreadCountForUser}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSimulatorModalOpen(true)}
              className="px-3 py-1.5 rounded-md text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 border border-amber-500/20"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Demo Controls</span>
              {simulationState.stressMode && (
                <span className="flex items-center text-[10px] text-rose-400 font-mono">
                  <Flame className="w-3 h-3 inline" />
                  STRESS
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (User Role Profile Switcher) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Live stream indicator */}
            <div
              className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/50"
              title={connectionStatus === 'CONNECTED' ? 'Real-time telemetry stream active' : 'Connecting to stream'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'CONNECTED'
                    ? 'bg-emerald-400'
                    : connectionStatus === 'CONNECTING'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-[11px]">
                {connectionStatus === 'CONNECTED' ? 'LIVE' : connectionStatus}
              </span>
            </div>

            {/* Quick Pause/Play for simulation */}
            <button
              type="button"
              onClick={toggleSimulation}
              title={simulationState.isRunning ? 'Pause Live Stream' : 'Resume Live Stream'}
              className="hidden sm:flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-colors"
            >
              {simulationState.isRunning ? (
                <Pause className="w-4 h-4 text-slate-300" />
              ) : (
                <Play className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Active User & Role Switcher */}
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-colors whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-emerald-500"
            >
              <div className="w-7 h-7 rounded-full bg-slate-700 group-hover:bg-slate-600 text-emerald-300 text-xs font-bold flex items-center justify-center font-mono">
                {currentUser.avatar}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {roleLabels[currentUser.role]} · Switch
                </div>
              </div>
              <UserCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 hidden sm:block" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800 py-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'overview' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Monitor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1 text-xs font-medium rounded relative ${
              activeTab === 'queue' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Issues
            {unreadCountForUser > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[9px] bg-rose-500 text-white rounded-full">
                {unreadCountForUser}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'analytics' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Analytics
          </button>
          <button
            type="button"
            onClick={() => setIsSimulatorModalOpen(true)}
            className="px-3 py-1 text-xs font-medium text-amber-400"
          >
            Demo
          </button>
        </div>
      </div>
    </header>
  );
};
