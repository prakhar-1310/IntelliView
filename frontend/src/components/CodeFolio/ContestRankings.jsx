import { SiLeetcode, SiCodeforces } from "react-icons/si";

function ContestRankings({ leetcodeRating, leetcodeMaxRating, codeforcesRating, codeforcesMaxRating, codeforcesRank, hasLeetCode, hasCodeForces }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-base-300">
      <h2 className="text-xl font-bold text-neutral mb-6">Contest Rankings</h2>
      
      <div className="space-y-6">
        {/* LeetCode Ranking */}
        {hasLeetCode && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-neutral">LEETCODE</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg shadow-lg flex items-center justify-center">
                <SiLeetcode className="text-white text-4xl" />
              </div>
              <div className="flex-1">
                <div className="text-4xl font-bold text-neutral">
                  {leetcodeRating || 1906}
                </div>
                <div className="text-sm text-neutral/60">
                  (max: {leetcodeMaxRating || 1906})
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* CodeForces Ranking */}
        {hasCodeForces && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-neutral">CODEFORCES</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg shadow-lg flex items-center justify-center">
                <SiCodeforces className="text-white text-4xl" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold text-cyan-500 mb-1">
                  {codeforcesRank || "Specialist"}
                </div>
                <div className="text-4xl font-bold text-neutral">
                  {codeforcesRating || 1543}
                </div>
                <div className="text-sm text-neutral/60">
                  (max: {codeforcesMaxRating || 1543})
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestRankings;
