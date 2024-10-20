import express from "express";
import authRouter from "./routes/authRoutes";
import { connectUserDB } from "./connections/userDB";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes";
import gameRoutes from "./routes/gameRoutes"; // Updated import
import { authenticate } from "./middleware/authMiddleware";
import { errorHandler } from "./middleware/errorMiddleware";
import path from "path";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // Ensure this matches your front-end URL
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the public folder

// Serve static files from the 'web/src' directory
app.use(express.static(path.join(__dirname, '..', '..', 'web', 'src'))); // Serve static files from web/src

// Route setup
app.use("/api/auth", authRouter);
app.use("/api/users", authenticate, userRouter);
app.use("/api/games", gameRoutes); // Use /api/games for games routes

// Serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'web', 'src', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Connect to the database
connectUserDB();

export default app;
