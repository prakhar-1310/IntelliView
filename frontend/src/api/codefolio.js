import apiClient from "../lib/axios";

// Fetch stats for a specific platform
export const getPlatformStats = async (platform, username) => {
  try {
    const response = await apiClient.get("/codefolio/platform", {
      params: { platform, username },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${platform} stats:`, error);
    throw error;
  }
};

// Fetch stats for all platforms
export const getAllPlatformStats = async (usernames) => {
  try {
    const response = await apiClient.post("/codefolio/all", usernames);
    return response.data;
  } catch (error) {
    console.error("Error fetching all platform stats:", error);
    throw error;
  }
};

// Get LeetCode stats
export const getLeetCodeStats = async (username) => {
  return getPlatformStats("leetcode", username);
};

// Get CodeForces stats
export const getCodeForcesStats = async (username) => {
  return getPlatformStats("codeforces", username);
};

// Get CodeChef stats
export const getCodeChefStats = async (username) => {
  return getPlatformStats("codechef", username);
};

// Get GeeksforGeeks stats
export const getGeeksforGeeksStats = async (username) => {
  return getPlatformStats("geeksforgeeks", username);
};

// Save CodeFolio usernames/info to backend
export const saveCodeFolioUsernames = async (usernames) => {
  try {
    const response = await apiClient.post("/codefolio/usernames", usernames);
    return response.data;
  } catch (error) {
    console.error("Error saving CodeFolio usernames:", error);
    throw error;
  }
};

// Fetch CodeFolio usernames/info from backend
export const fetchCodeFolioUsernames = async () => {
  try {
    const response = await apiClient.get("/codefolio/usernames");
    return response.data;
  } catch (error) {
    console.error("Error fetching CodeFolio usernames:", error);
    throw error;
  }
};
