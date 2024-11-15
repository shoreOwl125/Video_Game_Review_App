import request from 'supertest';
import app from '../app';
import * as tf from '@tensorflow/tfjs';
import { getPool as actualGetPool } from '../connections/database';
import { generateEmbeddings } from '../ml/embeddingService';
import { Game as GameInterface } from '../interfaces/Game';

// Mock Universal Sentence Encoder
jest.mock('@tensorflow-models/universal-sentence-encoder', () => ({
  load: jest.fn().mockResolvedValue({
    embed: jest.fn(async (input: string[]) => {
      return tf.tensor2d(
        input.map(() => [0.1, 0.2, 0.3, 0.4]),
        [input.length, 4]
      );
    }),
  }),
}));

// Mock Database Connection
jest.mock('../connections/database', () => {
  const originalModule = jest.requireActual('../connections/database');
  return {
    ...originalModule,
    getPool: jest.fn().mockReturnValue({
      query: jest.fn().mockImplementation((query: string, values) => {
        if (query.includes('FROM games')) {
          return [
            [
              { title: 'Game1', description: 'Desc1' },
              { title: 'Game2', description: 'Desc2' },
            ],
          ];
        }
        if (query.includes('FROM user_data WHERE id = ?') && values[0] === 1) {
          return [[{ id: 1, interests: ['Action', 'Adventure'] }]];
        }
        return [[]];
      }),
    }),
  };
});

describe('Recommendations API Tests', () => {
  it('should fetch games data successfully', async () => {
    const res = await request(app).get('/api/recommendations/fetchGames');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('description');
    }
  });

  it('should fetch user data successfully', async () => {
    const res = await request(app).get('/api/recommendations/fetchUser/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('interests');
  });

  it('should generate PCA-reduced embeddings successfully', async () => {
    const res = await request(app).get(
      '/api/recommendations/generateEmbeddingsWithPCA'
    );
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(Array.isArray(res.body[0])).toBe(true);
      expect(res.body[0].length).toEqual(2);
    }
  });

  // New test to check if generateEmbeddings creates correct shape
  it('generateEmbeddings should create embeddings with correct shape', async () => {
    const sampleGames: GameInterface[] = [
      {
        game_id: 1,
        title: 'Sample Game 1',
        description: 'An exciting adventure',
        genre: 'Adventure',
        tags: [], // Use empty array for tags
        platforms: [],
        playtime_estimate: 20,
        developer: 'Sample Dev',
        publisher: 'Sample Publisher',
        game_mode: 'single-player',
        release_date: new Date('2022-01-01'),
        review_rating: 5,
        cover_image: '/path/to/image1.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        game_id: 2,
        title: 'Sample Game 2',
        description: 'A thrilling mystery',
        genre: 'Mystery',
        tags: [],
        platforms: [],
        playtime_estimate: 30,
        developer: 'Sample Dev',
        publisher: 'Sample Publisher',
        game_mode: 'multiplayer',
        release_date: new Date('2022-06-01'),
        review_rating: 4,
        cover_image: '/path/to/image2.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const embeddings = await generateEmbeddings(sampleGames);
    expect(embeddings).toBeInstanceOf(tf.Tensor);
    expect(embeddings.shape[0]).toBe(sampleGames.length); // Check that it matches number of input games
    expect(embeddings.shape[1]).toBeGreaterThan(0); // Ensure there is at least one embedding dimension
  });
});
