import Problem from "../models/Problem.js";

export async function createProblem(req, res) {
  try {
    const userId = req.user._id;
    const problemData = { ...req.body, createdBy: userId };
    
    const problem = await Problem.create(problemData);
    res.status(201).json({ problem });
  } catch (error) {
    console.log("Error in createProblem controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProblems(req, res) {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.status(200).json({ problems });
  } catch (error) {
    console.log("Error in getProblems controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteProblem(req, res) {
  try {
    const { id } = req.params;
    await Problem.findByIdAndDelete(id);
    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProblem controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProblem(req, res) {
  try {
    const { id } = req.params;
    const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ problem: updatedProblem });
  } catch (error) {
    console.log("Error in updateProblem controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProblemById(req, res) {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ problem });
  } catch (error) {
    console.log("Error in getProblemById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}