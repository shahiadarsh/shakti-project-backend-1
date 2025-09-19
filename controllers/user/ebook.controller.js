import { Ebook } from "../../models/ebook.model.js";

// Get a list of all available ebooks
export const getAllEbooks = async (req, res) => {
    try {
        const ebooks = await Ebook.find({});
        res.status(200).json({
            success: true,
            count: ebooks.length,
            ebooks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching ebooks." });
    }
};

// Get details for a single ebook by its ID
export const getEbookById = async (req, res) => {
    try {
        const { ebookId } = req.params;
        const ebook = await Ebook.findById(ebookId);

        if (!ebook) {
            return res.status(404).json({ message: "Ebook not found." });
        }

        res.status(200).json({
            success: true,
            ebook,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};