import { Router } from "express";
import { getContentForForms } from "../../controllers/admin/content.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.route("/").get(getContentForForms);

export default router;