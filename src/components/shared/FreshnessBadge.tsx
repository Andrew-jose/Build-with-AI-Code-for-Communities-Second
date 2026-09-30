import React from 'react';

interface FreshnessBadgeProps {
  freshness: 'LIVE' | '5 MIN OLD' | '1 HOUR OLD' | 'STALE' | string;
  mode: 'DEMO_SIMULATION' | 'LIVE_FEED' | string;
}

export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({ freshness, mode }) => {
  const isLive = freshness === 'LIVE' && mode === 'LIVE_FEED';

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-[#5E6B78]">
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F0F2F5] border border-[#D9DEE5] text-[#17202A]">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isLive ? 'bg-[#2E7D5B]' : 'bg-[#C88618]'
          }`}
        />
        <span className="text-[11px] font-medium font-mono uppercase">{freshness}</span>
      </span>
      <span className="text-[11px] text-[#7B8794] hidden sm:inline">
        {mode === 'DEMO_SIMULATION' ? 'Simulation Feed' : 'Live Telemetry'}
      </span>
    </div>
  );
};
