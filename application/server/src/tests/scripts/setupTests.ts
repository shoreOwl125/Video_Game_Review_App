import { getPool } from '../../connections/database';

export const resetDatabase = async () => {
  const pool = getPool();
  await pool.query('SET FOREIGN_KEY_CHECKS=0');
  await pool.query('DELETE FROM reviews');
  await pool.query('DELETE FROM users');
  await pool.query('DELETE FROM games');
  await pool.query('DELETE FROM user_data');
  await pool.query('SET FOREIGN_KEY_CHECKS=1');
};

export const seedDatabase = async () => {
  const pool = getPool();

  await pool.query(`
    INSERT INTO users (id, name, email, password, theme_preference)
    VALUES
      (1, 'Test User', 'testuser@example.com', 'password123', 'light')
  `);

  await pool.query(`
    INSERT INTO games (game_id, title, genre, developer, publisher)
    VALUES
      (1, 'Test Game', 'Action', 'Test Developer', 'Test Publisher')
  `);

  await pool.query(`
    INSERT INTO reviews (user_id, game_id, rating, review_text)
    VALUES
      (1, 1, 4, 'Good game')
  `);
};

export const closeDatabase = async () => {
  const pool = getPool();
  await pool.end();
};
