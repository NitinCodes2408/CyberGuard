import React from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  Network, 
  CheckCircle2, 
  AlertCircle,
  Radio,
  Zap,
  HardDrive
} from 'lucide-react';

export default function SystemStatus({ healthStatus, apiEndpoint, stats }) {
  const isApiOnline = healthStatus?.status === 'running';

  const statusItems = [
    {
      title: 'AI Model Engine',
      value: 'Online',
      status: 'active',
      icon: Cpu,
      detail: 'RandomForest Ensemble',
      subdetail: 'Dual-Stage Architecture',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
    },
    {
      title: 'Binary Classifier',
      value: 'Normal / Attack',
      status: 'active',
      icon: Zap,
      detail: 'cyber_threat_model.pkl',
      subdetail: 'Detection accuracy ~95%',
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300',
    },
    {
      title: 'Attack Classifier',
      value: 'Active',
      status: 'active',
      icon: Radio,
      detail: 'attack_category_model.pkl',
      subdetail: '9 Categorical Attack Vectors',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
    },
    {
      title: 'Database Engine',
      value: 'Connected',
      status: 'active',
      icon: Database,
      detail: 'cyber_threats.db (SQLite)',
      subdetail: `${stats?.total_predictions ?? 0} Recorded Evaluations`,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
    },
    {
      title: 'FastAPI Backend',
      value: isApiOnline ? 'Online' : 'Offline',
      status: isApiOnline ? 'active' : 'error',
      icon: Server,
      detail: apiEndpoint || 'http://127.0.0.1:8000',
      subdetail: isApiOnline ? 'REST / JSON Protocol' : 'Connection Refused',
      color: isApiOnline ? 'text-emerald-400' : 'text-rose-400',
      badgeBg: isApiOnline 
        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
        : 'bg-rose-950/60 border-rose-500/40 text-rose-300',
    },
  ];

  return (
    <div className="cyber-card rounded-2xl border border-[#1e3a5f]/60 p-5 sm:p-7 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e3a5f]/40">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 font-mono">
            <Server className="w-5 h-5 text-cyan-400" />
            <span>SOC System Infrastructure & Status</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time health telemetry across inference pipeline and persistence layers
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>All Nodes Operational</span>
        </div>
      </div>

      {/* Telemetry Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statusItems.map((item, idx) => {
          const Icon = item.icon;
          const isErr = item.status === 'error';
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#080e1a] border border-[#1e3a5f]/50 flex flex-col justify-between space-y-3 hover:border-cyan-500/40 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-cyan-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border font-semibold ${item.badgeBg}`}>
                  {item.value}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  {item.title}
                </h4>
                <div className="text-sm font-bold text-white font-mono mt-0.5 truncate" title={item.detail}>
                  {item.detail}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {item.subdetail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
