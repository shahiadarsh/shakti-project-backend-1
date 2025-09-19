import { Video } from "../../models/video.model.js";
import { uploadService } from "../../services/upload.service.js";

export const uploadVideo = async (req, res) => {
    try {
        const { title, description, sequenceOrder } = req.body;
        const videoFileLocalPath = req.file?.path;

        if (!videoFileLocalPath) {
            return res.status(400).json({ message: "Video file is required." });
        }

        const uploadResponse = await uploadService.uploadFile(videoFileLocalPath);
        
        const newVideo = await Video.create({
            title,
            description,
            sequenceOrder,
            videoFileUrl: uploadResponse.url,
            storageKey: uploadResponse.key,
        });

        res.status(201).json({
            success: true,
            message: "Video uploaded successfully.",
            video: newVideo,
        });

    } catch (error) {
        console.error("Error in uploadVideo controller:", error);
        res.status(500).json({ message: error.message || "Server error during video upload." });
    }
};

export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({ sequenceOrder: 'asc' });
        res.status(200).json({
            success: true,
            count: videos.length,
            videos,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching videos." });
    }
};

export const updateVideoDetails = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title, description, sequenceOrder } = req.body;

        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            { title, description, sequenceOrder },
            { new: true, runValidators: true }
        );

        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found." });
        }

        res.status(200).json({
            success: true,
            message: "Video details updated.",
            video: updatedVideo,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while updating video." });
    }
};

export const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        const videoToDelete = await Video.findById(videoId);
        if (!videoToDelete) {
            return res.status(404).json({ message: "Video not found in database." });
        }

        if (videoToDelete.storageKey) {
            await uploadService.deleteFile(videoToDelete.storageKey);
        }
        
        await Video.findByIdAndDelete(videoId);

        res.status(200).json({ success: true, message: "Video deleted successfully from database and storage." });
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting video." });
    }
};