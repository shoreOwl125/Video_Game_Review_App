import express from "express";
import authRouter from "./routes/authRoutes";
import { connectUserDB } from "./connections/userDB";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes";
import gameRoutes from "./routes/gameRoutes";  // Updated import
import { authenticate } from "./middleware/authMiddleware";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();

const app = express();

// Middleware setup
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",  // Make sure this is the correct front-end URL
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route setup
app.use("/api/auth", authRouter);  // Add a base path like /api for better organization
app.use("/api/users", authenticate, userRouter);
app.use("/api/games", gameRoutes);  // Use /api/games for games routes

// Error handling middleware
app.use(errorHandler);

// Database connection
connectUserDB();  // No need to assign pool here, unless you use it in this file

export default app;
