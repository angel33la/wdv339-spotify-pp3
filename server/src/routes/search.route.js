import { Router } from "express";
import {
    allSongs,
    getSong,
    createSong,
    editSong,
    deleteSong,
} from "../controllers/search.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/allSongs", protectRoute, requireAdmin, allSongs);
router.get("/song", protectRoute, requireAdmin, getSong);
router.post("/song", protectRoute, requireAdmin, createSong);
router.put("/songs/:id", protectRoute, requireAdmin, editSong);
router.delete("/songs/:id", protectRoute, requireAdmin, deleteSong);

export default router;
