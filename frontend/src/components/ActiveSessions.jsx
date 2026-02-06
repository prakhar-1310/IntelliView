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
import JoinByCodeModal from "./JoinByCodeModal";
import { useJoinSessionByCode } from "../hooks/useSessions";

function ActiveSessions({ count, isLoading, isUserInSession }) {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const joinByCodeMutation = useJoinSessionByCode();
  const [joinError, setJoinError] = useState("");

  const handleJoinByCode = (code) => {
    setJoinError("");
    joinByCodeMutation.mutate(
      { code },
      {
        onSuccess: (data) => {
          setShowCodeModal(false);
          window.location.href = `/session/${data.session._id}`;
        },
        onError: (error) => {
          setJoinError(error.response?.data?.message || "Failed to join session");
        }
      }
    );
  };

  return (
    <>
      <div className="lg:col-span-2 bg-white border border-primary/10 hover:border-primary/20 transition-all shadow-sm h-full p-6">
        <div>
          {/* HEADERS SECTION */}
          <div className="flex items-center justify-between mb-6">
            {/* TITLE AND ICON */}
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary rounded-full flex items-center justify-center">
                <ZapIcon className="size-5 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-light text-primary tracking-tight">Live Sessions</h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="size-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-secondary">{isLoading ? "-" : count} active</span>
            </div>
          </div>

          {/* SESSION STATS AND JOIN SECTION */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoaderIcon className="size-10 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="bg-[#fdfcfb] border border-black/10 rounded-lg p-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="relative size-20 bg-linear-to-br from-primary to-[#6b2d3e] rounded-full flex items-center justify-center">
                        <UsersIcon className="size-10 text-white" />
                        <div className="absolute -bottom-2 -right-2 bg-secondary text-primary font-bold rounded-full size-8 flex items-center justify-center text-lg">
                          {count}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-2">There are currently <span className="font-bold text-lg text-primary">{count}</span> active coding sessions</p>
                      <p className="text-xs text-gray-500">Join by entering a session code shared by the creator</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowCodeModal(true)}
                  className="w-full bg-linear-to-r from-primary to-[#6b2d3e] text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Code2Icon className="size-5" />
                  Join Session by Code
                </button>

                <div className="text-xs text-gray-500 text-center p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p>💡 <strong>Pro Tip:</strong> Ask the session creator for their unique 8-character session code to join directly!</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <JoinByCodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        onJoin={handleJoinByCode}
        isJoining={joinByCodeMutation.isPending}
        error={joinError}
      />
    </>
  );
}

export default ActiveSessions;
