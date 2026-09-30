import { Router, Request, Response } from 'express';
import { spatialRepository } from '../repositories/spatialRepository.js';
import { weatherService } from '../services/weatherService.js';
import { simulationService } from '../services/simulationService.js';
import { geminiRiskAnalyst } from '../services/geminiService.js';
import { earthEngineService } from '../services/earthEngineService.js';
import { demoDataSources, demoRainfallPathways, demoSurgeScenarios } from '../data/demoData.js';

export const apiRouter = Router();

// Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    system: 'CycloneShield AI Operations Engine',
    timestamp: new Date().toISOString(),
    mode: 'ACTIVE_COMMAND_CENTER',
    geminiLive: Boolean(process.env.GEMINI_API_KEY),
    earthEngineMode: earthEngineService.getMode(),
    weatherMode: weatherService.isLiveConfigured() ? 'LIVE' : 'DEMO_SIMULATION',
  });
});

// Cyclone Current & Track
apiRouter.get('/cyclone/current', async (_req: Request, res: Response) => {
  try {
    const data = await weatherService.getCurrentConditions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cyclone current state' });
  }
});

apiRouter.get('/cyclone/track', async (_req: Request, res: Response) => {
  try {
    const track = await weatherService.getCycloneTrack();
    res.json(track);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cyclone track' });
  }
});

// Coastal Risk Zones
apiRouter.get('/risk/zones', async (_req: Request, res: Response) => {
  try {
    const zones = await spatialRepository.getZones();
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch coastal zones' });
  }
});

apiRouter.get('/risk/zones/:code', async (req: Request, res: Response) => {
  try {
    const zone = await spatialRepository.getZoneByCode(req.params.code);
    if (!zone) {
      res.status(404).json({ error: `Zone ${req.params.code} not found` });
      return;
    }
    res.json(zone);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch zone' });
  }
});

// Critical Infrastructure
apiRouter.get('/risk/infrastructure', async (req: Request, res: Response) => {
  try {
    const { category, zoneCode, threatLevel } = req.query;
    const assets = await spatialRepository.getCriticalAssets({
      category: category as any,
      zoneCode: zoneCode as string,
      threatLevel: threatLevel as string,
    });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch critical infrastructure' });
  }
});

apiRouter.post('/risk/infrastructure/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await spatialRepository.updateAssetStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update asset status' });
  }
});

// Rainfall Pathways
apiRouter.get('/risk/rainfall', (_req: Request, res: Response) => {
  res.json(demoRainfallPathways);
});

// Storm Surge
apiRouter.get('/risk/surge', async (req: Request, res: Response) => {
  try {
    const scenario = (req.query.scenario as 'Conservative' | 'Expected' | 'Extreme') || 'Expected';
    const surgeData = await spatialRepository.getSurgeScenario(scenario);
    res.json(surgeData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch surge scenario data' });
  }
});

// Scenarios & Simulation
apiRouter.get('/scenarios', (_req: Request, res: Response) => {
  res.json(demoSurgeScenarios);
});

apiRouter.post('/scenarios/simulate', (req: Request, res: Response) => {
  try {
    const params = req.body;
    const result = simulationService.simulateSurge(params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Simulation computation failed' });
  }
});

// Anticipatory Actions
apiRouter.get('/anticipatory-actions', async (_req: Request, res: Response) => {
  try {
    const actions = await spatialRepository.getAnticipatoryActions();
    res.json(actions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch anticipatory actions' });
  }
});

apiRouter.post('/anticipatory-actions/:id/update', async (req: Request, res: Response) => {
  try {
    const { status, assignedTo } = req.body;
    const updated = await spatialRepository.updateAction(req.params.id, { status, assignedTo });
    if (!updated) {
      res.status(404).json({ error: 'Action not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update action' });
  }
});

// Alerts
apiRouter.get('/alerts', async (_req: Request, res: Response) => {
  try {
    const alerts = await spatialRepository.getAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

apiRouter.post('/alerts/:id/acknowledge', async (req: Request, res: Response) => {
  try {
    const acknowledged = await spatialRepository.acknowledgeAlert(req.params.id);
    if (!acknowledged) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }
    res.json(acknowledged);
  } catch (err) {
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
});

// AI Risk Analyst
apiRouter.post('/ai/analyze', async (req: Request, res: Response) => {
  try {
    const { query, zoneCode, scenarioName, focusAssetId } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required for risk analysis' });
      return;
    }
    const analysis = await geminiRiskAnalyst.analyzeRisk({
      query,
      zoneCode,
      scenarioName,
      focusAssetId,
    });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: 'AI Risk analysis failed' });
  }
});

// AI Advisory Generator
apiRouter.post('/ai/advisory', async (req: Request, res: Response) => {
  try {
    const { audience, zoneCode } = req.body;
    const advisory = await geminiRiskAnalyst.generateAdvisory({
      audience: audience || 'MUNICIPAL',
      zoneCode,
    });
    res.json(advisory);
  } catch (err) {
    res.status(500).json({ error: 'AI Advisory generation failed' });
  }
});

apiRouter.post('/advisory/send', (req: Request, res: Response) => {
  const { channel, recipientGroup, advisoryTitle } = req.body;
  // Dispatch simulation
  res.json({
    success: true,
    message: `Dispatched [${advisoryTitle}] to ${recipientGroup} via ${channel || 'VHF Emergency Broadcast'}.`,
    timestamp: new Date().toISOString(),
    broadcastId: `BCST-${Date.now().toString().slice(-6)}`,
  });
});

// Earth Engine Endpoints
apiRouter.get('/earth-engine/status', (_req: Request, res: Response) => {
  res.json({
    liveConfigured: earthEngineService.isLiveConfigured(),
    mode: earthEngineService.getMode(),
    badgeText: earthEngineService.isLiveConfigured() ? 'EARTH ENGINE: LIVE CONNECTED' : 'EARTH ENGINE: SIMULATION / DEMO',
  });
});

apiRouter.get('/earth-engine/elevation', async (_req: Request, res: Response) => {
  const data = await earthEngineService.getElevation([13.5, 79.5, 18.0, 84.0]);
  res.json(data);
});

apiRouter.get('/earth-engine/land-cover', async (_req: Request, res: Response) => {
  const data = await earthEngineService.getLandCover([13.5, 79.5, 18.0, 84.0]);
  res.json(data);
});

apiRouter.get('/earth-engine/imagery', async (req: Request, res: Response) => {
  const satellite = (req.query.satellite as string) || 'Sentinel-1';
  const data = await earthEngineService.getSatelliteImage(satellite);
  res.json(data);
});

// Data Sources Provenance
apiRouter.get('/data-sources', (_req: Request, res: Response) => {
  res.json(demoDataSources);
});
