import {
  CycloneCurrent,
  TrackPoint,
  CoastalZone,
  CriticalAsset,
  AnticipatoryAction,
  AlertItem,
  SurgeScenarioOutput,
  RainfallPathwayZone,
  DataSourceProvenance,
  StructuredAIResponse,
  AdvisoryResponse,
} from '../types';

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getCurrentCyclone(): Promise<CycloneCurrent> {
    const res = await fetch('/api/cyclone/current');
    if (!res.ok) throw new Error('Failed to fetch cyclone state');
    return res.json();
  },

  async getCycloneTrack(): Promise<TrackPoint[]> {
    const res = await fetch('/api/cyclone/track');
    if (!res.ok) throw new Error('Failed to fetch cyclone track');
    return res.json();
  },

  async getCoastalZones(): Promise<CoastalZone[]> {
    const res = await fetch('/api/risk/zones');
    if (!res.ok) throw new Error('Failed to fetch coastal zones');
    return res.json();
  },

  async getZoneByCode(code: string): Promise<CoastalZone> {
    const res = await fetch(`/api/risk/zones/${code}`);
    if (!res.ok) throw new Error(`Failed to fetch zone ${code}`);
    return res.json();
  },

  async getCriticalAssets(filters?: { category?: string; zoneCode?: string; threatLevel?: string }): Promise<CriticalAsset[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.zoneCode) params.set('zoneCode', filters.zoneCode);
    if (filters?.threatLevel) params.set('threatLevel', filters.threatLevel);
    const res = await fetch(`/api/risk/infrastructure?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch infrastructure');
    return res.json();
  },

  async updateAssetStatus(id: string, status: CriticalAsset['status']): Promise<CriticalAsset> {
    const res = await fetch(`/api/risk/infrastructure/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update asset status');
    return res.json();
  },

  async getRainfallPathways(): Promise<RainfallPathwayZone[]> {
    const res = await fetch('/api/risk/rainfall');
    if (!res.ok) throw new Error('Failed to fetch rainfall pathways');
    return res.json();
  },

  async getSurgeScenario(scenario: 'Conservative' | 'Expected' | 'Extreme'): Promise<SurgeScenarioOutput> {
    const res = await fetch(`/api/risk/surge?scenario=${scenario}`);
    if (!res.ok) throw new Error('Failed to fetch surge scenario');
    return res.json();
  },

  async simulateSurge(params: {
    windSpeedKmh: number;
    centralPressureHpa: number;
    radiusMaxWindsKm: number;
    approachAngleDeg: number;
    tideLevelM: number;
    seaLevelAnomalyM: number;
    scenarioName?: 'Conservative' | 'Expected' | 'Extreme' | 'Custom';
  }): Promise<SurgeScenarioOutput> {
    const res = await fetch('/api/scenarios/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to compute surge simulation');
    return res.json();
  },

  async getAnticipatoryActions(): Promise<AnticipatoryAction[]> {
    const res = await fetch('/api/anticipatory-actions');
    if (!res.ok) throw new Error('Failed to fetch anticipatory actions');
    return res.json();
  },

  async updateAction(id: string, update: { status?: AnticipatoryAction['status']; assignedTo?: string }): Promise<AnticipatoryAction> {
    const res = await fetch(`/api/anticipatory-actions/${id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    if (!res.ok) throw new Error('Failed to update action');
    return res.json();
  },

  async getAlerts(): Promise<AlertItem[]> {
    const res = await fetch('/api/alerts');
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async acknowledgeAlert(id: string): Promise<AlertItem> {
    const res = await fetch(`/api/alerts/${id}/acknowledge`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to acknowledge alert');
    return res.json();
  },

  async analyzeRisk(params: {
    query: string;
    zoneCode?: string;
    scenarioName?: 'Conservative' | 'Expected' | 'Extreme';
    focusAssetId?: string;
  }): Promise<StructuredAIResponse> {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to run AI risk analysis');
    return res.json();
  },

  async generateAdvisory(params: {
    audience: 'MUNICIPAL' | 'DISASTER_MANAGEMENT' | 'HOSPITAL' | 'INFRASTRUCTURE' | 'PUBLIC';
    zoneCode?: string;
  }): Promise<AdvisoryResponse> {
    const res = await fetch('/api/ai/advisory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate advisory');
    return res.json();
  },

  async sendAdvisory(payload: { channel: string; recipientGroup: string; advisoryTitle: string }) {
    const res = await fetch('/api/advisory/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getDataSources(): Promise<DataSourceProvenance[]> {
    const res = await fetch('/api/data-sources');
    if (!res.ok) throw new Error('Failed to fetch data sources');
    return res.json();
  },

  async getEarthEngineStatus() {
    const res = await fetch('/api/earth-engine/status');
    return res.json();
  },
};
