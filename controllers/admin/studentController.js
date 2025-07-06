const {insertStudents,fetchStudentsByDepartment,updateStudent,deleteStudent} = require("../../models/admin/studentModel");

// Upload students via JSON (not file)
const uploadStudents = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }

  try {
    const { students } = req.body;

    // Validate input: Ensure students is a non-empty array
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: "Invalid input: students must be a non-empty array" });
    }

    // Validate each student object
    const requiredFields = ["roll_no", "name", "email", "mobile_no", "class", "academic_yr", "dept_id"];
    for (const student of students) {
      const missingFields = requiredFields.filter((field) => !student[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Missing required fields for student: ${missingFields.join(", ")}`,
        });
      }
    }

    // Insert students into the database
    await insertStudents(students);

    res.status(201).json({ message: "✅ Students added successfully!" });
  } catch (err) {
    console.error("❌ Error inserting students:", err);

    if (err.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ error: "Duplicate entry: A student with the same roll number already exists." });
    }

    if (err.name === "ValidationError") {
      // Mongoose validation error
      return res.status(400).json({ error: `Validation Error: ${err.message}` });
    }

    // Handle generic errors
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};


const getStudents = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }

    try {
      const { dept_id } = req.query; // Get dept_id from query parameters
  
      if (!dept_id) {
        return res.status(400).json({ message: "Department ID is required" });
      }
  
      const students = await fetchStudentsByDepartment(dept_id);
      return res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Update a student (only name, email, and mobile_no)
  const updateStudentController = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }

    const { roll_no } = req.params; // Get old roll_no from URL params
    const { name, email, mobile_no } = req.body; // Get updated data from request body
  
    // Validate roll_no
    if (!Number.isInteger(Number(roll_no))) {
      return res.status(400).json({ error: "Roll number must be an integer." });
    }
  
    // Validate name (only alphabets and spaces)
    if (name && !/^[A-Za-z\s]+$/.test(name)) {
      return res.status(400).json({ error: "Name must contain only alphabets and spaces." });
    }
  
    // Validate email (valid email format)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
  
    // Validate mobile_no (exactly 10 digits)
    if (mobile_no && !/^\d{10}$/.test(mobile_no)) {
      return res.status(400).json({ error: "Mobile number must be exactly 10 digits." });
    }
  
    try {
      // Construct the updatedData object
      const updatedData = {
        name,
        email,
        mobile_no,
      };
  
      // Update the student in the database
      const result = await updateStudent(roll_no, updatedData);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Student not found." });
      }
  
      res.status(200).json({ message: "✅ Student updated successfully!" });
    } catch (err) {
      console.error("❌ Error updating student:", err);
  
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Duplicate entry: A student with the same email or mobile number already exists." });
      }
  
      res.status(500).json({ error: "Internal Server Error. Please try again later." });
    }
  };

  // Delete a student by roll_no
const deleteStudentController = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }

  const { roll_no } = req.params; // Get roll_no from URL params

  // Validate roll_no
  if (!Number.isInteger(Number(roll_no))) {
    return res.status(400).json({ error: "Roll number must be an integer." });
  }

  try {
    // Delete the student from the database
    const result = await deleteStudent(roll_no);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json({ message: "✅ Student deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting student:", err);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};

  
module.exports = { uploadStudents,getStudents, updateStudentController, deleteStudentController};
