import { Router } from "express";
import { updateUserProfile } from "../../controllers/user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Is route ko access karne ke liye user ka logged-in hona zaroori hai
router.use(authMiddleware);

router.route("/").patch(updateUserProfile);

export default router;