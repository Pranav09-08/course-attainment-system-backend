
const Faculty = require('../../models/faculty/courseAllotmentModel');

// Handle GET request for faculty by ID
const getFaculty = async (req, res) => {
  const facultyId = req.params.id;
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