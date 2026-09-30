import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnticipatoryAction } from '../types';
import { RiskBadge } from '../components/shared/RiskBadge';
import {
  Zap,
  Clock,
  CheckCircle2,
  UserCheck,
  Send,
  FileDown,
  FileCheck2,
} from 'lucide-react';

export const AnticipatoryActionPage: React.FC = () => {
  const { actions, updateActionStatus, setEvidenceModalData, triggerAnalystPrompt } = useApp();
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [assignModalAction, setAssignModalAction] = useState<AnticipatoryAction | null>(null);
  const [assigneeName, setAssigneeName] = useState('');

  const stages = ['ALL', 'T-24h', 'T-18h', 'T-12h', 'T-9h', 'T-6h', 'T-3h', 'LANDFALL'];

  const filteredActions = actions.filter(
    a => filterStage === 'ALL' || a.timelineStage === filterStage
  );

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalAction || !assigneeName.trim()) return;
    updateActionStatus(assignModalAction.id, 'ASSIGNED', assigneeName.trim());
    setAssignModalAction(null);
    setAssigneeName('');
  };

  const handleExportCSV = () => {
    const headers = ['Stage', 'Action', 'Priority', 'Affected Zone', 'Responsible Agency', 'Status'];
    const rows = actions.map(a => [
      a.timelineStage,
      `"${a.action.replace(/"/g, '""')}"`,
      a.priority,
      `"${a.affectedZone}"`,
      `"${a.responsibleAgency}"`,
      a.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyclone_anticipatory_actions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const executedCount = actions.filter(a => a.status === 'EXECUTED').length;
  const assignedCount = actions.filter(a => a.status === 'ASSIGNED').length;
  const pendingCount = actions.filter(a => a.status === 'PENDING').length;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto p-5 space-y-5">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#D9DEE5] gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">INCIDENT COMMAND SYSTEM</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>PRE-LANDFALL ANTICIPATORY ACTION PROTOCOL</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#17202A] mt-0.5 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#C88618]" />
            <span>Anticipatory Action Operations Register</span>
          </h2>
        </div>

        {/* Global Export & Advisory Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] hover:bg-[#F0F2F5] text-[#17202A] text-xs font-medium transition-colors shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5 text-[#5E6B78]" />
            <span>Export Action Register (CSV)</span>
          </button>

          <button
            onClick={() => triggerAnalystPrompt('Formulate immediate anticipatory deployment priorities for next 6 hours')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-[#93C5FD]" />
            <span>Dispatch Multi-Agency Advisory</span>
          </button>
        </div>
      </div>

      {/* Progress Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-2xs">
          <span className="text-[10px] font-semibold text-[#5E6B78] uppercase block">Total Directives</span>
          <span className="text-xl font-bold font-mono text-[#17202A] tabular-nums">{actions.length} Directives</span>
        </div>
        <div className="p-3 bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-2xs">
          <span className="text-[10px] font-semibold text-[#2E7D5B] uppercase block">Executed & Verified</span>
          <span className="text-xl font-bold font-mono text-[#2E7D5B] tabular-nums">{executedCount} Completed</span>
        </div>
        <div className="p-3 bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-2xs">
          <span className="text-[10px] font-semibold text-[#2563A6] uppercase block">Assigned / In Movement</span>
          <span className="text-xl font-bold font-mono text-[#2563A6] tabular-nums">{assignedCount} Mobilized</span>
        </div>
        <div className="p-3 bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-2xs">
          <span className="text-[10px] font-semibold text-[#C63C3C] uppercase block">Pending Clearance</span>
          <span className="text-xl font-bold font-mono text-[#C63C3C] tabular-nums">{pendingCount} Critical</span>
        </div>
      </div>

      {/* Stage Timeline Filter Bar */}
      <div className="flex items-center gap-1 overflow-x-auto bg-[#FFFFFF] p-1 rounded border border-[#D9DEE5] text-xs shadow-2xs">
        <span className="text-[#5E6B78] px-2 uppercase text-[10px] hidden sm:inline font-semibold">Phase:</span>
        {stages.map(stg => (
          <button
            key={stg}
            onClick={() => setFilterStage(stg)}
            className={`px-3 py-1 rounded font-medium transition-colors whitespace-nowrap ${
              filterStage === stg
                ? 'bg-[#123B5D] text-white font-semibold'
                : 'text-[#5E6B78] hover:text-[#17202A] hover:bg-[#F0F2F5]'
            }`}
          >
            {stg}
          </button>
        ))}
      </div>

      {/* Actions Feed */}
      <div className="space-y-3">
        {filteredActions.length === 0 ? (
          <div className="p-10 text-center rounded bg-[#FFFFFF] border border-[#D9DEE5] text-xs text-[#7B8794]">
            No anticipatory actions scheduled for stage {filterStage}.
          </div>
        ) : (
          filteredActions.map((action) => (
            <div
              key={action.id}
              className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] hover:border-[#CBD5E1] transition-colors space-y-2.5 shadow-2xs"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded font-mono text-xs font-semibold bg-[#F0F2F5] border border-[#D9DEE5] text-[#123B5D]">
                    {action.timelineStage}
                  </span>
                  <RiskBadge level={action.priority} size="md" />
                  <span className="text-xs text-[#5E6B78]">
                    Target Sector: <strong className="text-[#17202A]">{action.affectedZone}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#7B8794]">Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      action.status === 'EXECUTED'
                        ? 'bg-[#2E7D5B]/10 text-[#2E7D5B] border border-[#2E7D5B]/20'
                        : action.status === 'ASSIGNED'
                        ? 'bg-[#2563A6]/10 text-[#2563A6] border border-[#2563A6]/20'
                        : action.status === 'ACKNOWLEDGED'
                        ? 'bg-[#C88618]/10 text-[#C88618] border border-[#C88618]/20'
                        : 'bg-[#C63C3C]/10 text-[#C63C3C] border border-[#C63C3C]/20'
                    }`}
                  >
                    {action.status}
                  </span>
                </div>
              </div>

              {/* Action Title & Rationale */}
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-[#17202A]">
                  {action.action}
                </h3>
                <p className="text-xs text-[#5E6B78] leading-relaxed">
                  <strong className="text-[#17202A]">Operational Trigger: </strong>
                  {action.reason}
                </p>
              </div>

              {/* Supporting Telemetry Box */}
              <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#5E6B78]">
                  <span className="font-semibold text-[#17202A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" />
                    Trigger Telemetry Data:
                  </span>
                  <button
                    onClick={() => setEvidenceModalData({ title: action.action, records: action.evidence as any })}
                    className="text-[#2563A6] hover:text-[#123B5D] flex items-center gap-1 transition-colors"
                  >
                    <FileCheck2 className="w-3 h-3" />
                    <span>Audit Evidence</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-0.5 text-[#5E6B78]">
                  {action.evidence.projectedSurgeM !== undefined && (
                    <div>Surge: <strong className="text-[#17202A]">+{action.evidence.projectedSurgeM}m</strong></div>
                  )}
                  {action.evidence.elevationM !== undefined && (
                    <div>Elevation: <strong className="text-[#17202A]">{action.evidence.elevationM}m MSL</strong></div>
                  )}
                  {action.evidence.rainfallMm24h !== undefined && (
                    <div>Rainfall: <strong className="text-[#17202A]">{action.evidence.rainfallMm24h} mm</strong></div>
                  )}
                  {action.evidence.populationExposed !== undefined && (
                    <div>Exposed Pop: <strong className="text-[#17202A]">{action.evidence.populationExposed.toLocaleString()}</strong></div>
                  )}
                  {action.evidence.roadDisruptionProb !== undefined && (
                    <div>Road Cutoff: <strong className="text-[#17202A]">{action.evidence.roadDisruptionProb}%</strong></div>
                  )}
                  {action.evidence.shelterDistanceKm !== undefined && (
                    <div>Shelter: <strong className="text-[#17202A]">{action.evidence.shelterDistanceKm} km</strong></div>
                  )}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-[#D9DEE5]">
                <div className="text-[11px] text-[#5E6B78]">
                  <span>Agency: <strong className="text-[#17202A]">{action.responsibleAgency}</strong></span>
                  {action.assignedTo && (
                    <span> · Assignee: <strong className="text-[#123B5D]">{action.assignedTo}</strong></span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {action.status === 'PENDING' && (
                    <button
                      onClick={() => updateActionStatus(action.id, 'ACKNOWLEDGED')}
                      className="px-2.5 py-1 rounded bg-[#F0F2F5] hover:bg-[#EAEFF5] text-[#17202A] text-xs font-medium transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}

                  {action.status !== 'EXECUTED' && (
                    <button
                      onClick={() => setAssignModalAction(action)}
                      className="px-2.5 py-1 rounded bg-[#FFFFFF] border border-[#D9DEE5] hover:bg-[#F0F2F5] text-[#17202A] text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3 text-[#5E6B78]" />
                      <span>Assign Unit</span>
                    </button>
                  )}

                  {action.status !== 'EXECUTED' ? (
                    <button
                      onClick={() => updateActionStatus(action.id, 'EXECUTED')}
                      className="px-3 py-1 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-xs font-medium transition-colors shadow-2xs"
                    >
                      Mark Executed
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#2E7D5B] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed & Logged</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign Modal */}
      {assignModalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAssignSubmit}
            className="w-full max-w-md bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-xl p-5 space-y-4"
          >
            <h3 className="text-sm font-semibold text-[#17202A]">Assign Action Directive</h3>
            <p className="text-xs text-[#5E6B78]">{assignModalAction.action}</p>

            <div>
              <label className="text-xs font-medium text-[#17202A] block mb-1">
                Designated Unit / Strike Force:
              </label>
              <input
                type="text"
                autoFocus
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                placeholder="e.g. 10th NDRF Battalion (Visakhapatnam)"
                className="w-full bg-[#FFFFFF] border border-[#D9DEE5] rounded px-3 py-1.5 text-xs text-[#17202A] placeholder-[#7B8794] focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#D9DEE5]">
              <button
                type="button"
                onClick={() => setAssignModalAction(null)}
                className="px-3 py-1.5 rounded bg-[#F0F2F5] text-[#5E6B78] hover:text-[#17202A] text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!assigneeName.trim()}
                className="px-3.5 py-1.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-xs font-medium disabled:opacity-50"
              >
                Confirm Dispatch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
