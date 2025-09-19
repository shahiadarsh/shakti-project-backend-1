import { Router } from "express";
import { listAllCourses, getCourseDetails } from "../../controllers/user/course.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { subscriberMiddleware } from "../../middlewares/subscriber.middleware.js";
import { fullAccessMiddleware } from "../../middlewares/fullAccess.middleware.js"; // <-- Import new middleware

const router = Router();

// Anyone can see the list of available courses
router.route("/").get(listAllCourses);

// To get the full details, user must be logged in, have an active sub, AND have a full-access plan
router.route("/:courseId").get(
    authMiddleware, 
    subscriberMiddleware, 
    fullAccessMiddleware, // <-- Protect this route
    getCourseDetails
);

export default router;