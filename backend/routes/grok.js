// backend/routes/grok.js (ESM version)
import express from 'express';
import axios from 'axios';
const router = express.Router();

// Load Grok API key from environment
const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/hint', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
  if (!GROK_API_KEY) return res.status(500).json({ error: 'Grok API key not set' });

  // Ask for 3 hints in a single request (if supported by API)
  const multiHintPrompt = `${prompt}\n\nGenerate 3 progressively more detailed hints. Format your response as:\nHint 1: ...\nHint 2: ...\nHint 3: ...`;

  try {
    const response = await axios.post(
      GROK_API_URL,
      {
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'user', content: multiHintPrompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Groq API response:', JSON.stringify(response.data, null, 2));
    const content = response.data.choices?.[0]?.message?.content?.trim();
    const reasoning = response.data.choices?.[0]?.message?.reasoning?.trim();
    const text = content || reasoning || '';
    // Parse hints from response (support Markdown bold and double newlines)
    let hints = [];
    // Matches **Hint 1:** ... **Hint 2:** ... **Hint 3:** ...
    const hintRegex = /\*{0,2}Hint\s*\d+\*{0,2}\s*[:：]\s*([\s\S]*?)(?=(\n\*{0,2}Hint\s*\d+\*{0,2}\s*[:：])|$)/gi;
    let match;
    while ((match = hintRegex.exec(text)) !== null) {
      // Remove leading Markdown bold (**) and whitespace
      let clean = match[1].replace(/^\*+\s*/, '').trim();
      hints.push(clean);
    }
    if (hints.length === 0 && text) hints = [text];
    if (hints.length === 0) hints = ['No hint available.'];
    res.json({ hints });
  } catch (err) {
    if (err.response) {
      console.error('Groq API error response:', JSON.stringify(err.response.data, null, 2));
      res.status(500).json({ error: 'Failed to fetch hint', details: err.response.data });
    } else {
      console.error('Groq API error:', err.message);
      res.status(500).json({ error: 'Failed to fetch hint', details: err.message });
    }
  }
});

export default router;
