import React from 'react';
import { useOrchestrator } from '../context/OrchestratorContext.tsx';
import { ShieldAlert, AlertTriangle, X, ArrowRight } from 'lucide-react';

export const NotificationsToast: React.FC = () => {
  const { notifications, dismissNotification, setSelectedIssueId, issues, currentUser } = useOrchestrator();

  if (notifications.length === 0) return null;

  // Filter to notifications relevant to user or critical
  const visible = notifications.slice(0, 3);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {visible.map((notif) => {
        const matchingIssue = issues.find((i) => i.machineId === notif.machineId && i.status !== 'RESOLVED');

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all flex items-start gap-3 ${
              notif.severity === 'CRITICAL'
                ? 'bg-rose-950/90 border-rose-500/60 text-rose-100 shadow-rose-950/40'
                : 'bg-slate-900/95 border-amber-500/50 text-slate-100 shadow-black/40'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {notif.severity === 'CRITICAL' ? (
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-white">{notif.title}</span>
                <span className="font-mono tabular-nums">{notif.timestamp}</span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5 line-clamp-1">{notif.message}</p>

              {matchingIssue && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIssueId(matchingIssue.id);
                    dismissNotification(notif.id);
                  }}
                  className="mt-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <span>Review Issue Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissNotification(notif.id)}
              className="text-slate-400 hover:text-white p-0.5 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
