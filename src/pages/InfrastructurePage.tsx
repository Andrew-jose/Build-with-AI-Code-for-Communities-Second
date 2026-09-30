import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/shared/RiskBadge';
import {
  Building2,
  Zap,
  Route,
  HeartPulse,
  ShieldCheck,
  Droplets,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

export const InfrastructurePage: React.FC = () => {
  const { assets, setSelectedAsset, setSelectedZone, zones, setActivePage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortField, setSortField] = useState<'priorityRiskScore' | 'criticalityScore' | 'hazardScore' | 'elevationM'>('priorityRiskScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const categories: { key: string; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'ALL', label: 'All Sectors', icon: <SlidersHorizontal className="w-3.5 h-3.5" />, count: assets.length },
    { key: 'HEALTH', label: 'Hospitals & Medical', icon: <HeartPulse className="w-3.5 h-3.5" />, count: assets.filter(a => a.category === 'HEALTH').length },
    { key: 'EMERGENCY', label: 'Cyclone Shelters', icon: <ShieldCheck className="w-3.5 h-3.5" />, count: assets.filter(a => a.category === 'EMERGENCY').length },
    { key: 'POWER', label: 'Power & Grid', icon: <Zap className="w-3.5 h-3.5" />, count: assets.filter(a => a.category === 'POWER').length },
    { key: 'TRANSPORT', label: 'Highways & Bridges', icon: <Route className="w-3.5 h-3.5" />, count: assets.filter(a => a.category === 'TRANSPORT').length },
    { key: 'WATER', label: 'Water Plants', icon: <Droplets className="w-3.5 h-3.5" />, count: assets.filter(a => a.category === 'WATER').length },
  ];

  const filteredAssets = assets
    .filter(a => selectedCategory === 'ALL' || a.category === selectedCategory)
    .filter(a => selectedRisk === 'ALL' || a.status === selectedRisk)
    .filter(a => searchFilter === '' || a.name.toLowerCase().includes(searchFilter.toLowerCase()) || a.zoneCode.toLowerCase().includes(searchFilter.toLowerCase()) || a.type.toLowerCase().includes(searchFilter.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const criticalRiskCount = assets.filter(a => a.status === 'CRITICAL_RISK').length;
  const atRiskCount = assets.filter(a => a.status === 'AT_RISK').length;
  const securedCount = assets.filter(a => a.status === 'SECURED').length;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F5F7FA] overflow-y-auto p-5 space-y-5">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#D9DEE5] gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5E6B78]">
            <span className="font-semibold text-[#123B5D]">ENTERPRISE ASSET MANAGEMENT</span>
            <span aria-hidden="true" className="text-[#D9DEE5]">·</span>
            <span>MULTI-SECTOR EXPOSURE REGISTER</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#17202A] mt-0.5 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#123B5D]" />
            <span>Critical Infrastructure Exposure Intelligence</span>
          </h2>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8794]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by asset name, sector, or type..."
              className="pl-8 pr-7 py-1.5 rounded bg-[#FFFFFF] border border-[#D9DEE5] text-xs text-[#17202A] placeholder-[#7B8794] focus:outline-hidden focus:border-[#123B5D] w-64 shadow-2xs"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7B8794] hover:text-[#17202A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Operational Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-2xs">
          <span className="text-[10px] font-semibold text-[#5E6B78] block uppercase">Monitored Facilities</span>
          <span className="text-xl font-bold font-mono text-[#17202A] tabular-nums">{assets.length}</span>
        </div>
        <div className="p-3 bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-2xs">
          <span className="text-[10px] font-semibold text-[#9E2635] block uppercase">Critical Risk Outage</span>
          <span className="text-xl font-bold font-mono text-[#9E2635] tabular-nums">{criticalRiskCount}</span>
        </div>
        <div className="p-3 bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-2xs">
          <span className="text-[10px] font-semibold text-[#C88618] block uppercase">At-Risk Assets</span>
          <span className="text-xl font-bold font-mono text-[#C88618] tabular-nums">{atRiskCount}</span>
        </div>
        <div className="p-3 bg-[#FFFFFF] border border-[#D9DEE5] rounded shadow-2xs">
          <span className="text-[10px] font-semibold text-[#2E7D5B] block uppercase">Secured / Fortified</span>
          <span className="text-xl font-bold font-mono text-[#2E7D5B] tabular-nums">{securedCount}</span>
        </div>
      </div>

      {/* Category Tabs & Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.key
                  ? 'bg-[#123B5D] text-white font-semibold'
                  : 'bg-[#FFFFFF] border border-[#D9DEE5] text-[#5E6B78] hover:text-[#17202A] hover:bg-[#F0F2F5]'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono px-1 rounded ${selectedCategory === cat.key ? 'bg-white/20 text-white' : 'bg-[#F0F2F5] text-[#7B8794]'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#5E6B78] shrink-0">
          <span>Status:</span>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-[#FFFFFF] border border-[#D9DEE5] rounded px-2 py-1 text-xs text-[#17202A] focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="CRITICAL_RISK">Critical Risk</option>
            <option value="AT_RISK">At Risk</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="SECURED">Secured</option>
          </select>
        </div>
      </div>

      {/* Main Asset Table */}
      <div className="rounded border border-[#D9DEE5] bg-[#FFFFFF] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F7F8FA] border-b border-[#D9DEE5] text-[11px] uppercase font-semibold text-[#5E6B78]">
                <th className="py-2.5 px-3">Asset Name & Classification</th>
                <th className="py-2.5 px-2.5">Sector</th>
                <th
                  onClick={() => handleSort('hazardScore')}
                  className="py-2.5 px-2.5 text-right cursor-pointer hover:text-[#17202A] select-none"
                >
                  <span>Hazard {sortField === 'hazardScore' && (sortAsc ? '↑' : '↓')}</span>
                </th>
                <th
                  onClick={() => handleSort('elevationM')}
                  className="py-2.5 px-2.5 text-right cursor-pointer hover:text-[#17202A] select-none"
                >
                  <span>Elev (m) {sortField === 'elevationM' && (sortAsc ? '↑' : '↓')}</span>
                </th>
                <th
                  onClick={() => handleSort('criticalityScore')}
                  className="py-2.5 px-2.5 text-right cursor-pointer hover:text-[#17202A] select-none"
                >
                  <span>Criticality {sortField === 'criticalityScore' && (sortAsc ? '↑' : '↓')}</span>
                </th>
                <th
                  onClick={() => handleSort('priorityRiskScore')}
                  className="py-2.5 px-2.5 text-right cursor-pointer hover:text-[#17202A] select-none"
                >
                  <span className="font-bold text-[#123B5D]">Priority Index {sortField === 'priorityRiskScore' && (sortAsc ? '↑' : '↓')}</span>
                </th>
                <th className="py-2.5 px-2.5">Status</th>
                <th className="py-2.5 px-3">Protective Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5]">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#7B8794] text-xs">
                    No critical assets match the specified filters.
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSearchFilter('');
                          setSelectedCategory('ALL');
                          setSelectedRisk('ALL');
                        }}
                        className="px-2.5 py-1 rounded bg-[#F0F2F5] hover:bg-[#EAEFF5] text-[#17202A] text-xs font-medium"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssets.map(asset => (
                  <tr
                    key={asset.id}
                    onClick={() => {
                      setSelectedAsset(asset);
                      const parentZone = zones.find(z => z.code === asset.zoneCode);
                      if (parentZone) setSelectedZone(parentZone);
                      setActivePage('LIVE_MAP');
                    }}
                    className="hover:bg-[#F7F8FA] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-[#17202A] block">
                        {asset.name}
                      </span>
                      <span className="text-[11px] text-[#7B8794] block">
                        {asset.type} · Coast: {asset.distanceToCoastlineKm} km
                      </span>
                    </td>

                    <td className="py-2.5 px-2.5 font-mono font-semibold text-[#123B5D]">
                      {asset.zoneCode}
                    </td>

                    <td className="py-2.5 px-2.5 text-right font-mono text-[#17202A] tabular-nums">
                      {asset.hazardScore}
                    </td>

                    <td className="py-2.5 px-2.5 text-right font-mono text-[#5E6B78] tabular-nums">
                      {asset.elevationM} m
                    </td>

                    <td className="py-2.5 px-2.5 text-right font-mono font-semibold text-[#C63C3C] tabular-nums">
                      {asset.criticalityScore}
                    </td>

                    <td className="py-2.5 px-2.5 text-right font-mono font-bold text-[#123B5D] text-sm tabular-nums">
                      {asset.priorityRiskScore}
                    </td>

                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <RiskBadge level={asset.status} size="sm" />
                    </td>

                    <td className="py-2.5 px-3 text-[11px] text-[#5E6B78] max-w-xs truncate">
                      {asset.recommendedAction}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
