const AttainmentModel = require("../models/attainmentModel");

// Get attainment data for a course coordinator
const getAttainmentData = async (req, res) => {
    try {
        console.log("Received query params:", req.query);
        const {course_id, academic_yr } = req.query;

        if (!course_id || !academic_yr) {
            return res.status(400).json({ error: "Faculty ID, Course ID, and Academic Year are required" });
        }

        console.log(`📤 Fetching attainment data for course_id: ${course_id}, academic_yr: ${academic_yr}`);

        // Fetch Level_Target (10 rows) for the specific course using course_id and academic_yr
        const [levelTarget] = await AttainmentModel.getLevelTargetByCourse(course_id, academic_yr);

        if (!levelTarget || levelTarget.length === 0) {
            return res.status(404).json({ message: "No level target data found for this course in the given academic year." });
        }

        // Fetch Calculate_Attainment (1 row) for the specific course and faculty
        const [attainment] = await AttainmentModel.getCalculateAttainmentByCourse(course_id, academic_yr);

        if (!attainment || attainment.length === 0) {
            return res.status(404).json({ message: "No attainment data found for this course." });
        }

        // Structure the final data
        const finalData = {
            course_id,
            level_target: levelTarget || [], // Ensure empty array if no data
            attainment: attainment[0] || null // Ensure null if no data
        };

        res.status(200).json(finalData);

    } catch (error) {
        console.error("❌ Error fetching attainment data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getCoordinatorCourses = async (req, res) => {
    try {
        const faculty_id = req.query.faculty_id; // Use query params instead of params.id

        if (!faculty_id) {
            return res.status(400).json({ error: "Faculty ID is required" });
        }

        const [courses] = await AttainmentModel.getCoursesByCoordinator(faculty_id);

        if (!courses.length) {
            return res.status(404).json({ message: "No courses assigned." });
        }

        res.json(courses);
    } catch (error) {
        console.error("Error fetching coordinator courses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getAttainmentData, getCoordinatorCourses };
