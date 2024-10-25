import express from "express";
import passport from "passport";
import {
  registerUser,
  authenticateUser,
  logoutUser,
  googleCallback,
} from "../controllers/authController";

const router = express.Router();

// Local authentication routes
router.post("/register", registerUser);
router.post("/login", authenticateUser);
router.post("/logout", logoutUser);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", googleCallback);

export default router;