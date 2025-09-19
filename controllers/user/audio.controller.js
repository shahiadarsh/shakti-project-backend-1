import { Audio } from "../../models/audio.model.js";

// Get a list of all available audio files
export const getAllAudios = async (req, res) => {
    try {
        const audios = await Audio.find({});
        res.status(200).json({
            success: true,
            count: audios.length,
            audios,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching audio files." });
    }
};

// Get details for a single audio file by its ID
export const getAudioById = async (req, res) => {
    try {
        const { audioId } = req.params;
        const audio = await Audio.findById(audioId);

        if (!audio) {
            return res.status(404).json({ message: "Audio file not found." });
        }

        res.status(200).json({
            success: true,
            audio,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};