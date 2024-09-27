import { createPool, Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool: Pool;

function connectUserDB() {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    pool = createPool({
      host: process.env.DEV_HOST,
      user: process.env.DEV_USER_STRING,
      password: process.env.DEV_PASSWORD || "",
      database: process.env.DEV_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Development connection pool created");
  } else {
    pool = createPool({
      host: process.env.HOST,
      user: process.env.USER_STRING,
      password: process.env.PASSWORD || "",
      database: process.env.DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Production connection pool created");
  }
}

export { connectUserDB, pool };
