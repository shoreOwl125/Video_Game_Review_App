import bcrypt from "bcryptjs";
import { getPool } from "../connections/database";
import { RowDataPacket } from "mysql2/promise";
import { User as UserInterface } from "../interfaces/User";
class User {
  static async create(
    user: Omit<UserInterface, "id" | "created_at" | "updated_at">
  ): Promise<UserInterface> {
    const { name, email, password, theme_preference, user_data_id } = user;
    const pool = getPool();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      "INSERT INTO users (name, email, password, theme_preference, user_data_id) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, theme_preference, user_data_id]
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const userRow = rows[0] as UserInterface;

    return userRow;
  }

  static async findByEmail(email: string): Promise<UserInterface | undefined> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const userRow = rows[0] as UserInterface;
    return userRow || undefined;
  }

  static async comparePassword(
    storedPassword: string,
    enteredPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, storedPassword);
  }

  static async findById(userId: number): Promise<UserInterface | undefined> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );
    const userRow = rows[0] as UserInterface;
    return userRow || undefined;
  }
}

export default User;
