import mongoose from "mongoose";

const liveStreamSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    durationInMinutes: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["SCHEDULED", "LIVE", "COMPLETED"],
        default: "SCHEDULED",
    }
}, { timestamps: true });

export const LiveStream = mongoose.model("LiveStream", liveStreamSchema);