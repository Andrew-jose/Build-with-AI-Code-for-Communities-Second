import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Printer,
  Calendar,
  Building,
  Users,
  Waves,
} from 'lucide-react';

export const ReportingPage: React.FC = () => {
  const { cyclone, surgeOutput, assets, zones, actions } = useApp();
  const [reportType, setReportType] = useState<string>('EXECUTIVE_BRIEF');

  const reportTypes = [
    { id: 'EXECUTIVE_BRIEF', title: 'Executive Pre-Landfall Risk Brief', icon: <FileText className="w-4 h-4" /> },
    { id: 'SITREP_12H', title: '12-Hour Operational Situation Report (SitRep)', icon: <Calendar className="w-4 h-4" /> },
    { id: 'INFRASTRUCTURE_REPORT', title: 'Critical Infrastructure Exposure Audit', icon: <Building className="w-4 h-4" /> },
    { id: 'EVACUATION_READINESS', title: 'Evacuation Readiness & Shelter Assessment', icon: <Users className="w-4 h-4" /> },
    { id: 'SURGE_SCENARIO', title: 'Hydrodynamic Surge Scenario Evaluation', icon: <Waves className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto p-5 space-y-5">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#D9DEE5] gap-3 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">INCIDENT AUDIT & DOCUMENT ARCHIVE</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>GOVERNMENT OF ANDHRA PRADESH / APSDMA</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#17202A] mt-0.5 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#123B5D]" />
            <span>Disaster Operations Reporting Center</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-print text-xs">
        {reportTypes.map(rt => (
          <button
            key={rt.id}
            onClick={() => setReportType(rt.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap ${
              reportType === rt.id
                ? 'bg-[#123B5D] text-white font-semibold'
                : 'bg-[#FFFFFF] border border-[#D9DEE5] text-[#5E6B78] hover:text-[#17202A] hover:bg-[#F0F2F5]'
            }`}
          >
            {rt.icon}
            <span>{rt.title}</span>
          </button>
        ))}
      </div>

      {/* Printable Report Document Sheet */}
      <div className="p-8 rounded bg-[#FFFFFF] border border-[#D9DEE5] shadow-xs space-y-5 text-xs max-w-4xl mx-auto print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Formal Report Header */}
        <div className="pb-3 border-b border-[#D9DEE5] print:border-black space-y-2">
          <div className="flex justify-between items-start text-[11px] text-[#5E6B78] print:text-gray-600">
            <div>
              <p className="font-bold text-[#17202A] print:text-black">GOVERNMENT OF ANDHRA PRADESH</p>
              <p>STATE DISASTER MANAGEMENT AUTHORITY (APSDMA)</p>
            </div>
            <div className="text-right font-mono">
              <p>DOCUMENT ID: SITREP-2026-BOB04-09</p>
              <p>TIMESTAMP: {new Date().toUTCString()}</p>
            </div>
          </div>

          <div className="pt-2">
            <h1 className="text-lg font-bold text-[#17202A] print:text-black tracking-tight uppercase">
              {reportTypes.find(r => r.id === reportType)?.title}
            </h1>
            <p className="text-[#9E2635] print:text-red-700 font-semibold mt-0.5 font-mono text-[11px]">
              EVENT: {cyclone?.name || 'CYCLONE VARUNA'} · CLASSIFICATION: {cyclone?.classification} · THREAT: EXTREME
            </p>
          </div>
        </div>

        {/* 1. Meteorological Status */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase text-[#17202A] print:text-black border-b border-[#D9DEE5] pb-1">
            1. Meteorological & Coastal Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
            <div className="p-2.5 bg-[#F7F8FA] print:bg-gray-100 rounded border border-[#D9DEE5]">
              <span className="text-[#7B8794] print:text-gray-500 block">Eye Position</span>
              <strong className="text-[#17202A] print:text-black font-mono">{cyclone?.currentLat}°N, {cyclone?.currentLng}°E</strong>
            </div>
            <div className="p-2.5 bg-[#F7F8FA] print:bg-gray-100 rounded border border-[#D9DEE5]">
              <span className="text-[#7B8794] print:text-gray-500 block">Sustained Wind</span>
              <strong className="text-[#17202A] print:text-black font-mono">{cyclone?.maxSustainedWindKmh} km/h (Gusts: {cyclone?.gustsKmh})</strong>
            </div>
            <div className="p-2.5 bg-[#F7F8FA] print:bg-gray-100 rounded border border-[#D9DEE5]">
              <span className="text-[#7B8794] print:text-gray-500 block">Central Pressure</span>
              <strong className="text-[#17202A] print:text-black font-mono">{cyclone?.centralPressureHpa} hPa</strong>
            </div>
            <div className="p-2.5 bg-[#F7F8FA] print:bg-gray-100 rounded border border-[#D9DEE5]">
              <span className="text-[#7B8794] print:text-gray-500 block">Expected Landfall</span>
              <strong className="text-[#9E2635] print:text-red-700 font-mono">~14.5 Hours (23:30 UTC)</strong>
            </div>
          </div>
        </div>

        {/* Report-Specific Content Sections */}
        {reportType === 'INFRASTRUCTURE_REPORT' ? (
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase text-[#17202A] print:text-black border-b border-[#D9DEE5] pb-1">
              2. Critical Infrastructure Exposure & Vulnerability Register
            </h3>
            <table className="w-full text-left text-[11px] border border-[#D9DEE5] print:border-gray-400">
              <thead className="bg-[#F7F8FA] print:bg-gray-200">
                <tr>
                  <th className="p-2">Asset Name</th>
                  <th className="p-2">Sector</th>
                  <th className="p-2">Type</th>
                  <th className="p-2 text-right">Hazard</th>
                  <th className="p-2 text-right">Exposure</th>
                  <th className="p-2 text-right">Crit</th>
                  <th className="p-2 text-right">Priority</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE5] print:divide-gray-300">
                {assets.slice(0, 8).map(a => (
                  <tr key={a.id}>
                    <td className="p-2 font-semibold text-[#17202A] print:text-black">{a.name}</td>
                    <td className="p-2 font-mono text-[#123B5D]">{a.zoneCode}</td>
                    <td className="p-2 text-[#5E6B78]">{a.type}</td>
                    <td className="p-2 text-right font-mono">{a.hazardScore}</td>
                    <td className="p-2 text-right font-mono">{a.exposureScore}</td>
                    <td className="p-2 text-right font-mono">{a.criticalityScore}</td>
                    <td className="p-2 text-right font-mono font-bold text-[#17202A]">{a.priorityRiskScore}</td>
                    <td className="p-2">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : reportType === 'EVACUATION_READINESS' ? (
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-[#17202A] print:text-black border-b border-[#D9DEE5] pb-1">
              2. Evacuation Readiness & Cyclone Shelters Deployment
            </h3>
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                <span className="text-[10px] text-[#5E6B78] block">Exposed Citizens</span>
                <span className="text-base font-bold font-mono text-[#9E2635]">{surgeOutput?.populationExposed.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                <span className="text-[10px] text-[#5E6B78] block">Designated Shelters</span>
                <span className="text-base font-bold text-[#2E7D5B]">42 Concrete Havens</span>
              </div>
              <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                <span className="text-[10px] text-[#5E6B78] block">Evacuation Convoys</span>
                <span className="text-base font-bold text-[#123B5D]">180 RTC Buses Staged</span>
              </div>
            </div>

            <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded space-y-1 text-[11px] text-[#5E6B78]">
              <strong className="text-[#17202A] block">MANDATED CORRIDOR PRIORITY:</strong>
              <p>• Diviseema Island (AP-12): Mandatory evacuation across Avanigadda bridge before 18:00 UTC (T-6h).</p>
              <p>• Uppada Beach Polders (AP-15): Relocation of 6,800 residents to Kakinada High School relief shelters.</p>
              <p>• Machilipatnam Lowlands (AP-09): Evacuate 12,000 residents seaward of the tidal canal.</p>
            </div>
          </div>
        ) : reportType === 'SURGE_SCENARIO' ? (
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-[#17202A] print:text-black border-b border-[#D9DEE5] pb-1">
              2. Hydrodynamic Surge Inundation Evaluation
            </h3>
            <div className="grid grid-cols-4 gap-2.5 text-center text-xs">
              <div className="p-2.5 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                <span className="text-[10px] text-[#5E6B78] block">Peak Surge</span>
                <span className="text-base font-bold font-mono text-[#123B5D]">+{surgeOutput?.maxSurgeM} m</span>
              </div>
              <div className="p-2.5 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                <span className="text-[10px] text-[#5E6B78] block">Inundation Reach</span>
                <span className="text-base font-bold font-mono text-[#17202A]">{surgeOutput?.maxInundationDistanceKm} km</span>
              </div>
              <div className="p-2.5 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                <span className="text-[10px] text-[#5E6B78] block">Submerged Area</span>
                <span className="text-base font-bold font-mono text-[#17202A]">{surgeOutput?.affectedAreaKm2} km²</span>
              </div>
              <div className="p-2.5 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                <span className="text-[10px] text-[#5E6B78] block">Cut-Off Roadways</span>
                <span className="text-base font-bold font-mono text-[#C88618]">{surgeOutput?.affectedRoadsKm} km</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-[#17202A] print:text-black border-b border-[#D9DEE5] pb-1">
              2. High-Risk Sector Impact Projections
            </h3>
            <table className="w-full text-left text-[11px] border border-[#D9DEE5] print:border-gray-400">
              <thead className="bg-[#F7F8FA] print:bg-gray-200">
                <tr>
                  <th className="p-2">Sector Code</th>
                  <th className="p-2">Name</th>
                  <th className="p-2 text-right">Population</th>
                  <th className="p-2 text-right">Elev (m)</th>
                  <th className="p-2 text-right">Surge (m)</th>
                  <th className="p-2 text-right">Cutoff Prob</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE5] print:divide-gray-300">
                {zones.slice(0, 6).map(z => (
                  <tr key={z.id}>
                    <td className="p-2 font-mono font-bold text-[#123B5D]">{z.code}</td>
                    <td className="p-2 text-[#17202A]">{z.name}</td>
                    <td className="p-2 text-right font-mono">{z.population.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono">{z.elevationM}</td>
                    <td className="p-2 text-right font-mono font-bold text-[#123B5D]">+{z.projectedSurgeM}</td>
                    <td className="p-2 text-right font-mono text-[#C88618]">{z.roadDisruptionProbPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="font-bold text-xs uppercase text-[#17202A] print:text-black border-b border-[#D9DEE5] pb-1 pt-2">
              3. Anticipatory Action Deployment Log
            </h3>
            <div className="space-y-1 text-[11px]">
              {actions.slice(0, 4).map(act => (
                <div key={act.id} className="p-2 bg-[#F7F8FA] border border-[#D9DEE5] rounded flex justify-between gap-2">
                  <div>
                    <span className="text-[#123B5D] font-bold mr-2">[{act.timelineStage}]</span>
                    <strong className="text-[#17202A]">{act.action}</strong>
                    <span className="text-[#5E6B78] block text-[10px]">Zone: {act.affectedZone} · Agency: {act.responsibleAgency}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-semibold text-[#17202A]">{act.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Governance & Disclaimers */}
        <div className="space-y-1 pt-3 border-t border-[#D9DEE5] print:border-black text-[10px] text-[#5E6B78] print:text-gray-600 leading-relaxed">
          <p className="font-bold text-[#17202A] print:text-black uppercase">Official Governance Clearance & Incident Mandate:</p>
          <p>
            1. All atmospheric and hydrodynamic projections are generated by calibrated shallow-water models and numerical meteorological ensembles. Statutory evacuation orders are issued exclusively by District Collectors under Section 34 of the Disaster Management Act, 2005.
          </p>
          <p>
            2. Population figures are derived from gridded census datasets and verified against the National Disaster Management Authority (NDMA) vulnerability atlas.
          </p>
        </div>
      </div>
    </div>
  );
};
