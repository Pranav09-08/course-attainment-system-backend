const Student = require('../../models/faculty/getStudentModel');


// Controller function to handle the request
const getStudents = async (req, res) => {
  try {
    const { class: studentClass, dept_id, academic_yr } = req.body;

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
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getStudents };
