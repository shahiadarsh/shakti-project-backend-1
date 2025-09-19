import { Router } from "express";
import { scheduleStream, getAllStreams, deleteStream } from "../../controllers/admin/liveStream.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();
router.use(authMiddleware, adminMiddleware);

router.route("/").post(scheduleStream).get(getAllStreams);
router.route("/:streamId").delete(deleteStream);

export default router;