import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Radar, 
  History, 
  BarChart3, 
  Server, 
  Cpu, 
  Activity,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen, healthStatus }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'detection', label: 'Threat Detection', icon: Radar, badge: 'Live ML' },
    { id: 'history', label: 'Threat History', icon: History, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'status', label: 'System Status', icon: Server, badge: null },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
    
    // Also smooth-scroll to the respective section if in unified view
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#080d1a] border-r border-[#1e3a5f]/60 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e3a5f]/40">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 shadow-glow-cyan">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-wider text-slate-100 flex items-center gap-1.5">
                  CyberGuard <span className="text-cyan-400 text-sm font-black px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">AI</span>
                </h1>
                <p className="text-[11px] text-slate-400 font-mono tracking-tight">SOC IDS / IPS V1.0</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
              Core Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-glow-cyan' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom AI Status Section */}
        <div className="p-4 border-t border-[#1e3a5f]/40 space-y-3">
          <div className="p-3 rounded-xl bg-[#0b1220] border border-[#1e3a5f]/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                AI Engine
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Dual RFC Ensemble
            </div>
            <div className="mt-2 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-1 rounded-full w-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 font-mono">
            <span>UNSW-NB15 ML Core</span>
            <span className="text-cyan-400">42 Features</span>
          </div>
        </div>
      </aside>
    </>
  );
}
