import axiosInstance from "../lib/axios";

export const sessionApi = {
  createSession: async (data) => {
    const response = await axiosInstance.post("/sessions", data);
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/active");
    return response.data;
  },
  getMyActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-active");
    return response.data;
  },
  getMyRecentSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-recent");
    return response.data;
  },

  getSessionById: async (id) => {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
  },

  joinSession: async (sessionId) => {
    const response = await axiosInstance.post(`/sessions/${sessionId}/join`);
    return response.data;
  },
  joinSessionByCode: async (code) => {
    const response = await axiosInstance.post(`/sessions/join/code/${code}`);
    return response.data;
  },
  endSession: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/end`);
    return response.data;
  },
  leaveSession: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/leave`);
    return response.data;
  },
  getStreamToken: async () => {
    const response = await axiosInstance.get(`/chat/token`);
    return response.data;
  },
  getAdminActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/admin/active");
    return response.data;
  },
  cancelSessionAdmin: async (id) => {
    const response = await axiosInstance.post(`/sessions/admin/${id}/cancel`);
    return response.data;
  },
};