import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import request from "supertest";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import app from "../app";
import { Request, Response, NextFunction } from "express";
import { User as UserInterface } from "../interfaces/User"; // Import User interface

// Configure the Google OAuth strategy directly in the test file
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "test-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "test-client-secret",
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Simulate user retrieval or creation
      const user: UserInterface = {
        id: 1,
        name: profile.displayName || "Test User",
        email: profile.emails?.[0]?.value || "testuser@gmail.com",
        password: "", // No password for OAuth users
        theme_preference: "light", // Default theme preference
        user_data_id: null, // Set user_data_id to null or a test value
        created_at: new Date(), // Mock creation date
        updated_at: new Date(), // Mock update date
      };
      done(null, user);
    }
  )
);

// Initialize passport (required since we're configuring it here)
app.use(passport.initialize());

// Suppress console.log and console.error during tests (optional)
beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Google OAuth", () => {
  it("should redirect to Google login page", async () => {
    const response = await request(app).get("/api/auth/google");

    expect(response.status).toBe(302);
    expect(response.headers.location).toMatch(/accounts\.google\.com/);
  });

  it("should handle Google callback and authenticate user", async () => {
    // Mock the authentication process
    jest
      .spyOn(passport, "authenticate")
      .mockImplementation(
        (
          strategy: string,
          options: any,
          callback?: (...args: any[]) => any
        ) => {
          return (req: Request, res: Response, next: NextFunction) => {
            if (callback) {
              const user: UserInterface = {
                id: 1,
                name: "Test User",
                email: "testuser@gmail.com",
                password: "",
                theme_preference: "light", // Default theme preference
                user_data_id: null, // Set user_data_id to null or a test value
                created_at: new Date(), // Mock creation date
                updated_at: new Date(), // Mock update date
              };
              callback(null, user, {});
            } else {
              next();
            }
          };
        }
      );

    const response = await request(app).get("/api/auth/google/callback");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("name", "Test User");
    expect(response.body).toHaveProperty("email", "testuser@gmail.com");

    // Check if JWT cookie is set
    const cookies: string[] = Array.isArray(response.headers["set-cookie"])
      ? response.headers["set-cookie"]
      : [response.headers["set-cookie"]];
    expect(cookies).toBeDefined();

    const jwtCookie = cookies.find((cookie: string) =>
      cookie.startsWith("jwt=")
    );
    expect(jwtCookie).toBeDefined();
  });

  it("should handle authentication failure", async () => {
    // Mock the authentication process to simulate failure
    jest
      .spyOn(passport, "authenticate")
      .mockImplementation(
        (
          strategy: string,
          options: any,
          callback?: (
            err: Error | null,
            user: UserInterface | false,
            info: any
          ) => void
        ) => {
          return (req: Request, res: Response, next: NextFunction) => {
            if (callback) {
              callback(new Error("Authentication failed"), false, {});
            } else {
              next();
            }
          };
        }
      );

    const response = await request(app).get("/api/auth/google/callback");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Google authentication failed"
    );
  });
});
