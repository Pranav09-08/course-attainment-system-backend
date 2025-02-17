const db = require('../db/db');
const Faculty = require('../models/profileModel');

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

    console.log('✅ Faculty found:', results[0]);
    res.json(results[0]);

  } catch (err) {
    console.error('❌ Error fetching faculty:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Handle GET request for admin by ID
const getAdmin = async (req, res) => {
  const adminId = req.params.id;
  console.log(`📥 Request received for Admin ID: ${adminId}`);

  try {
    
    // Fetch faculty using the model
    const results = await Faculty.getAdminById(adminId);

    if (results.length === 0) {
      console.log('❗ Faculty not found');
      return res.status(404).json({ message: 'Faculty not found' });
    }

    console.log('✅ Faculty found:', results[0]);
    res.json(results[0]);

  } catch (err) {
    console.error('❌ Error fetching faculty:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Handle GET request for Coordinator by ID
const getCoordinator = async (req, res) => {
  const facultyId = req.params.id;
  console.log(`📥 Request received for Faculty ID: ${facultyId}`);

  try {

    // Fetch faculty using the model
    const results = await Faculty.getCoordinatorById(facultyId);

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

// Handle GET request for all faculty by department ID
const getFacultyByDepartment = async (req, res) => {
  const deptId = req.params.deptId; // Extract dept_id from request params
  console.log(`📥 Request received for Faculty List of Dept ID: ${deptId}`);

  try {
    // Fetch faculty using the model
    const results = await Faculty.getFacultyByDept(deptId);

    if (results.length === 0) {
      console.log('❗ No faculty found for this department');
      return res.status(404).json({ message: 'No faculty found for this department' });
    }

    console.log('✅ Faculty list retrieved:', results);  // Check if 'password' is included in the results
    res.json(results);

  } catch (err) {
    console.error('❌ Error fetching faculty:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = { getFaculty,getAdmin,getCoordinator,getFacultyByDepartment};
