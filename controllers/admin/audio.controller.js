import { Audio } from "../../models/audio.model.js";
import { uploadService } from "../../services/upload.service.js";

export const uploadAudio = async (req, res) => {
    try {
        const { title, description, artist } = req.body;
        const audioFileLocalPath = req.file?.path;

        if (!audioFileLocalPath) {
            return res.status(400).json({ message: "Audio file is required." });
        }

        const uploadResponse = await uploadService.uploadFile(audioFileLocalPath);
        
        const newAudio = await Audio.create({
            title,
            description,
            artist,
            audioFileUrl: uploadResponse.url,
            storageKey: uploadResponse.key,
        });

        res.status(201).json({
            success: true,
            message: "Audio uploaded successfully.",
            audio: newAudio,
        });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error during audio upload." });
    }
};

export const getAllAudios = async (req, res) => {
    try {
        const audios = await Audio.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            audios,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching audios." });
    }
};

export const deleteAudio = async (req, res) => {
    try {
        const { audioId } = req.params;
        const audioToDelete = await Audio.findById(audioId);

        if (!audioToDelete) {
            return res.status(404).json({ message: "Audio not found in database." });
        }

        if (audioToDelete.storageKey) {
            await uploadService.deleteFile(audioToDelete.storageKey);
        }
        
        await Audio.findByIdAndDelete(audioId);

        res.status(200).json({ success: true, message: "Audio deleted successfully from database and storage." });
    } catch (error) {
        res.status(500).json({ message: "Server error while deleting audio." });
    }
};