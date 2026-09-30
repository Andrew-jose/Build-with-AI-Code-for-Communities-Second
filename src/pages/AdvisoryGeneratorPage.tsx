import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { AdvisoryResponse } from '../types';
import {
  Send,
  Copy,
  Printer,
  Edit3,
  Check,
  Building,
  HeartPulse,
  Radio,
  FileCheck2,
  Users,
  ShieldCheck,
} from 'lucide-react';

export const AdvisoryGeneratorPage: React.FC = () => {
  const { selectedZone } = useApp();
  const [activeAudience, setActiveAudience] = useState<'MUNICIPAL' | 'DISASTER_MANAGEMENT' | 'HOSPITAL' | 'INFRASTRUCTURE' | 'PUBLIC'>('MUNICIPAL');
  const [advisory, setAdvisory] = useState<AdvisoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSituation, setEditedSituation] = useState('');
  const [sendSuccessMsg, setSendSuccessMsg] = useState<string | null>(null);

  const audienceTabs: { key: typeof activeAudience; label: string; icon: React.ReactNode }[] = [
    { key: 'MUNICIPAL', label: 'Municipal Authority', icon: <Building className="w-3.5 h-3.5" /> },
    { key: 'DISASTER_MANAGEMENT', label: 'Disaster Ops Command', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { key: 'HOSPITAL', label: 'Hospital & Healthcare', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { key: 'INFRASTRUCTURE', label: 'Infrastructure Operators', icon: <Radio className="w-3.5 h-3.5" /> },
    { key: 'PUBLIC', label: 'Public Safety Broadcast', icon: <Users className="w-3.5 h-3.5" /> },
  ];

  const fetchAdvisory = async (audience: typeof activeAudience) => {
    setLoading(true);
    setSendSuccessMsg(null);
    try {
      const res = await api.generateAdvisory({
        audience,
        zoneCode: selectedZone?.code || 'AP-14',
      });
      setAdvisory(res);
      setEditedSituation(res.situation);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to generate advisory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisory(activeAudience);
  }, [activeAudience, selectedZone]);

  const handleCopy = () => {
    if (!advisory) return;
    const textToCopy = `
${advisory.title}
Audience: ${advisory.audience}
Generated: ${advisory.generatedAt}

SITUATION:
${isEditing ? editedSituation : advisory.situation}

AFFECTED LOCATIONS:
${advisory.affectedLocations.map(l => `• ${l}`).join('\n')}

IMMEDIATE OPERATIONAL ACTIONS:
${advisory.immediateActions.map(a => `• ${a}`).join('\n')}

INFRASTRUCTURE PRIORITIES:
${advisory.infrastructurePriorities.map(p => `• ${p}`).join('\n')}

EVACUATION GUIDANCE:
${advisory.evacuationGuidance}

MONITORING REQUIREMENTS:
${advisory.monitoringRequirements.map(m => `• ${m}`).join('\n')}

DISCLAIMER:
${advisory.disclaimer}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendDispatch = async () => {
    if (!advisory) return;
    try {
      const res = await api.sendAdvisory({
        channel: activeAudience === 'PUBLIC' ? 'Public Cell Broadcast & All India Radio' : 'Secured State Police VHF & WhatsApp Ops Grid',
        recipientGroup: activeAudience,
        advisoryTitle: advisory.title,
      });
      setSendSuccessMsg(res.message);
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto p-5 space-y-5">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#D9DEE5] gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">INCIDENT DIRECTIVE ENGINE</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>MULTI-AGENCY ADVISORY GENERATOR</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#17202A] mt-0.5 flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#123B5D]" />
            <span>Automated Advisory & Directive Generator</span>
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] hover:bg-[#F0F2F5] text-[#17202A] text-xs font-medium transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#5E6B78]" />
            <span>Export / Print</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] hover:bg-[#F0F2F5] text-[#17202A] text-xs font-medium transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#2E7D5B]" /> : <Copy className="w-3.5 h-3.5 text-[#5E6B78]" />}
            <span>{copied ? 'Copied' : 'Copy Directive'}</span>
          </button>

          <button
            onClick={handleSendDispatch}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-[#93C5FD]" />
            <span>Dispatch to Agency Grid</span>
          </button>
        </div>
      </div>

      {sendSuccessMsg && (
        <div className="p-3 rounded bg-[#2E7D5B]/10 border border-[#2E7D5B]/30 text-[#2E7D5B] text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{sendSuccessMsg}</span>
        </div>
      )}

      {/* Target Audience Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-[#FFFFFF] p-1 rounded border border-[#D9DEE5] text-xs shadow-2xs">
        {audienceTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveAudience(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap ${
              activeAudience === tab.key
                ? 'bg-[#123B5D] text-white font-semibold'
                : 'text-[#5E6B78] hover:text-[#17202A] hover:bg-[#F0F2F5]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Advisory Sheet */}
      <div className="p-6 rounded bg-[#FFFFFF] border border-[#D9DEE5] shadow-2xs space-y-4 max-w-4xl">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2 text-[#5E6B78]">
            <div className="w-6 h-6 rounded-full border-2 border-[#CBD5E1] border-t-[#123B5D] animate-spin" />
            <span className="text-xs">Synthesizing tailored operational directive...</span>
          </div>
        ) : advisory ? (
          <div className="space-y-4 text-xs">
            {/* Directive Header */}
            <div className="pb-3 border-b border-[#D9DEE5] flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#123B5D] block tracking-wider">
                  Target Recipient: {advisory.audience}
                </span>
                <h3 className="text-base font-bold text-[#17202A] mt-0.5">{advisory.title}</h3>
                <span className="text-[11px] text-[#7B8794] block mt-0.5">
                  Generated: {advisory.generatedAt} · Target Sector: {selectedZone?.name || 'Kakinada Sector'}
                </span>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#F0F2F5] hover:bg-[#EAEFF5] text-[#17202A] text-xs font-medium shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#5E6B78]" />
                <span>{isEditing ? 'Save Edit' : 'Edit Brief'}</span>
              </button>
            </div>

            {/* Situation */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#17202A] uppercase tracking-wide">
                1. Situation Overview
              </span>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={editedSituation}
                  onChange={(e) => setEditedSituation(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#FFFFFF] border border-[#CBD5E1] text-[#17202A] text-xs focus:outline-hidden focus:border-[#123B5D]"
                />
              ) : (
                <p className="text-[#5E6B78] leading-relaxed p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                  {editedSituation || advisory.situation}
                </p>
              )}
            </div>

            {/* Immediate Operational Actions */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#17202A] uppercase tracking-wide">
                2. Mandated Immediate Actions
              </span>
              <ul className="space-y-1 text-[#17202A]">
                {advisory.immediateActions.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                    <span className="text-[#123B5D] font-bold shrink-0">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Infrastructure Priorities */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#17202A] uppercase tracking-wide">
                3. Infrastructure Asset Priorities
              </span>
              <ul className="space-y-1 text-[#5E6B78]">
                {advisory.infrastructurePriorities.map((inf, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
                    <span className="text-[#C88618] font-bold shrink-0">•</span>
                    <span className="text-[#17202A]">{inf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evacuation Guidance */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#17202A] uppercase tracking-wide">
                4. Evacuation Guidance & Shelter Protocols
              </span>
              <p className="text-[#17202A] leading-relaxed p-3 bg-[#9E2635]/5 border border-[#9E2635]/20 rounded font-medium">
                {advisory.evacuationGuidance}
              </p>
            </div>

            {/* Governance Disclaimer */}
            <div className="pt-2 border-t border-[#D9DEE5] text-[10px] text-[#7B8794] leading-relaxed">
              <span className="font-semibold text-[#5E6B78] uppercase block">Authority Disclaimer:</span>
              <p>{advisory.disclaimer}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
