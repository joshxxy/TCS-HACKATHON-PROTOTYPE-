import React from 'react';
import { OrchestratorProvider, useOrchestrator } from './context/OrchestratorContext.tsx';
import { Header } from './components/Header.tsx';
import { MachineMonitorView } from './components/MachineMonitorView.tsx';
import { IssueQueueView } from './components/IssueQueueView.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { IssueDetailModal } from './components/IssueDetailModal.tsx';
import { MachineDetailModal } from './components/MachineDetailModal.tsx';
import { RoleSwitcherModal } from './components/RoleSwitcherModal.tsx';
import { SimulatorControlsModal } from './components/SimulatorControlsModal.tsx';
import { ManualIssueModal } from './components/ManualIssueModal.tsx';
import { NotificationsToast } from './components/NotificationsToast.tsx';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, unreadCountForUser } = useOrchestrator();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Role Perspective Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              Active Perspective: <strong className="text-white">{currentUser.name}</strong> ·{' '}
              <span className="text-emerald-300 font-semibold">{currentUser.role}</span>
              {currentUser.stationOrLine && (
                <span className="text-slate-400"> ({currentUser.stationOrLine})</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              Role Alerts: <strong className="text-white font-mono">{unreadCountForUser}</strong> active
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              AI Downtime Optimization
            </span>
          </div>
        </div>

        {/* View Switcher Content */}
        {activeTab === 'overview' && <MachineMonitorView />}
        {activeTab === 'queue' && <IssueQueueView />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Global Modals and Notifications */}
      <IssueDetailModal />
      <MachineDetailModal />
      <RoleSwitcherModal />
      <SimulatorControlsModal />
      <ManualIssueModal />
      <NotificationsToast />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-5 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">LinePulse Orchestrator</span>
            <span>· Live Operations & Reliability Platform</span>
          </div>
          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            Real-time simulated telemetry · Not for actual industrial safety shutdown
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <OrchestratorProvider>
      <MainContent />
    </OrchestratorProvider>
  );
}
