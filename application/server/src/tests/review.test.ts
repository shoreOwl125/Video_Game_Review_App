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

const pool = getPool();

function generateMockToken(userId: number): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'testsecret', {
    expiresIn: '1h',
  });
}

function authenticatedRequest(
  userId: number,
  method: 'get' | 'post' | 'put' | 'delete',
  url: string
) {
  const token = generateMockToken(userId);

  return request(app)
    [method](url)
    .set('Cookie', [`jwt=${token}`]);
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
    const reviewData = {
      game_id: 1,
      rating: 4,
      review_text: 'Great game!',
    };

    const res = await authenticatedRequest(1, 'post', '/api/reviews').send(
      reviewData
    );

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Review created successfully');
    expect(res.body).toHaveProperty('reviewId');

    const [reviews] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM reviews WHERE review_id = ?',
      [res.body.reviewId]
    );
    expect(reviews.length).toEqual(1);
    expect(reviews[0].review_text).toEqual(reviewData.review_text);
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
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized: No token provided'
    );
  });

  it('should update a review successfully when authenticated', async () => {
    const reviewId = 1;
    const updates = { rating: 5, review_text: 'Excellent game!' };

    const res = await authenticatedRequest(
      1,
      'put',
      `/api/reviews/${reviewId}`
    ).send(updates);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review updated successfully');

    const [updatedReview] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM reviews WHERE review_id = ?',
      [reviewId]
    );
    expect(updatedReview[0].rating).toEqual(updates.rating);
    expect(updatedReview[0].review_text).toEqual(updates.review_text);
  });

  it('should not update a review when unauthenticated', async () => {
    const reviewId = 1;
    const updates = { rating: 5, review_text: 'Excellent game!' };

    const res = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .send(updates);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized: No token provided'
    );
  });

  it('should delete a review by ID when authenticated', async () => {
    const reviewId = 1;

    const res = await authenticatedRequest(
      1,
      'delete',
      `/api/reviews/${reviewId}`
    ).send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review deleted successfully');

    const [deletedReview] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM reviews WHERE review_id = ?',
      [reviewId]
    );
    expect(deletedReview.length).toEqual(0);
  });

  it('should not delete a review by ID when unauthenticated', async () => {
    const reviewId = 1;

    const res = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized: No token provided'
    );
  });
});
