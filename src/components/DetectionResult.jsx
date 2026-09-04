import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Radar, 
  Activity, 
  Clock, 
  Shield, 
  Terminal, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Flame,
  FileCode,
  Zap
} from 'lucide-react';
import { getThreatIntelligence } from '../data/threatIntelligence';

export default function DetectionResult({ 
  result, 
  loading, 
  error, 
  timestamp,
  onDismiss,
  onRetry
}) {
  const [showRawResponse, setShowRawResponse] = useState(false);
  const [copied, setCopied] = useState(false);

  // If not loading, no error, and no result has been generated yet, show waiting panel
  if (!loading && !error && !result) {
    return (
      <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-[#1e3a5f]/50 text-center relative overflow-hidden">
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
            <Radar className="w-7 h-7 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-100 font-mono tracking-wide">
              AI Threat Classifier Ready
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Load an authentic UNSW-NB15 sample or configure the 42 telemetry features below, then click{' '}
              <strong className="text-cyan-400">"Run AI Threat Analysis"</strong>.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080e1a] border border-[#1e3a5f] text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Awaiting Traffic Payload &bull; POST /predict
          </div>
        </div>
      </div>
    );
  }

  // Loading State - Professional SOC Scanning State
  if (loading) {
    return (
      <div className="cyber-card rounded-2xl p-8 border border-cyan-500/60 shadow-glow-cyan text-center relative overflow-hidden">
        {/* Animated Scan Line */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent animate-scan"></div>

        <div className="flex flex-col items-center justify-center py-6 space-y-4 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/70 border border-cyan-400/60 flex items-center justify-center shadow-glow-cyan">
              <Radar className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '2.5s' }} />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500"></span>
            </span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-extrabold text-white tracking-wider font-mono uppercase">
              Analyzing Network Traffic...
            </h3>
            <p className="text-xs text-cyan-300 font-mono">
              Evaluating 42 Telemetry Features across Dual RandomForest Ensemble
            </p>
          </div>

          <div className="w-full max-w-md bg-slate-900 rounded-full h-1.5 overflow-hidden border border-cyan-500/30">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 w-full animate-pulse"></div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
            <span className="flex items-center gap-1 text-cyan-300">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Binary Threat Detector
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-cyan-300">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              Attack Category Classifier
            </span>
            <span>&bull;</span>
            <span className="text-slate-400">Port 8000</span>
          </div>
        </div>
      </div>
    );
  }

  // Graceful Error State
  if (error) {
    return (
      <div className="rounded-2xl p-6 sm:p-8 bg-rose-950/50 border border-rose-500/50 shadow-glow-rose text-center relative overflow-hidden">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-900/40 border border-rose-500/50 flex items-center justify-center text-rose-400">
            <XCircle className="w-8 h-8" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-rose-300 font-mono tracking-wide">
              PREDICTION ERROR: BACKEND UNAVAILABLE
            </h3>
            <p className="text-xs text-rose-200/90 max-w-lg mx-auto leading-relaxed">
              {error}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-rose-500/30 font-mono text-[11px] text-slate-300 text-left max-w-md w-full space-y-1">
            <div className="text-slate-400 font-bold">Troubleshooting steps:</div>
            <div>1. Verify FastAPI server is running on <code className="text-cyan-300">http://127.0.0.1:8000</code></div>
            <div>2. Check that Uvicorn process is active: <code className="text-slate-400">python -m uvicorn app.main:app --port 8000</code></div>
            <div>3. Test endpoint health directly via browser at <code className="text-cyan-300">http://127.0.0.1:8000/health</code></div>
          </div>

          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800/80 border border-rose-500/50 text-rose-200 text-xs font-mono transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </button>
          )}
        </div>
      </div>
    );
  }

  // Detection Result Data
  const isAttack = result?.attack === true || result?.prediction === 'Attack';
  const attackType = isAttack ? (result?.attack_type || 'Attack') : 'None';
  const threatInfo = getThreatIntelligence(attackType);
  const evaluationTime = timestamp || new Date().toLocaleString();

  // Copy raw JSON response to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`rounded-2xl p-6 sm:p-8 transition-all duration-500 relative overflow-hidden ${
        isAttack ? 'cyber-card-glow-red' : 'cyber-card-glow-green'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
        isAttack ? 'bg-rose-500/20' : 'bg-emerald-500/20'
      }`}></div>

      <div className="relative z-10 space-y-6">
        {/* Top Status Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-700/40">
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl border flex items-center justify-center shadow-lg ${
              isAttack 
                ? 'bg-rose-950/90 border-rose-500/70 text-rose-400 shadow-rose-950/50' 
                : 'bg-emerald-950/90 border-emerald-500/70 text-emerald-400 shadow-emerald-950/50'
            }`}>
              {isAttack ? (
                <ShieldAlert className="w-10 h-10 animate-bounce" style={{ animationDuration: '2s' }} />
              ) : (
                <ShieldCheck className="w-10 h-10" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`inline-block h-3 w-3 rounded-full ${
                  isAttack ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
                }`}></span>
                <span className={`text-xs font-mono font-bold tracking-widest uppercase ${
                  isAttack ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {isAttack ? 'CRITICAL SECURITY INCIDENT' : 'SECURITY VERIFICATION PASSED'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono flex items-center gap-3">
                {isAttack ? '🔴 THREAT DETECTED' : '🟢 TRAFFIC NORMAL'}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {evaluationTime}
                </span>
                <span>&bull;</span>
                <span className="text-slate-400">Endpoint: POST /predict</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Attack Type */}
            <div className={`px-4 py-2.5 rounded-xl border font-mono ${
              isAttack 
                ? 'bg-rose-950/70 border-rose-500/50 text-rose-100' 
                : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-100'
            }`}>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Attack Type
              </span>
              <span className={`text-base font-extrabold ${
                isAttack ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {attackType}
              </span>
            </div>

            {/* Severity Badge */}
            <div className={`px-4 py-2.5 rounded-xl border font-mono ${threatInfo.severityColor}`}>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Severity Score
              </span>
              <span className="text-base font-extrabold flex items-center gap-1">
                {threatInfo.severity}
                <span className="text-xs opacity-75 font-normal">({threatInfo.severityScore})</span>
              </span>
            </div>

            {/* Status */}
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 font-mono text-slate-300">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Classifier
              </span>
              <span className="text-sm font-bold text-cyan-400">
                RandomForest
              </span>
            </div>
          </div>
        </div>

        {/* Intelligence Detail: Explanation & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Left: Technical Threat / Safe Explanation */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wide uppercase text-slate-300">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>{isAttack ? 'Threat Analysis & Attack Mechanics' : 'Traffic Integrity Evaluation'}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs leading-relaxed text-slate-200 space-y-2">
              <p>{threatInfo.explanation}</p>
              {isAttack && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>MITRE Tactic: <strong className="text-cyan-300">{threatInfo.mitreTactic}</strong></span>
                  <span className="text-rose-400 font-bold">{threatInfo.riskLevel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Recommended Defensive Actions */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wide uppercase text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{isAttack ? 'Recommended Defensive Playbook' : 'SOC Operational Recommendations'}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200 space-y-2">
              <ul className="space-y-1.5">
                {threatInfo.defensiveActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className={`inline-block mt-0.5 font-mono text-[10px] px-1.5 py-0.2 rounded border ${
                      isAttack 
                        ? 'bg-rose-950 text-rose-300 border-rose-500/40' 
                        : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    }`}>
                      #{idx + 1}
                    </span>
                    <span className="leading-snug text-slate-300">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Human-Readable API Response Viewer (Requirement 10) */}
        <div className="pt-4 border-t border-slate-700/40">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowRawResponse(!showRawResponse)}
              className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{showRawResponse ? 'Hide Raw API Response' : 'Inspect Live Backend Response (POST /predict)'}</span>
              {showRawResponse ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400">
                Status: <span className="text-emerald-400 font-bold">200 OK</span>
              </span>
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                title="Copy JSON response"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>

          {showRawResponse && (
            <div className="mt-3 p-4 rounded-xl bg-[#060a12] border border-[#1e3a5f]/60 font-mono text-xs overflow-x-auto">
              <div className="text-[11px] text-slate-500 mb-1">// Real JSON Response from http://127.0.0.1:8000/predict</div>
              <pre className="text-cyan-300">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
