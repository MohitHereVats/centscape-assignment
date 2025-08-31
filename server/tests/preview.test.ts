import request from 'supertest';
import app from '../src/index';

// Mock the parser service to avoid actual network calls
jest.mock('../src/services/parser', () => ({
  fetchUrlMetadata: jest.fn(),
}));

import { fetchUrlMetadata } from '../src/services/parser';
const mockedFetch = fetchUrlMetadata as jest.Mock;

describe('POST /preview', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for an invalid URL', async () => {
    const res = await request(app)
      .post('/preview')
      .send({ url: 'not-a-valid-url' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe('A valid URL is required');
  });

  it('should return 200 and metadata for a valid URL', async () => {
    const mockData = { title: 'Test Product', image: 'test.jpg' };
    mockedFetch.mockResolvedValue(mockData);

    const res = await request(app)
      .post('/preview')
      .send({ url: 'https://example.com' });
      
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
    expect(mockedFetch).toHaveBeenCalledWith('https://example.com');
  });

  it('should handle errors from the parser service gracefully', async () => {
    mockedFetch.mockRejectedValue(new Error('Failed to fetch'));

    const res = await request(app)
      .post('/preview')
      .send({ url: 'https://example.com/fail' });
    
    expect(res.status).toBe(500); // Our error handler returns 500 for generic errors
    expect(res.body.message).toBe('Internal Server Error');
  });
  
  it('should be rate-limited', async () => {
    const agent = request.agent(app);
    mockedFetch.mockResolvedValue({ title: 'Test' });

    // Exhaust the rate limit
    for (let i = 0; i < 10; i++) {
      await agent.post('/preview').send({ url: 'https://example.com' });
    }

    // The 11th request should be blocked
    const res = await agent.post('/preview').send({ url: 'https://example.com' });
    expect(res.status).toBe(429);
    expect(res.text).toContain('Too many requests');
  });
});