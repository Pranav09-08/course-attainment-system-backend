const db = require('../db/db');

// Function to insert/update marks
const saveMarks = async (marksData) => {
  try {
    const query = `
      INSERT INTO Marks (roll_no, course_id, u1_co1, u1_co2, u2_co3, u2_co4, u3_co5, u3_co6, i_co1, i_co2, end_sem, final_sem, academic_yr, sem)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        u1_co1 = VALUES(u1_co1),
        u1_co2 = VALUES(u1_co2),
        u2_co3 = VALUES(u2_co3),
        u2_co4 = VALUES(u2_co4),
        u3_co5 = VALUES(u3_co5),
        u3_co6 = VALUES(u3_co6),
        i_co1 = VALUES(i_co1),
        i_co2 = VALUES(i_co2),
        end_sem = VALUES(end_sem),
        final_sem = VALUES(final_sem),
        academic_yr = VALUES(academic_yr),
        sem = VALUES(sem);
    `;

    await db.query(query, marksData);
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Database operation failed");
  }
};

module.exports = { saveMarks };
