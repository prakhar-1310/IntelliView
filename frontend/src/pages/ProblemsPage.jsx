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
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
            <p className="text-base-content/70">
              Sharpen your coding skills with these curated problems
            </p>
          </div>

          <Link
            to="/add-problem"
            className={`btn btn-primary ${!isAdmin(user) ? 'hidden' : ''}`}
          >
            + Add Problem
          </Link>
        </div>

        {/* SEARCH AND FILTER SECTION */}
        <div className="mb-8 space-y-4 bg-base-100 rounded-lg p-6 shadow-sm border border-base-300">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-base-content">
              Search Problems
            </label>
            <input
              type="text"
              placeholder="Search by title, category, or description..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-base-content">
              Filter by Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty("all")}
                className={`btn btn-sm ${selectedDifficulty === "all" ? "btn-primary" : "btn-outline"}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedDifficulty("Easy")}
                className={`btn btn-sm ${selectedDifficulty === "Easy" ? "btn-success" : "btn-outline"}`}
              >
                Easy
              </button>
              <button
                onClick={() => setSelectedDifficulty("Medium")}
                className={`btn btn-sm ${selectedDifficulty === "Medium" ? "btn-warning" : "btn-outline"}`}
              >
                Medium
              </button>
              <button
                onClick={() => setSelectedDifficulty("Hard")}
                className={`btn btn-sm ${selectedDifficulty === "Hard" ? "btn-error" : "btn-outline"}`}
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
              className="card bg-base-100 hover:scale-[1.01] transition-transform"
            >
              <div className="card-body">
                <div className="flex items-center justify-between gap-4">
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-lg text-primary">
                        #{problem.id}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold">{problem.title}</h2>
                          <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-base-content/60"> {problem.category}</p>
                      </div>
                    </div>
                    <p className="text-base-content/80 mb-3">{problem.description.text}</p>
                  </div>
                  {/* RIGHT SIDE */}
                  <div className="flex items-center gap-2">
                    {isAdmin(user) && (
                      <>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEdit(problem);
                          }}
                          disabled={!problem._id}
                          title={!problem._id ? "Cannot edit static problems" : "Edit problem"}
                        >
                          <EditIcon className="size-4" />
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost text-error"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(problem);
                          }}
                          disabled={!problem._id || deleteMutation.isPending}
                          title={!problem._id ? "Cannot delete static problems" : "Delete problem"}
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </>
                    )}
                    <div className="flex items-center gap-2 text-primary">
                      <span className="font-medium">Solve</span>
                      <ChevronRightIcon className="size-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            ))
          ) : (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body text-center">
                <p className="text-base-content/60">
                  No problems found matching your filters. Try adjusting your search or difficulty level.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Showing Problems</div>
                <div className="stat-value text-primary">{filteredProblems.length}</div>
                <div className="stat-desc">out of {problems.length} total</div>
              </div>

              <div className="stat">
                <div className="stat-title">Easy</div>
                <div className="stat-value text-success">{filteredEasyCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Medium</div>
                <div className="stat-value text-warning">{filteredMediumCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Hard</div>
                <div className="stat-value text-error">{filteredHardCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;