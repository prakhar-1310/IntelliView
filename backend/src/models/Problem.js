import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      text: { type: String, required: true },
      notes: [String],
    },
    examples: [{
      input: String,
      output: String,
      explanation: String,
    }],
    constraints: [String],
    starterCode: {
      python: String,
      java: String,
      cpp: String,
    },
    expectedOutput: {
      python: String,
      java: String,
      cpp: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;