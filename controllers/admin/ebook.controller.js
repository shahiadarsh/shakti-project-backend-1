import { Ebook } from "../../models/ebook.model.js";
import { uploadService } from "../../services/upload.service.js";

export const uploadEbook = async (req, res) => {
    try {
        const { title, description, author } = req.body;
        const coverImageFile = req.files?.coverImage?.[0];
        const ebookFile = req.files?.ebookFile?.[0];

        if (!coverImageFile) return res.status(400).json({ message: "Cover image is required." });
        if (!ebookFile) return res.status(400).json({ message: "Ebook file (PDF) is required." });

        const coverImageUpload = await uploadService.uploadFile(coverImageFile.path);
        const ebookFileUpload = await uploadService.uploadFile(ebookFile.path);

        // --- THIS IS THE FIX ---
        // Yahan par hum database ko sahi field names ke saath data bhej rahe hain
        const newEbook = await Ebook.create({
            title,
            description,
            author,
            coverImageUrl: coverImageUpload.url,
            ebookFileUrl: ebookFileUpload.url,
            coverImageStorageKey: coverImageUpload.key, // Sahi naam use karein
            ebookFileStorageKey: ebookFileUpload.key,   // Sahi naam use karein
        });

        res.status(201).json({
            success: true,
            message: "Ebook uploaded successfully.",
            ebook: newEbook,
        });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error during ebook upload." });
    }
};

export const getAllEbooks = async (req, res) => {
    try {
        const ebooks = await Ebook.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, ebooks });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

export const deleteEbook = async (req, res) => {
    try {
        const { ebookId } = req.params;
        const ebookToDelete = await Ebook.findById(ebookId);
        if (!ebookToDelete) return res.status(404).json({ message: "Ebook not found." });

        // --- THIS IS THE FIX ---
        // Yahan par hum database se sahi field names ko read kar rahe hain
        if (ebookToDelete.coverImageStorageKey) {
            await uploadService.deleteFile(ebookToDelete.coverImageStorageKey);
        }
        if (ebookToDelete.ebookFileStorageKey) {
            await uploadService.deleteFile(ebookToDelete.ebookFileStorageKey);
        }
        
        await Ebook.findByIdAndDelete(ebookId);
        res.status(200).json({ success: true, message: "Ebook deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};