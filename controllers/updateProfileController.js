const profileModel = require('../models/updateProfileModel');
const path = require('path');

const updateFaculty = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const updatedFaculty = await profileModel.updateFacultyProfile(
      req.params.id, 
      { name, email }
    );
    res.json(updatedFaculty);
  } catch (err) {
    console.error('Error updating faculty:', err);
    res.status(500).json({ error: 'Failed to update faculty profile' });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { dept_name, email } = req.body;
    if (!dept_name || !email) {
      return res.status(400).json({ error: 'Department name and email are required' });
    }

    const updatedAdmin = await profileModel.updateAdminProfile(
      req.params.id,
      { dept_name, email }
    );
    res.json(updatedAdmin);
  } catch (err) {
    console.error('Error updating admin:', err);
    res.status(500).json({ error: 'Failed to update admin profile' });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = `/upload_image/${req.file.filename}`;
    const result = await profileModel.updateProfileImage(
      req.params.id,
      req.body.user_role,
      imagePath
    );

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      imagePath: result.imagePath
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
};

module.exports = {
  updateFaculty,
  updateAdmin,
  uploadProfileImage
};