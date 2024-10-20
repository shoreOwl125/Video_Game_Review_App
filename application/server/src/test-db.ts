import { createPool, createConnection, Pool, Connection } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("Environment:", process.env.NODE_ENV);

let connection: Pool;

if (process.env.NODE_ENV === "development") {
  connection = createPool({
    host: process.env.DEV_HOST,
    user: process.env.DEV_USER_STRING,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DATABASE,
  });
} else {
  connection = createPool({
    host: process.env.HOST,
    user: process.env.USER_STRING,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });
}

async function testConnection() {
  try {
    const [results] = await connection.query("SELECT * FROM users");
    console.log("Users:", results);
  } catch (error) {
    console.error("Query error:", error);
  } finally {
    await connection.end();
    console.log("Connection pool closed.");
  }
}

testConnection();
