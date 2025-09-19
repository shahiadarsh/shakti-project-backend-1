import { Router } from "express";
import { getAllAudios, getAudioById } from "../../controllers/user/audio.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { subscriberMiddleware } from "../../middlewares/subscriber.middleware.js";

const router = Router();

// Protect all routes in this file. User must be logged in and have an active subscription.
router.use(authMiddleware);
router.use(subscriberMiddleware);

// Route to get the full list of audio files
router.route("/").get(getAllAudios);

// Route to get a single audio file by its ID
router.route("/:audioId").get(getAudioById);

export default router;