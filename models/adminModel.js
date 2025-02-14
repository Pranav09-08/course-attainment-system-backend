const db = require('../db/db');

// Function to add a new faculty member with manually provided faculty_id
const createFaculty = async (faculty_id, name, email, mobile_no, dept_id, password) => {
  const query = `
    INSERT INTO Faculty (faculty_id, name, email, mobile_no, dept_id, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [faculty_id, name, email, mobile_no, dept_id, password]);
  return result;
};

// Function to update faculty details
const updateFaculty = async (faculty_id, name, email, mobile_no, dept_id, password) => {
  const query = `
    UPDATE Faculty 
    SET name = ?, email = ?, mobile_no = ?, dept_id = ?, password = ?
    WHERE faculty_id = ?
  `;
  const [result] = await db.query(query, [name, email, mobile_no, dept_id, password, faculty_id]);
  return result;
};

// Function to delete faculty
const deleteFaculty = async (faculty_id) => {
  const query = `DELETE FROM Faculty WHERE faculty_id = ?`;
  const [result] = await db.query(query, [faculty_id]);
  return result;
};

// Function to get coordinators of a particular department with course details
const getCoordinatorsByDepartment = async (deptId) => {
  const query = `
    SELECT 
        f.faculty_id, 
        f.name, 
        f.email, 
        f.mobile_no, 
        cc.academic_yr,
        cc.course_id,
        c.course_name,
        cc.class
    FROM Faculty f
    JOIN Course_Coordinator cc ON f.faculty_id = cc.faculty_id
    JOIN Course c ON cc.course_id = c.course_id
    WHERE f.dept_id = ?
    ORDER BY cc.academic_yr ASC;
  `;
  
  const [rows] = await db.query(query, [deptId]);
  return rows;
};
module.exports = { createFaculty, updateFaculty, deleteFaculty, getCoordinatorsByDepartment};
