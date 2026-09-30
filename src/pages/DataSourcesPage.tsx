import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DataSourceProvenance } from '../types';
import {
  Database,
  CheckCircle2,
} from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<DataSourceProvenance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDataSources()
      .then(res => setSources(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto p-5 space-y-5">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#D9DEE5] gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">DATA PROVENANCE & REPOSITORY AUDIT</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>TRANSPARENT SCIENTIFIC GROUNDING</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#17202A] mt-0.5 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#123B5D]" />
            <span>Data Provenance Register</span>
          </h2>
        </div>
      </div>

      {/* Intro explanation */}
      <div className="p-3.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] text-xs text-[#5E6B78] space-y-1 shadow-2xs">
        <p className="font-semibold text-[#17202A]">Ground-Truth Evidence Verification</p>
        <p className="leading-relaxed">
          CycloneShield isolates hydrodynamic and geospatial calculation from language synthesis. All telemetry feeds, digital elevation models, satellite layers, and census records are verified against national standards.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sources.map(src => (
          <div
            key={src.id}
            className="p-4 rounded bg-[#FFFFFF] border border-[#D9DEE5] hover:border-[#CBD5E1] transition-colors flex flex-col justify-between space-y-3 shadow-2xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#F0F2F5] border border-[#D9DEE5] text-[#5E6B78]">
                  {src.mode}
                </span>
                <span
                  className={`flex items-center gap-1 font-mono text-[10px] font-semibold ${
                    src.status === 'ONLINE'
                      ? 'text-[#2E7D5B]'
                      : src.status === 'DEMO_MODE'
                      ? 'text-[#C88618]'
                      : 'text-[#7B8794]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${src.status === 'ONLINE' ? 'bg-[#2E7D5B]' : 'bg-[#C88618]'}`} />
                  <span>{src.status}</span>
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-[#17202A] text-sm">{src.name}</h3>
                <p className="text-[11px] text-[#5E6B78] mt-0.5">{src.provider}</p>
              </div>

              <div className="space-y-1 text-xs text-[#5E6B78] pt-2 border-t border-[#D9DEE5]">
                <div>Coverage: <span className="text-[#17202A] font-medium">{src.coverage}</span></div>
                <div>Data Type: <span className="text-[#17202A] font-medium">{src.dataType}</span></div>
                <div>Last Sync: <span className="text-[#17202A] font-mono font-medium">{src.lastUpdate}</span></div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#D9DEE5] text-[11px] text-[#5E6B78]">
              <span className="text-[10px] uppercase text-[#7B8794] block font-semibold">
                Operational Scope & Limitations:
              </span>
              <p className="mt-0.5 leading-snug">{src.limitations}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
