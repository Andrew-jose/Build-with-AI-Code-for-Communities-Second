import { GeoJSONFeatureCollection } from '../types';

/**
 * Population Density GeoJSON Layer for Coastal Andhra Pradesh Mandals / Wards
 * Includes demographic density metrics, total residents, and elevation-linked exposure.
 */
export const populationDensityGeoJson: GeoJSONFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [82.20, 17.06],
            [82.29, 17.04],
            [82.28, 16.92],
            [82.21, 16.90],
            [82.18, 16.98],
            [82.20, 17.06],
          ],
        ],
      },
      properties: {
        zoneCode: 'AP-14',
        name: 'Kakinada Urban & Port Margin',
        densityPerKm2: 1850,
        population: 8400,
        densityTier: 'CRITICAL', // >1500 /km²
        vulnerabilityScore: 89,
        color: '#9E2635', // Extreme dark red
        strokeColor: '#7A1A26',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.85, 16.12],
            [81.08, 16.10],
            [81.04, 15.95],
            [80.88, 15.92],
            [80.82, 16.05],
            [80.85, 16.12],
          ],
        ],
      },
      properties: {
        zoneCode: 'AP-12',
        name: 'Diviseema Island Delta Corridor',
        densityPerKm2: 920,
        population: 14200,
        densityTier: 'HIGH', // 800 - 1500 /km²
        vulnerabilityScore: 94,
        color: '#C63C3C', // Critical red
        strokeColor: '#A82B2B',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [81.08, 16.24],
            [81.20, 16.22],
            [81.18, 16.12],
            [81.06, 16.14],
            [81.08, 16.24],
          ],
        ],
      },
      properties: {
        zoneCode: 'AP-09',
        name: 'Machilipatnam Municipal Basin',
        densityPerKm2: 1680,
        population: 32600,
        densityTier: 'CRITICAL',
        vulnerabilityScore: 76,
        color: '#9E2635',
        strokeColor: '#7A1A26',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [82.28, 17.15],
            [82.38, 17.12],
            [82.34, 17.03],
            [82.27, 17.05],
            [82.28, 17.15],
          ],
        ],
      },
      properties: {
        zoneCode: 'AP-15',
        name: 'Uppada Coastal Fisher Polder',
        densityPerKm2: 1140,
        population: 6800,
        densityTier: 'HIGH',
        vulnerabilityScore: 92,
        color: '#C63C3C',
        strokeColor: '#A82B2B',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [81.62, 16.50],
            [81.78, 16.48],
            [81.75, 16.36],
            [81.60, 16.38],
            [81.62, 16.50],
          ],
        ],
      },
      properties: {
        zoneCode: 'AP-10',
        name: 'Narsapur Rivermouth Estuary',
        densityPerKm2: 780,
        population: 15400,
        densityTier: 'MODERATE',
        vulnerabilityScore: 91,
        color: '#C88618', // Warning orange
        strokeColor: '#A46B10',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.58, 15.92],
            [80.72, 15.90],
            [80.68, 15.78],
            [80.56, 15.80],
            [80.58, 15.92],
          ],
        ],
      },
      properties: {
        zoneCode: 'AP-06',
        name: 'Nizampatnam Fishery Belt',
        densityPerKm2: 640,
        population: 9300,
        densityTier: 'MODERATE',
        vulnerabilityScore: 87,
        color: '#C88618',
        strokeColor: '#A46B10',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.40, 15.98],
            [80.54, 15.96],
            [80.50, 15.82],
            [80.38, 15.85],
            [80.40, 15.98],
          ],
        ],
      },
      properties: {
        zoneCode: 'AP-07',
        name: 'Bapatla Coastal Polder',
        densityPerKm2: 520,
        population: 11500,
        densityTier: 'MODERATE',
        vulnerabilityScore: 68,
        color: '#C88618',
        strokeColor: '#A46B10',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [83.20, 17.72],
            [83.32, 17.70],
            [83.28, 17.60],
            [83.18, 17.62],
            [83.20, 17.72],
          ],
        ],
      },
      properties: {
        zoneCode: 'AP-16',
        name: 'Visakhapatnam South Port Sector',
        densityPerKm2: 2450,
        population: 48000,
        densityTier: 'CRITICAL',
        vulnerabilityScore: 48,
        color: '#9E2635',
        strokeColor: '#7A1A26',
      },
    },
  ],
};

/**
 * Power Grid GeoJSON Layer for Coastal Transmission Lines & Substations
 */
