const request = require('supertest');
const app = require('../server');

// Mock the Gemini AI service
jest.mock('../services/gemini', () => ({
  ai: {
    models: {
      generateContent: jest.fn(async () => ({
        text: JSON.stringify({
          question: 'What is the full form of EVM?',
          options: [
            'Electronic Voting Machine',
            'Electro Volt Mechanism',
            'Electoral Voting Method',
            'Electronic Vote Monitor'
          ],
          correctAnswer: 'Electronic Voting Machine',
          explanation: 'EVM stands for Electronic Voting Machine, used in Indian elections.'
        })
      }))
    }
  },
  SYSTEM_PROMPT: 'Mock system prompt.'
}));

describe('POST /api/quiz/generate', () => {
  it('should return a valid quiz question object', async () => {
    const res = await request(app)
      .post('/api/quiz/generate')
      .send({ country: 'India', difficulty: 'medium', topic: 'general' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('question');
    expect(res.body).toHaveProperty('options');
    expect(Array.isArray(res.body.options)).toBe(true);
    expect(res.body.options).toHaveLength(4);
    expect(res.body).toHaveProperty('correctAnswer');
    expect(res.body).toHaveProperty('explanation');
  });

  it('should work without specifying a country', async () => {
    const res = await request(app)
      .post('/api/quiz/generate')
      .send({});
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('question');
  });
});
