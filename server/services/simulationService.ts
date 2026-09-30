import { SurgeScenarioOutput } from '../types/index.js';
import { demoSurgeScenarios, demoCoastalZones } from '../data/demoData.js';

export interface SimulationParams {
  windSpeedKmh: number;
  centralPressureHpa: number;
  radiusMaxWindsKm: number;
  approachAngleDeg: number;
  tideLevelM: number;
  seaLevelAnomalyM: number;
  scenarioName?: 'Conservative' | 'Expected' | 'Extreme' | 'Custom';
}

export class SimulationService {
  /**
   * Run parametric hydrodynamic surge simulation approximation
   * Surge height ~ ΔP * 0.01 + k * (V^2 / g*h) + Tide + SeaLevelAnomaly
   */
  public simulateSurge(params: SimulationParams): SurgeScenarioOutput {
    const {
      windSpeedKmh,
      centralPressureHpa,
      tideLevelM,
      seaLevelAnomalyM,
      approachAngleDeg,
    } = params;

    // Meteorological pressure deficit surge (inverted barometer effect: ~1 cm per 1 hPa drop below 1013)
    const deltaP = Math.max(0, 1013 - centralPressureHpa);
    const pressureSurgeM = (deltaP * 0.01);

    // Wind stress setup component: wind in m/s
    const windMs = windSpeedKmh / 3.6;
    // Coastal angle amplification factor (angles perpendicular to coast ~90-110° amplify setup)
    const angleRad = (approachAngleDeg * Math.PI) / 180;
    const angleFactor = Math.abs(Math.sin(angleRad));
    const windStressSurgeM = (Math.pow(windMs, 2) / (9.81 * 25)) * 1.35 * angleFactor;

    // Total peak astronomical + meteorological surge height
    const calculatedSurgeM = Math.round((pressureSurgeM + windStressSurgeM + tideLevelM + seaLevelAnomalyM) * 10) / 10;
    const maxSurgeM = Math.max(1.2, Math.min(6.5, calculatedSurgeM));

    // Inundation distance penetration model: based on coastal slope (average 0.0006 in Krishna-Godavari delta)
    const maxInundationDistanceKm = Math.round((maxSurgeM / 0.0007 / 1000) * 10) / 10;

    // Inundated area calculation
    const affectedAreaKm2 = Math.round(maxInundationDistanceKm * 42.5 * 10) / 10;

    // Calculate exposed population from zones that fall within inundation threshold
    let exposedPop = 0;
    let affectedSettlements = 0;
    let affectedRoads = 0;
    let hospitalsRisk = 0;
    let sheltersRisk = 0;
    let substationsRisk = 0;

    for (const zone of demoCoastalZones) {
      if (zone.elevationM <= maxSurgeM + 0.5) {
        exposedPop += zone.population;
        affectedSettlements += 3;
        affectedRoads += Math.round(zone.distanceToCoastKm * 8 + 6);
        if (zone.elevationM <= maxSurgeM * 0.9) {
          hospitalsRisk += zone.threatLevel === 'EXTREME' || zone.threatLevel === 'CRITICAL' ? 1 : 0;
          sheltersRisk += zone.elevationM < 2.0 ? 1 : 0;
          substationsRisk += zone.threatLevel === 'EXTREME' || zone.threatLevel === 'CRITICAL' ? 1 : 0;
        }
      }
    }

    // Dynamic polygon generation adapting to maxSurgeM
    const baseScenario = maxSurgeM > 3.5 ? demoSurgeScenarios.Extreme : maxSurgeM > 2.0 ? demoSurgeScenarios.Expected : demoSurgeScenarios.Conservative;

    return {
      scenarioName: params.scenarioName || 'Custom',
      maxSurgeM,
      maxInundationDistanceKm: Math.min(10.5, maxInundationDistanceKm),
      affectedAreaKm2,
      populationExposed: Math.max(15000, exposedPop),
      affectedSettlementsCount: Math.max(10, affectedSettlements),
      affectedRoadsKm: Math.max(20, affectedRoads),
      hospitalsAtRisk: Math.max(1, hospitalsRisk),
      sheltersCompromised: sheltersRisk,
      substationsExposed: Math.max(1, substationsRisk),
      inundationPolygons: baseScenario.inundationPolygons.map(p => ({
        ...p,
        depthM: Math.round((maxSurgeM - (p.zoneCode === 'AP-14' ? 2.1 : p.zoneCode === 'AP-12' ? 1.6 : 2.5)) * 10) / 10,
      })),
    };
  }
}

export const simulationService = new SimulationService();
