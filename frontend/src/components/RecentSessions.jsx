import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="bg-white border border-black/10 rounded-lg shadow-sm mt-8">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#451a21] rounded-full">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-serif font-light text-[#451a21]">Your Past Sessions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="size-12 border-4 border-[#451a21]/20 border-t-[#451a21] rounded-full animate-spin"></div>
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="bg-[#f5f5f0] border border-black/10 hover:border-[#451a21]/30 transition-all shadow-sm hover:shadow-md rounded-lg relative p-5"
              >
                {session.status === "active" && (
                  <div className="absolute top-3 right-3">
                    <div className="px-2 py-1 bg-[#22c55e] text-white text-[9px] font-bold tracking-wider uppercase rounded flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#451a21] flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-medium text-base mb-1 truncate text-[#451a21]">{session.problem}</h3>
                      <span
                        className={`px-2 py-1 text-[9px] font-bold tracking-wider uppercase rounded ${
                          session.difficulty?.toLowerCase() === 'easy' ? 'bg-[#22c55e] text-white' :
                          session.difficulty?.toLowerCase() === 'medium' ? 'bg-[#eab308] text-white' :
                          'bg-[#ef4444] text-white'
                        }`}
                      >
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-black/70 font-light mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#451a21]" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#451a21]" />
                      <span>
                        {session.participant ? "2" : "1"} participant
                        {session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-black/10">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#451a21]">Completed</span>
                    <span className="text-xs text-black/40 font-light">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#451a21]/10 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-[#451a21]/50" />
              </div>
              <p className="text-lg font-serif font-medium text-black/70 mb-1">No sessions yet</p>
              <p className="text-sm text-black/50 font-light">Start your coding journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;
