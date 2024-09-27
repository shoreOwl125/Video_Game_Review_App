import express from "express";
import authRouter from "./routes/authRoutes";
import { connectUserDB } from "./connections/userDB";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes";
import { authenticate } from "./middleware/authMiddleware";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();

const app = express();

// Middleware setup
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route setup
app.use(authRouter);
app.use("/users", authenticate, userRouter);

// Error handling middleware
app.use(errorHandler);

// Database connection
const pool = connectUserDB();

export default app;
