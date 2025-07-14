const { allotCourseCoordinator, getCourseCoordinatorsByDept, updateCourseCoordinatorFaculty, deleteCourseCoordinator} = require("../../models/admin/courseCoordinatorModel");

const allotCourseCoordinatorHandler = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Only admin can access this." });
    }

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
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Only admin can access this." });
    }

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

const updateCourseCoordinatorFacultyHandler = async (req, res) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Only admin can access this." });
    }

    try {
        const { courseId, academicYr, sem } = req.params;
        const { faculty_id } = req.body;

        console.log("📥 Received request to update faculty for course coordinator:", { courseId, academicYr, sem, faculty_id });

        // Validate input
        if (!courseId || !academicYr || !sem || !faculty_id) {
            return res.status(400).json({ error: "courseId, academicYr, sem, and faculty_id are required" });
        }

        const result = await updateCourseCoordinatorFaculty(courseId, academicYr, sem, faculty_id);

        if (result) {
            console.log("✅ Faculty updated successfully");
            return res.status(200).json({ message: "Faculty updated successfully", data: result });
        } else {
            return res.status(400).json({ error: "Failed to update faculty" });
        }
    } catch (err) {
        console.error("❌ Error updating faculty:", err.message);

        // Handle specific errors
        if (err.message.includes("New faculty ID does not exist")) {
            return res.status(404).json({ error: err.message });
        } else if (err.message.includes("Course coordinator not found")) {
            return res.status(404).json({ error: err.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }
    }
};

const deleteCourseCoordinatorHandler = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Only admin can access this." });
    }

    try {
      const { courseId, academicYr, sem } = req.params;
  
      console.log("📥 Received request to delete course coordinator:", { courseId, academicYr, sem });
  
      // Validate input
      if (!courseId || !academicYr || !sem) {
        return res.status(400).json({ error: "courseId, academicYr, and sem are required" });
      }
  
      const result = await deleteCourseCoordinator(courseId, academicYr, sem);
  
      if (result) {
        console.log("✅ Course Coordinator deleted successfully");
        return res.status(200).json({ message: "Course Coordinator deleted successfully", data: result });
      } else {
        return res.status(400).json({ error: "Failed to delete course coordinator" });
      }
    } catch (err) {
      console.error("❌ Error deleting course coordinator:", err.message);
  
      // Handle specific errors
      if (err.message.includes("Course coordinator not found")) {
        return res.status(404).json({ error: err.message });
      } else {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
      }
    }
  };

module.exports = { allotCourseCoordinatorHandler, getCourseCoordinatorsByDeptHandler, updateCourseCoordinatorFacultyHandler, deleteCourseCoordinatorHandler};
