import React, { useState } from 'react';
import { useOrchestrator } from '../context/OrchestratorContext.tsx';
import { IssueSeverity } from '../types/index.ts';
import { X, PlusCircle, AlertTriangle } from 'lucide-react';

export const ManualIssueModal: React.FC = () => {
  const { isManualIssueModalOpen, setIsManualIssueModalOpen, machines, createManualIssue } = useOrchestrator();

  const [machineId, setMachineId] = useState<string>('M1');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<IssueSeverity>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isManualIssueModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    await createManualIssue({
      machineId,
      title: title.trim(),
      description: description.trim(),
      severity,
    });
    setIsSubmitting(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Log Floor Observation</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsManualIssueModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Machine / Cell
            </label>
            <select
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} · {m.name} ({m.line.split(' - ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Observation Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unusual belt squeal or intermittent blank misfeed"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Observed Symptoms & Context
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what you heard, saw, or measured on the shop floor..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Initial Assessed Severity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as IssueSeverity[]).map((sev) => (
                <button
                  type="button"
                  key={sev}
                  onClick={() => setSeverity(sev)}
                  className={`py-1.5 px-2 rounded-lg font-semibold text-center border transition-all ${
                    severity === sev
                      ? sev === 'CRITICAL'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : sev === 'HIGH'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsManualIssueModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Log Issue to Queue'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
