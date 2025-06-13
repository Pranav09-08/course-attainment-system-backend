const Faculty = require('../models/profileModel');

const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.getFacultyById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.json(faculty);
  } catch (err) {
    console.error('Error fetching faculty:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAdmin = async (req, res) => {
  try {
    const admin = await Faculty.getAdminById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    console.error('Error fetching admin:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCoordinator = async (req, res) => {
  try {
    const coordinator = await Faculty.getCoordinatorById(req.params.id);
    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator not found' });
    }
    res.json(coordinator);
  } catch (err) {
    console.error('Error fetching coordinator:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Keep the getFacultyByDepartment function
const getFacultyByDepartment = async (req, res) => {
  try {
    const facultyList = await Faculty.getFacultyByDept(req.params.deptId);
    if (facultyList.length === 0) {
      return res.status(404).json({ message: 'No faculty found for this department' });
    }
    res.json(facultyList);
  } catch (err) {
    console.error('Error fetching faculty by department:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getFaculty,
  getAdmin,
  getCoordinator,
  getFacultyByDepartment  // Make sure this is exported
};