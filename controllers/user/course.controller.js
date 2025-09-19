import { Course } from "../../models/course.model.js";

// Get a list of all PUBLISHED courses (accessible to everyone)
export const listAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).select("title description thumbnail");
        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// Get the FULL details of a single course (for SUBSCRIBED users only)
export const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("videos audios ebooks");
        if (!course || !course.isPublished) {
            return res.status(404).json({ message: "Course not found." });
        }
        res.status(200).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};