export const powerGridGeoJson: GeoJSONFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [83.142, 17.625], // Simhadri Super Thermal
          [82.850, 17.380], // Anakapalle Corridor
          [82.520, 17.150], // Tuni Interconnector
          [82.215, 16.948], // Kakinada 220kV Hub
        ],
      },
      properties: {
        id: 'pwr-line-1',
        name: '400kV Simhadri - Kakinada Bulk Interconnector',
        voltageKv: 400,
        tier: 'BULK_GRID',
        status: 'ENERGIZED',
        riskLevel: 'LOW',
        color: '#123B5D', // Navy
        weight: 3.5,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [82.215, 16.948], // Kakinada 220kV Hub
          [82.208, 16.732], // Yanam Delta Substation
          [81.685, 16.425], // Narsapur 132kV Substation
          [81.121, 16.172], // Machilipatnam 132kV Substation
        ],
      },
      properties: {
        id: 'pwr-line-2',
        name: '220kV Coastal Transmission Spine (Kakinada - Machilipatnam)',
        voltageKv: 220,
        tier: 'REGIONAL_TRANSMISSION',
        status: 'AT_RISK',
        riskLevel: 'HIGH',
        color: '#C88618', // Amber / Warning
        weight: 3.0,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [81.121, 16.172], // Machilipatnam 132kV
          [80.938, 16.015], // Avanigadda Feeder
          [80.932, 15.961], // Nagayalanka Island Substation
        ],
      },
      properties: {
        id: 'pwr-line-3',
        name: '132kV Diviseema Island Feeder Line',
        voltageKv: 132,
        tier: 'ISLAND_FEEDER',
        status: 'CRITICAL_RISK',
        riskLevel: 'CRITICAL',
        color: '#C63C3C', // Critical red
        weight: 3.0,
        dashArray: '5, 5',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [80.932, 15.961], // Nagayalanka Substation
          [80.962, 15.988], // Solar RO Plant
          [80.924, 15.952], // Nagayalanka Relief Haven
        ],
      },
      properties: {
        id: 'pwr-line-4',
        name: '33kV Island Essential Radial Feeder (Polder Service)',
        voltageKv: 33,
        tier: 'LOCAL_DISTRIBUTION',
        status: 'PLANNED_ISOLATION_T6',
        riskLevel: 'CRITICAL',
        color: '#9E2635',
        weight: 2.5,
        dashArray: '3, 4',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [81.121, 16.172], // Machilipatnam
          [80.642, 15.845], // Nizampatnam Port Feeder
          [80.470, 15.904], // Bapatla Substation
        ],
      },
      properties: {
        id: 'pwr-line-5',
        name: '132kV Bapatla - Nizampatnam Interconnector',
        voltageKv: 132,
        tier: 'REGIONAL_TRANSMISSION',
        status: 'AT_RISK',
        riskLevel: 'HIGH',
        color: '#C88618',
        weight: 2.5,
      },
    },
  ],
};

/**
 * Road Network GeoJSON Layer for Coastal Arterials, Bridges, and Evacuation Corridors
 */
export const roadNetworkGeoJson: GeoJSONFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [83.305, 17.708], // Visakhapatnam
          [82.250, 17.020], // Kakinada Junction
          [81.800, 17.000], // Rajahmundry Inland Corridor
          [80.640, 16.510], // Vijayawada Inland Hub
          [80.450, 16.300], // Guntur
          [80.050, 15.500], // Ongole
        ],
      },
      properties: {
        id: 'road-nh-16',
        name: 'National Highway NH-16 (Inland Golden Spine)',
        classification: 'PRIMARY_EVACUATION_TRUNK',
        lanes: 6,
        elevationM: 18.5,
        disruptionProbPercent: 8,
        status: 'CLEAR_PASSABLE',
        color: '#2E7D5B', // Institutional Green
        weight: 4.0,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [82.254, 17.012], // Kakinada NH-216 Spur
          [82.208, 16.732], // Yanam River Crossing
          [81.698, 16.438], // Narsapur Vasista Crossing
          [81.134, 16.182], // Machilipatnam Coast Link
        ],
      },
      properties: {
        id: 'road-nh-216',
        name: 'National Highway NH-216 Coastal Arterial Corridor',
        classification: 'COASTAL_ARTERIAL',
        lanes: 4,
        elevationM: 2.2,
        disruptionProbPercent: 68,
        status: 'HIGH_DISRUPTION_RISK',
        color: '#C88618', // Orange
        weight: 3.5,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [80.918, 16.022], // Avanigadda Town
          [80.938, 16.015], // Avanigadda - Nagayalanka Bridge
          [80.924, 15.952], // Nagayalanka Island Terminal
        ],
      },
      properties: {
        id: 'road-bridge-1',
        name: 'Avanigadda - Nagayalanka Causeway & Bridge',
        classification: 'SINGLE_LIFELINE_BRIDGE',
        lanes: 2,
        elevationM: 2.0,
        disruptionProbPercent: 82,
        status: 'CRITICAL_CUTOFF_IMMINENT',
        color: '#C63C3C', // Red
        weight: 4.0,
        dashArray: '5, 5',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [82.342, 17.094], // Uppada Beach Road
          [82.260, 16.980], // Kakinada North Beach
        ],
      },
      properties: {
        id: 'road-uppada',
        name: 'Uppada Coastal Beach Road (Erosion Sector)',
        classification: 'COASTAL_FRONTAGE',
        lanes: 2,
        elevationM: 1.5,
        disruptionProbPercent: 91,
        status: 'BREACHED_IMPASSABLE',
        color: '#9E2635', // Dark red
        weight: 3.0,
        dashArray: '3, 4',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [81.134, 16.182], // Machilipatnam
          [81.085, 16.208], // Pamarru Evacuation Highway
          [80.640, 16.510], // Connect to Vijayawada
        ],
      },
      properties: {
        id: 'road-sh-108',
        name: 'State Highway SH-108 (Machilipatnam - Pamarru Corridor)',
        classification: 'DESIGNATED_OUTWARD_EVACUATION',
        lanes: 4,
        elevationM: 4.5,
        disruptionProbPercent: 24,
        status: 'ESCORTED_EVACUATION_PASSAGE',
        color: '#2563A6', // Institutional Blue
        weight: 3.5,
      },
    },
  ],
};
