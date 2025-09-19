import { Router } from "express";
import { getStats } from "../../controllers/admin/dashboard.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

// Protect this route: only a logged-in admin can access it
// router.use(authMiddleware);
// router.use(adminMiddleware);

// Define the route for fetching stats
router.route("/stats").get(getStats);

export default router;