import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { StructuredAIResponse } from '../../types';
import { RiskBadge } from '../shared/RiskBadge';
import {
  FileText,
  X,
  Send,
  Loader2,
  FileCheck2,
  AlertCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export const GeminiRiskAnalystPanel: React.FC = () => {
  const {
    isAnalystOpen,
    setIsAnalystOpen,
    analystInitialPrompt,
    selectedZone,
    activeScenario,
    setEvidenceModalData,
  } = useApp();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<StructuredAIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const suggestedPrompts = [
    'Why is AP-14 classified as extreme risk?',
    'What infrastructure will likely fail first?',
    'Which evacuation routes are most vulnerable?',
    'Summarize the next 12 hours.',
    'Compare expected vs extreme surge.',
    'Generate an advisory for municipal authorities.',
  ];

  const handleRunQuery = async (customPrompt?: string) => {
    const promptToRun = customPrompt || query;
    if (!promptToRun.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await api.analyzeRisk({
        query: promptToRun,
        zoneCode: selectedZone?.code,
        scenarioName: activeScenario === 'Custom' ? 'Expected' : activeScenario,
      });
      setResponse(result);
    } catch (err: any) {
      console.error('AI Risk Analysis error:', err);
      setError(err?.message || 'Reasoning engine timeout. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (analystInitialPrompt && isAnalystOpen) {
      setQuery(analystInitialPrompt);
      handleRunQuery(analystInitialPrompt);
    }
  }, [analystInitialPrompt, isAnalystOpen]);

  if (!isAnalystOpen) return null;

  return (
    <div
      role="region"
      aria-label="Risk Analyst Panel"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] lg:w-[560px] bg-[#FFFFFF] border-l border-[#D9DEE5] shadow-xl flex flex-col select-none animate-in slide-in-from-right duration-200"
    >
      {/* Header: Clean Institutional Console */}
      <div className="h-14 px-4 bg-[#F7F8FA] border-b border-[#D9DEE5] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#123B5D] flex items-center justify-center text-white shrink-0">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#17202A] tracking-tight">
                RISK ANALYST
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#F0F2F5] text-[#5E6B78] font-mono text-[10px] border border-[#D9DEE5] font-semibold">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-[#5E6B78]">
              Situation assessment generated from current model inputs
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAnalystOpen(false)}
          className="text-[#7B8794] hover:text-[#17202A] p-1.5 rounded hover:bg-[#EAEFF5] transition-colors"
          aria-label="Close Risk Analyst"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Suggested Queries / Directives */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7B8794] block mb-1.5">
            Operational Analytical Queries
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => {
                  setQuery(prompt);
                  handleRunQuery(prompt);
                }}
                className="text-left px-2.5 py-1 text-xs rounded bg-[#F7F8FA] hover:bg-[#F0F2F5] text-[#17202A] border border-[#D9DEE5] hover:border-[#CBD5E1] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-7 h-7 text-[#123B5D] animate-spin" />
            <div className="text-center text-xs text-[#5E6B78] space-y-1">
              <p className="font-semibold text-[#17202A]">Synthesizing Situation Assessment...</p>
              <p className="text-[11px] text-[#7B8794]">
                Evaluating IMD telemetry, Copernicus DEM, and infrastructure exposure records
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded bg-[#C63C3C]/8 border border-[#C63C3C]/25 text-xs text-[#C63C3C] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#C63C3C]" />
            <span>{error}</span>
          </div>
        )}

        {/* Structured Analyst Report Display */}
        {response && !loading && (
          <div className="space-y-4">
            {/* 1. ASSESSMENT */}
            <div className="p-3.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-2">
              <div className="flex items-center justify-between text-[11px] pb-1 border-b border-[#D9DEE5]">
                <span className="font-semibold text-[#123B5D] uppercase tracking-wider">
                  ASSESSMENT
                </span>
                <span className="text-[10px] text-[#7B8794] font-mono">
                  Sector: {selectedZone?.code || 'AP-14'}
                </span>
              </div>
              <p className="text-xs text-[#17202A] leading-relaxed">
                {response.summary}
              </p>
            </div>

            {/* 2. EVIDENCE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7B8794]">
                  EVIDENCE
                </span>
                <button
                  onClick={() =>
                    setEvidenceModalData({
                      title: query || 'Evidence Audit',
                      records: response.rawContextUsed || {},
                    })
                  }
                  className="text-[11px] text-[#2563A6] hover:text-[#123B5D] font-medium flex items-center gap-1"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Inspect Ground Truth</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {response.keyEvidence.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-0.5 shadow-2xs"
                  >
                    <span className="text-[10px] text-[#5E6B78] block truncate">
                      {ev.label}
                    </span>
                    <span className="text-sm font-bold font-mono text-[#17202A] block tabular-nums">
                      {ev.value}
                    </span>
                    <span className="text-[9px] text-[#7B8794] font-mono block truncate">
                      Src: {ev.verifiedSource}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. KEY RISKS */}
            <div className="p-3.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-2.5 shadow-2xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C63C3C] block">
                KEY RISKS
              </span>
              <ul className="space-y-1.5 text-xs text-[#17202A]">
                {response.primaryRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C63C3C] font-bold shrink-0 mt-0.5">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
                {response.secondaryRisks && response.secondaryRisks.map((risk, idx) => (
                  <li key={`sec-${idx}`} className="flex items-start gap-2 text-[#5E6B78]">
                    <span className="text-[#C88618] font-bold shrink-0 mt-0.5">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. PRIORITY ACTIONS */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7B8794] block">
                PRIORITY ACTIONS
              </span>
              <div className="space-y-2">
                {response.recommendedActions.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#17202A] text-xs">
                        {act.action}
                      </span>
                      <RiskBadge level={act.priority} size="sm" />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5E6B78] pt-0.5">
                      <span>Deadline: <strong className="text-[#17202A] font-mono">{act.deadline}</strong></span>
                      <span>Agency: <strong className="text-[#17202A]">{act.agency}</strong></span>
                    </div>

                    <div className="p-2 rounded bg-[#F7F8FA] border border-[#D9DEE5] text-[11px] text-[#5E6B78]">
                      <span className="text-[#123B5D] font-semibold">Evidence: </span>
                      {act.evidence}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. DATA QUALITY */}
            <div className="p-3 rounded bg-[#F7F8FA] border border-[#D9DEE5] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7B8794]">
                  DATA QUALITY
                </span>
                <span className="font-semibold text-[#2E7D5B] font-mono text-[11px]">
                  {response.confidence.rating} Confidence
                </span>
              </div>
              <p className="text-[11px] text-[#5E6B78]">{response.confidence.notes}</p>

              <div className="pt-2 border-t border-[#D9DEE5]">
                <span className="text-[10px] text-[#7B8794] block mb-1 uppercase font-semibold">Grounded Data Feeds:</span>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {response.dataSources.map((ds, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-[#FFFFFF] text-[#5E6B78] border border-[#D9DEE5]">
                      {ds}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. ASSUMPTIONS */}
            <div className="p-3 rounded bg-[#FFFFFF] border border-[#D9DEE5] space-y-1 text-xs shadow-2xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7B8794] block">
                ASSUMPTIONS
              </span>
              <p className="text-[11px] text-[#5E6B78] leading-relaxed">
                Hydrodynamic modeling assumes high-tide synchronization at 23:30 UTC with continuous forward velocity of 16 km/h. Sluice gate backflow locking occurs when coastal surge exceeds local drainage elevation datum.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-[#F7F8FA] border-t border-[#D9DEE5] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunQuery();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Inquire risk analysis (e.g. Why is AP-14 extreme risk?)..."
            className="flex-1 bg-[#FFFFFF] border border-[#D9DEE5] rounded px-3 py-1.5 text-xs text-[#17202A] placeholder-[#7B8794] focus:outline-hidden focus:border-[#123B5D]"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-3.5 py-1.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
};
