import { Request, Response, Router } from "express";
import { getPool } from "../connections/database";
import { RowDataPacket } from "mysql2";

const router = Router();

router.get("/search", async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const pool = getPool();

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM games WHERE title LIKE ?",
      [`%${query}%`]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No games found" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error searching for game:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

export default router;
