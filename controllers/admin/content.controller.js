import { Video } from "../../models/video.model.js";
import { Audio } from "../../models/audio.model.js";
import { Ebook } from "../../models/ebook.model.js";

export const getContentForForms = async (req, res) => {
    try {
        const videos = await Video.find().select("_id title").sort({ createdAt: -1 });
        const audios = await Audio.find().select("_id title").sort({ createdAt: -1 });
        const ebooks = await Ebook.find().select("_id title").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            content: {
                videos,
                audios,
                ebooks,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching content for forms."
        });
    }
};