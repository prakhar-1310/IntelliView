import axiosInstance from "../lib/axios";

export const problemApi = {
  createProblem: async (data) => {
    const response = await axiosInstance.post("/problems", data);
    return response.data;
  },

  getProblems: async () => {
    const response = await axiosInstance.get("/problems");
    return response.data;
  },

  deleteProblem: async (id) => {
    const response = await axiosInstance.delete(`/problems/${id}`);
    return response.data;
  },

  updateProblem: async (id, data) => {
    const response = await axiosInstance.put(`/problems/${id}`, data);
    return response.data;
  },

  getProblemById: async (id) => {
    const response = await axiosInstance.get(`/problems/${id}`);
    return response.data;
  },
};