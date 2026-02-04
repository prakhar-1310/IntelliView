import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import { TrendingUp, Settings, Calendar, Activity } from "lucide-react";
import CodeFolioStats from "../components/CodeFolio/CodeFolioStats";
import CodeFolioProblems from "../components/CodeFolio/CodeFolioProblems";
import CodeFolioContests from "../components/CodeFolio/CodeFolioContests";
import CompetitiveProgramming from "../components/CodeFolio/CompetitiveProgramming";
import ContestRankings from "../components/CodeFolio/ContestRankings";
import UsernameSetupModal from "../components/CodeFolio/UsernameSetupModal";
import CodeFolioProfile from "../components/CodeFolio/CodeFolioProfile";
import CodeFolioCard from "../components/CodeFolio/CodeFolioCard";
import { getLeetCodeStats, getCodeForcesStats, fetchCodeFolioUsernames, saveCodeFolioUsernames } from "../api/codefolio";
import toast from "react-hot-toast";

const CACHE_KEYS = {
  usernames: 'codefolio_usernames_cache',
  profileData: 'codefolio_profiledata_cache',
  platformStatus: 'codefolio_platformstatus_cache',
  userId: 'codefolio_user_id_cache'
};

function CodeFolioPage() {
  const { user } = useUser();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [usernames, setUsernames] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [platformStatus, setPlatformStatus] = useState({
    leetcode: false,
    codeforces: false,
  });

  useEffect(() => {
    const loadUsernames = async () => {
      setLoading(true);
      
      // Check if cache exists and belongs to current user
      const cachedUserId = sessionStorage.getItem(CACHE_KEYS.userId);
      const cachedUsernames = sessionStorage.getItem(CACHE_KEYS.usernames);
      const cachedProfileData = sessionStorage.getItem(CACHE_KEYS.profileData);
      const cachedPlatformStatus = sessionStorage.getItem(CACHE_KEYS.platformStatus);
      
      // If user changed (logged out and logged back in), clear cache
      if (cachedUserId && cachedUserId !== user?.id) {
        sessionStorage.removeItem(CACHE_KEYS.usernames);
        sessionStorage.removeItem(CACHE_KEYS.profileData);
        sessionStorage.removeItem(CACHE_KEYS.platformStatus);
        sessionStorage.removeItem(CACHE_KEYS.userId);
      } else if (cachedUsernames && cachedProfileData && cachedUserId === user?.id) {
        // Use cached data
        const parsedUsernames = JSON.parse(cachedUsernames);
        const parsedProfileData = JSON.parse(cachedProfileData);
        const parsedPlatformStatus = cachedPlatformStatus ? JSON.parse(cachedPlatformStatus) : { leetcode: false, codeforces: false };
        setUsernames(parsedUsernames);
        setProfileData(parsedProfileData);
        setPlatformStatus(parsedPlatformStatus);
        setLoading(false);
        return;
      }
      
      try {
        // Try to fetch from backend
        const response = await fetchCodeFolioUsernames();
        if (response && response.success && response.data) {
          setUsernames(response.data);
          // Store usernames in cache
          sessionStorage.setItem(CACHE_KEYS.usernames, JSON.stringify(response.data));
          sessionStorage.setItem(CACHE_KEYS.userId, user?.id);
          fetchProfileData(response.data);
        } else {
          // Fallback to localStorage if backend empty
          const savedUsernames = localStorage.getItem(`codefolio_usernames_${user?.id}`);
          if (savedUsernames) {
            const parsed = JSON.parse(savedUsernames);
            setUsernames(parsed);
            sessionStorage.setItem(CACHE_KEYS.usernames, JSON.stringify(parsed));
            sessionStorage.setItem(CACHE_KEYS.userId, user?.id);
            fetchProfileData(parsed);
          } else {
            setShowSetupModal(true);
            setLoading(false);
          }
        }
      } catch (error) {
        // Fallback to localStorage on error
        const savedUsernames = localStorage.getItem(`codefolio_usernames_${user?.id}`);
        if (savedUsernames) {
          const parsed = JSON.parse(savedUsernames);
          setUsernames(parsed);
          sessionStorage.setItem(CACHE_KEYS.usernames, JSON.stringify(parsed));
          sessionStorage.setItem(CACHE_KEYS.userId, user?.id);
          fetchProfileData(parsed);
        } else {
          setShowSetupModal(true);
          setLoading(false);
        }
      }
    };
    if (user) loadUsernames();
  }, [user]);

  const fetchProfileData = async (usernames) => {
    setLoading(true);
    const mockData = {
      totalQuestions: 0,
      totalActivedays: 0,
      easy: 0,
      medium: 0,
      hard: 0,
      leetcodeRanking: 0,
      leetcodeContests: 0,
      leetcodeRating: 0,
      codeforcesRating: 0,
      codeforcesMaxRating: 0,
      codeforcesRank: "",
      codeforcesContests: 0,
      codeforcesProblems: 0,
      badges: [],
      submissionCalendar: null,
    };
    
    let leetcodeQuestions = 0;
    let codeforcesQuestions = 0;
    let leetcodeActiveDays = 0;
    let codeforcesActiveDays = 0;
    let leetcodeDataFetched = false;
    let codeforcesDataFetched = false;
    
    const newPlatformStatus = {
      leetcode: false,
      codeforces: false,
    };
    
    try {
      // Fetch LeetCode data
      if (usernames.leetcode) {
        try {
          toast.loading('Fetching LeetCode data...', { id: 'leetcode-fetch' });
          const leetcodeResponse = await getLeetCodeStats(usernames.leetcode);
          if (leetcodeResponse.success && leetcodeResponse.data) {
            const lcData = leetcodeResponse.data;
            
            console.log('LeetCode Response Data:', lcData);
            
            // Parse LeetCode data structure
            leetcodeQuestions = lcData.totalQuestions || 0;
            leetcodeActiveDays = lcData.activeDays || 0;
            mockData.easy = lcData.easy || 0;
            mockData.medium = lcData.medium || 0;
            mockData.hard = lcData.hard || 0;
            mockData.leetcodeRanking = lcData.contestRanking || lcData.ranking || 0;
            mockData.leetcodeRating = lcData.contestRating || 0;
            mockData.leetcodeContests = lcData.contestsAttended || 0;
            mockData.leetcodeProblems = leetcodeQuestions;
            mockData.badges = Array.isArray(lcData.badges) ? lcData.badges : [];
            mockData.submissionCalendar = lcData.submissionCalendar || null;
            leetcodeDataFetched = true;
            newPlatformStatus.leetcode = true;
            
            toast.success('LeetCode data loaded', { id: 'leetcode-fetch' });
            
            console.log('Mapped LeetCode Data:', {
              rating: mockData.leetcodeRating,
              ranking: mockData.leetcodeRanking,
              contests: mockData.leetcodeContests,
              badgesCount: mockData.badges.length,
              questions: leetcodeQuestions,
              activeDays: leetcodeActiveDays
            });
          } else {
            const errorMsg = leetcodeResponse.message || "Could not fetch LeetCode data";
            toast.error(errorMsg, { id: 'leetcode-fetch' });
            console.log("LeetCode API Response:", leetcodeResponse);
            newPlatformStatus.leetcode = false;
          }
        } catch (error) {
          console.error("Error fetching LeetCode data:", error);
          toast.error("Error connecting to LeetCode API", { id: 'leetcode-fetch' });
          newPlatformStatus.leetcode = false;
        }
      }
      
      // Fetch CodeForces data
      if (usernames.codeforces) {
        try {
          toast.loading('Fetching CodeForces data...', { id: 'codeforces-fetch' });
          const cfResponse = await getCodeForcesStats(usernames.codeforces);
          if (cfResponse.success && cfResponse.data) {
            codeforcesQuestions = cfResponse.data.problemsSolved || 0;
            codeforcesActiveDays = cfResponse.data.activeDays || 0;
            mockData.codeforcesRating = cfResponse.data.rating || 0;
            mockData.codeforcesMaxRating = cfResponse.data.maxRating || 0;
            mockData.codeforcesRank = cfResponse.data.rank || "";
            mockData.codeforcesProblems = codeforcesQuestions;
            mockData.codeforcesContests = cfResponse.data.contests || 0;
            codeforcesDataFetched = true;
            newPlatformStatus.codeforces = true;
            
            toast.success('CodeForces data loaded', { id: 'codeforces-fetch' });
            
            console.log('Mapped CodeForces Data:', {
              rating: mockData.codeforcesRating,
              rank: mockData.codeforcesRank,
              problemsSolved: codeforcesQuestions,
              activeDays: codeforcesActiveDays
            });
          } else {
            const errorMsg = cfResponse.message || "Could not fetch CodeForces data";
            toast.error(errorMsg, { id: 'codeforces-fetch' });
            console.log("CodeForces API Response:", cfResponse);
            newPlatformStatus.codeforces = false;
          }
        } catch (error) {
          console.error("Error fetching CodeForces data:", error);
          toast.error("Error connecting to CodeForces API", { id: 'codeforces-fetch' });
          newPlatformStatus.codeforces = false;
        }
      }
      
      if (usernames.codechef) {
        toast("CodeChef integration coming soon!", { icon: 'ℹ️' });
      }
      
      // Calculate total questions and active days from all platforms
      mockData.totalQuestions = leetcodeQuestions + codeforcesQuestions;
      mockData.totalActivedays = leetcodeActiveDays + codeforcesActiveDays;
      
      console.log('Total Aggregation:', {
        leetcodeQuestions,
        codeforcesQuestions,
        totalQuestions: mockData.totalQuestions,
        leetcodeActiveDays,
        codeforcesActiveDays,
        totalActiveDays: mockData.totalActivedays
      });
      
      // Only set profile data if at least one platform was successfully fetched
      if (!leetcodeDataFetched && !codeforcesDataFetched) {
        setProfileData(null);
        setPlatformStatus(newPlatformStatus);
      } else {
        setProfileData(mockData);
        setPlatformStatus(newPlatformStatus);
        // Cache the profile data and platform status for this session
        sessionStorage.setItem(CACHE_KEYS.profileData, JSON.stringify(mockData));
        sessionStorage.setItem(CACHE_KEYS.platformStatus, JSON.stringify(newPlatformStatus));
      }
      
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Error loading data");
      setProfileData(null);
      setPlatformStatus(newPlatformStatus);
    }
    
    setLoading(false);
  };

  const handleSaveUsernames = async (newUsernames) => {
    try {
      // Clear cached profile data and platform status since usernames changed
      sessionStorage.removeItem(CACHE_KEYS.profileData);
      sessionStorage.removeItem(CACHE_KEYS.platformStatus);
      
      // Save to backend
      const response = await saveCodeFolioUsernames(newUsernames);
      if (response && response.success) {
        setUsernames(newUsernames);
        // Update usernames cache
        sessionStorage.setItem(CACHE_KEYS.usernames, JSON.stringify(newUsernames));
        fetchProfileData(newUsernames);
        toast.success("Usernames saved to database!");
      } else {
        toast.error("Failed to save to database, saving locally.");
        localStorage.setItem(`codefolio_usernames_${user?.id}`, JSON.stringify(newUsernames));
        setUsernames(newUsernames);
        sessionStorage.setItem(CACHE_KEYS.usernames, JSON.stringify(newUsernames));
        fetchProfileData(newUsernames);
      }
    } catch (error) {
      toast.error("Error saving to database, saving locally.");
      localStorage.setItem(`codefolio_usernames_${user?.id}`, JSON.stringify(newUsernames));
      setUsernames(newUsernames);
      sessionStorage.setItem(CACHE_KEYS.usernames, JSON.stringify(newUsernames));
      fetchProfileData(newUsernames);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <div className="text-center">
            <p className="text-lg font-semibold text-neutral">Loading CodeFolio...</p>
            <p className="text-sm text-neutral/60 mt-2">Fetching your coding statistics</p>
          </div>
        </div>
      </div>
    );
  }

  if (!usernames || !profileData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-6 bg-primary/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-neutral font-serif mb-4">
              {!usernames ? "Welcome to CodeFolio" : "Unable to Load Data"}
            </h1>
            <p className="text-neutral/60 mb-8">
              {!usernames 
                ? "Setup your coding platform usernames to start tracking your progress across LeetCode, CodeForces, and CodeChef."
                : "We couldn't fetch your data from the coding platforms. Please check your usernames or try again later."}
            </p>
            <button
              onClick={() => setShowSetupModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {!usernames ? "Setup Usernames" : "Update Settings"}
            </button>
          </div>
        </div>
        <UsernameSetupModal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          onSave={handleSaveUsernames}
          existingUsernames={usernames}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile */}
          <div className="lg:col-span-1">
            <CodeFolioProfile 
              user={user} 
              usernames={usernames} 
              stats={profileData}
              onOpenCard={() => setShowCard(true)}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-neutral font-serif">
                    CodeFolio
                  </h1>
                  <p className="text-neutral/60 mt-1">
                    Your unified coding progress dashboard
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSetupModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="font-semibold text-sm">Settings</span>
              </button>
            </div>

            {/* Main Grid Layout - matching reference image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Total Questions & Active Days */}
                {platformStatus.leetcode && profileData && (
                  <CodeFolioStats stats={profileData} />
                )}
                
                {/* Problems Solved */}
                {platformStatus.leetcode && profileData && (
                  <CodeFolioProblems stats={profileData} />
                )}
                
                {/* Competitive Programming */}
                {platformStatus.codeforces && profileData && (
                  <CompetitiveProgramming codeforcesProblems={profileData.codeforcesProblems} />
                )}
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* Total Contests with awards */}
                {(platformStatus.leetcode || platformStatus.codeforces) && profileData && (
                  <CodeFolioContests
                    contests={profileData.leetcodeContests}
                    ranking={profileData.leetcodeRating}
                    codeforcesRating={profileData.codeforcesRating}
                    codeforcesRank={profileData.codeforcesRank}
                    leetcodeContests={profileData.leetcodeContests}
                    codeforcesContests={profileData.codeforcesContests}
                    badges={profileData.badges}
                    hasLeetCode={platformStatus.leetcode}
                    hasCodeForces={platformStatus.codeforces}
                  />
                )}
                
                {/* Contest Rankings */}
                {(platformStatus.leetcode || platformStatus.codeforces) && profileData && (
                  <ContestRankings
                    leetcodeRating={profileData.leetcodeRating}
                    leetcodeMaxRating={profileData.leetcodeRating}
                    codeforcesRating={profileData.codeforcesRating}
                    codeforcesMaxRating={profileData.codeforcesMaxRating}
                    codeforcesRank={profileData.codeforcesRank}
                    hasLeetCode={platformStatus.leetcode}
                    hasCodeForces={platformStatus.codeforces}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UsernameSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSave={handleSaveUsernames}
        existingUsernames={usernames}
      />

      <CodeFolioCard
        isOpen={showCard}
        onClose={() => setShowCard(false)}
        user={user}
        usernames={usernames}
        stats={profileData}
      />
    </div>
  );
}

export default CodeFolioPage;
