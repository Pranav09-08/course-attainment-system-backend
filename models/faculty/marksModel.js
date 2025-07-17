
const db = require("../../db/db");

const insertOrUpdateMarks = async (marksData, studentClass, academic_yr, dept_id, sem) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Validate we have marks data
    if (!marksData || marksData.length === 0) {
      throw new Error("No marks data provided");
    }

    
    const studentTable = `Student_${sem}_${academic_yr}`;

    // 3. Get valid student roll numbers
    const [students] = await connection.query(
      `SELECT roll_no FROM ${studentTable} 
       WHERE class = ? AND academic_yr = ? AND dept_id = ?`,
      [studentClass, academic_yr, dept_id]
    );

    const validRollNumbers = new Set(students.map(s => s.roll_no));
    const validMarks = marksData.filter(mark => validRollNumbers.has(mark.roll_no));

    if (validMarks.length === 0) {
      throw new Error("No valid students found for the given criteria");
    }

    // 4. Process each mark record
    for (const mark of validMarks) {
      const [existing] = await connection.query(
        `SELECT 1 FROM Marks 
         WHERE roll_no = ? AND course_id = ? 
         AND academic_yr = ? AND sem = ? AND dept_id = ? 
         LIMIT 1`,
        [mark.roll_no, mark.course_id, academic_yr, sem, dept_id]
      );

      if (existing.length > 0) {
        await connection.query(
          `UPDATE Marks SET 
           u1_co1 = COALESCE(?, u1_co1),
           u1_co2 = COALESCE(?, u1_co2),
           u2_co3 = COALESCE(?, u2_co3),
           u2_co4 = COALESCE(?, u2_co4),
           u3_co5 = COALESCE(?, u3_co5),
           u3_co6 = COALESCE(?, u3_co6),
           i_co1 = COALESCE(?, i_co1),
           i_co2 = COALESCE(?, i_co2),
           end_sem = COALESCE(?, end_sem)
           WHERE roll_no = ? AND course_id = ? 
           AND academic_yr = ? AND sem = ? AND dept_id = ?`,
          [
            mark.u1_co1, mark.u1_co2,
            mark.u2_co3, mark.u2_co4,
            mark.u3_co5, mark.u3_co6,
            mark.i_co1, mark.i_co2,
            mark.end_sem,
            mark.roll_no, mark.course_id,
            academic_yr, sem, dept_id
          ]
        );
      } else {
        await connection.query(
          `INSERT INTO Marks 
           (roll_no, course_id, u1_co1, u1_co2, u2_co3, u2_co4, 
            u3_co5, u3_co6, i_co1, i_co2, end_sem, academic_yr, sem, dept_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mark.roll_no, mark.course_id,
            mark.u1_co1, mark.u1_co2,
            mark.u2_co3, mark.u2_co4,
            mark.u3_co5, mark.u3_co6,
            mark.i_co1, mark.i_co2,
            mark.end_sem,
            academic_yr, sem, dept_id
          ]
        );
      }
    }

    await connection.commit();
    return { success: true, message: "Marks processed successfully" };

  } catch (error) {
    await connection.rollback();
    console.error("Database error:", error.message);
    return { 
      success: false, 
      message: error.message.includes("not found") 
        ? `Student data not available for ${sem} semester ${academic_yr}`
        : error.message
    };
  } finally {
    connection.release();
  }
};

module.exports = { insertOrUpdateMarks };