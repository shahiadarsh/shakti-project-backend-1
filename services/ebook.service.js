import { Ebook } from "../models/ebook.model.js";

/**
 * Creates a new ebook record in the database.
 * This will be used by the Admin Ebook Controller.
 * @param {object} ebookData - Contains title, author, description, coverImageUrl, and ebookFileUrl.
 * @returns {Promise<object>} The newly created ebook document from MongoDB.
 */
const createEbook = async (ebookData) => {
    try {
        return await Ebook.create(ebookData);
    } catch (error) {
        console.error("Error in ebookService.createEbook:", error);
        throw new Error("Could not create ebook in the database.");
    }
};

/**
 * Fetches a list of all ebooks from the database.
 * This function can be used by both the Admin panel and the User dashboard.
 * @returns {Promise<Array>} A list of all ebook documents.
 */
const getAllEbooks = async () => {
    try {
        return await Ebook.find({});
    } catch (error) {
        console.error("Error in ebookService.getAllEbooks:", error);
        throw new Error("Could not fetch ebooks.");
    }
};

/**
 * Fetches a single ebook by its unique ID.
 * @param {string} ebookId - The MongoDB ID of the ebook.
 * @returns {Promise<object|null>} The ebook document, or null if it is not found.
 */
const getEbookById = async (ebookId) => {
    try {
        return await Ebook.findById(ebookId);
    } catch (error) {
        console.error("Error in ebookService.getEbookById:", error);
        throw new Error("Could not fetch the specified ebook.");
    }
};

/**
 * Updates the details of a specific ebook using its ID.
 * @param {string} ebookId - The MongoDB ID of the ebook to update.
 * @param {object} updateData - An object with the fields to update (e.g., { title: "New Title", author: "New Author" }).
 * @returns {Promise<object|null>} The updated ebook document, or null if not found.
 */
const updateEbookById = async (ebookId, updateData) => {
    try {
        return await Ebook.findByIdAndUpdate(ebookId, updateData, { new: true, runValidators: true });
    } catch (error) {
        console.error("Error in ebookService.updateEbookById:", error);
        throw new Error("Could not update ebook details.");
    }
};

/**
 * Deletes an ebook record from the database using its ID.
 * @param {string} ebookId - The MongoDB ID of the ebook to delete.
 * @returns {Promise<object|null>} The document of the ebook that was deleted, or null if not found.
 */
const deleteEbookById = async (ebookId) => {
    try {
        return await Ebook.findByIdAndDelete(ebookId);
    } catch (error) {
        console.error("Error in ebookService.deleteEbookById:", error);
        throw new Error("Could not delete ebook.");
    }
};

// We export all functions as a single object for clean and easy importing in other files.
export const ebookService = {
    createEbook,
    getAllEbooks,
    getEbookById,
    updateEbookById,
    deleteEbookById,
};