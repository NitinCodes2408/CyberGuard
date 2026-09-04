import React from 'react';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Target, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function StatsCards({ stats, loading }) {
  const total = stats?.total_predictions ?? 0;
  const attacks = stats?.total_attacks ?? 0;
  const normal = stats?.total_normal ?? 0;
  
  // Calculate dynamic detection rate
  const detectionRate = total > 0 
    ? ((attacks / total) * 100).toFixed(1) 
    : '0.0';

  const cards = [
    {
      title: 'Total Predictions',
      value: total.toLocaleString(),
      subtitle: 'Processed Network Packets',
      icon: Activity,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgGlow: 'hover:border-cyan-500/60 shadow-glow-cyan',
      accentBg: 'bg-cyan-500/10 border-cyan-500/30',
      metricPercent: total > 0 ? '100%' : '0%',
      metricColor: 'bg-cyan-400',
    },
    {
      title: 'Total Attacks',
      value: attacks.toLocaleString(),
      subtitle: 'Intrusions Intercepted',
      icon: ShieldAlert,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      bgGlow: 'hover:border-rose-500/60 shadow-glow-rose',
      accentBg: 'bg-rose-500/10 border-rose-500/30',
      metricPercent: total > 0 ? `${((attacks / total) * 100).toFixed(0)}%` : '0%',
      metricColor: 'bg-rose-500',
    },
    {
      title: 'Normal Traffic',
      value: normal.toLocaleString(),
      subtitle: 'Benign Flow Transactions',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgGlow: 'hover:border-emerald-500/60 shadow-glow-emerald',
      accentBg: 'bg-emerald-500/10 border-emerald-500/30',
      metricPercent: total > 0 ? `${((normal / total) * 100).toFixed(0)}%` : '0%',
      metricColor: 'bg-emerald-400',
    },
    {
      title: 'Detection Rate',
      value: `${detectionRate}%`,
      subtitle: 'Threat Discovery Ratio',
      icon: Target,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgGlow: 'hover:border-amber-500/60',
      accentBg: 'bg-amber-500/10 border-amber-500/30',
      metricPercent: `${Math.min(100, Math.max(0, parseFloat(detectionRate)))}%`,
      metricColor: 'bg-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`cyber-card rounded-2xl p-5 border ${card.borderColor} transition-all duration-300 relative overflow-hidden group ${card.bgGlow}`}
          >
            {/* Ambient Background Accent */}
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-slate-800/40 blur-2xl group-hover:scale-125 transition-transform duration-500"></div>

            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  {card.title}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-2">
                  {loading ? (
                    <span className="inline-block h-8 w-16 bg-slate-800 animate-pulse rounded"></span>
                  ) : (
                    card.value
                  )}
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${card.accentBg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1e3a5f]/30 flex flex-col gap-1.5 relative z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{card.subtitle}</span>
                <span className={`font-mono font-medium ${card.color}`}>
                  {card.metricPercent}
                </span>
              </div>

              {/* Mini visual progress track */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${card.metricColor}`}
                  style={{ width: card.metricPercent }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
