const db = require('../db/db');

// Function to fetch faculty by ID
const getFacultyById = async (facultyId) => {
  const query = 'SELECT faculty_id, name, email, mobile_no, dept_id FROM Faculty WHERE faculty_id = ?';
  const [results] = await db.query(query, [facultyId]);
  return results;
};

const getAdminById = async (adminId) => {
  const query = 'SELECT dept_id, dept_name, email FROM Department WHERE dept_id = ?';
  const [results] = await db.query(query, [adminId]);
  return results;
};

const getCoordinatorById = async (facultyId) => {
  const query = 'SELECT faculty_id, dept_id FROM Course_Coordinator WHERE faculty_id = ?';
  const [results] = await db.query(query, [facultyId]);
  return results;
};

module.exports = { getFacultyById,getAdminById,getCoordinatorById };
