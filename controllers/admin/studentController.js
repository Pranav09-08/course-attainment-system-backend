const { insertStudents, fetchStudentsByDepartment, updateStudent, deleteStudent } = require("../../models/admin/studentModel");

const uploadStudents = async (req, res) => {
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  // }

  try {
    const { students, sem, academic_yr } = req.body;

    // Validate inputs
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: "Students data must be a non-empty array" });
    }
    
    if (!['odd', 'even'].includes(sem.toLowerCase())) {
      return res.status(400).json({ error: "Semester must be 'odd' or 'even'" });
    }
    
    if (!/^\d{4}_\d{2}$/.test(academic_yr)) {
      return res.status(400).json({ error: "Academic year must be in format YYYY_YY" });
    }

    // Validate each student
    const requiredFields = ["roll_no", "name", "class"];
    for (const student of students) {
      const missingFields = requiredFields.filter(field => !student[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Missing required fields: ${missingFields.join(", ")}`
        });
      }
      
      if (student.class === 'TE' && !student.el1) {
        return res.status(400).json({ error: "TE students must have el1 specified" });
      }
      
      if (student.class === 'BE' && (!student.el1 || !student.el2)) {
        return res.status(400).json({ error: "BE students must have both el1 and el2 specified" });
      }
    }

    // Insert students
    const result = await insertStudents(students, sem, academic_yr);
    
    const response = {
      message: `${result.insertedCount} students added to ${sem}_${academic_yr} table`,
      tableName: result.tableName,
      insertedCount: result.insertedCount
    };

    if (result.duplicateCount > 0) {
      response.warning = result.warning;
      response.duplicateCount = result.duplicateCount;
      response.duplicateRollNos = result.duplicateRollNos;
    }

    res.status(201).json(response);

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to upload students" 
    });
  }
};

// Get students
const getStudents = async (req, res) => {
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  // }

  try {
    const { dept_id, sem, academic_yr } = req.query;
    
    if (!dept_id || !sem || !academic_yr) {
      return res.status(400).json({ 
        error: "Department ID, semester and academic year are required" 
      });
    }

    const students = await fetchStudentsByDepartment(dept_id, sem, academic_yr);
    res.status(200).json(students);
    
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to fetch students" 
    });
  }
};

// Update student
const updateStudentController = async (req, res) => {
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  // }

  try {
    const { roll_no } = req.params;
    const { sem, academic_yr, ...updatedData } = req.body;
    
    if (!sem || !academic_yr) {
      return res.status(400).json({ 
        error: "Semester and academic year are required" 
      });
    }

    // Validate inputs
    if (updatedData.name && !/^[A-Za-z\s]+$/.test(updatedData.name)) {
      return res.status(400).json({ error: "Name must contain only letters and spaces" });
    }

    const result = await updateStudent(roll_no, updatedData, sem, academic_yr);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ 
      message: "Student updated successfully",
      affectedRows: result.affectedRows
    });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to update student" 
    });
  }
};

// Delete student
const deleteStudentController = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }

  try {
    const { roll_no } = req.params;
    const { sem, academic_yr } = req.query;
    
    if (!sem || !academic_yr) {
      return res.status(400).json({ 
        error: "Semester and academic year are required" 
      });
    }

    const result = await deleteStudent(roll_no, sem, academic_yr);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ 
      message: "Student deleted successfully",
      affectedRows: result.affectedRows
    });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to delete student" 
    });
  }
};

module.exports = { 
  uploadStudents, 
  getStudents, 
  updateStudentController, 
  deleteStudentController 
};