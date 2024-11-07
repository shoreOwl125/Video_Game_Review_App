import { getPool } from '../connections/database';
import { Game as GameInterface } from '../interfaces/Game';

class Game {
  // Method to add a new game
  addGame = async (
    game: Omit<GameInterface, 'game_id' | 'created_at' | 'updated_at'>
  ): Promise<void> => {
    const sql = `
      INSERT INTO games (title, description, genre, tags, platforms, playtime_estimate, popularity_score, developer, publisher, game_mode, release_date, release_year_bucket, price_range, review_rating, cover_image, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const pool = getPool();
    const values = [
      game.title,
      game.description,
      game.genre,
      JSON.stringify(game.tags),
      JSON.stringify(game.platforms),
      game.playtime_estimate,
      game.popularity_score,
      game.developer,
      game.publisher,
      game.game_mode,
      game.release_date,
      game.release_year_bucket,
      game.price_range,
      game.review_rating,
      game.cover_image,
    ];

    await pool.query(sql, values);
  };

  // Method to find games based on filters
  findGames = async (
    query: string = '',
    genres: string = '',
    minReviewRating: number = 0,
    gameMode?: GameInterface['game_mode'],
    priceRange?: GameInterface['price_range']
  ): Promise<GameInterface[]> => {
    const pool = getPool();
    let sql = 'SELECT * FROM games WHERE 1=1';
    const values: (string | number)[] = [];

    // Title search
    if (query) {
      sql += ' AND title LIKE ?';
      values.push(`%${query}%`);
    }

    // Genre filtering with partial matching
    if (genres) {
      const genreList = genres.split(',').map(g => g.trim());
      sql += ' AND (' + genreList.map(() => 'genre LIKE ?').join(' OR ') + ')';
      values.push(...genreList.map(genre => `%${genre}%`));
    }

    // Minimum review rating
    if (minReviewRating) {
      sql += ' AND review_rating >= ?';
      values.push(minReviewRating);
    }

    // Game mode filtering
    if (gameMode) {
      sql += ' AND game_mode = ?';
      values.push(gameMode);
    }

    // Price range filtering
    if (priceRange) {
      sql += ' AND price_range = ?';
      values.push(priceRange);
    }

    console.log(`Final SQL Query: ${sql} with values:`, values);

    const [rows] = await pool.query(sql, values);
    return rows as GameInterface[];
  };

  // Method to delete a game by ID
  deleteGame = async (gameId: number): Promise<void> => {
    const sql = 'DELETE FROM games WHERE game_id = ?';
    const pool = getPool();
    await pool.query(sql, [gameId]);
  };

  // Method to update game details
  updateGame = async (
    gameId: number,
    updates: Partial<GameInterface>
  ): Promise<void> => {
    const fields = [];
    const values: (string | number)[] = [];
    const pool = getPool();

    for (const [key, value] of Object.entries(updates)) {
      if (key === 'tags' || key === 'platforms') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value as string | number);
      }
    }
    values.push(gameId);

    const sql = `UPDATE games SET ${fields.join(', ')} WHERE game_id = ?`;
    await pool.query(sql, values);
  };

  // Method to get a game by ID
  getGameById = async (gameId: number): Promise<GameInterface | null> => {
    const sql = 'SELECT * FROM games WHERE game_id = ?';
    const pool = getPool();
    const [rows] = await pool.query(sql, [gameId]);

    return (rows as GameInterface[])[0] || null;
  };

  // Method to get all games with a limit
  getAllGames = async (limit: number = 50): Promise<GameInterface[]> => {
    const sql = 'SELECT * FROM games LIMIT ?';
    const pool = getPool();
    const [rows] = await pool.query(sql, [limit]);
    return rows as GameInterface[];
  };
}

export default Game;
