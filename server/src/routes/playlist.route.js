import { Router } from "express";
import {
  getAllPlaylists,
  getPlaylistById,
} from "../controllers/playlist.controller.js";

const router = Router();

router.get("/", getAllPlaylists);
router.get("/:playlistId", getPlaylistById);

export default router;
