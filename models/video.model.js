import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        videoFileUrl: {
            type: String, // URL from Zeta AI
            required: true,
        },
        thumbnailUrl: {
            type: String, // Optional: URL for a thumbnail image
        },
        duration: {
            type: Number, // Video duration in seconds
            default: 0
        },
        sequenceOrder: {
            type: Number,
            required: true,
            unique: true, // Ensures no two videos have the same order
            index: true,
        },
    },
    { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchema);