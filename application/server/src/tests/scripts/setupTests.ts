import { getPool } from '../../connections/database';

export const resetDatabase = async () => {
  const pool = getPool();
  await pool.query('SET FOREIGN_KEY_CHECKS=0');
  await pool.query('TRUNCATE TABLE reviews');
  await pool.query('TRUNCATE TABLE users');
  await pool.query('TRUNCATE TABLE games');
  await pool.query('TRUNCATE TABLE user_data');
  await pool.query('SET FOREIGN_KEY_CHECKS=1');
};

export const seedDatabase = async () => {
  const pool = getPool();

  await pool.query(`
    INSERT INTO users (id, name, email, password, theme_preference)
    VALUES
    (1, 'Test User 1', 'testuser1@example.com', 'password123', 'dark'),
    (2, 'Test User 2', 'testuser2@example.com', 'password123', 'light')
  `);

  await pool.query(`
    INSERT INTO user_data (id, search_history, interests, view_history, review_history, genres)
    VALUES
    (1, '["game1", "game2"]', '["sports", "action"]', '["game1"]', '["1", "2"]', '["RPG", "Adventure"]'),
    (2, '["game3", "game4"]', '["strategy", "puzzle"]', '["game3"]', '["3", "4"]', '["Puzzle", "Strategy"]')
  `);

  await pool.query(`
    INSERT INTO games (game_id, title, genre, developer, publisher)
    VALUES
    (1, 'Test Game 1', 'Action', 'Test Developer', 'Test Publisher')
  `);

  await pool.query(`
    INSERT INTO reviews (review_id, user_id, game_id, rating, review_text)
    VALUES
    (1, 1, 1, 4, 'Good game')
  `);
};

export const closeDatabase = async () => {
  const pool = getPool();
  await pool.end();
};
