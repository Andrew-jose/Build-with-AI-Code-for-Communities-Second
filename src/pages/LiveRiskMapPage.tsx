import React from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { MapLayerControl } from '../components/map/MapLayerControl';
import { MapLegend } from '../components/map/MapLegend';
import { Navigation, Bot, Activity } from 'lucide-react';

export const LiveRiskMapPage: React.FC = () => {
  const {
    zones,
    setSelectedZone,
    setSelectedAsset,
    triggerAnalystPrompt,
    activeRiskLayer,
  } = useApp();

  const hotspots = [
    { code: 'AP-14', label: 'Kakinada Lowland', threat: 'EXTREME' },
    { code: 'AP-12', label: 'Diviseema Island', threat: 'CRITICAL' },
    { code: 'AP-15', label: 'Uppada Beachfront', threat: 'CRITICAL' },
    { code: 'AP-09', label: 'Machilipatnam Port', threat: 'HIGH' },
    { code: 'AP-10', label: 'Narsapur Rivermouth', threat: 'EXTREME' },
  ];

  const getRiskLayerLabel = () => {
    switch (activeRiskLayer) {
      case 'population':
        return 'Population Density Choropleth';
      case 'powerGrid':
        return 'High-Voltage Power Grid';
      case 'roads':
        return 'Arterial Road Network';
      case 'windField':
        return 'Wind Velocity Radii';
      case 'rainfall':
        return 'Rainfall Inundation Heatmap';
      case 'stormSurge':
      default:
        return 'Storm Surge Inundation Depth';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-[#F5F7FA] overflow-hidden select-none">
      {/* Tactical Map Ribbon */}
      <div className="h-11 px-4 bg-[#FFFFFF] border-b border-[#D9DEE5] flex items-center justify-between gap-3 shrink-0 text-xs">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#123B5D]" />
          <span className="font-semibold text-[#17202A] tracking-tight">
            Live Multi-Layer Risk GIS Engine
          </span>
          <span className="text-[#CBD5E1] hidden md:inline">|</span>
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#5E6B78] bg-[#F0F2F5] px-2 py-0.5 rounded border border-[#D9DEE5]">
            <Activity className="w-3 h-3 text-[#123B5D]" />
            <span>Focal Overlay: <strong className="text-[#17202A]">{getRiskLayerLabel()}</strong></span>
          </div>
        </div>

        {/* Quick Hotspot Jump Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] text-[#7B8794] uppercase hidden xl:inline font-mono">
            Hotspots:
          </span>
          {hotspots.map(spot => (
            <button
              key={spot.code}
              onClick={() => {
                const zone = zones.find(z => z.code === spot.code);
                if (zone) {
                  setSelectedZone(zone);
                  setSelectedAsset(null);
                }
              }}
              className="px-2 py-0.5 rounded bg-[#F0F2F5] hover:bg-[#EAEFF5] text-[11px] text-[#17202A] border border-[#D9DEE5] whitespace-nowrap transition-colors"
            >
              <span className="text-[#9E2635] font-semibold mr-1">{spot.code}</span>
              <span>{spot.label}</span>
            </button>
          ))}

          <button
            onClick={() => triggerAnalystPrompt('What are the top 3 highest risk coastal sectors and why?')}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-[11px] font-medium ml-2 transition-colors shrink-0 shadow-xs"
          >
            <Bot className="w-3 h-3 text-[#93C5FD]" />
            <span>Sector Audit</span>
          </button>
        </div>
      </div>

      {/* Main Map Container with explicitly placed MapLayerControl and dynamic MapLegend */}
      <div className="flex-1 relative">
        <InteractiveMap
          heightClass="h-full"
          showLayerControl={false}
          showLegend={false}
        />

        {/* Bottom-Left: MapLayerControl */}
        <div className="absolute bottom-6 left-4 z-[500]">
          <MapLayerControl />
        </div>

        {/* Bottom-Right: Dynamic MapLegend */}
        <div className="absolute bottom-6 right-4 z-[500]">
          <MapLegend />
        </div>
      </div>
    </div>
  );
};
