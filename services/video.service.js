import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

/**
 * Creates a new video record in the database.
 * This function will be used by the Admin Video Controller.
 * @param {object} videoData - Contains title, description, videoFileUrl, etc.
 * @returns {Promise<object>} The newly created video document from MongoDB.
 */
const createVideo = async (videoData) => {
    try {
        return await Video.create(videoData);
    } catch (error) {
        console.error("Error in videoService.createVideo:", error);
        throw new Error("Could not create video in the database.");
    }
};

/**
 * Fetches all videos from the database, sorted by their sequence order.
 * This is primarily for the Admin Dashboard.
 * @returns {Promise<Array>} A list of all video documents.
 */
const getAllVideosAdmin = async () => {
    try {
        return await Video.find({}).sort({ sequenceOrder: 'asc' });
    } catch (error) {
        console.error("Error in videoService.getAllVideosAdmin:", error);
        throw new Error("Could not fetch videos.");
    }
};

/**
 * Updates the details of a specific video using its ID.
 * @param {string} videoId - The MongoDB ID of the video to update.
 * @param {object} updateData - An object containing the fields to update (e.g., { title: "New Title" }).
 * @returns {Promise<object|null>} The updated video document, or null if it wasn't found.
 */
const updateVideoById = async (videoId, updateData) => {
    try {
        return await Video.findByIdAndUpdate(videoId, updateData, { new: true, runValidators: true });
    } catch (error) {
        console.error("Error in videoService.updateVideoById:", error);
        throw new Error("Could not update video.");
    }
};

/**
 * Deletes a video from the database using its ID.
 * @param {string} videoId - The MongoDB ID of the video to delete.
 * @returns {Promise<object|null>} The document of the video that was deleted, or null if not found.
 */
const deleteVideoById = async (videoId) => {
    try {
        return await Video.findByIdAndDelete(videoId);
    } catch (error) {
        console.error("Error in videoService.deleteVideoById:", error);
        throw new Error("Could not delete video.");
    }
};

// =================================================================
// USER-FACING VIDEO LOGIC
// =================================================================

/**
 * This is the CORE LOGIC of your app. It determines if a user can watch a new video.
 * It checks the 24-hour rule and finds the next video in the sequence.
 * @param {object} user - The full user document from the database.
 * @returns {Promise<object>} An object with a status ('WAITING', 'COMPLETED_ALL', 'READY') and data.
 */
const getDailyVideoForUser = async (user) => {
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

    if (user.lastVideoUnlockedAt) {
        const timeSinceLastUnlock = Date.now() - new Date(user.lastVideoUnlockedAt).getTime();
        if (timeSinceLastUnlock < twentyFourHoursInMs) {
            return {
                status: 'WAITING',
                timeRemaining: twentyFourHoursInMs - timeSinceLastUnlock,
            };
        }
    }

    const nextVideoOrder = user.watchedVideos.length + 1;
    const nextVideo = await Video.findOne({ sequenceOrder: nextVideoOrder });

    if (!nextVideo) {
        return { status: 'COMPLETED_ALL' };
    }

    return { status: 'READY', video: nextVideo };
};

/**
 * Updates a user's record after they have successfully unlocked a new video.
 * @param {string} userId - The ID of the user to update.
 * @param {string} videoId - The ID of the video they just unlocked.
 */
const updateUserAfterVideoUnlock = async (userId, videoId) => {
    try {
        await User.findByIdAndUpdate(userId, {
            $addToSet: { watchedVideos: videoId },
            $set: { lastVideoUnlockedAt: new Date() }
        });
    } catch (error) {
        console.error("Error in videoService.updateUserAfterVideoUnlock:", error);
        throw new Error("Could not update user progress.");
    }
};

/**
 * Fetches all videos and adds a 'status' field ('UNLOCKED' or 'LOCKED') for a specific user.
 * @param {object} user - The full user document.
 * @returns {Promise<Array>} A list of all videos, each with an added status field.
 */
const getAllVideosForUser = async (user) => {
    try {
        const allVideos = await Video.find({}).sort({ sequenceOrder: 'asc' });
        const userWatchedVideoIds = new Set(user.watchedVideos.map(id => id.toString()));

        const videosWithStatus = allVideos.map(video => ({
            ...video.toObject(),
            status: userWatchedVideoIds.has(video._id.toString()) ? 'UNLOCKED' : 'LOCKED',
        }));

        return videosWithStatus;
    } catch (error) {
        console.error("Error in videoService.getAllVideosForUser:", error);
        throw new Error("Could not fetch user video list.");
    }
};

// We export all functions as a single object to be imported elsewhere.
export const videoService = {
    createVideo,
    getAllVideosAdmin,
    updateVideoById,
    deleteVideoById,
    getDailyVideoForUser,
    updateUserAfterVideoUnlock,
    getAllVideosForUser,
};