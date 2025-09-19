import mongoose from "mongoose";

const audioSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        artist: {
            type: String,
            default: "Unknown",
        },
        audioFileUrl: {
            type: String,
            required: true,
        },
        storageKey: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

export const Audio = mongoose.model("Audio", audioSchema);