// controllers/updateMarksController.js
const Marks = require("../../models/faculty/updateMarksModel");

// Fetch marks for a specific student, course, department, and academic year
const getMarks = async (req, res) => {
  const { roll_no, course_id, dept_id, academic_yr } = req.params;

  try {
    const marks = await Marks.getMarksByCriteria(roll_no, course_id, dept_id, academic_yr);
    if (!marks) {
      return res.status(404).json({ message: "Marks not found" });
    }
    res.status(200).json(marks);
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update marks for a specific student, course, department, and academic year
const updateMarks = async (req, res) => {
  const { roll_no, course_id, dept_id, academic_yr } = req.params;
  const {
    u1_co1,
    u1_co2,
    u2_co3,
    u2_co4,
    u3_co5,
    u3_co6,
    i_co1,
    i_co2,
    end_sem,
  } = req.body;

  try {
    await Marks.updateMarksByCriteria(
      roll_no,
      course_id,
      dept_id,
      academic_yr,
      u1_co1,
      u1_co2,
      u2_co3,
      u2_co4,
      u3_co5,
      u3_co6,
      i_co1,
      i_co2,
      end_sem
    );
    res.status(200).json({ message: "Marks updated successfully" });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getMarks, updateMarks };