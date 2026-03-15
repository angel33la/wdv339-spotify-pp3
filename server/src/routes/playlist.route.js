import { Router } from "express";
import {
  createPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistById,
} from "../controllers/playlist.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllPlaylists);
router.get("/:playlistId", getPlaylistById);
router.post("/", protectRoute, requireAdmin, createPlaylist);
router.delete("/:playlistId", protectRoute, requireAdmin, deletePlaylist);

export default router;
