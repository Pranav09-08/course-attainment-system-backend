const db = require('../../db/db');

// Function to insert multiple students
const insertStudents = async (students) => {
  const query = `
    INSERT INTO Student (roll_no, name, email, mobile_no, class, status, dept_id, academic_yr)
    VALUES ?
  `;

  const values = students.map(student => [
    student.roll_no,
    student.name,
    student.email,
    student.mobile_no,
    student.class,
    student.status,
    student.dept_id,
    student.academic_yr
  ]);

  const [result] = await db.query(query, [values]);
  return result;
};

// Function to fetch students by department
const fetchStudentsByDepartment = async (dept_id) => {
    const query = `
      SELECT 
        s.roll_no, 
        s.name, 
        s.email, 
        s.mobile_no, 
        s.class, 
        d.dept_name, 
        s.academic_yr
      FROM Student s
      JOIN Department d ON s.dept_id = d.dept_id
      WHERE s.dept_id = ?;
    `;
  
    const [students] = await db.query(query, [dept_id]);
    return students;
  };

module.exports = { insertStudents,fetchStudentsByDepartment };
