import { Router } from "express";
import {
  callback,
  login,
  logout,
  me,
  refresh,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/login", login);
router.get("/google", login);
router.get("/callback", callback);
router.get("/google/callback", callback);
router.get("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", protectRoute, me);

export default router;
