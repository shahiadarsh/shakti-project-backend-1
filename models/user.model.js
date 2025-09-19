import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        // name, email, mobileNumber, role fields remain the same...
        name: { type: String, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        mobileNumber: { type: String, required: true, trim: true },
        role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },

        // --- MERGED SUBSCRIPTION & PROGRESS FIELDS ---
        currentPlan: { // To know which plan the user is on
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubscriptionPlan",
        },
        subscriptionStatus: {
            type: String,
            enum: ["INACTIVE", "ACTIVE", "EXPIRED"],
            default: "INACTIVE",
        },
        subscriptionExpiry: Date,

        // --- Fields for the Initial Plan's daily video unlock ---
        totalVideosUnlocked: {
            type: Number,
            default: 0,
        },
        lastUnlockDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

export const User = mongoose.model("User", userSchema);