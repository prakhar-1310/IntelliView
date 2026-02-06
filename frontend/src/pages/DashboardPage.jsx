import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyActiveSessions, useMyRecentSessions } from "../hooks/useSessions";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCard";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionsModal";
import OngoingSession from "../components/OngoingSession";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: myActiveSessionsData, isLoading: loadingMyActiveSessions } = useMyActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const activeSessionsCount = activeSessionsData?.count || 0;
  const myActiveSessions = myActiveSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  
  // Get the ongoing session (first active session hosted by current user)
  const ongoingSession = myActiveSessions.length > 0 ? myActiveSessions[0] : null;
  
  const hasActiveSession = myActiveSessions.length > 0;

  const isUserInSession = (session) => {
    if (!user.id) return false;

    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  const handleRejoinSession = () => {
    if (ongoingSession) {
      navigate(`/session/${ongoingSession._id}`);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#fdfcfb]">
        <Navbar />
        <WelcomeSection 
          onCreateSession={() => setShowCreateModal(true)} 
          hasActiveSession={hasActiveSession}
        />

        {/* Grid layout */}
        <div className="container mx-auto px-6 pb-16">
          {/* Ongoing Session for Host */}
          {ongoingSession && (
            <OngoingSession 
              session={ongoingSession}
              onRejoin={handleRejoinSession}
              isLoading={false}
            />
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessionsCount}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              count={activeSessionsCount}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;
