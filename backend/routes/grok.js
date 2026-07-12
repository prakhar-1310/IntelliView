// backend/routes/grok.js (ESM version)
import express from 'express';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
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

// ── CUSTOM PROBLEM GENERATION ────────────────────────────────────────────────
router.post('/problem/generate', async (req, res) => {
  const { topic, difficulty } = req.body;
  if (!topic || !difficulty) return res.status(400).json({ error: 'Topic and difficulty are required' });
  if (!GROK_API_KEY) return res.status(500).json({ error: 'Grok API key not set' });

  const prompt = `You are an expert technical interviewer and software engineer.
Generate a complete coding interview problem based on the topic: "${topic}" and difficulty: "${difficulty}".

Return ONLY a valid JSON object. Do NOT include markdown blocks or any other text.
The JSON object must perfectly match this structure (use real problem content):
{
  "id": "a-unique-kebab-case-id-for-this-problem",
  "title": "A catchy title for the problem",
  "difficulty": "${difficulty}",
  "category": "${topic}",
  "description": {
    "text": "The full HTML or plaintext description of the problem.",
    "notes": ["Any additional notes or edge cases to consider."]
  },
  "examples": [
    {
      "input": "Example input",
      "output": "Example output",
      "explanation": "Example explanation"
    }
  "constraints": ["Constraint 1", "Constraint 2"],
  "starterCode": {
    "python": "def solve(nums):\\n    pass\\n\\nif __name__ == '__main__':\\n    # You can add test cases here\\n    print(solve([1, 2, 3]))",
    "java": "class Solution {\\n    public void solve() {\\n        // Implement solution here\\n    }\\n}\\n\\npublic class Main {\\n    public static void main(String[] args) {\\n        Solution sol = new Solution();\\n        // You can add test cases here\\n        sol.solve();\\n    }\\n}",
    "cpp": "#include <iostream>\\nusing namespace std;\\n\\nclass Solution {\\npublic:\\n    void solve() {\\n        // Implement solution here\\n    }\\n};\\n\\nint main() {\\n    Solution sol;\\n    // You can add test cases here\\n    sol.solve();\\n    return 0;\\n}"
  },
  "expectedOutput": {
    "python": "Expected output from python execution if we ran print statements",
    "java": "Expected output from java execution",
    "cpp": "Expected output from cpp execution"
  }
}`;

  try {
    const response = await axios.post(
      GROK_API_URL,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices?.[0]?.message?.content?.trim() || '';
    const jsonStr = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    try {
      const generatedProblem = JSON.parse(jsonStr);
      res.json({ problem: generatedProblem });
    } catch (parseErr) {
      console.error('Failed to parse Groq generated problem:', jsonStr);
      res.status(500).json({ error: 'Groq API returned invalid JSON', details: jsonStr });
    }
  } catch (err) {
    console.error('Groq API error generating problem:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate problem', details: err?.response?.data || err.message });
  }
});


// ── MOCK INTERVIEW: Question Generation ──────────────────────────────────────
router.post('/interview/questions', async (req, res) => {
  const { topic, difficulty, count } = req.body;
  if (!topic || !difficulty || !count) {
    return res.status(400).json({ error: 'Topic, difficulty, and count are required' });
  }
  if (!GROK_API_KEY) return res.status(500).json({ error: 'Grok API key not set' });

  const prompt = `You are an expert technical interviewer. Generate exactly ${count} interview questions for a ${difficulty} level interview on the topic: "${topic}".

Return ONLY a valid JSON array — no markdown, no extra text, no explanation. Use exactly this format:
[
  {
    "id": 1,
    "question": "Your interview question here?",
    "idealAnswer": "A concise 2-3 sentence ideal answer covering the key concepts."
  }
]

Rules:
- Questions must match the ${difficulty} difficulty level
- Focus specifically on: ${topic}
- Make questions realistic and commonly asked in real tech interviews
- idealAnswer should be clear, concise, and technically accurate (2-4 sentences)
- Generate exactly ${count} questions, numbered 1 to ${count}`;

  try {
    const response = await axios.post(GROK_API_URL, {
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2500,
      temperature: 0.7,
    }, {
      headers: { Authorization: `Bearer ${GROK_API_KEY}`, 'Content-Type': 'application/json' },
    });

    const content = response.data.choices?.[0]?.message?.content?.trim() || '';
    // Strip any accidental markdown fences
    const jsonStr = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const questions = JSON.parse(jsonStr);
    res.json({ questions });
  } catch (err) {
    console.error('Interview question generation error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate questions', details: err.response?.data || err.message });
  }
});

