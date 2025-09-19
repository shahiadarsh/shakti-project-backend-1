import { LiveStream } from "../../models/liveStream.model.js";

export const scheduleStream = async (req, res) => {
    try {
        const { title, video, startTime, durationInMinutes } = req.body;
        const newStream = await LiveStream.create({ title, video, startTime, durationInMinutes });
        res.status(201).json({ success: true, message: "Live stream scheduled.", stream: newStream });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

export const getAllStreams = async (req, res) => {
    try {
        const streams = await LiveStream.find({})
            .populate("video", "title")
            .sort({ startTime: 'desc' });
        res.status(200).json({ success: true, streams });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

export const deleteStream = async (req, res) => {
    try {
        const { streamId } = req.params;
        const stream = await LiveStream.findByIdAndDelete(streamId);
        if (!stream) return res.status(404).json({ message: "Stream not found." });
        res.status(200).json({ success: true, message: "Stream deleted." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};