import { Trophy, TrendingUp } from "lucide-react";
import { SiLeetcode, SiCodeforces } from "react-icons/si";

function CodeFolioContests({ contests, ranking, codeforcesRating, codeforcesRank, leetcodeContests, codeforcesContests, badges, hasLeetCode, hasCodeForces }) {
  // Only sum contests from platforms that were successfully fetched
  const totalContests = (hasLeetCode ? leetcodeContests : 0) + (hasCodeForces ? codeforcesContests : 0);
  
  // Filter and prepare badges for display
  const allBadges = Array.isArray(badges) ? badges : [];
  const displayBadges = allBadges.slice(0, 4);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-base-300 space-y-6">
      {/* Total Contests */}
      <div>
        <p className="text-base text-neutral/60 mb-2 font-medium">Total Contests</p>
        <p className="text-6xl font-bold text-neutral mb-6">{totalContests}</p>
        
        {/* Platform breakdown */}
        <div className="space-y-3">
          {hasLeetCode && (
            <div className="flex items-center justify-between py-2 border-l-4 border-orange-500 pl-4">
              <span className="text-sm font-medium text-neutral flex items-center gap-2">
                <SiLeetcode className="text-orange-500 text-lg" />
                LeetCode
              </span>
              <span className="text-xl font-bold text-neutral">{leetcodeContests}</span>
            </div>
          )}
          {hasCodeForces && (
            <div className="flex items-center justify-between py-2 border-l-4 border-blue-500 pl-4">
              <span className="text-sm font-medium text-neutral flex items-center gap-2">
                <SiCodeforces className="text-blue-500 text-lg" />
                CodeForces
              </span>
              <span className="text-xl font-bold text-neutral">{codeforcesContests}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Awards Section */}
      <div className="mt-6">
        <h3 className="text-base font-semibold text-neutral mb-2">Awards</h3>
        <p className="text-sm text-neutral/60 mb-4">{allBadges.length > 0 ? allBadges.length : '0'}</p>
        <div className="flex gap-3 flex-wrap">
          {displayBadges.length > 0 ? (
            displayBadges.map((badge, index) => (
              <div 
                key={badge.id || index} 
                className="relative group"
                title={badge.displayName || badge.name}
              >
                {badge.icon ? (
                  <img 
                    src={badge.icon} 
                    alt={badge.displayName || badge.name}
                    className="w-16 h-16 rounded-lg shadow-lg hover:scale-110 transition-transform object-cover"
                    onError={(e) => {
                      console.error('Failed to load badge:', badge);
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24"%3E🏆%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg">
                    🏆
                  </div>
                )}
                {badge.hoverText && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {badge.hoverText}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-neutral/60">
              No awards earned yet. Keep solving problems to earn badges!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeFolioContests;
