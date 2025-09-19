import { Router } from "express";
import { uploadAudio, getAllAudios, deleteAudio } from "../../controllers/admin/audio.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.route("/")
    .post(upload.single("audioFile"), uploadAudio)
    .get(getAllAudios);

router.route("/:audioId")
    .delete(deleteAudio);

export default router;