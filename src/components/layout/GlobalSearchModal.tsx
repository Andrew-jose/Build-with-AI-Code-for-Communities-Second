import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, MapPin, Building2, ArrowRight } from 'lucide-react';
import { RiskBadge } from '../shared/RiskBadge';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    zones,
    setSelectedZone,
    assets,
    setSelectedAsset,
    setActivePage,
  } = useApp();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedZones = zones
      .filter(z => z.name.toLowerCase().includes(q) || z.code.toLowerCase().includes(q) || z.district.toLowerCase().includes(q))
      .map(z => ({
        type: 'ZONE' as const,
        id: z.id,
        code: z.code,
        title: `${z.code} — ${z.name}`,
        subtitle: `District: ${z.district} · Pop: ${z.population.toLocaleString()} · Elevation: ${z.elevationM}m`,
        threatLevel: z.threatLevel,
        item: z,
      }));

    const matchedAssets = assets
      .filter(a => a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.zoneCode.toLowerCase().includes(q))
      .map(a => ({
        type: 'ASSET' as const,
        id: a.id,
        code: a.category,
        title: a.name,
        subtitle: `${a.type} · Sector ${a.zoneCode} · Priority Score: ${a.priorityRiskScore}`,
        threatLevel: a.threatLevel,
        item: a,
      }));

    return [...matchedZones, ...matchedAssets].slice(0, 10);
  }, [query, zones, assets]);

  if (!isSearchOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Operations Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-2xs p-4"
    >
      <div className="w-full max-w-2xl bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#D9DEE5] gap-3 bg-[#FFFFFF]">
          <Search className="w-4 h-4 text-[#7B8794] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coastal sectors (e.g. AP-14), hospitals, shelters, substations, roads..."
            className="w-full bg-transparent text-xs text-[#17202A] placeholder-[#7B8794] focus:outline-hidden font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#7B8794] hover:text-[#17202A]">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline font-mono text-[10px] bg-[#F0F2F5] px-1.5 py-0.5 rounded text-[#5E6B78] border border-[#D9DEE5]">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-[#5E6B78] space-y-2">
              <p>Type to locate critical infrastructure assets or vulnerable coastal sectors.</p>
              <div className="flex flex-wrap justify-center gap-1.5 max-w-md mx-auto pt-2">
                {['AP-14 Kakinada', 'AP-12 Diviseema', 'District Hospital', '220kV Substation', 'NH-216'].map(quick => (
                  <button
                    key={quick}
                    onClick={() => setQuery(quick)}
                    className="px-2 py-1 text-[11px] font-mono bg-[#F7F8FA] hover:bg-[#F0F2F5] text-[#17202A] rounded border border-[#D9DEE5]"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#7B8794]">
              No matching coastal assets or sectors found for "{query}".
            </div>
          ) : (
            searchResults.map(res => (
              <div
                key={`${res.type}-${res.id}`}
                onClick={() => {
                  if (res.type === 'ZONE') {
                    setSelectedZone(res.item as any);
                    setSelectedAsset(null);
                    setActivePage('LIVE_MAP');
                  } else {
                    setSelectedAsset(res.item as any);
                    const parentZone = zones.find(z => z.code === (res.item as any).zoneCode);
                    if (parentZone) setSelectedZone(parentZone);
                    setActivePage('LIVE_MAP');
                  }
                  setIsSearchOpen(false);
                }}
                className="p-2.5 rounded hover:bg-[#F7F8FA] cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-[#D9DEE5]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded bg-[#F0F2F5] border border-[#D9DEE5] flex items-center justify-center text-[#123B5D] shrink-0">
                    {res.type === 'ZONE' ? <MapPin className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-[#17202A] block truncate">{res.title}</span>
                    <span className="text-[11px] text-[#5E6B78] block truncate">{res.subtitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <RiskBadge level={res.threatLevel} size="sm" />
                  <ArrowRight className="w-3.5 h-3.5 text-[#7B8794]" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#F7F8FA] border-t border-[#D9DEE5] flex items-center justify-between text-[11px] text-[#7B8794]">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
