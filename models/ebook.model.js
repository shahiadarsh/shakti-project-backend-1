import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        author: {
            type: String,
            default: "Unknown",
        },
        coverImageUrl: {
            type: String,
            required: true,
        },
        ebookFileUrl: {
            type: String,
            required: true,
        },
        // --- THIS IS THE FIX ---
        // Purane public_id wale fields ko in naye, sahi naamo se replace karein
        coverImageStorageKey: {
            type: String,
            required: true,
        },
        ebookFileStorageKey: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

export const Ebook = mongoose.model("Ebook", ebookSchema);