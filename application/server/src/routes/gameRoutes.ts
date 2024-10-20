import { Request, Response, Router } from "express";
import { getPool } from "../connections/database";
import { RowDataPacket } from "mysql2";

const router = Router();

router.get("/search", async (req: Request, res: Response) => {
  const { query, genre, review_rating } = req.query;

  let sql = "SELECT * FROM games WHERE 1=1";
  let values: Array<string | number> = [];

  if (query) {
    sql += " AND title LIKE ?";
    values.push(`%${query}%`);
  }
  
  if (genre) {
    sql += " AND genre = ?";
    values.push(genre as string);
  }

  if (review_rating) {
    sql += " AND review_rating >= ?";
    values.push(Number(review_rating));
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(sql, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No games found" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error searching for games:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

export default router;
