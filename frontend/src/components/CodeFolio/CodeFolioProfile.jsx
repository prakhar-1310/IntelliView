import { MapPin, GraduationCap, ExternalLink, Mail, Twitter, Github as GithubIcon, Linkedin } from "lucide-react";
import { SiLeetcode, SiCodeforces } from "react-icons/si";
import { useState } from "react";

function CodeFolioProfile({ user, usernames, stats, onOpenCard }) {
  const [isProblemSolvingOpen, setIsProblemSolvingOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-20 bg-linear-to-r from-primary to-secondary"></div>
        <div className="absolute -bottom-12 left-6">
          <img
            src={user?.imageUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-16 px-6 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-neutral">
            {user?.firstName} {user?.lastName}
          </h2>
          <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
        <p className="text-sm text-neutral/60 mb-4">@{user?.username || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || "user"}</p>

        {/* Get CodeFolio Card Button */}
        <button 
          onClick={onOpenCard}
          className="w-full py-3 bg-warning text-white font-bold rounded-lg hover:bg-warning/90 transition-colors mb-4"
        >
          Get your CodeFolio Card
        </button>

        {/* Location & University */}
        <div className="space-y-2 mb-6">
          {usernames?.location && (
            <div className="flex items-center gap-2 text-sm text-neutral/60">
              <MapPin className="w-4 h-4" />
              <span>{usernames.location}</span>
            </div>
          )}
          {usernames?.university && (
            <div className="flex items-center gap-2 text-sm text-neutral/60">
              <GraduationCap className="w-4 h-4" />
              <span>{usernames.university}</span>
            </div>
          )}
        </div>

        {/* About Section */}
        {usernames?.about && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-neutral">About</h3>
            </div>
            <p className="text-sm text-neutral/70">{usernames.about}</p>
          </div>
        )}

        {/* Problem Solving Stats */}
        {(usernames?.leetcode || usernames?.codeforces || usernames?.codechef) && (
          <div className="mb-6">
            <button 
              onClick={() => setIsProblemSolvingOpen(!isProblemSolvingOpen)}
              className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-semibold text-neutral">Problem Solving Stats</span>
              <span className={`text-neutral/60 transition-transform ${isProblemSolvingOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isProblemSolvingOpen && (
              <div className="mt-2 space-y-2">
              {usernames?.leetcode && (
                <div className="flex items-center gap-3 p-2">
                  <div className="w-6 h-6 bg-orange-500/10 rounded flex items-center justify-center">
                    <SiLeetcode className="text-orange-500 text-sm" />
                  </div>
                  <span className="text-sm text-neutral flex-1">LeetCode</span>
                  <span className="text-xs text-neutral/60">@{usernames.leetcode}</span>
                  <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
              {usernames?.codeforces && (
                <div className="flex items-center gap-3 p-2">
                  <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center">
                    <SiCodeforces className="text-blue-500 text-sm" />
                  </div>
                  <span className="text-sm text-neutral flex-1">CodeForces</span>
                  <span className="text-xs text-neutral/60">@{usernames.codeforces}</span>
                  <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
              {usernames?.codechef && (
                <div className="flex items-center gap-3 p-2">
                  <div className="w-6 h-6 bg-purple-500/10 rounded flex items-center justify-center">
                    <span className="text-purple-500 text-sm font-bold">CC</span>
                  </div>
                  <span className="text-sm text-neutral flex-1">CodeChef</span>
                  <span className="text-xs text-neutral/60">@{usernames.codechef}</span>
                  <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeFolioProfile;
