import bcrypt from "bcryptjs";
import { getPool } from "../connections/userDB";  // Use getPool to retrieve the connection pool

// Define the User interface
interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
}

interface IUserRow {
  id: number;
  name: string;
  email: string;
  password: string;
}

class User {
  static async create(user: IUser) {
    const { name, email, password } = user;

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Get the pool using getPool()
    const pool = getPool();

    // Create a new user in the database
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // Retrieve the newly inserted user
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const [userRow] = rows as IUserRow[]; // Type assertion

    return userRow;
  }

  static async findByEmail(email: string) {
    // Get the pool using getPool()
    const pool = getPool();

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const [userRow] = rows as IUserRow[]; // Type assertion

    return userRow;
  }

  static async comparePassword(
    storedPassword: string,
    enteredPassword: string
  ) {
    return await bcrypt.compare(enteredPassword, storedPassword);
  }

  static async findById(userId: number) {
    // Get the pool using getPool()
    const pool = getPool();

    const [rows] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [
      userId,
    ]);

    const [userRow] = rows as IUserRow[];

    return userRow;
  }
}

export default User;
