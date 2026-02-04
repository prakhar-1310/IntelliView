import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { problemApi } from "../api/problems";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router";

function AddProblem() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: "",
    title: "",
    difficulty: "Easy",
    category: "",
    descriptionText: "",
    notes: "",
    examples: "",
    constraints: "",
    pyCode: "",
    javaCode: "",
    cppCode: "",
    pyOutput: "",
    javaOutput: "",
    cppOutput: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Load problem data for editing
  useEffect(() => {
    if (editId) {
      setIsEditing(true);
      setIsLoading(true);
      problemApi.getProblemById(editId)
        .then(data => {
          const problem = data.problem;
          setForm({
            id: problem.id,
            title: problem.title,
            difficulty: problem.difficulty,
            category: problem.category,
            descriptionText: problem.description.text,
            notes: problem.description.notes.join('\n'),
            examples: problem.examples.map(ex => 
              `${ex.input}\n${ex.output}${ex.explanation ? '\n' + ex.explanation : ''}`
            ).join('\n\n'),
            constraints: problem.constraints.join('\n'),
            pyCode: problem.starterCode.python || '',
            javaCode: problem.starterCode.java || '',
            cppCode: problem.starterCode.cpp || '',
            pyOutput: problem.expectedOutput.python || '',
            javaOutput: problem.expectedOutput.java || '',
            cppOutput: problem.expectedOutput.cpp || '',
          });
        })
        .catch(() => toast.error('Failed to load problem'))
        .finally(() => setIsLoading(false));
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newProblem = {
        id: form.id,
        title: form.title,
        difficulty: form.difficulty,
        category: form.category,
        description: {
          text: form.descriptionText,
          notes: form.notes.split("\n").filter(Boolean),
        },
        examples: form.examples
          .split("\n\n")
          .map((ex) => {
            const lines = ex.split("\n");
            return {
              input: lines[0] || "",
              output: lines[1] || "",
              explanation: lines[2] || undefined,
            };
          }),
        constraints: form.constraints.split("\n").filter(Boolean),
        starterCode: {
          python: form.pyCode,
          java: form.javaCode,
          cpp: form.cppCode,
        },
        expectedOutput: {
          python: form.pyOutput,
          java: form.javaOutput,
          cpp: form.cppOutput,
        },
      };

      if (isEditing) {
        await problemApi.updateProblem(editId, newProblem);
        toast.success("Problem updated successfully!");
      } else {
        await problemApi.createProblem(newProblem);
        toast.success("Problem created successfully!");
      }
      navigate("/problems");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create problem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Problem' : 'Add New Problem'}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input name="id" placeholder="problem-id (unique)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
            value={form.id}
            onChange={handleChange} />

          <input name="title" placeholder="Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
            value={form.title}
            onChange={handleChange} />

          <select name="difficulty"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
            value={form.difficulty}
            onChange={handleChange}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <input name="category" placeholder="Category (Array • DP)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
            value={form.category}
            onChange={handleChange} />

          <textarea name="descriptionText" placeholder="Problem Description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-vertical w-full"
            value={form.descriptionText}
            onChange={handleChange} />

          <textarea name="notes" placeholder="Notes (one per line)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-vertical w-full"
            value={form.notes}
            onChange={handleChange} />

          <textarea name="examples"
            placeholder={`Examples format:
input line
output line
explanation (optional)

(blank line between examples)`}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-vertical w-full"
            value={form.examples}
            onChange={handleChange} />

          <textarea name="constraints"
            placeholder="Constraints (one per line)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-vertical w-full"
            value={form.constraints}
            onChange={handleChange} />

          <textarea name="pyCode" placeholder="Python Starter Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-vertical w-full"
            value={form.pyCode}
            onChange={handleChange} />

          <textarea name="javaCode" placeholder="Java Starter Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-vertical w-full"
            value={form.javaCode}
            onChange={handleChange} />

          <textarea name="cppCode" placeholder="C++ Starter Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-vertical w-full"
            value={form.cppCode}
            onChange={handleChange} />

          <textarea name="pyOutput" placeholder="Python Expected Output"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-vertical w-full"
            value={form.pyOutput}
            onChange={handleChange} />

          <textarea name="javaOutput" placeholder="Java Expected Output"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-vertical w-full"
            value={form.javaOutput}
            onChange={handleChange} />

          <textarea name="cppOutput" placeholder="C++ Expected Output"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-vertical w-full"
            value={form.cppOutput}
            onChange={handleChange} />

          <button className="w-full px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
            {isLoading ? "Loading..." : isEditing ? "Update Problem" : "Save Problem"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProblem;
