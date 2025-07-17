
const Student = require('../../models/faculty/getStudentModel');

// Controller function to fetch students
const getStudents = async (req, res) => {
  try {
    const { class: studentClass, dept_id, academic_yr, sem } = req.body;
    
    if (!studentClass || !dept_id || !academic_yr || !sem) {
      return res.status(400).json({
        error: "All fields are required: class, dept_id, academic_yr, semester"
      });
    }

    // Validate semester
    if (!['odd', 'even'].includes(sem.toLowerCase())) {
      return res.status(400).json({
        error: "Semester must be either 'odd' or 'even'"
      });
    }

    const students = await Student.getStudentsByClassDeptYear(
      studentClass,
      dept_id,
      academic_yr,
      sem
    );

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for the given criteria." });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error("Error in getStudents controller:", error);
    res.status(500).json({ 
      error: error.message.includes('does not exist') 
        ? "Student data not available for this semester/year" 
        : "Internal Server Error" 
    });
  }
};

const getMarks = async (req, res) => {
  try {
    const { class: studentClass, dept_id, academic_yr, course_id, sem } = req.query;

    if (!studentClass || !dept_id || !academic_yr || !course_id || !sem) {
      return res.status(400).json({
        error: "All fields are required: class, dept_id, academic_yr, course_id, semester"
      });
    }

    if (!['odd', 'even'].includes(sem.toLowerCase())) {
      return res.status(400).json({
        error: "Semester must be either 'odd' or 'even'"
      });
    }

    const marks = await Student.getMarksByClassDeptYearCourse(
      studentClass,
      dept_id,
      academic_yr,
      course_id,
      sem
    );

    if (marks.length === 0) {
      return res.status(404).json({ message: "No marks found for the given criteria." });
    }

    res.status(200).json(marks);
  } catch (error) {
    console.error("Error in getMarks controller:", error);
    res.status(500).json({ 
      error: error.message.includes('does not exist') 
        ? "Student data not available for this semester/year" 
        : "Internal Server Error" 
    });
  }
};

module.exports = { getStudents, getMarks };