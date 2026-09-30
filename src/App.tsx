import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { KeyboardShortcutsModal } from './components/layout/KeyboardShortcutsModal';
import { EvidenceDrawer } from './components/layout/EvidenceDrawer';
import { GeminiRiskAnalystPanel } from './components/ai/GeminiRiskAnalystPanel';

// Pages
import { CommandCenterPage } from './pages/CommandCenterPage';
import { LiveRiskMapPage } from './pages/LiveRiskMapPage';
import { CycloneTrackPage } from './pages/CycloneTrackPage';
import { StormSurgePage } from './pages/StormSurgePage';
import { RainfallPathwayPage } from './pages/RainfallPathwayPage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { VulnerabilityPage } from './pages/VulnerabilityPage';
import { AnticipatoryActionPage } from './pages/AnticipatoryActionPage';
import { AlertCenterPage } from './pages/AlertCenterPage';
import { ScenarioLabPage } from './pages/ScenarioLabPage';
import { AdvisoryGeneratorPage } from './pages/AdvisoryGeneratorPage';
import { ReportingPage } from './pages/ReportingPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SettingsPage } from './pages/SettingsPage';

const MainLayout: React.FC = () => {
  const { activePage } = useApp();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'COMMAND_CENTER':
        return <CommandCenterPage />;
      case 'LIVE_MAP':
        return <LiveRiskMapPage />;
      case 'CYCLONE_TRACK':
        return <CycloneTrackPage />;
      case 'STORM_SURGE':
        return <StormSurgePage />;
      case 'RAINFALL_PATHWAY':
        return <RainfallPathwayPage />;
      case 'INFRASTRUCTURE':
        return <InfrastructurePage />;
      case 'VULNERABILITY':
        return <VulnerabilityPage />;
      case 'EVACUATION':
        return <LiveRiskMapPage />;
      case 'ANTICIPATORY_ACTIONS':
        return <AnticipatoryActionPage />;
      case 'ALERTS':
        return <AlertCenterPage />;
      case 'SCENARIO_LAB':
        return <ScenarioLabPage />;
      case 'ADVISORIES':
        return <AdvisoryGeneratorPage />;
      case 'REPORTS':
        return <ReportingPage />;
      case 'DATA_SOURCES':
        return <DataSourcesPage />;
      case 'SETTINGS':
        return <SettingsPage />;
      default:
        return <CommandCenterPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F7FA] text-[#17202A] font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Slide-over Drawers & Overlays */}
      <GeminiRiskAnalystPanel />
      <GlobalSearchModal />
      <KeyboardShortcutsModal />
      <EvidenceDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
