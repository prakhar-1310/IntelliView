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
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Join Session</h3>
          <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost">
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm opacity-70">Enter the session password to join:</p>
          <p className="font-semibold">{sessionTitle}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Session Password</span>
            </label>
            <div className="relative">
              <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 opacity-50" />
              <input
                type="text"
                placeholder="Enter 6-digit password"
                className="input input-bordered w-full pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={6}
                required
              />
            </div>
          </div>

          <div className="modal-action">
            <button type="button" onClick={handleClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
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