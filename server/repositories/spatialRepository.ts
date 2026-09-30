import {
  CoastalZone,
  CriticalAsset,
  AnticipatoryAction,
  AlertItem,
  SurgeScenarioOutput,
  AssetCategory,
} from '../types/index.js';
import {
  demoCoastalZones,
  demoCriticalAssets,
  demoAnticipatoryActions,
  demoAlerts,
  demoSurgeScenarios,
} from '../data/demoData.js';

export class SpatialRepository {
  private zones: CoastalZone[] = [...demoCoastalZones];
  private assets: CriticalAsset[] = [...demoCriticalAssets];
  private actions: AnticipatoryAction[] = [...demoAnticipatoryActions];
  private alerts: AlertItem[] = [...demoAlerts];
  private surgeScenarios = { ...demoSurgeScenarios };

  // PostGIS-compatible spatial query methods
  public async getZones(): Promise<CoastalZone[]> {
    return this.zones;
  }

  public async getZoneByCode(code: string): Promise<CoastalZone | undefined> {
    return this.zones.find(z => z.code.toUpperCase() === code.toUpperCase());
  }

  public async getCriticalAssets(filters?: {
    category?: AssetCategory;
    zoneCode?: string;
    threatLevel?: string;
  }): Promise<CriticalAsset[]> {
    let result = [...this.assets];
    if (filters?.category) {
      result = result.filter(a => a.category === filters.category);
    }
    if (filters?.zoneCode) {
      result = result.filter(a => a.zoneCode.toUpperCase() === filters.zoneCode?.toUpperCase());
    }
    if (filters?.threatLevel) {
      result = result.filter(a => a.threatLevel === filters.threatLevel);
    }
    return result;
  }

  public async getAssetById(id: string): Promise<CriticalAsset | undefined> {
    return this.assets.find(a => a.id === id);
  }

  public async updateAssetStatus(id: string, status: CriticalAsset['status']): Promise<CriticalAsset | undefined> {
    const asset = this.assets.find(a => a.id === id);
    if (asset) {
      asset.status = status;
    }
    return asset;
  }

  public async getAnticipatoryActions(): Promise<AnticipatoryAction[]> {
    return this.actions;
  }

  public async updateAction(
    id: string,
    update: { status?: AnticipatoryAction['status']; assignedTo?: string }
  ): Promise<AnticipatoryAction | undefined> {
    const action = this.actions.find(a => a.id === id);
    if (action) {
      if (update.status) action.status = update.status;
      if (update.assignedTo) action.assignedTo = update.assignedTo;
      if (update.status === 'ACKNOWLEDGED' || update.status === 'ASSIGNED') {
        action.acknowledgedAt = new Date().toISOString();
      }
    }
    return action;
  }

  public async getAlerts(): Promise<AlertItem[]> {
    return this.alerts;
  }

  public async acknowledgeAlert(id: string): Promise<AlertItem | undefined> {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.acknowledged = true;
    }
    return alert;
  }

  public async getSurgeScenario(scenarioName: 'Conservative' | 'Expected' | 'Extreme'): Promise<SurgeScenarioOutput> {
    return this.surgeScenarios[scenarioName] || this.surgeScenarios.Expected;
  }

  // Spatial buffer / distance query (Haversine formula approximation)
  public async queryNearbyAssets(lat: number, lng: number, radiusKm: number): Promise<CriticalAsset[]> {
    return this.assets.filter(asset => {
      const distance = this.calculateHaversineDistance(lat, lng, asset.lat, asset.lng);
      return distance <= radiusKm;
    });
  }

  // Calculate Operational Prioritization Index: Hazard * Exposure * Vulnerability * Criticality
  public calculatePriorityRisk(hazard: number, exposure: number, vulnerability: number, criticality: number): number {
    const raw = (hazard * exposure * vulnerability * criticality) / 100;
    return Math.round(raw * 10) / 10;
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

export const spatialRepository = new SpatialRepository();
