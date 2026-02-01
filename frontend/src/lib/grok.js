// Send code to Groq and get mistakes and corrected code
export async function getMistakesAndCorrectionFromGrok(code, language) {
  const prompt = `Analyze the following ${language} code. List any mistakes, then provide the corrected code.\n\nCode:\n${code}`;
  try {
    const response = await axios.post('/grok/hint', { prompt });
    return response.data.hints || ['No response available.'];
  } catch (err) {
    return ['Failed to fetch analysis.'];
  }
}
// grok.js - Utility to call Grok API for hint generation
import axios from './axios';

// Call backend proxy endpoint
export async function getHintFromGrok(description) {
  const prompt = `Give a helpful hint for the following coding problem. Do not give the answer.\n\nDescription:\n${description}`;
  try {
    const response = await axios.post('/grok/hint', { prompt });
    return response.data.hints || ['No hint available.'];
  } catch (err) {
    return ['Failed to fetch hint.'];
  }
}
