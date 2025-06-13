const db = require('../db/db');

// Function to update faculty profile
const updateFacultyProfile = async (facultyId, updates) => {
  const { name, email } = updates;
  const query = 'UPDATE Faculty SET name = ?, email = ? WHERE faculty_id = ?';
  await db.query(query, [name, email, facultyId]);
  return { faculty_id: facultyId, name, email };
};

// Function to update admin profile
const updateAdminProfile = async (deptId, updates) => {
  const { dept_name, email } = updates;
  const query = 'UPDATE Department SET dept_name = ?, email = ? WHERE dept_id = ?';
  await db.query(query, [dept_name, email, deptId]);
  return { dept_id: deptId, dept_name, email };
};

// Add this function to handle profile image updates
const updateProfileImage = async (userId, userRole, imagePath) => {
  // Check if profile exists
  const [existing] = await db.query(
    'SELECT * FROM User_Profile WHERE user_id = ? AND user_role = ?',
    [userId, userRole]
  );

  if (existing.length > 0) {
    // Update existing record
    await db.query(
      'UPDATE User_Profile SET profile_image_path = ?, updated_at = NOW() WHERE user_id = ? AND user_role = ?',
      [imagePath, userId, userRole]
    );
  } else {
    // Create new record
    await db.query(
      'INSERT INTO User_Profile (user_id, user_role, profile_image_path) VALUES (?, ?, ?)',
      [userId, userRole, imagePath]
    );
  }

  return { success: true, imagePath };
};

module.exports = {
  updateFacultyProfile,
  updateAdminProfile,
  updateProfileImage  // Add this to your exports
};
