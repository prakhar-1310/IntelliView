import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { getDifficultyBadgeClass } from "../lib/utils";
import JoinSessionModal from "./JoinSessionModal";
import { useJoinSession } from "../hooks/useSessions";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const joinSessionMutation = useJoinSession();

  const handleJoinClick = (session) => {
    if (isUserInSession(session)) {
      // User is already in session, redirect directly
      window.location.href = `/session/${session._id}`;
    } else {
      // Show password modal
      setSelectedSession(session);
      setShowPasswordModal(true);
    }
  };

  const handleJoinWithPassword = (password) => {
    if (selectedSession) {
      joinSessionMutation.mutate(
        { sessionId: selectedSession._id, password },
        {
          onSuccess: () => {
            setShowPasswordModal(false);
            setSelectedSession(null);
            window.location.href = `/session/${selectedSession._id}`;
          },
        }
      );
    }
  };
  return (
    <div className="lg:col-span-2 bg-white border border-[#451a21]/10 hover:border-[#451a21]/20 transition-all shadow-sm h-full p-6">
      <div>
        {/* HEADERS SECTION */}
        <div className="flex items-center justify-between mb-6">
          {/* TITLE AND ICON */}
          <div className="flex items-center gap-3">
            <div className="size-10 bg-[#451a21] rounded-full flex items-center justify-center">
              <ZapIcon className="size-5 text-white" />
            </div>
            <h2 className="text-2xl font-serif font-light text-[#451a21] tracking-tight">Live Sessions</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 bg-[#d4af37] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#d4af37]">{sessions.length} active</span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderIcon className="size-10 animate-spin text-[#451a21]" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="bg-[#fdfcfb] border border-black/10 hover:border-[#451a21]/30 transition-all"
              >
                <div className="flex items-center justify-between gap-4 p-5">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative size-14 bg-[#451a21] rounded-full flex items-center justify-center">
                      <Code2Icon className="size-7 text-white" />
                      <div className="absolute -top-1 -right-1 size-4 bg-[#d4af37] rounded-full border-2 border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-serif font-medium text-lg truncate text-[#451a21]">{session.problem}</h3>
                        <span
                          className={`px-2 py-1 text-[9px] font-bold tracking-wider uppercase rounded ${getDifficultyBadgeClass(
                            session.difficulty
                          )}`}
                        >
                          {session.difficulty.slice(0, 1).toUpperCase() +
                            session.difficulty.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-black/60">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="size-4 text-[#d4af37]" />
                          <span className="font-medium">{session.host?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="size-4" />
                          <span className="text-xs">{session.participant ? "2/2" : "1/2"}</span>
                        </div>
                        {session.participant && !isUserInSession(session) ? (
                          <span className="px-2 py-1 bg-red-500 text-white text-[9px] font-bold tracking-wider uppercase rounded">FULL</span>
                        ) : (
                          <span className="px-2 py-1 bg-[#d4af37] text-white text-[9px] font-bold tracking-wider uppercase rounded">OPEN</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {session.participant && !isUserInSession(session) ? (
                    <button className="px-6 py-2 bg-black/10 text-black/40 text-[10px] font-bold tracking-wider uppercase cursor-not-allowed">Full</button>
                  ) : (
                    <button 
                      onClick={() => handleJoinClick(session)}
                      className="px-6 py-2 bg-[#451a21] hover:bg-[#d4af37] text-white text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-2"
                    >
                      {isUserInSession(session) ? "Rejoin" : "Join"}
                      <ArrowRightIcon className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="size-20 mx-auto mb-4 bg-[#451a21]/5 rounded-full flex items-center justify-center">
                <SparklesIcon className="size-10 text-[#451a21]/30" />
              </div>
              <p className="text-lg font-serif text-[#451a21] mb-1">No active sessions</p>
              <p className="text-sm text-black/50 font-light">Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>

      <JoinSessionModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setSelectedSession(null);
        }}
        onJoin={handleJoinWithPassword}
        isJoining={joinSessionMutation.isPending}
        sessionTitle={selectedSession?.problem}
      />
    </div>
  );
}
export default ActiveSessions;