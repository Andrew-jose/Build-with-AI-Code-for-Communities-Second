import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  threatLevel?: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' | 'CRITICAL';
  subtitle?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  change,
  threatLevel,
  subtitle,
  onClick,
  icon,
}) => {
  let indicatorColor = 'bg-[#CBD5E1]';
  let badgeColor = 'text-[#5E6B78]';

  if (threatLevel === 'EXTREME') {
    indicatorColor = 'bg-[#9E2635]';
    badgeColor = 'text-[#9E2635]';
  } else if (threatLevel === 'CRITICAL') {
    indicatorColor = 'bg-[#C63C3C]';
    badgeColor = 'text-[#C63C3C]';
  } else if (threatLevel === 'HIGH') {
    indicatorColor = 'bg-[#C88618]';
    badgeColor = 'text-[#C88618]';
  }

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`relative bg-[#FFFFFF] border border-[#D9DEE5] p-3 rounded transition-colors ${
        onClick ? 'cursor-pointer hover:bg-[#F7F8FA] hover:border-[#CBD5E1]' : ''
      } flex flex-col justify-between shadow-2xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#123B5D]`}
    >
      {/* Top subtle threat indicator line */}
      {threatLevel && (threatLevel === 'CRITICAL' || threatLevel === 'EXTREME' || threatLevel === 'HIGH') && (
        <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t ${indicatorColor}`} />
      )}

      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] font-semibold text-[#5E6B78] uppercase tracking-wider line-clamp-1">
          {title}
        </span>
        {icon && <span className="text-[#7B8794] shrink-0">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1.5 my-0.5">
        <span className="text-xl font-bold font-mono text-[#17202A] tabular-nums tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-xs text-[#5E6B78] font-normal">{unit}</span>}
      </div>

      <div className="flex items-center justify-between mt-1 text-[11px]">
        {subtitle && (
          <span className="text-[#7B8794] truncate max-w-[170px]">
            {subtitle}
          </span>
        )}
        {change && (
          <span className={`font-mono font-medium ml-auto ${badgeColor}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
