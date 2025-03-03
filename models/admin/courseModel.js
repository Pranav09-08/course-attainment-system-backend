const db = require('../../db/db');

// Function to check if a course exists
const getCourseById = async (course_id) => {
  const query = `SELECT * FROM Course WHERE course_id = ?`;
  try {
    const [rows] = await db.query(query, [course_id]);
    return rows.length > 0 ? rows[0] : null; // If course exists, return the course details
  } catch (error) {
    console.error("❌ Error fetching course:", error);
    throw new Error("Database error while checking course existence");
  }
};

// Function to add a new course
const createCourse = async (course_id, course_name, ut, insem, endsem, finalsem, course_class) => {
  const query = `
    INSERT INTO Course (course_id, course_name, ut, insem, endsem, finalsem, class)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await db.query(query, [course_id, course_name, ut, insem, endsem, finalsem, course_class]);
    return result;
  } catch (error) {
    console.error("❌ Error inserting course:", error);
    throw new Error("Database error while adding the course");
  }
};

// Function to get all courses
const getAllCourses = async () => {
  const query = `SELECT * FROM Course`;
  try {
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    console.error("❌ Database Error:", error.message);
    throw new Error("Database error while fetching courses");
  }
};

// Function to delete a course by ID
const deleteCourseById = async (course_id) => {
  const query = `DELETE FROM Course WHERE course_id = ?`;
  try {
    const [result] = await db.query(query, [course_id]);
    return result.affectedRows; // Returns number of rows deleted
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    throw new Error("Database error while deleting the course");
  }
};

// Function to update course details
const updateCourseById = async (course_id, course_name, ut, insem, endsem, finalsem, course_class) => {
  const query = `
    UPDATE Course 
    SET course_name = ?, ut = ?, insem = ?, endsem = ?, finalsem = ?, class = ?
    WHERE course_id = ?
  `;
  try {
    const [result] = await db.query(query, [course_name, ut, insem, endsem, finalsem, course_class, course_id]);
    return result.affectedRows; // Returns number of updated rows
  } catch (error) {
    console.error("❌ Error updating course:", error);
    throw new Error("Database error while updating the course.");
  }
};

module.exports = { getCourseById, createCourse, getAllCourses, deleteCourseById, updateCourseById };