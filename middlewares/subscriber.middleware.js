export const subscriberMiddleware = async (req, res, next) => {
    const user = req.user;

    if (user.role === 'ADMIN') {
        return next(); // Admins always have access
    }
    
    // Check if the subscription has expired
    if (user.subscriptionExpiry && user.subscriptionExpiry < new Date()) {
        // If it has expired, update the status in the database
        user.subscriptionStatus = "EXPIRED";
        await user.save();
    }
    
    if (user.subscriptionStatus !== "ACTIVE") {
        return res.status(403).json({ 
            message: "An active subscription is required.",
            subscriptionStatus: user.subscriptionStatus // Send status to frontend
        });
    }

    next();
};