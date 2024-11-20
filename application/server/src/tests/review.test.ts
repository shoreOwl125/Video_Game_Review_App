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

  it('should create a review successfully when authenticated', async () => {
    const token = generateMockToken(1);

    const reviewData = {
      game_id: 1,
      rating: 4,
      review_text: 'Great game!',
    };

    const res = await request(app)
      .post('/api/reviews')
      .set('Cookie', [`jwt=${token}`])
      .send(reviewData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Review created successfully');
    expect(res.body).toHaveProperty('reviewId');
  });

  it('should not create a review when unauthenticated', async () => {
    const reviewData = {
      game_id: 1,
      rating: 4,
      review_text: 'Great game!',
    };

    const res = await request(app)
      .post('/api/reviews')
      .send(reviewData);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('should update a review successfully when authenticated', async () => {
    const token = generateMockToken(1);

    const [reviews] = await pool.query<RowDataPacket[]>(
      'SELECT review_id, user_id FROM reviews WHERE user_id = 1'
    );

    const reviewId = reviews[0].review_id;
    const updates = { rating: 5, review_text: 'Excellent game!' };

    const res = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .set('Cookie', [`jwt=${token}`])
      .send(updates);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review updated successfully');
  });

  it('should delete a review by ID when authenticated', async () => {
    const token = generateMockToken(1);

    const [reviews] = await pool.query<RowDataPacket[]>(
      'SELECT review_id, user_id FROM reviews WHERE user_id = 1'
    );

    const reviewId = reviews[0].review_id;

    const res = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set('Cookie', [`jwt=${token}`]);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review deleted successfully');
  });

  it('should not update a review when unauthenticated', async () => {
    const [reviews] = await pool.query<RowDataPacket[]>(
      'SELECT review_id, user_id FROM reviews WHERE user_id = 1'
    );
    const reviewId = reviews[0].review_id;
    const updates = { rating: 5, review_text: 'Excellent game!' };

    const res = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .send(updates);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('should not delete a review by ID when unauthenticated', async () => {
    const [reviews] = await pool.query<RowDataPacket[]>(
      'SELECT review_id, user_id FROM reviews WHERE user_id = 1'
    );
    const reviewId = reviews[0].review_id;

    const res = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });
});
