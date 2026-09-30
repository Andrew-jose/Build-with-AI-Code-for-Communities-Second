import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { RainfallPathwayZone } from '../types';
import { RiskBadge } from '../components/shared/RiskBadge';
import {
  CloudRain,
  Building2,
  ShieldAlert,
  Bot,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const RainfallPathwayPage: React.FC = () => {
  const { triggerAnalystPrompt } = useApp();
  const [pathways, setPathways] = useState<RainfallPathwayZone[]>([]);
  const [selectedZoneCode, setSelectedZoneCode] = useState<string>('AP-14');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRainfallPathways()
      .then(res => {
        setPathways(res);
        if (res.length > 0) setSelectedZoneCode(res[0].zoneCode);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeZone = pathways.find(p => p.zoneCode === selectedZoneCode) || pathways[0];

  const hydrographData = [
    { hour: 'T-24h', rainfallRate: 15, drainageCapacity: 45 },
    { hour: 'T-20h', rainfallRate: 25, drainageCapacity: 45 },
    { hour: 'T-16h', rainfallRate: 40, drainageCapacity: 42 },
    { hour: 'T-12h', rainfallRate: 65, drainageCapacity: 38 },
    { hour: 'T-8h', rainfallRate: 85, drainageCapacity: 30 },
    { hour: 'T-4h', rainfallRate: 70, drainageCapacity: 25 },
    { hour: 'LANDFALL', rainfallRate: 95, drainageCapacity: 20 },
    { hour: 'T+4h', rainfallRate: 45, drainageCapacity: 22 },
    { hour: 'T+8h', rainfallRate: 25, drainageCapacity: 30 },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto p-5 space-y-5">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#D9DEE5] gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">CAUSAL IMPACT CHAIN ENGINE</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>HYDRAULIC BACKWATER ANALYSIS & SLUICE GATE BACKFLOW</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#17202A] mt-0.5 flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-[#2563A6]" />
            <span>Rainfall → Damage Pathways & Infrastructure Cascade</span>
          </h2>
        </div>

        {/* Sector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto bg-[#FFFFFF] p-1 rounded border border-[#D9DEE5] text-xs shadow-2xs">
          {pathways.map(pw => (
            <button
              key={pw.zoneCode}
              onClick={() => setSelectedZoneCode(pw.zoneCode)}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                selectedZoneCode === pw.zoneCode
                  ? 'bg-[#123B5D] text-white font-semibold'
                  : 'text-[#5E6B78] hover:text-[#17202A] hover:bg-[#F0F2F5]'
              }`}
            >
              {pw.zoneCode} ({pw.zoneName.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {activeZone && (
        <div className="space-y-4">
          {/* Top Zone Snapshot KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-1 shadow-2xs">
              <span className="text-[10px] font-semibold uppercase text-[#5E6B78]">Expected 24h Rainfall</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#17202A] tabular-nums">
                  {activeZone.rainfallIntensityMm}
                </span>
                <span className="text-xs text-[#5E6B78]">mm / 24h</span>
              </div>
              <p className="text-[11px] text-[#7B8794]">Outer convective bands</p>
            </div>

            <div className="p-3.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-1 shadow-2xs">
              <span className="text-[10px] font-semibold uppercase text-[#5E6B78]">Drainage Overload</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#C88618] tabular-nums">
                  {activeZone.drainageOverloadPercent}%
                </span>
                <span className="text-xs text-[#5E6B78]">capacity</span>
              </div>
              <p className="text-[11px] text-[#7B8794]">Tidal sluice gate backflow locking</p>
            </div>

            <div className="p-3.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-1 shadow-2xs">
              <span className="text-[10px] font-semibold uppercase text-[#5E6B78]">Road Disruption Risk</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#C63C3C] tabular-nums">
                  {activeZone.roadDisruptionRiskPercent}%
                </span>
                <span className="text-xs text-[#5E6B78]">cut-off probability</span>
              </div>
              <p className="text-[11px] text-[#7B8794]">Standing depth: {activeZone.waterloggingDepthCm} cm</p>
            </div>

            <div className="p-3.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-1 shadow-2xs">
              <span className="text-[10px] font-semibold uppercase text-[#5E6B78]">Access Delay</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#17202A] tabular-nums">
                  +{activeZone.facilityAccessDelayMinutes}
                </span>
                <span className="text-xs text-[#5E6B78]">minutes</span>
              </div>
              <p className="text-[11px] text-[#7B8794]">Emergency vehicle transit delay</p>
            </div>
          </div>

          {/* Clean Analytical Causal Pathway Chain */}
          <div className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5]">
              <span className="text-xs font-semibold text-[#17202A] uppercase tracking-wide flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#123B5D]" />
                Causal Damage Progression: Precipitation to Response Delay
              </span>
              <RiskBadge level={activeZone.riskCategory} size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 pt-1">
              {activeZone.causalChain.map((step, idx) => (
                <div key={idx} className="relative flex flex-col justify-between p-3 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#123B5D] uppercase">
                      {step.step}
                    </span>
                    <p className="text-xs text-[#5E6B78] leading-snug">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <span className="text-xs font-mono font-semibold text-[#17202A] block">
                      {step.metric}
                    </span>
                  </div>

                  {idx < 5 && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FFFFFF] border border-[#D9DEE5] text-[#5E6B78] items-center justify-center text-[10px] z-10 font-bold">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Predictive Hydrograph: Rainfall Inflow vs Drainage Capacity */}
          <div className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#17202A] uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2563A6]" />
                Predictive Hydrograph: Rainfall Intensity vs Coastal Sluice Drainage Capacity
              </span>
              <span className="text-[11px] text-[#C63C3C] font-semibold">
                Critical Threshold Breached at T-12h
              </span>
            </div>

            <div className="h-56 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hydrographData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                  <XAxis dataKey="hour" stroke="#94A3B8" tick={{ fill: '#5E6B78', fontSize: 10 }} />
                  <YAxis stroke="#94A3B8" tick={{ fill: '#5E6B78', fontSize: 10 }} unit=" mm/h" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9DEE5', borderRadius: 4, fontSize: '12px', color: '#17202A' }}
                    labelStyle={{ color: '#17202A', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                  <Area
                    type="monotone"
                    dataKey="rainfallRate"
                    stroke="#2563A6"
                    fill="#2563A6"
                    fillOpacity={0.12}
                    name="Rainfall Inflow (mm/h)"
                  />
                  <Area
                    type="monotone"
                    dataKey="drainageCapacity"
                    stroke="#2E7D5B"
                    fill="#2E7D5B"
                    fillOpacity={0.10}
                    name="Gravity Drainage Capacity (mm/h)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Impacted Facilities & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-2.5 shadow-2xs">
              <span className="text-xs font-semibold text-[#17202A] uppercase flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#123B5D]" />
                Impaired Hospitals & Multi-Purpose Shelters
              </span>
              <div className="space-y-2">
                <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] text-xs">
                  <span className="text-[10px] font-semibold text-[#5E6B78] uppercase block">At-Risk Healthcare Facilities</span>
                  {activeZone.affectedHospitals.map((h, i) => (
                    <p key={i} className="text-[#17202A] font-medium mt-0.5">• {h}</p>
                  ))}
                </div>
                <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] text-xs">
                  <span className="text-[10px] font-semibold text-[#5E6B78] uppercase block">At-Risk Shelters</span>
                  {activeZone.affectedShelters.map((s, i) => (
                    <p key={i} className="text-[#17202A] font-medium mt-0.5">• {s}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] flex flex-col justify-between space-y-3 shadow-2xs">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#17202A] uppercase flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#123B5D]" />
                  Hydraulic Mitigation Recommendation
                </span>
                <p className="text-xs text-[#5E6B78] leading-relaxed">
                  Based on hydrodynamic backwater slope of 0.8% in sector {activeZone.zoneCode}, gravity drainage fails at T-6h due to simultaneous storm surge tidal locking. Immediate deployment of 4 high-capacity trailer diesel dewatering pumps required at main hospital culvert.
                </p>
              </div>

              <button
                onClick={() => triggerAnalystPrompt(`Analyze rainfall waterlogging disruption cascade for sector ${activeZone.zoneCode}`)}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white font-medium text-xs transition-colors shadow-xs"
              >
                <span>Run Detailed Hydraulic Analysis</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
