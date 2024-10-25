import bcrypt from "bcryptjs";
import { getPool } from "../connections/database"; // Use getPool to retrieve the connection pool
import { RowDataPacket } from "mysql2/promise"; // Import the correct type for result rows

// Define the User interface with id as required
interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

class User {
  // Accepts IUser without `id` when creating a new user
  static async create(user: Omit<IUser, "id">): Promise<IUser> {
    const { name, email, password } = user;

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Get the pool using getPool()
    const pool = getPool();

    // Insert the user into the database
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // Retrieve the newly inserted user
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const userRow = rows[0] as IUser; // Ensure TypeScript knows this is an IUser

    return userRow;
  }

  static async findByEmail(email: string): Promise<IUser | undefined> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const userRow = rows[0] as IUser;
    return userRow || undefined;
  }

  static async comparePassword(
    storedPassword: string,
    enteredPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, storedPassword);
  }

  static async findById(userId: number): Promise<IUser | undefined> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );
    const userRow = rows[0] as IUser;
    return userRow || undefined;
  }
}

export default User;
export type { IUser };
