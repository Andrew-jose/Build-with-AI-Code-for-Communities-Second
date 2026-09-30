import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/shared/RiskBadge';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Bot,
  CheckCheck,
  CheckCircle2,
} from 'lucide-react';

export const AlertCenterPage: React.FC = () => {
  const { alerts, acknowledgeAlert, triggerAnalystPrompt, setSelectedZone, zones, setActivePage } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const severities: { key: string; label: string; count: number }[] = [
    { key: 'ALL', label: 'All Incidents', count: alerts.length },
    { key: 'CRITICAL', label: 'Critical', count: alerts.filter(a => a.severity === 'CRITICAL').length },
    { key: 'WARNING', label: 'Warning', count: alerts.filter(a => a.severity === 'WARNING').length },
    { key: 'WATCH', label: 'Watch', count: alerts.filter(a => a.severity === 'WATCH').length },
    { key: 'INFO', label: 'Advisories', count: alerts.filter(a => a.severity === 'INFO').length },
  ];

  const filteredAlerts = alerts.filter(
    a => filterSeverity === 'ALL' || a.severity === filterSeverity
  );

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const handleAcknowledgeAll = async () => {
    for (const alt of alerts.filter(a => !a.acknowledged)) {
      await acknowledgeAlert(alt.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto p-5 space-y-5">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#D9DEE5] gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">INCIDENT MANAGEMENT SYSTEM</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>THRESHOLD TRIGGERS & EARLY WARNINGS</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#17202A] mt-0.5 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#C63C3C]" />
            <span>Incident Alert Center</span>
          </h2>
        </div>

        {/* Global Alert Action Buttons */}
        <div className="flex items-center gap-2">
          {unacknowledgedCount > 0 && (
            <button
              onClick={handleAcknowledgeAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] hover:bg-[#F0F2F5] text-[#17202A] text-xs font-medium transition-colors shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#2E7D5B]" />
              <span>Acknowledge All ({unacknowledgedCount})</span>
            </button>
          )}

          <button
            onClick={() => triggerAnalystPrompt('Analyze all active unacknowledged alerts and prioritize emergency evacuations')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Bot className="w-3.5 h-3.5 text-[#93C5FD]" />
            <span>Synthesize Alert Priorities</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-[#FFFFFF] p-1 rounded border border-[#D9DEE5] text-xs shadow-2xs">
        {severities.map(sev => (
          <button
            key={sev.key}
            onClick={() => setFilterSeverity(sev.key)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors whitespace-nowrap ${
              filterSeverity === sev.key
                ? 'bg-[#123B5D] text-white font-semibold'
                : 'text-[#5E6B78] hover:text-[#17202A] hover:bg-[#F0F2F5]'
            }`}
          >
            <span>{sev.label}</span>
            <span className={`text-[10px] font-mono px-1 rounded ${filterSeverity === sev.key ? 'bg-white/20 text-white' : 'bg-[#F0F2F5] text-[#7B8794]'}`}>
              {sev.count}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts Feed (Narrow colored indicator on left, clean white surface) */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-10 text-center rounded bg-[#FFFFFF] border border-[#D9DEE5] text-xs text-[#7B8794]">
            No incidents found in the "{filterSeverity}" category.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            let leftBorderColor = 'border-l-[#CBD5E1]';
            if (alert.severity === 'CRITICAL') leftBorderColor = 'border-l-[#C63C3C]';
            else if (alert.severity === 'WARNING') leftBorderColor = 'border-l-[#C88618]';
            else if (alert.severity === 'WATCH') leftBorderColor = 'border-l-[#B45309]';
            else if (alert.severity === 'INFO') leftBorderColor = 'border-l-[#2563A6]';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded bg-[#FFFFFF] border-l-4 ${leftBorderColor} border-y border-r border-[#D9DEE5] shadow-2xs space-y-2 transition-opacity ${
                  alert.acknowledged ? 'opacity-70' : 'opacity-100'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={alert.severity} size="sm" />
                    <h3 className="text-sm font-semibold text-[#17202A]">
                      {alert.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#5E6B78]">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#7B8794]" />
                      <span>{alert.timestamp}</span>
                    </span>
                    <button
                      onClick={() => {
                        const zone = zones.find(z => z.code === alert.zoneCode);
                        if (zone) {
                          setSelectedZone(zone);
                          setActivePage('LIVE_MAP');
                        }
                      }}
                      className="flex items-center gap-1 text-[#2563A6] hover:text-[#123B5D] hover:underline"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{alert.location}</span>
                    </button>
                  </div>
                </div>

                {/* Trigger & Quantitative Evidence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-0.5">
                    <span className="text-[10px] uppercase font-semibold text-[#5E6B78] block">
                      Trigger Mechanism
                    </span>
                    <p className="text-[#17202A] leading-relaxed">{alert.trigger}</p>
                  </div>

                  <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-0.5">
                    <span className="text-[10px] uppercase font-semibold text-[#123B5D] block">
                      Quantitative Evidence
                    </span>
                    <p className="text-[#17202A] leading-relaxed">{alert.evidence}</p>
                  </div>
                </div>

                {/* Mandated Action & Acknowledge */}
                <div className="p-2.5 rounded bg-[#F0F2F5] border border-[#D9DEE5] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase text-[#5E6B78] font-bold block">
                      Recommended Directive:
                    </span>
                    <p className="text-[#17202A] font-medium">{alert.recommendedAction}</p>
                  </div>

                  <div className="shrink-0">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-xs font-medium transition-colors shadow-2xs"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#2E7D5B] flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Acknowledged</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
