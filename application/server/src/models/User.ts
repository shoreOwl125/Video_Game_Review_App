import dotenv from "dotenv";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

dotenv.config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_STRING,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: 5432, // Adjust this if needed
});

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
    const [
      rows,
    ] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [
      userId,
    ]);
    const [userRow] = rows as IUserRow[];

    return userRow;
  }
}

export default User;
