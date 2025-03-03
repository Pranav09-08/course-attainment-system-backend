const { allotCourseCoordinator, getCourseCoordinatorsByDept } = require("../../models/admin/courseCoordinatorModel");

const allotCourseCoordinatorHandler = async (req, res) => {
    try {
        const courseData = req.body;
        console.log("📥 Received request to allot course coordinator:", courseData);

        const result = await allotCourseCoordinator(courseData);

        if (result) {
            console.log("✅ Course Coordinator allotted successfully");
            return res.status(201).json({ message: "Course Coordinator allotted successfully" });
        } else {
            return res.status(400).json({ error: "Failed to allot course coordinator" });
        }
    } catch (err) {
        console.error("❌ Error allotting course coordinator:", err.message);

        if (err.message.includes("A coordinator is already assigned")) {
            return res.status(409).json({ error: err.message }); // Conflict
        } else if (err.message.includes("Course ID does not exist")) {
            return res.status(404).json({ error: err.message });
        } else if (err.message.includes("Faculty ID does not exist")) {
            return res.status(404).json({ error: err.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }
    }
};

// 🟢 Fetch course coordinators
const getCourseCoordinatorsByDeptHandler = async (req, res) => {
    try {
        const { dept_id } = req.params; // Extract dept_id from request params

        console.log(`📥 Fetching Course Coordinators for department ID: ${dept_id}`);

        if (!dept_id || isNaN(dept_id)) {
            return res.status(400).json({ error: "Invalid or missing department ID" });
        }

        const coordinators = await getCourseCoordinatorsByDept(dept_id);

        if (coordinators.length === 0) {
            return res.status(404).json({ message: "No Course Coordinators found for this department" });
        }

        console.log("✅ Coordinators fetched successfully");
        return res.status(200).json(coordinators);
    } catch (err) {
        console.error("❌ Error fetching Course Coordinators:", err.message);
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

module.exports = { allotCourseCoordinatorHandler, getCourseCoordinatorsByDeptHandler };
