import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

export const EvidenceDrawer: React.FC = () => {
  const { evidenceModalData, setEvidenceModalData } = useApp();

  if (!evidenceModalData) return null;

  const { title, records } = evidenceModalData;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Verified Quantitative Evidence Chain"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4"
    >
      <div className="w-full max-w-2xl bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-xl flex flex-col max-h-[85vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#F7F8FA] border-b border-[#D9DEE5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#123B5D] flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#17202A] tracking-tight">
                Verified Quantitative Evidence Chain
              </h3>
              <p className="text-[11px] text-[#5E6B78]">
                Ground-truth inputs supplied to analytical reasoning engine
              </p>
            </div>
          </div>
          <button
            onClick={() => setEvidenceModalData(null)}
            className="text-[#7B8794] hover:text-[#17202A] p-1 rounded hover:bg-[#EAEFF5] transition-colors"
            aria-label="Close Evidence Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7B8794] block mb-1">
              Operational Objective / Context
            </span>
            <p className="text-xs font-medium text-[#17202A]">{title}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#17202A]">
              <Database className="w-3.5 h-3.5 text-[#123B5D]" />
              <span>Input Metrics & Telemetry Records</span>
            </div>

            <div className="bg-[#FFFFFF] border border-[#D9DEE5] rounded p-3.5 font-mono text-xs text-[#17202A] space-y-1.5 max-h-72 overflow-y-auto">
              {Object.entries(records).map(([key, val]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-[#F0F2F5] last:border-0 gap-1">
                  <span className="text-[#123B5D] font-semibold">{key}</span>
                  <span className="text-[#5E6B78] break-words sm:text-right max-w-sm tabular-nums">
                    {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#2E7D5B]/8 border border-[#2E7D5B]/25 rounded text-xs text-[#2E7D5B] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E7D5B] mt-0.5" />
            <div>
              <p className="font-semibold text-[#17202A]">Provenance & Verification Policy</p>
              <p className="text-[11px] text-[#5E6B78] mt-0.5 leading-relaxed">
                All numbers are produced by scientific, geospatial, or hydrodynamic simulation engines and verified against sensor feeds. Gemini multimodal model acts as reasoning interpreter only.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#F7F8FA] border-t border-[#D9DEE5] flex justify-end">
          <button
            onClick={() => setEvidenceModalData(null)}
            className="px-4 py-1.5 rounded bg-[#123B5D] hover:bg-[#0E2F4B] text-xs font-medium text-white transition-colors shadow-xs"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
