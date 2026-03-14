import { Router } from "express";
import { authCallback, login, logout } from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", login);
router.get("/callback", authCallback);
router.get("/logout", logout);

export default router;
