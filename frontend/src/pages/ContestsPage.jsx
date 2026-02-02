import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ExternalLinkIcon, CalendarIcon, TrophyIcon } from "lucide-react";

function ContestsPage() {
  const [codeforceContests, setCodeforceContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Codeforces contests
  const fetchCodeforcesContests = async () => {
    try {
      const response = await fetch("https://codeforces.com/api/contest.list");
      const data = await response.json();
      if (data.status === "OK") {
        // Filter upcoming contests
        const upcoming = data.result
          .filter((contest) => contest.phase === "BEFORE")
          .slice(0, 15)
          .map((contest) => ({
            id: contest.id,
            name: contest.name,
            startTime: new Date(contest.startTimeSeconds * 1000),
            durationMinutes: contest.durationSeconds / 60,
            link: `https://codeforces.com/contests/${contest.id}`,
            platform: "Codeforces",
          }));
        return upcoming;
      }
    } catch (error) {
      console.error("Codeforces API error:", error);
    }
    return [];
  };

  // Load all contests on mount
  useEffect(() => {
    const loadContests = async () => {
      setLoading(true);
      const codeforces = await fetchCodeforcesContests();
      setCodeforceContests(codeforces);
      setLoading(false);
    };
    loadContests();
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const ContestCard = ({ contest }) => (
    <div className="bg-white border border-black/10 hover:border-[#451a21]/30 transition-all shadow-sm hover:shadow-md p-6">
      <h2 className="text-lg font-serif font-medium text-[#451a21] mb-4">{contest.name}</h2>
      <div className="space-y-2 text-sm text-black/60">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 text-[#d4af37]" />
          <span>{formatDate(contest.startTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <TrophyIcon className="size-4 text-[#d4af37]" />
          <span>Duration: {Math.round(contest.durationMinutes)} minutes</span>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <a
          href={contest.link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-[#451a21] hover:bg-[#d4af37] text-white text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-2"
        >
          View Contest
          <ExternalLinkIcon className="size-4" />
        </a>
      </div>
    </div>
  );

  const ContestSection = ({ title, contests, bgColor }) => (
    <div className="mb-12">
      <h2 className="text-3xl font-serif font-light text-[#451a21] mb-8 flex items-center gap-4">
        <div className="h-[2px] w-12 bg-[#d4af37]"></div>
        {title}
      </h2>
      {contests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-black/5 shadow-sm p-8">
          <p className="text-black/50 text-center font-light">No upcoming contests available</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* HEADER */}
        <div className="mb-12 border-b border-black/5 pb-8">
          <h1 className="text-5xl font-serif font-light text-[#451a21] mb-3 tracking-tight">Upcoming Contests</h1>
          <p className="text-lg text-black/60 font-light">
            Discover and participate in coding contests from top platforms
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="size-16 border-4 border-[#451a21]/20 border-t-[#451a21] rounded-full animate-spin mb-4"></div>
              <p className="text-black/60 font-light">Fetching upcoming contests...</p>
            </div>
          </div>
        ) : codeforceContests.length > 0 ? (
          <ContestSection
            title="Upcoming Codeforces Contests"
            contests={codeforceContests}
            bgColor="text-blue-600"
          />
        ) : (
          <div className="bg-white border border-black/5 shadow-sm p-8">
            <p className="text-black/50 text-center font-light">
              Unable to fetch contests at this moment. Please try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestsPage;
