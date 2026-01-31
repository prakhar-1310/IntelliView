import express from 'express';
import axios from 'axios';
const router = express.Router();

// GET /api/youtube/search?q=QUERY
router.get('/search', async (req, res) => {
  const { q } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'YouTube API key not set in backend .env' });
  }
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q,
        type: 'video',
        maxResults: 1,
        key: apiKey,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'YouTube API error' });
  }
});

export default router;
