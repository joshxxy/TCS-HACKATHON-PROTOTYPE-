import React from 'react';
import { useOrchestrator } from '../context/OrchestratorContext.tsx';
import { UserRole } from '../types/index.ts';
import { X, UserCheck, HardHat, Shield, Wrench, BarChart3 } from 'lucide-react';

interface RoleCard {
  role: UserRole;
  name: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  defaultFocus: string;
}

const ROLES: RoleCard[] = [
  {
    role: 'OPERATOR',
    name: 'Ana Silva',
    title: 'Machine Operator (Station M1 & M2)',
    description: 'Minimal, mobile-ready view of local machine deviations, throughput dips, with 1-click Acknowledge & Status actions.',
    icon: <HardHat className="w-5 h-5 text-emerald-400" />,
    defaultFocus: 'Local station alerts, rapid status logging, throughput alarms',
  },
  {
    role: 'SUPERVISOR',
    name: 'Marcus Vance',
    title: 'Production Line Leader',
    description: 'Line-wide visibility across all 6 machines, order delivery risk, technician assignment, and priority score overrides.',
    icon: <Shield className="w-5 h-5 text-amber-400" />,
    defaultFocus: 'Line bottleneck balancing, job delivery deadlines, re-routing work',
  },
  {
    role: 'MAINTENANCE',
    name: 'Ravi Patel',
    title: 'Predictive Reliability Technician',
    description: 'Detailed vibration spectra, temperature creep, predictive AI root-cause diagnostics, and step-by-step checklists.',
    icon: <Wrench className="w-5 h-5 text-sky-400" />,
    defaultFocus: 'Bearing wear, hydraulic anomalies, AI root causes, repair actions',
  },
  {
    role: 'MANAGER',
    name: 'Dr. Linda Chen',
    title: 'Plant Operations Executive',
    description: 'Executive analytics dashboard tracking MTTA, MTTR, reliability trends, and financial downtime risk impact.',
    icon: <BarChart3 className="w-5 h-5 text-purple-400" />,
    defaultFocus: 'Cost of downtime, MTTA/MTTR metrics, machine failure distribution',
  },
];

export const RoleSwitcherModal: React.FC = () => {
  const { isRoleModalOpen, setIsRoleModalOpen, currentUser, switchUserRole, setActiveTab } = useOrchestrator();

  if (!isRoleModalOpen) return null;

  const handleSelectRole = (role: UserRole, name: string) => {
    switchUserRole(role, name);
    // Suggest tab based on role
    if (role === 'MANAGER') {
      setActiveTab('analytics');
    } else if (role === 'OPERATOR') {
      setActiveTab('overview');
    } else if (role === 'SUPERVISOR') {
      setActiveTab('queue');
    } else if (role === 'MAINTENANCE') {
      setActiveTab('queue');
    }
    setIsRoleModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Select Operating Role</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Experience LinePulse Orchestrator from different manufacturing user perspectives.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsRoleModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROLES.map((item) => {
            const isSelected = currentUser.role === item.role;

            return (
              <button
                type="button"
                key={item.role}
                onClick={() => handleSelectRole(item.role, item.name)}
                className={`p-4 rounded-xl border text-left transition-all relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/60 shadow-md shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/60">
                      {item.icon}
                    </div>
                    {isSelected ? (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                        <UserCheck className="w-3.5 h-3.5" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 group-hover:text-slate-200">
                        Switch →
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-xs font-semibold text-slate-300 mt-0.5">
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-700/50 text-[10px] text-slate-400 font-mono">
                  Primary Focus: {item.defaultFocus}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            type="button"
            onClick={() => setIsRoleModalOpen(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
