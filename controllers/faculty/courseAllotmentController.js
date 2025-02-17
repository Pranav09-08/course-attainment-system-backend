const Faculty = require('../../models/faculty/courseAllotmentModel');

const getFaculty = async (req, res) => {
  const facultyId = req.params.id;

  // Validate facultyId to be a number
  if (!Number.isInteger(Number(facultyId))) {
    return res.status(400).json({ message: 'Invalid Faculty ID' });
  }

  console.log(`📥 Request received for Faculty ID: ${facultyId}`);

  try {
    // Fetch faculty using the model
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

module.exports = { getFaculty };
