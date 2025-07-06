const fs = require('fs');
const path = require('path');
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

// ✅ UPDATED FUNCTION: Update and replace profile image
const updateProfileImage = async (userId, userRole, newImagePath, email) => {
  const [existing] = await db.query(
    'SELECT profile_image_path FROM User_Profile WHERE user_id = ? AND user_role = ?',
    [userId, userRole]
  );

  if (existing.length > 0) {
    const oldImagePath = existing[0].profile_image_path;

    // Delete old image from upload_image folder if it exists
    if (oldImagePath) {
      const fullOldPath = path.join(__dirname, '..', oldImagePath);
      if (fs.existsSync(fullOldPath)) {
        fs.unlinkSync(fullOldPath);
        console.log('✅ Old image deleted:', fullOldPath);
      }
    }

    // Update with new image path
    await db.query(
      'UPDATE User_Profile SET profile_image_path = ?, updated_at = NOW() WHERE user_id = ? AND user_role = ?',
      [newImagePath, userId, userRole]
    );
  } else {
    // Insert new record
    await db.query(
      'INSERT INTO User_Profile (user_id, user_role, email, profile_image_path) VALUES (?, ?, ?, ?)',
      [userId, userRole, email, newImagePath]
    );
  }

  return { success: true, imagePath: newImagePath };
};

module.exports = {
  updateFacultyProfile,
  updateAdminProfile,
  updateProfileImage
};
