import { Router } from "express";
import { getActiveStreams } from "../../controllers/user/liveStream.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { subscriberMiddleware } from "../../middlewares/subscriber.middleware.js";
import { fullAccessMiddleware } from "../../middlewares/fullAccess.middleware.js"; // <-- Import new middleware

const router = Router();

// To see active streams, user must be logged in, have an active sub, AND have a full-access plan
router.route("/").get(
    authMiddleware, 
    subscriberMiddleware,
    fullAccessMiddleware, // <-- Protect this route
    getActiveStreams
);

export default router;