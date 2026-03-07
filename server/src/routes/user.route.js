import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getAllUsers, deleteUser, getMessages } from "../controllers/user.controller.js";

const router = Router();

// Admin-only routes
router.get("/", protectRoute, requireAdmin, getAllUsers);
router.delete("/:userId", protectRoute, requireAdmin, deleteUser);
router.get("/messages/:userId", protectRoute, getMessages);

export default router;