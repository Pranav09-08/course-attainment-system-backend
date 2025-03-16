// models/updateMarksModel.js
const db = require("../../db/db");

// Fetch marks for a specific student, course, department, and academic year
const getMarksByCriteria = async (roll_no, course_id, dept_id, academic_yr) => {
  try {
    const query = `
      SELECT * 
      FROM Marks 
      WHERE roll_no = ? AND course_id = ? AND dept_id = ? AND academic_yr = ?;
    `;
    const [marks] = await db.execute(query, [roll_no, course_id, dept_id, academic_yr]);
    return marks[0]; // Return the first row (if exists)
  } catch (error) {
    throw error;
  }
};

// Update marks for a specific student, course, department, and academic year
const updateMarksByCriteria = async (
  roll_no,
  course_id,
  dept_id,
  academic_yr,
  u1_co1,
  u1_co2,
  u2_co3,
  u2_co4,
  u3_co5,
  u3_co6,
  i_co1,
  i_co2,
  end_sem
) => {
  try {
    const query = `
      UPDATE Marks 
      SET 
        u1_co1 = ?, 
        u1_co2 = ?, 
        u2_co3 = ?, 
        u2_co4 = ?, 
        u3_co5 = ?, 
        u3_co6 = ?, 
        i_co1 = ?, 
        i_co2 = ?, 
        end_sem = ?
      WHERE roll_no = ? AND course_id = ? AND dept_id = ? AND academic_yr = ?;
    `;
    await db.execute(query, [
      u1_co1,
      u1_co2,
      u2_co3,
      u2_co4,
      u3_co5,
      u3_co6,
      i_co1,
      i_co2,
      end_sem,
      roll_no,
      course_id,
      dept_id,
      academic_yr,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getMarksByCriteria,
  updateMarksByCriteria,
};