import React from 'react';
import { useApp } from '../context/AppContext';
import { KpiCard } from '../components/shared/KpiCard';
import { RiskBadge } from '../components/shared/RiskBadge';
import { InteractiveMap } from '../components/map/InteractiveMap';
import {
  Users,
  Waves,
  Building2,
  Route,
  Clock,
  ArrowRight,
  AlertTriangle,
  Bot,
  ExternalLink,
  ShieldCheck,
  Activity,
  Wind,
  Gauge,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const CommandCenterPage: React.FC = () => {
  const {
    cyclone,
    surgeOutput,
    assets,
    zones,
    actions,
    alerts,
    trackPoints,
    setActivePage,
    triggerAnalystPrompt,
    loading,
  } = useApp();

  // Compute live KPIs
  const highRiskZones = zones.filter(
    z => z.threatLevel === 'EXTREME' || z.threatLevel === 'CRITICAL'
  );
  const criticalAssetsCount = assets.filter(a => a.status === 'CRITICAL_RISK' || a.status === 'AT_RISK').length;

  const chartData = trackPoints.map(p => ({
    label: p.label.replace(' (Projected)', '').replace(' (Inland)', ''),
    windSpeed: p.windSpeedKmh,
    pressure: p.pressureHpa,
  }));

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F7FA] p-8 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#CBD5E1] border-t-[#123B5D] animate-spin" />
        <p className="text-xs font-medium text-[#5E6B78]">Synchronizing Coastal GIS Telemetry & Models...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto">
      {/* ------------------------------------------------
          TOP SUMMARY
          Cyclone Varuna | Bay of Bengal | Projected landfall: 14h 32m
          Population exposed | Critical assets | Inundation | Road disruption
          ------------------------------------------------ */}
      <div className="px-5 py-3 border-b border-[#D9DEE5] bg-[#FFFFFF] flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">NATIONAL EMERGENCY OPERATIONS CENTER</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>BAY OF BENGAL SECTOR</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span className="font-mono text-[11px]">RSMC BULLETIN #14</span>
          </div>
          <div className="flex items-center gap-2.5 mt-0.5">
            <h1 className="text-xl font-bold tracking-tight text-[#17202A]">
              Command Center
            </h1>
            <span className="text-xs text-[#5E6B78] font-normal">
              {cyclone?.name || 'Cyclone Varuna'} ({cyclone?.classification || 'Severe Cyclonic Storm'})
            </span>
            <RiskBadge level={cyclone?.threatLevel || 'EXTREME'} size="sm" />
          </div>
        </div>

        {/* Projected Landfall & AI Brief Launcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#9E2635]/8 border border-[#9E2635]/25 text-xs text-[#9E2635] font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Projected Landfall:</span>
            <strong className="font-bold">14h 32m (~23:30 UTC)</strong>
          </div>

          <button
            onClick={() => triggerAnalystPrompt('Provide a concise 12-hour situation brief and highlight highest priority protective actions')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Bot className="w-3.5 h-3.5 text-[#93C5FD]" />
            <span>12h Situation Brief</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Row (Four Key Operational Anchors) */}
      <div className="px-5 py-3 grid grid-cols-2 lg:grid-cols-4 gap-3 bg-[#FFFFFF] border-b border-[#D9DEE5]">
        <KpiCard
          title="Population Exposed"
          value={surgeOutput?.populationExposed || 64800}
          unit="citizens"
          threatLevel="EXTREME"
          subtitle="Within 2.5m contour"
          icon={<Users className="w-4 h-4" />}
          onClick={() => setActivePage('VULNERABILITY')}
        />
        <KpiCard
          title="Critical Assets at Risk"
          value={criticalAssetsCount}
          unit="facilities"
          threatLevel="CRITICAL"
          subtitle="Substations, hospitals & bridges"
          icon={<Building2 className="w-4 h-4" />}
          onClick={() => setActivePage('INFRASTRUCTURE')}
        />
        <KpiCard
          title="Inundation Area"
          value={surgeOutput?.affectedAreaKm2 || 114.2}
          unit="km²"
          threatLevel="HIGH"
          subtitle="Hydrodynamic breach"
          icon={<Waves className="w-4 h-4" />}
          onClick={() => setActivePage('STORM_SURGE')}
        />
        <KpiCard
          title="Road Disruption"
          value={surgeOutput?.affectedRoadsKm || 88.6}
          unit="km"
          threatLevel="HIGH"
          subtitle="NH-216 & island causeways"
          icon={<Route className="w-4 h-4" />}
          onClick={() => setActivePage('RAINFALL_PATHWAY')}
        />
      </div>

      {/* ------------------------------------------------
          LARGE LIVE MAP (65-70% workspace) + RIGHT INTELLIGENCE PANEL (30-35%)
          ------------------------------------------------ */}
      <div className="p-5 grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Large Live Map (8 of 12 columns on desktop ≈ 67% width) */}
        <div className="xl:col-span-8 rounded border border-[#D9DEE5] overflow-hidden flex flex-col bg-[#FFFFFF] shadow-2xs">
          {/* Map Top Bar */}
          <div className="px-4 py-2 bg-[#F7F8FA] border-b border-[#D9DEE5] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C63C3C]" />
              <span className="font-semibold text-[#17202A] tracking-tight">
                Live Multi-Hazard Geospatial Operational Picture
              </span>
              <span className="text-[#CBD5E1]">|</span>
              <span className="text-[#5E6B78] text-[11px] hidden sm:inline">
                Andhra Pradesh Coastal Delta
              </span>
            </div>

            <button
              onClick={() => setActivePage('LIVE_MAP')}
              className="flex items-center gap-1 text-[11px] text-[#2563A6] hover:text-[#123B5D] font-medium transition-colors"
            >
              <span>Full GIS Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Map Canvas */}
          <div className="h-[460px] relative">
            <InteractiveMap heightClass="h-full" showLayerControl={false} showLegend={true} />
          </div>
        </div>

        {/* Right Intelligence Panel (4 of 12 columns ≈ 33% width) */}
        <div className="xl:col-span-4 flex flex-col space-y-4">
          {/* CURRENT SITUATION & AI RISK SUMMARY */}
          <div className="bg-[#FFFFFF] border border-[#D9DEE5] rounded p-4 flex flex-col space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#123B5D]" />
                <h3 className="font-semibold text-xs text-[#17202A] uppercase tracking-wider">
                  Current Situation & AI Risk Summary
                </h3>
              </div>
              <span className="text-[10px] text-[#7B8794] font-mono">T-14.5h</span>
            </div>

            <p className="text-xs text-[#5E6B78] leading-relaxed">
              Eye of Cyclone Varuna located at <strong className="text-[#17202A]">{cyclone?.currentLat}°N, {cyclone?.currentLng}°E</strong> with central pressure <strong className="text-[#17202A]">{cyclone?.centralPressureHpa} hPa</strong>. High-tide surge of +{surgeOutput?.maxSurgeM || 2.8}m projected to breach coastal embankments in sectors AP-12 (Diviseema) and AP-14 (Kakinada).
            </p>

            <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] text-[11px] text-[#17202A] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#5E6B78]">Peak Sustained Wind:</span>
                <span className="font-semibold font-mono">{cyclone?.maxSustainedWindKmh || 145} km/h (Gusts: {cyclone?.gustsKmh || 175})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6B78]">High-Risk Sectors:</span>
                <span className="font-semibold text-[#9E2635]">{highRiskZones.map(z => z.code).join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6B78]">Lifeline Causeways:</span>
                <span className="font-semibold text-[#C63C3C]">Avanigadda cutoff risk &gt;82%</span>
              </div>
            </div>
          </div>

          {/* PRIORITY ACTIONS */}
          <div className="bg-[#FFFFFF] border border-[#D9DEE5] rounded p-4 flex flex-col space-y-3 shadow-2xs flex-1">
            <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C88618]" />
                <h3 className="font-semibold text-xs text-[#17202A] uppercase tracking-wider">
                  Priority Actions
                </h3>
              </div>
              <button
                onClick={() => setActivePage('ANTICIPATORY_ACTIONS')}
                className="text-[11px] text-[#2563A6] hover:text-[#123B5D] flex items-center gap-1 font-medium transition-colors"
              >
                <span>View All ({actions.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-56 pr-0.5">
              {actions.slice(0, 3).map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] text-xs space-y-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-[#17202A] line-clamp-1">{act.action}</span>
                    <RiskBadge level={act.priority} size="sm" />
                  </div>
                  <p className="text-[11px] text-[#5E6B78] line-clamp-2 leading-relaxed">{act.reason}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#7B8794] pt-1 border-t border-[#E2E8F0]">
                    <span>Phase: <strong className="text-[#17202A]">{act.timelineStage}</strong></span>
                    <span className="font-medium text-[#123B5D]">{act.affectedZone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Incident Alerts */}
          <div className="bg-[#FFFFFF] border border-[#D9DEE5] rounded p-4 flex flex-col space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#C63C3C]" />
                <h3 className="font-semibold text-xs text-[#17202A] uppercase tracking-wider">
                  Active Alerts
                </h3>
              </div>
              <button
                onClick={() => setActivePage('ALERTS')}
                className="text-[11px] text-[#2563A6] hover:text-[#123B5D] flex items-center gap-1 font-medium transition-colors"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {alerts.slice(0, 2).map((alt) => (
                <div
                  key={alt.id}
                  className="p-2.5 rounded bg-[#FFFFFF] border-l-3 border-[#C63C3C] border-y border-r border-[#D9DEE5] text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#17202A] text-xs line-clamp-1">
                      {alt.title}
                    </span>
                    <RiskBadge level={alt.severity} size="sm" />
                  </div>
                  <p className="text-[11px] text-[#5E6B78] line-clamp-1">{alt.trigger}</p>
                  <div className="text-[10px] text-[#7B8794] flex justify-between pt-0.5">
                    <span>{alt.location}</span>
                    <span>{alt.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------
          BOTTOM: CHARTS AND OPERATIONAL INDICATORS
          Professional, non-slop layout
          ------------------------------------------------ */}
      <div className="px-5 pb-5">
        <div className="rounded border border-[#D9DEE5] bg-[#FFFFFF] shadow-2xs overflow-hidden">
          <div className="px-4 py-2.5 bg-[#F7F8FA] border-b border-[#D9DEE5] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#123B5D]" />
              <span className="font-semibold text-[#17202A] uppercase tracking-wider">
                Operational Telemetry & Inundation Trajectory
              </span>
            </div>
            <span className="text-[11px] text-[#7B8794]">
              Coupled RSMC Wind Model & Hydrodynamic Gauge Predictions
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#D9DEE5]">
            {/* Chart Column: Sustained Wind & Pressure Trajectory */}
            <div className="lg:col-span-7 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#17202A] flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-[#123B5D]" />
                  Wind Velocity Inflow Curve (km/h)
                </span>
                <span className="text-[11px] text-[#5E6B78] font-mono">
                  Peak at Landfall: 155 km/h
                </span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                    <XAxis dataKey="label" stroke="#94A3B8" tick={{ fill: '#5E6B78', fontSize: 10 }} />
                    <YAxis domain={[60, 170]} stroke="#94A3B8" tick={{ fill: '#5E6B78', fontSize: 10 }} unit=" km/h" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9DEE5', borderRadius: 4, fontSize: '11px', color: '#17202A' }}
                      labelStyle={{ color: '#17202A', fontWeight: 'bold' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="windSpeed"
                      stroke="#123B5D"
                      fill="#123B5D"
                      fillOpacity={0.12}
                      name="Wind Velocity"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Operational Indicators Column */}
            <div className="lg:col-span-5 p-4 flex flex-col justify-between space-y-3 text-xs">
              <span className="font-semibold text-[#17202A] uppercase tracking-wider text-[11px] block">
                Critical Infrastructure Operational Indicators
              </span>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#5E6B78]">Storm Surge Embankment Stress</span>
                    <span className="font-mono font-semibold text-[#9E2635]">92% (Critical)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div className="h-full bg-[#9E2635] w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#5E6B78]">Coastal Power Grid Isolation</span>
                    <span className="font-mono font-semibold text-[#C88618]">68% (In Progress)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div className="h-full bg-[#C88618] w-[68%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#5E6B78]">Shelter Capacity Utilization</span>
                    <span className="font-mono font-semibold text-[#2E7D5B]">44% (Adequate)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div className="h-full bg-[#2E7D5B] w-[44%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#5E6B78]">Lifeline Causeway Accessibility</span>
                    <span className="font-mono font-semibold text-[#C63C3C]">32% (Severely Impaired)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div className="h-full bg-[#C63C3C] w-[32%]" />
                  </div>
                </div>
              </div>

              <div className="p-2 rounded bg-[#F7F8FA] border border-[#D9DEE5] flex items-center justify-between text-[11px]">
                <span className="text-[#5E6B78]">Evacuation Protocol Stage:</span>
                <span className="font-bold text-[#123B5D]">Stage 2 — Mandatory Lowland Clearance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
