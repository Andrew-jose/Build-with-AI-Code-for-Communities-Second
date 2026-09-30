import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/shared/RiskBadge';
import {
  Compass,
  Wind,
  Gauge,
  Navigation,
  Sliders,
  Clock,
  Table,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export const CycloneTrackPage: React.FC = () => {
  const { cyclone, trackPoints, activeScenario, setActiveScenario } = useApp();
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(4); // Default CURRENT

  const currentPt = trackPoints[selectedPointIndex] || trackPoints[4];

  // Prepare chart data
  const chartData = trackPoints.map(p => ({
    label: p.label.replace(' (Projected)', '').replace(' (Inland)', ''),
    timestamp: p.timestamp,
    windSpeed: p.windSpeedKmh,
    pressure: p.pressureHpa,
    uncertainty: p.uncertaintyConeKm,
  }));

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto p-5 space-y-5">
      {/* Title & Scenario Selector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#D9DEE5] gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">METEOROLOGICAL TRAJECTORY ENGINE</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>RSMC / IMD BULLETIN SYNCHRONIZATION</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#17202A] mt-0.5 flex items-center gap-2">
            <span>{cyclone?.name || 'Cyclone Varuna'} Track & Intensity Telemetry</span>
            <RiskBadge level={cyclone?.threatLevel || 'EXTREME'} size="sm" />
          </h2>
        </div>

        {/* Intensity Scenario Selector */}
        <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#D9DEE5] p-1 rounded text-xs shadow-2xs">
          <div className="flex items-center gap-1.5 px-2 text-[#5E6B78]">
            <Sliders className="w-3.5 h-3.5 text-[#123B5D]" />
            <span>Scenario:</span>
          </div>
          {(['Conservative', 'Expected', 'Extreme'] as const).map(sc => (
            <button
              key={sc}
              onClick={() => setActiveScenario(sc)}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeScenario === sc
                  ? 'bg-[#123B5D] text-white font-semibold'
                  : 'text-[#5E6B78] hover:text-[#17202A] hover:bg-[#F0F2F5]'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* Current Eye & Landfall Coordinates Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-1 shadow-2xs">
          <span className="text-[11px] uppercase font-semibold text-[#5E6B78] flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#123B5D]" />
            Selected Waypoint Node
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#17202A]">
              {currentPt?.label}
            </span>
          </div>
          <p className="text-xs text-[#5E6B78] font-mono">
            {currentPt?.lat.toFixed(2)}°N, {currentPt?.lng.toFixed(2)}°E · {currentPt?.timestamp}
          </p>
        </div>

        <div className="p-3.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-1 shadow-2xs">
          <span className="text-[11px] uppercase font-semibold text-[#5E6B78] flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-[#2563A6]" />
            Max Sustained Wind Speed
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-[#17202A] tabular-nums">
              {currentPt?.windSpeedKmh}
            </span>
            <span className="text-xs text-[#5E6B78]">km/h</span>
          </div>
          <p className="text-xs text-[#5E6B78]">
            Gusts: {Math.round(currentPt?.windSpeedKmh * 1.25)} km/h · Eye: {currentPt?.radiusKm} km
          </p>
        </div>

        <div className="p-3.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-1 shadow-2xs">
          <span className="text-[11px] uppercase font-semibold text-[#5E6B78] flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-[#C88618]" />
            Central Atmospheric Pressure
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-[#17202A] tabular-nums">
              {currentPt?.pressureHpa}
            </span>
            <span className="text-xs text-[#5E6B78]">hPa</span>
          </div>
          <p className="text-xs text-[#5E6B78]">
            Deficit: {1013 - currentPt?.pressureHpa} hPa below ambient baseline
          </p>
        </div>

        <div className="p-3.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-1 shadow-2xs">
          <span className="text-[11px] uppercase font-semibold text-[#5E6B78] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#2E7D5B]" />
            Forward Translation Vector
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-[#17202A] tabular-nums">
              16.2
            </span>
            <span className="text-xs text-[#5E6B78]">km/h</span>
          </div>
          <p className="text-xs text-[#5E6B78]">
            Heading: WNW (295°) · Cone: ±{currentPt?.uncertaintyConeKm} km
          </p>
        </div>
      </div>

      {/* Visual Forecast Timeline Stepper */}
      <div className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#17202A] uppercase flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#123B5D]" />
            Forecast Approach Sequence
          </span>
          <span className="text-[#7B8794] text-[11px]">
            Click any node to view coordinates and barometric metrics
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
          {trackPoints.map((pt, idx) => {
            const isSelected = selectedPointIndex === idx;
            const isCurrent = pt.status === 'CURRENT';
            const isLandfall = pt.label.includes('LANDFALL');

            return (
              <button
                key={pt.id}
                onClick={() => setSelectedPointIndex(idx)}
                className={`p-2.5 rounded border text-left transition-colors relative ${
                  isSelected
                    ? 'bg-[#EAEFF5] border-[#123B5D] text-[#123B5D]'
                    : isCurrent
                    ? 'bg-[#F7F8FA] border-[#CBD5E1] text-[#17202A]'
                    : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#5E6B78] hover:bg-[#F0F2F5] hover:text-[#17202A]'
                }`}
              >
                {isLandfall && (
                  <span className="absolute -top-2 right-2 px-1 py-0.2 bg-[#9E2635] text-white font-mono text-[9px] font-bold rounded">
                    IMPACT
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-2 right-2 px-1 py-0.2 bg-[#123B5D] text-white font-mono text-[9px] font-bold rounded">
                    NOW
                  </span>
                )}

                <span className="text-[11px] font-semibold block truncate">
                  {pt.label}
                </span>
                <span className="text-xs font-mono font-bold text-[#17202A] block mt-0.5">
                  {pt.windSpeedKmh} km/h
                </span>
                <span className="text-[10px] text-[#7B8794] block font-mono">
                  {pt.pressureHpa} hPa
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Telemetry Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Wind Speed Chart */}
        <div className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#17202A] flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-[#2563A6]" />
              Maximum Sustained Wind Speed (km/h) vs Time
            </span>
            <span className="text-[11px] font-mono text-[#9E2635] font-semibold">Peak: 155 km/h</span>
          </div>

          <div className="h-60 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="label" stroke="#94A3B8" tick={{ fill: '#5E6B78', fontSize: 10 }} />
                <YAxis domain={[50, 180]} stroke="#94A3B8" tick={{ fill: '#5E6B78', fontSize: 10 }} unit=" km/h" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9DEE5', borderRadius: 4, fontSize: '12px', color: '#17202A' }}
                  labelStyle={{ color: '#17202A', fontWeight: 'bold' }}
                />
                <ReferenceLine x="LANDFALL" stroke="#9E2635" strokeDasharray="3 3" label={{ value: 'LANDFALL', fill: '#9E2635', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="#123B5D"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#123B5D' }}
                  activeDot={{ r: 5 }}
                  name="Wind Speed (km/h)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pressure Chart */}
        <div className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#17202A] flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#C88618]" />
              Central Atmospheric Pressure (hPa) vs Time
            </span>
            <span className="text-[11px] font-mono text-[#C88618] font-semibold">Min: 962 hPa</span>
          </div>

          <div className="h-60 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                <XAxis dataKey="label" stroke="#94A3B8" tick={{ fill: '#5E6B78', fontSize: 10 }} />
                <YAxis domain={[950, 1010]} reversed stroke="#94A3B8" tick={{ fill: '#5E6B78', fontSize: 10 }} unit=" hPa" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9DEE5', borderRadius: 4, fontSize: '12px', color: '#17202A' }}
                  labelStyle={{ color: '#17202A', fontWeight: 'bold' }}
                />
                <ReferenceLine x="LANDFALL" stroke="#9E2635" strokeDasharray="3 3" label={{ value: 'LANDFALL', fill: '#9E2635', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#C88618"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#C88618' }}
                  activeDot={{ r: 5 }}
                  name="Pressure (hPa)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Official RSMC Cyclone Trajectory Data Table */}
      <div className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#17202A] uppercase flex items-center gap-2">
            <Table className="w-4 h-4 text-[#5E6B78]" />
            Official Meteorological Waypoint Telemetry Log
          </span>
          <span className="text-[11px] text-[#7B8794]">
            Source: IMD New Delhi Cyclone Bulletin #14
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#D9DEE5]">
            <thead className="bg-[#F7F8FA] border-b border-[#D9DEE5] text-[11px] uppercase text-[#5E6B78]">
              <tr>
                <th className="p-2.5">Waypoint / Label</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Coordinates</th>
                <th className="p-2.5 text-right">Wind (km/h)</th>
                <th className="p-2.5 text-right">Pressure (hPa)</th>
                <th className="p-2.5 text-right">Uncertainty Cone</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5]">
              {trackPoints.map((p, idx) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPointIndex(idx)}
                  className={`hover:bg-[#F0F2F5] cursor-pointer transition-colors ${
                    selectedPointIndex === idx ? 'bg-[#EAEFF5] text-[#123B5D] font-semibold' : 'text-[#17202A]'
                  }`}
                >
                  <td className="p-2.5">{p.label}</td>
                  <td className="p-2.5 text-[#5E6B78] font-mono">{p.timestamp}</td>
                  <td className="p-2.5 font-mono">{p.lat.toFixed(2)}°N, {p.lng.toFixed(2)}°E</td>
                  <td className="p-2.5 text-right font-mono font-bold text-[#123B5D]">{p.windSpeedKmh}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-[#C88618]">{p.pressureHpa}</td>
                  <td className="p-2.5 text-right font-mono text-[#7B8794]">±{p.uncertaintyConeKm} km</td>
                  <td className="p-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      p.status === 'CURRENT'
                        ? 'bg-[#123B5D]/10 text-[#123B5D] border border-[#123B5D]/20'
                        : p.status === 'FORECAST'
                        ? 'bg-[#9E2635]/10 text-[#9E2635] border border-[#9E2635]/20'
                        : 'bg-[#F0F2F5] text-[#5E6B78]'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
