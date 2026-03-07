import { Router } from "express";
import { authCallback, login, signup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/callback", authCallback);

export default router;
