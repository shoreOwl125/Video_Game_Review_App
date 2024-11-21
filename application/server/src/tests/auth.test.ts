import request from 'supertest';
import app from '../app';
import {
  resetDatabase,
  seedDatabase,
  closeDatabase,
} from './scripts/setupTests';

describe('User Registration, Login, Logout, and Profile API Tests', () => {
  let uniqueEmail: string = '';
  let jwtCookie: string = '';

  beforeEach(async () => {
    await resetDatabase();
    await seedDatabase();
    uniqueEmail = `testuser@gmail.com`;
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: uniqueEmail,
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', uniqueEmail);
  });

  it('should log in the user with correct credentials and return a token in cookies', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: uniqueEmail,
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', uniqueEmail);

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/jwt=/);

    jwtCookie = cookies[0];
  });

  it('should log out the user and clear the JWT token from cookies', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: uniqueEmail,
        password: 'password123',
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: 'password123',
      });

    jwtCookie = loginRes.headers['set-cookie'][0];

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', jwtCookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User logged out');

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/jwt=;/);
  });
});
