import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { isAdmin } from "../lib/admin";
import Navbar from "../components/Navbar";
import { useAdminActiveSessions, useAdminCancelSession } from "../hooks/useSessions";
import {
  ShieldAlertIcon,
  RadioIcon,
  UsersIcon,
  SearchIcon,
  XCircleIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  RefreshCwIcon,
  ClockIcon,
  LayersIcon,
  FlameIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function AdminSessionsPage() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedSessionToCancel, setSelectedSessionToCancel] = useState(null);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  const { data, isLoading, isRefetching, refetch } = useAdminActiveSessions();
  const cancelSessionMutation = useAdminCancelSession();

  // Protect admin route on client side
  useEffect(() => {
    if (isLoaded && user && !isAdmin(user)) {
      navigate("/dashboard");
    }
  }, [isLoaded, user, navigate]);

  if (!isLoaded || (user && !isAdmin(user))) {
    return null;
  }

  const sessions = data?.sessions || [];
  const activeCount = data?.count || 0;

  // Calculate statistics
  const totalParticipants = sessions.reduce((acc, sess) => {
    let count = 1; // Host
    if (sess.participant) count += 1;
    return acc + count;
  }, 0);

  const easyCount = sessions.filter((s) => s.difficulty?.toLowerCase() === "easy").length;
  const mediumCount = sessions.filter((s) => s.difficulty?.toLowerCase() === "medium").length;
  const hardCount = sessions.filter((s) => s.difficulty?.toLowerCase() === "hard").length;

  // Filter sessions
  const filteredSessions = sessions.filter((sess) => {
    const matchesSearch =
      sess.sessionCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.problem?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.host?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.host?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.participant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.participant?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === "all" || sess.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleConfirmCancel = () => {
    if (!selectedSessionToCancel) return;

    cancelSessionMutation.mutate(selectedSessionToCancel._id, {
      onSuccess: () => {
        setSelectedSessionToCancel(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER & ADMIN TITLE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-[#451a21] via-[#2d1116] to-[#451a21] p-6 rounded-2xl text-white shadow-xl border border-[#d4af37]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="size-12 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-xl flex items-center justify-center text-[#d4af37]">
              <ShieldAlertIcon className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#d4af37] text-[#451a21]">
                  Admin Control Panel
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Monitoring
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black font-serif tracking-tight mt-1">
                Active Running Sessions
              </h1>
              <p className="text-white/60 text-xs mt-0.5">
                Monitor and manage all live interview rooms across the platform in real time.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 border border-white/10 backdrop-blur-md disabled:opacity-50"
            >
              <RefreshCwIcon className={`size-4 ${isRefetching ? "animate-spin text-[#d4af37]" : ""}`} />
              Refresh Feed
            </button>
          </div>
        </div>

        {/* STATS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Active Sessions */}
          <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-black/50 tracking-wider uppercase">Active Rooms</p>
              <h3 className="text-3xl font-black text-[#451a21] mt-1 font-serif">{activeCount}</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <RadioIcon className="size-3 animate-pulse" /> Live Now
              </p>
            </div>
            <div className="size-12 rounded-xl bg-[#451a21]/5 border border-[#451a21]/10 flex items-center justify-center text-[#451a21]">
              <FlameIcon className="size-6" />
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-black/50 tracking-wider uppercase">Connected Users</p>
              <h3 className="text-3xl font-black text-[#451a21] mt-1 font-serif">{totalParticipants}</h3>
              <p className="text-xs text-black/40 font-medium mt-1">Hosts & Participants</p>
            </div>
            <div className="size-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <UsersIcon className="size-6" />
            </div>
          </div>

          {/* Easy / Medium */}
          <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-black/50 tracking-wider uppercase">Difficulty Breakdown</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md">
                  Easy: {easyCount}
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-md">
                  Med: {mediumCount}
                </span>
              </div>
              <p className="text-[11px] text-black/40 mt-1">Hard: {hardCount}</p>
            </div>
            <div className="size-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <LayersIcon className="size-6" />
            </div>
          </div>

          {/* Status */}
          <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-black/50 tracking-wider uppercase">Server Sync</p>
              <h3 className="text-lg font-bold text-emerald-600 mt-1">Stream Connected</h3>
              <p className="text-xs text-black/40 mt-0.5">Polling every 5 sec</p>
            </div>
            <div className="size-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <RadioIcon className="size-6" />
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH & DIFFICULTY FILTER */}
        <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-black/40" />
            <input
              type="text"
              placeholder="Search code, problem, host or participant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-black/10 rounded-xl text-xs text-gray-900 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#451a21]/20 transition-all"
            />
          </div>

          {/* DIFFICULTY FILTER TABS */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
            {["all", "easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 ${
                  difficultyFilter === diff
                    ? "bg-[#451a21] text-white shadow-sm"
                    : "bg-gray-100 text-black/60 hover:bg-gray-200"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* SESSIONS LIST / GRID */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-black/5 p-12 text-center shadow-sm">
            <RefreshCwIcon className="size-8 animate-spin mx-auto text-[#451a21] mb-3" />
            <p className="text-sm font-semibold text-gray-700">Loading running sessions...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-12 text-center shadow-sm">
            <div className="size-16 bg-[#451a21]/5 text-[#451a21] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#451a21]/10">
              <RadioIcon className="size-8 text-black/30" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Running Sessions Found</h3>
            <p className="text-xs text-black/50 max-w-sm mx-auto mt-1">
              {searchQuery || difficultyFilter !== "all"
                ? "No sessions match your search filters."
                : "There are currently no active interview sessions running on the platform."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((sess) => (
              <div
                key={sess._id}
                className="bg-white rounded-2xl border border-black/10 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* CARD HEADER */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-wider text-white ${
                          sess.difficulty?.toLowerCase() === "easy"
                            ? "bg-emerald-600"
                            : sess.difficulty?.toLowerCase() === "medium"
                            ? "bg-amber-600"
                            : "bg-rose-600"
                        }`}
                      >
                        {sess.difficulty}
                      </span>

                      <button
                        onClick={() => handleCopyCode(sess.sessionCode, sess._id)}
                        className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-mono font-bold rounded flex items-center gap-1 transition-colors"
                        title="Click to copy room code"
                      >
                        {sess.sessionCode}
                        {copiedCodeId === sess._id ? (
                          <CheckIcon className="size-3 text-emerald-600" />
                        ) : (
                          <CopyIcon className="size-3 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                      <ClockIcon className="size-3" />
                      {formatDistanceToNow(new Date(sess.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 line-clamp-1">{sess.problem}</h3>
                </div>

                {/* HOST & PARTICIPANT SECTION */}
                <div className="p-5 bg-gray-50/50 space-y-3">
                  {/* Host */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={sess.host?.profileImage || "https://avatar.iran.liara.run/public"}
                        alt={sess.host?.name || "Host"}
                        className="size-9 rounded-full border border-gray-200 object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900">{sess.host?.name || "Unknown Host"}</span>
                          <span className="px-1.5 py-0.2 bg-[#451a21] text-white text-[8px] font-bold uppercase rounded">
                            Host
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono">{sess.host?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Participant */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                    {sess.participant ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={sess.participant?.profileImage || "https://avatar.iran.liara.run/public"}
                          alt={sess.participant?.name || "Candidate"}
                          className="size-9 rounded-full border border-gray-200 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-900">{sess.participant?.name}</span>
                            <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[8px] font-bold uppercase rounded">
                              Candidate
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-mono">{sess.participant?.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-1 text-gray-400 text-xs">
                        <div className="size-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-300">
                          <UsersIcon className="size-4" />
                        </div>
                        <span className="italic text-[11px]">Waiting for candidate to join...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CARD ACTIONS */}
                <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/session/${sess._id}`)}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    <ExternalLinkIcon className="size-3.5" />
                    Observe Session
                  </button>

                  <button
                    onClick={() => setSelectedSessionToCancel(sess)}
                    className="py-2 px-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                  >
                    <XCircleIcon className="size-3.5" />
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CONFIRM CANCELLATION MODAL */}
      {selectedSessionToCancel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="size-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4 mx-auto">
              <ShieldAlertIcon className="size-6" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center">Cancel Live Session?</h3>
            <p className="text-xs text-gray-500 text-center mt-1">
              Are you sure you want to terminate this live running session? All connected participants will be disconnected immediately.
            </p>

            {/* SESSION SUMMARY BOX */}
            <div className="my-5 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Problem:</span>
                <span className="font-bold text-gray-900">{selectedSessionToCancel.problem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Room Code:</span>
                <span className="font-mono font-bold text-[#451a21]">{selectedSessionToCancel.sessionCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Host:</span>
                <span className="font-medium text-gray-900">{selectedSessionToCancel.host?.name} ({selectedSessionToCancel.host?.email})</span>
              </div>
              {selectedSessionToCancel.participant && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Candidate:</span>
                  <span className="font-medium text-gray-900">{selectedSessionToCancel.participant?.name}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSessionToCancel(null)}
                disabled={cancelSessionMutation.isPending}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all disabled:opacity-50"
              >
                Keep Session Active
              </button>

              <button
                onClick={handleConfirmCancel}
                disabled={cancelSessionMutation.isPending}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {cancelSessionMutation.isPending ? (
                  <>
                    <RefreshCwIcon className="size-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircleIcon className="size-4" />
                    Confirm Cancel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSessionsPage;
