import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    updateUserDetails,
    deleteUser,
} from "../../controllers/admin/user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

// Protect all routes in this file. Only logged-in admins can access them.
router.use(authMiddleware);
router.use(adminMiddleware);

// Route to get all users
router.route("/").get(getAllUsers);

// Routes for a specific user by their ID
router.route("/:userId")
    .get(getUserById)
    .patch(updateUserDetails)
    .delete(deleteUser);

export default router;