// app.ts

import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { connectUserDB } from './connections/database';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { authenticate } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorMiddleware';
import path from 'path';
import authRouter from './routes/authRoutes';
import searchRouter from './routes/gameRoutes';
import userDataRouter from './routes/userDataRoutes';
import userRouter from './routes/userRoutes';
import gameRouter from './routes/gameRoutes';
import reviewRoter from './routes/reviewRoutes';
// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
//app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "connect-src": ["'self'", "http://127.0.0.1:8000"],
      },
    },
  })
);


const allowedOrigins = [
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'https://gameratings-63hlr9lx0-abccodes-projects.vercel.app/',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// telling server where to serve static files from first
app.use(express.static(path.join(__dirname, "../../web/public")));

// google oauth setup with passport google strategy
app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!, // Ensure you have GOOGLE_CLIENT_ID in your .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Ensure you have GOOGLE_CLIENT_SECRET in your .env
      callbackURL: '/api/auth/google/callback', // This should match the route in your authRouter
    },
    (accessToken, refreshToken, profile, done) => {
      // For now, we'll just pass the profile on
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj: any, done) => {
  done(null, obj as Express.User);
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', authenticate, userRouter);
app.use('/api/games', gameRouter);
app.use('/api/userdata', userDataRouter);
app.use('/api/reviews', reviewRoter);


// Fallback root route if index.html is not found
app.get("/", (req, res) => {
  res.send("The server is working, but the index page isn’t loading.");
});


// Error handling middleware
app.use(errorHandler);

// Database connection
connectUserDB(); // No need to assign pool here, unless you use it in this file

export default app;
