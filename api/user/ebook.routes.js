import { Router } from "express";
import { getAllEbooks, getEbookById } from "../../controllers/user/ebook.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { subscriberMiddleware } from "../../middlewares/subscriber.middleware.js";

const router = Router();

// Protect all routes: User must be logged in and have an active subscription.
router.use(authMiddleware);
router.use(subscriberMiddleware);

// Route to get the full list of ebooks
router.route("/").get(getAllEbooks);

// Route to get a single ebook by its ID
router.route("/:ebookId").get(getEbookById);

export default router;