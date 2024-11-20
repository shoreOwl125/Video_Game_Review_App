import request from 'supertest';
import app from '../app';
// import { getPool } from '../connections/database';
// import { RowDataPacket, ResultSetHeader } from 'mysql2';
import jwt from 'jsonwebtoken';
import {
  resetDatabase,
  seedDatabase,
  closeDatabase,
} from './scripts/setupTests';

// let pool = getPool();

function generateMockToken(userId: number): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'testsecret', {
    expiresIn: '1h',
  });
}

describe('User Data API Tests', () => {
  beforeEach(async () => {
    await resetDatabase();
    await seedDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('should retrieve user data by ID when authenticated', async () => {
    const token = generateMockToken(1);

    const res = await request(app)
      .get('/api/userdata/1')
      .set('Cookie', [`jwt=${token}`]);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('interests', ['sports', 'action']);
  });

  it("should not retrieve another user's data", async () => {
    const token = generateMockToken(2);

    const res = await request(app)
      .get('/api/userdata/1')
      .set('Cookie', [`jwt=${token}`]);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('message', 'Forbidden: Access denied');
  });

  it('should update user data successfully when authenticated', async () => {
    const token = generateMockToken(1);

    const updates = {
      interests: ['sports', 'adventure'],
      genres: ['RPG', 'Sports'],
    };

    const res = await request(app)
      .put('/api/userdata/1')
      .set('Cookie', [`jwt=${token}`])
      .send(updates);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      'message',
      'User data updated successfully'
    );
  });

  it("should not update another user's data", async () => {
    const token = generateMockToken(2);

    const updates = {
      interests: ['sports', 'adventure'],
      genres: ['RPG', 'Sports'],
    };

    const res = await request(app)
      .put('/api/userdata/1')
      .set('Cookie', [`jwt=${token}`])
      .send(updates);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('message', 'Forbidden: Access denied');
  });

  // These test cases are commented out because they involve making API calls
  // to fetch recommendations for openAI, which can be computationally expensive, especially
  // when testing at scale. For now, we are prioritizing efficiency in the test suite
  // by not invoking external API calls. These can be re-enabled later if needed
  // for end-to-end testing or integration purposes.

  //   it('should retrieve recommendations for the authenticated user', async () => {
  //     const token = generateMockToken(1);

  //     const res = await request(app)
  //       .get('/api/userdata/1/recommendations')
  //       .set('Cookie', [`jwt=${token}`]);

  //     expect(res.statusCode).toEqual(200);
  //     expect(Array.isArray(res.body)).toBe(true);
  //   });

  //   it('should not retrieve recommendations for another user', async () => {
  //     const token = generateMockToken(2);

  //     const res = await request(app)
  //       .get('/api/userdata/1/recommendations')
  //       .set('Cookie', [`jwt=${token}`]);

  //     expect(res.statusCode).toEqual(403);
  //     expect(res.body).toHaveProperty('message', 'Forbidden: Access denied');
  //   });
});
