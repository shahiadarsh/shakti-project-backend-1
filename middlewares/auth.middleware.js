import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        // 1. Get token from either cookie or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized request. No token provided." });
        }

        // 2. Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 3. Find the user based on the token's ID and exclude the password
        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Invalid access token. User not found." });
        }

        // 4. Attach the user object to the request for use in next controllers
        req.user = user;
        next(); // If everything is okay, proceed to the next middleware or controller

    } catch (error) {
        // Handle expired tokens or other verification errors
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};