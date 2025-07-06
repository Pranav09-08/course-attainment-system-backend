const CourseAllotment = require("../../models/admin/courseAllotmentModel");

//function to allot new course
const allotCourse = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }
  
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
    if (
      err.message.includes("Cannot add or update a child row") &&
      err.message.includes("FOREIGN KEY")
    ) {
      return res
        .status(400)
        .json({
          error:
            "Faculty ID or Course ID does not exist. Please enter a valid faculty_id and course_id.",
        });
    } else if (err.message.includes("Course already allotted")) {
      return res
        .status(409)
        .json({
          error:
            "This course is already allotted to the faculty for this academic year.",
        });
    } else if (err.message.includes("ER_TRUNCATED_WRONG_VALUE")) {
      return res
        .status(400)
        .json({
          error:
            "Invalid data format. Please check course_id, faculty_id, and other values.",
        });
    } else {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
  }
};

//function get all alloted courses
const getAllottedCourses = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Only admin can access this." });
    }

  try {
    const { dept_id } = req.params; // Extract dept_id from request params

    if (!dept_id || isNaN(dept_id)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing department ID" });
    }

    const courses = await CourseAllotment.getAllottedCourses(dept_id); // Pass dept_id to the method

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No course allotments found for this department" });
    }

    return res.status(200).json({ data: courses });
  } catch (error) {
    console.error("❌ Error fetching course allotments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//function to update the course allotment
const updateCourseAllotmentFaculty = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Only admin can access this." });
    }

  try {
    const { courseId, academicYr, sem } = req.params;
    const { faculty_id } = req.body;

    console.log("📥 Received request to update faculty for course allotment:", {
      courseId,
      academicYr,
      sem,
      faculty_id,
    });

    // Validate courseId, academicYr, sem, and faculty_id
    if (!courseId || !academicYr || !sem || !faculty_id) {
      return res
        .status(400)
        .json({
          error: "courseId, academicYr, sem, and faculty_id are required",
        });
    }

    const result = await CourseAllotment.updateCourseAllotmentFaculty(
      courseId,
      parseInt(academicYr),
      sem,
      parseInt(faculty_id)
    );

    if (result) {
      console.log("✅ Faculty updated successfully");
      return res
        .status(200)
        .json({ message: "Faculty updated successfully", data: result });
    } else {
      return res.status(400).json({ error: "Failed to update faculty" });
    }
  } catch (err) {
    console.error("❌ Error updating faculty:", err.message);

    // 🔍 Handle specific errors
    if (err.message.includes("Course allotment not found")) {
      return res
        .status(404)
        .json({
          error:
            "Course allotment not found for the given courseId, academicYr, and sem",
        });
    } else if (err.message.includes("New faculty ID does not exist")) {
      return res.status(400).json({ error: "New faculty ID does not exist" });
    } else if (err.message.includes("New faculty is already assigned")) {
      return res
        .status(409)
        .json({
          error:
            "New faculty is already assigned to this course for the given academic year and semester",
        });
    } else if (err.message.includes("Failed to update faculty ID")) {
      return res.status(500).json({ error: "Failed to update faculty ID" });
    } else {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
  }
};

const deleteCourseAllotment = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Only admin can access this." });
    }

  try {
    const { courseId, academicYr, sem } = req.params;

    console.log("📥 Received request to delete course allotment:", {
      courseId,
      academicYr,
      sem,
    });

    // Validate input
    if (!courseId || !academicYr || !sem) {
      return res
        .status(400)
        .json({ error: "courseId, academicYr, and sem are required" });
    }

    const result = await CourseAllotment.deleteCourseAllotment(
      courseId,
      academicYr,
      sem
    );

    if (result) {
      console.log("✅ Course allotment deleted successfully");
      return res
        .status(200)
        .json({
          message: "Course allotment deleted successfully",
          data: result,
        });
    } else {
      return res
        .status(400)
        .json({ error: "Failed to delete course allotment" });
    }
  } catch (err) {
    console.error("❌ Error deleting course allotment:", err.message);

    // Handle specific errors
    if (err.message.includes("Course allotment not found")) {
      return res.status(404).json({ error: "Course allotment not found" });
    } else {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
  }
};

module.exports = {
  allotCourse,
  getAllottedCourses,
  updateCourseAllotmentFaculty,
  deleteCourseAllotment,
};
