import { Router } from "express";
import { getDailyUnlockedVideos } from "../../controllers/user/video.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { subscriberMiddleware } from "../../middlewares/subscriber.middleware.js";

const router = Router();

/**
 * --- Route Protection ---
 * This block ensures that any user trying to access these routes:
 * 1. Must be logged in (authMiddleware).
 * 2. Must have an active subscription of ANY type (subscriberMiddleware).
 * This is perfect for the initial plan, as it will pass these checks.
 */
router.use(authMiddleware);
router.use(subscriberMiddleware);

/**
 * --- GET /api/v1/user/videos/daily ---
 * This is the primary endpoint for the initial 10-day subscription period.
 * When a user on the initial plan visits their dashboard, the frontend will call this API.
 * The `getDailyUnlockedVideos` controller will then handle the logic of unlocking
 * one new video every 24 hours (up to a maximum of 3).
 */
router.route("/daily").get(getDailyUnlockedVideos);

export default router;