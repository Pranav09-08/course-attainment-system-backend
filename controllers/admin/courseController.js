const Course = require('../../models/admin/courseModel');

// Add a new course
const addCourse = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Only admins can add courses." });
  }

  const { course_id, course_name, ut, insem, endsem, finalsem, class: course_class } = req.body;

  console.log(`📥 Request to add new course: ${course_id}, ${course_name}, ${course_class}`);

  // 🔴 Step 1: Validate missing fields
  if (!course_id) return res.status(400).json({ error: "Course ID is required." });
  if (!course_name) return res.status(400).json({ error: "Course name is required." });
  if (!course_class) return res.status(400).json({ error: "Class is required." });
  if (ut === undefined) return res.status(400).json({ error: "Unit Test marks are required." });
  if (insem === undefined) return res.status(400).json({ error: "In-Semester marks are required." });
  if (endsem === undefined) return res.status(400).json({ error: "End-Semester marks are required." });
  if (finalsem === undefined) return res.status(400).json({ error: "Final Semester marks are required." });

  // 🔴 Step 2: Validate integer inputs
  if (!Number.isInteger(ut)) return res.status(400).json({ error: "Unit Test marks must be an integer." });
  if (!Number.isInteger(insem)) return res.status(400).json({ error: "In-Semester marks must be an integer." });
  if (!Number.isInteger(endsem)) return res.status(400).json({ error: "End-Semester marks must be an integer." });
  if (!Number.isInteger(finalsem)) return res.status(400).json({ error: "Final Semester marks must be an integer." });

  try {
    // Check if the course already exists
    const existingCourse = await Course.getCourseById(course_id);
    if (existingCourse) {
      return res.status(409).json({ error: `Course ID ${course_id} already exists.` });
    }

    // Insert course into the database
    await Course.createCourse(course_id, course_name, ut, insem, endsem, finalsem, course_class);

    console.log(`✅ Course added successfully: ${course_id}`);
    res.status(201).json({ message: `${course_id} ${course_name} course added successfully.` });

  } catch (err) {
    console.error("❌ Error adding course:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

// Fetch all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.getAllCourses();

    if (!courses || courses.length === 0) {
      return res.status(200).json([]); // Return an empty array instead of a message
    }

    res.status(200).json(courses);

  } catch (err) {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Only admins can delete courses." });
  }

  const { course_id } = req.params;

  console.log(`🗑 Request to delete course: ${course_id}`);

  // 🔴 Step 1: Validate input
  if (!course_id) {
    return res.status(400).json({ error: "Course ID is required." });
  }

  try {
    // 🔴 Step 2: Check if course exists
    const existingCourse = await Course.getCourseById(course_id);
    if (!existingCourse) {
      return res.status(404).json({ error: `Course ID ${course_id} not found.` });
    }

    // 🔴 Step 3: Delete the course
    const deletedRows = await Course.deleteCourseById(course_id);
    if (deletedRows > 0) {
      console.log(`✅ Course deleted successfully: ${course_id}`);
      return res.status(200).json({ message: `Course ${course_id} deleted successfully.` });
    }

    res.status(500).json({ error: "Course deletion failed. Please try again." });

  } catch (err) {
    console.error("❌ Error deleting course:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

// Update Course
const updateCourse = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Only admins can update courses." });
  }

  const { course_id } = req.params;
  const { course_name, ut, insem, endsem, finalsem, class: course_class } = req.body;

  console.log(`📝 Request to update course: ${course_id}`);

  // 🔴 Step 1: Validate input and identify missing fields
  const missingFields = [];
  if (!course_id) missingFields.push("course_id");
  if (!course_name) missingFields.push("course_name");
  if (!course_class) missingFields.push("class");
  if (ut === undefined) missingFields.push("ut");
  if (insem === undefined) missingFields.push("insem");
  if (endsem === undefined) missingFields.push("endsem");
  if (finalsem === undefined) missingFields.push("finalsem");

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `${missingFields.join(", ")} field is missing`,
    });
  }

  try {
    // 🔴 Step 3: Check if the course exists
    const existingCourse = await Course.getCourseById(course_id);
    if (!existingCourse) {
      return res.status(404).json({ error: `Course ID ${course_id} not found.` });
    }

    // 🔴 Step 4: Perform update
    const updatedRows = await Course.updateCourseById(course_id, course_name, ut, insem, endsem, finalsem, course_class);
    if (updatedRows > 0) {
      console.log(`✅ Course updated successfully: ${course_id}`);
      return res.status(200).json({ message: `Course ${course_id} updated successfully.` });
    }

    res.status(500).json({ error: "Course update failed. Please try again." });

  } catch (err) {
    console.error("❌ Error updating course:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

module.exports = { addCourse, getCourses, deleteCourse, updateCourse };