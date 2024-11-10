import request from 'supertest';
import app from '../app';
import { getPool } from '../connections/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

let pool = getPool();

describe('Review API Tests', () => {
  beforeAll(async () => {
    if (pool === null) {
      pool = getPool();
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await pool.query('START TRANSACTION'); // Start a transaction for data isolation
  });

  afterEach(async () => {
    await pool.query('ROLLBACK'); // Rollback any changes to maintain test isolation
  });

  it('should create a new review successfully', async () => {
    await pool.query(
      "INSERT INTO users (id, name, email, password) VALUES (1, 'Test User', 'testuser@example.com', 'password')"
    );
    await pool.query(
      "INSERT INTO games (game_id, title, description, genre) VALUES (1, 'Test Game', 'A fun game', 'Action')"
    );

    const newReview = {
      user_id: 1,
      game_id: 1,
      rating: 4,
      review_text: 'Great game!',
    };

    const res = await request(app)
      .post('/api/reviews')
      .send(newReview);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Review created successfully');

    const [reviewData] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM reviews WHERE review_id = ?',
      [res.body.reviewId]
    );

    expect(reviewData.length).toEqual(1);
    expect(reviewData[0].rating).toEqual(newReview.rating);
    expect(reviewData[0].review_text).toEqual(newReview.review_text);
  });

  it('should retrieve a review by ID', async () => {
    await pool.query(
      "INSERT INTO users (id, name, email, password) VALUES (1, 'Test User', 'testuser@example.com', 'password')"
    );
    await pool.query(
      "INSERT INTO games (game_id, title, description, genre) VALUES (1, 'Test Game', 'A fun game', 'Action')"
    );

    const [result]: [ResultSetHeader, any] = await pool.query(
      "INSERT INTO reviews (user_id, game_id, rating, review_text) VALUES (1, 1, 4, 'Awesome game')"
    );

    const res = await request(app)
      .get(`/api/reviews/${result.insertId}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.rating).toEqual(4);
    expect(res.body.review_text).toEqual('Awesome game');
  });

  it('should update a review by ID', async () => {
    await pool.query(
      "INSERT INTO users (id, name, email, password) VALUES (1, 'Test User', 'testuser@example.com', 'password')"
    );
    await pool.query(
      "INSERT INTO games (game_id, title, description, genre) VALUES (1, 'Test Game', 'A fun game', 'Action')"
    );

    const [result]: [ResultSetHeader, any] = await pool.query(
      "INSERT INTO reviews (user_id, game_id, rating, review_text) VALUES (1, 1, 3, 'Good game')"
    );

    const res = await request(app)
      .put(`/api/reviews/${result.insertId}`)
      .send({ rating: 5, review_text: 'Excellent game!' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review updated successfully');

    const [updatedReview] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM reviews WHERE review_id = ?',
      [result.insertId]
    );

    expect(updatedReview[0].rating).toEqual(5);
    expect(updatedReview[0].review_text).toEqual('Excellent game!');
  });

  it('should delete a review by ID', async () => {
    await pool.query(
      "INSERT INTO users (id, name, email, password) VALUES (1, 'Test User', 'testuser@example.com', 'password')"
    );
    await pool.query(
      "INSERT INTO games (game_id, title, description, genre) VALUES (1, 'Test Game', 'A fun game', 'Action')"
    );

    const [result]: [ResultSetHeader, any] = await pool.query(
      "INSERT INTO reviews (user_id, game_id, rating, review_text) VALUES (1, 1, 3, 'Good game')"
    );

    const res = await request(app)
      .delete(`/api/reviews/${result.insertId}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Review deleted successfully');

    const [deletedReview] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM reviews WHERE review_id = ?',
      [result.insertId]
    );

    expect(deletedReview.length).toEqual(0);
  });
});
