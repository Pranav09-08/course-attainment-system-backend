const db = require('../../db/db');

// Function to fetch faculty by ID
const getFacultyById = async (facultyId) => {
  const query = 'SELECT faculty_id,course_id, class, sem, dept_id,academic_yr FROM Course_Allotment WHERE faculty_id = ?';
  const [results] = await db.query(query, [facultyId]);
  return results;
};


module.exports = { getFacultyById};
