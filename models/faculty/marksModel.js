const db = require("../../db/db");

const insertMarks = async (marksData) => {
  try {
    // Step 1: Fetch all valid student roll numbers
    const [students] = await db.query("SELECT roll_no FROM Student");
    const validRollNumbers = new Set(students.map((student) => student.roll_no));

    // Step 2: Filter marksData to include only valid students
    const validMarksData = marksData.filter((mark) => validRollNumbers.has(mark.roll_no));

    if (validMarksData.length === 0) {
      console.log("⚠️ No valid students found for inserting marks.");
      return { message: "No valid students found." };
    }

    // Step 3: Insert only valid students' marks into the Marks table
    const query = `
      INSERT INTO Marks (roll_no, course_id, u1_co1, u1_co2, u2_co3, u2_co4, u3_co5, u3_co6, i_co1, i_co2, end_sem, final_sem, academic_yr, sem)
      VALUES ?`;

    const values = validMarksData.map((mark) => [
      mark.roll_no,
      mark.course_id,
      mark.u1_co1 || null,
      mark.u1_co2 || null,
      mark.u2_co3 || null,
      mark.u2_co4 || null,
      mark.u3_co5 || null,
      mark.u3_co6 || null,
      mark.i_co1 || null,
      mark.i_co2 || null,
      mark.end_sem || null,
      mark.final_sem || null,
      mark.academic_yr,
      mark.sem,
    ]);

    const [result] = await db.query(query, [values]);
    return result;
  } catch (error) {
    console.error("❌ Error inserting marks:", error);
    throw new Error("Database insert failed");
  }
};

module.exports = { insertMarks };
