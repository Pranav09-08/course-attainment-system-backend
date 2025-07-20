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

const findOTPEntry = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM password_resets WHERE email = ?",
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Delete OTP after use or expiry
const deleteOTPEntry = async (email) => {
  await db.query("DELETE FROM password_resets WHERE email = ?", [email]);
};

// 🔄 Update Password
const updateFacultyPassword = async (email, hashedPassword) => {
  const [rows] = await db.query("UPDATE Faculty SET password = ? WHERE email = ?", [hashedPassword, email]);
  return rows;
};

module.exports = { findUserByEmailFaculty, findUserByFacultyId, findUserByDeptId,updateFacultyPassword,findOTPEntry,
  deleteOTPEntry, };
