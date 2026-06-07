// routes/userRoutes.js
import express from "express";
import {
  getUsers,
  updateProfile,
  getUserById,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", protect, isAdmin, getUsers);
router.put("/profile/:id", protect, updateProfile);
router.get("/:id", getUserById);

export default router;
