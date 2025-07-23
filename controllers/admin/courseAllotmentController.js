const CourseAllotment = require("../../models/admin/courseAllotmentModel");

// Function to allot new course
const allotCourse = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: "Access denied. Only admin can access this." });
  }

  try {
    const courseData = req.body;

    // Convert faculty_id to string if it's a number
    if (typeof courseData.faculty_id === "number") {
      courseData.faculty_id = courseData.faculty_id.toString();
    }

    // Convert single class to array if class is string (for FE/SE)
    if (typeof courseData.class === "string") {
      courseData.class = [courseData.class];
    }

    const result = await CourseAllotment.allotCourse(courseData);

    const message = `✅ Allotment complete. Allotted: ${result.inserted.length}, Skipped: ${result.skipped.length}`;
    return res.status(201).json({
      message,
      data: result,
    });
  } catch (err) {
    console.error("❌ Error allotting course:", err.message);

    if (err.message.includes("Faculty ID does not exist")) {
      return res.status(400).json({ error: err.message });
    } else if (err.message.includes("At least one class")) {
      return res.status(400).json({ error: err.message });
    } else {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
  }
};

// Function get all allotted courses
const getAllottedCourses = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: "Access denied. Only admin can access this." });
  }

  try {
    const { dept_id } = req.params;

    if (!dept_id || isNaN(dept_id)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing department ID" });
    }

    const courses = await CourseAllotment.getAllottedCourses(dept_id);

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

// Function to update the course allotment
const updateCourseAllotmentFaculty = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: "Access denied. Only admin can access this." });
  }

  try {
    const { courseId, academicYr, sem } = req.params;
    const { faculty_id, className, deptId, existingFacultyId } = req.body;

    console.log("📥 Request data:", {
      courseId,
      academicYr,
      sem,
      faculty_id,
      className,
      deptId,
      existingFacultyId,
    });

    // Validate all required fields
    const missingFields = [];
    if (!courseId) missingFields.push("courseId");
    if (!academicYr) missingFields.push("academicYr");
    if (!sem) missingFields.push("sem");
    if (!faculty_id) missingFields.push("faculty_id");
    if (!className) missingFields.push("className");
    if (!deptId) missingFields.push("deptId");
    if (!existingFacultyId) missingFields.push("existingFacultyId");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const result = await CourseAllotment.updateCourseAllotmentFaculty(
      courseId,
      academicYr,
      sem,
      className,
      deptId,
      faculty_id,
      existingFacultyId
    );

    return res.status(200).json({
      message: "✅ Faculty updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("❌ Error updating faculty:", err.message);

    if (err.message.includes("DUPLICATE_ENTRY")) {
      return res.status(409).json({
        error:
          "This faculty is already assigned to this exact course and class combination",
      });
    } else if (err.message.includes("not found")) {
      return res.status(404).json({ error: "Course allotment not found" });
    } else {
      return res.status(500).json({
        error: "Internal Server Error",
        details: err.message,
      });
    }
  }
};

// Function to delete course allotment
const deleteCourseAllotment = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: "Access denied. Only admin can access this." });
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
      return res.status(200).json({
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
