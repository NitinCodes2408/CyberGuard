import React from 'react';
import { 
  Radar, 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Database, 
  Server, 
  Sparkles,
  ArrowRight,
  Clock,
  History
} from 'lucide-react';
import TrafficAnalyzer from './TrafficAnalyzer';
import DetectionResult from './DetectionResult';

export default function ThreatDetectionPage({
  onPredict,
  isPredicting,
  predictionResult,
  predictionError,
  predictionTimestamp,
  onClearResult,
  recentThreats,
  apiEndpoint,
  onNavigateToHistory
}) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header & SOC Telemetry Banner */}
      <div className="cyber-card rounded-2xl border border-[#1e3a5f]/60 p-6 sm:p-7 relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                LIVE INFERENCE ENGINE
              </span>
              <span className="text-[11px] font-mono text-slate-400">SOC Node #01</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              Threat Detection & Intrusion Classification
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Submit real-time network flow parameters to execute automated dual-stage classification. 
              The system evaluates 42 telemetry metrics to distinguish benign traffic from sophisticated cyber attack vectors.
            </p>
          </div>

          {/* Quick Telemetry Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs shrink-0">
            <div className="p-3 rounded-xl bg-[#080e1a] border border-[#1e3a5f]/60 space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase">Binary Model</span>
              <span className="text-cyan-300 font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> RFC Binary
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#080e1a] border border-[#1e3a5f]/60 space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase">Multi-Class</span>
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> 9 Categories
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#080e1a] border border-[#1e3a5f]/60 space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block uppercase">Inference Target</span>
              <span className="text-emerald-400 font-bold truncate block" title={apiEndpoint}>
                POST /predict
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detection Result Panel (Prominent display) */}
      <section id="detection-result-container" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Live Classification Output
            </h2>
          </div>
          {predictionResult && (
            <button
              onClick={onClearResult}
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 underline"
            >
              Clear Panel
            </button>
          )}
        </div>

        <DetectionResult
          result={predictionResult}
          loading={isPredicting}
          error={predictionError}
          timestamp={predictionTimestamp}
          onDismiss={onClearResult}
        />
      </section>

      {/* 42-Feature Traffic Analyzer Form Component */}
      <section className="space-y-3">
        <TrafficAnalyzer
          onSubmit={onPredict}
          loading={isPredicting}
        />
      </section>

      {/* Recent Evaluations Mini-Audit Feed */}
      {recentThreats && recentThreats.length > 0 && (
        <section className="cyber-card rounded-2xl border border-[#1e3a5f]/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wide">
                Latest Telemetry Evaluations in SQLite
              </h3>
            </div>
            {onNavigateToHistory && (
              <button
                onClick={onNavigateToHistory}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>View Full Threat History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {recentThreats.slice(0, 5).map((threat) => {
              const isAttack = threat.prediction === 'Attack';
              return (
                <div
                  key={threat.id}
                  className={`p-3 rounded-xl border font-mono text-xs space-y-1.5 transition-all ${
                    isAttack
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">#{threat.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                      isAttack
                        ? 'bg-rose-950 border-rose-500/50 text-rose-300'
                        : 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                    }`}>
                      {threat.prediction}
                    </span>
                  </div>
                  <div className="text-sm font-bold truncate">
                    {threat.attack_type || (isAttack ? 'Threat' : 'None')}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {threat.timestamp || 'Recorded'}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
