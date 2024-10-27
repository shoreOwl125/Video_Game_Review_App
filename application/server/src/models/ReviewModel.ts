import { getPool } from "../connections/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Review as ReviewInterface } from "../interfaces/Review";

class ReviewModel {
  async createReview(
    review: Omit<ReviewInterface, "review_id" | "created_at" | "updated_at">
  ): Promise<number> {
    const pool = getPool();
    const sql = `
      INSERT INTO reviews (user_id, game_id, rating, review_text)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query<ResultSetHeader>(sql, [
      review.user_id,
      review.game_id,
      review.rating,
      review.review_text,
    ]);

    return result.insertId;
  }

  async getReviewById(review_id: number): Promise<ReviewInterface | null> {
    const pool = getPool();
    const sql = "SELECT * FROM reviews WHERE review_id = ?";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [review_id]);

    return rows.length ? (rows[0] as ReviewInterface) : null;
  }

  async updateReview(
    review_id: number,
    updates: Partial<ReviewInterface>
  ): Promise<void> {
    const pool = getPool();
    const fields = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(review_id);
    const sql = `UPDATE reviews SET ${fields.join(", ")} WHERE review_id = ?`;
    await pool.query(sql, values);
  }

  async deleteReview(review_id: number): Promise<void> {
    const pool = getPool();
    const sql = "DELETE FROM reviews WHERE review_id = ?";
    await pool.query(sql, [review_id]);
  }
}

export default ReviewModel;
