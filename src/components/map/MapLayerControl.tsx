import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveRiskLayer } from '../../types';
import {
  Layers,
  Users,
  Zap,
  Route,
  Waves,
  Wind,
  CloudRain,
  Building2,
  Compass,
} from 'lucide-react';

interface MapLayerControlProps {
  className?: string;
}

export const MapLayerControl: React.FC<MapLayerControlProps> = ({ className = '' }) => {
  const { mapLayers, toggleLayer, activeRiskLayer, setActiveRiskLayer } = useApp();

  const primaryGeoJsonLayers = [
    {
      key: 'population' as const,
      riskKey: 'population' as ActiveRiskLayer,
      label: 'Population Density',
      sublabel: 'Administrative Wards (8 Sectors)',
      icon: <Users className="w-3.5 h-3.5 text-[#123B5D]" />,
      badge: 'GeoJSON',
    },
    {
      key: 'powerGrid' as const,
      riskKey: 'powerGrid' as ActiveRiskLayer,
      label: 'Power Grid Corridors',
      sublabel: '400kV - 33kV Transmission Lines',
      icon: <Zap className="w-3.5 h-3.5 text-[#C88618]" />,
      badge: 'GeoJSON',
    },
    {
      key: 'roads' as const,
      riskKey: 'roads' as ActiveRiskLayer,
      label: 'Road Network Arterials',
      sublabel: 'NH-16, NH-216 & Causeways',
      icon: <Route className="w-3.5 h-3.5 text-[#2563A6]" />,
      badge: 'GeoJSON',
    },
  ];

  const hazardLayers = [
    {
      key: 'stormSurge' as const,
      riskKey: 'stormSurge' as ActiveRiskLayer,
      label: 'Storm Surge Inundation',
      icon: <Waves className="w-3.5 h-3.5 text-[#2563A6]" />,
    },
    {
      key: 'windField' as const,
      riskKey: 'windField' as ActiveRiskLayer,
      label: 'Wind Velocity Radii',
      icon: <Wind className="w-3.5 h-3.5 text-[#C88618]" />,
    },
    {
      key: 'rainfall' as const,
      riskKey: 'rainfall' as ActiveRiskLayer,
      label: 'Rainfall Intensity Zones',
      icon: <CloudRain className="w-3.5 h-3.5 text-[#2563A6]" />,
    },
    {
      key: 'cycloneTrack' as const,
      riskKey: null,
      label: 'Cyclone Track & Cone',
      icon: <Compass className="w-3.5 h-3.5 text-[#123B5D]" />,
    },
    {
      key: 'criticalInfrastructure' as const,
      riskKey: null,
      label: 'Critical Facilities',
      icon: <Building2 className="w-3.5 h-3.5 text-[#2E7D5B]" />,
    },
  ];

  const activeCount = Object.values(mapLayers).filter(Boolean).length;

  return (
    <div
      className={`bg-[#FFFFFF] border border-[#D9DEE5] rounded p-3 shadow-md text-xs select-none max-w-xs sm:w-80 flex flex-col space-y-3 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#123B5D]" />
          <span className="font-semibold text-[#17202A] tracking-tight">
            Geospatial Layers
          </span>
        </div>
        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F0F2F5] border border-[#D9DEE5] text-[#5E6B78] font-medium">
          {activeCount} Active
        </span>
      </div>

      {/* Primary GeoJSON Layers */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#7B8794]">
          Core Vector Overlays
        </div>

        {primaryGeoJsonLayers.map((layer) => {
          const isEnabled = mapLayers[layer.key];
          const isFocus = activeRiskLayer === layer.riskKey;

          return (
            <div
              key={layer.key}
              className={`p-2 rounded border transition-colors ${
                isEnabled
                  ? 'bg-[#F7F8FA] border-[#D9DEE5]'
                  : 'bg-[#FFFFFF] border-[#E2E8F0] opacity-70'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-start gap-2.5 cursor-pointer min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => {
                      toggleLayer(layer.key);
                      if (!isEnabled && layer.riskKey) {
                        setActiveRiskLayer(layer.riskKey);
                      }
                    }}
                    className="mt-0.5 rounded border-[#CBD5E1] text-[#123B5D] focus:ring-[#123B5D] h-3.5 w-3.5 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-[#17202A] text-xs truncate">
                        {layer.label}
                      </span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#F0F2F5] border border-[#D9DEE5] text-[#5E6B78]">
                        {layer.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7B8794] truncate mt-0.5">
                      {layer.sublabel}
                    </p>
                  </div>
                </label>

                {isEnabled && (
                  <button
                    onClick={() => setActiveRiskLayer(layer.riskKey)}
                    className={`px-1.5 py-0.5 rounded text-[10px] border transition-colors shrink-0 font-medium ${
                      isFocus
                        ? 'bg-[#123B5D] text-white border-[#123B5D]'
                        : 'bg-[#FFFFFF] text-[#5E6B78] border-[#D9DEE5] hover:text-[#17202A]'
                    }`}
                  >
                    {isFocus ? 'Active' : 'Focus'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hazard Dynamics & Facilities */}
      <div className="space-y-1 pt-2 border-t border-[#D9DEE5]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7B8794] block mb-1">
          Hazard Models & Infrastructure
        </span>

        <div className="space-y-1">
          {hazardLayers.map((layer) => {
            const isEnabled = mapLayers[layer.key];
            const isFocus = layer.riskKey && activeRiskLayer === layer.riskKey;

            return (
              <div
                key={layer.key}
                className="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-[#F0F2F5]"
              >
                <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0 text-[#17202A]">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => {
                      toggleLayer(layer.key);
                      if (!isEnabled && layer.riskKey) {
                        setActiveRiskLayer(layer.riskKey);
                      }
                    }}
                    className="rounded border-[#CBD5E1] text-[#123B5D] focus:ring-[#123B5D] h-3.5 w-3.5"
                  />
                  <span className="shrink-0">{layer.icon}</span>
                  <span className="truncate text-[11px] text-[#17202A]">{layer.label}</span>
                </label>

                {layer.riskKey && isEnabled && (
                  <button
                    onClick={() => setActiveRiskLayer(layer.riskKey!)}
                    className={`text-[10px] font-medium px-1 py-0.5 rounded transition-colors ${
                      isFocus
                        ? 'text-[#123B5D] font-bold'
                        : 'text-[#7B8794] hover:text-[#17202A]'
                    }`}
                  >
                    {isFocus ? '● Legend' : 'Legend'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
