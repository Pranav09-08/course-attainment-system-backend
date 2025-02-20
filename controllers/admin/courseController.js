const Course = require('../../models/admin/courseModel');

// Add a new course
const addCourse = async (req, res) => {
  // Ensure only admins can add courses
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can add courses." });
  }

  const { course_id, course_name, ut, insem, endsem, finalsem } = req.body;

  console.log(`📥 Request to add new course: ${course_id}, ${course_name}`);

  // Validate input
  if (!course_id || !course_name || ut == null || insem == null || endsem == null || finalsem == null) {
    return res.status(400).json({ error: "All fields are required: course_id, course_name, ut, insem, endsem, finalsem." });
  }

  try {
    // Insert course into the database
    const result = await Course.createCourse(course_id, course_name, ut, insem, endsem, finalsem);

    console.log(`✅ Course added successfully: ${course_id}`);
    res.status(201).json({ message: "Course added successfully", course_id });

  } catch (err) {
    console.error("❌ Error adding course:", err.message);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};

module.exports = { addCourse };
