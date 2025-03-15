const db = require('../../db/db');

// Function to fetch students based on class, dept_id, and academic_yr
const getStudentsByClassDeptYear = async (studentClass, dept_id, academic_yr) => {
  try {
    const query = `
      SELECT roll_no, name 
      FROM Student 
      WHERE class = ? AND dept_id = ? AND academic_yr = ?;
    `;

    const [students] = await db.execute(query, [studentClass, dept_id, academic_yr]);
    return students;
  } catch (error) {
    throw error;
  }
};

module.exports = { getStudentsByClassDeptYear };
