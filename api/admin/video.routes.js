import { Router } from "express";
import {
    uploadVideo,
    getAllVideos,
    updateVideoDetails,
    deleteVideo,
} from "../../controllers/admin/video.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.route("/")
    .post(upload.single("videoFile"), uploadVideo)
    .get(getAllVideos);

router.route("/:videoId")
    .patch(updateVideoDetails)
    .delete(deleteVideo);

export default router;