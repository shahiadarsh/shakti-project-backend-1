import { LiveStream } from "../../models/liveStream.model.js";

// This is a special controller that needs to update the status of streams
export const getActiveStreams = async (req, res) => {
    try {
        const now = new Date();
        // Update streams that should be LIVE
        await LiveStream.updateMany(
            { startTime: { $lte: now }, status: "SCHEDULED" },
            { $set: { status: "LIVE" } }
        );
        // Update streams that should be COMPLETED
        await LiveStream.updateMany(
            { status: "LIVE" },
            { $set: { 
                status: "COMPLETED",
                // This uses a MongoDB aggregation pipeline to check if startTime + duration has passed
                $expr: { $gte: [ now, { $add: ["$startTime", { $multiply: ["$durationInMinutes", 60, 1000] }] }] }
            }}
        );

        const streams = await LiveStream.find({ status: { $in: ["SCHEDULED", "LIVE"] } })
            .sort({ startTime: 'asc' })
            .populate("video", "title videoFileUrl");
            
        res.status(200).json({ success: true, streams });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};