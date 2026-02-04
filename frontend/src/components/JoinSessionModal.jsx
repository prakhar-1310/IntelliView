import { useState } from "react";
import { KeyIcon, XIcon } from "lucide-react";

function JoinSessionModal({ isOpen, onClose, onJoin, isJoining, sessionTitle }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      onJoin(password);
    }
  };

  const handleClose = () => {
    setPassword("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20" onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Join Session</h3>
          <button onClick={handleClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm opacity-70">Enter the session password to join:</p>
          <p className="font-semibold">{sessionTitle}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral mb-2">
              Session Password
            </label>
            <div className="relative">
              <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 opacity-50" />
              <input
                type="text"
                placeholder="Enter 6-digit password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={6}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isJoining || !password.trim()}
            >
              {isJoining ? "Joining..." : "Join Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinSessionModal;
