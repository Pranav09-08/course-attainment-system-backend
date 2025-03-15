const db = require("../../db/db");

const insertOrUpdateMarks = async (marksData, studentClass, academic_yr, dept_id) => {
  try {
    // Fetch all valid student roll numbers for the given class, academic year, and department
    const [students] = await db.query(
      "SELECT roll_no FROM Student WHERE class = ? AND academic_yr = ? AND dept_id = ?",
      [studentClass, academic_yr, dept_id]
    );
    const validRollNumbers = new Set(students.map((student) => student.roll_no));

    // Filter marksData to include only valid students
    const validMarksData = marksData.filter((mark) => validRollNumbers.has(mark.roll_no));

    if (validMarksData.length === 0) {
      console.log("No valid students found for inserting marks.");
      return { message: "No valid students found." };
    }

    // Check for existing UT1 marks before inserting UT2, UT3, or In-Sem/Final marks
    for (const mark of validMarksData) {
      const [existingMarks] = await db.query(
        "SELECT u1_co1, u1_co2 FROM Marks WHERE roll_no = ? AND course_id = ? AND academic_yr = ? AND sem = ? AND dept_id = ?",
        [mark.roll_no, mark.course_id, academic_yr, mark.sem, dept_id]
      );

      

      // If inserting UT2, UT3, In-Sem, or Final, check if UT1 exists
      if (
        (mark.u2_co3 || mark.u2_co4 || mark.u3_co5 || mark.u3_co6 || mark.i_co1 || mark.i_co2 || mark.end_sem) &&
        (!existingMarks.length || !existingMarks[0] || existingMarks[0].u1_co1 === null || existingMarks[0].u1_co2 === null)
      ) {
        console.log(`⛔ Cannot insert marks for Roll No: ${mark.roll_no} as UT1 marks are missing.`);
        continue;
      }

      // If student already exists, update marks
      if (existingMarks.length > 0) {
        await db.query(
          `UPDATE Marks 
           SET u1_co1 = COALESCE(?, u1_co1),
               u1_co2 = COALESCE(?, u1_co2),
               u2_co3 = COALESCE(?, u2_co3),
               u2_co4 = COALESCE(?, u2_co4),
               u3_co5 = COALESCE(?, u3_co5),
               u3_co6 = COALESCE(?, u3_co6),
               i_co1 = COALESCE(?, i_co1),
               i_co2 = COALESCE(?, i_co2),
               end_sem = COALESCE(?, end_sem)
           WHERE roll_no = ? AND course_id = ? AND academic_yr = ? AND sem = ? AND dept_id = ?`,
          [
            mark.u1_co1,
            mark.u1_co2,
            mark.u2_co3,
            mark.u2_co4,
            mark.u3_co5,
            mark.u3_co6,
            mark.i_co1,
            mark.i_co2,
            mark.end_sem,
            mark.roll_no,
            mark.course_id,
            mark.academic_yr,
            mark.sem,
            mark.dept_id,
          ]
        );
      } else {
        // Insert new record if student doesn't exist
        await db.query(
          `INSERT INTO Marks 
           (roll_no, course_id, u1_co1, u1_co2, u2_co3, u2_co4, u3_co5, u3_co6, i_co1, i_co2, end_sem, academic_yr, sem, dept_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mark.roll_no,
            mark.course_id,
            mark.u1_co1,
            mark.u1_co2,
            mark.u2_co3,
            mark.u2_co4,
            mark.u3_co5,
            mark.u3_co6,
            mark.i_co1,
            mark.i_co2,
            mark.end_sem,
            mark.academic_yr,
            mark.sem,
            mark.dept_id,
          ]
        );
      }
    }
    return { success: true, message: "Marks inserted/updated successfully" };

  } catch (error) {
    console.error("❌ Error inserting/updating marks:", error);
    throw new Error("Database insert/update failed");
  }
};

module.exports = { insertOrUpdateMarks };
