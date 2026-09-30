import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  SlidersHorizontal,
  Bot,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const ScenarioLabPage: React.FC = () => {
  const { triggerAnalystPrompt } = useApp();

  const comparisonData = [
    {
      scenario: 'Baseline',
      population: 18400,
      areaKm2: 38.5,
      roadsKm: 24.2,
      substations: 1,
      hospitals: 1,
      surgeHeightM: 1.6,
    },
    {
      scenario: 'Expected',
      population: 64800,
      areaKm2: 114.2,
      roadsKm: 88.6,
      substations: 4,
      hospitals: 3,
      surgeHeightM: 2.8,
    },
    {
      scenario: 'Severe',
      population: 98000,
      areaKm2: 172.0,
      roadsKm: 132.5,
      substations: 6,
      hospitals: 4,
      surgeHeightM: 3.5,
    },
    {
      scenario: 'Extreme',
      population: 142000,
      areaKm2: 248.6,
      roadsKm: 184.0,
      substations: 8,
      hospitals: 6,
      surgeHeightM: 4.2,
    },
  ];

  const [windSlider, setWindSlider] = useState(155);
  const [pressureSlider, setPressureSlider] = useState(962);
  const [tideSlider, setTideSlider] = useState(1.4);
  const [customPopResult, setCustomPopResult] = useState<number>(78500);
  const [customAreaResult, setCustomAreaResult] = useState<number>(138.4);
  const [customSurgeResult, setCustomSurgeResult] = useState<number>(3.1);

  const handleRunSim = () => {
    const calculatedSurge = Math.round((((1013 - pressureSlider) * 0.01) + (Math.pow(windSlider / 3.6, 2) / (9.81 * 25)) * 1.35 + tideSlider) * 10) / 10;
    const pop = Math.round(calculatedSurge * 25000 + 4000);
    const area = Math.round(calculatedSurge * 44.5 * 10) / 10;
    setCustomSurgeResult(calculatedSurge);
    setCustomPopResult(pop);
    setCustomAreaResult(area);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto p-5 space-y-5">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#D9DEE5] gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">MULTI-VARIABLE STRESS TESTING</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>PARAMETRIC CASCADE SIMULATION</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#17202A] mt-0.5 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#123B5D]" />
            <span>Disaster Scenario Simulation Lab</span>
          </h2>
        </div>

        <button
          onClick={() => triggerAnalystPrompt('Compare baseline vs expected vs extreme scenarios and highlight when secondary health networks collapse')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-xs font-medium transition-colors shadow-xs"
        >
          <Bot className="w-3.5 h-3.5 text-[#93C5FD]" />
          <span>Multi-Scenario Stress Analysis</span>
        </button>
      </div>

      {/* Side-by-Side 4-Scenario Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {comparisonData.map(item => (
          <div
            key={item.scenario}
            className={`p-3.5 rounded border space-y-2.5 bg-[#FFFFFF] shadow-2xs ${
              item.scenario === 'Extreme'
                ? 'border-t-3 border-t-[#9E2635] border-x-[#D9DEE5] border-b-[#D9DEE5]'
                : item.scenario === 'Severe'
                ? 'border-t-3 border-t-[#C88618] border-x-[#D9DEE5] border-b-[#D9DEE5]'
                : item.scenario === 'Expected'
                ? 'border-t-3 border-t-[#123B5D] border-x-[#D9DEE5] border-b-[#D9DEE5]'
                : 'border border-[#D9DEE5]'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5]">
              <span className="text-xs font-bold text-[#17202A] uppercase">
                {item.scenario}
              </span>
              <span className="font-mono text-xs font-semibold text-[#123B5D]">
                +{item.surgeHeightM}m Surge
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5E6B78]">Exposed Population:</span>
                <span className="text-[#17202A] font-bold font-mono">{item.population.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6B78]">Inundated Area:</span>
                <span className="text-[#17202A] font-mono">{item.areaKm2} km²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6B78]">Road Disruption:</span>
                <span className="text-[#17202A] font-mono">{item.roadsKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6B78]">Flooded Substations:</span>
                <span className="text-[#17202A] font-mono">{item.substations} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6B78]">Compromised Hospitals:</span>
                <span className="text-[#17202A] font-mono">{item.hospitals} units</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Chart (Recharts) */}
      <div className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-2 shadow-2xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#17202A] uppercase">
            Cross-Scenario Comparative Impact Evaluation
          </span>
          <span className="text-[11px] text-[#7B8794]">Population vs Submerged Land vs Road Disruption</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
              <XAxis dataKey="scenario" stroke="#94A3B8" tick={{ fill: '#5E6B78', fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#94A3B8" tick={{ fill: '#5E6B78', fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" tick={{ fill: '#5E6B78', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9DEE5', borderRadius: 4, fontSize: '12px', color: '#17202A' }}
                labelStyle={{ color: '#17202A', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
              <Bar yAxisId="left" dataKey="population" fill="#123B5D" name="Exposed Population" radius={[2, 2, 0, 0]} />
              <Bar yAxisId="right" dataKey="areaKm2" fill="#2563A6" name="Inundated Area (km²)" radius={[2, 2, 0, 0]} />
              <Bar yAxisId="right" dataKey="roadsKm" fill="#C88618" name="Road Disruption (km)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Custom Simulation Controls */}
      <div className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-3 shadow-2xs">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#D9DEE5]">
          <span className="font-semibold text-[#17202A] uppercase">
            Parametric Sensitivity Tuning
          </span>
          <button
            onClick={handleRunSim}
            className="px-3 py-1 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-xs font-medium transition-colors shadow-2xs"
          >
            Compute Sensitivity Result
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="flex justify-between text-[#5E6B78] mb-1">
              <span>Wind Velocity:</span>
              <span className="font-mono text-[#17202A] font-bold">{windSlider} km/h</span>
            </div>
            <input
              type="range"
              min={100}
              max={220}
              value={windSlider}
              onChange={(e) => setWindSlider(Number(e.target.value))}
              className="w-full accent-[#123B5D] bg-[#E2E8F0] h-1.5 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[#5E6B78] mb-1">
              <span>Pressure Deficit:</span>
              <span className="font-mono text-[#17202A] font-bold">{pressureSlider} hPa</span>
            </div>
            <input
              type="range"
              min={930}
              max={995}
              value={pressureSlider}
              onChange={(e) => setPressureSlider(Number(e.target.value))}
              className="w-full accent-[#123B5D] bg-[#E2E8F0] h-1.5 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[#5E6B78] mb-1">
              <span>Tide Anomaly:</span>
              <span className="font-mono text-[#17202A] font-bold">+{tideSlider} m</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.5}
              step={0.1}
              value={tideSlider}
              onChange={(e) => setTideSlider(Number(e.target.value))}
              className="w-full accent-[#123B5D] bg-[#E2E8F0] h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-[#5E6B78] block">Projected Surge</span>
            <span className="text-base font-bold font-mono text-[#123B5D]">+{customSurgeResult} m</span>
          </div>
          <div>
            <span className="text-[10px] text-[#5E6B78] block">Simulated Population</span>
            <span className="text-base font-bold font-mono text-[#17202A]">{customPopResult.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#5E6B78] block">Inundation Reach</span>
            <span className="text-base font-bold font-mono text-[#17202A]">{customAreaResult} km²</span>
          </div>
        </div>
      </div>
    </div>
  );
};
