const Admin = require('../models/adminModel');

// Add a new faculty member
const addFaculty = async (req, res) => {
  const { faculty_id, name, email, mobile_no, dept_id, password } = req.body;

  console.log(`📥 Request to add new faculty: ${faculty_id}, ${name}, ${email}, Dept: ${dept_id}`);

  if (!faculty_id || !name || !email || !mobile_no || !dept_id || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert faculty into the database
    const result = await Admin.createFaculty(faculty_id, name, email, mobile_no, dept_id, password);

    console.log('✅ Faculty added successfully:', result);
    res.status(201).json({ message: 'Faculty added successfully', faculty_id });

  } catch (err) {
    console.error('❌ Error adding faculty:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update faculty details
const updateFaculty = async (req, res) => {
    const { faculty_id } = req.params;
    const { name, email, mobile_no, dept_id, password } = req.body;
  
    console.log(`📤 Request to update faculty: ${faculty_id}`);
  
    if (!name || !email || !mobile_no || !dept_id || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const result = await Admin.updateFaculty(faculty_id, name, email, mobile_no, dept_id, password);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
  
      console.log(`✅ Faculty ${faculty_id} updated successfully`);
      res.status(200).json({ message: 'Faculty updated successfully' });
  
    } catch (err) {
      console.error('❌ Error updating faculty:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Delete faculty details
const deleteFaculty = async (req, res) => {
    const { faculty_id } = req.params;
  
    console.log(`🗑️ Request to delete faculty: ${faculty_id}`);
  
    try {
      const result = await Admin.deleteFaculty(faculty_id);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
  
      console.log(`✅ Faculty ${faculty_id} deleted successfully`);
      res.status(200).json({ message: 'Faculty deleted successfully' });
  
    } catch (err) {
      console.error('❌ Error deleting faculty:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Get coordinators for the admin's department
const getCoordinatorsByDepartment = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Only admin can access this." });
      }
  
      const dept_id = req.user.id; // Admin's department ID
  
      console.log(`📤 Fetching coordinators for department: ${dept_id}`);
  
      const coordinators = await Admin.getCoordinatorsByDepartment(dept_id);
  
      res.status(200).json({ coordinators });
    } catch (err) {
      console.error("❌ Error fetching coordinators:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { addFaculty, updateFaculty, deleteFaculty, getCoordinatorsByDepartment};
