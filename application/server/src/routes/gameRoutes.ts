import { getPool } from '../connections/userDB';
import { Router, Request, Response } from 'express';

const router = Router();

// Search games by title or genre
router.get('/search', async (req: Request, res: Response) => {
  const { query, genre } = req.query;

  try {
    let sql = 'SELECT * FROM games WHERE 1=1';
    let values: string[] = [];

    // If there's a search query
    if (query) {
      sql += ' AND title LIKE ?';
      values.push(`%${query}%`);
    }

    // If genre filter is provided
    if (genre) {
      sql += ' AND genre = ?';
      values.push(genre as string);
    }

    const [games] = await getPool().query(sql, values);

    res.json(games);
  } catch (error) {
    console.error('Error searching games:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
