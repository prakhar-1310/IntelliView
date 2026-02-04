import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, EditIcon, TrashIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useUser } from "@clerk/clerk-react";
import { isAdmin } from "../lib/admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { problemApi } from "../api/problems";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";


function ProblemsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [allProblems, setAllProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const queryClient = useQueryClient();
  
  // Fetch problems from database
  const { data: dbProblems } = useQuery({
    queryKey: ["problems"],
    queryFn: problemApi.getProblems,
  });
  
  // Delete problem mutation
  const deleteMutation = useMutation({
    mutationFn: problemApi.deleteProblem,
    onSuccess: () => {
      toast.success("Problem deleted successfully!");
      queryClient.invalidateQueries(["problems"]);
    },
    onError: () => {
      toast.error("Failed to delete problem");
    },
  });
  
  // Combine static problems with database problems
  useEffect(() => {
    const staticProblems = Object.values(PROBLEMS);
    const dynamicProblems = dbProblems?.problems || [];
    const combined = [...staticProblems, ...dynamicProblems];
    
    // Add sequence number but keep original ID
    const problemsWithSequence = combined.map((problem, index) => ({
      ...problem,
      sequenceNumber: index + 1,
    }));
    
    setAllProblems(problemsWithSequence);
  }, [dbProblems]);
  
  const problems = allProblems;
  
  const handleEdit = (problem) => {
    if (problem._id) {
      navigate(`/add-problem?edit=${problem._id}`);
    }
  };

  const handleDelete = (problem) => {
    if (problem._id && confirm(`Are you sure you want to delete "${problem.title}"?`)) {
      deleteMutation.mutate(problem._id);
    }
  };

  // Filter problems based on search query and difficulty
  const filteredProblems = allProblems.filter((problem) => {
    const searchLower = searchQuery.toLowerCase().trim();
    
    // If search is empty, return true for search part
    if (!searchLower) {
      const matchesDifficulty = 
        selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
      return matchesDifficulty;
    }
    
    const matchesSearch = 
      (problem.title && problem.title.toLowerCase().includes(searchLower)) ||
      (problem.category && problem.category.toLowerCase().includes(searchLower)) ||
      (problem.description?.text && problem.description.text.toLowerCase().includes(searchLower));
    
    const matchesDifficulty = 
      selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  // Calculate stats for filtered problems
  const filteredEasyCount = filteredProblems.filter((p) => p.difficulty === "Easy").length;
  const filteredMediumCount = filteredProblems.filter((p) => p.difficulty === "Medium").length;
  const filteredHardCount = filteredProblems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between border-b border-black/5 pb-8">
          <div>
            <h1 className="text-5xl font-serif font-light text-[#451a21] tracking-tight mb-2">Practice Problems</h1>
            <p className="text-lg text-black/60 font-light">
              Sharpen your coding skills with these curated problems
            </p>
          </div>

          <Link
            to="/add-problem"
            className={`px-6 py-2 bg-[#451a21] hover:bg-[#d4af37] text-white text-[10px] font-bold tracking-wider uppercase transition-all ${!isAdmin(user) ? 'hidden' : ''}`}
          >
            + Add Problem
          </Link>
        </div>

        {/* SEARCH AND FILTER SECTION */}
        <div className="mb-8 space-y-4 bg-white rounded-lg p-6 shadow-sm border border-black/10">
          {/* Search Bar */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider uppercase mb-2 text-[#451a21]">
              Search Problems
            </label>
            <input
              type="text"
              placeholder="Search by title, category, or description..."
              className="w-full px-4 py-2 border border-black/10 rounded focus:outline-none focus:border-[#451a21] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider uppercase mb-2 text-[#451a21]">
              Filter by Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty("all")}
                className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase transition-all rounded ${
                  selectedDifficulty === "all" 
                    ? "bg-[#451a21] text-white" 
                    : "bg-white border border-black/20 text-black/70 hover:border-[#451a21]/30"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedDifficulty("Easy")}
                className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase transition-all rounded ${
                  selectedDifficulty === "Easy" 
                    ? "bg-[#22c55e] text-white" 
                    : "bg-white border border-black/20 text-black/70 hover:border-[#22c55e]/30"
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setSelectedDifficulty("Medium")}
                className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase transition-all rounded ${
                  selectedDifficulty === "Medium" 
                    ? "bg-[#eab308] text-white" 
                    : "bg-white border border-black/20 text-black/70 hover:border-[#eab308]/30"
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setSelectedDifficulty("Hard")}
                className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase transition-all rounded ${
                  selectedDifficulty === "Hard" 
                    ? "bg-[#ef4444] text-white" 
                    : "bg-white border border-black/20 text-black/70 hover:border-[#ef4444]/30"
                }`}
              >
                Hard
              </button>
            </div>
          </div>
        </div>


        {/* PROBLEMS LIST */}
        <div className="space-y-4">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="block bg-white hover:border-[#451a21]/30 transition-all shadow-sm hover:shadow-md border border-black/10 rounded-lg p-6"
            >
              <div className="flex items-center justify-between gap-4">
                {/* LEFT SIDE */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-12 rounded-lg bg-[#451a21]/10 flex items-center justify-center font-bold text-lg text-[#451a21]">
                      #{problem.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-serif font-medium text-[#451a21]">{problem.title}</h2>
                        <span className={`px-2 py-1 text-[9px] font-bold tracking-wider uppercase rounded ${
                          problem.difficulty?.toLowerCase() === 'easy' ? 'bg-[#22c55e] text-white' :
                          problem.difficulty?.toLowerCase() === 'medium' ? 'bg-[#eab308] text-white' :
                          'bg-[#ef4444] text-white'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-black/60 font-light">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase text-white ${
                          problem.difficulty?.toLowerCase() === 'easy' ? 'bg-[#22c55e]' :
                          problem.difficulty?.toLowerCase() === 'medium' ? 'bg-[#eab308]' :
                          'bg-[#ef4444]'
                        }`}>
                          {problem.category}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-black/70 font-light mb-3">{problem.description.text}</p>
                </div>
                {/* RIGHT SIDE */}
                <div className="flex items-center gap-2">
                  {isAdmin(user) && (
                    <>
                      <button 
                        className="p-2 hover:bg-black/5 rounded transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(problem);
                        }}
                        disabled={!problem._id}
                        title={!problem._id ? "Cannot edit static problems" : "Edit problem"}
                      >
                        <EditIcon className="size-4 text-[#451a21]" />
                      </button>
                      <button 
                        className="p-2 hover:bg-black/5 rounded transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(problem);
                        }}
                        disabled={!problem._id || deleteMutation.isPending}
                        title={!problem._id ? "Cannot delete static problems" : "Delete problem"}
                      >
                        <TrashIcon className="size-4 text-[#8b1e1e]" />
                      </button>
                    </>
                  )}
                  <div className="flex items-center gap-2 text-[#451a21]">
                    <span className="font-medium text-sm">Solve</span>
                    <ChevronRightIcon className="size-5" />
                  </div>
                </div>
              </div>
            </Link>
            ))
          ) : (
            <div className="bg-white shadow-sm border border-black/5 rounded-lg p-8 text-center">
              <p className="text-black/50 font-light">
                No problems found matching your filters. Try adjusting your search or difficulty level.
              </p>
            </div>
          )}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 bg-white shadow-sm border border-black/10 rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-sm text-black/60 font-light uppercase tracking-wider mb-2">Showing Problems</div>
              <div className="text-4xl font-serif font-light text-[#451a21] mb-1">{filteredProblems.length}</div>
              <div className="text-xs text-black/50 font-light">out of {problems.length} total</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-black/60 font-light uppercase tracking-wider mb-2">Easy</div>
              <div className="text-4xl font-serif font-light text-[#22c55e]">{filteredEasyCount}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-black/60 font-light uppercase tracking-wider mb-2">Medium</div>
              <div className="text-4xl font-serif font-light text-[#eab308]">{filteredMediumCount}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-black/60 font-light uppercase tracking-wider mb-2">Hard</div>
              <div className="text-4xl font-serif font-light text-[#ef4444]">{filteredHardCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
