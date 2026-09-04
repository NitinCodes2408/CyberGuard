import React, { useState } from 'react';
import { 
  Radio, 
  Layers, 
  Cpu, 
  Network, 
  Globe, 
  Play, 
  RotateCcw, 
  FileCode2, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Info
} from 'lucide-react';
import { FEATURE_GROUPS, INITIAL_FORM_STATE } from '../data/features';
import { PRESETS } from '../data/presets';

const iconMap = {
  Radio,
  Layers,
  Cpu,
  Network,
  Globe
};

export default function TrafficAnalyzer({ onSubmit, loading }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [activeSection, setActiveSection] = useState('all'); // 'all' or specific group id
  const [selectedPresetName, setSelectedPresetName] = useState('Normal Web Traffic');

  // Handle direct field change
  const handleChange = (key, value, type) => {
    setFormData((prev) => ({
      ...prev,
      [key]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  // Load a preset dataset
  const handleLoadPreset = (presetName) => {
    const preset = PRESETS[presetName];
    if (preset) {
      setFormData(preset.data);
      setSelectedPresetName(presetName);
    }
  };

  // Reset form to blank or defaults
  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setSelectedPresetName('');
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure all numeric values are numbers before sending
    const sanitized = {};
    for (const [key, value] of Object.entries(formData)) {
      sanitized[key] = (typeof value === 'string' && !isNaN(Number(value)) && key !== 'proto' && key !== 'service' && key !== 'state')
        ? Number(value)
        : value;
    }
    onSubmit(sanitized);
  };

  return (
    <div className="cyber-card rounded-2xl border border-[#1e3a5f]/60 p-5 sm:p-7 space-y-6">
      {/* Header & Preset Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1e3a5f]/40">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 font-mono">
            <span>Analyze Network Traffic</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              POST /predict
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure telemetry parameters across 42 network features for real-time AI classification
          </p>
        </div>

        {/* Quick Dataset Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Presets:
          </span>
          {Object.keys(PRESETS).map((presetName) => {
            const isSelected = selectedPresetName === presetName;
            const isAttackPreset = PRESETS[presetName].isAttack;
            return (
              <button
                key={presetName}
                type="button"
                onClick={() => handleLoadPreset(presetName)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-mono transition-all border ${
                  isSelected
                    ? isAttackPreset
                      ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 shadow-glow-rose'
                      : 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-glow-emerald'
                    : 'bg-[#0b1220] border-[#1e3a5f]/60 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                }`}
              >
                {presetName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Preset Info Notice if active */}
      {selectedPresetName && PRESETS[selectedPresetName] && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono text-cyan-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Loaded Preset [{selectedPresetName}]:</strong> {PRESETS[selectedPresetName].description}
          </span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Render Form Sections */}
        {FEATURE_GROUPS.map((group) => {
          const Icon = iconMap[group.icon] || Radio;
          return (
            <div key={group.id} className="space-y-3">
              {/* Section Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1e3a5f]/30">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 font-mono">
                      {group.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{group.description}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {group.features.length} Features
                </span>
              </div>

              {/* Input Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 pt-1">
                {group.features.map((feat) => {
                  const currentValue = formData[feat.key] ?? '';
                  return (
                    <div key={feat.key} className="space-y-1 group">
                      <div className="flex items-center justify-between">
                        <label 
                          htmlFor={feat.key} 
                          className="text-[11px] font-mono font-medium text-slate-300 truncate"
                          title={feat.tooltip}
                        >
                          {feat.label}
                        </label>
                      </div>

                      {feat.type === 'select' ? (
                        <div className="relative">
                          <select
                            id={feat.key}
                            value={currentValue}
                            onChange={(e) => handleChange(feat.key, e.target.value, 'string')}
                            className="w-full px-2.5 py-1.5 bg-[#080e1a] border border-[#1e3a5f]/80 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all appearance-none cursor-pointer"
                          >
                            {feat.options.map((opt) => (
                              <option key={opt} value={opt} className="bg-[#080e1a] text-slate-200">
                                {opt}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ) : (
                        <input
                          id={feat.key}
                          type="number"
                          step={feat.step || 'any'}
                          value={currentValue}
                          onChange={(e) => handleChange(feat.key, e.target.value, 'number')}
                          className="w-full px-2.5 py-1.5 bg-[#080e1a] border border-[#1e3a5f]/80 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all placeholder:text-slate-600"
                          placeholder="0.0"
                          required
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1e3a5f]/50">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/60 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Defaults
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-sm tracking-wide shadow-glow-cyan transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Cpu className="w-4 h-4 animate-spin text-slate-950" />
                <span>Processing Neural Model...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-slate-950" />
                <span>Run AI Threat Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
