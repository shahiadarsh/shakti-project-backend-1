import { Router } from "express";
import { createCourse, getAllCourses, updateCourse, deleteCourse } from "../../controllers/admin/course.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();
router.use(authMiddleware, adminMiddleware); // Protect all routes

router.route("/").post(createCourse).get(getAllCourses);
router.route("/:courseId").patch(updateCourse).delete(deleteCourse);

export default router;