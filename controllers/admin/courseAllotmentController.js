const CourseAllotment = require("../../models/admin/courseAllotmentModel");

//function to allot new course
const allotCourse = async (req, res) => {
    try {
        const courseData = req.body;

        console.log("📥 Received request to allot course:", courseData);

        const result = await CourseAllotment.allotCourse(courseData);

        if (result) {
            console.log("✅ Course allotted successfully");
            return res.status(201).json({ message: "Course allotted successfully" });
        } else {
            return res.status(400).json({ error: "Failed to allot course" });
        }
    } catch (err) {
        console.error("❌ Error allotting course:", err.message);

        // 🔍 Handle Foreign Key Constraint Error (Faculty ID or Course ID Not Found)
        if (err.message.includes("Cannot add or update a child row") && err.message.includes("FOREIGN KEY")) {
            return res.status(400).json({ error: "Faculty ID or Course ID does not exist. Please enter a valid faculty_id and course_id." });
        } else if (err.message.includes("Course already allotted")) {
            return res.status(409).json({ error: "This course is already allotted to the faculty for this academic year." });
        } else if (err.message.includes("ER_TRUNCATED_WRONG_VALUE")) {
            return res.status(400).json({ error: "Invalid data format. Please check course_id, faculty_id, and other values." });
        } else {
            return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }
    }
};

//function get all alloted courses
const getAllottedCourses = async (req, res) => {
    try {
        const courses = await CourseAllotment.getAllottedCourses();

        if (courses.length === 0) {
            return res.status(404).json({ message: "No course allotments found" });
        }

        return res.status(200).json({ data: courses });
    } catch (error) {
        console.error("❌ Error fetching course allotments:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

//function to update course allotment
const updateCourseAllotment = async (req, res) => {
    try {
        const course_id = req.params.course_id; // Get course_id from URL params
        const courseData = req.body;

        console.log("📥 Received request to update course allotment:", course_id, courseData);

        const result = await CourseAllotment.updateCourseAllotment(course_id, courseData);

        console.log("✅ Course allotment updated successfully");
        return res.status(200).json(result);
    } catch (err) {
        console.error("❌ Error updating course allotment:", err.message);
        return res.status(400).json({ error: err.message });
    }
};

module.exports = { allotCourse,getAllottedCourses,updateCourseAllotment};
