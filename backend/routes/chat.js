const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rateLimiter');
const sanitizeInput = require('../middleware/sanitize');
const { ai, SYSTEM_PROMPT } = require('../services/gemini');

// ── POST /api/chat ──────────────────────────────────────────────────────────
// Streams the Gemini response back as Server-Sent Events (text/event-stream).
router.post('/', rateLimiter, sanitizeInput, async (req, res) => {
  try {
    const { message, countryContext, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format history for Gemini SDK
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

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + countryInstruction }] },
        { role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] },
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: { temperature: 0.3 }
    });

    for await (const chunk of stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${JSON.stringify({ token: text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Chat API Error:', error);
    // If headers not sent yet, send JSON error
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Failed to generate response' });
    }
    res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
    res.end();
  }
});

// ── POST /api/chat/roadmap ──────────────────────────────────────────────────
// Accepts wizard answers and returns a personalized voter action plan.
router.post('/roadmap', rateLimiter, async (req, res) => {
  try {
    const { country, citizenship, age, soundMind } = req.body;

    if (!country) {
      return res.status(400).json({ error: 'Country is required' });
    }

    const countryName = country.charAt(0).toUpperCase() + country.slice(1);
    const citizenshipLabel = citizenship === 'nri' ? 'an NRI/Overseas Citizen' : 'a citizen';

    const roadmapPrompt = `
You are ElectIQ, a civic education assistant. A user has just completed the Voter Eligibility Checker.

Their profile:
- Country: ${countryName}
- Age 18+: ${age === 'yes' ? 'Yes' : 'No'}
- Citizenship status: ${citizenshipLabel}
- Legally disqualified: ${soundMind === 'yes' ? 'Yes' : 'No'}

Generate a personalized, numbered action plan (maximum 6 steps) for this person to participate in elections in ${countryName}. 
Be specific: mention the correct official body (ECI for India, ECP for Pakistan, EC Bangladesh), actual registration portals if known, and realistic timelines.
Keep each step concise (1–2 sentences). Use clear, simple English for a first-time voter.
Format: a numbered markdown list only. No introduction paragraph, no conclusion.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: roadmapPrompt }] }],
      config: { temperature: 0.4 }
    });

    res.json({ roadmap: response.text });
  } catch (error) {
    console.error('Roadmap API Error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

module.exports = router;
