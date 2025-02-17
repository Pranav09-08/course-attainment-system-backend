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
  console.log("📥 Request received for Faculty ID:", facultyId);  // Debug log

  const [rows] = await db.query(`
    SELECT 
      f.name AS name, 
      f.email AS email,
      f.dept_id AS dept_id,
      f.faculty_id AS faculty_id
    FROM 
      Course_Coordinator cc
    JOIN 
      Faculty f ON cc.faculty_id = f.faculty_id
    WHERE 
      cc.faculty_id = ?
  `, [facultyId]);

  console.log("✅ Query Result:", rows);  // Debug query result

  return rows.length > 0 ? rows[0] : null;
};

// Function to fetch all faculty by department ID
const getFacultyByDept = async (deptId) => {
  const query = 'SELECT faculty_id, name, email, mobile_no, password FROM Faculty WHERE dept_id = ?';
  const [results] = await db.query(query, [deptId]);  // Ensure the query is correct and db connection works
  return results;
};

module.exports = { getFacultyById,getAdminById,getCoordinatorById,getFacultyByDept };
