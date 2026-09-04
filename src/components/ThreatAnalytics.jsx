import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { BarChart3, PieChart as PieIcon, ShieldAlert, Sparkles, Activity } from 'lucide-react';

const ATTACK_COLORS = {
  Exploits: '#f43f5e',      // Crimson
  Fuzzers: '#fb923c',       // Orange
  DoS: '#ef4444',           // Red
  Generic: '#a855f7',       // Purple
  Reconnaissance: '#06b6d4',// Cyan
  Backdoor: '#ec4899',      // Pink
  Analysis: '#3b82f6',      // Blue
  Shellcode: '#eab308',     // Yellow
  Worms: '#10b981',         // Green
  Unknown: '#64748b',       // Slate
};

const DEFAULT_PALETTE = ['#f43f5e', '#06b6d4', '#fb923c', '#a855f7', '#3b82f6', '#10b981', '#ec4899', '#eab308'];

export default function ThreatAnalytics({ stats, loading }) {
  const attackTypesObj = stats?.attack_types || {};

  // Dynamically map attack_types dictionary to array format for Recharts
  const chartData = Object.entries(attackTypesObj).map(([name, count], index) => ({
    name,
    count,
    color: ATTACK_COLORS[name] || DEFAULT_PALETTE[index % DEFAULT_PALETTE.length],
  }));

  const totalAttacks = stats?.total_attacks ?? 0;
  const hasData = chartData.length > 0 && totalAttacks > 0;

  // Custom Cyber Tooltip for Charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = totalAttacks > 0 ? ((data.count / totalAttacks) * 100).toFixed(1) : '0.0';
      return (
        <div className="bg-[#0b1220]/95 border border-[#1e3a5f] p-3 rounded-xl shadow-xl backdrop-blur-md font-mono text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }}></span>
            <span className="font-bold text-white">{data.name}</span>
          </div>
          <div className="text-slate-300">
            Detected: <span className="font-bold text-cyan-400">{data.count}</span> events
          </div>
          <div className="text-slate-400 text-[11px]">
            Share: <span className="text-emerald-400">{percent}%</span> of all attacks
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cyber-card rounded-2xl border border-[#1e3a5f]/60 p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e3a5f]/40">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 font-mono">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Threat Analytics & Attack Distribution</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamically categorized breakdown derived from real-time model inference
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded-lg bg-[#080e1a] border border-[#1e3a5f]/50">
            Active Threat Types: <strong className="text-cyan-400">{chartData.length}</strong>
          </span>
        </div>
      </div>

      {!hasData ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-300 font-mono">No Attack Vectors Recorded Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Once malicious traffic samples are processed through the analyzer, real-time threat distribution charts will populate automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Donut Chart */}
          <div className="lg:col-span-6 h-72 sm:h-80 w-full relative">
            <div className="absolute top-2 left-2 flex items-center gap-1.5 text-xs font-mono text-slate-400 z-10">
              <PieIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Attack Share (Pie)</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="#0b1220"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Breakdown Chart */}
          <div className="lg:col-span-6 h-72 sm:h-80 w-full relative">
            <div className="absolute top-2 left-2 flex items-center gap-1.5 text-xs font-mono text-slate-400 z-10">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Incident Volume (Bar)</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 25, right: 10, left: -15, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Badges List */}
          <div className="lg:col-span-12 pt-2 border-t border-[#1e3a5f]/30">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {chartData.map((item) => {
                const percent = totalAttacks > 0 ? ((item.count / totalAttacks) * 100).toFixed(1) : '0.0';
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#080e1a] border border-[#1e3a5f]/50 font-mono text-xs"
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-200 font-medium">{item.name}</span>
                    <span className="text-cyan-400 font-bold">{item.count}</span>
                    <span className="text-[10px] text-slate-400">({percent}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
