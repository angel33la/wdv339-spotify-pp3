import { Router } from "express";
import { authCallback } from "../controllers/auth.controller.js";

const router = Router();

router.get("/login");
router.get("/signup");
router.get("/callback", authCallback);

export default router;