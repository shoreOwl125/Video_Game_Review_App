import request from 'supertest';
import app from '../app';
import { getPool } from '../connections/database';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import {
  resetDatabase,
  seedDatabase,
  closeDatabase,
} from './scripts/setupTests';

let pool = getPool();

function generateMockToken(userId: number): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'testsecret', {
    expiresIn: '1h',
  });
}

describe('Review Routes API Tests', () => {
  beforeEach(async () => {
    await resetDatabase();
    await seedDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });
  it('should update a review successfully', async () => {
    const token = generateMockToken(1);
    console.log('Token for update test:', token);

    const [reviews] = await pool.query<RowDataPacket[]>(
      'SELECT review_id, user_id FROM reviews WHERE user_id = 1'
    );
    console.log('Reviews in DB:', reviews);

    const reviewId = reviews[0].review_id;
    const updates = { rating: 5, review_text: 'Excellent game!' };

    const res = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .set('Cookie', [`jwt=${token}`])
      .send(updates);

    console.log('Update response:', res.statusCode, res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review updated successfully');
  });

  it('should delete a review by ID', async () => {
    const token = generateMockToken(1);
    console.log('Token for delete test:', token);

    const [reviews] = await pool.query<RowDataPacket[]>(
      'SELECT review_id, user_id FROM reviews WHERE user_id = 1'
    );
    console.log('Reviews in DB:', reviews);

    const reviewId = reviews[0].review_id;

    const res = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set('Cookie', [`jwt=${token}`]);

    console.log('Delete response:', res.statusCode, res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review deleted successfully');
  });
});
