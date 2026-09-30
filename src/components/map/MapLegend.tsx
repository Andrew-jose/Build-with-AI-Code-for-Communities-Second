import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveRiskLayer } from '../../types';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  Waves,
  Wind,
  CloudRain,
  Users,
  Zap,
  Route,
} from 'lucide-react';

interface MapLegendProps {
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  const { activeRiskLayer, setActiveRiskLayer, surgeOutput, cyclone } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const riskLayerTabs: { key: ActiveRiskLayer; label: string; icon: React.ReactNode }[] = [
    { key: 'stormSurge', label: 'Surge', icon: <Waves className="w-3 h-3" /> },
    { key: 'windField', label: 'Wind', icon: <Wind className="w-3 h-3" /> },
    { key: 'rainfall', label: 'Rain', icon: <CloudRain className="w-3 h-3" /> },
    { key: 'population', label: 'Density', icon: <Users className="w-3 h-3" /> },
    { key: 'powerGrid', label: 'Power', icon: <Zap className="w-3 h-3" /> },
    { key: 'roads', label: 'Roads', icon: <Route className="w-3 h-3" /> },
  ];

  return (
    <div
      className={`bg-[#FFFFFF] border border-[#D9DEE5] rounded p-3 shadow-md text-xs select-none max-w-sm sm:w-96 flex flex-col space-y-2.5 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#123B5D]" />
          <span className="font-semibold text-[#17202A] tracking-tight">
            Map Legend & Symbology
          </span>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded text-[#7B8794] hover:text-[#17202A] hover:bg-[#F0F2F5] transition-colors"
          title={collapsed ? 'Expand Legend' : 'Collapse Legend'}
        >
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Layer Switcher Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 bg-[#F0F2F5] p-1 rounded border border-[#D9DEE5]">
        {riskLayerTabs.map((tab) => {
          const isActive = activeRiskLayer === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveRiskLayer(tab.key)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors shrink-0 ${
                isActive
                  ? 'bg-[#FFFFFF] text-[#123B5D] font-semibold shadow-2xs border border-[#CBD5E1]'
                  : 'text-[#5E6B78] hover:text-[#17202A] hover:bg-[#EAEFF5]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {!collapsed && (
        <div className="space-y-2.5 pt-1">
          {/* Dynamic Panel 1: STORM SURGE INUNDATION */}
          {activeRiskLayer === 'stormSurge' && (
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#17202A] flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-[#2563A6]" />
                  Storm Surge Inundation Depth
                </span>
                <span className="text-[#5E6B78] font-mono text-[10px]">Peak: +{surgeOutput?.maxSurgeM || 2.8}m</span>
              </div>

              {/* Discrete Color Scale */}
              <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono">
                <div className="p-1 rounded bg-[#2563A6]/10 border border-[#2563A6]/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563A6] inline-block mb-0.5" />
                  <span className="block text-[#17202A]">&lt;0.5m</span>
                  <span className="text-[9px] text-[#7B8794]">Swell</span>
                </div>
                <div className="p-1 rounded bg-[#C88618]/10 border border-[#C88618]/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C88618] inline-block mb-0.5" />
                  <span className="block text-[#17202A]">0.5–1.5m</span>
                  <span className="text-[9px] text-[#7B8794]">Moderate</span>
                </div>
                <div className="p-1 rounded bg-[#C63C3C]/10 border border-[#C63C3C]/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C63C3C] inline-block mb-0.5" />
                  <span className="block text-[#17202A]">1.5–2.5m</span>
                  <span className="text-[9px] text-[#7B8794]">Severe</span>
                </div>
                <div className="p-1 rounded bg-[#9E2635]/10 border border-[#9E2635]/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9E2635] inline-block mb-0.5" />
                  <span className="block text-[#9E2635] font-bold">&gt;2.5m</span>
                  <span className="text-[9px] text-[#7B8794]">Breach</span>
                </div>
              </div>

              <div className="p-2 rounded bg-[#F7F8FA] border border-[#D9DEE5] text-[10px] text-[#5E6B78] space-y-0.5 font-normal">
                <p>• Inundation Reach: <strong>{surgeOutput?.maxInundationDistanceKm || 4.5} km</strong> inland</p>
                <p>• Area Submerged: <strong>{surgeOutput?.affectedAreaKm2 || 114.2} km²</strong></p>
              </div>
            </div>
          )}

          {/* Dynamic Panel 2: WIND VELOCITY RADII */}
          {activeRiskLayer === 'windField' && (
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#17202A] flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-[#C88618]" />
                  Wind Velocity Zones (IMD Scale)
                </span>
                <span className="text-[#9E2635] font-mono text-[10px] font-bold">Max: {cyclone?.maxSustainedWindKmh || 145} km/h</span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#9E2635]" />
                    <span className="text-[#17202A] font-medium">Hurricane Force (&gt;118 km/h)</span>
                  </div>
                  <span className="text-[#7B8794] font-mono text-[10px]">Radius: 42 km</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#C88618]" />
                    <span className="text-[#17202A] font-medium">Storm Force (89–117 km/h)</span>
                  </div>
                  <span className="text-[#7B8794] font-mono text-[10px]">Radius: 95 km</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#D97706]" />
                    <span className="text-[#17202A] font-medium">Gale Force (62–88 km/h)</span>
                  </div>
                  <span className="text-[#7B8794] font-mono text-[10px]">Radius: 180 km</span>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Panel 3: RAINFALL INTENSITY */}
          {activeRiskLayer === 'rainfall' && (
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#17202A] flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-[#2563A6]" />
                  24-Hour Precipitation Rate
                </span>
                <span className="text-[#5E6B78] font-mono text-[10px]">Peak: 245 mm/24h</span>
              </div>

              <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono">
                <div className="p-1 rounded bg-[#F0F2F5] border border-[#D9DEE5]">
                  <span className="block text-[#17202A] font-bold">&lt;50mm</span>
                  <span className="text-[9px] text-[#7B8794]">Light</span>
                </div>
                <div className="p-1 rounded bg-[#2563A6]/10 border border-[#2563A6]/30">
                  <span className="block text-[#2563A6] font-bold">50–120mm</span>
                  <span className="text-[9px] text-[#7B8794]">Moderate</span>
                </div>
                <div className="p-1 rounded bg-[#123B5D]/10 border border-[#123B5D]/30">
                  <span className="block text-[#123B5D] font-bold">120–200mm</span>
                  <span className="text-[9px] text-[#7B8794]">Heavy</span>
                </div>
                <div className="p-1 rounded bg-[#9E2635]/10 border border-[#9E2635]/30">
                  <span className="block text-[#9E2635] font-bold">&gt;200mm</span>
                  <span className="text-[9px] text-[#7B8794]">Extreme</span>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Panel 4: POPULATION DENSITY */}
          {activeRiskLayer === 'population' && (
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#17202A] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#123B5D]" />
                  Population Density Choropleth
                </span>
                <span className="text-[10px] text-[#7B8794]">8 Coastal Wards</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#9E2635] shrink-0" />
                  <div>
                    <span className="text-[#17202A] font-semibold block">&gt;1,500 /km²</span>
                    <span className="text-[#7B8794] text-[9px]">Critical Urban</span>
                  </div>
                </div>

                <div className="p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#C63C3C] shrink-0" />
                  <div>
                    <span className="text-[#17202A] font-semibold block">800–1,500</span>
                    <span className="text-[#7B8794] text-[9px]">High Density</span>
                  </div>
                </div>

                <div className="p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#C88618] shrink-0" />
                  <div>
                    <span className="text-[#17202A] font-semibold block">400–800</span>
                    <span className="text-[#7B8794] text-[9px]">Moderate</span>
                  </div>
                </div>

                <div className="p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#2563A6] shrink-0" />
                  <div>
                    <span className="text-[#17202A] font-semibold block">&lt;400 /km²</span>
                    <span className="text-[#7B8794] text-[9px]">Dispersed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Panel 5: POWER GRID */}
          {activeRiskLayer === 'powerGrid' && (
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#17202A] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#C88618]" />
                  Transmission Corridors (APTRANSCO)
                </span>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex items-center justify-between p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-1 bg-[#123B5D] inline-block" />
                    <span className="text-[#17202A]">400kV Bulk Interconnector</span>
                  </div>
                  <span className="text-[#2E7D5B] font-medium">Energized</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-1 bg-[#C88618] inline-block" />
                    <span className="text-[#17202A]">220kV Transmission Spine</span>
                  </div>
                  <span className="text-[#C88618] font-medium">At Risk</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-1 border-t-2 border-dashed border-[#C63C3C] inline-block" />
                    <span className="text-[#17202A]">132kV Island Feeder Line</span>
                  </div>
                  <span className="text-[#C63C3C] font-medium">Critical Risk</span>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Panel 6: ROAD NETWORK */}
          {activeRiskLayer === 'roads' && (
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#17202A] flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5 text-[#2563A6]" />
                  Arterial Evacuation Corridors
                </span>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex items-center justify-between p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-1.5 bg-[#2E7D5B] inline-block" />
                    <span className="text-[#17202A]">NH-16 Golden Quadrilateral Trunk</span>
                  </div>
                  <span className="text-[#2E7D5B] font-medium">Passable (8%)</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-1 bg-[#C88618] inline-block" />
                    <span className="text-[#17202A]">NH-216 Coastal Arterial Corridor</span>
                  </div>
                  <span className="text-[#C88618] font-medium">68% Risk</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-[#F7F8FA] border border-[#D9DEE5]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-1 border-t-2 border-dashed border-[#C63C3C] inline-block" />
                    <span className="text-[#17202A]">Avanigadda Bridge / Causeway</span>
                  </div>
                  <span className="text-[#C63C3C] font-bold">&gt;82% Cut-Off</span>
                </div>
              </div>
            </div>
          )}

          {/* Symbology Key */}
          <div className="pt-2 border-t border-[#D9DEE5] grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-[#5E6B78]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-[#C63C3C] bg-white inline-flex items-center justify-center text-[7px] text-[#C63C3C] font-bold">H</span>
              <span>Hospital Facility</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-[#2E7D5B] bg-white inline-flex items-center justify-center text-[7px] text-[#2E7D5B] font-bold">S</span>
              <span>Cyclone Shelter</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-[#C88618] bg-white inline-flex items-center justify-center text-[7px] text-[#C88618] font-bold">⚡</span>
              <span>Substation Hub</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-[#0891B2] bg-white inline-flex items-center justify-center text-[7px] text-[#0891B2] font-bold">W</span>
              <span>Water Treatment</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
