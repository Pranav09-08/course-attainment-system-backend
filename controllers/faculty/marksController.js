const Marks = require("../../models/faculty/marksModel");
const csv = require("csv-parser");
const fs = require("fs");

const uploadMarks = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { course_id, academic_yr, sem, class: studentClass,dept_id } = req.body;
  if (!course_id || !academic_yr || !sem || !studentClass || !dept_id) {
    return res.status(400).json({ message: "Missing course_id, academic_yr, sem, or class or dept_id" });
  }

  console.log(`📥 Received CSV file: ${req.file.filename}`);
  console.log(`🔹 Course ID: ${course_id}, Academic Year: ${academic_yr}, Semester: ${sem}, Class: ${studentClass}, Dept Id: ${dept_id}`);

  const filePath = req.file.path;
  const marksData = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const validRow = {
        roll_no: row.roll_no,
        course_id,
        u1_co1: row.u1_co1 || null,
        u1_co2: row.u1_co2 || null,
        u2_co3: row.u2_co3 || null,
        u2_co4: row.u2_co4 || null,
        u3_co5: row.u3_co5 || null,
        u3_co6: row.u3_co6 || null,
        i_co1: row.i_co1 || null,
        i_co2: row.i_co2 || null,
        end_sem: row.end_sem || null,
        academic_yr,
        sem,
        dept_id,
      };
      marksData.push(validRow);
    })
    .on("end", async () => {
      try {
        console.log("✅ Parsed CSV successfully:", marksData.length, "records");
        const result = await Marks.insertOrUpdateMarks(marksData, studentClass, academic_yr, dept_id);

    
        fs.unlinkSync(filePath); // Delete file after processing
    
        if (result.success) {
          return res.status(201).json({ success: true, message: result.message });
        } else {
          return res.status(400).json({ success: false, message: result.message });
        }
      } catch (error) {
        console.error("❌ Database error:", error);
        fs.unlinkSync(filePath); // Ensure file is deleted even if an error occurs
        return res.status(500).json({ message: "Database error", error: error.message });
      }
    })
    
    .on("error", (error) => {
      console.error("❌ CSV Processing Error:", error);
      res.status(500).json({ message: "File processing error", error: error.message });
    });
};

module.exports = { uploadMarks };
