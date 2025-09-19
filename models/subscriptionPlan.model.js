import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: true,
        unique: true,
    },
    planType: {
        // We add back 'INITIAL' to differentiate the starter plan
        type: String,
        enum: ["INITIAL", "HALF_YEARLY", "ANNUAL"],
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    durationInDays: {
        type: Number,
        required: true,
    },
});

export const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);