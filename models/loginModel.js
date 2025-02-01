const db = require("../db/db");

// Find Faculty by Email
const findUserByEmailFaculty = async (email) => {
  const [rows] = await db.query("SELECT * FROM Faculty WHERE email = ?", [email]);
  return rows.length > 0 ? rows[0] : null;
};

// Find Coordinator by Faculty ID
const findUserByFacultyId = async (faculty_id) => {
  const [rows] = await db.query("SELECT * FROM Course_Coordinator WHERE faculty_id = ?", [faculty_id]);
  return rows.length > 0 ? rows[0] : null;
};

// Find Admin by Email (in Department Table)
const findUserByDeptId = async (email) => {
  const [rows] = await db.query("SELECT * FROM Department WHERE email = ?", [email]);
  return rows.length > 0 ? rows[0] : null;
};

module.exports = { findUserByEmailFaculty, findUserByFacultyId, findUserByDeptId };
