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


// Function to update a student (name, email, and mobile_no)
const updateStudent = async (roll_no, updatedData) => {
  const query = `
    UPDATE Student
    SET 
      name = ?,
      email = ?,
      mobile_no = ?
    WHERE roll_no = ?;
  `;

  const values = [
    updatedData.name,
    updatedData.email,
    updatedData.mobile_no,
    roll_no, // Old roll_no (to identify the student)
  ];

  const [result] = await db.query(query, values);
  return result;
};

// Function to delete a student by roll_no
const deleteStudent = async (roll_no) => {
  const query = `
    DELETE FROM Student
    WHERE roll_no = ?;
  `;

  const [result] = await db.query(query, [roll_no]);
  return result;
};


module.exports = { insertStudents, fetchStudentsByDepartment, updateStudent, deleteStudent };

