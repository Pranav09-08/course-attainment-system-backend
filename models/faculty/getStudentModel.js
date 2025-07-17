
const db = require('../../db/db');



// Function to fetch students based on class, dept_id, academic_yr and semester
const getStudentsByClassDeptYear = async (studentClass, dept_id, academic_yr, sem) => {
  try {
    // Validate semester
    if (!['odd', 'even'].includes(sem.toLowerCase())) {
      throw new Error('Invalid semester value');
    }

  
    const tableName = `Student_${sem}_${academic_yr}`;
      

    // Query students
    const query = `
      SELECT roll_no, name 
      FROM ${tableName}
      WHERE class = ? AND dept_id = ? AND academic_yr = ?;
    `;
    
    const [students] = await db.query(query, [studentClass, dept_id, academic_yr]);
    console.log(studentClass, dept_id, academic_yr);
    return students;
  } catch (error) {
    console.error("Error in getStudentsByClassDeptYear:", error);
    throw error;
  }
};

// Function to fetch marks based on class, dept_id, academic_yr, course_id and semester
const getMarksByClassDeptYearCourse = async (studentClass, dept_id, academic_yr, course_id, sem) => {
  try {
    // Validate semester
    if (!['odd', 'even'].includes(sem.toLowerCase())) {
      throw new Error('Invalid semester value');
    }

    const tableName = `Student_${sem}_${academic_yr}`;

    // Get students first
    const [students] = await db.query(
      `SELECT roll_no FROM ${tableName}
       WHERE class = ? AND dept_id = ? AND academic_yr = ?`,
      [studentClass, dept_id, academic_yr]
    );

    if (students.length === 0) {
      return [];
    }

    // Get marks for these students
    const rollNumbers = students.map(s => s.roll_no);
    const [marks] = await db.query(
      `SELECT roll_no, course_id, u1_co1, u1_co2, u2_co3, u2_co4, 
              u3_co5, u3_co6, i_co1, i_co2, end_sem, final_sem
       FROM Marks
       WHERE roll_no IN (?) AND course_id = ? AND academic_yr = ? AND dept_id = ?`,
      [rollNumbers, course_id, academic_yr, dept_id]
    );

    return marks;
  } catch (error) {
    console.error("Error in getMarksByClassDeptYearCourse:", error);
    throw error;
  }
};

module.exports = {
  getStudentsByClassDeptYear,
  getMarksByClassDeptYearCourse
};