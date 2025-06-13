const express = require('express');
const router = express.Router();
const profileController = require('../controllers/updateProfileController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../upload_image'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.put('/faculty/:id', profileController.updateFaculty);
router.put('/admin/:id', profileController.updateAdmin);
router.post('/upload/:id', upload.single('profile_image'), profileController.uploadProfileImage);

module.exports = router;