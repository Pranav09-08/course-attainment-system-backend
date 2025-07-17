const Faculty = require('../../models/faculty/allotedCourseModel');

// Controller to get all faculty course allotments
const getFaculty = async (req, res) => {
  const facultyId = req.params.id;

  if (!facultyId) {
  return res.status(400).json({ message: 'Faculty ID is required' });
}

  console.log(`📥 Request received for Faculty ID: ${facultyId}`);

  try {
    const results = await Faculty.getFacultyById(facultyId);

    if (results.length === 0) {
      console.log('❗ Faculty not found');
      return res.status(404).json({ message: 'Faculty not found' });
    }

    console.log('✅ Faculty found:', results);
    res.json(results);

  } catch (err) {
    console.error('❌ Error fetching faculty:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get faculty course allotments where attainment is NOT calculated
const getFacultyWithNullAttainment = async (req, res) => {
  const facultyId = req.params.id;

  if (!facultyId) {
  return res.status(400).json({ message: 'Faculty ID is required' });
}

  console.log(`📥 Fetching faculty courses with NULL attainment for Faculty ID: ${facultyId}`);

  try {
    const results = await Faculty.getFacultyWithNullAttainment(facultyId);

    if (results.length === 0) {
      console.log('❗ No courses found where attainment is NULL');
      return res.status(404).json({ message: 'No pending attainment records' });
    }

    console.log('✅ Courses with NULL attainment:', results);
    res.json(results);

  } catch (err) {
    console.error('❌ Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getFacultiesForCourse = async (req, res) => {
  const { course_id, academic_yr, dept_id } = req.query;

  if (!course_id || !academic_yr || !dept_id) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const faculties = await Faculty.getFacultiesForCourse(course_id, academic_yr, dept_id);
    res.json({ faculties });
  } catch (err) {
    console.error("Error in getFacultiesForCourse controller:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getFaculty, getFacultyWithNullAttainment,getFacultiesForCourse};
