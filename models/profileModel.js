const db = require('../db/db');

const getFacultyById = async (facultyId) => {
  const query = `
    SELECT f.*, up.profile_image_path 
    FROM Faculty f
    LEFT JOIN User_Profile up ON f.faculty_id = up.user_id AND up.user_role = 'faculty'
    WHERE f.faculty_id = ?`;
  const [results] = await db.query(query, [facultyId]);
  return results[0] || null;
};

const getAdminById = async (adminId) => {
  const query = `
    SELECT d.*, up.profile_image_path 
    FROM Department d
    LEFT JOIN User_Profile up ON d.dept_id = up.user_id AND up.user_role = 'admin'
    WHERE d.dept_id = ?`;
  const [results] = await db.query(query, [adminId]);
  return results[0] || null;
};

const getCoordinatorById = async (facultyId) => {
  const query = `
    SELECT f.*, up.profile_image_path
    FROM Course_Coordinator cc
    JOIN Faculty f ON cc.faculty_id = f.faculty_id
    LEFT JOIN User_Profile up ON f.faculty_id = up.user_id AND up.user_role = 'faculty'
    WHERE cc.faculty_id = ?`;
  const [results] = await db.query(query, [facultyId]);
  return results[0] || null;
};

// Keep the getFacultyByDept function
const getFacultyByDept = async (deptId) => {
  const query = `
    SELECT f.*, up.profile_image_path
    FROM Faculty f
    LEFT JOIN User_Profile up ON f.faculty_id = up.user_id AND up.user_role = 'faculty'
    WHERE f.dept_id = ?`;
  const [results] = await db.query(query, [deptId]);
  return results;
};

module.exports = {
  getFacultyById,
  getAdminById,
  getCoordinatorById,
  getFacultyByDept  // Make sure this is exported
};


