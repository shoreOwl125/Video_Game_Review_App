import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2";

function connectUserDB() {
  // Log the database connection details for debugging
  console.log("Host:", process.env.HOST);
  console.log("User:", process.env.USER_STRING);
  console.log("Password:", process.env.PASSWORD);
  console.log("Database:", process.env.DATABASE);

  // Create the connection using environment variables
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_STRING,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error("Database connection error:", err);
      return;
    }
    console.log("Database connected successfully");

    // Perform the database query to fetch all users
    connection.query("SELECT * FROM users", (error, results) => {
      if (error) {
        console.error("Query error:", error);
        return;
      }
      console.log("Users:", results);

      // Close the connection
      connection.end();
    });
  });
}

// Export the function if you want to use it in other modules
export default connectUserDB;
