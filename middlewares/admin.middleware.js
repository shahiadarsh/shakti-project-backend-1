export const adminMiddleware = (req, res, next) => {
    // This middleware assumes authMiddleware has already run and attached `req.user`
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required." });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden. Admin access required." });
    }

    // If the user is an admin, proceed
    next();
};