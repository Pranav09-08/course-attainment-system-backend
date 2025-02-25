const db = require('../../db/db');

// Function to fetch all faculty course allotments
const getFacultyById = async (facultyId) => {
  try {
    const query = `
      SELECT 
        c1.faculty_id, c1.course_id, c2.course_name, c1.class, c1.sem, 
        c1.dept_id, c1.academic_yr, d.dept_name
      FROM Course_Allotment c1
      JOIN Course c2 ON c1.course_id = c2.course_id
      JOIN Department d ON c1.dept_id = d.dept_id 
      WHERE c1.faculty_id = ?`;

    const [results] = await db.query(query, [facultyId]);
    return results || [];
  } catch (error) {
    console.error('Error fetching faculty details:', error);
    throw new Error('Database query failed');
  }
};

// Function to fetch faculty course allotments where attainment is not calculated (total is NULL)
const getFacultyWithNullAttainment = async (facultyId) => {
  try {
    const query = `
      SELECT 
        c1.faculty_id, c1.course_id, c2.course_name, c1.class, c1.sem, 
        c1.dept_id, c1.academic_yr, d.dept_name
      FROM Course_Allotment c1
      JOIN Course c2 ON c1.course_id = c2.course_id
      JOIN Department d ON c1.dept_id = d.dept_id
      LEFT JOIN Calculate_Attainment ca 
        ON c1.course_id = ca.course_id 
        AND c1.dept_id = ca.dept_id
        AND c1.academic_yr = ca.academic_yr
      WHERE c1.faculty_id = 1  
      AND (ca.total IS NULL OR ca.total = '');`;

    const [results] = await db.query(query, [facultyId]);  // Pass facultyId correctly
    return results || []; // Ensure an empty array is returned if no results
  } catch (error) {
    console.error('Error fetching faculty details with NULL total:', error);
    throw new Error('Database query failed');
  }
};



module.exports = { getFacultyById, getFacultyWithNullAttainment };
