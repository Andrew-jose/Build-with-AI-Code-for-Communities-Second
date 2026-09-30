export type ThreatLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' | 'CRITICAL';
export type AlertSeverity = 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL';
export type AssetCategory = 'POWER' | 'TRANSPORT' | 'HEALTH' | 'EMERGENCY' | 'WATER';

export type NavigationPage =
  | 'COMMAND_CENTER'
  | 'LIVE_MAP'
  | 'CYCLONE_TRACK'
  | 'STORM_SURGE'
  | 'RAINFALL_PATHWAY'
  | 'INFRASTRUCTURE'
  | 'VULNERABILITY'
  | 'EVACUATION'
  | 'ANTICIPATORY_ACTIONS'
  | 'ALERTS'
  | 'SCENARIO_LAB'
  | 'ADVISORIES'
  | 'REPORTS'
  | 'DATA_SOURCES'
  | 'SETTINGS';

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
  label: string;
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
  code: string;
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
  vulnerabilityScore: number;
  infrastructureExposureScore: number;
  criticalShelterDistanceKm: number;
  threatLevel: ThreatLevel;
  polygonCoordinates: [number, number][];
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
  hazardScore: number;
  exposureScore: number;
  vulnerabilityScore: number;
  criticalityScore: number;
  priorityRiskScore: number;
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

export interface StructuredAIResponse {
  summary: string;
  keyEvidence: {
    label: string;
    value: string;
    verifiedSource: string;
  }[];
  primaryRisks: string[];
  secondaryRisks: string[];
  recommendedActions: {
    action: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    deadline: string;
    agency: string;
    evidence: string;
  }[];
  confidence: {
    rating: 'HIGH (92%)' | 'MODERATE (78%)' | 'LOW (55%)';
    notes: string;
  };
  dataSources: string[];
  rawContextUsed: Record<string, unknown>;
}

export interface AdvisoryResponse {
  audience: string;
  title: string;
  generatedAt: string;
  situation: string;
  affectedLocations: string[];
  immediateActions: string[];
  infrastructurePriorities: string[];
  evacuationGuidance: string;
  monitoringRequirements: string[];
  disclaimer: string;
}

export interface MapLayerVisibility {
  cycloneTrack: boolean;
  windField: boolean;
  rainfall: boolean;
  stormSurge: boolean;
  population: boolean;
  criticalInfrastructure: boolean;
  hospitals: boolean;
  shelters: boolean;
  roads: boolean;
  powerGrid: boolean;
  satelliteImagery: boolean;
}

export type ActiveRiskLayer =
  | 'stormSurge'
  | 'windField'
  | 'rainfall'
  | 'population'
  | 'powerGrid'
  | 'roads';

export interface GeoJSONFeature<G = any, P = any> {
  type: 'Feature';
  geometry: G;
  properties: P;
}

export interface GeoJSONFeatureCollection<G = any, P = any> {
  type: 'FeatureCollection';
  features: GeoJSONFeature<G, P>[];
}
