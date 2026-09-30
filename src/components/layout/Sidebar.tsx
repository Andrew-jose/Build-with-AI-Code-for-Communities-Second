import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationPage } from '../../types';
import {
  LayoutDashboard,
  MapPin,
  Compass,
  Waves,
  CloudRain,
  Building2,
  ShieldCheck,
  Route,
  Zap,
  AlertTriangle,
  SlidersHorizontal,
  FileText,
  Database,
  Settings,
  Shield,
  CheckCircle2,
} from 'lucide-react';

interface NavGroup {
  title: string;
  items: {
    id: NavigationPage;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeSeverity?: 'danger' | 'warning' | 'info';
    shortcut?: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, unacknowledgedAlertsCount, actions, setActiveRiskLayer } = useApp();

  const pendingActionsCount = actions.filter(
    a => a.status === 'PENDING' || a.status === 'ASSIGNED'
  ).length;

  const navGroups: NavGroup[] = [
    {
      title: 'OPERATIONS',
      items: [
        {
          id: 'COMMAND_CENTER',
          label: 'Command Center',
          icon: <LayoutDashboard className="w-4 h-4" />,
          shortcut: 'C',
        },
        {
          id: 'LIVE_MAP',
          label: 'Live Risk Map',
          icon: <MapPin className="w-4 h-4" />,
          shortcut: 'M',
        },
        {
          id: 'CYCLONE_TRACK',
          label: 'Cyclone Track',
          icon: <Compass className="w-4 h-4" />,
        },
        {
          id: 'STORM_SURGE',
          label: 'Storm Surge',
          icon: <Waves className="w-4 h-4" />,
        },
        {
          id: 'RAINFALL_PATHWAY',
          label: 'Rainfall Pathways',
          icon: <CloudRain className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'ASSET INTELLIGENCE',
      items: [
        {
          id: 'INFRASTRUCTURE',
          label: 'Infrastructure',
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          id: 'VULNERABILITY',
          label: 'Vulnerability',
          icon: <ShieldCheck className="w-4 h-4" />,
        },
        {
          id: 'EVACUATION',
          label: 'Evacuation',
          icon: <Route className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'RESPONSE',
      items: [
        {
          id: 'ANTICIPATORY_ACTIONS',
          label: 'Anticipatory Actions',
          icon: <Zap className="w-4 h-4" />,
          badge: pendingActionsCount > 0 ? pendingActionsCount : undefined,
          badgeSeverity: 'warning',
        },
        {
          id: 'ALERTS',
          label: 'Alerts',
          icon: <AlertTriangle className="w-4 h-4" />,
          badge: unacknowledgedAlertsCount > 0 ? unacknowledgedAlertsCount : undefined,
          badgeSeverity: 'danger',
          shortcut: 'A',
        },
        {
          id: 'SCENARIO_LAB',
          label: 'Scenario Lab',
          icon: <SlidersHorizontal className="w-4 h-4" />,
          shortcut: 'S',
        },
      ],
    },
    {
      title: 'REPORTING',
      items: [
        {
          id: 'REPORTS',
          label: 'Reports',
          icon: <FileText className="w-4 h-4" />,
          shortcut: 'R',
        },
        {
          id: 'DATA_SOURCES',
          label: 'Data Sources',
          icon: <Database className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        {
          id: 'SETTINGS',
          label: 'Settings',
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleNavClick = (id: NavigationPage) => {
    if (id === 'EVACUATION') {
      setActiveRiskLayer('roads');
      setActivePage('LIVE_MAP');
      return;
    }
    setActivePage(id);
  };

  return (
    <aside className="w-56 bg-[#FFFFFF] border-r border-[#D9DEE5] flex flex-col shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#D9DEE5] bg-[#FFFFFF]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#123B5D] flex items-center justify-center text-white shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-[#17202A]">
                CYCLONESHIELD
              </span>
            </div>
            <p className="text-[11px] text-[#5E6B78] font-normal leading-tight">
              Bay of Bengal Operations
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Groups List */}
      <nav className="flex-1 py-3 px-2 space-y-3.5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <div className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#7B8794]">
              {group.title}
            </div>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activePage === item.id || (item.id === 'EVACUATION' && activePage === 'LIVE_MAP' && false);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[13px] transition-colors ${
                      isActive
                        ? 'bg-[#EAEFF5] text-[#123B5D] font-semibold'
                        : 'text-[#5E6B78] hover:text-[#17202A] hover:bg-[#F0F2F5] font-normal'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`${isActive ? 'text-[#123B5D]' : 'text-[#7B8794]'}`}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge !== undefined && (
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            item.badgeSeverity === 'danger'
                              ? 'bg-[#C63C3C]/10 text-[#C63C3C] border border-[#C63C3C]/20'
                              : 'bg-[#C88618]/10 text-[#C88618] border border-[#C88618]/20'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.shortcut && (
                        <kbd className="font-mono text-[9px] text-[#7B8794] hidden group-hover:inline">
                          {item.shortcut}
                        </kbd>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* System Status Section at bottom */}
      <div className="p-3 border-t border-[#D9DEE5] bg-[#F7F8FA]">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E7D5B]" />
            <span className="text-[11px] font-semibold text-[#17202A] uppercase tracking-wider">
              SYSTEM STATUS
            </span>
          </div>
        </div>
        <p className="text-[11px] text-[#5E6B78] mt-1 font-medium">
          All services operational
        </p>
      </div>
    </aside>
  );
};
