import { useState } from "react";
import Navbar from "../components/Navbar";

function AddProblem() {
  const [form, setForm] = useState({
    id: "",
    title: "",
    difficulty: "Easy",
    category: "",
    descriptionText: "",
    notes: "",
    examples: "",
    constraints: "",
    jsCode: "",
    pyCode: "",
    javaCode: "",
    jsOutput: "",
    pyOutput: "",
    javaOutput: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    /** EXACT SAME FORMAT AS problems.js */
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
        javascript: form.jsCode,
        python: form.pyCode,
        java: form.javaCode,
      },
      expectedOutput: {
        javascript: form.jsOutput,
        python: form.pyOutput,
        java: form.javaOutput,
      },
    };

    console.log("NEW PROBLEM OBJECT 👉", newProblem);

    /**
     * Later:
     * POST this object to backend
     * Save in DB
     * Load for all users
     */
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Add New Problem</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input name="id" placeholder="problem-id (unique)"
            className="input input-bordered w-full"
            onChange={handleChange} />

          <input name="title" placeholder="Title"
            className="input input-bordered w-full"
            onChange={handleChange} />

          <select name="difficulty"
            className="select select-bordered w-full"
            onChange={handleChange}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <input name="category" placeholder="Category (Array • DP)"
            className="input input-bordered w-full"
            onChange={handleChange} />

          <textarea name="descriptionText" placeholder="Problem Description"
            className="textarea textarea-bordered w-full"
            onChange={handleChange} />

          <textarea name="notes" placeholder="Notes (one per line)"
            className="textarea textarea-bordered w-full"
            onChange={handleChange} />

          <textarea name="examples"
            placeholder={`Examples format:
input line
output line
explanation (optional)

(blank line between examples)`}
            className="textarea textarea-bordered w-full"
            onChange={handleChange} />

          <textarea name="constraints"
            placeholder="Constraints (one per line)"
            className="textarea textarea-bordered w-full"
            onChange={handleChange} />

          <textarea name="jsCode" placeholder="JavaScript Starter Code"
            className="textarea textarea-bordered w-full"
            onChange={handleChange} />

          <textarea name="pyCode" placeholder="Python Starter Code"
            className="textarea textarea-bordered w-full"
            onChange={handleChange} />

          <textarea name="javaCode" placeholder="Java Starter Code"
            className="textarea textarea-bordered w-full"
            onChange={handleChange} />

          <textarea name="jsOutput" placeholder="JS Expected Output"
            className="textarea textarea-bordered w-full"
            onChange={handleChange} />

          <textarea name="pyOutput" placeholder="Python Expected Output"
            className="textarea textarea-bordered w-full"
            onChange={handleChange} />

          <textarea name="javaOutput" placeholder="Java Expected Output"
            className="textarea textarea-bordered w-full"
            onChange={handleChange} />

          <button className="btn btn-primary w-full">
            Save Problem
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProblem;
