import dotenv from "dotenv";
dotenv.config();
// console.log("Loaded environment variables:", process.env);
import mysql from "mysql2";

console.log("Host:", process.env.HOST);
console.log("User:", process.env.USER);
console.log("Password:", process.env.PASSWORD);
console.log("Database:", process.env.DATABASE);

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER_STRING,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Database connected successfully");

  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Query error:", error);
      return;
    }
    console.log("Users:", results);
    connection.end();
  });
});
