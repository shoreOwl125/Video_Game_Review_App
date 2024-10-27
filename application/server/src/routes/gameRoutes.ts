import { Router } from "express";
import {
  createGame,
  searchGames,
  removeGame,
  editGame,
  getGame,
} from "../controllers/gameController";

const router = Router();

// Route to add a new game
router.post("/", createGame);

// Route to search games with filters
router.get("/search", searchGames);

// Route to delete a game by ID
router.delete("/:gameId", removeGame);

// Route to update a game by ID
router.put("/:gameId", editGame);

// Route to get a game by ID
router.get("/:gameId", getGame);

export default router;
