const db = require('../../db/db');

// Function to add a new course
const createCourse = async (course_id, course_name, ut, insem, endsem, finalsem) => {
  const query = `
    INSERT INTO Course (course_id, course_name, ut, insem, endsem, finalsem)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await db.query(query, [course_id, course_name, ut, insem, endsem, finalsem]);
    return result;
  } catch (error) {
    console.error("❌ Error inserting course:", error);
    throw new Error("Database error while adding the course");
  }
};

module.exports = { createCourse };