// ── MOCK INTERVIEW: Answer Evaluation ────────────────────────────────────────
router.post('/interview/evaluate', async (req, res) => {
  const { topic, difficulty, questionsAndAnswers, videoFrames } = req.body;
  // questionsAndAnswers: [{ id, question, idealAnswer, candidateAnswer }]
  if (!topic || !difficulty || !Array.isArray(questionsAndAnswers) || questionsAndAnswers.length === 0) {
    return res.status(400).json({ error: 'Invalid request data' });
  }
  if (!GROK_API_KEY) return res.status(500).json({ error: 'Grok API key not set' });

  const qaFormatted = questionsAndAnswers.map((qa, i) =>
    `Q${i + 1} (id: ${qa.id}): ${qa.question}\nCandidate's Answer: ${qa.candidateAnswer?.trim() || '(No answer provided)'}`
  ).join('\n\n');

  const prompt = `You are an expert technical interviewer evaluating a ${difficulty} level interview on: "${topic}".

Interview Q&A:
${qaFormatted}

Evaluate each answer carefully and return ONLY valid JSON — no markdown, no extra text. Use exactly this structure:
{
  "overallScore": <integer 0-100>,
  "grade": "<one of: A+, A, B+, B, C+, C, D, F>",
  "summary": "<2-3 sentence overall assessment of the candidate's performance>",
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "areasToImprove": ["<area 1>", "<area 2>", "<area 3>"],
  "questionAnalysis": [
    {
      "questionId": <same id as the question>,
      "score": <integer 0-10>,
      "whatWasGood": "<what the candidate did well, or 'No answer was provided' if blank>",
      "whatToImprove": "<specific, actionable improvement advice>",
      "correctAnswer": "<comprehensive ideal answer for this question>",
      "feedback": "<1-2 sentence overall verdict for this answer>"
    }
  ]
}`;

  try {
    const groqPromise = axios.post(GROK_API_URL, {
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3500,
      temperature: 0.3,
    }, {
      headers: { Authorization: `Bearer ${GROK_API_KEY}`, 'Content-Type': 'application/json' },
    });

    let geminiPromise = Promise.resolve(null);
    if (videoFrames && videoFrames.length > 0 && process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const imageParts = videoFrames.map(base64Str => {
        const mimeType = base64Str.split(";")[0].split(":")[1] || "image/jpeg";
        const data = base64Str.includes(",") ? base64Str.split(",")[1] : base64Str;
        return { inlineData: { data, mimeType } };
      });

      const visualPrompt = `Analyze these frames of a candidate taken during a mock interview.
Evaluate their body language and presentation based on these frames.
Return exactly and ONLY a JSON object (no markdown, no extra text) with this structure:
{
  "nervousness": "Low", // Low, Medium, or High
  "eyeContact": "Good", // Good, Fair, or Poor
  "attire": "Formal", // Formal, Business Casual, Casual, or Inappropriate
  "feedback": "2-3 sentence summary of their visual presentation."
}`;

      geminiPromise = model.generateContent([visualPrompt, ...imageParts])
        .then(result => {
          const text = result.response.text().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
          return JSON.parse(text);
        })
        .catch(err => {
          console.error("Gemini Visual Analysis Error:", err);
          return null;
        });
    }

    const [response, visualResult] = await Promise.all([groqPromise, geminiPromise]);

    const content = response.data.choices?.[0]?.message?.content?.trim() || '';
    const jsonStr = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const evaluation = JSON.parse(jsonStr);

    if (visualResult) {
      evaluation.visualAnalysis = visualResult;
    }

    res.json({ evaluation });
  } catch (err) {
    console.error('Interview evaluation error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to evaluate interview', details: err.response?.data || err.message });
  }
});

export default router;
