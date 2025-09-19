import { User } from "../models/user.model.js";

/**
 * Handles both direct login and signup without verification.
 * Finds a user by email. If they exist, logs them in.
 * If they don't exist, creates a new account and logs them in.
 */
export const directLoginOrSignup = async (req, res) => {
    try {
        const { email, mobileNumber } = req.body;
        if (!email || !mobileNumber) {
            return res.status(400).json({ message: "Email and mobile number are required." });
        }

        let user = await User.findOne({ email });

        if (user) {
            // User exists, this is a login.
            // Optionally update their mobile number if it changed.
            user.mobileNumber = mobileNumber;
            await user.save();
        } else {
            // User does not exist, this is a signup.
            user = await User.create({
                email,
                mobileNumber,
            });
        }

        // --- At this point, `user` object exists for both login and signup ---

        // Generate an access token for the session
        const accessToken = user.generateAccessToken();

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        res.status(200)
           .cookie("accessToken", accessToken, options)
           .json({
               success: true,
               user: userResponse,
               accessToken,
               message: "Logged in successfully",
           });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login/signup." });
    }
};