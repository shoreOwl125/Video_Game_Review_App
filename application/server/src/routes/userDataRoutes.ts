import { Router } from "express";
import {
  createUserData,
  getUserDataById,
  updateUserData,
  deleteUserData,
} from "../controllers/userDataController";

const router = Router();

router.post("/", createUserData);
router.get("/:id", getUserDataById);
router.put("/:id", updateUserData);
router.delete("/:id", deleteUserData);

export default router;
