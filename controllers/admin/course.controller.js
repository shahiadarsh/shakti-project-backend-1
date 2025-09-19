import { Course } from "../../models/course.model.js";

export const createCourse = async (req, res) => {
    const { title, description, thumbnail, videos, audios, ebooks, isPublished } = req.body;
    try {
        const newCourse = await Course.create({ title, description, thumbnail, videos, audios, ebooks, isPublished: true });
        res.status(201).json({ success: true, message: "Course created successfully.", course: newCourse });
    } catch (error) {
        res.status(500).json({ message: "Server error creating course." });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).populate("videos audios ebooks");
        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

export const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const updateData = req.body;
    try {
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        if (!updatedCourse) return res.status(404).json({ message: "Course not found." });
        res.status(200).json({ success: true, message: "Course updated.", course: updatedCourse });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

export const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) return res.status(404).json({ message: "Course not found." });
        res.status(200).json({ success: true, message: "Course deleted." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};