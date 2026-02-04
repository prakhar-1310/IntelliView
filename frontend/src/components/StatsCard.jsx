import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6">
      {/* Active Count */}
      <div className="bg-white border border-[#451a21]/10 hover:border-[#451a21]/30 transition-all shadow-sm hover:shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="size-12 bg-[#451a21]/5 rounded-full flex items-center justify-center">
            <UsersIcon className="size-6 text-[#451a21]" />
          </div>
          <div className="px-3 py-1 bg-[#d4af37] text-white text-[9px] font-bold tracking-wider uppercase rounded">Live</div>
        </div>
        <div className="text-5xl font-serif font-light text-[#451a21] mb-1">{activeSessionsCount}</div>
        <div className="text-sm text-black/50 font-light tracking-wide">Active Sessions</div>
      </div>

      {/* Recent Count */}
      <div className="bg-white border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all shadow-sm hover:shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="size-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center">
            <TrophyIcon className="size-6 text-[#d4af37]" />
          </div>
        </div>
        <div className="text-5xl font-serif font-light text-[#451a21] mb-1">{recentSessionsCount}</div>
        <div className="text-sm text-black/50 font-light tracking-wide">Total Sessions</div>
      </div>
    </div>
  );
}

export default StatsCards;
