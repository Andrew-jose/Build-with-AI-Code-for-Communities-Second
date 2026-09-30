import React from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../shared/RiskBadge';
import {
  X,
  MapPin,
  Building2,
  Bot,
  FileCheck2,
  AlertTriangle,
} from 'lucide-react';

export const MapInspectionDrawer: React.FC = () => {
  const {
    selectedZone,
    setSelectedZone,
    selectedAsset,
    setSelectedAsset,
    triggerAnalystPrompt,
    setEvidenceModalData,
    updateAssetStatus,
  } = useApp();

  if (!selectedZone && !selectedAsset) return null;

  const isAsset = Boolean(selectedAsset);
  const title = isAsset ? selectedAsset?.name : `${selectedZone?.code} — ${selectedZone?.name}`;
  const threatLevel = isAsset ? selectedAsset?.threatLevel : selectedZone?.threatLevel;

  return (
    <div
      role="region"
      aria-label="Intelligence Drawer"
      className="absolute top-4 right-4 z-[600] w-80 sm:w-92 bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-lg overflow-hidden flex flex-col max-h-[calc(100%-2rem)] select-none"
    >
      {/* Header */}
      <div className="p-3 bg-[#F7F8FA] border-b border-[#D9DEE5] flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="p-1.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] text-[#123B5D] shrink-0 mt-0.5">
            {isAsset ? <Building2 className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#5E6B78] uppercase font-mono">
                {isAsset ? `Asset · ${selectedAsset?.category}` : `Coastal Sector · ${selectedZone?.district}`}
              </span>
              <RiskBadge level={threatLevel || 'HIGH'} size="sm" />
            </div>
            <h4 className="text-sm font-semibold text-[#17202A] truncate mt-0.5">{title}</h4>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedZone(null);
            setSelectedAsset(null);
          }}
          className="text-[#7B8794] hover:text-[#17202A] p-1 rounded hover:bg-[#EAEFF5] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-3.5 overflow-y-auto space-y-3.5 text-xs">
        {/* If Asset Selected */}
        {selectedAsset && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-1">
              <span className="text-[10px] font-semibold uppercase text-[#7B8794]">Asset Specification</span>
              <p className="text-[#17202A] font-medium">{selectedAsset.type}</p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-[#5E6B78] font-mono">
                <span>Sector: {selectedAsset.zoneCode}</span>
                <span>Elev: {selectedAsset.elevationM}m</span>
                <span>Coast: {selectedAsset.distanceToCoastlineKm}km</span>
              </div>
            </div>

            {/* Priority Risk Calculation */}
            <div className="p-2.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase text-[#5E6B78]">Operational Priority Index</span>
                <span className="text-sm font-bold font-mono text-[#C63C3C] tabular-nums">
                  {selectedAsset.priorityRiskScore}
                </span>
              </div>
              <p className="text-[10px] text-[#7B8794]">
                Index = (Hazard {selectedAsset.hazardScore} × Exposure {selectedAsset.exposureScore} × Vuln {selectedAsset.vulnerabilityScore} × Crit {selectedAsset.criticalityScore}) / 100
              </p>
              <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px] pt-1 border-t border-[#D9DEE5]">
                <div className="p-1 bg-[#F0F2F5] rounded">
                  <span className="text-[#7B8794] block">HAZ</span>
                  <span className="font-semibold text-[#17202A]">{selectedAsset.hazardScore}</span>
                </div>
                <div className="p-1 bg-[#F0F2F5] rounded">
                  <span className="text-[#7B8794] block">EXP</span>
                  <span className="font-semibold text-[#17202A]">{selectedAsset.exposureScore}</span>
                </div>
                <div className="p-1 bg-[#F0F2F5] rounded">
                  <span className="text-[#7B8794] block">VUL</span>
                  <span className="font-semibold text-[#17202A]">{selectedAsset.vulnerabilityScore}</span>
                </div>
                <div className="p-1 bg-[#F0F2F5] rounded">
                  <span className="text-[#7B8794] block">CRI</span>
                  <span className="font-semibold text-[#C63C3C]">{selectedAsset.criticalityScore}</span>
                </div>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="p-2.5 rounded bg-[#C63C3C]/8 border border-[#C63C3C]/20 space-y-1">
              <div className="flex items-center gap-1.5 text-[#C63C3C] font-semibold text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Protective Protocol</span>
              </div>
              <p className="text-[#17202A] text-[11px] leading-relaxed">
                {selectedAsset.recommendedAction}
              </p>
            </div>

            {/* Asset Status Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#5E6B78] font-medium">Status:</span>
              <div className="flex items-center gap-1">
                {(['OPERATIONAL', 'AT_RISK', 'CRITICAL_RISK', 'SECURED'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => updateAssetStatus(selectedAsset.id, st)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      selectedAsset.status === st
                        ? 'bg-[#123B5D] text-white font-semibold'
                        : 'bg-[#F0F2F5] text-[#5E6B78] hover:text-[#17202A]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* If Zone Selected */}
        {selectedZone && !selectedAsset && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                <span className="text-[10px] text-[#7B8794] block uppercase">Exposed Population</span>
                <span className="text-base font-bold font-mono text-[#17202A] tabular-nums">
                  {selectedZone.population.toLocaleString()}
                </span>
              </div>
              <div className="p-2 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                <span className="text-[10px] text-[#7B8794] block uppercase">Projected Surge</span>
                <span className="text-base font-bold font-mono text-[#2563A6] tabular-nums">
                  +{selectedZone.projectedSurgeM} m
                </span>
              </div>
              <div className="p-2 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                <span className="text-[10px] text-[#7B8794] block uppercase">Elevation</span>
                <span className="text-base font-bold font-mono text-[#17202A] tabular-nums">
                  {selectedZone.elevationM} m MSL
                </span>
              </div>
              <div className="p-2 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                <span className="text-[10px] text-[#7B8794] block uppercase">Road Cut-Off</span>
                <span className="text-base font-bold font-mono text-[#C88618] tabular-nums">
                  {selectedZone.roadDisruptionProbPercent}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase text-[#7B8794]">Key Vulnerabilities</span>
              <ul className="space-y-1">
                {selectedZone.keyConcerns.map((concern, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#5E6B78]">
                    <span className="text-[#C63C3C] font-bold">•</span>
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2 bg-[#F0F2F5] rounded border border-[#D9DEE5] flex items-center justify-between text-[11px]">
              <span className="text-[#5E6B78]">Nearest Cyclone Shelter:</span>
              <span className="text-[#17202A] font-semibold font-mono">{selectedZone.criticalShelterDistanceKm} km</span>
            </div>
          </div>
        )}

        {/* Action Triggers */}
        <div className="pt-2 border-t border-[#D9DEE5] space-y-2">
          <button
            onClick={() => {
              const query = isAsset
                ? `Provide an operational vulnerability assessment for ${selectedAsset?.name} in sector ${selectedAsset?.zoneCode}`
                : `Assess emergency risk profile and protective recommendations for sector ${selectedZone?.code} (${selectedZone?.name})`;
              triggerAnalystPrompt(query);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white font-medium text-xs transition-colors shadow-xs"
          >
            <Bot className="w-3.5 h-3.5 text-[#93C5FD]" />
            <span>Consult Risk Analyst</span>
          </button>

          <button
            onClick={() => {
              const records = isAsset ? (selectedAsset as any) : (selectedZone as any);
              setEvidenceModalData({
                title: isAsset ? selectedAsset!.name : `${selectedZone!.code} — ${selectedZone!.name}`,
                records,
              });
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] hover:bg-[#F0F2F5] text-[#17202A] text-xs transition-colors font-medium"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-[#5E6B78]" />
            <span>Audit Evidence Telemetry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
