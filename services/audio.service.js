import { Audio } from "../models/audio.model.js";

/**
 * Creates a new audio record in the database.
 * This function will be used by the Admin Audio Controller.
 * @param {object} audioData - Contains title, description, audioFileUrl, artist, etc.
 * @returns {Promise<object>} The newly created audio document from MongoDB.
 */
const createAudio = async (audioData) => {
    try {
        return await Audio.create(audioData);
    } catch (error) {
        console.error("Error in audioService.createAudio:", error);
        throw new Error("Could not create audio in the database.");
    }
};

/**
 * Fetches a list of all audio files from the database.
 * This can be used by both the Admin panel and the User dashboard.
 * @returns {Promise<Array>} A list of all audio documents.
 */
const getAllAudios = async () => {
    try {
        return await Audio.find({});
    } catch (error) {
        console.error("Error in audioService.getAllAudios:", error);
        throw new Error("Could not fetch audio files.");
    }
};

/**
 * Fetches a single audio file by its unique ID.
 * @param {string} audioId - The MongoDB ID of the audio file.
 * @returns {Promise<object|null>} The audio document, or null if not found.
 */
const getAudioById = async (audioId) => {
    try {
        return await Audio.findById(audioId);
    } catch (error) {
        console.error("Error in audioService.getAudioById:", error);
        throw new Error("Could not fetch the specified audio file.");
    }
};

/**
 * Updates the details of a specific audio file using its ID.
 * @param {string} audioId - The MongoDB ID of the audio to update.
 * @param {object} updateData - An object with the fields to update (e.g., { title: "New Title" }).
 * @returns {Promise<object|null>} The updated audio document, or null if not found.
 */
const updateAudioById = async (audioId, updateData) => {
    try {
        return await Audio.findByIdAndUpdate(audioId, updateData, { new: true, runValidators: true });
    } catch (error) {
        console.error("Error in audioService.updateAudioById:", error);
        throw new Error("Could not update audio details.");
    }
};

/**
 * Deletes an audio file record from the database using its ID.
 * @param {string} audioId - The MongoDB ID of the audio to delete.
 * @returns {Promise<object|null>} The document of the audio that was deleted, or null if not found.
 */
const deleteAudioById = async (audioId) => {
    try {
        return await Audio.findByIdAndDelete(audioId);
    } catch (error) {
        console.error("Error in audioService.deleteAudioById:", error);
        throw new Error("Could not delete audio file.");
    }
};

// We export all functions as a single object for clean importing.
export const audioService = {
    createAudio,
    getAllAudios,
    getAudioById,
    updateAudioById,
    deleteAudioById,
};