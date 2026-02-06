import { useState } from "react";
import { Code2Icon, XIcon } from "lucide-react";

function JoinByCodeModal({ isOpen, onClose, onJoin, isJoining, error }) {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim().length === 8) {
      onJoin(code.toUpperCase());
    }
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20" onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Join Session by Code</h3>
          <button onClick={handleClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm opacity-70">Enter the 8-character session code provided by the session creator:</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 text-red-600 text-sm font-medium bg-red-100 border border-red-200 rounded p-2">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral mb-2">
              Session Code
            </label>
            <div className="relative">
              <Code2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 opacity-50" />
              <input
                type="text"
                placeholder="e.g., ABC12XYZ"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase font-mono font-bold text-center tracking-widest"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={8}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Must be exactly 8 characters</p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isJoining || code.trim().length !== 8}
            >
              {isJoining ? "Joining..." : "Join Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinByCodeModal;
