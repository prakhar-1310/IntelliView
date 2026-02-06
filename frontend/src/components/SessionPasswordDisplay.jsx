import { CopyIcon, KeyIcon, CheckIcon, Code2Icon } from "lucide-react";
import { useState } from "react";
import { getDifficultyBadgeClass } from "../lib/utils";

function SessionPasswordDisplay({ sessions, isLoading }) {
  const [copiedId, setCopiedId] = useState(null);
  const [copiedType, setCopiedType] = useState(null);

  const copyToClipboard = (text, sessionId, type) => {
    navigator.clipboard.writeText(text);
    setCopiedId(sessionId);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedType(null);
    }, 2000);
  };

  if (isLoading || sessions.length === 0) return null;

  return (
    <div className="border-2 border-blue-200 bg-white rounded-lg p-6 hover:border-blue-300 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl">
            <Code2Icon className="size-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">Your Active Sessions</h2>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {sessions.map((session) => (
            <div key={session._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold truncate">{session.problem}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyBadgeClass(session.difficulty)}`}>
                      {session.difficulty}
                    </span>
                  </div>
                </div>

                {/* Session Code Section */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium mb-1">Session Code (Share this):</p>
                      <code className="bg-white border border-blue-200 px-3 py-2 rounded text-lg font-mono font-bold text-blue-600 tracking-widest">
                        {session.sessionCode}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(session.sessionCode, session._id, 'code')}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors ml-2"
                      title="Copy session code"
                    >
                      {copiedId === session._id && copiedType === 'code' ? (
                        <CheckIcon className="size-4 text-success" />
                      ) : (
                        <CopyIcon className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Section */}
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium mb-1">Legacy Password (for old sessions):</p>
                      <code className="bg-white border border-orange-200 px-3 py-2 rounded text-sm font-mono font-bold">
                        {session.password}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(session.password, session._id, 'password')}
                      className="p-2 hover:bg-orange-100 rounded-lg transition-colors ml-2"
                      title="Copy password"
                    >
                      {copiedId === session._id && copiedType === 'password' ? (
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
  );
}

export default SessionPasswordDisplay;
