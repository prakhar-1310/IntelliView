import axios from "../lib/axios";

export const fetchYoutubeVideo = async (query) => {
  try {
    const response = await axios.get("/youtube/search", { params: { q: query } });
    const items = response.data.items;
    if (items && items.length > 0) {
      const videoId = items[0].id.videoId;
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return null;
  } catch (error) {
    console.error("YouTube API error:", error);
    return null;
  }
};
