import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from './api/auth.routes.js';
import adminVideoRoutes from './api/admin/video.routes.js';
import adminAudioRoutes from './api/admin/audio.routes.js';
import adminEbookRoutes from './api/admin/ebook.routes.js';
import adminUserRoutes from './api/admin/user.routes.js';
import userVideoRoutes from './api/user/video.routes.js';
import userAudioRoutes from './api/user/audio.routes.js';
import userEbookRoutes from './api/user/ebook.routes.js';
import userSubscriptionRoutes from './api/user/subscription.routes.js';
import adminCourseRoutes from './api/admin/course.routes.js';
import adminLiveStreamRoutes from './api/admin/liveStream.routes.js';
import adminContentRoutes from './api/admin/content.routes.js';

// New User Routes
import userCourseRoutes from './api/user/course.routes.js';
import userLiveStreamRoutes from './api/user/liveStream.routes.js';
import adminDashboardRoutes from './api/admin/dashboard.routes.js';
import adminSettingsRoutes from './api/admin/settings.routes.js';
import userProfileRoutes from './api/user/profile.routes.js';

// 1. Configure environment variables
dotenv.config({
    path: './.env'
});

// 2. Initialize the Express App
const app = express();
const PORT = process.env.PORT || 8000;

// 3. Middleware Configuration
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// 4. --- ROUTES ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminDashboardRoutes);
app.use("/api/v1/admin/videos", adminVideoRoutes);
app.use("/api/v1/admin/audios", adminAudioRoutes);
app.use("/api/v1/admin/ebooks", adminEbookRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
// Admin Routes
app.use("/api/v1/admin/courses", adminCourseRoutes);
app.use("/api/v1/admin/livestreams", adminLiveStreamRoutes);
app.use("/api/v1/admin/settings", adminSettingsRoutes);
app.use("/api/v1/admin/content-for-form", adminContentRoutes);

// User Routes
app.use("/api/v1/user/videos", userVideoRoutes);
app.use("/api/v1/user/audios", userAudioRoutes);
app.use("/api/v1/user/ebooks", userEbookRoutes);
app.use("/api/v1/user/subscriptions", userSubscriptionRoutes);
app.use("/api/v1/user/courses", userCourseRoutes);
app.use("/api/v1/user/livestreams", userLiveStreamRoutes);
app.use("/api/v1/user/profile", userProfileRoutes);

// All your route imports and app.use() will go here later
// Example:
// import authRoutes from './api/auth.routes.js';
// app.use("/api/v1/auth", authRoutes);


// 5. Connect to Database and Start the Server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`⚙️  Server is running at port : ${PORT}`);
        });

        app.on("error", (error) => {
            console.error("APP ERROR: ", error);
            throw error;
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });