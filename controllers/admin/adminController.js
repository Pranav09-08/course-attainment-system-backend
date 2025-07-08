const Admin = require('../../models/admin/adminModel');
const bcrypt = require("bcryptjs"); // Make sure to import this
const db = require('../../db/db');

const generateFacultyId = async () => {
  const [rows] = await db.query(`
    SELECT faculty_id FROM Faculty 
    WHERE faculty_id LIKE 'emp%' 
    ORDER BY CAST(SUBSTRING(faculty_id, 4) AS UNSIGNED) DESC 
    LIMIT 1
  `);

  if (rows.length === 0) return 'emp1';

  const lastIdNum = parseInt(rows[0].faculty_id.replace('emp', ''), 10);
  return `emp${lastIdNum + 1}`;
};


// Add a new faculty member
const addFaculty = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }

  const { name, email, mobile_no, dept_id, password } = req.body;

  console.log(`📥 Request to add new faculty: ${name}, ${email}, Dept: ${dept_id}`);

  if (!name || !email || !mobile_no || !dept_id || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const faculty_id = await generateFacultyId(); // 👈 generate new ID
    // 🔐 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert faculty with hashed password
    const result = await Admin.createFaculty(faculty_id,name, email, mobile_no, dept_id, hashedPassword);

    console.log('✅ Faculty added successfully:', result);
    res.status(201).json({ message: 'Faculty added successfully',faculty_id});

  } catch (err) {
    console.error('❌ Error adding faculty:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update faculty details
const updateFaculty = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }
    const { faculty_id } = req.params;
    const { name, email, mobile_no, dept_id } = req.body;
  
    console.log(`📤 Request to update faculty: ${faculty_id}`);
  
    if (!name || !email || !mobile_no || !dept_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const result = await Admin.updateFaculty(faculty_id, name, email, mobile_no, dept_id);
  
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
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }
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
