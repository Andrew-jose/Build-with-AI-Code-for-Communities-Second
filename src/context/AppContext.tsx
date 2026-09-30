import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  CycloneCurrent,
  TrackPoint,
  CoastalZone,
  CriticalAsset,
  AnticipatoryAction,
  AlertItem,
  SurgeScenarioOutput,
  MapLayerVisibility,
  NavigationPage,
  ActiveRiskLayer,
} from '../types';
import { api } from '../services/api';

interface AppContextValue {
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  cyclone: CycloneCurrent | null;
  trackPoints: TrackPoint[];
  zones: CoastalZone[];
  selectedZone: CoastalZone | null;
  setSelectedZone: (zone: CoastalZone | null) => void;
  assets: CriticalAsset[];
  selectedAsset: CriticalAsset | null;
  setSelectedAsset: (asset: CriticalAsset | null) => void;
  actions: AnticipatoryAction[];
  alerts: AlertItem[];
  unacknowledgedAlertsCount: number;
  activeScenario: 'Conservative' | 'Expected' | 'Extreme' | 'Custom';
  setActiveScenario: (scenario: 'Conservative' | 'Expected' | 'Extreme' | 'Custom') => void;
  surgeOutput: SurgeScenarioOutput | null;
  setSurgeOutput: (output: SurgeScenarioOutput) => void;
  activeRiskLayer: ActiveRiskLayer;
  setActiveRiskLayer: (layer: ActiveRiskLayer) => void;
  mapLayers: MapLayerVisibility;
  toggleLayer: (layer: keyof MapLayerVisibility) => void;
  isAnalystOpen: boolean;
  setIsAnalystOpen: (open: boolean) => void;
  analystInitialPrompt: string | null;
  triggerAnalystPrompt: (prompt: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  evidenceModalData: { title: string; records: Record<string, unknown> } | null;
  setEvidenceModalData: (data: { title: string; records: Record<string, unknown> } | null) => void;
  acknowledgeAlert: (id: string) => Promise<void>;
  updateActionStatus: (id: string, status: AnticipatoryAction['status'], assignedTo?: string) => Promise<void>;
  updateAssetStatus: (id: string, status: CriticalAsset['status']) => Promise<void>;
  refreshAll: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const defaultLayers: MapLayerVisibility = {
  cycloneTrack: true,
  windField: true,
  rainfall: true,
  stormSurge: true,
  population: false,
  criticalInfrastructure: true,
  hospitals: true,
  shelters: true,
  roads: true,
  powerGrid: false,
  satelliteImagery: false,
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<NavigationPage>('COMMAND_CENTER');
  const [cyclone, setCyclone] = useState<CycloneCurrent | null>(null);
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const [zones, setZones] = useState<CoastalZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<CoastalZone | null>(null);
  const [assets, setAssets] = useState<CriticalAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<CriticalAsset | null>(null);
  const [actions, setActions] = useState<AnticipatoryAction[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [activeScenario, setActiveScenario] = useState<'Conservative' | 'Expected' | 'Extreme' | 'Custom'>('Expected');
  const [surgeOutput, setSurgeOutput] = useState<SurgeScenarioOutput | null>(null);
  const [activeRiskLayer, setActiveRiskLayer] = useState<ActiveRiskLayer>('stormSurge');
  const [mapLayers, setMapLayers] = useState<MapLayerVisibility>(defaultLayers);

  const [isAnalystOpen, setIsAnalystOpen] = useState(false);
  const [analystInitialPrompt, setAnalystInitialPrompt] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [evidenceModalData, setEvidenceModalData] = useState<{ title: string; records: Record<string, unknown> } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [cycloneRes, trackRes, zonesRes, assetsRes, actionsRes, alertsRes, surgeRes] = await Promise.all([
        api.getCurrentCyclone(),
        api.getCycloneTrack(),
        api.getCoastalZones(),
        api.getCriticalAssets(),
        api.getAnticipatoryActions(),
        api.getAlerts(),
        api.getSurgeScenario('Expected'),
      ]);

      setCyclone(cycloneRes);
      setTrackPoints(trackRes);
      setZones(zonesRes);
      if (zonesRes.length > 0) setSelectedZone(zonesRes[0]); // default AP-14
      setAssets(assetsRes);
      setActions(actionsRes);
      setAlerts(alertsRes);
      setSurgeOutput(surgeRes);
    } catch (err: any) {
      console.error('Initialization error:', err);
      setError(err?.message || 'Failed to initialize emergency data layers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle scenario toggle
  useEffect(() => {
    if (activeScenario !== 'Custom') {
      api.getSurgeScenario(activeScenario).then(res => {
        setSurgeOutput(res);
      }).catch(err => console.error('Error fetching scenario:', err));
    }
  }, [activeScenario]);

  const toggleLayer = useCallback((layer: keyof MapLayerVisibility) => {
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  const triggerAnalystPrompt = useCallback((prompt: string) => {
    setAnalystInitialPrompt(prompt);
    setIsAnalystOpen(true);
  }, []);

  const acknowledgeAlert = useCallback(async (id: string) => {
    try {
      const updated = await api.acknowledgeAlert(id);
      setAlerts(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  }, []);

  const updateActionStatus = useCallback(async (id: string, status: AnticipatoryAction['status'], assignedTo?: string) => {
    try {
      const updated = await api.updateAction(id, { status, assignedTo });
      setActions(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      console.error('Failed to update action:', err);
    }
  }, []);

  const updateAssetStatus = useCallback(async (id: string, status: CriticalAsset['status']) => {
    try {
      const updated = await api.updateAssetStatus(id, status);
      setAssets(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      console.error('Failed to update asset status:', err);
    }
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'm':
          setActivePage('LIVE_MAP');
          break;
        case 'c':
          setActivePage('COMMAND_CENTER');
          break;
        case 'a':
          setActivePage('ALERTS');
          break;
        case 's':
          setActivePage('SCENARIO_LAB');
          break;
        case 'r':
          setActivePage('REPORTS');
          break;
        case '?':
          setIsShortcutsOpen(prev => !prev);
          break;
        case 'escape':
          setIsSearchOpen(false);
          setIsShortcutsOpen(false);
          setIsAnalystOpen(false);
          setEvidenceModalData(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unacknowledgedAlertsCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        cyclone,
        trackPoints,
        zones,
        selectedZone,
        setSelectedZone,
        assets,
        selectedAsset,
        setSelectedAsset,
        actions,
        alerts,
        unacknowledgedAlertsCount,
        activeScenario,
        setActiveScenario,
        surgeOutput,
        setSurgeOutput,
        activeRiskLayer,
        setActiveRiskLayer,
        mapLayers,
        toggleLayer,
        isAnalystOpen,
        setIsAnalystOpen,
        analystInitialPrompt,
        triggerAnalystPrompt,
        isSearchOpen,
        setIsSearchOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        evidenceModalData,
        setEvidenceModalData,
        acknowledgeAlert,
        updateActionStatus,
        updateAssetStatus,
        refreshAll: loadInitialData,
        loading,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
