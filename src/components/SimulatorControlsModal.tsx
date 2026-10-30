import React from 'react';
import { useOrchestrator } from '../context/OrchestratorContext.tsx';
import {
  X,
  Play,
  Pause,
  Flame,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export const SimulatorControlsModal: React.FC = () => {
  const {
    isSimulatorModalOpen,
    setIsSimulatorModalOpen,
    simulationState,
    toggleSimulation,
    toggleStressMode,
    injectAnomaly,
    resetSimulation,
    machines,
  } = useOrchestrator();

  if (!isSimulatorModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Hackathon Demo Controls</h3>
              <p className="text-xs text-slate-400">Simulate events, inject anomalies, and test response workflows.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSimulatorModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Stream Control & Stress Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
              <div className="text-[11px] text-slate-400">Telemetry Pulse Engine</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-white">
                  {simulationState.isRunning ? 'Active (2000ms)' : 'Paused'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    simulationState.isRunning ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={toggleSimulation}
                className={`w-full mt-2 px-3 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  simulationState.isRunning
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {simulationState.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{simulationState.isRunning ? 'Pause Engine' : 'Resume Engine'}</span>
              </button>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
              <div className="text-[11px] text-slate-400">Demo Stress Mode</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-white">
                  {simulationState.stressMode ? 'STRESS ON' : 'Standard'}
                </span>
                {simulationState.stressMode && <Flame className="w-4 h-4 text-rose-400" />}
              </div>
              <button
                type="button"
                onClick={toggleStressMode}
                className={`w-full mt-2 px-3 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  simulationState.stressMode
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                    : 'bg-amber-600/30 hover:bg-amber-600/40 text-amber-200 border border-amber-500/40'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{simulationState.stressMode ? 'Disable Stress' : 'Enable Stress'}</span>
              </button>
            </div>
          </div>

          {/* Quick Anomaly Scenarios */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Instant Anomaly Injections
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">1-click test triggers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  injectAnomaly('OVERHEAT');
                  setIsSimulatorModalOpen(false);
                }}
                className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-rose-500/50 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white group-hover:text-rose-300">
                    Thermal Runaway Spike
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                    CRITICAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Exceeds critical temperature limit; alerts Operator & Maintenance immediately.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  injectAnomaly('BEARING_WEAR');
                  setIsSimulatorModalOpen(false);
                }}
                className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white group-hover:text-amber-300">
                    Spindle Bearing Wear
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    HIGH
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Abnormal harmonic vibration spike; triggers predictive maintenance review.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  injectAnomaly('PRESSURE_LEAK');
                  setIsSimulatorModalOpen(false);
                }}
                className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/50 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white group-hover:text-sky-300">
                    Hydraulic Pressure Loss
                  </span>
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                    HIGH
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pressure drop in accumulator line; alerts hydraulics reliability specialist.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  injectAnomaly('THROUGHPUT_DROP');
                  setIsSimulatorModalOpen(false);
                }}
                className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white group-hover:text-purple-300">
                    Infeed Jam / Throughput Dip
                  </span>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                    MEDIUM
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Chute optical obstruction; alerts machine operator to check feedstock.
                </p>
              </button>
            </div>
          </div>

          {/* Reset Factory Line */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Reset Line to Nominal</div>
              <div className="text-[11px] text-slate-400">
                Clear all active simulated faults and restore nominal baseline telemetry.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                resetSimulation();
                setIsSimulatorModalOpen(false);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Line</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            type="button"
            onClick={() => setIsSimulatorModalOpen(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
