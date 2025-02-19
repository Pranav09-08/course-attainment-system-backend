const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Marks = require('../../models/faculty/marksModel');

// Upload and process Excel file
const uploadMarks = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      const marksData = [
        row.roll_no,
        row.course_id,
        row.u1_co1, row.u1_co2, row.u2_co3, row.u2_co4,
        row.u3_co5, row.u3_co6, row.i_co1, row.i_co2,
        row.end_sem, row.final_sem, row.academic_yr, row.sem
      ];

      await Marks.saveMarks(marksData);
    }

    fs.unlinkSync(filePath); // Delete file after processing
    res.json({ message: 'Marks uploaded successfully' });

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { uploadMarks };
