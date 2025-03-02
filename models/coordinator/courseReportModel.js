const db = require('../../db/db');

// Fetch course target data
const getCourseTarget = async (courseId, deptId, academicYear) => {
  const query = `
    SELECT target1, target2, target3, sppu1, sppu2, sppu3
    FROM Course_Target 
    WHERE course_id = ? AND dept_id = ? AND academic_yr = ?
  `;
  const [results] = await db.query(query, [courseId, deptId, academicYear]);
  return results;
};

// Fetch marks data
const getMarksData = async (courseId, deptId, academicYear) => {
    const query = `
      SELECT 
        m.roll_no, 
        s.name AS student_name, 
        m.course_id, 
        m.u1_co1, 
        m.u1_co2, 
        m.u2_co3, 
        m.u2_co4, 
        m.u3_co5, 
        m.u3_co6, 
        m.i_co1, 
        m.i_co2, 
        m.end_sem, 
        m.final_sem, 
        m.academic_yr, 
        m.sem
      FROM marks m
      JOIN Student s ON m.roll_no = s.roll_no
      WHERE m.course_id = ? AND m.dept_id = ? AND m.academic_yr = ?
    `;
    const [results] = await db.query(query, [courseId, deptId, academicYear]);
    return results;
  };
  

module.exports = {
  getCourseTarget,
  getMarksData
};
