import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  RefreshCw, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Clock,
  Terminal
} from 'lucide-react';

export default function Header({ 
  onMenuToggle, 
  healthStatus, 
  isRefreshing, 
  onRefreshAll,
  apiEndpoint 
}) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = healthStatus?.status === 'running';

  return (
    <header className="sticky top-0 z-30 bg-[#060a12]/90 backdrop-blur-md border-b border-[#1e3a5f]/50 px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & SOC Title */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-[#0b1220] border border-[#1e3a5f]/50 hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg lg:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>AI Cyber Threat Detection</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                  SOC Node #01
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-time Network Intrusion Detection & Classification
            </p>
          </div>
        </div>

        {/* Right: Status Indicator & Action Bar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Clock */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b1220] border border-[#1e3a5f]/40 font-mono text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{time || '--:--:--'}</span>
            <span className="text-[10px] text-slate-400">LOC</span>
          </div>

          {/* Backend Status Indicator */}
          <div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold tracking-wide transition-all ${
              isOnline 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 shadow-glow-emerald' 
                : 'bg-rose-950/40 border-rose-500/40 text-rose-400 shadow-glow-rose'
            }`}
            title={`Backend endpoint: ${apiEndpoint}`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOnline ? 'bg-emerald-400' : 'bg-rose-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isOnline ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></span>
            </span>
            <span>{isOnline ? 'API Online' : 'API Offline'}</span>
          </div>

          {/* Refresh Action Button */}
          <button
            onClick={onRefreshAll}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b1220] border border-[#1e3a5f]/60 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs font-medium transition-all disabled:opacity-50"
            title="Refresh statistics and recent logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>
        </div>
      </div>
    </header>
  );
}
