const db = require("../../db/db");

const allotCourse = async (courseData) => {
  const {
    course_id,
    faculty_id,
    class: classNames, // array of divisions like ["TE10", "TE11"]
    sem,
    dept_id,
    academic_yr,
  } = courseData;

  try {
    // 🔍 Validate Fields
    if (!course_id) throw new Error("course_id is required");
    if (!faculty_id) throw new Error("faculty_id is required");
    if (!Array.isArray(classNames) || classNames.length === 0) {
      throw new Error("At least one class must be provided");
    }
    if (!sem) throw new Error("sem is required");
    if (!dept_id) throw new Error("dept_id is required");
    if (!academic_yr) throw new Error("academic_yr is required");

    // 🔍 Validate Types
    if (typeof course_id !== "string")
      throw new Error("course_id must be a string");
    if (typeof faculty_id !== "string")
      throw new Error("faculty_id must be a string");
    if (typeof sem !== "string")
      throw new Error("sem must be a string");
    if (typeof dept_id !== "number")
      throw new Error("dept_id must be a number");
    if (typeof academic_yr !== "string")
      throw new Error("academic_yr must be a string");

    // 🔍 Faculty Exists?
    const [faculty] = await db.query(
      `SELECT * FROM Faculty WHERE faculty_id = ?`,
      [faculty_id]
    );
    if (faculty.length === 0) {
      throw new Error("Faculty ID does not exist");
    }

    const inserted = [];
    const skipped = [];

    for (const division of classNames) {
      const [existing] = await db.query(
        `SELECT * FROM Course_Allotment WHERE course_id = ? AND faculty_id = ? AND academic_yr = ? AND class = ?`,
        [course_id, faculty_id, academic_yr, division]
      );

      if (existing.length > 0) {
        skipped.push(division);
        continue;
      }

      const [result] = await db.query(
        `INSERT INTO Course_Allotment (course_id, faculty_id, class, sem, dept_id, academic_yr)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [course_id, faculty_id, division, sem, dept_id, academic_yr]
      );

      inserted.push({ id: result.insertId, division });
    }

    return { inserted, skipped };
  } catch (err) {
    throw err;
  }
};


//function to get all alloted courses
const getAllottedCourses = async (dept_id) => {
  try {
    const query = `
           SELECT 
            ca.course_id, 
            c.course_name, 
            ca.faculty_id, 
            f.name AS faculty_name, 
            ca.class, 
            ca.sem, 
            ca.academic_yr
            FROM Course_Allotment ca
            JOIN Course c ON ca.course_id = c.course_id
            JOIN Faculty f ON ca.faculty_id = f.faculty_id
            WHERE ca.dept_id = ?;  -- Use ca.dept_id instead of c.dept_id
        `;

    const [rows] = await db.query(query, [dept_id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

//function to update the course allotment
const updateCourseAllotmentFaculty = async (
  courseId,
  academicYr,
  sem,
  newFacultyId
) => {
  try {
    // 🔍 Validate Input
    if (!courseId || !academicYr || !sem || !newFacultyId) {
      throw new Error(
        "courseId, academicYr, sem, and newFacultyId are required"
      );
    }

    // 🔍 Validate Data Types
    if (typeof courseId !== "string")
      throw new Error("courseId must be a string");
    if (typeof academicYr !== "string")
      throw new Error("academicYr must be a string");
    if (typeof sem !== "string") throw new Error("sem must be a string");
    if (typeof newFacultyId !== "string")
      throw new Error("newFacultyId must be a number");

    // 🔍 Check if the course allotment exists
    const [allotment] = await db.query(
      `SELECT * FROM Course_Allotment WHERE course_id = ? AND academic_yr = ? AND sem = ?`,
      [courseId, academicYr, sem]
    );
    if (!allotment.length) {
      throw new Error(
        "Course allotment not found for the given courseId, academicYr, and sem"
      );
    }

    // 🔍 Check if the new faculty exists
    const [faculty] = await db.query(
      `SELECT * FROM Faculty WHERE faculty_id = ?`,
      [newFacultyId]
    );
    if (!faculty.length) {
      throw new Error("New faculty ID does not exist");
    }

    // 🔍 Check if the new faculty is already assigned to the same course in the same academic year and semester
    const [existing] = await db.query(
      `SELECT * FROM Course_Allotment WHERE course_id = ? AND faculty_id = ? AND academic_yr = ? AND sem = ?`,
      [courseId, newFacultyId, academicYr, sem]
    );
    if (existing.length) {
      throw new Error(
        "New faculty is already assigned to this course for the given academic year and semester"
      );
    }

    // ✅ Update faculty_id
    const [result] = await db.query(
      `UPDATE Course_Allotment SET faculty_id = ? WHERE course_id = ? AND academic_yr = ? AND sem = ?`,
      [newFacultyId, courseId, academicYr, sem]
    );

    if (result.affectedRows === 0) {
      throw new Error("Failed to update faculty ID");
    }

    return { courseId, academicYr, sem, newFacultyId };
  } catch (err) {
    throw err;
  }
};

const deleteCourseAllotment = async (courseId, academicYr, sem) => {
  try {
    // Validate input
    if (!courseId || !academicYr || !sem) {
      throw new Error("courseId, academicYr, and sem are required");
    }

    // Delete the course allotment
    const [result] = await db.query(
      `DELETE FROM Course_Allotment WHERE course_id = ? AND academic_yr = ? AND sem = ?`,
      [courseId, academicYr, sem]
    );

    if (result.affectedRows === 0) {
      throw new Error("Course allotment not found");
    }

    return { courseId, academicYr, sem };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  allotCourse,
  getAllottedCourses,
  updateCourseAllotmentFaculty,
  deleteCourseAllotment,
};
