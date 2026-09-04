import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  RefreshCw,
  Hash,
  Activity
} from 'lucide-react';

export default function RecentThreatLogs({ threats, loading, onRefresh }) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'attack', 'normal'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search logic
  const filteredThreats = (threats || []).filter((item) => {
    // Filter by classification
    if (filterType === 'attack' && item.prediction !== 'Attack') return false;
    if (filterType === 'normal' && item.prediction !== 'Normal') return false;

    // Filter by search query (id or attack_type)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const idMatch = String(item.id).toLowerCase().includes(q);
      const typeMatch = String(item.attack_type).toLowerCase().includes(q);
      const predMatch = String(item.prediction).toLowerCase().includes(q);
      return idMatch || typeMatch || predMatch;
    }

    return true;
  });

  return (
    <div className="cyber-card rounded-2xl border border-[#1e3a5f]/60 p-5 sm:p-7 space-y-5">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e3a5f]/40">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 font-mono">
            <History className="w-5 h-5 text-cyan-400" />
            <span>Recent Threat Activity</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail of network packet evaluations stored in SQLite database
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search threat or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#080e1a] border border-[#1e3a5f]/80 rounded-lg text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Classification Filter Tabs */}
          <div className="flex items-center p-1 rounded-lg bg-[#080e1a] border border-[#1e3a5f]/60 font-mono text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterType === 'all' 
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({threats?.length || 0})
            </button>
            <button
              onClick={() => setFilterType('attack')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterType === 'attack' 
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Attacks
            </button>
            <button
              onClick={() => setFilterType('normal')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterType === 'normal' 
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Normal
            </button>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg bg-[#080e1a] border border-[#1e3a5f]/60 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 transition-all"
            title="Reload recent logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#1e3a5f]/50 bg-[#080e1a]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-[#0b1220] border-b border-[#1e3a5f]/60 text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
              <th className="py-3 px-4">
                <span className="flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" />
                  ID
                </span>
              </th>
              <th className="py-3 px-4">Prediction</th>
              <th className="py-3 px-4">Attack Type</th>
              <th className="py-3 px-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Timestamp
                </span>
              </th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3a5f]/30">
            {filteredThreats.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Activity className="w-6 h-6 text-slate-500 animate-pulse" />
                    <span>No matching records located in threat history.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredThreats.map((log) => {
                const isAttack = log.prediction === 'Attack';
                return (
                  <tr 
                    key={log.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3 px-4 text-slate-400 font-bold group-hover:text-cyan-300">
                      #{log.id}
                    </td>

                    {/* Prediction Badge */}
                    <td className="py-3 px-4">
                      {isAttack ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-glow-rose">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                          Attack
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-glow-emerald">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Normal
                        </span>
                      )}
                    </td>

                    {/* Attack Type */}
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        isAttack ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {log.attack_type || (isAttack ? 'Exploits' : 'None')}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {log.timestamp || 'Just now'}
                    </td>

                    {/* Status Column */}
                    <td className="py-3 px-4">
                      {isAttack ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 text-[11px]">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Threat Flagged
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified Benign
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
        <span>Displaying newest logs first (auto-synced with SQLite)</span>
        <span>Showing {filteredThreats.length} of {threats?.length || 0} entries</span>
      </div>
    </div>
  );
}
