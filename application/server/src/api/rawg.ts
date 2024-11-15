import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { getPool } from '../connections/database';
import { RowDataPacket } from 'mysql2';
import cron from 'cron';

dotenv.config();

const RAWG_API_KEY = process.env.RAWG_API_KEY;

if (!RAWG_API_KEY) {
  throw new Error('Missing RAWG_API_KEY in .env file');
}

interface GameData {
  id: number;
  name: string;
  description: string | null;
  genres: { name: string }[];
  tags: { name: string }[];
  platforms: { platform: { name: string } }[];
  playtime: number | null;
  developers: { name: string }[];
  publishers: { name: string }[];
  released: string | null;
  rating: number;
  background_image: string | null;
  esrb_rating: { name: string } | null;
  metacritic: number | null;
}

const getGameById = async (gameId: number): Promise<GameData | null> => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`
    );
    if (!response.ok) {
      console.error(`Failed to fetch game: ${response.statusText}`);
      return null;
    }
    const data: GameData = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching game:', error);
    return null;
  }
};

const addNewGamesToDatabase = async (games: any[]): Promise<void> => {
  const pool = getPool();
  const gamesToInsert: any[] = [];

  for (const game of games) {
    try {
      const title = game.name;
      const description = game.description || '';
      const genre = game.genres.map((g: any) => g.name).join(', ') || null;
      const tags = JSON.stringify(game.tags.map((tag: any) => tag.name));
      const platforms = JSON.stringify(
        game.platforms.map((p: any) => p.platform.name)
      );
      const playtime_estimate = game.playtime || 0;
      const developer =
        game.developers?.length > 0 ? game.developers[0].name : 'Unknown';
      const publisher =
        game.publishers?.length > 0 ? game.publishers[0].name : 'Unknown';
      const game_mode = platforms.includes('multiplayer')
        ? 'multiplayer'
        : 'single-player';
      const release_date = game.released;
      const review_rating = game.rating ? Math.round(game.rating) : 0;
      const cover_image = game.background_image;

      // Check if the game already exists
      const checkQuery = 'SELECT * FROM games WHERE title = ?';
      const [rows] = await pool.query<RowDataPacket[]>(checkQuery, [title]);

      if (rows.length > 0) {
        console.log(`Game "${title}" already exists in the database.`);
        continue;
      }

      gamesToInsert.push([
        title,
        description,
        genre,
        tags,
        platforms,
        playtime_estimate,
        developer,
        publisher,
        game_mode,
        release_date,
        review_rating,
        cover_image,
      ]);
    } catch (error) {
      console.error(`Error processing game "${game.name}":`, error);
    }
  }

  if (gamesToInsert.length > 0) {
    try {
      const insertQuery = `
        INSERT INTO games (title, description, genre, tags, platforms, playtime_estimate, developer, publisher, game_mode, release_date, review_rating, cover_image)
        VALUES ?
      `;
      await pool.query(insertQuery, [gamesToInsert]);
      console.log(`${gamesToInsert.length} new games added to the database.`);
    } catch (error) {
      console.error('Error inserting games into the database:', error);
    }
  } else {
    console.log('No new games to add.');
  }
};

const fetchNewGames = async (maxFetch: number = 50): Promise<any[]> => {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  const today = new Date();

  const startDate = tenDaysAgo.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?dates=${startDate},${endDate}&key=${RAWG_API_KEY}&page_size=${maxFetch}`
    );
    if (!response.ok) {
      console.error(`Failed to fetch new games: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.results.slice(0, maxFetch) || [];
  } catch (error) {
    console.error('Error fetching new games:', error);
    return [];
  }
};

const job = new cron.CronJob('0 0 */10 * *', async () => {
  console.log('Running cron job to fetch and add new games...');
  const maxFetch = 50; // Limit to 50 games
  const newGames = await fetchNewGames(maxFetch);
  if (newGames.length > 0) {
    await addNewGamesToDatabase(newGames);
  } else {
    console.log('No new games found.');
  }
});
job.start();

export { getGameById, addNewGamesToDatabase, fetchNewGames };
