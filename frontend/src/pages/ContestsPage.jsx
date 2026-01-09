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
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-300">
      <div className="card-body">
        <h2 className="card-title text-lg mb-2">{contest.name}</h2>
        <div className="space-y-2 text-sm text-base-content/70">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-4" />
            <span>{formatDate(contest.startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrophyIcon className="size-4" />
            <span>Duration: {Math.round(contest.durationMinutes)} minutes</span>
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <a
            href={contest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm gap-2"
          >
            View Contest
            <ExternalLinkIcon className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );

  const ContestSection = ({ title, contests, bgColor }) => (
    <div className="mb-12">
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${bgColor}`}>
        <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
        {title}
      </h2>
      {contests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      ) : (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body text-center">
            <p className="text-base-content/60">No upcoming contests available</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Upcoming Contests</h1>
          <p className="text-base-content/70">
            Discover and participate in coding contests from top platforms
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
              <p className="text-base-content/70">Fetching upcoming contests...</p>
            </div>
          </div>
        ) : codeforceContests.length > 0 ? (
          <ContestSection
            title="Upcoming Codeforces Contests"
            contests={codeforceContests}
            bgColor="text-blue-600"
          />
        ) : (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body text-center">
              <p className="text-base-content/60">
                Unable to fetch contests at this moment. Please try again later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestsPage;
