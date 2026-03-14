import { Router } from "express";
import { callback, login, logout } from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", login);
router.get("/callback", callback);
router.get("/logout", logout);

export default router;
