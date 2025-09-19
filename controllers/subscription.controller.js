import { SubscriptionPlan } from "../models/subscriptionPlan.model.js";
import { User } from "../models/user.model.js";
import { Payment } from "../models/payment.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay credentials are not configured in .env file.");
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

export const createSubscriptionOrder = async (req, res) => {
    try {
        const { planId } = req.body;
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: "Subscription plan not found." });
        }

        const razorpayInstance = getRazorpayInstance();

        const options = {
            amount: plan.price * 100,
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
        };

        const order = await razorpayInstance.orders.create(options);
        
        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: error.message || "Server error while creating order." });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
        const userId = req.user._id;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed. Signature mismatch." });
        }
        
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: "Plan not found." });
        }

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + plan.durationInDays);

        let updateData = {
            currentPlan: plan._id,
            subscriptionStatus: "ACTIVE",
            subscriptionExpiry: expiryDate,
        };

        if (plan.planType === 'INITIAL') {
            updateData.totalVideosUnlocked = 0;
            updateData.lastUnlockDate = null;
        }

        await User.findByIdAndUpdate(userId, { $set: updateData });

        await Payment.create({
            userId,
            planId,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            amount: plan.price,
            status: "SUCCESS"
        });

        res.status(200).json({ success: true, message: "Subscription activated successfully." });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Server error during payment verification." });
    }
};