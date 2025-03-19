const db = require('../../db/db');

// Function to fetch students based on class, dept_id, and academic_yr
const getStudentsByClassDeptYear = async (studentClass, dept_id, academic_yr) => {
  try {
    const query = `
      SELECT roll_no, name 
      FROM Student 
      WHERE class = ? AND dept_id = ? AND academic_yr = ?;
    `;

    console.log("Fetching students with query:", query);
    console.log("Parameters:", [studentClass, dept_id, academic_yr]);

    const [students] = await db.execute(query, [studentClass, dept_id, academic_yr]);
    console.log("Students fetched:", students);

    return students;
  } catch (error) {
    console.error("Error in getStudentsByClassDeptYear:", error);
    throw error;
  }
};

// Function to fetch marks based on class, dept_id, academic_yr, and course_id
const getMarksByClassDeptYearCourse = async (studentClass, dept_id, academic_yr, course_id) => {
  try {
    // Step 1: Fetch students based on class, dept_id, and academic_yr
    const studentsQuery = `
      SELECT roll_no 
      FROM Student 
      WHERE class = ? AND dept_id = ? AND academic_yr = ?;
    `;
    console.log("Fetching students with query:", studentsQuery);
    console.log("Parameters:", [studentClass, dept_id, academic_yr]);

    const [students] = await db.execute(studentsQuery, [studentClass, dept_id, academic_yr]);
    console.log("Students fetched:", students);

    if (students.length === 0) {
      console.log("No students found for the given criteria.");
      return []; // No students found, return empty array
    }

    // Extract roll numbers from the students
    const rollNumbers = students.map(student => student.roll_no);
    console.log("Roll numbers:", rollNumbers);

    // Step 2: Dynamically generate the IN clause for roll numbers
    const placeholders = rollNumbers.map(() => '?').join(','); // Create placeholders for each roll number
    const marksQuery = `
      SELECT roll_no, course_id, u1_co1, u1_co2, u2_co3, u2_co4, u3_co5, u3_co6, i_co1, i_co2, end_sem, final_sem 
      FROM Marks 
      WHERE roll_no IN (${placeholders}) AND course_id = ? AND academic_yr = ? AND dept_id = ?;
    `;

    // Combine rollNumbers, course_id, academic_yr, and dept_id into a single array for the query
    const queryParams = [...rollNumbers, course_id, academic_yr, dept_id];
    console.log("Fetching marks with query:", marksQuery);
    console.log("Parameters:", queryParams);

    // Execute the query
    const [marks] = await db.execute(marksQuery, queryParams);
    console.log("Marks fetched:", marks);

    return marks;
  } catch (error) {
    console.error("Error in getMarksByClassDeptYearCourse:", error);
    throw error;
  }
};

module.exports = { getStudentsByClassDeptYear, getMarksByClassDeptYearCourse };