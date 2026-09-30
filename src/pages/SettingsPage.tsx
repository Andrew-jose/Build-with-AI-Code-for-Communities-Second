import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Settings,
  Server,
  Shield,
  Database,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [eeStatus, setEeStatus] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);

  // Safety Controls state
  const [humanApprovalRequired, setHumanApprovalRequired] = useState(true);
  const [officialWarningOverride, setOfficialWarningOverride] = useState(true);
  const [scenarioDisclaimerRequired, setScenarioDisclaimerRequired] = useState(true);
  const [recommendationLogging, setRecommendationLogging] = useState(true);

  // Data Governance state
  const [sourceValidationStrict, setSourceValidationStrict] = useState(true);
  const [fallbackModeAuto, setFallbackModeAuto] = useState(true);

  useEffect(() => {
    api.getEarthEngineStatus().then(res => setEeStatus(res)).catch(() => {});
    api.getHealth().then(res => setHealth(res)).catch(() => {});
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto p-5 space-y-5">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#D9DEE5] gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">ENTERPRISE CONFIGURATION</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>MODEL GOVERNANCE & SAFETY CONTROLS</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#17202A] mt-0.5 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#123B5D]" />
            <span>System Settings & AI Governance</span>
          </h2>
        </div>
      </div>

      <div className="space-y-4 max-w-5xl">
        {/* Section 1: AI GOVERNANCE */}
        <div className="bg-[#FFFFFF] border border-[#D9DEE5] rounded p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#D9DEE5]">
            <Server className="w-4 h-4 text-[#123B5D]" />
            <h3 className="font-semibold text-xs text-[#17202A] uppercase tracking-wider">
              AI Governance & Model Constraints
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-1">
              <span className="text-[#5E6B78] text-[11px] block">Model Provider & Architecture</span>
              <strong className="text-[#17202A] text-sm block">Gemini 3.8 Flash Multimodal</strong>
              <p className="text-[11px] text-[#7B8794]">SDK: @google/genai ^2.4.0 (Server-Side Proxy)</p>
            </div>

            <div className="p-3 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-1">
              <span className="text-[#5E6B78] text-[11px] block">System Prompt / Instructions</span>
              <strong className="text-[#17202A] text-sm block">Strict Evidence Grounding</strong>
              <p className="text-[11px] text-[#7B8794]">Mandatory citing of numeric hydrodynamic telemetry</p>
            </div>
          </div>

          <div className="p-3 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-1 text-xs">
            <span className="font-semibold text-[#17202A]">Reasoning Constraints:</span>
            <ul className="text-[#5E6B78] text-[11px] space-y-0.5 list-disc pl-4">
              <li>All numerical surge heights must match calibrated hydrodynamic model output.</li>
              <li>Evacuation advisories must reference official district administration thresholds.</li>
              <li>Cannot emit speculative casualty figures or unsubstantiated hazard predictions.</li>
            </ul>
          </div>
        </div>

        {/* Section 2: DATA GOVERNANCE */}
        <div className="bg-[#FFFFFF] border border-[#D9DEE5] rounded p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#D9DEE5]">
            <Database className="w-4 h-4 text-[#123B5D]" />
            <h3 className="font-semibold text-xs text-[#17202A] uppercase tracking-wider">
              Data Governance & Validation
            </h3>
          </div>

          <div className="divide-y divide-[#D9DEE5] text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-[#17202A] block">Data Sources & Provenance</span>
                <span className="text-[11px] text-[#5E6B78]">IMD RSMC, Copernicus GLO-30 DEM, APTRANSCO power network</span>
              </div>
              <span className="text-[11px] font-mono text-[#2E7D5B] font-semibold">VERIFIED</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-[#17202A] block">Data Freshness Window</span>
                <span className="text-[11px] text-[#5E6B78]">Automatic staleness flag triggered if sensor telemetry &gt; 15 min old</span>
              </div>
              <span className="text-[11px] font-mono text-[#17202A]">15 Min Threshold</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-[#17202A] block">Strict Source Validation</span>
                <span className="text-[11px] text-[#5E6B78]">Block unauthenticated third-party feeds from driving alert logic</span>
              </div>
              <input
                type="checkbox"
                checked={sourceValidationStrict}
                onChange={(e) => setSourceValidationStrict(e.target.checked)}
                className="h-4 w-4 rounded border-[#CBD5E1] text-[#123B5D] focus:ring-[#123B5D]"
              />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-[#17202A] block">Automated Fallback Mode</span>
                <span className="text-[11px] text-[#5E6B78]">Switch to verified parametric simulation baseline during network drop</span>
              </div>
              <input
                type="checkbox"
                checked={fallbackModeAuto}
                onChange={(e) => setFallbackModeAuto(e.target.checked)}
                className="h-4 w-4 rounded border-[#CBD5E1] text-[#123B5D] focus:ring-[#123B5D]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: SAFETY CONTROLS */}
        <div className="bg-[#FFFFFF] border border-[#D9DEE5] rounded p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#D9DEE5]">
            <Shield className="w-4 h-4 text-[#123B5D]" />
            <h3 className="font-semibold text-xs text-[#17202A] uppercase tracking-wider">
              Operational Safety Controls
            </h3>
          </div>

          <div className="divide-y divide-[#D9DEE5] text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-[#17202A] block">Human Approval Required</span>
                <span className="text-[11px] text-[#5E6B78]">All public broadcasts and cell cell-broadcast alerts require officer sign-off</span>
              </div>
              <input
                type="checkbox"
                checked={humanApprovalRequired}
                onChange={(e) => setHumanApprovalRequired(e.target.checked)}
                className="h-4 w-4 rounded border-[#CBD5E1] text-[#123B5D] focus:ring-[#123B5D]"
              />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-[#17202A] block">Official-Warning Override</span>
                <span className="text-[11px] text-[#5E6B78]">IMD statutory bulletins supersede all automated predictive models</span>
              </div>
              <input
                type="checkbox"
                checked={officialWarningOverride}
                onChange={(e) => setOfficialWarningOverride(e.target.checked)}
                className="h-4 w-4 rounded border-[#CBD5E1] text-[#123B5D] focus:ring-[#123B5D]"
              />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-[#17202A] block">Scenario Simulation Disclaimer</span>
                <span className="text-[11px] text-[#5E6B78]">Embed 'SCENARIO SIMULATION' watermarks on all exported maps and reports</span>
              </div>
              <input
                type="checkbox"
                checked={scenarioDisclaimerRequired}
                onChange={(e) => setScenarioDisclaimerRequired(e.target.checked)}
                className="h-4 w-4 rounded border-[#CBD5E1] text-[#123B5D] focus:ring-[#123B5D]"
              />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-[#17202A] block">Recommendation Logging & Audit Trail</span>
                <span className="text-[11px] text-[#5E6B78]">Record every AI analysis, prompt input, and operator action with timestamps</span>
              </div>
              <input
                type="checkbox"
                checked={recommendationLogging}
                onChange={(e) => setRecommendationLogging(e.target.checked)}
                className="h-4 w-4 rounded border-[#CBD5E1] text-[#123B5D] focus:ring-[#123B5D]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: SYSTEM STATUS & CONNECTIVITY */}
        <div className="bg-[#FFFFFF] border border-[#D9DEE5] rounded p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#D9DEE5]">
            <Sliders className="w-4 h-4 text-[#123B5D]" />
            <h3 className="font-semibold text-xs text-[#17202A] uppercase tracking-wider">
              System Services & Connectivity Status
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-[#5E6B78]">API Server</span>
                <span className="w-2 h-2 rounded-full bg-[#2E7D5B]" />
              </div>
              <span className="font-semibold text-[#17202A] block">REST Express Core</span>
              <span className="text-[10px] text-[#7B8794]">Port 3000 / Healthy</span>
            </div>

            <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-[#5E6B78]">Gemini Reasoning API</span>
                <span className="w-2 h-2 rounded-full bg-[#2E7D5B]" />
              </div>
              <span className="font-semibold text-[#17202A] block">{health?.geminiLive ? 'Connected' : 'Fallback Mode'}</span>
              <span className="text-[10px] text-[#7B8794]">gemini-3.8-flash</span>
            </div>

            <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-[#5E6B78]">Google Earth Engine</span>
                <span className="w-2 h-2 rounded-full bg-[#C88618]" />
              </div>
              <span className="font-semibold text-[#17202A] block">{eeStatus?.mode || 'Simulation Cache'}</span>
              <span className="text-[10px] text-[#7B8794]">Sentinel-1/2 Baselines</span>
            </div>

            <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-[#5E6B78]">Weather Telemetry</span>
                <span className="w-2 h-2 rounded-full bg-[#2E7D5B]" />
              </div>
              <span className="font-semibold text-[#17202A] block">IMD RSMC Feed</span>
              <span className="text-[10px] text-[#7B8794]">Calibrated 5 min sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
