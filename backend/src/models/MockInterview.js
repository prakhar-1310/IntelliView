import mongoose from "mongoose";

const questionAnalysisSchema = new mongoose.Schema(
  {
    questionId: { type: Number },
    question: { type: String },
    candidateAnswer: { type: String, default: "" },
    idealAnswer: { type: String },
    score: { type: Number, min: 0, max: 10 },
    feedback: { type: String },
    whatWasGood: { type: String },
    whatToImprove: { type: String },
    correctAnswer: { type: String },
  },
  { _id: false }
);

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: { type: String, required: true },
    topicLabel: { type: String },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    questionCount: { type: Number, required: true },
    questions: [
      {
        id: Number,
        question: String,
        idealAnswer: String,
      },
    ],
    answers: [{ type: String }],
    overallScore: { type: Number, min: 0, max: 100 },
    grade: { type: String },
    summary: { type: String },
    strengths: [String],
    areasToImprove: [String],
    questionAnalysis: [questionAnalysisSchema],
    durationMinutes: { type: Number },
  },
  { timestamps: true }
);

const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);

export default MockInterview;
