const AttainmentModel = require("../../models/coordinator/attainmentModel");

// Get attainment data for a course coordinator
const getAttainmentData = async (req, res) => {
    try {
        if (req.user.role !== "coordinator" && req.user.role !== "faculty") {
            return res.status(403).json({ msg: "Access denied. Only Coordinator can access this." });
        }

        console.log("Received query params:", req.query);
        const { course_id, academic_yr, dept_id } = req.query;

        if (!course_id || !academic_yr) {
            return res.status(400).json({ error: "Course ID and Academic Year are required" });
        }

        console.log(`📤 Fetching attainment data for course_id: ${course_id}, academic_yr: ${academic_yr}`);

        // Fetch Level_Target for the specific course and academic year
        const [levelTarget] = await AttainmentModel.getLevelTargetByCourse(course_id, academic_yr);
        console.log("Level Target:", levelTarget);

        if (!levelTarget || levelTarget.length === 0) {
            return res.status(404).json({ message: "Level target data not found." });
        }

        // Fetch Course_Target for the specific course and academic year
        const [courseTarget] = await AttainmentModel.getCourseTargetByCourse(course_id, academic_yr, dept_id);
        console.log("Course Target:", courseTarget);

        // Safely check if courseTarget has a valid value
        if (!courseTarget || courseTarget.length === 0) {
            return res.status(404).json({ message: "Course target data not found." });
        }

        // Fetch Calculate_Attainment for the specific course and academic year
        const [attainment] = await AttainmentModel.getCalculateAttainmentByCourse(course_id, academic_yr);
        console.log("Attainment:", attainment);

        if (!attainment || attainment.length === 0) {
            return res.status(404).json({ message: "Attainment data not found." });
        }

        // Structure the final data
        const finalData = {
            course_id,
            level_target: levelTarget || [],
            course_target: courseTarget[0] || null, // Assuming only one row is returned
            attainment: attainment[0] || null // Ensure null if no data
        };

        res.status(200).json(finalData);
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getCoordinatorCourses = async (req, res) => {
    try {
        if (req.user.role !== "coordinator") {
            return res.status(403).json({ msg: "Access denied. Only Coordinator can access this." });
        }
        const faculty_id = req.query.faculty_id; // Use query params instead of params.id

        if (!faculty_id) {
            return res.status(400).json({ error: "Faculty ID is required" });
        }

        const [courses] = await AttainmentModel.getCoursesByCoordinator(faculty_id);
        console.log("Coordinator Courses:", courses);

        if (!courses.length) {
            return res.status(404).json({ message: "No courses assigned." });
        }

        res.json(courses);
    } catch (error) {
        console.error("Error fetching coordinator courses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getFacultyInfo = async (req, res) => {
    try {

        // Extract query parameters
        const { courseId, deptId, academicYr } = req.query;

        // Validate that all parameters are provided
        if (!courseId || !deptId || !academicYr) {
            return res.status(400).json({ error: "Course ID, Department ID, and Academic Year are required" });
        }

        // Fetch faculty information using the model
        const facultyInfo = await AttainmentModel.getFacultyInfoByCourse(courseId, deptId, academicYr);

        // Log the result for debugging purposes
        console.log("Faculty Info:", facultyInfo);

        // Check if no data is found
        if (!facultyInfo.length) {
            return res.status(404).json({ message: "No faculty data found for the given parameters" });
        }

        // Send the fetched faculty data as a response
        res.json(facultyInfo);
    } catch (error) {
        // Log the error for debugging
        console.error("Error fetching faculty info:", error);

        // Send an internal server error response
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getAttainmentData, getCoordinatorCourses,getFacultyInfo };
