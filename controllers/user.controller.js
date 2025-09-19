import { User } from "../models/user.model.js";
import { SubscriptionPlan } from "../models/subscriptionPlan.model.js";

// Naya function jo user apni profile update karne ke liye use karega
export const getAllSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find({}).sort({ price: 1 }); // Price ke hisaab se sort karein
        res.status(200).json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching all plans." });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { name, mobileNumber } = req.body;
        const userId = req.user._id; // Logged-in user ki ID authMiddleware se milti hai

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, mobileNumber },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while updating profile." });
    }
};

// ... baaki saare admin-specific functions (getAllUsers, deleteUser, etc.)