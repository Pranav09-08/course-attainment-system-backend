const CourseAllotment = require("../../models/admin/courseAllotmentModel");

// Function to allot new course
const allotCourse = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }

  try {
    const courseData = req.body;

    // Convert faculty_id to string if it's a number
    if (typeof courseData.faculty_id === 'number') {
      courseData.faculty_id = courseData.faculty_id.toString();
    }

    // Convert single class to array if class is string (for FE/SE)
    if (typeof courseData.class === 'string') {
      courseData.class = [courseData.class];
    }

    const result = await CourseAllotment.allotCourse(courseData);

    const message = `✅ Allotment complete. Allotted: ${result.inserted.length}, Skipped: ${result.skipped.length}`;
    return res.status(201).json({
      message,
      data: result
    });
  } catch (err) {
    console.error("❌ Error allotting course:", err.message);

    if (err.message.includes("Faculty ID does not exist")) {
      return res.status(400).json({ error: err.message });
    } else if (err.message.includes("At least one class")) {
      return res.status(400).json({ error: err.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
  }
};


// Function get all allotted courses
const getAllottedCourses = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }

  try {
    const { dept_id } = req.params;

    if (!dept_id || isNaN(dept_id)) {
      return res.status(400).json({ error: "Invalid or missing department ID" });
    }

    const courses = await CourseAllotment.getAllottedCourses(dept_id);

    if (courses.length === 0) {
      return res.status(404).json({ message: "No course allotments found for this department" });
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
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }

  try {
    const { courseId, academicYr, sem } = req.params;
    let { faculty_id } = req.body;

    console.log("📥 Received request to update faculty for course allotment:", {
      courseId,
      academicYr,
      sem,
      faculty_id,
    });

    // Validate courseId, academicYr, sem, and faculty_id
    if (!courseId || !academicYr || !sem || !faculty_id) {
      return res.status(400).json({
        error: "courseId, academicYr, sem, and faculty_id are required",
      });
    }

    // Ensure faculty_id is a string
    if (typeof faculty_id === 'number') {
      faculty_id = faculty_id.toString();
    }

    const result = await CourseAllotment.updateCourseAllotmentFaculty(
      courseId,
      academicYr,
      sem,
      faculty_id // Now passing as string
    );

    if (result) {
      console.log("✅ Faculty updated successfully");
      return res.status(200).json({ message: "Faculty updated successfully", data: result });
    } else {
      return res.status(400).json({ error: "Failed to update faculty" });
    }
  } catch (err) {
    console.error("❌ Error updating faculty:", err.message);

    // Handle specific errors
    if (err.message.includes("Course allotment not found")) {
      return res.status(404).json({
        error: "Course allotment not found for the given courseId, academicYr, and sem",
      });
    } else if (err.message.includes("New faculty ID does not exist")) {
      return res.status(400).json({ error: "New faculty ID does not exist" });
    } else if (err.message.includes("New faculty is already assigned")) {
      return res.status(409).json({
        error: "New faculty is already assigned to this course for the given academic year and semester",
      });
    } else if (err.message.includes("Failed to update faculty ID")) {
      return res.status(500).json({ error: "Failed to update faculty ID" });
    } else {
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
  }
};

// Function to delete course allotment
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
      return res.status(400).json({ error: "courseId, academicYr, and sem are required" });
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
      return res.status(400).json({ error: "Failed to delete course allotment" });
    }
  } catch (err) {
    console.error("❌ Error deleting course allotment:", err.message);

    // Handle specific errors
    if (err.message.includes("Course allotment not found")) {
      return res.status(404).json({ error: "Course allotment not found" });
    } else {
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
  }
};

module.exports = {
  allotCourse,
  getAllottedCourses,
  updateCourseAllotmentFaculty,
  deleteCourseAllotment,
};