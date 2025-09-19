import { Router } from "express";
import {
    createSubscriptionOrder,
    verifyPayment,
    getMySubscriptionStatus,getAvailablePlans
} from "../../controllers/user/subscription.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getAllSubscriptionPlans } from "../../controllers/user.controller.js";

const router = Router();

// A user must be logged in to access any of these routes
router.use(authMiddleware);

// Route to get a list of all available plans
// router.get("/plans", getSubscriptionPlans);

// Route for the user to create a payment order
router.post("/create-order", createSubscriptionOrder);

// Route to verify the payment after the user has paid
router.post("/verify", verifyPayment);

// Route for the user to check their current subscription status
router.get("/status", getMySubscriptionStatus);

router.get("/plans", getAvailablePlans);
router.route("/all-plans").get(getAllSubscriptionPlans);

export default router;