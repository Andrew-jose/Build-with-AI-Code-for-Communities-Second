export type ThreatLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' | 'CRITICAL';

export type AlertSeverity = 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL';

export type AssetCategory = 'POWER' | 'TRANSPORT' | 'HEALTH' | 'EMERGENCY' | 'WATER';

export interface CycloneCurrent {
  name: string;
  regionalCode: string;
  classification: string;
  category: string;
  currentLat: number;
  currentLng: number;
  expectedLandfallHours: number;
  threatLevel: ThreatLevel;
  maxSustainedWindKmh: number;
  gustsKmh: number;
  centralPressureHpa: number;
  movementSpeedKmh: number;
  movementDirection: string;
  radiusMaxWindsKm: number;
  landfallLocation: string;
  statusText: string;
  lastUpdated: string;
  dataSourceMode: 'DEMO_SIMULATION' | 'LIVE_FEED';
  freshness: 'LIVE' | '5 MIN OLD' | '1 HOUR OLD' | 'STALE';
}

export interface TrackPoint {
  id: string;
  label: string; // 'T-48h', 'T-24h', 'T-12h', 'CURRENT', 'T-6h', 'LANDFALL', 'T+6h'
  lat: number;
  lng: number;
  timestamp: string;
  windSpeedKmh: number;
  pressureHpa: number;
  radiusKm: number;
  uncertaintyConeKm: number;
  status: 'HISTORICAL' | 'CURRENT' | 'FORECAST';
}

export interface CoastalZone {
  id: string;
  code: string; // e.g. "AP-14"
  name: string;
  district: string;
  lat: number;
  lng: number;
  population: number;
  elevationM: number;
  slopePercent: number;
  distanceToCoastKm: number;
  projectedSurgeM: number;
  rainfallForecastMm24h: number;
  waterloggingRisk: ThreatLevel;
  roadDisruptionProbPercent: number;
  evacuationReadinessPercent: number;
  vulnerabilityScore: number; // 0 - 100
  infrastructureExposureScore: number;
  criticalShelterDistanceKm: number;
  threatLevel: ThreatLevel;
  polygonCoordinates: [number, number][]; // [lat, lng][]
  drainageCapacity: 'LOW' | 'MODERATE' | 'ADEQUATE';
  urbanizationProxy: number;
  keyConcerns: string[];
}

export interface CriticalAsset {
  id: string;
  name: string;
  category: AssetCategory;
  type: string;
  lat: number;
  lng: number;
  zoneCode: string;
  elevationM: number;
  distanceToCoastlineKm: number;
  hazardScore: number; // 1 - 10
  exposureScore: number; // 1 - 10
  vulnerabilityScore: number; // 1 - 10
  criticalityScore: number; // 1 - 10
  priorityRiskScore: number; // calculated operational prioritization index
  threatLevel: ThreatLevel;
  status: 'OPERATIONAL' | 'AT_RISK' | 'CRITICAL_RISK' | 'SECURED';
  recommendedAction: string;
  backupGenerators: boolean;
  floodBarrierM: number;
}

export interface AnticipatoryAction {
  id: string;
  timelineStage: 'T-24h' | 'T-18h' | 'T-12h' | 'T-9h' | 'T-6h' | 'T-3h' | 'LANDFALL';
  action: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  deadline: string;
  affectedZone: string;
  reason: string;
  evidence: {
    projectedSurgeM?: number;
    rainfallMm24h?: number;
    elevationM?: number;
    populationExposed?: number;
    roadDisruptionProb?: number;
    shelterDistanceKm?: number;
    criticalAssetsExposed?: number;
    additionalDetails?: string[];
  };
  responsibleAgency: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'EXECUTED';
  assignedTo?: string;
  acknowledgedAt?: string;
}

export interface AlertItem {
  id: string;
  title: string;
  severity: AlertSeverity;
  timestamp: string;
  location: string;
  zoneCode: string;
  trigger: string;
  evidence: string;
  recommendedAction: string;
  acknowledged: boolean;
}

export interface SurgeScenarioOutput {
  scenarioName: 'Conservative' | 'Expected' | 'Extreme' | 'Custom';
  maxSurgeM: number;
  maxInundationDistanceKm: number;
  affectedAreaKm2: number;
  populationExposed: number;
  affectedSettlementsCount: number;
  affectedRoadsKm: number;
  hospitalsAtRisk: number;
  sheltersCompromised: number;
  substationsExposed: number;
  inundationPolygons: {
    zoneCode: string;
    coordinates: [number, number][];
    depthM: number;
  }[];
}

export interface RainfallPathwayZone {
  zoneCode: string;
  zoneName: string;
  rainfallIntensityMm: number;
  drainageOverloadPercent: number;
  waterloggingDepthCm: number;
  roadDisruptionRiskPercent: number;
  facilityAccessDelayMinutes: number;
  riskCategory: ThreatLevel;
  affectedHospitals: string[];
  affectedShelters: string[];
  causalChain: {
    step: string;
    description: string;
    metric: string;
  }[];
}

export interface DataSourceProvenance {
  id: string;
  name: string;
  provider: string;
  status: 'ONLINE' | 'STANDBY' | 'DEMO_MODE';
  lastUpdate: string;
  coverage: string;
  dataType: string;
  mode: 'LIVE' | 'DEMO' | 'SIMULATION';
  limitations: string;
}
