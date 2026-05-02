const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Streams a chat message from the backend, calling onToken for each chunk.
 * Returns the full assembled reply string when done.
 */
export const streamChatMessage = async (message, countryContext = '', history = [], onToken) => {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, countryContext, history }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let fullReply = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep incomplete last line in buffer

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const raw = line.slice(6).trim();
        if (raw === '[DONE]') return fullReply;
        try {
          const parsed = JSON.parse(raw);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.token) {
            fullReply += parsed.token;
            if (onToken) onToken(parsed.token, fullReply);
          }
        } catch (err) {
          if (err.message === 'Stream interrupted' || err.message === 'Failed to generate response') {
            throw err;
          }
          // skip malformed SSE lines
        }
      }
    }
  }

  return fullReply;
};

/**
 * Generate a personalized voter roadmap from wizard answers.
 */
export const generateRoadmap = async (answers) => {
  const response = await fetch(`${API_BASE_URL}/api/chat/roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers),
  });

  if (!response.ok) {
    throw new Error(`Roadmap API error: ${response.status}`);
  }

  const data = await response.json();
  return data.roadmap;
};

export const generateQuizQuestion = async (country, difficulty = 'medium', topic = 'general') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, difficulty, topic }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};


