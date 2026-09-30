import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { MapLayerControl } from './MapLayerControl';
import { MapLegend } from './MapLegend';
import { MapInspectionDrawer } from './MapInspectionDrawer';
import {
  populationDensityGeoJson,
  powerGridGeoJson,
  roadNetworkGeoJson,
} from '../../data/geoJsonData';

export const InteractiveMap: React.FC<{
  heightClass?: string;
  showLayerControl?: boolean;
  showLegend?: boolean;
}> = ({
  heightClass = 'h-[calc(100vh-3.5rem)]',
  showLayerControl = true,
  showLegend = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<{
    track?: L.LayerGroup;
    wind?: L.LayerGroup;
    surge?: L.LayerGroup;
    zones?: L.LayerGroup;
    assets?: L.LayerGroup;
    population?: L.LayerGroup;
    powerGrid?: L.LayerGroup;
    roads?: L.LayerGroup;
  }>({});

  const {
    cyclone,
    trackPoints,
    zones,
    setSelectedZone,
    assets,
    setSelectedAsset,
    surgeOutput,
    mapLayers,
  } = useApp();

  // Initialize Map with clean Carto Positron institutional basemap
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [16.2, 82.2],
      zoom: 7,
      minZoom: 5,
      maxZoom: 13,
      zoomControl: false,
    });

    // Carto Positron neutral light basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Scale control
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers when state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous layers
    Object.values(layersGroupRef.current).forEach(group => group?.remove());
    layersGroupRef.current = {};

    // 1. ZONES LAYER (Subtle transparent polygons with institutional hazard colors)
    const zonesGroup = L.layerGroup();
    zones.forEach(zone => {
      let fillColor = '#5E6B78';
      let strokeColor = '#7B8794';

      if (zone.threatLevel === 'EXTREME') {
        fillColor = '#9E2635';
        strokeColor = '#7A1A26';
      } else if (zone.threatLevel === 'CRITICAL') {
        fillColor = '#C63C3C';
        strokeColor = '#A82B2B';
      } else if (zone.threatLevel === 'HIGH') {
        fillColor = '#C88618';
        strokeColor = '#A46B10';
      } else if (zone.threatLevel === 'MODERATE') {
        fillColor = '#D97706';
        strokeColor = '#B45309';
      } else {
        fillColor = '#2E7D5B';
        strokeColor = '#235D43';
      }

      const polygon = L.polygon(zone.polygonCoordinates, {
        color: strokeColor,
        weight: 1.5,
        fillColor: fillColor,
        fillOpacity: 0.18,
        dashArray: '3, 4',
      });

      polygon.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px;">
           <strong style="color: #17202A;">${zone.code} — ${zone.name}</strong>
           <div style="color: #5E6B78; font-size: 10px;">Threat: <strong>${zone.threatLevel}</strong> · Surge: +${zone.projectedSurgeM}m</div>
           <div style="color: #7B8794; font-size: 10px;">Population: ${zone.population.toLocaleString()}</div>
         </div>`,
        { sticky: true }
      );

      polygon.on('click', () => {
        setSelectedZone(zone);
        setSelectedAsset(null);
      });

      zonesGroup.addLayer(polygon);
    });
    zonesGroup.addTo(map);
    layersGroupRef.current.zones = zonesGroup;

    // 2. STORM SURGE INUNDATION LAYER
    if (mapLayers.stormSurge && surgeOutput?.inundationPolygons) {
      const surgeGroup = L.layerGroup();

      surgeOutput.inundationPolygons.forEach(polyData => {
        let surgeColor = '#2563A6';
        if (polyData.depthM >= 2.5) surgeColor = '#9E2635';
        else if (polyData.depthM >= 1.5) surgeColor = '#C63C3C';
        else if (polyData.depthM >= 0.8) surgeColor = '#C88618';

        const poly = L.polygon(polyData.coordinates, {
          color: surgeColor,
          weight: 1.5,
          fillColor: surgeColor,
          fillOpacity: 0.32,
        });

        poly.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px;">
             <strong style="color: #123B5D;">Surge Inundation Breach (${polyData.zoneCode})</strong>
             <div style="color: #5E6B78; font-size: 10px;">Depth: <strong style="color: #C63C3C;">+${polyData.depthM} m</strong> above ground level</div>
           </div>`,
          { sticky: true }
        );

        surgeGroup.addLayer(poly);
      });

      surgeGroup.addTo(map);
      layersGroupRef.current.surge = surgeGroup;
    }

    // 3. CYCLONE TRACK & CONE LAYER
    if (mapLayers.cycloneTrack && trackPoints.length > 0) {
      const trackGroup = L.layerGroup();

      // Trajectory Line
      const latlngs: [number, number][] = trackPoints.map(p => [p.lat, p.lng]);
      const trackLine = L.polyline(latlngs, {
        color: '#123B5D',
        weight: 3,
        opacity: 0.9,
      });
      trackGroup.addLayer(trackLine);

      // Uncertainty Cone Polygon
      const coneCoordsLeft: [number, number][] = [];
      const coneCoordsRight: [number, number][] = [];

      trackPoints.forEach(pt => {
        const offset = (pt.uncertaintyConeKm / 111) * 0.55;
        coneCoordsLeft.push([pt.lat + offset * 0.7, pt.lng - offset]);
        coneCoordsRight.push([pt.lat - offset * 0.7, pt.lng + offset]);
      });

      const conePolygonCoords = [...coneCoordsLeft, ...coneCoordsRight.reverse()];
      const conePolygon = L.polygon(conePolygonCoords, {
        color: '#123B5D',
        weight: 1,
        fillColor: '#123B5D',
        fillOpacity: 0.07,
        dashArray: '4, 4',
      });
      trackGroup.addLayer(conePolygon);

      // Forecast Waypoints
      trackPoints.forEach(pt => {
        const isCurrent = pt.status === 'CURRENT';
        const isLandfall = pt.label.includes('LANDFALL');

        let markerColor = '#2563A6';
        let radius = 5;

        if (isCurrent) {
          markerColor = '#C63C3C';
          radius = 7;
        } else if (isLandfall) {
          markerColor = '#9E2635';
          radius = 8;
        }

        const pointMarker = L.circleMarker([pt.lat, pt.lng], {
          radius,
          color: '#FFFFFF',
          weight: 2,
          fillColor: markerColor,
          fillOpacity: 1,
        });

        pointMarker.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px;">
             <strong style="color: #17202A;">${pt.label}</strong>
             <div style="color: #5E6B78; font-size: 10px;">Time: ${pt.timestamp}</div>
             <div style="color: #17202A; font-size: 10px;">Wind: <strong>${pt.windSpeedKmh} km/h</strong> · Pressure: ${pt.pressureHpa} hPa</div>
           </div>`,
          { sticky: true }
        );

        trackGroup.addLayer(pointMarker);
      });

      trackGroup.addTo(map);
      layersGroupRef.current.track = trackGroup;
    }

    // 4. WIND FIELD RADII LAYER
    if (mapLayers.windField && cyclone) {
      const windGroup = L.layerGroup();
      const center: [number, number] = [cyclone.currentLat, cyclone.currentLng];

      // Hurricane Force (>118 km/h) - 42 km radius
      windGroup.addLayer(
        L.circle(center, {
          radius: 42000,
          color: '#9E2635',
          fillColor: '#9E2635',
          fillOpacity: 0.12,
          weight: 1.5,
        }).bindTooltip('<div style="font-size: 10px; font-weight: 600;">Hurricane Radius (&gt;118 km/h)</div>')
      );

      // Storm Force (>89 km/h) - 95 km radius
      windGroup.addLayer(
        L.circle(center, {
          radius: 95000,
          color: '#C88618',
          fillColor: '#C88618',
          fillOpacity: 0.07,
          weight: 1.2,
          dashArray: '4, 4',
        }).bindTooltip('<div style="font-size: 10px; font-weight: 600;">Storm Force Radius (&gt;89 km/h)</div>')
      );

      // Gale Force (>62 km/h) - 180 km radius
      windGroup.addLayer(
        L.circle(center, {
          radius: 180000,
          color: '#D97706',
          fillColor: '#D97706',
          fillOpacity: 0.04,
          weight: 1,
          dashArray: '6, 6',
        }).bindTooltip('<div style="font-size: 10px; font-weight: 600;">Gale Force Radius (&gt;62 km/h)</div>')
      );

      windGroup.addTo(map);
      layersGroupRef.current.wind = windGroup;
    }

    // 5. CRITICAL ASSETS LAYER (Clean, small enterprise icons)
    if (mapLayers.criticalInfrastructure && assets.length > 0) {
      const assetsGroup = L.layerGroup();

      assets.forEach(asset => {
        if (asset.category === 'HEALTH' && !mapLayers.hospitals) return;
        if (asset.category === 'EMERGENCY' && !mapLayers.shelters) return;
        if (asset.category === 'POWER' && !mapLayers.powerGrid) return;
        if (asset.category === 'TRANSPORT' && !mapLayers.roads) return;

        let markerColor = '#123B5D';
        let symbol = '●';

        if (asset.category === 'HEALTH') {
          markerColor = '#C63C3C';
          symbol = 'H';
        } else if (asset.category === 'EMERGENCY') {
          markerColor = '#2E7D5B';
          symbol = 'S';
        } else if (asset.category === 'POWER') {
          markerColor = '#C88618';
          symbol = '⚡';
        } else if (asset.category === 'TRANSPORT') {
          markerColor = '#2563A6';
          symbol = '═';
        } else if (asset.category === 'WATER') {
          markerColor = '#0891B2';
          symbol = 'W';
        }

        const icon = L.divIcon({
          className: 'asset-marker-icon',
          html: `
            <div style="background-color: #FFFFFF; border: 2px solid ${markerColor}; color: ${markerColor};" class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs hover:scale-110 transition-transform cursor-pointer">
              <span>${symbol}</span>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const assetMarker = L.marker([asset.lat, asset.lng], { icon });

        assetMarker.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px;">
             <strong style="color: #17202A;">${asset.name}</strong>
             <div style="color: #5E6B78; font-size: 10px;">${asset.type} · Priority: ${asset.priorityRiskScore}</div>
           </div>`,
          { sticky: true }
        );

        assetMarker.on('click', () => {
          setSelectedAsset(asset);
          const parentZone = zones.find(z => z.code === asset.zoneCode);
          if (parentZone) setSelectedZone(parentZone);
        });

        assetsGroup.addLayer(assetMarker);
      });

      assetsGroup.addTo(map);
      layersGroupRef.current.assets = assetsGroup;
    }

    // 6. POPULATION DENSITY GEOJSON LAYER
    if (mapLayers.population) {
      const popGroup = L.layerGroup();
      populationDensityGeoJson.features.forEach(feat => {
        const coords = (feat.geometry as any).coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng]);
        const poly = L.polygon(coords, {
          color: feat.properties.strokeColor,
          weight: 1.5,
          fillColor: feat.properties.color,
          fillOpacity: 0.28,
        });

        poly.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px;">
             <strong style="color: #17202A;">${feat.properties.zoneCode} — ${feat.properties.name}</strong>
             <div style="color: #5E6B78; font-size: 10px;">Density: <strong>${feat.properties.densityPerKm2} /km²</strong> (${feat.properties.densityTier})</div>
             <div style="color: #7B8794; font-size: 10px;">Residents: ${feat.properties.population.toLocaleString()}</div>
           </div>`,
          { sticky: true }
        );

        poly.on('click', () => {
          const matchZone = zones.find(z => z.code === feat.properties.zoneCode);
          if (matchZone) {
            setSelectedZone(matchZone);
            setSelectedAsset(null);
          }
        });

        popGroup.addLayer(poly);
      });
      popGroup.addTo(map);
      layersGroupRef.current.population = popGroup;
    }

    // 7. POWER GRID GEOJSON LAYER
    if (mapLayers.powerGrid) {
      const pwrGroup = L.layerGroup();
      powerGridGeoJson.features.forEach(feat => {
        const coords = (feat.geometry as any).coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
        const line = L.polyline(coords, {
          color: feat.properties.color,
          weight: feat.properties.weight,
          dashArray: feat.properties.dashArray,
        });

        line.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px;">
             <strong style="color: #123B5D;">${feat.properties.name}</strong>
             <div style="color: #5E6B78; font-size: 10px;">Voltage: <strong>${feat.properties.voltageKv}kV</strong> · Status: ${feat.properties.status}</div>
             <div style="color: #C63C3C; font-size: 10px;">Vulnerability: ${feat.properties.riskLevel}</div>
           </div>`,
          { sticky: true }
        );

        pwrGroup.addLayer(line);
      });
      pwrGroup.addTo(map);
      layersGroupRef.current.powerGrid = pwrGroup;
    }

    // 8. ROAD NETWORK GEOJSON LAYER
    if (mapLayers.roads) {
      const roadGroup = L.layerGroup();
      roadNetworkGeoJson.features.forEach(feat => {
        const coords = (feat.geometry as any).coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
        const line = L.polyline(coords, {
          color: feat.properties.color,
          weight: feat.properties.weight,
          dashArray: feat.properties.dashArray,
        });

        line.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px;">
             <strong style="color: #123B5D;">${feat.properties.name}</strong>
             <div style="color: #5E6B78; font-size: 10px;">Elevation: ${feat.properties.elevationM}m · Status: ${feat.properties.status}</div>
             <div style="color: #C63C3C; font-size: 10px;">Cut-Off Probability: <strong>${feat.properties.disruptionProbPercent}%</strong></div>
           </div>`,
          { sticky: true }
        );

        roadGroup.addLayer(line);
      });
      roadGroup.addTo(map);
      layersGroupRef.current.roads = roadGroup;
    }
  }, [mapLayers, cyclone, trackPoints, zones, assets, surgeOutput, setSelectedZone, setSelectedAsset]);

  return (
    <div className={`relative w-full ${heightClass} bg-[#EAEFF5] overflow-hidden`}>
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Layer Control Panel (Bottom-Left) */}
      {showLayerControl && (
        <div className="absolute bottom-6 left-4 z-[500]">
          <MapLayerControl />
        </div>
      )}

      {/* Legend Panel (Bottom-Right) */}
      {showLegend && (
        <div className="absolute bottom-6 right-4 z-[500]">
          <MapLegend />
        </div>
      )}

      {/* Inspection Drawer (Top-Right) */}
      <MapInspectionDrawer />
    </div>
  );
};
