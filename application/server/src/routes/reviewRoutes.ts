import { Router } from "express";
import {
  createReview,
  getReviewById,
  getReviewByGameId,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";

const router = Router();

router.post("/", createReview);
router.get("/:id", getReviewById);
router.get("/game/:gameId", getReviewByGameId);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
