import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import app from '../app';
import { Request, Response, NextFunction } from 'express';
import { User as UserInterface } from '../interfaces/User';
import {
  resetDatabase,
  seedDatabase,
  closeDatabase,
} from './scripts/setupTests';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'test-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'test-client-secret',
      callbackURL: '/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const user: UserInterface = {
        id: 1,
        name: profile.displayName || 'Test User',
        email: profile.emails?.[0]?.value || 'testuser@gmail.com',
        password: '',
        profile_pic: '',
        theme_preference: 'light',
        user_data_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      done(null, user);
    }
  )
);

beforeEach(async () => {
  await resetDatabase();
  await seedDatabase();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Google OAuth', () => {
  it('should redirect to Google login page', async () => {
    const response = await request(app).get('/api/auth/google');

    expect(response.status).toBe(302);
    expect(response.headers.location).toMatch(/accounts\.google\.com/);
  });

  it('should handle authentication failure', async () => {
    jest
      .spyOn(passport, 'authenticate')
      .mockImplementation(
        (
          strategy: string,
          options: any,
          callback?: (
            err: Error | null,
            user: UserInterface | false,
            info: any
          ) => void
        ) => {
          return (req: Request, res: Response, next: NextFunction) => {
            if (callback) {
              callback(new Error('Authentication failed'), false, {});
            } else {
              next();
            }
          };
        }
      );

    const response = await request(app).get('/api/auth/google/callback');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Google authentication failed'
    );
  });
});
