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
    setAllProblems([...staticProblems, ...dynamicProblems]);
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

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

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


        {/* PROBLEMS LIST */}
        <div className="space-y-4">
          {problems.map((problem) => (
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
                      <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Code2Icon className="size-6 text-primary" />
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
          ))}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Total Problems</div>
                <div className="stat-value text-primary">{problems.length}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Easy</div>
                <div className="stat-value text-success">{easyProblemsCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Medium</div>
                <div className="stat-value text-warning">{mediumProblemsCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Hard</div>
                <div className="stat-value text-error">{hardProblemsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;