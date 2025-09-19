import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    websiteName: {
        type: String,
        default: "Shree Mahavidya Shaktipeeth"
    },
    razorpayKeyId: {
        type: String,
        trim: true
    },
    razorpayKeySecret: {
        type: String,
        trim: true
    },
    // Aap yahan par aur settings add kar sakte hain
}, { timestamps: true });

export const Settings = mongoose.model("Settings", settingsSchema);