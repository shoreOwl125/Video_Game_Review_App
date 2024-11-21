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
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'testsecret', {
    expiresIn: '1h',
  });
  console.log(`Generated token for userId ${userId}: ${token}`);
  return token;
}

function authenticatedRequest(
  userId: number,
  method: 'get' | 'post' | 'put' | 'delete',
  url: string
) {
  const token = generateMockToken(userId);

  switch (method) {
    case 'get':
      return request(app)
        .get(url)
        .set('Cookie', [`jwt=${token}`]);
    case 'post':
      return request(app)
        .post(url)
        .set('Cookie', [`jwt=${token}`]);
    case 'put':
      return request(app)
        .put(url)
        .set('Cookie', [`jwt=${token}`]);
    case 'delete':
      return request(app)
        .delete(url)
        .set('Cookie', [`jwt=${token}`]);
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
}

describe('Review Routes API Tests', () => {
  //   beforeEach(async () => {
  //     await resetDatabase();
  //     await seedDatabase();
  //   });

  //   afterAll(async () => {
  //     await closeDatabase();
  //   });

  //   it('should create a review successfully when authenticated', async () => {
  //     const reviewData = {
  //       game_id: 1,
  //       rating: 4,
  //       review_text: 'Great game!',
  //     };

  //     const res = await authenticatedRequest(1, 'post', '/api/reviews').send(
  //       reviewData
  //     );

  //     console.log('Create review response:', res.body);
  //     expect(res.statusCode).toEqual(201);
  //     expect(res.body).toHaveProperty('message', 'Review created successfully');
  //     expect(res.body).toHaveProperty('reviewId');
  //   });

  // it('should not create a review when unauthenticated', async () => {
  //   const reviewData = {
  //     game_id: 1,
  //     rating: 4,
  //     review_text: 'Great game!',
  //   };

  //   const res = await request(app)
  //     .post('/api/reviews')
  //     .send(reviewData);

  //   console.log('Create review unauthenticated response:', res.body);
  //   expect(res.statusCode).toEqual(401);
  //   expect(res.body).toHaveProperty('message', 'Unauthorized');
  // });

  // it('should update a review successfully when authenticated', async () => {
  //   const reviewId = 1; // Ensure the review_id belongs to user_id=1 in seeded data
  //   const updates = { rating: 5, review_text: 'Excellent game!' };

  //   const res = await authenticatedRequest(
  //     1,
  //     'put',
  //     `/api/reviews/${reviewId}`
  //   ).send(updates);

  //   console.log('Update review response:', res.body);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body).toHaveProperty('message', 'Review updated successfully');
  // });

  // it('should delete a review by ID when authenticated', async () => {
  //   const reviewId = 1; // Ensure the review_id belongs to user_id=1 in seeded data

  //   const res = await authenticatedRequest(
  //     1,
  //     'delete',
  //     `/api/reviews/${reviewId}`
  //   ).send();

  //   console.log('Delete review response:', res.body);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body).toHaveProperty('message', 'Review deleted successfully');
  // });

  it('should not update a review when unauthenticated', async () => {
    const reviewId = 1; // Ensure the review_id exists in seeded data
    const updates = { rating: 5, review_text: 'Excellent game!' };

    const res = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .send(updates);

    console.log('Update review unauthenticated response:', res.body);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('should not delete a review by ID when unauthenticated', async () => {
    const reviewId = 1; // Ensure the review_id exists in seeded data

    const res = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .send();

    console.log('Delete review unauthenticated response:', res.body);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });
});
