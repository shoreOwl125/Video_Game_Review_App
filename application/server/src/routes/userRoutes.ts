import express from "express";
import { getUser } from "../controllers/userControllers";

const router = express.Router();

router.get("/:id", getUser);

export default router;
