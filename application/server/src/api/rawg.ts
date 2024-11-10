import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const RAWG_API_KEY = process.env.RAWG_API_KEY;

if (!RAWG_API_KEY) {
  throw new Error('Missing RAWG_API_KEY in .env file');
}

interface GameData {
  id: number;
  name: string;
  description: string;
  // Add any other fields you need from the response
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

// Example usage
// getGameById(3498).then(game => {
//   if (game) {
//     console.log('Game:', game);
//   } else {
//     console.log('Game not found or there was an error.');
//   }
// });

export { getGameById };
