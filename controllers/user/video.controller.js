import { Video } from "../../models/video.model.js";
import { User } from "../../models/user.model.js";

export const getDailyUnlockedVideos = async (req, res) => {
    try {
        let user = req.user;
        const maxVideosForInitialPlan = 3;

        // Stop unlocking new videos if the user has reached the 3-video limit
        if (user.totalVideosUnlocked >= maxVideosForInitialPlan) {
            const unlockedVideos = await Video.find({
                sequenceOrder: { $lte: user.totalVideosUnlocked }
            }).sort({ sequenceOrder: 'asc' });

            return res.status(200).json({
                success: true,
                message: "You have unlocked all videos for the initial plan.",
                totalVideosUnlocked: user.totalVideosUnlocked,
                videos: unlockedVideos,
            });
        }

        const twentyFourHours = 24 * 60 * 60 * 1000;
        const now = new Date();

        if (!user.lastUnlockDate || (now - new Date(user.lastUnlockDate)) >= twentyFourHours) {
            user.totalVideosUnlocked += 1;
            user.lastUnlockDate = now;
            
            await User.findByIdAndUpdate(user._id, {
                totalVideosUnlocked: user.totalVideosUnlocked,
                lastUnlockDate: user.lastUnlockDate,
            });
        }

        const unlockedVideos = await Video.find({
            sequenceOrder: { $lte: user.totalVideosUnlocked }
        }).sort({ sequenceOrder: 'asc' });

        res.status(200).json({
            success: true,
            totalVideosUnlocked: user.totalVideosUnlocked,
            videos: unlockedVideos,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching daily videos." });
    }
};