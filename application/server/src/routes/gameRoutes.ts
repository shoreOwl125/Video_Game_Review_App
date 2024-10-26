import { Request, Response, Router } from "express";
import { getPool } from "../connections/database";
import { RowDataPacket } from "mysql2";
import { Game } from "../interfaces/Game"; // Import the Game interface

const router = Router();

router.get("/search", async (req: Request, res: Response) => {
  const { query, genre, review_rating } = req.query;

  let sql = "SELECT * FROM games WHERE 1=1";
  let values: Array<string | number> = [];

  // Filter by title (search query)
  if (query) {
    sql += " AND title LIKE ?";
    values.push(`%${query}%`);
  }

  // Filter by genre
  if (genre) {
    sql += " AND genre = ?";
    values.push(genre as string);
  }

  // Filter by review rating
  if (review_rating) {
    sql += " AND review_rating >= ?";
    values.push(Number(review_rating));
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(sql, values);

    // Map rows to Game interface
    const games: Game[] = rows.map((row) => ({
      game_id: row.game_id,
      title: row.title,
      description: row.description,
      genre: row.genre,
      release_date: row.release_date,
      cover_image: row.cover_image,
      review_rating: row.review_rating,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    if (games.length === 0) {
      return res.status(404).json({ message: "No games found" });
    }

    return res.status(200).json(games);
  } catch (error) {
    console.error("Error searching for games:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

export default router;
