import { useState } from "react";
import { X, Save } from "lucide-react";

function UsernameSetupModal({ isOpen, onClose, onSave, existingUsernames }) {
  const [usernames, setUsernames] = useState({
    leetcode: existingUsernames?.leetcode || "",
    codeforces: existingUsernames?.codeforces || "",
    codechef: existingUsernames?.codechef || "",
    location: existingUsernames?.location || "",
    university: existingUsernames?.university || "",
    about: existingUsernames?.about || "",
  });

  const handleSave = () => {
    onSave(usernames);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral font-serif">
            Setup Platform Usernames
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-base-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral/60" />
          </button>
        </div>

        <p className="text-sm text-neutral/60 mb-6">
          Enter your usernames for each coding platform and your profile information to track your progress.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral mb-2">
              LeetCode Username
            </label>
            <input
              type="text"
              value={usernames.leetcode}
              onChange={(e) =>
                setUsernames({ ...usernames, leetcode: e.target.value })
              }
              placeholder="e.g., prakhar-1330"
              className="w-full px-4 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral mb-2">
              CodeForces Username
            </label>
            <input
              type="text"
              value={usernames.codeforces}
              onChange={(e) =>
                setUsernames({ ...usernames, codeforces: e.target.value })
              }
              placeholder="e.g., prakhar"
              className="w-full px-4 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral mb-2">
              CodeChef Username
            </label>
            <input
              type="text"
              value={usernames.codechef}
              onChange={(e) =>
                setUsernames({ ...usernames, codechef: e.target.value })
              }
              placeholder="e.g., prakhar"
              className="w-full px-4 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral mb-2">
              Location
            </label>
            <input
              type="text"
              value={usernames.location}
              onChange={(e) =>
                setUsernames({ ...usernames, location: e.target.value })
              }
              placeholder="e.g., India"
              className="w-full px-4 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral mb-2">
              University
            </label>
            <input
              type="text"
              value={usernames.university}
              onChange={(e) =>
                setUsernames({ ...usernames, university: e.target.value })
              }
              placeholder="e.g., GLA University"
              className="w-full px-4 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral mb-2">
              About
            </label>
            <textarea
              value={usernames.about}
              onChange={(e) =>
                setUsernames({ ...usernames, about: e.target.value })
              }
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full px-4 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-base-200 text-neutral rounded-lg hover:bg-base-300 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UsernameSetupModal;
