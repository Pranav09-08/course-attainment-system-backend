const Student = require('../../models/faculty/getStudentModel');


// Controller function to fetch students
const getStudents = async (req, res) => {
  try {
    const { class: studentClass, dept_id, academic_yr } = req.body;

    console.log("Request payload for getStudents:", req.body);

    if (!studentClass || !dept_id || !academic_yr) {
      return res.status(400).json({ error: "All fields are required: class, dept_id, academic_yr" });
    }

    // Fetch students using the model function
    const students = await Student.getStudentsByClassDeptYear(studentClass, dept_id, academic_yr);

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for the given criteria." });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error("Error in getStudents controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMarks = async (req, res) => {
  try {
    // Extract data from query parameters
    const { class: studentClass, dept_id, academic_yr, course_id } = req.query;

    console.log("Request query for getMarks:", req.query);

    // Validate required fields
    if (!studentClass || !dept_id || !academic_yr || !course_id) {
      return res.status(400).json({ error: "All fields are required: class, dept_id, academic_yr, course_id" });
    }

    // Fetch marks from the database
    const marks = await Student.getMarksByClassDeptYearCourse(studentClass, dept_id, academic_yr, course_id);

    if (marks.length === 0) {
      return res.status(404).json({ message: "No marks found for the given criteria." });
    }

    res.status(200).json(marks);
  } catch (error) {
    console.error("Error in getMarks controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getStudents, getMarks };