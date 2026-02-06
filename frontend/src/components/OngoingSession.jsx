import { ArrowRightIcon, Code2Icon, UsersIcon, ClockIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function OngoingSession({ session, onRejoin, isLoading }) {
  if (!session) return null;

  const participantCount = session.participant ? 2 : 1;
  const isSessionFull = !!session.participant;

  return (
    <div className="mb-6 border-2 border-green-200 bg-white rounded-lg p-6 hover:border-green-300 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-green-400 to-green-500 rounded-xl">
          <ClockIcon className="size-5 text-white" />
        </div>
        <h2 className="text-xl font-bold">Ongoing Session</h2>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Problem Info */}
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">Problem</p>
            <div className="flex items-center gap-2">
              <Code2Icon className="size-4 text-green-600" />
              <span className="font-semibold text-gray-800">{session.problem}</span>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyBadgeClass(session.difficulty)}`}>
                {session.difficulty}
              </span>
            </div>
          </div>

          {/* Participants Info */}
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">Participants</p>
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-green-600" />
              <span className="font-semibold text-gray-800">
                {participantCount}/2
              </span>
              {isSessionFull && (
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                  Session Full
                </span>
              )}
              {!isSessionFull && (
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  Waiting for Participant
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Session Code Info */}
        <div className="bg-white border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-600 font-medium mb-2">Session Code (Share with others)</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-green-100 border border-green-300 px-3 py-2 rounded font-mono font-bold text-green-700 tracking-widest">
              {session.sessionCode}
            </code>
            <span className="text-xs text-gray-500">Share this code with your session partner</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onRejoin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRightIcon className="size-5" />
          {isLoading ? "Rejoining..." : "Rejoin Session"}
        </button>
      </div>
    </div>
  );
}

export default OngoingSession;
