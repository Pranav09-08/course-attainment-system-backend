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

module.exports = { insertStudents };
