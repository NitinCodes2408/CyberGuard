import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import TrafficAnalyzer from './components/TrafficAnalyzer';
import DetectionResult from './components/DetectionResult';
import ThreatAnalytics from './components/ThreatAnalytics';
import RecentThreatLogs from './components/RecentThreatLogs';
import SystemStatus from './components/SystemStatus';
import ThreatDetectionPage from './components/ThreatDetectionPage';
import { checkHealth, fetchStats, fetchThreats, predictTraffic } from './api/client';
import { getApiBaseUrl, setApiBaseUrl } from './api/config';
import { AlertTriangle, Settings, Check, RefreshCw, Radar, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Live Data States
  const [healthStatus, setHealthStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [threats, setThreats] = useState([]);
  
  // Loading & Error States
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionError, setPredictionError] = useState(null);
  const [predictionTimestamp, setPredictionTimestamp] = useState(null);

  // Settings / API URL Modal
  const [showSettings, setShowSettings] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState(getApiBaseUrl());

  /**
   * Fetch all backend statistics and threat history
   */
  const loadDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [healthRes, statsRes, threatsRes] = await Promise.allSettled([
        checkHealth(),
        fetchStats(),
        fetchThreats(100),
      ]);

      if (healthRes.status === 'fulfilled') {
        setHealthStatus(healthRes.value);
      } else {
        setHealthStatus({ status: 'offline' });
      }

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value);
      }

      if (threatsRes.status === 'fulfilled') {
        setThreats(threatsRes.value);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsRefreshing(false);
      setIsInitialLoading(false);
    }
  }, []);

  // Initial Load & Health Polling
  useEffect(() => {
    loadDashboardData();

    // Auto-poll health every 15 seconds
    const interval = setInterval(async () => {
      try {
        const h = await checkHealth();
        setHealthStatus(h);
      } catch (e) {
        setHealthStatus({ status: 'offline' });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  /**
   * Main Prediction Flow
   * 1. Call POST /predict
   * 2. Display prediction result
   * 3. Refresh /stats
   * 4. Refresh /threats
   * 5. Update dashboard statistics
   * 6. Update attack distribution chart
   */
  const handlePredict = async (trafficData) => {
    setIsPredicting(true);
    setPredictionError(null);

    // Scroll to detection result on mobile / small screens
    const resultElement = document.getElementById('detection-result-container');
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    try {
      const result = await predictTraffic(trafficData);
      setPredictionResult(result);
      setPredictionTimestamp(new Date().toLocaleString());

      // Refresh stats and threat logs dynamically from real backend
      const [statsRes, threatsRes] = await Promise.all([
        fetchStats(),
        fetchThreats(100),
      ]);
      setStats(statsRes);
      setThreats(threatsRes);
    } catch (err) {
      console.error('Prediction failed:', err);
      const errMsg = err.response?.data?.detail 
        || err.message 
        || 'Network connection error. Ensure FastAPI is running on http://127.0.0.1:8000';
      setPredictionError(errMsg);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSaveApiUrl = (e) => {
    e.preventDefault();
    setApiBaseUrl(customApiUrl);
    setShowSettings(false);
    loadDashboardData();
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 cyber-grid relative">
      {/* Radial ambient background glow */}
      <div className="fixed inset-0 pointer-events-none cyber-radial-glow z-0"></div>

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        healthStatus={healthStatus}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10">
        {/* Top Header */}
        <Header
          onMenuToggle={() => setMobileOpen(true)}
          healthStatus={healthStatus}
          isRefreshing={isRefreshing}
          onRefreshAll={loadDashboardData}
          apiEndpoint={getApiBaseUrl()}
        />

        {/* API Offline Warning Banner */}
        {healthStatus?.status === 'offline' && (
          <div className="bg-rose-950/80 border-b border-rose-500/50 px-4 py-2.5 text-center text-xs font-mono text-rose-300 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Warning:</strong> Cannot reach backend API at{' '}
              <code className="bg-rose-900/60 px-1.5 py-0.5 rounded text-rose-200">
                {getApiBaseUrl()}
              </code>
              . Verify that Uvicorn is active on port 8000.
            </span>
            <button
              onClick={() => setShowSettings(true)}
              className="underline hover:text-white ml-2 text-[11px]"
            >
              Configure URL
            </button>
          </div>
        )}

        {/* Page Views Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* VIEW 1: DEDICATED THREAT DETECTION PAGE */}
          {activeTab === 'detection' && (
            <ThreatDetectionPage
              onPredict={handlePredict}
              isPredicting={isPredicting}
              predictionResult={predictionResult}
              predictionError={predictionError}
              predictionTimestamp={predictionTimestamp}
              onClearResult={() => setPredictionResult(null)}
              recentThreats={threats}
              apiEndpoint={getApiBaseUrl()}
              onNavigateToHistory={() => setActiveTab('history')}
            />
          )}

          {/* VIEW 2: FULL SOC DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Section 1: Top Statistics Cards */}
              <section id="dashboard-stats" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Telemetry Overview
                    </h2>
                    <p className="text-xs text-slate-400">Live inference statistics from SQLite store</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('detection')}
                    className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition-all shadow-glow-cyan"
                  >
                    <Radar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Open Threat Detection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <StatsCards stats={stats} loading={isInitialLoading} />
              </section>

              {/* Section 2: Quick Detection Result Display Panel */}
              <section id="detection-result-container" className="space-y-2">
                <DetectionResult
                  result={predictionResult}
                  loading={isPredicting}
                  error={predictionError}
                  timestamp={predictionTimestamp}
                  onDismiss={() => setPredictionResult(null)}
                />
              </section>

              {/* Section 3: Network Traffic Analyzer Form */}
              <section id="traffic-analyzer-section" className="space-y-4">
                <TrafficAnalyzer
                  onSubmit={handlePredict}
                  loading={isPredicting}
                />
              </section>

              {/* Section 4: Threat Analytics Charts */}
              <section id="analytics-section" className="space-y-4">
                <ThreatAnalytics stats={stats} loading={isInitialLoading} />
              </section>

              {/* Section 5: Recent Threat Activity Table */}
              <section id="history-section" className="space-y-4">
                <RecentThreatLogs
                  threats={threats}
                  loading={isRefreshing}
                  onRefresh={loadDashboardData}
                />
              </section>

              {/* Section 6: System Status Telemetry */}
              <section id="status-section" className="space-y-4">
                <SystemStatus
                  healthStatus={healthStatus}
                  apiEndpoint={getApiBaseUrl()}
                  stats={stats}
                />
              </section>
            </div>
          )}

          {/* VIEW 3: THREAT HISTORY PAGE */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e3a5f]/40">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight font-mono">
                    Threat Activity Logs & Historical Audit
                  </h2>
                  <p className="text-xs text-slate-400">Complete historical evaluation records from SQLite database</p>
                </div>
              </div>
              <RecentThreatLogs
                threats={threats}
                loading={isRefreshing}
                onRefresh={loadDashboardData}
              />
            </div>
          )}

          {/* VIEW 4: THREAT ANALYTICS PAGE */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e3a5f]/40">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight font-mono">
                    Intrusion Analytics & Threat Distribution
                  </h2>
                  <p className="text-xs text-slate-400">Deep category breakdown across evaluated network flows</p>
                </div>
              </div>
              <StatsCards stats={stats} loading={isInitialLoading} />
              <ThreatAnalytics stats={stats} loading={isInitialLoading} />
            </div>
          )}

          {/* VIEW 5: SYSTEM STATUS PAGE */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e3a5f]/40">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight font-mono">
                    Infrastructure Telemetry & Model Status
                  </h2>
                  <p className="text-xs text-slate-400">Live operational status across models, database, and endpoints</p>
                </div>
              </div>
              <SystemStatus
                healthStatus={healthStatus}
                apiEndpoint={getApiBaseUrl()}
                stats={stats}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#1e3a5f]/40 px-4 sm:px-8 py-5 text-center text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            AI-Based Cyber Threat Detection & Intrusion Classification System &copy; 2026
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>FastAPI + SQLite</span>
            <span>&bull;</span>
            <span>RandomForest Core</span>
            <span>&bull;</span>
            <button
              onClick={() => setShowSettings(true)}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              API Settings
            </button>
          </div>
        </footer>
      </div>

      {/* Settings Modal (Configure API URL) */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="cyber-card rounded-2xl border border-cyan-500/40 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e3a5f]/50">
              <h3 className="font-bold text-base text-white font-mono flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                Backend Endpoint Configuration
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveApiUrl} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">
                  FastAPI Server URL:
                </label>
                <input
                  type="text"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  placeholder="http://127.0.0.1:8000"
                  className="w-full px-3 py-2 bg-[#080e1a] border border-[#1e3a5f] rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Default: <code className="text-slate-300">http://127.0.0.1:8000</code>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
