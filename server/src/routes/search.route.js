import { Router } from "express";
import { searchSongs } from "../controllers/search.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, searchSongs);

export default router;
