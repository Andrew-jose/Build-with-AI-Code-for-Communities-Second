import React from 'react';
import { ThreatLevel, AlertSeverity } from '../../types';

interface RiskBadgeProps {
  level: ThreatLevel | AlertSeverity | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'sm', showDot = true }) => {
  const norm = level.toUpperCase();

  let colorClasses = 'text-[#5E6B78] border-[#D9DEE5] bg-[#F0F2F5]';
  let dotColor = 'bg-[#7B8794]';

  if (norm === 'EXTREME') {
    colorClasses = 'text-[#9E2635] border-[#9E2635]/25 bg-[#9E2635]/8';
    dotColor = 'bg-[#9E2635]';
  } else if (norm === 'CRITICAL') {
    colorClasses = 'text-[#C63C3C] border-[#C63C3C]/25 bg-[#C63C3C]/8';
    dotColor = 'bg-[#C63C3C]';
  } else if (norm === 'WARNING' || norm === 'HIGH') {
    colorClasses = 'text-[#C88618] border-[#C88618]/25 bg-[#C88618]/8';
    dotColor = 'bg-[#C88618]';
  } else if (norm === 'WATCH' || norm === 'MODERATE') {
    colorClasses = 'text-[#B45309] border-[#B45309]/20 bg-[#B45309]/8';
    dotColor = 'bg-[#B45309]';
  } else if (norm === 'INFO' || norm === 'LOW' || norm === 'OPERATIONAL' || norm === 'SECURED') {
    colorClasses = 'text-[#2E7D5B] border-[#2E7D5B]/25 bg-[#2E7D5B]/8';
    dotColor = 'bg-[#2E7D5B]';
  }

  const sizeClasses =
    size === 'lg'
      ? 'text-xs px-2 py-0.5'
      : size === 'md'
      ? 'text-[11px] px-1.5 py-0.5'
      : 'text-[10px] px-1.5 py-0.2';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${colorClasses} ${sizeClasses} whitespace-nowrap`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} aria-hidden="true" />}
      <span className="font-semibold tracking-tight">{norm}</span>
    </span>
  );
};
