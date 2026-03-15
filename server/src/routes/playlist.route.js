import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../controllers/playlist.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getUserPlaylists);
router.get("/:id", getPlaylistById);
router.post("/", createPlaylist);
router.post("/:id/songs", addSongToPlaylist);
router.delete("/:id/songs/:songId", removeSongFromPlaylist);
router.delete("/:id", deletePlaylist);

export default router;
