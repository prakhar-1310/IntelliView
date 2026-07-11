import axiosInstance from "../lib/axios";

export const interviewApi = {
  // Generate AI interview questions
  generateQuestions: ({ topic, difficulty, count }) =>
    axiosInstance
      .post("/grok/interview/questions", { topic, difficulty, count })
      .then((r) => r.data),

  // Evaluate all Q&A pairs and return full report
  evaluateAnswers: ({ topic, difficulty, questionsAndAnswers }) =>
    axiosInstance
      .post("/grok/interview/evaluate", { topic, difficulty, questionsAndAnswers })
      .then((r) => r.data),

  // Save completed interview to MongoDB
  saveReport: (data) =>
    axiosInstance.post("/interview/save", data).then((r) => r.data),

  // Get current user's interview history
  getHistory: () =>
    axiosInstance.get("/interview/history").then((r) => r.data),

  // Get a specific past interview by ID
  getById: (id) =>
    axiosInstance.get(`/interview/${id}`).then((r) => r.data),
};
