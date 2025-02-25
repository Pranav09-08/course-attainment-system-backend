const Faculty = require('../../models/faculty/courseAllotmentModel');

// Controller to get all faculty course allotments
const getFaculty = async (req, res) => {
  const facultyId = req.params.id;

  if (!Number.isInteger(Number(facultyId))) {
    return res.status(400).json({ message: 'Invalid Faculty ID' });
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

  if (!Number.isInteger(Number(facultyId))) {
    return res.status(400).json({ message: 'Invalid Faculty ID' });
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

module.exports = { getFaculty, getFacultyWithNullAttainment };
