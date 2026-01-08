import { CopyIcon, KeyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { getDifficultyBadgeClass } from "../lib/utils";

function SessionPasswordDisplay({ sessions, isLoading }) {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (password, sessionId) => {
    navigator.clipboard.writeText(password);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading || sessions.length === 0) return null;

  return (
    <div className="card bg-base-100 border-2 border-warning/20 hover:border-warning/30">
      <div className="card-body">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-warning to-orange-500 rounded-xl">
            <KeyIcon className="size-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">Your Session Passwords</h2>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {sessions.map((session) => (
            <div key={session._id} className="card bg-base-200 border border-base-300">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{session.problem}</h3>
                      <span className={`badge badge-sm ${getDifficultyBadgeClass(session.difficulty)}`}>
                        {session.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-70">Password:</span>
                      <code className="bg-base-300 px-2 py-1 rounded text-lg font-mono font-bold">
                        {session.password}
                      </code>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(session.password, session._id)}
                    className="btn btn-sm btn-ghost"
                    title="Copy password"
                  >
                    {copiedId === session._id ? (
                      <CheckIcon className="size-4 text-success" />
                    ) : (
                      <CopyIcon className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SessionPasswordDisplay;