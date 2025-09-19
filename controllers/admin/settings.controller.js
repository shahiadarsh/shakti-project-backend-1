import { Settings } from "../../models/settings.model.js";

export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.status(200).json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

export const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
        }
        res.status(200).json({ success: true, message: "Settings updated successfully.", settings });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};