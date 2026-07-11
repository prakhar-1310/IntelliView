import MockInterview from "../models/MockInterview.js";

// Save completed interview report to DB
export const saveInterviewReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      topic,
      topicLabel,
      difficulty,
      questionCount,
      questions,
      answers,
      report,
      durationMinutes,
    } = req.body;

    if (!report || !topic || !difficulty) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Merge question + answer + analysis into one enriched array
    const questionAnalysis = (report.questionAnalysis || []).map((qa, i) => ({
      questionId: qa.questionId ?? i + 1,
      question: questions?.[i]?.question || "",
      candidateAnswer: answers?.[i] || "",
      idealAnswer: questions?.[i]?.idealAnswer || "",
      score: qa.score ?? 0,
      feedback: qa.feedback || "",
      whatWasGood: qa.whatWasGood || "",
      whatToImprove: qa.whatToImprove || "",
      correctAnswer: qa.correctAnswer || questions?.[i]?.idealAnswer || "",
    }));

    const interview = await MockInterview.create({
      user: userId,
      topic,
      topicLabel,
      difficulty,
      questionCount,
      questions: questions || [],
      answers: answers || [],
      overallScore: report.overallScore,
      grade: report.grade,
      summary: report.summary,
      strengths: report.strengths || [],
      areasToImprove: report.areasToImprove || [],
      questionAnalysis,
      durationMinutes,
    });

    res.status(201).json({ success: true, interviewId: interview._id });
  } catch (error) {
    console.error("Error saving interview report:", error);
    res.status(500).json({ success: false, message: "Error saving report" });
  }
};

// Get all past interview sessions for current user
export const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const interviews = await MockInterview.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("topic topicLabel difficulty questionCount overallScore grade durationMinutes createdAt");

    res.status(200).json({ success: true, interviews });
  } catch (error) {
    console.error("Error fetching interview history:", error);
    res.status(500).json({ success: false, message: "Error fetching history" });
  }
};

// Get a specific interview by ID
export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const interview = await MockInterview.findOne({ _id: id, user: userId });
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    res.status(200).json({ success: true, interview });
  } catch (error) {
    console.error("Error fetching interview:", error);
    res.status(500).json({ success: false, message: "Error fetching interview" });
  }
};
