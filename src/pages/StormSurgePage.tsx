import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { RiskBadge } from '../components/shared/RiskBadge';
import { InteractiveMap } from '../components/map/InteractiveMap';
import {
  Waves,
  Sliders,
  AlertTriangle,
  Play,
  RotateCcw,
  Table,
  Layers,
  Info,
} from 'lucide-react';

export const StormSurgePage: React.FC = () => {
  const {
    surgeOutput,
    setSurgeOutput,
    activeScenario,
    setActiveScenario,
    zones,
  } = useApp();

  // Parametric simulation controls
  const [windSpeed, setWindSpeed] = useState(145);
  const [centralPressure, setCentralPressure] = useState(968);
  const [tideLevel, setTideLevel] = useState(1.2);
  const [approachAngle, setApproachAngle] = useState(105);
  const [seaAnomaly, setSeaAnomaly] = useState(0.3);
  const [simulating, setSimulating] = useState(false);

  const handleRunSimulation = async (scenario?: 'Baseline' | 'Expected' | 'Severe' | 'Extreme') => {
    setSimulating(true);
    try {
      let params = {
        windSpeedKmh: windSpeed,
        centralPressureHpa: centralPressure,
        radiusMaxWindsKm: 42,
        approachAngleDeg: approachAngle,
        tideLevelM: tideLevel,
        seaLevelAnomalyM: seaAnomaly,
        scenarioName: (scenario === 'Baseline' ? 'Conservative' : scenario === 'Severe' ? 'Extreme' : scenario) || ('Custom' as const),
      };

      if (scenario === 'Baseline') {
        params = { ...params, windSpeedKmh: 115, centralPressureHpa: 982, tideLevelM: 0.6, scenarioName: 'Conservative' };
        setWindSpeed(115);
        setCentralPressure(982);
        setTideLevel(0.6);
      } else if (scenario === 'Expected') {
        params = { ...params, windSpeedKmh: 145, centralPressureHpa: 968, tideLevelM: 1.2, scenarioName: 'Expected' };
        setWindSpeed(145);
        setCentralPressure(968);
        setTideLevel(1.2);
      } else if (scenario === 'Severe') {
        params = { ...params, windSpeedKmh: 160, centralPressureHpa: 958, tideLevelM: 1.5, scenarioName: 'Extreme' };
        setWindSpeed(160);
        setCentralPressure(958);
        setTideLevel(1.5);
      } else if (scenario === 'Extreme') {
        params = { ...params, windSpeedKmh: 180, centralPressureHpa: 948, tideLevelM: 1.9, scenarioName: 'Extreme' };
        setWindSpeed(180);
        setCentralPressure(948);
        setTideLevel(1.9);
      }

      const result = await api.simulateSurge(params as any);
      setSurgeOutput(result);
      if (scenario === 'Baseline') setActiveScenario('Conservative');
      else if (scenario === 'Severe' || scenario === 'Extreme') setActiveScenario('Extreme');
      else if (scenario === 'Expected') setActiveScenario('Expected');
      else setActiveScenario('Custom');
    } catch (err) {
      console.error('Simulation run failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto p-4 space-y-4 text-xs">
      {/* Top Banner: Title & Scenario Controls & Clear Disclaimer */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-[#D9DEE5] gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">HYDRODYNAMIC NUMERICAL MODELING</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>SHALLOW WATER EQUATION & TIDAL COUPLING</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#17202A] mt-0.5 flex items-center gap-2">
            <Waves className="w-5 h-5 text-[#123B5D]" />
            <span>Storm Surge Simulation</span>
          </h2>
        </div>

        {/* Center/Right: Understated Scenario Controls & Disclaimer */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Scenario Tabs: Baseline, Expected, Severe, Extreme */}
          <div className="flex items-center gap-1 bg-[#FFFFFF] border border-[#D9DEE5] p-1 rounded">
            <span className="text-[10px] font-semibold text-[#7B8794] uppercase px-1.5 hidden sm:inline">Scenario:</span>
            {(['Baseline', 'Expected', 'Severe', 'Extreme'] as const).map(sc => {
              const isSelected =
                (sc === 'Baseline' && activeScenario === 'Conservative') ||
                (sc === 'Expected' && activeScenario === 'Expected') ||
                ((sc === 'Severe' || sc === 'Extreme') && activeScenario === 'Extreme');

              return (
                <button
                  key={sc}
                  onClick={() => handleRunSimulation(sc)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#123B5D] text-white font-semibold'
                      : 'text-[#5E6B78] hover:text-[#17202A] hover:bg-[#F0F2F5]'
                  }`}
                >
                  {sc}
                </button>
              );
            })}
          </div>

          {/* Prominent Official Scientific Disclaimer */}
          <div className="px-3 py-1.5 rounded bg-[#C88618]/10 border border-[#C88618]/30 text-[#C88618] text-[11px] font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>SCENARIO SIMULATION — NOT AN OFFICIAL FLOOD BOUNDARY</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout: Left (Parameters), Center (Large Map), Right (Scenario Result) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[520px]">
        {/* Left Column: Simulation Parameters (3 of 12 cols) */}
        <div className="lg:col-span-3 rounded bg-[#FFFFFF] border border-[#D9DEE5] p-3.5 flex flex-col justify-between space-y-3 shadow-2xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5]">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#123B5D]" />
                <h3 className="font-semibold text-xs text-[#17202A] uppercase tracking-wider">
                  Simulation Parameters
                </h3>
              </div>
              <button
                onClick={() => handleRunSimulation('Expected')}
                className="text-[#7B8794] hover:text-[#17202A]"
                title="Reset to default baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[#5E6B78] mb-1">
                  <span>Sustained Wind Speed</span>
                  <span className="text-[#17202A] font-bold font-mono">{windSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={220}
                  step={5}
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full accent-[#123B5D] bg-[#E2E8F0] h-1.5 rounded cursor-pointer"
                />
                <span className="text-[10px] text-[#7B8794]">Standard IMD Category Threshold</span>
              </div>

              <div>
                <div className="flex justify-between text-[#5E6B78] mb-1">
                  <span>Central Atmospheric Pressure</span>
                  <span className="text-[#17202A] font-bold font-mono">{centralPressure} hPa</span>
                </div>
                <input
                  type="range"
                  min={920}
                  max={1000}
                  step={2}
                  value={centralPressure}
                  onChange={(e) => setCentralPressure(Number(e.target.value))}
                  className="w-full accent-[#123B5D] bg-[#E2E8F0] h-1.5 rounded cursor-pointer"
                />
                <span className="text-[10px] text-[#7B8794]">Deficit: {1013 - centralPressure} hPa</span>
              </div>

              <div>
                <div className="flex justify-between text-[#5E6B78] mb-1">
                  <span>Astronomical Tide Level</span>
                  <span className="text-[#17202A] font-bold font-mono">+{tideLevel} m</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={2.5}
                  step={0.1}
                  value={tideLevel}
                  onChange={(e) => setTideLevel(Number(e.target.value))}
                  className="w-full accent-[#123B5D] bg-[#E2E8F0] h-1.5 rounded cursor-pointer"
                />
                <span className="text-[10px] text-[#7B8794]">Above Mean Sea Level (MSL)</span>
              </div>

              <div>
                <div className="flex justify-between text-[#5E6B78] mb-1">
                  <span>Track Approach Angle</span>
                  <span className="text-[#17202A] font-bold font-mono">{approachAngle}° (WNW)</span>
                </div>
                <input
                  type="range"
                  min={45}
                  max={135}
                  step={5}
                  value={approachAngle}
                  onChange={(e) => setApproachAngle(Number(e.target.value))}
                  className="w-full accent-[#123B5D] bg-[#E2E8F0] h-1.5 rounded cursor-pointer"
                />
                <span className="text-[10px] text-[#7B8794]">Orthogonal landfall vector</span>
              </div>

              <div>
                <div className="flex justify-between text-[#5E6B78] mb-1">
                  <span>Sea Surface Level Anomaly</span>
                  <span className="text-[#17202A] font-bold font-mono">+{seaAnomaly} m</span>
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={0.8}
                  step={0.05}
                  value={seaAnomaly}
                  onChange={(e) => setSeaAnomaly(Number(e.target.value))}
                  className="w-full accent-[#123B5D] bg-[#E2E8F0] h-1.5 rounded cursor-pointer"
                />
                <span className="text-[10px] text-[#7B8794]">Thermal ocean expansion</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleRunSimulation()}
            disabled={simulating}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white font-medium text-xs transition-colors disabled:opacity-50 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{simulating ? 'Computing Hydrodynamics...' : 'Execute Simulation'}</span>
          </button>
        </div>

        {/* Center Column: Large Map (6 of 12 cols) */}
        <div className="lg:col-span-6 rounded bg-[#FFFFFF] border border-[#D9DEE5] overflow-hidden flex flex-col shadow-2xs">
          <div className="px-3.5 py-2 bg-[#F7F8FA] border-b border-[#D9DEE5] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#123B5D]" />
              <span className="font-semibold text-[#17202A]">
                Hydrodynamic Inundation Boundary Map
              </span>
            </div>
            <span className="text-[11px] text-[#5E6B78] font-mono">
              Peak Surge: +{surgeOutput?.maxSurgeM || 2.8}m MSL
            </span>
          </div>

          <div className="flex-1 min-h-[420px] relative">
            <InteractiveMap heightClass="h-full" showLayerControl={false} showLegend={true} />
          </div>
        </div>

        {/* Right Column: Scenario Result (3 of 12 cols) */}
        <div className="lg:col-span-3 rounded bg-[#FFFFFF] border border-[#D9DEE5] p-3.5 flex flex-col space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5]">
            <h3 className="font-semibold text-xs text-[#17202A] uppercase tracking-wider">
              Scenario Result
            </h3>
            <span className="px-1.5 py-0.2 rounded bg-[#F0F2F5] text-[#123B5D] font-mono text-[10px] font-bold">
              {activeScenario.toUpperCase()}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-2">
            <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-0.5">
              <span className="text-[10px] text-[#5E6B78] uppercase font-semibold">Peak Surge Height</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-[#123B5D] tabular-nums">
                  +{surgeOutput?.maxSurgeM || 2.8}
                </span>
                <span className="text-xs text-[#5E6B78]">m above MSL</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-0.5">
              <span className="text-[10px] text-[#5E6B78] uppercase font-semibold">Inundation Reach</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-[#17202A] tabular-nums">
                  {surgeOutput?.maxInundationDistanceKm || 4.5}
                </span>
                <span className="text-xs text-[#5E6B78]">km inland</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-0.5">
              <span className="text-[10px] text-[#5E6B78] uppercase font-semibold">Exposed Population</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-[#9E2635] tabular-nums">
                  {surgeOutput?.populationExposed.toLocaleString() || '64,800'}
                </span>
                <span className="text-xs text-[#5E6B78]">residents</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-0.5">
              <span className="text-[10px] text-[#5E6B78] uppercase font-semibold">Roadways Submerged</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-[#C88618] tabular-nums">
                  {surgeOutput?.affectedRoadsKm || 88.6}
                </span>
                <span className="text-xs text-[#5E6B78]">km cut-off</span>
              </div>
            </div>
          </div>

          {/* Sector Breaches mini-list */}
          <div className="pt-2 border-t border-[#D9DEE5] space-y-1.5 flex-1 overflow-y-auto">
            <span className="text-[10px] font-semibold uppercase text-[#7B8794] block">High-Risk Sectors:</span>
            {zones.slice(0, 4).map(z => (
              <div key={z.id} className="flex items-center justify-between py-1 border-b border-[#F0F2F5] last:border-0 text-[11px]">
                <span className="font-semibold text-[#17202A]">{z.code}</span>
                <span className="font-mono text-[#9E2635] font-bold">+{z.projectedSurgeM}m</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Metrics + Scientific Assumptions */}
      <div className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#123B5D]" />
            <h3 className="font-semibold text-xs text-[#17202A] uppercase tracking-wider">
              Hydrodynamic Metrics & Scientific Assumptions
            </h3>
          </div>
          <span className="text-[11px] text-[#7B8794]">
            Physics Calibration: 2D Depth-Integrated Shallow Water Equations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-1">
            <span className="font-semibold text-[#17202A] block text-[11px]">BATHYMETRIC SLOPE CALIBRATION</span>
            <p className="text-[#5E6B78] text-[11px] leading-relaxed">
              Continental shelf gradient modeled at 0.8% offshore delta slope with Manning roughness coefficient n = 0.035 for mangrove and estuarine lowlands.
            </p>
          </div>

          <div className="p-3 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-1">
            <span className="font-semibold text-[#17202A] block text-[11px]">TIDAL PHASE COUPLING</span>
            <p className="text-[#5E6B78] text-[11px] leading-relaxed">
              Astronomical spring high tide (M2 + S2 harmonic constituent) synchronizes within ±45 minutes of projected eye landfall at 23:30 UTC.
            </p>
          </div>

          <div className="p-3 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-1">
            <span className="font-semibold text-[#17202A] block text-[11px]">DRAINAGE LOCKING ASSUMPTION</span>
            <p className="text-[#5E6B78] text-[11px] leading-relaxed">
              Sluice gate backflow check-valves engage when oceanic surge elevation exceeds +0.8m MSL, preventing inland runoff discharge and producing backwater flooding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
