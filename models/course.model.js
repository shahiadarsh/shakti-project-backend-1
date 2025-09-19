import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String, // URL of the course cover image
        required: true,
    },
    // Playlists are arrays of references to your existing content models
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    audios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Audio"
    }],
    ebooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ebook"
    }],
    isPublished: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);