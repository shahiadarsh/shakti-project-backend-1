import { dashboardService } from "../../services/dashboard.service.js";

/**
 * Handles the request for dashboard statistics.
 */
export const getStats = async (req, res) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        
        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Server error while fetching dashboard stats." 
        });
    }
};