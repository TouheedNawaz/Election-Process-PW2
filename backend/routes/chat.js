const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rateLimiter');
const sanitizeInput = require('../middleware/sanitize');
const { ai, SYSTEM_PROMPT } = require('../services/gemini');

router.post('/', rateLimiter, sanitizeInput, async (req, res) => {
  try {
    const { message, countryContext, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format the history for Gemini SDK if provided
    let chatHistory = [];
    if (history && Array.isArray(history)) {
       chatHistory = history.map(msg => ({
         role: msg.role === 'assistant' ? 'model' : 'user',
         parts: [{ text: msg.content }]
       }));
    }

    let countryInstruction = '';
    if (countryContext) {
      countryInstruction = `The user is currently asking within the context of ${countryContext}. Ensure your answer is tailored to ${countryContext}'s election processes if applicable.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + countryInstruction }] },
        { role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] },
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        temperature: 0.3, // keep it relatively factual
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports = router;
