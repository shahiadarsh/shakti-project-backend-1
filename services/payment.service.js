import Razorpay from "razorpay";
import crypto from "crypto";
import { SubscriptionPlan } from "../models/subscriptionPlan.model.js";
import { User } from "../models/user.model.js";
import { Payment } from "../models/payment.model.js";

// Initialize the Razorpay instance once with credentials from the environment.
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Fetches all available subscription plans from the database.
 * @returns {Promise<Array>} A list of subscription plan documents.
 */
const getAllPlans = async () => { // <--- THIS LINE IS NOW FIXED
    try {
        return await SubscriptionPlan.find({});
    } catch (error) {
        console.error("Error in paymentService.getAllPlans:", error);
        throw new Error("Could not fetch subscription plans.");
    }
};

/**
 * Creates a payment order with Razorpay for a given subscription plan.
 * @param {string} planId - The MongoDB ID of the subscription plan.
 * @returns {Promise<object>} The Razorpay order object.
 */
const createPaymentOrder = async (planId) => {
    try {
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            throw new Error("Subscription plan not found.");
        }

        const options = {
            amount: plan.price * 100, // Amount in the smallest currency unit (e.g., paisa for INR)
            currency: "INR",
            receipt: `receipt_${plan.planName}_${new Date().getTime()}`,
        };

        return await razorpayInstance.orders.create(options);
    } catch (error) {
        console.error("Error in paymentService.createPaymentOrder:", error);
        throw new Error("Failed to create Razorpay order.");
    }
};

/**
 * Verifies the Razorpay payment signature to ensure the payment is authentic.
 * @param {object} paymentData - Contains razorpay_order_id, razorpay_payment_id, and razorpay_signature.
 * @returns {boolean} True if the signature is valid, false otherwise.
 */
const verifyPaymentSignature = (paymentData) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    return expectedSignature === razorpay_signature;
};

/**
 * Activates a user's subscription after a successful payment.
 * It updates the user's status and sets the subscription expiry date.
 * @param {string} userId - The ID of the user to activate the subscription for.
 * @param {string} planId - The ID of the subscribed plan.
 * @returns {Promise<object>} The updated user document.
 */
const activateUserSubscription = async (userId, planId) => {
    try {
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            throw new Error("Subscription plan not found during activation.");
        }

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + plan.durationInDays);

        return await User.findByIdAndUpdate(userId, {
            $set: {
                subscriptionStatus: "ACTIVE",
                subscriptionExpiry: expiryDate,
            },
        }, { new: true });
    } catch (error) {
        console.error("Error in paymentService.activateUserSubscription:", error);
        throw new Error("Failed to activate user subscription.");
    }
};

/**
 * Creates a payment log in the database for record-keeping.
 * @param {object} paymentLogData - Data for the payment record.
 * @returns {Promise<object>} The created payment log document.
 */
const logPayment = async (paymentLogData) => {
    try {
        return await Payment.create(paymentLogData);
    } catch (error) {
        console.error("Error in paymentService.logPayment:", error);
        throw new Error("Failed to log the payment record.");
    }
};

/**
 * Fetches the current subscription status for a given user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} An object containing the user's subscriptionStatus and subscriptionExpiry.
 */
const getUserSubscriptionStatus = async (userId) => {
    try {
        return await User.findById(userId).select("subscriptionStatus subscriptionExpiry");
    } catch (error) {
        console.error("Error in paymentService.getUserSubscriptionStatus:", error);
        throw new Error("Could not fetch user subscription status.");
    }
};

// We export all functions as a single object for clean and easy importing.
export const paymentService = {
    getAllPlans,
    createPaymentOrder,
    verifyPaymentSignature,
    activateUserSubscription,
    logPayment,
    getUserSubscriptionStatus,
};