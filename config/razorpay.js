import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config({ path: './.env' });

// .env variables server.js me pehle hi load ho chuke honge
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpayInstance;