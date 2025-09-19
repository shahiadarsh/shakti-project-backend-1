import { User } from "../../models/user.model.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, mobileNumber, role } = req.body;

        if (!name || !email || !mobileNumber) {
            return res.status(400).json({ message: "Name, email, and mobile number are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists." });
        }

        const newUser = await User.create({
            name,
            email,
            mobileNumber,
            role: role || 'USER',
        });

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "User created successfully by admin.",
            user: userResponse,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while creating user." });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// --- THIS IS THE MISSING FUNCTION ---
// We are adding it back here.
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching user by ID." });
    }
};
// ------------------------------------

export const updateUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, mobileNumber, role, subscriptionStatus } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, mobileNumber, role, subscriptionStatus },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found." });
        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });
        if (req.user._id.equals(user._id)) {
            return res.status(400).json({ message: "You cannot delete your own admin account." });
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};