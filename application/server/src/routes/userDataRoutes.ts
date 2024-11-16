import { Router } from "express";
import {
  createUserData,
  getUserDataById,
  updateUserData,
  deleteUserData,
  getRecommendations,
} from "../controllers/userDataController";

const router = Router();

router.post("/", createUserData);
router.get("/:id", getUserDataById);
router.put("/:id", updateUserData);
router.delete("/:id", deleteUserData);
router.get("/:id/recommendations", getRecommendations);

export default router;
