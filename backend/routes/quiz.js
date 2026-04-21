const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rateLimiter');
const { ai, SYSTEM_PROMPT } = require('../services/gemini');

router.post('/generate', rateLimiter, async (req, res) => {
  try {
    const { country, difficulty = 'medium', topic = 'general' } = req.body;

    const quizPrompt = `
You are generating a quiz question for ElectIQ.
Generate 1 multiple choice question about the election process in ${country || 'South Asia'}.
Difficulty: ${difficulty}
Topic: ${topic}

Format the output strictly as a JSON object with this structure:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "The exact string from options that is correct",
  "explanation": "A short 1-sentence explanation of why it is correct"
}
Ensure the JSON is valid. Do not use markdown wrappers like \`\`\`json. Just return the raw JSON object.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood.' }] },
        { role: 'user', parts: [{ text: quizPrompt }] }
      ],
      config: {
        temperature: 0.7,
      }
    });

    // Parse the JSON (clean up any potential markdown if the model still outputs it)
    let rawResponse = response.text.trim();
    if (rawResponse.startsWith('```json')) {
      rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (rawResponse.startsWith('```')) {
        rawResponse = rawResponse.replace(/```/g, '').trim();
    }

    try {
      const quizQuestion = JSON.parse(rawResponse);
      res.json(quizQuestion);
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini:", rawResponse);
      res.status(500).json({ error: 'Failed to generate valid quiz question format' });
    }

  } catch (error) {
    console.error('Quiz API Error:', error);
    res.status(500).json({ error: 'Failed to generate quiz question' });
  }
});

module.exports = router;
