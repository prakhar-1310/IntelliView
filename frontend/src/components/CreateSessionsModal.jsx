import { Code2Icon, LoaderIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  const [mode, setMode] = useState("select"); // "select" or "generate"
  const [customTopic, setCustomTopic] = useState("");
  const [customDifficulty, setCustomDifficulty] = useState("Easy");
  const [generatedProblem, setGeneratedProblem] = useState(null);

  // Fetch problems from database
  const { data: dbProblems, refetch: refetchProblems } = useQuery({
    queryKey: ["problems"],
    queryFn: problemApi.getProblems,
  });

  const generateMutation = useMutation({
    mutationFn: () => problemApi.generateCustomProblem(customTopic, customDifficulty),
    onSuccess: (data) => {
      setGeneratedProblem(data.problem);
    }
  });

  const saveProblemMutation = useMutation({
    mutationFn: (problem) => problemApi.createProblem(problem),
    onSuccess: (data) => {
      refetchProblems();
      setRoomConfig({
        difficulty: data.problem.difficulty,
        problem: data.problem.title,
      });
    }
  });

  // Combine static and database problems
  useEffect(() => {
    const staticProblems = Object.values(PROBLEMS);
    const dynamicProblems = dbProblems?.problems || [];
    setAllProblems([...staticProblems, ...dynamicProblems]);
  }, [dbProblems]);

  const problems = allProblems;

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!customTopic) return;
    setGeneratedProblem(null);
    generateMutation.mutate();
  };

  const handleUseGenerated = () => {
    if (generatedProblem) {
      saveProblemMutation.mutate(generatedProblem);
    }
  };

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

        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button
            className={`pb-3 px-1 font-medium text-sm transition-colors relative ${mode === "select" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setMode("select")}
          >
            Select Existing
          </button>
          <button
            className={`pb-3 px-1 font-medium text-sm transition-colors relative flex items-center gap-1 ${mode === "generate" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setMode("generate")}
          >
            <SparklesIcon className="size-4" /> Generate Custom
          </button>
        </div>

        <div className="space-y-8 min-h-[200px]">
          {mode === "select" ? (
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
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral">Topic / Concept</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="e.g. Dynamic Programming, Graphs..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral">Difficulty</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    value={customDifficulty}
                    onChange={(e) => setCustomDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <button
                className="w-full py-2 bg-neutral text-white rounded-lg text-sm font-medium hover:bg-neutral/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={handleGenerate}
                disabled={generateMutation.isPending || !customTopic}
              >
                {generateMutation.isPending ? (
                  <><LoaderIcon className="size-4 animate-spin" /> Generating...</>
                ) : (
                  <><SparklesIcon className="size-4" /> Generate Problem</>
                )}
              </button>

              {generatedProblem && (
                <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold text-lg mb-2">{generatedProblem.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {generatedProblem.description.text.replace(/<[^>]*>?/gm, '')}
                  </p>

                  {saveProblemMutation.isPending ? (
                    <div className="flex items-center text-sm text-primary font-medium gap-2">
                      <LoaderIcon className="size-4 animate-spin" /> Saving problem...
                    </div>
                  ) : roomConfig.problem === generatedProblem.title ? (
                    <div className="text-sm text-success font-medium flex items-center gap-2">
                      ✓ Problem selected for session
                    </div>
                  ) : (
                    <button
                      className="px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition"
                      onClick={handleUseGenerated}
                    >
                      Use this Problem
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="border border-green-200 bg-green-50 rounded-lg p-4 mt-6">
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

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
          <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem || saveProblemMutation.isPending}
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