import { User } from "../models/user.model.js";

export const fullAccessMiddleware = async (req, res, next) => {
    try {
        // This middleware runs AFTER authMiddleware and subscriberMiddleware
        const user = await User.findById(req.user._id).populate("currentPlan");

        if (!user || !user.currentPlan) {
            return res.status(403).json({ message: "Subscription plan not found." });
        }

        const planType = user.currentPlan.planType;

        if (planType === "HALF_YEARLY" || planType === "ANNUAL") {
            // User has a full access plan, allow them to proceed
            return next();
        } else {
            // User is on the INITIAL plan or something else, block access
            return res.status(403).json({ 
                message: "This content requires a Half-Yearly or Annual subscription. Please upgrade your plan." 
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error during access verification." });
    }
};