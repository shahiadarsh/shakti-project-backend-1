import { Router } from "express";
import { uploadEbook, getAllEbooks, deleteEbook } from "../../controllers/admin/ebook.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.route("/")
    .post(
        upload.fields([
            { name: "coverImage", maxCount: 1 },
            { name: "ebookFile", maxCount: 1 },
        ]),
        uploadEbook
    )
    .get(getAllEbooks);

router.route("/:ebookId").delete(deleteEbook);

export default router;