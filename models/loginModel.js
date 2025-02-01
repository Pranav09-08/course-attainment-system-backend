const db = require("../db/db");

// Find user by email (Faculty)
findUserByEmailFaculty = async (email) => {
  const [rows] = await db.query("SELECT * FROM Faculty WHERE email = ?", [email]);
  return rows.length > 0 ? rows[0] : null;
};

// Find user by email (Course Coordinator)
findUserByEmailCoordinator = async (email) => {
  const [rows] = await db.query("SELECT * FROM Course_Coordinator WHERE faculty_id = (SELECT faculty_id FROM Faculty WHERE email = ?)", [email]);
  return rows.length > 0 ? rows[0] : null;
};

// Find user by email (Department - Admin)
findUserByEmailDepartment = async (email) => {
  const [rows] = await db.query("SELECT * FROM Department WHERE email = ?", [email]);
  return rows.length > 0 ? rows[0] : null;
};

module.exports = { findUserByEmailFaculty, findUserByEmailCoordinator, findUserByEmailDepartment };
