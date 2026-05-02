const request = require('supertest');
const app = require('../server');

// Mock the Gemini AI service to avoid hitting the API in tests
jest.mock('../services/gemini', () => ({
  ai: {
    models: {
      generateContentStream: jest.fn(async function* () {
        yield { text: () => 'Mock streaming response token.' };
      })
    }
  },
  SYSTEM_PROMPT: 'Mock system prompt.'
}));

describe('POST /api/chat', () => {
  it('should return 400 when message is missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should stream a response when a valid message is provided', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'How do elections work in India?' });

    // SSE responses come back as text/event-stream
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/event-stream');
  });
});

describe('POST /api/chat/roadmap', () => {
  it('should return 400 when country is missing', async () => {
    const res = await request(app)
      .post('/api/chat/roadmap')
      .send({ age: 'yes', citizenship: 'yes' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
