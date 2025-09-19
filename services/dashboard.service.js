import { User } from "../models/user.model.js";
import { Payment } from "../models/payment.model.js";
import { Course } from "../models/course.model.js";

/**
 * Gathers various statistics for the admin dashboard.
 */
const getDashboardStats = async () => {
    try {
        // 1. Get Total Users (both ADMIN and USER roles)
        const totalUsers = await User.countDocuments();

        // 2. Get Active Subscribers
        // This counts users whose status is ACTIVE and expiry date is in the future
        const activeSubscribers = await User.countDocuments({
            subscriptionStatus: "ACTIVE",
            subscriptionExpiry: { $gt: new Date() }
        });

        // 3. Get Monthly Revenue
        // This calculates the sum of 'amount' for all successful payments in the last 30 days
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        const revenueData = await Payment.aggregate([
            {
                $match: {
                    status: "SUCCESS",
                    createdAt: { $gte: oneMonthAgo }
                }
            },
            {
                $group: {
                    _id: null, // Group all documents into one
                    totalRevenue: { $sum: "$amount" }
                }
            }
        ]);
        
        const monthlyRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        // 4. Get Total Courses
        const totalCourses = await Course.countDocuments({ isPublished: true });

        // Return all stats as a single object
        return {
            totalUsers,
            activeSubscribers,
            monthlyRevenue,
            totalCourses
        };

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw new Error("Could not retrieve dashboard statistics.");
    }
};

export const dashboardService = {
    getDashboardStats,
};