import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";
import { useQuery } from "@tanstack/react-query";
import { problemApi } from "../api/problems";
import { useEffect, useState } from "react";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const [allProblems, setAllProblems] = useState([]);
  
  // Fetch problems from database
  const { data: dbProblems } = useQuery({
    queryKey: ["problems"],
    queryFn: problemApi.getProblems,
  });
  
  // Combine static and database problems
  useEffect(() => {
    const staticProblems = Object.values(PROBLEMS);
    const dynamicProblems = dbProblems?.problems || [];
    setAllProblems([...staticProblems, ...dynamicProblems]);
  }, [dbProblems]);
  
  const problems = allProblems;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg p-8 relative max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-lg transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral mb-2">
              <span>Select Problem</span>
              <span className="text-error ml-1">*</span>
            </label>

            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <Code2Icon className="size-5 text-green-600 mb-2" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default CreateSessionModal;
