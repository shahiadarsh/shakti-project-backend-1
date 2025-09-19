import { Router } from "express";
import { getSettings, updateSettings } from "../../controllers/admin/settings.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();
router.use(authMiddleware, adminMiddleware);

router.route("/").get(getSettings).patch(updateSettings);

export default router;