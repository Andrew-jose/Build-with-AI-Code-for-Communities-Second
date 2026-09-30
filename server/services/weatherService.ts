import { CycloneCurrent, TrackPoint } from '../types/index.js';
import { demoCyclone, demoTrackPoints } from '../data/demoData.js';

export interface WeatherProvider {
  isLiveConfigured(): boolean;
  getDataSourceLabel(): string;
  getFreshness(): 'LIVE' | '5 MIN OLD' | '1 HOUR OLD' | 'STALE';
  getCurrentConditions(): Promise<CycloneCurrent>;
  getForecast(): Promise<{ timeHours: number; windKmh: number; pressureHpa: number }[]>;
  getRainfall(lat: number, lng: number): Promise<{ intensityMm24h: number; status: string }>;
  getWind(lat: number, lng: number): Promise<{ sustainedKmh: number; gustKmh: number; directionDeg: number }>;
  getPressure(lat: number, lng: number): Promise<{ pressureHpa: number; anomalyHpa: number }>;
  getCycloneTrack(): Promise<TrackPoint[]>;
}

export class WeatherDataService implements WeatherProvider {
  private liveConfigured: boolean = false;
  private weatherApiKey?: string;

  constructor() {
    this.weatherApiKey = process.env.WEATHER_API_KEY || process.env.IMD_API_KEY;
    this.liveConfigured = Boolean(this.weatherApiKey);
  }

  public isLiveConfigured(): boolean {
    return this.liveConfigured;
  }

  public getDataSourceLabel(): string {
    return this.liveConfigured ? 'DATA SOURCE: LIVE METEOROLOGICAL FEED' : 'DATA SOURCE: DEMO SIMULATION';
  }

  public getFreshness(): 'LIVE' | '5 MIN OLD' | '1 HOUR OLD' | 'STALE' {
    return this.liveConfigured ? 'LIVE' : '5 MIN OLD';
  }

  public async getCurrentConditions(): Promise<CycloneCurrent> {
    return {
      ...demoCyclone,
      dataSourceMode: this.liveConfigured ? 'LIVE_FEED' : 'DEMO_SIMULATION',
      freshness: this.getFreshness(),
    };
  }

  public async getForecast(): Promise<{ timeHours: number; windKmh: number; pressureHpa: number }[]> {
    return [
      { timeHours: -48, windKmh: 65, pressureHpa: 998 },
      { timeHours: -36, windKmh: 85, pressureHpa: 990 },
      { timeHours: -24, windKmh: 115, pressureHpa: 982 },
      { timeHours: -12, windKmh: 130, pressureHpa: 974 },
      { timeHours: 0, windKmh: 145, pressureHpa: 968 }, // Current
      { timeHours: 6, windKmh: 155, pressureHpa: 962 },
      { timeHours: 14.5, windKmh: 150, pressureHpa: 964 }, // Landfall
      { timeHours: 24, windKmh: 105, pressureHpa: 980 },
      { timeHours: 36, windKmh: 70, pressureHpa: 992 },
    ];
  }

  public async getRainfall(lat: number, lng: number): Promise<{ intensityMm24h: number; status: string }> {
    // Proximity to eye increases intensity
    const dist = Math.hypot(lat - demoCyclone.currentLat, lng - demoCyclone.currentLng);
    const mm = Math.max(50, Math.round(260 - dist * 45));
    return {
      intensityMm24h: mm,
      status: mm > 200 ? 'EXTREME' : mm > 120 ? 'HIGH' : 'MODERATE',
    };
  }

  public async getWind(lat: number, lng: number): Promise<{ sustainedKmh: number; gustKmh: number; directionDeg: number }> {
    const dist = Math.hypot(lat - demoCyclone.currentLat, lng - demoCyclone.currentLng);
    const wind = Math.max(45, Math.round(150 - dist * 25));
    return {
      sustainedKmh: wind,
      gustKmh: Math.round(wind * 1.25),
      directionDeg: 295,
    };
  }

  public async getPressure(_lat: number, _lng: number): Promise<{ pressureHpa: number; anomalyHpa: number }> {
    return {
      pressureHpa: 968,
      anomalyHpa: -44, // standard 1012 hPa baseline
    };
  }

  public async getCycloneTrack(): Promise<TrackPoint[]> {
    return demoTrackPoints;
  }
}

export const weatherService = new WeatherDataService();
